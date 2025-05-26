import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import logging

# Import modules
from modules.registry.controllers.registry_router import registry_router
from modules.executor.controllers.executor_router import executor_router
from modules.schemas.config import get_settings

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("tools-service")

# Define startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tool registry
    logger.info("Starting up tools service...")
    try:
        # Additional startup logic can be placed here
        pass
    except Exception as e:
        logger.error(f"Error during startup: {e}")
    
    yield
    
    # Shutdown: Cleanup
    logger.info("Shutting down tools service...")
    try:
        # Additional shutdown logic can be placed here
        pass
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Create FastAPI app
app = FastAPI(
    title="Alpha Tools Service",
    description="Microservice for managing and executing tools for the Alpha platform",
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
app.include_router(registry_router, prefix="/api/registry", tags=["Tool Registry"])
app.include_router(executor_router, prefix="/api/execute", tags=["Tool Execution"])

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "tools-service"}

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Alpha Tools Service API",
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
    port = int(os.getenv("PORT", "3004"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
