import logging
import aiohttp
import asyncio
from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup
import json
import re

from modules.schemas.config import get_settings

logger = logging.getLogger("web-connector")
settings = get_settings()

async def fetch_url(parameters: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Fetch content from a URL
    
    Parameters:
    - url: The URL to fetch content from
    - extract_mode: Mode for content extraction (full_html, text, metadata, json)
    - headers: Optional headers to include in the request
    
    Returns:
    - content: The fetched content
    - metadata: URL metadata
    """
    try:
        # Extract parameters
        url = parameters.get("url")
        if not url:
            return {"error": "URL parameter is required"}
        
        extract_mode = parameters.get("extract_mode", "text")
        headers = parameters.get("headers", {})
        
        # Add default user-agent if not provided
        if "User-Agent" not in headers:
            headers["User-Agent"] = "Alpha Platform Tool Service/1.0"
        
        # Make request
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, allow_redirects=True) as response:
                if response.status != 200:
                    return {
                        "error": f"Failed to fetch URL: HTTP {response.status}",
                        "status_code": response.status
                    }
                
                content_type = response.headers.get("Content-Type", "")
                
                # Handle different content types
                if "application/json" in content_type:
                    data = await response.json()
                    return {
                        "content": data,
                        "metadata": {
                            "url": str(response.url),
                            "content_type": content_type,
                            "status_code": response.status,
                            "headers": dict(response.headers)
                        }
                    }
                else:
                    # Get HTML content
                    html = await response.text()
                    
                    # Process based on extraction mode
                    if extract_mode == "full_html":
                        return {
                            "content": html,
                            "metadata": {
                                "url": str(response.url),
                                "content_type": content_type,
                                "status_code": response.status,
                                "headers": dict(response.headers)
                            }
                        }
                    elif extract_mode == "text":
                        text = _extract_text_from_html(html)
                        return {
                            "content": text,
                            "metadata": {
                                "url": str(response.url),
                                "content_type": content_type,
                                "status_code": response.status,
                                "length": len(text)
                            }
                        }
                    elif extract_mode == "metadata":
                        metadata = _extract_metadata_from_html(html, str(response.url))
                        return {
                            "metadata": metadata
                        }
                    elif extract_mode == "json":
                        # Try to extract JSON from the page
                        json_data = _extract_json_from_html(html)
                        return {
                            "content": json_data,
                            "metadata": {
                                "url": str(response.url),
                                "content_type": content_type,
                                "status_code": response.status
                            }
                        }
                    else:
                        return {"error": f"Invalid extract_mode: {extract_mode}"}
                
    except aiohttp.ClientError as e:
        logger.error(f"HTTP error in fetch_url: {e}")
        return {"error": f"HTTP request failed: {str(e)}"}
    except Exception as e:
        logger.error(f"Error in fetch_url: {e}")
        return {"error": f"URL fetch failed: {str(e)}"}

def _extract_text_from_html(html: str) -> str:
    """Extract readable text content from HTML"""
    try:
        soup = BeautifulSoup(html, "html.parser")
        
        # Remove script and style elements
        for script in soup(["script", "style", "noscript", "iframe", "head"]):
            script.extract()
        
        # Get text
        text = soup.get_text(separator="\n", strip=True)
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = "\n".join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        logger.error(f"Error extracting text from HTML: {e}")
        return ""

def _extract_metadata_from_html(html: str, url: str) -> Dict[str, Any]:
    """Extract metadata from HTML (title, description, etc.)"""
    try:
        soup = BeautifulSoup(html, "html.parser")
        metadata = {
            "url": url,
            "title": "",
            "description": "",
            "keywords": [],
            "canonical": "",
            "og_data": {},
            "twitter_data": {}
        }
        
        # Extract title
        title_tag = soup.find("title")
        metadata["title"] = title_tag.text.strip() if title_tag else ""
        
        # Extract meta tags
        for meta in soup.find_all("meta"):
            name = meta.get("name", "").lower()
            property_name = meta.get("property", "").lower()
            content = meta.get("content", "")
            
            if name == "description":
                metadata["description"] = content
            elif name == "keywords":
                metadata["keywords"] = [k.strip() for k in content.split(",")]
            
            # OpenGraph metadata
            if property_name.startswith("og:"):
                key = property_name[3:]
                metadata["og_data"][key] = content
            
            # Twitter card metadata
            if property_name.startswith("twitter:"):
                key = property_name[8:]
                metadata["twitter_data"][key] = content
        
        # Extract canonical URL
        canonical = soup.find("link", {"rel": "canonical"})
        if canonical:
            metadata["canonical"] = canonical.get("href", "")
        
        return metadata
    except Exception as e:
        logger.error(f"Error extracting metadata from HTML: {e}")
        return {"url": url, "error": str(e)}

def _extract_json_from_html(html: str) -> Dict[str, Any]:
    """Extract JSON data from HTML (e.g., JSON-LD scripts)"""
    try:
        soup = BeautifulSoup(html, "html.parser")
        json_data = {}
        
        # Look for JSON-LD scripts
        json_ld_scripts = soup.find_all("script", {"type": "application/ld+json"})
        if json_ld_scripts:
            json_ld_data = []
            for script in json_ld_scripts:
                try:
                    data = json.loads(script.string)
                    json_ld_data.append(data)
                except (json.JSONDecodeError, TypeError):
                    pass
            
            if json_ld_data:
                json_data["json_ld"] = json_ld_data
        
        # Look for other JSON in script tags
        script_tags = soup.find_all("script")
        for script in script_tags:
            if script.string and "=" in script.string:
                # Look for JSON object assignments
                matches = re.findall(r'(\w+)\s*=\s*({.+?});', script.string, re.DOTALL)
                for var_name, json_str in matches:
                    try:
                        data = json.loads(json_str)
                        if isinstance(data, dict) and len(data) > 2:  # Only include non-trivial objects
                            json_data[var_name] = data
                    except (json.JSONDecodeError, TypeError):
                        pass
        
        return json_data
    except Exception as e:
        logger.error(f"Error extracting JSON from HTML: {e}")
        return {}
