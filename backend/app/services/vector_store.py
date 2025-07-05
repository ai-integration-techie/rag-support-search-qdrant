import qdrant_client
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any
import uuid
import json

class VectorStore:
    def __init__(self, collection_name: str = "documents"):
        """Initialize Qdrant vector store with sentence transformers"""
        # Initialize Qdrant client (connects to Qdrant Docker on host)
        self.client = qdrant_client.QdrantClient(host="host.docker.internal", port=6333)
        self.collection_name = collection_name
        
        # Initialize sentence transformer model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create collection if it doesn't exist
        self._create_collection()
    
    def _create_collection(self):
        """Create the collection with proper configuration"""
        try:
            # Try to get collection info
            self.client.get_collection(self.collection_name)
        except Exception as e:
            # Only create if the error is not 'already exists' or 409
            if "already exists" in str(e) or "409" in str(e):
                # Collection already exists, do nothing
                return
            try:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=384,  # all-MiniLM-L6-v2 embedding size
                        distance=Distance.COSINE
                    )
                )
            except Exception as ce:
                if "already exists" in str(ce) or "409" in str(ce):
                    return
                raise ce
    
    def _get_embedding(self, text: str) -> List[float]:
        """Generate embedding using sentence transformers"""
        embedding = self.embedding_model.encode(text)
        return embedding.tolist()
    
    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        """Add documents to the vector store"""
        if not documents:
            return
        
        points = []
        
        for doc in documents:
            # Generate embedding
            embedding = self._get_embedding(doc['content'])
            
            # Create point
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    'content': doc['content'],
                    'source': doc.get('source', ''),
                    'type': doc.get('type', ''),
                    'title': doc.get('title', ''),
                    'metadata': doc
                }
            )
            points.append(point)
        
        # Add points in batches for better performance
        batch_size = 100
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.client.upsert(
                collection_name=self.collection_name,
                points=batch
            )
    
    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents"""
        # Generate query embedding
        query_embedding = self._get_embedding(query)
        
        # Search in Qdrant
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=n_results,
            with_payload=True
        )
        
        documents = []
        for result in search_results:
            documents.append({
                'content': result.payload['content'],
                'metadata': result.payload['metadata'],
                'distance': result.score,
                'id': result.id
            })
        
        return documents
    
    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get all documents from the store"""
        # Get all points from collection
        points = self.client.scroll(
            collection_name=self.collection_name,
            limit=10000,  # Adjust based on your needs
            with_payload=True
        )[0]
        
        documents = []
        for point in points:
            documents.append({
                'content': point.payload['content'],
                'metadata': point.payload['metadata'],
                'id': point.id
            })
        
        return documents
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document by ID"""
        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=[doc_id]
            )
            return True
        except Exception:
            return False
    
    def clear_all(self) -> None:
        """Clear all documents from the store"""
        try:
            self.client.delete_collection(self.collection_name)
            self._create_collection()
        except Exception:
            pass
    
    def get_stats(self) -> Dict[str, Any]:
        """Get collection statistics"""
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                'total_points': info.points_count,
                'vectors_count': info.vectors_count,
                'status': info.status
            }
        except Exception:
            return {'error': 'Could not get stats'} 