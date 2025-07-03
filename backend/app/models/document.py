from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class DocumentType(str, Enum):
    """Document type enumeration"""
    KB_ARTICLE = "kb_article"
    SUPPORT_CASE = "support_case"
    PDF = "pdf"
    CSV = "csv"
    TXT = "txt"

class DocumentStatus(str, Enum):
    """Document processing status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class DocumentBase(BaseModel):
    """Base document model"""
    title: str = Field(..., description="Document title")
    content: str = Field(..., description="Document content")
    document_type: DocumentType = Field(..., description="Type of document")
    category: Optional[str] = Field(None, description="Document category")
    tags: List[str] = Field(default_factory=list, description="Document tags")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class DocumentCreate(DocumentBase):
    """Model for creating a new document"""
    file_path: Optional[str] = Field(None, description="Path to uploaded file")
    file_name: Optional[str] = Field(None, description="Original file name")

class Document(DocumentBase):
    """Complete document model with ID and timestamps"""
    id: str = Field(..., description="Unique document ID")
    status: DocumentStatus = Field(default=DocumentStatus.PENDING, description="Processing status")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")
    file_path: Optional[str] = Field(None, description="Path to uploaded file")
    file_name: Optional[str] = Field(None, description="Original file name")
    chunk_count: int = Field(default=0, description="Number of text chunks")
    
    class Config:
        from_attributes = True

class DocumentChunk(BaseModel):
    """Model for document chunks"""
    id: str = Field(..., description="Chunk ID")
    document_id: str = Field(..., description="Parent document ID")
    content: str = Field(..., description="Chunk content")
    chunk_index: int = Field(..., description="Chunk position in document")
    embedding: Optional[List[float]] = Field(None, description="Vector embedding")
    
    class Config:
        from_attributes = True

class SearchResult(BaseModel):
    """Model for search results"""
    document_id: str = Field(..., description="Document ID")
    title: str = Field(..., description="Document title")
    content: str = Field(..., description="Relevant content snippet")
    similarity_score: float = Field(..., description="Similarity score")
    document_type: DocumentType = Field(..., description="Document type")
    category: Optional[str] = Field(None, description="Document category")
    chunk_index: int = Field(..., description="Chunk index")
    
    class Config:
        from_attributes = True

class SearchQuery(BaseModel):
    """Model for search queries"""
    query: str = Field(..., description="Search query")
    top_k: int = Field(default=5, description="Number of results to return")
    document_types: Optional[List[DocumentType]] = Field(None, description="Filter by document types")
    categories: Optional[List[str]] = Field(None, description="Filter by categories")
    similarity_threshold: float = Field(default=0.7, description="Minimum similarity score")

class RAGResponse(BaseModel):
    """Model for RAG responses"""
    query: str = Field(..., description="Original query")
    answer: str = Field(..., description="Generated answer")
    sources: List[SearchResult] = Field(..., description="Source documents")
    confidence_score: float = Field(..., description="Confidence in the answer")
    
    class Config:
        from_attributes = True 