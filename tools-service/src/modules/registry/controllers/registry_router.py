from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import List, Dict, Any, Optional
import logging

from modules.registry.services.registry_service import ToolRegistryService
from modules.schemas.tool_schema import ToolSchema, ToolCategory

logger = logging.getLogger("registry-controller")

registry_router = APIRouter()

# Dependency for ToolRegistryService
def get_registry_service():
    return ToolRegistryService()

@registry_router.post("/tools", response_model=Dict[str, str])
async def register_tool(
    tool: ToolSchema,
    registry_service: ToolRegistryService = Depends(get_registry_service)
):
    """Register a new tool in the registry"""
    try:
        tool_id = registry_service.register_tool(tool)
        return {"id": tool_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error registering tool: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@registry_router.get("/tools", response_model=List[Dict[str, Any]])
async def list_tools(
    category: Optional[ToolCategory] = None,
    tags: Optional[List[str]] = Query(None),
    is_public: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    registry_service: ToolRegistryService = Depends(get_registry_service)
):
    """List tools with optional filtering"""
    try:
        tools = registry_service.list_tools(
            category=category,
            tags=tags,
            is_public=is_public,
            search_query=search,
            skip=skip,
            limit=limit
        )
        return tools
    except Exception as e:
        logger.error(f"Error listing tools: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@registry_router.get("/tools/{tool_id}", response_model=Dict[str, Any])
async def get_tool(
    tool_id: str = Path(..., description="Tool ID"),
    registry_service: ToolRegistryService = Depends(get_registry_service)
):
    """Get a tool by ID"""
    try:
        tool = registry_service.get_tool(tool_id)
        if not tool:
            raise HTTPException(status_code=404, detail=f"Tool with ID '{tool_id}' not found")
        return tool
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting tool: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@registry_router.put("/tools/{tool_id}", response_model=Dict[str, bool])
async def update_tool(
    tool_update: Dict[str, Any],
    tool_id: str = Path(..., description="Tool ID"),
    registry_service: ToolRegistryService = Depends(get_registry_service)
):
    """Update an existing tool"""
    try:
        success = registry_service.update_tool(tool_id, tool_update)
        return {"success": success}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating tool: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@registry_router.delete("/tools/{tool_id}", response_model=Dict[str, bool])
async def delete_tool(
    tool_id: str = Path(..., description="Tool ID"),
    registry_service: ToolRegistryService = Depends(get_registry_service)
):
    """Delete a tool"""
    try:
        success = registry_service.delete_tool(tool_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Tool with ID '{tool_id}' not found")
        return {"success": success}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting tool: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@registry_router.post("/tools/validate", response_model=Dict[str, bool])
async def validate_tool_schema(
    tool_schema: Dict[str, Any],
    registry_service: ToolRegistryService = Depends(get_registry_service)
):
    """Validate a tool schema"""
    try:
        valid = registry_service.validate_tool_schema(tool_schema)
        return {"valid": valid}
    except Exception as e:
        logger.error(f"Error validating tool schema: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
