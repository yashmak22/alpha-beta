import logging
import json
from typing import Dict, Any, Optional, List, Union
import redis

from modules.shared.config import get_settings

logger = logging.getLogger("cache-service")
settings = get_settings()

class CacheService:
    def __init__(self):
        self.redis = self._connect_to_redis()
    
    def _connect_to_redis(self):
        """Connect to Redis server"""
        try:
            r = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD,
                ssl=settings.REDIS_SSL,
                decode_responses=True
            )
            # Verify connection
            r.ping()
            logger.info(f"Connected to Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
            return r
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise
    
    def _format_key(self, key_type: str, session_id: str, key: str) -> str:
        """Format a Redis key with namespace"""
        return f"alpha:{key_type}:{session_id}:{key}"
    
    def _serialize(self, value: Any) -> str:
        """Serialize a value to a string"""
        if isinstance(value, (str, int, float, bool)):
            return str(value)
        return json.dumps(value)
    
    def _deserialize(self, value: str) -> Any:
        """Deserialize a string to a value"""
        if value is None:
            return None
        
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    
    # Session Memory Methods
    def store_session_memory(
        self, 
        session_id: str, 
        key: str, 
        value: Any, 
        ttl: Optional[int] = None
    ) -> bool:
        """Store a session memory in Redis"""
        if ttl is None:
            ttl = settings.REDIS_SESSION_TTL
        
        try:
            redis_key = self._format_key("session", session_id, key)
            serialized_value = self._serialize(value)
            
            self.redis.set(redis_key, serialized_value, ex=ttl)
            return True
        except Exception as e:
            logger.error(f"Failed to store session memory: {e}")
            return False
    
    def get_session_memory(self, session_id: str, key: str) -> Optional[Any]:
        """Get a session memory from Redis"""
        try:
            redis_key = self._format_key("session", session_id, key)
            value = self.redis.get(redis_key)
            
            if value is not None:
                return self._deserialize(value)
            return None
        except Exception as e:
            logger.error(f"Failed to get session memory: {e}")
            return None
    
    def delete_session_memory(self, session_id: str, key: str) -> bool:
        """Delete a session memory from Redis"""
        try:
            redis_key = self._format_key("session", session_id, key)
            result = self.redis.delete(redis_key)
            return result > 0
        except Exception as e:
            logger.error(f"Failed to delete session memory: {e}")
            return False
    
    def list_session_memories(self, session_id: str) -> List[str]:
        """List all keys in a session"""
        try:
            pattern = self._format_key("session", session_id, "*")
            keys = self.redis.keys(pattern)
            
            # Extract the key names from the fully qualified Redis keys
            prefix = f"alpha:session:{session_id}:"
            return [key[len(prefix):] for key in keys]
        except Exception as e:
            logger.error(f"Failed to list session memories: {e}")
            return []
    
    def clear_session(self, session_id: str) -> int:
        """Clear all memories for a session"""
        try:
            pattern = self._format_key("session", session_id, "*")
            keys = self.redis.keys(pattern)
            
            if keys:
                return self.redis.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Failed to clear session: {e}")
            return 0
    
    # Conversation History Methods
    def add_to_conversation_history(
        self, 
        session_id: str, 
        message: Dict[str, Any],
        max_history: int = 50
    ) -> bool:
        """Add a message to the conversation history"""
        try:
            redis_key = self._format_key("history", session_id, "messages")
            serialized_message = self._serialize(message)
            
            # Add to the list
            pipe = self.redis.pipeline()
            pipe.lpush(redis_key, serialized_message)
            pipe.ltrim(redis_key, 0, max_history - 1)
            pipe.expire(redis_key, settings.REDIS_SESSION_TTL)
            pipe.execute()
            
            return True
        except Exception as e:
            logger.error(f"Failed to add to conversation history: {e}")
            return False
    
    def get_conversation_history(
        self, 
        session_id: str, 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get the conversation history for a session"""
        try:
            redis_key = self._format_key("history", session_id, "messages")
            result = self.redis.lrange(redis_key, 0, limit - 1)
            
            # Deserialize messages
            return [self._deserialize(msg) for msg in result]
        except Exception as e:
            logger.error(f"Failed to get conversation history: {e}")
            return []
    
    def clear_conversation_history(self, session_id: str) -> bool:
        """Clear the conversation history for a session"""
        try:
            redis_key = self._format_key("history", session_id, "messages")
            result = self.redis.delete(redis_key)
            return result > 0
        except Exception as e:
            logger.error(f"Failed to clear conversation history: {e}")
            return False
    
    # Generic Cache Methods
    def set_cache(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[int] = None
    ) -> bool:
        """Set a value in the cache"""
        try:
            redis_key = f"alpha:cache:{key}"
            serialized_value = self._serialize(value)
            
            if ttl is not None:
                self.redis.set(redis_key, serialized_value, ex=ttl)
            else:
                self.redis.set(redis_key, serialized_value)
            
            return True
        except Exception as e:
            logger.error(f"Failed to set cache: {e}")
            return False
    
    def get_cache(self, key: str) -> Optional[Any]:
        """Get a value from the cache"""
        try:
            redis_key = f"alpha:cache:{key}"
            value = self.redis.get(redis_key)
            
            if value is not None:
                return self._deserialize(value)
            return None
        except Exception as e:
            logger.error(f"Failed to get cache: {e}")
            return None
    
    def delete_cache(self, key: str) -> bool:
        """Delete a value from the cache"""
        try:
            redis_key = f"alpha:cache:{key}"
            result = self.redis.delete(redis_key)
            return result > 0
        except Exception as e:
            logger.error(f"Failed to delete cache: {e}")
            return False
