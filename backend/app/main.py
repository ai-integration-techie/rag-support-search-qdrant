from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api import documents, search, upload

# Create FastAPI app
app = FastAPI(
    title="RAG Support Search API",
    description="A comprehensive RAG system for searching through knowledge base articles and support cases",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:4000", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:4000", "http://localhost:9000", "http://127.0.0.1:9000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(search.router, prefix="/api", tags=["search"])
app.include_router(documents.router, prefix="/api", tags=["documents"])

# Ensure upload directory exists
os.makedirs("./data/uploads", exist_ok=True)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "RAG Support Search API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 