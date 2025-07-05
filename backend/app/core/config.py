from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "RAG Support Search"
    
    # Database Configuration
    QDRANT_DB_PATH: str = "./data/qdrant"
    
    # File Upload Configuration
    UPLOAD_DIR: str = "./data/uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: set = {".txt", ".pdf", ".csv"}
    
    # Model Configuration
    MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    CHUNK_SIZE: int = 2000  # Increased for better handling of large files
    CHUNK_OVERLAP: int = 400  # Increased overlap
    MAX_CSV_ROWS: int = 10000  # Limit CSV processing to prevent memory issues
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = "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"  # Replace with your actual API key
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    MAX_TOKENS: int = 500
    
    # Search Configuration
    TOP_K_RESULTS: int = 5
    SIMILARITY_THRESHOLD: float = 0.7
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.QDRANT_DB_PATH, exist_ok=True) 