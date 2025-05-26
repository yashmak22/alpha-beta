from fastapi import APIRouter, Depends, HTTPException, Body, Path, Query
from typing import Dict, Any, Optional, List
import logging

from modules.executor.services.executor_service import ToolExecutorService
from modules.schemas.tool_schema import ToolExecutionStatus

logger = logging.getLogger("executor-controller")

executor_router = APIRouter()

# Dependency for ToolExecutorService
def get_executor_service():
    return ToolExecutorService()

@executor_router.post("/execute/{tool_id}", response_model=Dict[str, Any])
async def execute_tool(
    tool_id: str = Path(..., description="Tool ID to execute"),
    parameters: Dict[str, Any] = Body(..., description="Parameters for tool execution"),
    auth_credentials: Optional[Dict[str, Any]] = Body(None, description="Authentication credentials if required"),
    execution_context: Optional[Dict[str, Any]] = Body(None, description="Additional execution context"),
    executor_service: ToolExecutorService = Depends(get_executor_service)
):
    """Execute a tool with the provided parameters"""
    try:
        result = await executor_service.execute_tool(
            tool_id=tool_id,
            parameters=parameters,
            auth_credentials=auth_credentials,
            execution_context=execution_context
        )
        
        # If error status, return appropriate HTTP status code
        if result.get("status") == ToolExecutionStatus.ERROR:
            raise HTTPException(status_code=400, detail=result)
        elif result.get("status") == ToolExecutionStatus.UNAUTHORIZED:
            raise HTTPException(status_code=401, detail=result)
        elif result.get("status") == ToolExecutionStatus.FORBIDDEN:
            raise HTTPException(status_code=403, detail=result)
        elif result.get("status") == ToolExecutionStatus.NOT_FOUND:
            raise HTTPException(status_code=404, detail=result)
        elif result.get("status") == ToolExecutionStatus.TIMEOUT:
            raise HTTPException(status_code=504, detail=result)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in execute_tool endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@executor_router.post("/execute-batch", response_model=List[Dict[str, Any]])
async def execute_batch(
    batch_requests: List[Dict[str, Any]] = Body(..., description="Batch of tool execution requests"),
    executor_service: ToolExecutorService = Depends(get_executor_service)
):
    """Execute multiple tools in a batch"""
    try:
        results = []
        
        # Process each request in the batch
        for request in batch_requests:
            tool_id = request.get("tool_id")
            if not tool_id:
                results.append({
                    "status": ToolExecutionStatus.ERROR,
                    "error": "Missing tool_id in batch request"
                })
                continue
            
            parameters = request.get("parameters", {})
            auth_credentials = request.get("auth_credentials")
            execution_context = request.get("execution_context")
            
            # Execute the tool
            result = await executor_service.execute_tool(
                tool_id=tool_id,
                parameters=parameters,
                auth_credentials=auth_credentials,
                execution_context=execution_context
            )
            
            results.append(result)
        
        return results
    except Exception as e:
        logger.error(f"Error in execute_batch endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
