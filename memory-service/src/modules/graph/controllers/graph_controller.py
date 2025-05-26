from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
import logging

from modules.graph.services.graph_service import GraphService
from modules.graph.dto.graph_dto import (
    NodeCreateRequest,
    RelationshipCreateRequest,
    NodeSearchRequest,
    RelationshipSearchRequest,
    NodeDeleteRequest,
    RelationshipDeleteRequest,
    QueryRequest,
    NodeResponse,
    RelationshipResponse
)
from modules.shared.config import get_settings

router = APIRouter()
logger = logging.getLogger("graph-controller")
settings = get_settings()

# Dependency for GraphService
def get_graph_service():
    service = GraphService()
    try:
        yield service
    finally:
        service.close()

@router.post("/nodes", response_model=Dict[str, str])
async def create_node(
    request: NodeCreateRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Create a node in the knowledge graph"""
    try:
        node_id = graph_service.create_node(
            label=request.label,
            properties=request.properties
        )
        if node_id:
            return {"id": node_id}
        raise HTTPException(status_code=500, detail="Failed to create node")
    except Exception as e:
        logger.error(f"Error creating node: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/relationships", response_model=Dict[str, bool])
async def create_relationship(
    request: RelationshipCreateRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Create a relationship between nodes"""
    try:
        result = graph_service.create_relationship(
            from_node_id=request.from_node_id,
            to_node_id=request.to_node_id,
            relationship_type=request.relationship_type,
            properties=request.properties
        )
        return {"success": result}
    except Exception as e:
        logger.error(f"Error creating relationship: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/nodes/search", response_model=List[Dict[str, Any]])
async def find_nodes(
    request: NodeSearchRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Find nodes in the knowledge graph"""
    try:
        return graph_service.find_nodes(
            labels=request.labels,
            properties=request.properties,
            limit=request.limit
        )
    except Exception as e:
        logger.error(f"Error finding nodes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/relationships/search", response_model=List[RelationshipResponse])
async def find_relationships(
    request: RelationshipSearchRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Find relationships in the knowledge graph"""
    try:
        return graph_service.find_relationships(
            from_node_id=request.from_node_id,
            to_node_id=request.to_node_id,
            relationship_type=request.relationship_type,
            limit=request.limit
        )
    except Exception as e:
        logger.error(f"Error finding relationships: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/nodes/delete", response_model=Dict[str, bool])
async def delete_node(
    request: NodeDeleteRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Delete a node and all its relationships"""
    try:
        result = graph_service.delete_node(node_id=request.node_id)
        return {"success": result}
    except Exception as e:
        logger.error(f"Error deleting node: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/relationships/delete", response_model=Dict[str, bool])
async def delete_relationship(
    request: RelationshipDeleteRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Delete a relationship between nodes"""
    try:
        result = graph_service.delete_relationship(
            from_node_id=request.from_node_id,
            to_node_id=request.to_node_id,
            relationship_type=request.relationship_type
        )
        return {"success": result}
    except Exception as e:
        logger.error(f"Error deleting relationship: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=List[Dict[str, Any]])
async def execute_query(
    request: QueryRequest,
    graph_service: GraphService = Depends(get_graph_service)
):
    """Execute a custom Cypher query"""
    try:
        return graph_service.execute_query(
            query=request.query,
            params=request.params
        )
    except Exception as e:
        logger.error(f"Error executing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Update the main router
from modules.graph.controllers import graph_router
graph_router.include_router(router)
