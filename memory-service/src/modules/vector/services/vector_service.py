import logging
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from pymilvus import (
    connections, 
    Collection, 
    CollectionSchema, 
    FieldSchema, 
    DataType,
    utility
)
from sentence_transformers import SentenceTransformer

from modules.shared.config import get_settings

logger = logging.getLogger("vector-service")
settings = get_settings()

class VectorService:
    def __init__(self):
        self.connect_to_milvus()
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.embedding_dim = settings.EMBEDDING_DIMENSION
    
    def connect_to_milvus(self):
        """Connect to Milvus server"""
        try:
            connections.connect(
                alias="default",
                host=settings.MILVUS_HOST,
                port=settings.MILVUS_PORT,
                user=settings.MILVUS_USER,
                password=settings.MILVUS_PASSWORD
            )
            logger.info(f"Connected to Milvus at {settings.MILVUS_HOST}:{settings.MILVUS_PORT}")
        except Exception as e:
            logger.error(f"Failed to connect to Milvus: {e}")
            raise
    
    def get_collection(self, collection_name: str, create_if_missing: bool = True) -> Collection:
        """Get or create a Milvus collection"""
        full_collection_name = f"{settings.MILVUS_COLLECTION_PREFIX}{collection_name}"
        
        # Check if collection exists
        if utility.has_collection(full_collection_name):
            return Collection(full_collection_name)
        
        if not create_if_missing:
            raise ValueError(f"Collection {full_collection_name} does not exist")
        
        # Create collection schema
        id_field = FieldSchema(
            name="id", 
            dtype=DataType.VARCHAR, 
            is_primary=True, 
            max_length=100
        )
        vector_field = FieldSchema(
            name="embedding", 
            dtype=DataType.FLOAT_VECTOR, 
            dim=self.embedding_dim
        )
        text_field = FieldSchema(
            name="text", 
            dtype=DataType.VARCHAR, 
            max_length=65535
        )
        metadata_field = FieldSchema(
            name="metadata", 
            dtype=DataType.JSON
        )
        
        schema = CollectionSchema(
            fields=[id_field, vector_field, text_field, metadata_field],
            description=f"Memory collection for {collection_name}"
        )
        
        # Create collection
        collection = Collection(
            name=full_collection_name,
            schema=schema
        )
        
        # Create index on vector field
        index_params = {
            "metric_type": "COSINE",
            "index_type": "HNSW",
            "params": {"M": 8, "efConstruction": 64}
        }
        collection.create_index(field_name="embedding", index_params=index_params)
        
        logger.info(f"Created collection {full_collection_name}")
        return collection
    
    def create_embeddings(self, texts: List[str]) -> np.ndarray:
        """Create embeddings for a list of texts"""
        embeddings = self.embedding_model.encode(texts)
        return embeddings
    
    def store_memories(
        self, 
        collection_name: str, 
        texts: List[str], 
        ids: List[str], 
        metadatas: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Store memories in the vector database"""
        if not texts or not ids:
            return False
        
        if len(texts) != len(ids):
            raise ValueError("Number of texts must match number of IDs")
        
        if metadatas is None:
            metadatas = [{} for _ in texts]
        elif len(metadatas) != len(texts):
            raise ValueError("Number of metadata entries must match number of texts")
        
        try:
            collection = self.get_collection(collection_name)
            
            # Create embeddings
            embeddings = self.create_embeddings(texts)
            
            # Prepare data for insertion
            data = [
                ids,
                embeddings,
                texts,
                metadatas
            ]
            
            # Insert data
            collection.insert(data)
            collection.flush()
            
            logger.info(f"Stored {len(texts)} memories in collection {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to store memories: {e}")
            return False
    
    def search_memories(
        self, 
        collection_name: str, 
        query_text: str, 
        limit: int = 5, 
        metadata_filter: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar memories in the vector database"""
        try:
            collection = self.get_collection(collection_name, create_if_missing=False)
            
            # Create query embedding
            query_embedding = self.create_embeddings([query_text])[0].tolist()
            
            # Load collection
            collection.load()
            
            # Prepare search parameters
            search_params = {
                "metric_type": "COSINE",
                "params": {"ef": 64}
            }
            
            # Construct expression for metadata filtering
            expr = None
            if metadata_filter:
                expressions = []
                for key, value in metadata_filter.items():
                    if isinstance(value, str):
                        expressions.append(f'metadata["{key}"] == "{value}"')
                    elif isinstance(value, (int, float, bool)):
                        expressions.append(f'metadata["{key}"] == {value}')
                
                if expressions:
                    expr = " && ".join(expressions)
            
            # Execute search
            results = collection.search(
                data=[query_embedding],
                anns_field="embedding",
                param=search_params,
                limit=limit,
                expr=expr,
                output_fields=["text", "metadata"]
            )
            
            # Process results
            memories = []
            for hits in results:
                for hit in hits:
                    memories.append({
                        "id": hit.id,
                        "text": hit.entity.get("text"),
                        "metadata": hit.entity.get("metadata"),
                        "score": hit.score
                    })
            
            logger.info(f"Found {len(memories)} memories in collection {collection_name}")
            return memories
        except Exception as e:
            logger.error(f"Failed to search memories: {e}")
            return []
    
    def delete_memories(self, collection_name: str, ids: List[str]) -> bool:
        """Delete memories from the vector database"""
        try:
            collection = self.get_collection(collection_name, create_if_missing=False)
            
            # Construct expression for deletion
            expr = f'id in ["{ids[0]}"'
            for id in ids[1:]:
                expr += f', "{id}"'
            expr += "]"
            
            # Execute deletion
            collection.delete(expr)
            
            logger.info(f"Deleted {len(ids)} memories from collection {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete memories: {e}")
            return False
    
    def delete_collection(self, collection_name: str) -> bool:
        """Delete a collection from the vector database"""
        try:
            full_collection_name = f"{settings.MILVUS_COLLECTION_PREFIX}{collection_name}"
            
            if utility.has_collection(full_collection_name):
                utility.drop_collection(full_collection_name)
                logger.info(f"Deleted collection {full_collection_name}")
                return True
            
            logger.warning(f"Collection {full_collection_name} does not exist")
            return False
        except Exception as e:
            logger.error(f"Failed to delete collection: {e}")
            return False
