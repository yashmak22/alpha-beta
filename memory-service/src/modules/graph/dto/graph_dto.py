from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class NodeCreateRequest(BaseModel):
    """Request model for creating a node in the knowledge graph"""
    label: str = Field(..., description="Label/type of the node")
    properties: Dict[str, Any] = Field(
        ..., 
        description="Properties of the node, should include 'id' for custom identification"
    )


class RelationshipCreateRequest(BaseModel):
    """Request model for creating a relationship between nodes"""
    from_node_id: str = Field(..., description="ID of the source node")
    to_node_id: str = Field(..., description="ID of the target node")
    relationship_type: str = Field(..., description="Type of the relationship")
    properties: Optional[Dict[str, Any]] = Field(
        default_factory=dict, 
        description="Optional properties for the relationship"
    )


class NodeSearchRequest(BaseModel):
    """Request model for searching nodes"""
    labels: Optional[List[str]] = Field(
        None, 
        description="List of node labels to filter by"
    )
    properties: Optional[Dict[str, Any]] = Field(
        None, 
        description="Properties to filter nodes by"
    )
    limit: int = Field(100, description="Maximum number of results to return")


class RelationshipSearchRequest(BaseModel):
    """Request model for searching relationships"""
    from_node_id: Optional[str] = Field(
        None, 
        description="ID of the source node"
    )
    to_node_id: Optional[str] = Field(
        None, 
        description="ID of the target node"
    )
    relationship_type: Optional[str] = Field(
        None, 
        description="Type of the relationship"
    )
    limit: int = Field(100, description="Maximum number of results to return")


class NodeDeleteRequest(BaseModel):
    """Request model for deleting a node"""
    node_id: str = Field(..., description="ID of the node to delete")


class RelationshipDeleteRequest(BaseModel):
    """Request model for deleting a relationship"""
    from_node_id: str = Field(..., description="ID of the source node")
    to_node_id: str = Field(..., description="ID of the target node")
    relationship_type: Optional[str] = Field(
        None, 
        description="Type of the relationship to delete"
    )


class QueryRequest(BaseModel):
    """Request model for executing a custom Cypher query"""
    query: str = Field(..., description="Cypher query to execute")
    params: Optional[Dict[str, Any]] = Field(
        default_factory=dict, 
        description="Parameters for the query"
    )


class NodeResponse(BaseModel):
    """Response model for node operations"""
    id: str = Field(..., description="Node ID")
    properties: Dict[str, Any] = Field(..., description="Node properties")


class RelationshipResponse(BaseModel):
    """Response model for relationship operations"""
    from_id: str = Field(..., description="Source node ID")
    to_id: str = Field(..., description="Target node ID")
    relationship_type: str = Field(..., description="Type of the relationship")
    properties: Dict[str, Any] = Field(..., description="Relationship properties")
