from pydantic import BaseSettings
from functools import lru_cache
from typing import Optional, List
import os
import json


class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "alpha-memory-service"
    DEBUG: bool = False
    ENV: str = os.getenv("NODE_ENV", "development")
    
    # Supabase settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    
    # Vector DB settings - either Milvus or Supabase pgvector
    USE_SUPABASE_VECTOR: bool = os.getenv("USE_SUPABASE_VECTOR", "true").lower() == "true"
    
    # Milvus settings (fallback if not using Supabase pgvector)
    MILVUS_HOST: str = os.getenv("MILVUS_HOST", "localhost")
    MILVUS_PORT: int = int(os.getenv("MILVUS_PORT", "19530"))
    MILVUS_USER: Optional[str] = os.getenv("MILVUS_USER", None)
    MILVUS_PASSWORD: Optional[str] = os.getenv("MILVUS_PASSWORD", None)
    MILVUS_COLLECTION_PREFIX: str = os.getenv("MILVUS_COLLECTION_PREFIX", "alpha_")
    
    # Graph DB (Neo4j) settings
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "password")
    
    # Cache (Redis) settings - with fallback to in-memory cache
    USE_REDIS: bool = os.getenv("USE_REDIS", "false").lower() == "true"
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD", None)
    REDIS_SSL: bool = os.getenv("REDIS_SSL", "false").lower() == "true"
    REDIS_SESSION_TTL: int = int(os.getenv("REDIS_SESSION_TTL", "3600"))  # 1 hour in seconds
    
    # Embedding model settings
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "384"))
    
    # Security settings
    API_KEY_HEADER: str = os.getenv("API_KEY_HEADER", "X-API-Key")
    API_KEYS: List[str] = json.loads(os.getenv("API_KEYS", "[]"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = f".env.{os.getenv('NODE_ENV', 'development')}"
        env_file_encoding = "utf-8"
    
    def is_production(self):
        return self.ENV.lower() == "production"


@lru_cache()
def get_settings():
    return Settings()
