import os
import pandas as pd
import PyPDF2
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
import re

from app.models.document import Document, DocumentCreate, DocumentType, DocumentStatus, DocumentChunk
from app.core.config import settings

class DocumentProcessor:
    """Service for processing different document types"""
    
    def __init__(self):
        self.chunk_size = 1000
        self.chunk_overlap = 200
    
    def process_file(self, file_path: str, file_type: str) -> List[Dict[str, Any]]:
        """Process a file and return document chunks"""
        try:
            if file_type.lower() == 'pdf':
                return self._process_pdf(file_path)
            elif file_type.lower() == 'csv':
                return self._process_csv(file_path)
            elif file_type.lower() == 'txt':
                return self._process_txt(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        except Exception as e:
            raise Exception(f"Error processing file {file_path}: {str(e)}")
    
    def _process_pdf(self, file_path: str) -> List[Dict[str, Any]]:
        """Process PDF file"""
        documents = []
        
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                if text.strip():
                    # Split text into chunks
                    chunks = self._split_text(text)
                    
                    for chunk_idx, chunk in enumerate(chunks):
                        documents.append({
                            'content': chunk,
                            'source': os.path.basename(file_path),
                            'type': 'pdf',
                            'title': f"Page {page_num + 1} - Chunk {chunk_idx + 1}",
                            'page': page_num + 1,
                            'chunk': chunk_idx + 1
                        })
        
        return documents
    
    def _process_csv(self, file_path: str) -> List[Dict[str, Any]]:
        """Process CSV file"""
        documents = []
        
        try:
            df = pd.read_csv(file_path)
            
            # Process each row
            for idx, row in df.iterrows():
                # Combine all columns into a single text
                row_text = " | ".join([f"{col}: {str(val)}" for col, val in row.items() if pd.notna(val)])
                
                if row_text.strip():
                    documents.append({
                        'content': row_text,
                        'source': os.path.basename(file_path),
                        'type': 'csv',
                        'title': f"Row {idx + 1}",
                        'row': idx + 1
                    })
        except Exception as e:
            # If pandas fails, try reading as text
            with open(file_path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
                for idx, line in enumerate(lines):
                    if line.strip():
                        documents.append({
                            'content': line.strip(),
                            'source': os.path.basename(file_path),
                            'type': 'csv',
                            'title': f"Line {idx + 1}",
                            'line': idx + 1
                        })
        
        return documents
    
    def _process_txt(self, file_path: str) -> List[Dict[str, Any]]:
        """Process text file"""
        documents = []
        
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
            
            if text.strip():
                # Split text into chunks
                chunks = self._split_text(text)
                
                for chunk_idx, chunk in enumerate(chunks):
                    documents.append({
                        'content': chunk,
                        'source': os.path.basename(file_path),
                        'type': 'txt',
                        'title': f"Chunk {chunk_idx + 1}",
                        'chunk': chunk_idx + 1
                    })
        
        return documents
    
    def _split_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        if len(text) <= self.chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # Try to break at a sentence boundary
            if end < len(text):
                # Look for sentence endings
                sentence_endings = ['.', '!', '?', '\n\n']
                for ending in sentence_endings:
                    pos = text.rfind(ending, start, end)
                    if pos > start + self.chunk_size // 2:  # Only break if it's not too early
                        end = pos + 1
                        break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start position with overlap
            start = end - self.chunk_overlap
            if start >= len(text):
                break
        
        return chunks
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)]', '', text)
        
        return text.strip()

    def chunk_document(self, document: Document) -> List[DocumentChunk]:
        """Split document into chunks for vector search"""
        chunks = []
        content = document.content
        
        # Simple text chunking
        words = content.split()
        current_chunk = []
        chunk_index = 0
        
        for word in words:
            current_chunk.append(word)
            
            if len(' '.join(current_chunk)) >= self.chunk_size:
                chunk_content = ' '.join(current_chunk)
                chunk = DocumentChunk(
                    id=str(uuid.uuid4()),
                    document_id=document.id,
                    content=chunk_content,
                    chunk_index=chunk_index
                )
                chunks.append(chunk)
                
                # Keep overlap for next chunk
                overlap_words = current_chunk[-self.chunk_overlap//10:]  # Approximate overlap
                current_chunk = overlap_words
                chunk_index += 1
        
        # Add remaining content as final chunk
        if current_chunk:
            chunk_content = ' '.join(current_chunk)
            chunk = DocumentChunk(
                id=str(uuid.uuid4()),
                document_id=document.id,
                content=chunk_content,
                chunk_index=chunk_index
            )
            chunks.append(chunk)
        
        return chunks 