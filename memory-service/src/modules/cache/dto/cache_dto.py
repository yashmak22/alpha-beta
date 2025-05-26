from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Union


class SessionMemoryStoreRequest(BaseModel):
    """Request model for storing session memory"""
    session_id: str = Field(..., description="Session ID")
    key: str = Field(..., description="Memory key")
    value: Any = Field(..., description="Memory value")
    ttl: Optional[int] = Field(None, description="Time to live in seconds")


class SessionMemoryGetRequest(BaseModel):
    """Request model for getting session memory"""
    session_id: str = Field(..., description="Session ID")
    key: str = Field(..., description="Memory key")


class SessionMemoryDeleteRequest(BaseModel):
    """Request model for deleting session memory"""
    session_id: str = Field(..., description="Session ID")
    key: str = Field(..., description="Memory key")


class SessionMemoryListRequest(BaseModel):
    """Request model for listing session memories"""
    session_id: str = Field(..., description="Session ID")


class SessionClearRequest(BaseModel):
    """Request model for clearing a session"""
    session_id: str = Field(..., description="Session ID")


class ConversationHistoryAddRequest(BaseModel):
    """Request model for adding to conversation history"""
    session_id: str = Field(..., description="Session ID")
    message: Dict[str, Any] = Field(..., description="Message to add")
    max_history: int = Field(50, description="Maximum history length")


class ConversationHistoryGetRequest(BaseModel):
    """Request model for getting conversation history"""
    session_id: str = Field(..., description="Session ID")
    limit: int = Field(10, description="Maximum number of messages to retrieve")


class ConversationHistoryClearRequest(BaseModel):
    """Request model for clearing conversation history"""
    session_id: str = Field(..., description="Session ID")


class CacheSetRequest(BaseModel):
    """Request model for setting a cache value"""
    key: str = Field(..., description="Cache key")
    value: Any = Field(..., description="Value to cache")
    ttl: Optional[int] = Field(None, description="Time to live in seconds")


class CacheGetRequest(BaseModel):
    """Request model for getting a cache value"""
    key: str = Field(..., description="Cache key")


class CacheDeleteRequest(BaseModel):
    """Request model for deleting a cache value"""
    key: str = Field(..., description="Cache key")


class MemoryResponse(BaseModel):
    """Response model for memory operations"""
    success: bool = Field(..., description="Operation success status")
    data: Optional[Any] = Field(None, description="Response data if any")


class ListKeysResponse(BaseModel):
    """Response model for listing keys"""
    keys: List[str] = Field(..., description="List of keys")
