from fastapi import APIRouter, Depends, HTTPException, Body, Query
from typing import List, Dict, Any, Optional
import logging

from modules.vector.services.vector_service import VectorService
from modules.vector.dto.vector_dto import (
    MemoryCreateRequest,
    MemorySearchRequest,
    MemoryResponse,
    MemoryDeleteRequest
)
from modules.shared.config import get_settings

router = APIRouter()
logger = logging.getLogger("vector-controller")
settings = get_settings()

# Dependency for VectorService
def get_vector_service():
    return VectorService()

@router.post("/store", response_model=Dict[str, bool])
async def store_memories(
    request: MemoryCreateRequest,
    vector_service: VectorService = Depends(get_vector_service)
):
    """Store memories in the vector database"""
    try:
        result = vector_service.store_memories(
            collection_name=request.collection_name,
            texts=request.texts,
            ids=request.ids,
            metadatas=request.metadatas
        )
        return {"success": result}
    except Exception as e:
        logger.error(f"Error storing memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search", response_model=List[MemoryResponse])
async def search_memories(
    request: MemorySearchRequest,
    vector_service: VectorService = Depends(get_vector_service)
):
    """Search for similar memories in the vector database"""
    try:
        results = vector_service.search_memories(
            collection_name=request.collection_name,
            query_text=request.query_text,
            limit=request.limit,
            metadata_filter=request.metadata_filter
        )
        return results
    except Exception as e:
        logger.error(f"Error searching memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete", response_model=Dict[str, bool])
async def delete_memories(
    request: MemoryDeleteRequest,
    vector_service: VectorService = Depends(get_vector_service)
):
    """Delete memories from the vector database"""
    try:
        result = vector_service.delete_memories(
            collection_name=request.collection_name,
            ids=request.ids
        )
        return {"success": result}
    except Exception as e:
        logger.error(f"Error deleting memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/collections/{collection_name}", response_model=Dict[str, bool])
async def delete_collection(
    collection_name: str,
    vector_service: VectorService = Depends(get_vector_service)
):
    """Delete a collection from the vector database"""
    try:
        result = vector_service.delete_collection(collection_name)
        return {"success": result}
    except Exception as e:
        logger.error(f"Error deleting collection: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Update the main router
from modules.vector.controllers import vector_router
vector_router.include_router(router)
