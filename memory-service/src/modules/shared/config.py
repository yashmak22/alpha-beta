from pydantic import BaseSettings
from functools import lru_cache
from typing import Optional, List


class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "alpha-memory-service"
    DEBUG: bool = False
    
    # Vector DB (Milvus) settings
    MILVUS_HOST: str = "localhost"
    MILVUS_PORT: int = 19530
    MILVUS_USER: Optional[str] = None
    MILVUS_PASSWORD: Optional[str] = None
    MILVUS_COLLECTION_PREFIX: str = "alpha_"
    
    # Graph DB (Neo4j) settings
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    
    # Cache (Redis) settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_SSL: bool = False
    REDIS_SESSION_TTL: int = 3600  # 1 hour in seconds
    
    # Embedding model settings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    
    # Security settings
    API_KEY_HEADER: str = "X-API-Key"
    API_KEYS: List[str] = []
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings():
    return Settings()
