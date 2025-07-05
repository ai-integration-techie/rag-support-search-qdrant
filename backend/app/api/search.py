from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import RAGService
from app.core.config import settings
from typing import Dict, Any

router = APIRouter()

# Initialize RAG service with API key from config
rag_service = RAGService(openai_api_key=settings.OPENAI_API_KEY)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    use_rag: bool = True

@router.post("/search")
async def search_documents(request: SearchRequest) -> Dict[str, Any]:
    """Search for documents"""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        if request.use_rag:
            # Use RAG to generate AI response
            result = rag_service.search_and_generate(request.query, request.top_k)
            
            if result["success"]:
                return {
                    "query": request.query,
                    "response_type": "rag",
                    "answer": result["ai_response"],
                    "sources": result["search_results"],
                    "total_results": len(result["search_results"]),
                    "confidence_score": 0.9,  # Placeholder confidence score
                    "suggested_queries": []  # Placeholder for suggestions
                }
            else:
                # Return a valid empty response instead of raising HTTPException
                return {
                    "query": request.query,
                    "response_type": "rag",
                    "answer": "",
                    "sources": [],
                    "total_results": 0,
                    "confidence_score": 0.0,
                    "suggested_queries": []
                }
        else:
            # Regular search without AI generation
            results = rag_service.search_documents(request.query, request.top_k)
            return {
                "query": request.query,
                "response_type": "search",
                "results": results,
                "total_results": len(results)
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching documents: {str(e)}")

@router.post("/search-and-generate")
async def search_and_generate(query: str, top_k: int = 5) -> Dict[str, Any]:
    """Search for documents and generate AI response"""
    try:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        result = rag_service.search_and_generate(query, top_k)
        
        if result["success"]:
            return {
                "query": query,
                "ai_response": result["ai_response"],
                "search_results": result["search_results"],
                "sources": result["sources"],
                "context_used": result["context_used"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["message"])
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in search and generate: {str(e)}")

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"} 