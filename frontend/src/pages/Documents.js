import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, BarChart3, AlertTriangle } from 'lucide-react';
import { documentsAPI } from '../services/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    documentType: '',
    category: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentsResponse, statsResponse] = await Promise.all([
        documentsAPI.listDocuments(),
        documentsAPI.getStats(),
      ]);
      
      setDocuments(documentsResponse.documents || []);
      setStats(statsResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsAPI.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      alert('Error deleting document: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all documents? This action cannot be undone.')) {
      return;
    }

    try {
      await documentsAPI.clearAllDocuments();
      setDocuments([]);
      setStats(prev => ({ ...prev, total_documents: 0, total_chunks: 0 }));
    } catch (err) {
      alert('Error clearing documents: ' + err.message);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filters.documentType && doc.document_type !== filters.documentType) {
      return false;
    }
    if (filters.category && doc.category !== filters.category) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <span className="ml-3">Loading documents...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="text-red-600 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4" />
            <p className="font-semibold">Error Loading Documents</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Stats Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} />
            System Statistics
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats?.total_documents || 0}
            </div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats?.total_chunks || 0}
            </div>
            <div className="text-sm text-gray-600">Search Chunks</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats?.vector_store?.embedding_model?.split('/').pop() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Embedding Model</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {stats?.chunk_size || 1000}
            </div>
            <div className="text-sm text-gray-600">Chunk Size</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Document Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Document Type</label>
            <select
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
              className="form-input form-select"
            >
              <option value="">All Types</option>
              <option value="kb_article">Knowledge Base Articles</option>
              <option value="support_case">Support Cases</option>
              <option value="pdf">PDF Documents</option>
              <option value="csv">CSV Files</option>
              <option value="txt">Text Files</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="form-input form-select"
            >
              <option value="">All Categories</option>
              <option value="Authentication">Authentication</option>
              <option value="Installation">Installation</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Administration">Administration</option>
              <option value="Data Management">Data Management</option>
              <option value="Support">Support</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="card-title">
              Documents ({filteredDocuments.length})
            </h3>
            {documents.length > 0 && (
              <button
                onClick={handleClearAll}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">
              {documents.length === 0 ? 'No documents uploaded yet' : 'No documents match the current filters'}
            </p>
            {documents.length === 0 && (
              <p className="text-sm text-gray-400">
                Upload some documents to get started
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="text-blue-600" size={20} />
                  
                  <div className="flex-1">
                    <div className="font-semibold">{doc.title || doc.content || 'Untitled Document'}</div>
                    <div className="text-sm text-gray-600">
                      {(doc.document_type || (doc.metadata && doc.metadata.type)) || 'Unknown Type'}
                      {' • '}
                      {doc.category || (doc.metadata && doc.metadata.category) || 'No category'}
                    </div>
                    {doc.chunk_count > 0 && (
                      <div className="text-xs text-gray-500">
                        {doc.chunk_count} chunks
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/api/documents/${doc.id}`, '_blank')}
                    className="btn btn-outline btn-sm"
                    title="View document"
                  >
                    <Eye size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vector Store Info */}
      {stats?.vector_store && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Vector Store Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Collection Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Name:</span>
                  <span>{stats.vector_store.collection_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Chunks:</span>
                  <span>{stats.vector_store.total_chunks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Embedding Model:</span>
                  <span>{stats.vector_store.embedding_model}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chunk Size:</span>
                  <span>{stats.chunk_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chunk Overlap:</span>
                  <span>{stats.chunk_overlap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database Path:</span>
                  <span className="text-xs">./data/chroma_db</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents; 