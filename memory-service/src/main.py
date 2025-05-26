import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import logging

# Import modules
from modules.vector.controllers import vector_router
from modules.graph.controllers import graph_router
from modules.cache.controllers import cache_router
from modules.shared.config import get_settings

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("memory-service")

# Define startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to databases
    logger.info("Starting up memory service...")
    try:
        # Additional startup logic can be placed here
        pass
    except Exception as e:
        logger.error(f"Error during startup: {e}")
    
    yield
    
    # Shutdown: Disconnect from databases
    logger.info("Shutting down memory service...")
    try:
        # Additional shutdown logic can be placed here
        pass
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Create FastAPI app
app = FastAPI(
    title="Alpha Memory Service",
    description="Microservice for managing vector, graph, and cache memories for the Alpha platform",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(vector_router, prefix="/api/vector", tags=["Vector Memory"])
app.include_router(graph_router, prefix="/api/graph", tags=["Graph Memory"])
app.include_router(cache_router, prefix="/api/cache", tags=["Cache Memory"])

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "memory-service"}

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Alpha Memory Service API",
        "docs": "/docs",
        "health": "/health"
    }

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred"}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "3003"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
