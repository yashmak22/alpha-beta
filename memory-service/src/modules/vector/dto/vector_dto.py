from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class MemoryCreateRequest(BaseModel):
    """Request model for storing memories"""
    collection_name: str = Field(..., description="Name of the memory collection")
    texts: List[str] = Field(..., description="List of text content to store")
    ids: List[str] = Field(..., description="List of unique IDs for each memory")
    metadatas: Optional[List[Dict[str, Any]]] = Field(
        None, 
        description="Optional metadata for each memory"
    )


class MemorySearchRequest(BaseModel):
    """Request model for searching memories"""
    collection_name: str = Field(..., description="Name of the memory collection")
    query_text: str = Field(..., description="Text to search for")
    limit: int = Field(5, description="Maximum number of results to return")
    metadata_filter: Optional[Dict[str, Any]] = Field(
        None, 
        description="Optional metadata filter"
    )


class MemoryDeleteRequest(BaseModel):
    """Request model for deleting memories"""
    collection_name: str = Field(..., description="Name of the memory collection")
    ids: List[str] = Field(..., description="List of memory IDs to delete")


class MemoryResponse(BaseModel):
    """Response model for memory search results"""
    id: str = Field(..., description="Memory ID")
    text: str = Field(..., description="Memory text content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Memory metadata")
    score: float = Field(..., description="Similarity score")
