from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.services.vector_store import VectorStore
from app.services.document_processor import DocumentProcessor
import os

class RAGService:
    """Service for RAG (Retrieval-Augmented Generation) operations"""
    
    def __init__(self, openai_api_key: str):
        self.vector_store = VectorStore()
        self.document_processor = DocumentProcessor()
        self.openai_client = OpenAI(api_key=openai_api_key)
    
    def upload_document(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """Upload and process a document"""
        try:
            # Process the document
            documents = self.document_processor.process_file(file_path, file_type)
            
            # Add to vector store
            self.vector_store.add_documents(documents)
            
            return {
                "success": True,
                "message": f"Successfully processed {len(documents)} document chunks",
                "chunks_processed": len(documents),
                "file_type": file_type
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error processing document: {str(e)}"
            }
    
    def search_documents(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant documents"""
        try:
            results = self.vector_store.search(query, n_results=top_k)
            return results
        except Exception as e:
            return []
    
    def generate_response(self, query: str, context_documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate AI response using retrieved context"""
        try:
            if not context_documents:
                return {
                    "success": False,
                    "message": "No relevant documents found to generate response"
                }
            
            # Prepare context from retrieved documents
            context = "\n\n".join([doc['content'] for doc in context_documents])
            
            # Create prompt for OpenAI
            prompt = f"""Based on the following context, please provide a helpful and accurate response to the user's question.

Context:
{context}

User Question: {query}

Please provide a comprehensive answer based on the context provided. If the context doesn't contain enough information to answer the question, please say so."""

            # Generate response using OpenAI
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that provides accurate information based on the given context."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            return {
                "success": True,
                "response": ai_response,
                "sources": [doc['metadata'] for doc in context_documents],
                "context_used": len(context_documents)
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error generating response: {str(e)}"
            }
    
    def search_and_generate(self, query: str, top_k: int = 5) -> Dict[str, Any]:
        """Search for documents and generate a response"""
        try:
            # Search for relevant documents
            search_results = self.search_documents(query, top_k)
            
            if not search_results:
                return {
                    "success": False,
                    "message": "No relevant documents found",
                    "search_results": []
                }
            
            # Generate AI response
            response = self.generate_response(query, search_results)
            
            return {
                "success": True,
                "search_results": search_results,
                "ai_response": response.get("response", ""),
                "sources": response.get("sources", []),
                "context_used": response.get("context_used", 0)
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error in search and generate: {str(e)}"
            }
    
    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get all documents from the vector store"""
        try:
            return self.vector_store.get_all_documents()
        except Exception as e:
            return []
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the vector store"""
        try:
            return self.vector_store.delete_document(doc_id)
        except Exception:
            return False
    
    def clear_all_documents(self) -> bool:
        """Clear all documents from the vector store"""
        try:
            self.vector_store.clear_all()
            return True
        except Exception:
            return False 