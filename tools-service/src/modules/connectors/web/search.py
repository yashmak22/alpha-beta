import logging
import aiohttp
import asyncio
from typing import Dict, Any, List, Optional

from modules.schemas.config import get_settings

logger = logging.getLogger("web-connector")
settings = get_settings()

async def search_web(parameters: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Search the web using a search engine API
    
    Parameters:
    - query: The search query string
    - num_results: Number of results to return (default: 5)
    - search_type: Type of search (web, images, news)
    
    Returns:
    - results: List of search results
    - metadata: Search metadata
    """
    try:
        # Extract parameters
        query = parameters.get("query")
        if not query:
            return {"error": "Query parameter is required"}
        
        num_results = parameters.get("num_results", 5)
        search_type = parameters.get("search_type", "web")
        
        # Get API key from context or settings
        api_key = context.get("auth_credentials", {}).get("api_key")
        if not api_key:
            api_key = settings.SEARCH_API_KEY
            
        if not api_key:
            return {"error": "No API key provided for search"}
        
        # Build search request
        if settings.SEARCH_ENGINE == "serpapi":
            return await _search_with_serpapi(query, num_results, search_type, api_key)
        elif settings.SEARCH_ENGINE == "bing":
            return await _search_with_bing(query, num_results, search_type, api_key)
        else:
            # Default to Google mock implementation
            return await _mock_search_results(query, num_results, search_type)
            
    except Exception as e:
        logger.error(f"Error in search_web: {e}")
        return {"error": f"Search failed: {str(e)}"}

async def _search_with_serpapi(
    query: str, 
    num_results: int, 
    search_type: str, 
    api_key: str
) -> Dict[str, Any]:
    """Use SerpAPI for web search"""
    async with aiohttp.ClientSession() as session:
        params = {
            "q": query,
            "num": num_results,
            "api_key": api_key,
            "engine": "google"
        }
        
        if search_type == "images":
            params["tbm"] = "isch"
        elif search_type == "news":
            params["tbm"] = "nws"
        
        async with session.get("https://serpapi.com/search", params=params) as response:
            if response.status != 200:
                error_text = await response.text()
                return {"error": f"SerpAPI error: {error_text}"}
            
            data = await response.json()
            
            # Extract and format results
            results = []
            if "organic_results" in data:
                for item in data["organic_results"][:num_results]:
                    results.append({
                        "title": item.get("title", ""),
                        "link": item.get("link", ""),
                        "snippet": item.get("snippet", ""),
                        "position": item.get("position", 0)
                    })
            
            return {
                "results": results,
                "metadata": {
                    "total_results": data.get("search_information", {}).get("total_results", 0),
                    "time_taken": data.get("search_information", {}).get("time_taken_displayed", 0),
                    "query": query
                }
            }

async def _search_with_bing(
    query: str, 
    num_results: int, 
    search_type: str, 
    api_key: str
) -> Dict[str, Any]:
    """Use Bing Search API for web search"""
    async with aiohttp.ClientSession() as session:
        headers = {
            "Ocp-Apim-Subscription-Key": api_key
        }
        
        endpoint = "https://api.bing.microsoft.com/v7.0/search"
        if search_type == "images":
            endpoint = "https://api.bing.microsoft.com/v7.0/images/search"
        elif search_type == "news":
            endpoint = "https://api.bing.microsoft.com/v7.0/news/search"
            
        params = {
            "q": query,
            "count": num_results
        }
        
        async with session.get(endpoint, headers=headers, params=params) as response:
            if response.status != 200:
                error_text = await response.text()
                return {"error": f"Bing API error: {error_text}"}
            
            data = await response.json()
            
            # Extract and format results
            results = []
            if "webPages" in data and "value" in data["webPages"]:
                for item in data["webPages"]["value"][:num_results]:
                    results.append({
                        "title": item.get("name", ""),
                        "link": item.get("url", ""),
                        "snippet": item.get("snippet", ""),
                        "position": len(results) + 1
                    })
            
            return {
                "results": results,
                "metadata": {
                    "total_results": data.get("webPages", {}).get("totalEstimatedMatches", 0),
                    "query": query
                }
            }

async def _mock_search_results(
    query: str, 
    num_results: int, 
    search_type: str
) -> Dict[str, Any]:
    """Generate mock search results for testing"""
    # Add a small delay to simulate network request
    await asyncio.sleep(0.5)
    
    results = []
    for i in range(min(num_results, 5)):
        results.append({
            "title": f"Result {i+1} for {query}",
            "link": f"https://example.com/result{i+1}",
            "snippet": f"This is a mock search result {i+1} for the query '{query}'",
            "position": i+1
        })
    
    return {
        "results": results,
        "metadata": {
            "total_results": 100,
            "time_taken": 0.5,
            "query": query,
            "note": "These are mock results for testing purposes"
        }
    }
