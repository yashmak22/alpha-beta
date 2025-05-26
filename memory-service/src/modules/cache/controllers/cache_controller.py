from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional, List
import logging

from modules.cache.services.cache_service import CacheService
from modules.cache.dto.cache_dto import (
    SessionMemoryStoreRequest,
    SessionMemoryGetRequest,
    SessionMemoryDeleteRequest,
    SessionMemoryListRequest,
    SessionClearRequest,
    ConversationHistoryAddRequest,
    ConversationHistoryGetRequest,
    ConversationHistoryClearRequest,
    CacheSetRequest,
    CacheGetRequest,
    CacheDeleteRequest,
    MemoryResponse,
    ListKeysResponse
)
from modules.shared.config import get_settings

router = APIRouter()
logger = logging.getLogger("cache-controller")
settings = get_settings()

# Dependency for CacheService
def get_cache_service():
    return CacheService()

# Session Memory Endpoints
@router.post("/session/store", response_model=MemoryResponse)
async def store_session_memory(
    request: SessionMemoryStoreRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Store a value in session memory"""
    try:
        result = cache_service.store_session_memory(
            session_id=request.session_id,
            key=request.key,
            value=request.value,
            ttl=request.ttl
        )
        return {"success": result, "data": None}
    except Exception as e:
        logger.error(f"Error storing session memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/get", response_model=MemoryResponse)
async def get_session_memory(
    request: SessionMemoryGetRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Get a value from session memory"""
    try:
        value = cache_service.get_session_memory(
            session_id=request.session_id,
            key=request.key
        )
        return {"success": value is not None, "data": value}
    except Exception as e:
        logger.error(f"Error getting session memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/delete", response_model=MemoryResponse)
async def delete_session_memory(
    request: SessionMemoryDeleteRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Delete a value from session memory"""
    try:
        result = cache_service.delete_session_memory(
            session_id=request.session_id,
            key=request.key
        )
        return {"success": result, "data": None}
    except Exception as e:
        logger.error(f"Error deleting session memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/list", response_model=ListKeysResponse)
async def list_session_memories(
    request: SessionMemoryListRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """List all keys in a session"""
    try:
        keys = cache_service.list_session_memories(session_id=request.session_id)
        return {"keys": keys}
    except Exception as e:
        logger.error(f"Error listing session memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/clear", response_model=MemoryResponse)
async def clear_session(
    request: SessionClearRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Clear all memories for a session"""
    try:
        count = cache_service.clear_session(session_id=request.session_id)
        return {"success": True, "data": {"cleared_count": count}}
    except Exception as e:
        logger.error(f"Error clearing session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Conversation History Endpoints
@router.post("/conversation/add", response_model=MemoryResponse)
async def add_to_conversation_history(
    request: ConversationHistoryAddRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Add a message to the conversation history"""
    try:
        result = cache_service.add_to_conversation_history(
            session_id=request.session_id,
            message=request.message,
            max_history=request.max_history
        )
        return {"success": result, "data": None}
    except Exception as e:
        logger.error(f"Error adding to conversation history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversation/get", response_model=MemoryResponse)
async def get_conversation_history(
    request: ConversationHistoryGetRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Get the conversation history for a session"""
    try:
        history = cache_service.get_conversation_history(
            session_id=request.session_id,
            limit=request.limit
        )
        return {"success": True, "data": history}
    except Exception as e:
        logger.error(f"Error getting conversation history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversation/clear", response_model=MemoryResponse)
async def clear_conversation_history(
    request: ConversationHistoryClearRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Clear the conversation history for a session"""
    try:
        result = cache_service.clear_conversation_history(
            session_id=request.session_id
        )
        return {"success": result, "data": None}
    except Exception as e:
        logger.error(f"Error clearing conversation history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Generic Cache Endpoints
@router.post("/set", response_model=MemoryResponse)
async def set_cache(
    request: CacheSetRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Set a value in the cache"""
    try:
        result = cache_service.set_cache(
            key=request.key,
            value=request.value,
            ttl=request.ttl
        )
        return {"success": result, "data": None}
    except Exception as e:
        logger.error(f"Error setting cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get", response_model=MemoryResponse)
async def get_cache(
    request: CacheGetRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Get a value from the cache"""
    try:
        value = cache_service.get_cache(key=request.key)
        return {"success": value is not None, "data": value}
    except Exception as e:
        logger.error(f"Error getting cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete", response_model=MemoryResponse)
async def delete_cache(
    request: CacheDeleteRequest,
    cache_service: CacheService = Depends(get_cache_service)
):
    """Delete a value from the cache"""
    try:
        result = cache_service.delete_cache(key=request.key)
        return {"success": result, "data": None}
    except Exception as e:
        logger.error(f"Error deleting cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Update the main router
from modules.cache.controllers import cache_router
cache_router.include_router(router)
