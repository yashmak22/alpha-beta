import logging
import time
import asyncio
import json
from typing import Dict, Any, Optional, List, Callable
import aiohttp
import jsonschema
from datetime import datetime

from modules.schemas.config import get_settings
from modules.schemas.tool_schema import ToolExecutionStatus, ToolSchema, AuthType
from modules.registry.services.registry_service import ToolRegistryService

logger = logging.getLogger("executor-service")
settings = get_settings()

class ToolExecutorService:
    def __init__(self):
        self.registry_service = ToolRegistryService()
        self.tool_implementations = {}
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default tool implementations"""
        # Import tool implementations
        from modules.connectors.web.search import search_web
        from modules.connectors.web.fetch import fetch_url
        
        # Register tools with their implementations
        self.register_tool_implementation("web.search", search_web)
        self.register_tool_implementation("web.fetch", fetch_url)
        
        logger.info("Registered default tool implementations")
    
    def register_tool_implementation(self, tool_id: str, implementation: Callable):
        """Register a tool implementation"""
        self.tool_implementations[tool_id] = implementation
        logger.info(f"Registered implementation for tool '{tool_id}'")
    
    async def execute_tool(
        self,
        tool_id: str,
        parameters: Dict[str, Any],
        auth_credentials: Optional[Dict[str, Any]] = None,
        execution_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute a tool with the provided parameters"""
        start_time = time.time()
        
        try:
            # Get tool definition from registry
            tool_def = self.registry_service.get_tool(tool_id)
            if not tool_def:
                return {
                    "tool_id": tool_id,
                    "status": ToolExecutionStatus.ERROR,
                    "error": f"Tool '{tool_id}' not found",
                    "execution_time": time.time() - start_time,
                    "timestamp": datetime.now().isoformat()
                }
            
            # Validate parameters against tool schema
            tool_schema = ToolSchema(**tool_def)
            validation_error = self._validate_parameters(tool_schema, parameters)
            if validation_error:
                return {
                    "tool_id": tool_id,
                    "status": ToolExecutionStatus.ERROR,
                    "error": f"Parameter validation failed: {validation_error}",
                    "execution_time": time.time() - start_time,
                    "timestamp": datetime.now().isoformat()
                }
            
            # Check authentication if required
            if tool_schema.auth_required:
                auth_error = self._validate_authentication(tool_schema, auth_credentials)
                if auth_error:
                    return {
                        "tool_id": tool_id,
                        "status": ToolExecutionStatus.UNAUTHORIZED,
                        "error": auth_error,
                        "execution_time": time.time() - start_time,
                        "timestamp": datetime.now().isoformat()
                    }
            
            # Get tool implementation
            if tool_id not in self.tool_implementations:
                return {
                    "tool_id": tool_id,
                    "status": ToolExecutionStatus.ERROR,
                    "error": f"No implementation found for tool '{tool_id}'",
                    "execution_time": time.time() - start_time,
                    "timestamp": datetime.now().isoformat()
                }
            
            # Execute tool with timeout
            implementation = self.tool_implementations[tool_id]
            timeout = tool_schema.timeout
            
            try:
                # Prepare execution context
                context = {
                    "auth_credentials": auth_credentials or {},
                    "execution_context": execution_context or {}
                }
                
                # Execute the tool with timeout
                result = await asyncio.wait_for(
                    implementation(parameters, context),
                    timeout=timeout
                )
                
                # Validate result against tool's return schema
                return_schema = tool_schema.returns
                # TODO: Implement result validation
                
                execution_time = time.time() - start_time
                return {
                    "tool_id": tool_id,
                    "status": ToolExecutionStatus.SUCCESS,
                    "result": result,
                    "execution_time": execution_time,
                    "timestamp": datetime.now().isoformat()
                }
            except asyncio.TimeoutError:
                return {
                    "tool_id": tool_id,
                    "status": ToolExecutionStatus.TIMEOUT,
                    "error": f"Execution timed out after {timeout} seconds",
                    "execution_time": time.time() - start_time,
                    "timestamp": datetime.now().isoformat()
                }
            except Exception as e:
                logger.error(f"Tool execution error for '{tool_id}': {e}")
                return {
                    "tool_id": tool_id,
                    "status": ToolExecutionStatus.ERROR,
                    "error": str(e),
                    "execution_time": time.time() - start_time,
                    "timestamp": datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Error in tool execution flow for '{tool_id}': {e}")
            return {
                "tool_id": tool_id,
                "status": ToolExecutionStatus.ERROR,
                "error": f"Internal execution error: {str(e)}",
                "execution_time": time.time() - start_time,
                "timestamp": datetime.now().isoformat()
            }
    
    def _validate_parameters(self, tool_schema: ToolSchema, parameters: Dict[str, Any]) -> Optional[str]:
        """Validate parameters against the tool schema"""
        try:
            # Check required parameters
            for param in tool_schema.parameters:
                if param.required and param.name not in parameters:
                    return f"Required parameter '{param.name}' is missing"
                
                # Check parameter type if present
                if param.name in parameters:
                    value = parameters[param.name]
                    
                    # Basic type validation
                    if param.type == "string" and not isinstance(value, str):
                        return f"Parameter '{param.name}' must be a string"
                    elif param.type == "number" and not isinstance(value, (int, float)):
                        return f"Parameter '{param.name}' must be a number"
                    elif param.type == "integer" and not isinstance(value, int):
                        return f"Parameter '{param.name}' must be an integer"
                    elif param.type == "boolean" and not isinstance(value, bool):
                        return f"Parameter '{param.name}' must be a boolean"
                    elif param.type == "array" and not isinstance(value, list):
                        return f"Parameter '{param.name}' must be an array"
                    elif param.type == "object" and not isinstance(value, dict):
                        return f"Parameter '{param.name}' must be an object"
                    
                    # Additional validations could be added here for ranges, patterns, etc.
            
            return None
        except Exception as e:
            logger.error(f"Parameter validation error: {e}")
            return f"Validation error: {str(e)}"
    
    def _validate_authentication(self, tool_schema: ToolSchema, auth_credentials: Optional[Dict[str, Any]]) -> Optional[str]:
        """Validate authentication credentials against the tool schema"""
        if not tool_schema.auth_required:
            return None
        
        if not auth_credentials:
            return "Authentication required but no credentials provided"
        
        auth_config = tool_schema.auth_config
        if not auth_config:
            return "Tool requires authentication but has no auth configuration"
        
        # Validate based on auth type
        if auth_config.type == AuthType.API_KEY:
            if not auth_config.api_key_config:
                return "API key configuration missing"
            
            header_name = auth_config.api_key_config.header_name
            if header_name not in auth_credentials:
                return f"API key header '{header_name}' not provided"
        
        elif auth_config.type == AuthType.OAUTH2:
            if not auth_config.oauth2_config:
                return "OAuth2 configuration missing"
            
            if "access_token" not in auth_credentials:
                return "OAuth2 access token not provided"
        
        elif auth_config.type == AuthType.BASIC:
            if "username" not in auth_credentials or "password" not in auth_credentials:
                return "Basic auth requires username and password"
        
        elif auth_config.type == AuthType.BEARER:
            if "token" not in auth_credentials:
                return "Bearer token not provided"
        
        # Auth validation passed
        return None
