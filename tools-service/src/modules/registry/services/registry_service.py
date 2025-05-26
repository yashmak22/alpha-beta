import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import pymongo
from pymongo import MongoClient
from pymongo.collection import Collection
from bson.objectid import ObjectId
import jsonschema

from modules.schemas.config import get_settings
from modules.schemas.tool_schema import ToolSchema, ToolCategory

logger = logging.getLogger("registry-service")
settings = get_settings()

class ToolRegistryService:
    def __init__(self):
        self.client = self._connect_to_mongodb()
        self.db = self.client[settings.MONGODB_DB]
        self.tools_collection = self.db["tools"]
        self._ensure_indexes()
    
    def _connect_to_mongodb(self) -> MongoClient:
        """Connect to MongoDB database"""
        try:
            client = MongoClient(settings.MONGODB_URI)
            # Test connection
            client.admin.command('ping')
            logger.info(f"Connected to MongoDB at {settings.MONGODB_URI}")
            return client
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def _ensure_indexes(self):
        """Ensure necessary indexes exist on collections"""
        try:
            # Create unique index on tool ID
            self.tools_collection.create_index("id", unique=True)
            
            # Create index on category
            self.tools_collection.create_index("category")
            
            # Create index on tags
            self.tools_collection.create_index("tags")
            
            # Create text index for search
            self.tools_collection.create_index([
                ("name", "text"), 
                ("description", "text"),
                ("tags", "text")
            ])
            
            logger.info("Ensured MongoDB indexes for tool registry")
        except Exception as e:
            logger.error(f"Failed to create indexes: {e}")
    
    def register_tool(self, tool: ToolSchema) -> str:
        """Register a new tool in the registry"""
        try:
            # Check if tool ID already exists
            existing_tool = self.tools_collection.find_one({"id": tool.id})
            if existing_tool:
                raise ValueError(f"Tool with ID '{tool.id}' already exists")
            
            # Set timestamps
            tool_dict = tool.dict()
            tool_dict["created_at"] = datetime.now()
            tool_dict["updated_at"] = datetime.now()
            
            # Insert tool
            result = self.tools_collection.insert_one(tool_dict)
            
            logger.info(f"Registered tool '{tool.id}' with _id: {result.inserted_id}")
            return tool.id
        except Exception as e:
            logger.error(f"Failed to register tool: {e}")
            raise
    
    def update_tool(self, tool_id: str, tool_update: Dict[str, Any]) -> bool:
        """Update an existing tool in the registry"""
        try:
            # Check if tool exists
            existing_tool = self.tools_collection.find_one({"id": tool_id})
            if not existing_tool:
                raise ValueError(f"Tool with ID '{tool_id}' not found")
            
            # Set updated timestamp
            tool_update["updated_at"] = datetime.now()
            
            # Update tool
            result = self.tools_collection.update_one(
                {"id": tool_id},
                {"$set": tool_update}
            )
            
            logger.info(f"Updated tool '{tool_id}', matched: {result.matched_count}, modified: {result.modified_count}")
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Failed to update tool: {e}")
            raise
    
    def delete_tool(self, tool_id: str) -> bool:
        """Delete a tool from the registry"""
        try:
            result = self.tools_collection.delete_one({"id": tool_id})
            
            logger.info(f"Deleted tool '{tool_id}', deleted count: {result.deleted_count}")
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Failed to delete tool: {e}")
            raise
    
    def get_tool(self, tool_id: str) -> Optional[Dict[str, Any]]:
        """Get a tool by ID"""
        try:
            tool = self.tools_collection.find_one({"id": tool_id})
            if tool:
                # Convert ObjectId to string for serialization
                tool["_id"] = str(tool["_id"])
                return tool
            return None
        except Exception as e:
            logger.error(f"Failed to get tool: {e}")
            raise
    
    def list_tools(
        self, 
        category: Optional[ToolCategory] = None,
        tags: Optional[List[str]] = None,
        is_public: Optional[bool] = None,
        search_query: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """List tools with optional filtering"""
        try:
            # Build query
            query = {}
            
            if category:
                query["category"] = category
            
            if tags:
                query["tags"] = {"$all": tags}
            
            if is_public is not None:
                query["is_public"] = is_public
            
            # Add text search if provided
            if search_query:
                query["$text"] = {"$search": search_query}
            
            # Execute query
            cursor = self.tools_collection.find(query).skip(skip).limit(limit)
            
            # Convert ObjectId to string for serialization
            tools = []
            for tool in cursor:
                tool["_id"] = str(tool["_id"])
                tools.append(tool)
            
            return tools
        except Exception as e:
            logger.error(f"Failed to list tools: {e}")
            raise
    
    def validate_tool_schema(self, tool_schema: Dict[str, Any]) -> bool:
        """Validate a tool schema against the ToolSchema definition"""
        try:
            # Use pydantic for validation
            validated_schema = ToolSchema(**tool_schema)
            return True
        except Exception as e:
            logger.error(f"Tool schema validation failed: {e}")
            return False
