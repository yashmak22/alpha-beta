from pydantic import BaseSettings
from functools import lru_cache
from typing import Optional, List, Dict, Any
import os
import json


class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "alpha-tools-service"
    DEBUG: bool = False
    ENV: str = os.getenv("NODE_ENV", "development")
    
    # Supabase settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    
    # Tool registry database - MongoDB or Supabase
    USE_SUPABASE: bool = os.getenv("USE_SUPABASE", "true").lower() == "true"
    
    # MongoDB settings (fallback if not using Supabase)
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "alpha_tools")
    
    # Redis settings for caching and rate limiting
    USE_REDIS: bool = os.getenv("USE_REDIS", "false").lower() == "true"
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD", None)
    REDIS_SSL: bool = os.getenv("REDIS_SSL", "false").lower() == "true"
    
    # OAuth2 settings
    OAUTH_CLIENT_ID_GOOGLE: Optional[str] = os.getenv("OAUTH_CLIENT_ID_GOOGLE", None)
    OAUTH_CLIENT_SECRET_GOOGLE: Optional[str] = os.getenv("OAUTH_CLIENT_SECRET_GOOGLE", None)
    OAUTH_REDIRECT_URI: str = os.getenv("OAUTH_REDIRECT_URI", "http://localhost:3000/oauth/callback")
    
    # Tool execution settings
    TOOL_EXECUTION_TIMEOUT: int = int(os.getenv("TOOL_EXECUTION_TIMEOUT", "30"))  # seconds
    MAX_CONCURRENT_EXECUTIONS: int = int(os.getenv("MAX_CONCURRENT_EXECUTIONS", "100"))
    RATE_LIMIT_PER_USER: int = int(os.getenv("RATE_LIMIT_PER_USER", "100"))  # requests per minute
    
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
