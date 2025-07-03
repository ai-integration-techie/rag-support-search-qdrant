from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.rag_service import RAGService
from app.core.config import settings
import os
import tempfile
from typing import Dict, Any

router = APIRouter()

# Initialize RAG service with API key from config
rag_service = RAGService(openai_api_key=settings.OPENAI_API_KEY)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Upload and process a document"""
    try:
        # Validate file type
        allowed_extensions = {'.pdf', '.csv', '.txt'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Determine file type
            file_type = file_extension[1:]  # Remove the dot
            
            # Process the file
            result = rag_service.upload_document(temp_file_path, file_type)
            
            if result["success"]:
                return {
                    "message": result["message"],
                    "filename": file.filename,
                    "chunks_processed": result["chunks_processed"],
                    "file_type": result["file_type"]
                }
            else:
                raise HTTPException(status_code=500, detail=result["message"])
                
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")



@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"} 