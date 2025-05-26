import logging
from typing import List, Dict, Any, Optional
from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError

from modules.shared.config import get_settings

logger = logging.getLogger("graph-service")
settings = get_settings()

class GraphService:
    def __init__(self):
        self.driver = self._connect_to_neo4j()
    
    def _connect_to_neo4j(self):
        """Connect to Neo4j database"""
        try:
            driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            # Verify connection
            with driver.session() as session:
                result = session.run("RETURN 1 AS result")
                if result.single()["result"] == 1:
                    logger.info(f"Connected to Neo4j at {settings.NEO4J_URI}")
                    return driver
                else:
                    raise Exception("Failed to verify Neo4j connection")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise
    
    def close(self):
        """Close Neo4j driver"""
        if self.driver:
            self.driver.close()
    
    def create_node(
        self, 
        label: str, 
        properties: Dict[str, Any]
    ) -> Optional[str]:
        """Create a node in the knowledge graph"""
        try:
            query = f"""
                CREATE (n:{label} $properties)
                RETURN id(n) as node_id, n.id as custom_id
            """
            
            with self.driver.session() as session:
                result = session.run(query, properties=properties)
                record = result.single()
                if record:
                    # Return either custom ID if provided or internal Neo4j ID
                    return properties.get('id', str(record["node_id"]))
                return None
        except Exception as e:
            logger.error(f"Failed to create node: {e}")
            return None
    
    def create_relationship(
        self, 
        from_node_id: str, 
        to_node_id: str, 
        relationship_type: str, 
        properties: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Create a relationship between two nodes"""
        if properties is None:
            properties = {}
        
        try:
            query = """
                MATCH (a), (b)
                WHERE a.id = $from_id AND b.id = $to_id
                CREATE (a)-[r:`{}`]->(b)
                SET r = $properties
                RETURN id(r) as rel_id
            """.format(relationship_type)
            
            with self.driver.session() as session:
                result = session.run(
                    query, 
                    from_id=from_node_id, 
                    to_id=to_node_id, 
                    properties=properties
                )
                return bool(result.single())
        except Exception as e:
            logger.error(f"Failed to create relationship: {e}")
            return False
    
    def find_nodes(
        self, 
        labels: Optional[List[str]] = None, 
        properties: Optional[Dict[str, Any]] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Find nodes in the knowledge graph"""
        try:
            # Construct label match string
            label_match = ""
            if labels and len(labels) > 0:
                label_match = ":" + ":".join(labels)
            
            # Construct property match conditions
            property_conditions = []
            params = {}
            if properties:
                for key, value in properties.items():
                    property_conditions.append(f"n.{key} = ${key}")
                    params[key] = value
            
            # Construct WHERE clause
            where_clause = ""
            if property_conditions:
                where_clause = "WHERE " + " AND ".join(property_conditions)
            
            # Build query
            query = f"""
                MATCH (n{label_match})
                {where_clause}
                RETURN n
                LIMIT {limit}
            """
            
            with self.driver.session() as session:
                result = session.run(query, **params)
                return [dict(record["n"]) for record in result]
        except Exception as e:
            logger.error(f"Failed to find nodes: {e}")
            return []
    
    def find_relationships(
        self,
        from_node_id: Optional[str] = None,
        to_node_id: Optional[str] = None,
        relationship_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Find relationships in the knowledge graph"""
        try:
            # Construct relationship match
            rel_match = ""
            if relationship_type:
                rel_match = f":`{relationship_type}`"
            
            # Build conditions and params
            conditions = []
            params = {}
            
            if from_node_id:
                conditions.append("a.id = $from_id")
                params["from_id"] = from_node_id
            
            if to_node_id:
                conditions.append("b.id = $to_id")
                params["to_id"] = to_node_id
            
            # Construct WHERE clause
            where_clause = ""
            if conditions:
                where_clause = "WHERE " + " AND ".join(conditions)
            
            # Build query
            query = f"""
                MATCH (a)-[r{rel_match}]->(b)
                {where_clause}
                RETURN a.id as from_id, b.id as to_id, type(r) as relationship_type, properties(r) as properties
                LIMIT {limit}
            """
            
            with self.driver.session() as session:
                result = session.run(query, **params)
                return [
                    {
                        "from_id": record["from_id"],
                        "to_id": record["to_id"],
                        "relationship_type": record["relationship_type"],
                        "properties": record["properties"]
                    }
                    for record in result
                ]
        except Exception as e:
            logger.error(f"Failed to find relationships: {e}")
            return []
    
    def delete_node(self, node_id: str) -> bool:
        """Delete a node and all its relationships"""
        try:
            query = """
                MATCH (n {id: $node_id})
                DETACH DELETE n
                RETURN count(*) as deleted
            """
            
            with self.driver.session() as session:
                result = session.run(query, node_id=node_id)
                return result.single()["deleted"] > 0
        except Exception as e:
            logger.error(f"Failed to delete node: {e}")
            return False
    
    def delete_relationship(
        self,
        from_node_id: str,
        to_node_id: str,
        relationship_type: Optional[str] = None
    ) -> bool:
        """Delete a relationship between two nodes"""
        try:
            # Construct relationship match
            rel_match = ""
            if relationship_type:
                rel_match = f":`{relationship_type}`"
            
            query = f"""
                MATCH (a {{id: $from_id}})-[r{rel_match}]->(b {{id: $to_id}})
                DELETE r
                RETURN count(*) as deleted
            """
            
            with self.driver.session() as session:
                result = session.run(
                    query, 
                    from_id=from_node_id, 
                    to_id=to_node_id
                )
                return result.single()["deleted"] > 0
        except Exception as e:
            logger.error(f"Failed to delete relationship: {e}")
            return False
    
    def execute_query(
        self,
        query: str,
        params: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Execute a custom Cypher query"""
        if params is None:
            params = {}
        
        try:
            with self.driver.session() as session:
                result = session.run(query, **params)
                return [record.data() for record in result]
        except Exception as e:
            logger.error(f"Failed to execute query: {e}")
            return []
