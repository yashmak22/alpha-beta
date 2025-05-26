from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Any, Optional, Union, Literal
from enum import Enum
from datetime import datetime


class ParameterType(str, Enum):
    STRING = "string"
    NUMBER = "number"
    INTEGER = "integer"
    BOOLEAN = "boolean"
    OBJECT = "object"
    ARRAY = "array"
    NULL = "null"


class ToolParameter(BaseModel):
    """Schema for a tool parameter"""
    name: str = Field(..., description="Parameter name")
    type: ParameterType = Field(..., description="Parameter type")
    description: str = Field(..., description="Parameter description")
    required: bool = Field(False, description="Whether the parameter is required")
    default: Optional[Any] = Field(None, description="Default value if any")
    enum: Optional[List[Any]] = Field(None, description="Enumerated values if applicable")
    
    # For array type
    items: Optional[Dict[str, Any]] = Field(None, description="Schema for array items")
    
    # For object type
    properties: Optional[Dict[str, Any]] = Field(None, description="Schema for object properties")
    
    # For number/integer types
    minimum: Optional[float] = Field(None, description="Minimum value")
    maximum: Optional[float] = Field(None, description="Maximum value")
    
    # For string type
    pattern: Optional[str] = Field(None, description="Regex pattern")
    minLength: Optional[int] = Field(None, description="Minimum length")
    maxLength: Optional[int] = Field(None, description="Maximum length")
    format: Optional[str] = Field(None, description="Format, e.g., 'date', 'email'")


class AuthType(str, Enum):
    NONE = "none"
    API_KEY = "api_key"
    OAUTH2 = "oauth2"
    BASIC = "basic"
    BEARER = "bearer"


class OAuth2Config(BaseModel):
    """Configuration for OAuth2 authentication"""
    provider: str = Field(..., description="OAuth provider (e.g., 'google', 'github')")
    scopes: List[str] = Field(..., description="Required OAuth scopes")
    auth_url: HttpUrl = Field(..., description="Authorization URL")
    token_url: HttpUrl = Field(..., description="Token URL")


class ApiKeyConfig(BaseModel):
    """Configuration for API key authentication"""
    header_name: str = Field(..., description="Header name for API key")
    header_value_prefix: Optional[str] = Field(None, description="Prefix for header value")


class AuthConfig(BaseModel):
    """Authentication configuration for a tool"""
    type: AuthType = Field(..., description="Authentication type")
    oauth2_config: Optional[OAuth2Config] = Field(None, description="OAuth2 configuration")
    api_key_config: Optional[ApiKeyConfig] = Field(None, description="API key configuration")


class ToolCategory(str, Enum):
    WEB = "web"
    DATABASE = "database"
    CALENDAR = "calendar"
    EMAIL = "email"
    FILE = "file"
    UTILITY = "utility"
    CUSTOM = "custom"


class ToolSchema(BaseModel):
    """Schema for a tool definition"""
    id: str = Field(..., description="Unique tool identifier")
    name: str = Field(..., description="Human-readable tool name")
    description: str = Field(..., description="Tool description")
    version: str = Field(..., description="Tool version")
    category: ToolCategory = Field(..., description="Tool category")
    
    # Interface definition
    parameters: List[ToolParameter] = Field(..., description="Tool parameters")
    returns: Dict[str, Any] = Field(..., description="Return value schema")
    
    # Authentication
    auth_required: bool = Field(False, description="Whether authentication is required")
    auth_config: Optional[AuthConfig] = Field(None, description="Authentication configuration")
    
    # Execution settings
    timeout: int = Field(30, description="Execution timeout in seconds")
    rate_limit: Optional[int] = Field(None, description="Rate limit per minute")
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.now, description="Last update timestamp")
    created_by: Optional[str] = Field(None, description="Creator ID")
    icon: Optional[str] = Field(None, description="Icon URL or base64 encoded image")
    tags: List[str] = Field(default_factory=list, description="Tool tags")
    is_public: bool = Field(False, description="Whether the tool is publicly available")


class ToolExecutionRequest(BaseModel):
    """Request to execute a tool"""
    tool_id: str = Field(..., description="Tool ID to execute")
    parameters: Dict[str, Any] = Field(..., description="Parameters for tool execution")
    auth_credentials: Optional[Dict[str, Any]] = Field(None, description="Authentication credentials if required")
    execution_context: Optional[Dict[str, Any]] = Field(None, description="Additional execution context")


class ToolExecutionStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    TIMEOUT = "timeout"
    UNAUTHORIZED = "unauthorized"
    FORBIDDEN = "forbidden"
    NOT_FOUND = "not_found"


class ToolExecutionResult(BaseModel):
    """Result of a tool execution"""
    tool_id: str = Field(..., description="Tool ID that was executed")
    status: ToolExecutionStatus = Field(..., description="Execution status")
    result: Optional[Any] = Field(None, description="Execution result if successful")
    error: Optional[str] = Field(None, description="Error message if failed")
    execution_time: float = Field(..., description="Execution time in seconds")
    timestamp: datetime = Field(default_factory=datetime.now, description="Execution timestamp")
