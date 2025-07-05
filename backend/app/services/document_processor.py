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
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP
    
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
        """Process CSV file with improved memory handling and optimized chunking"""
        documents = []
        
        try:
            # Get file size to determine processing strategy
            file_size = os.path.getsize(file_path)
            file_size_mb = file_size / (1024 * 1024)
            
            # For large files (>2MB), use more aggressive chunking
            if file_size_mb > 2:
                # Read CSV in chunks to avoid memory issues
                chunk_size = 1000  # Process 1000 rows at a time
                total_rows = 0
                current_chunk_content = []
                chunk_counter = 1
                
                for chunk in pd.read_csv(file_path, chunksize=chunk_size):
                    for idx, row in chunk.iterrows():
                        # Limit total rows to prevent memory issues
                        if total_rows >= settings.MAX_CSV_ROWS:
                            break
                            
                        # Combine all columns into a single text
                        row_text = " | ".join([f"{col}: {str(val)}" for col, val in row.items() if pd.notna(val)])
                        
                        if row_text.strip():
                            current_chunk_content.append(row_text)
                            
                            # Create a chunk every 50 rows for large files to reduce total chunks
                            if len(current_chunk_content) >= 50:
                                combined_text = "\n".join(current_chunk_content)
                                documents.append({
                                    'content': combined_text,
                                    'source': os.path.basename(file_path),
                                    'type': 'csv',
                                    'title': f"Chunk {chunk_counter} (Rows {total_rows - len(current_chunk_content) + 1}-{total_rows})",
                                    'chunk': chunk_counter,
                                    'rows': f"{total_rows - len(current_chunk_content) + 1}-{total_rows}"
                                })
                                current_chunk_content = []
                                chunk_counter += 1
                        
                        total_rows += 1
                    
                    if total_rows >= settings.MAX_CSV_ROWS:
                        break
                
                # Add remaining content as final chunk
                if current_chunk_content:
                    combined_text = "\n".join(current_chunk_content)
                    documents.append({
                        'content': combined_text,
                        'source': os.path.basename(file_path),
                        'type': 'csv',
                        'title': f"Chunk {chunk_counter} (Rows {total_rows - len(current_chunk_content) + 1}-{total_rows})",
                        'chunk': chunk_counter,
                        'rows': f"{total_rows - len(current_chunk_content) + 1}-{total_rows}"
                    })
                        
            else:
                # For smaller files, read normally but still optimize chunking
                df = pd.read_csv(file_path)
                
                # Process each row (limit to MAX_CSV_ROWS)
                current_chunk_content = []
                chunk_counter = 1
                
                for idx, row in df.iterrows():
                    if idx >= settings.MAX_CSV_ROWS:
                        break
                        
                    # Combine all columns into a single text
                    row_text = " | ".join([f"{col}: {str(val)}" for col, val in row.items() if pd.notna(val)])
                    
                    if row_text.strip():
                        current_chunk_content.append(row_text)
                        
                        # Create a chunk every 20 rows for smaller files
                        if len(current_chunk_content) >= 20:
                            combined_text = "\n".join(current_chunk_content)
                            documents.append({
                                'content': combined_text,
                                'source': os.path.basename(file_path),
                                'type': 'csv',
                                'title': f"Chunk {chunk_counter} (Rows {idx - len(current_chunk_content) + 1}-{idx + 1})",
                                'chunk': chunk_counter,
                                'rows': f"{idx - len(current_chunk_content) + 1}-{idx + 1}"
                            })
                            current_chunk_content = []
                            chunk_counter += 1
                
                # Add remaining content as final chunk
                if current_chunk_content:
                    combined_text = "\n".join(current_chunk_content)
                    documents.append({
                        'content': combined_text,
                        'source': os.path.basename(file_path),
                        'type': 'csv',
                        'title': f"Chunk {chunk_counter} (Rows {len(df) - len(current_chunk_content) + 1}-{len(df)})",
                        'chunk': chunk_counter,
                        'rows': f"{len(df) - len(current_chunk_content) + 1}-{len(df)}"
                    })
                        
        except Exception as e:
            # If pandas fails, try reading as text with limits
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    lines = file.readlines()
                    current_chunk_content = []
                    chunk_counter = 1
                    
                    for idx, line in enumerate(lines):
                        if idx >= settings.MAX_CSV_ROWS:
                            break
                        if line.strip():
                            current_chunk_content.append(line.strip())
                            
                            # Create chunks every 50 lines for text fallback
                            if len(current_chunk_content) >= 50:
                                combined_text = "\n".join(current_chunk_content)
                                documents.append({
                                    'content': combined_text,
                                    'source': os.path.basename(file_path),
                                    'type': 'csv',
                                    'title': f"Chunk {chunk_counter} (Lines {idx - len(current_chunk_content) + 1}-{idx + 1})",
                                    'chunk': chunk_counter,
                                    'lines': f"{idx - len(current_chunk_content) + 1}-{idx + 1}"
                                })
                                current_chunk_content = []
                                chunk_counter += 1
                    
                    # Add remaining content
                    if current_chunk_content:
                        combined_text = "\n".join(current_chunk_content)
                        documents.append({
                            'content': combined_text,
                            'source': os.path.basename(file_path),
                            'type': 'csv',
                            'title': f"Chunk {chunk_counter} (Lines {len(lines) - len(current_chunk_content) + 1}-{len(lines)})",
                            'chunk': chunk_counter,
                            'lines': f"{len(lines) - len(current_chunk_content) + 1}-{len(lines)}"
                        })
            except Exception as text_error:
                raise Exception(f"Failed to process CSV file: {str(e)}. Text fallback also failed: {str(text_error)}")
        
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