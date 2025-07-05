from fastapi import APIRouter, HTTPException
from app.services.rag_service import RAGService
from app.core.config import settings
from typing import Dict, Any
import logging

router = APIRouter()

# Initialize RAG service with API key from config
rag_service = RAGService(openai_api_key=settings.OPENAI_API_KEY)

@router.get("/documents")
async def get_documents() -> Dict[str, Any]:
    """Get all documents"""
    try:
        documents = rag_service.get_all_documents()
        return {
            "documents": documents if documents is not None else [],
            "total_documents": len(documents) if documents is not None else 0
        }
    except Exception as e:
        logging.error(f"Error retrieving documents: {str(e)}")
        # Return a valid empty response instead of raising HTTPException
        return {
            "documents": [],
            "total_documents": 0,
            "error": f"Error retrieving documents: {str(e)}"
        }

@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str) -> Dict[str, Any]:
    """Delete a document"""
    try:
        success = rag_service.delete_document(doc_id)
        
        if success:
            return {
                "message": "Document deleted successfully",
                "doc_id": doc_id
            }
        else:
            raise HTTPException(status_code=404, detail="Document not found")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

@router.delete("/documents")
async def clear_all_documents() -> Dict[str, Any]:
    """Clear all documents"""
    try:
        success = rag_service.clear_all_documents()
        
        if success:
            return {
                "message": "All documents cleared successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Error clearing documents")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing documents: {str(e)}")

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"}

@router.get("/stats")
async def get_stats():
    """Return system statistics for the frontend dashboard (Qdrant version)."""
    try:
        stats = rag_service.vector_store.get_stats()
        documents = rag_service.get_all_documents()
        total_documents = len(documents)
        vector_store_info = {
            "collection_name": rag_service.vector_store.collection_name,
            "total_chunks": stats.get("total_points", 0),
            "embedding_model": "all-MiniLM-L6-v2",
            "status": stats.get("status", "unknown"),
        }
        return {
            "total_documents": total_documents,
            "total_chunks": stats.get("total_points", 0),
            "vector_store": vector_store_info,
            "chunk_size": 1000,  # update if dynamic
            "chunk_overlap": 200, # update if dynamic
            "database": "Qdrant"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}") 