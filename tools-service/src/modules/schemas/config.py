from pydantic import BaseSettings
from functools import lru_cache
from typing import Optional, List, Dict, Any


class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "alpha-tools-service"
    DEBUG: bool = False
    
    # MongoDB settings for tool registry
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "alpha_tools"
    
    # Redis settings for caching and rate limiting
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_SSL: bool = False
    
    # OAuth2 settings
    OAUTH_CLIENT_ID_GOOGLE: Optional[str] = None
    OAUTH_CLIENT_SECRET_GOOGLE: Optional[str] = None
    OAUTH_REDIRECT_URI: str = "http://localhost:3000/oauth/callback"
    
    # Tool execution settings
    TOOL_EXECUTION_TIMEOUT: int = 30  # seconds
    MAX_CONCURRENT_EXECUTIONS: int = 100
    RATE_LIMIT_PER_USER: int = 100  # requests per minute
    
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
