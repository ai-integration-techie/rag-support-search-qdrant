from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.rag_service import RAGService
from app.core.config import settings
import os
import tempfile
import asyncio
from typing import Dict, Any

router = APIRouter()

# Initialize RAG service with API key from config
rag_service = RAGService(openai_api_key=settings.OPENAI_API_KEY)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Upload and process a document with improved error handling and timeout management"""
    try:
        # Validate file type
        allowed_extensions = {'.pdf', '.csv', '.txt'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Check file size
        file_size = 0
        content = b""
        
        # Read file content in chunks to avoid memory issues
        chunk_size = 1024 * 1024  # 1MB chunks
        while chunk := await file.read(chunk_size):
            content += chunk
            file_size += len(chunk)
            
            # Check if file is too large
            if file_size > settings.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size allowed: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
                )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Determine file type
            file_type = file_extension[1:]  # Remove the dot
            
            # Process the file with timeout handling for large files
            file_size_mb = file_size / (1024 * 1024)
            
            # Set timeout based on file size (longer for larger files)
            if file_size_mb > 5:
                timeout_seconds = 600  # 10 minutes for files > 5MB
            elif file_size_mb > 2:
                timeout_seconds = 450  # 7.5 minutes for files > 2MB
            else:
                timeout_seconds = 300  # 5 minutes for smaller files
            
            # Process file with timeout
            try:
                result = await asyncio.wait_for(
                    asyncio.to_thread(rag_service.upload_document, temp_file_path, file_type),
                    timeout=timeout_seconds
                )
            except asyncio.TimeoutError:
                raise HTTPException(
                    status_code=408,
                    detail=f"Processing timeout. The file ({file_size_mb:.1f}MB) is too large or complex. Try splitting it into smaller files or contact support."
                )
            
            if result["success"]:
                return {
                    "message": result["message"],
                    "filename": file.filename,
                    "chunks_processed": result["chunks_processed"],
                    "file_type": result["file_type"],
                    "file_size_mb": round(file_size_mb, 2),
                    "processing_time_seconds": timeout_seconds
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
        # Provide more specific error messages
        error_msg = str(e)
        if "memory" in error_msg.lower():
            error_msg = "File is too large and caused memory issues. Try splitting it into smaller files."
        elif "timeout" in error_msg.lower():
            error_msg = "Processing timed out. The file may be too large or complex. Try splitting it into smaller files."
        elif "encoding" in error_msg.lower():
            error_msg = "File encoding issue. Please ensure the file uses UTF-8 encoding."
        elif "connection" in error_msg.lower():
            error_msg = "Database connection issue. Please try again."
        
        raise HTTPException(status_code=500, detail=f"Error uploading file: {error_msg}")

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"} 