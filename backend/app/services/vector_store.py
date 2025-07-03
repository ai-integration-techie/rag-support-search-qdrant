import chromadb
import numpy as np
from typing import List, Dict, Any
import hashlib
import json

class VectorStore:
    def __init__(self, persist_directory: str = "./data/chroma"):
        """Initialize ChromaDB vector store"""
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
    
    def _simple_embedding(self, text: str) -> List[float]:
        """Simple hash-based embedding for demonstration"""
        # Create a simple embedding using hash
        hash_obj = hashlib.md5(text.encode())
        hash_bytes = hash_obj.digest()
        
        # Convert to 384-dimensional vector (similar to sentence-transformers)
        embedding = []
        for i in range(384):
            byte_idx = i % len(hash_bytes)
            embedding.append(float(hash_bytes[byte_idx]) / 255.0)
        
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = [x / norm for x in embedding]
        
        return embedding
    
    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        """Add documents to the vector store"""
        if not documents:
            return
        
        ids = []
        embeddings = []
        texts = []
        metadatas = []
        
        for doc in documents:
            doc_id = f"doc_{len(ids)}"
            ids.append(doc_id)
            
            # Create embedding
            embedding = self._simple_embedding(doc['content'])
            embeddings.append(embedding)
            
            texts.append(doc['content'])
            metadatas.append({
                'source': doc.get('source', ''),
                'type': doc.get('type', ''),
                'title': doc.get('title', '')
            })
        
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )
    
    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents"""
        query_embedding = self._simple_embedding(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=['documents', 'metadatas', 'distances']
        )
        
        documents = []
        if results['documents'] and results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                documents.append({
                    'content': doc,
                    'metadata': results['metadatas'][0][i],
                    'distance': results['distances'][0][i]
                })
        
        return documents
    
    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get all documents from the store"""
        results = self.collection.get()
        
        documents = []
        if results['documents']:
            for i, doc in enumerate(results['documents']):
                documents.append({
                    'content': doc,
                    'metadata': results['metadatas'][i],
                    'id': results['ids'][i]
                })
        
        return documents
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document by ID"""
        try:
            self.collection.delete(ids=[doc_id])
            return True
        except Exception:
            return False
    
    def clear_all(self) -> None:
        """Clear all documents from the store"""
        self.collection.delete(where={}) 