import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { searchAPI } from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    documentTypes: [],
    categories: [],
    similarityThreshold: 0.7,
    useRAG: true
  });

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await searchAPI.search({
        query: query.trim(),
        top_k: 5,
        document_types: filters.documentTypes.length > 0 ? filters.documentTypes : undefined,
        categories: filters.categories.length > 0 ? filters.categories : undefined,
        similarity_threshold: filters.similarityThreshold,
        use_rag: filters.useRAG
      });

      setResults(response);
    } catch (err) {
      setError(err.message || 'An error occurred during search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
  };

  const renderSearchResults = () => {
    if (!results) return null;

    if (results.response_type === 'rag') {
      return (
        <div className="search-results">
          {/* RAG Answer */}
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={20} />
                AI Answer
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Confidence: {(results.confidence_score * 100).toFixed(1)}%</span>
                <span>{results.total_results} sources</span>
              </div>
            </div>
            <div className="markdown-content">
              <ReactMarkdown>{results.answer}</ReactMarkdown>
            </div>
          </div>

          {/* Sources */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <FileText className="text-green-600" size={20} />
                Sources
              </h3>
            </div>
            <div className="space-y-4">
              {results.sources.map((source, index) => (
                <div key={index} className="result-item">
                  <div className="result-title">{source.title}</div>
                  <div className="result-content">{source.content}</div>
                  <div className="result-meta">
                    <span className="result-score">
                      {(source.similarity_score * 100).toFixed(1)}% match
                    </span>
                    <span>{source.document_type}</span>
                    {source.category && <span>{source.category}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="search-results">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Search Results ({results.total_results})
              </h3>
            </div>
            <div className="space-y-4">
              {results.results.map((result, index) => (
                <div key={index} className="result-item">
                  <div className="result-title">{result.title}</div>
                  <div className="result-content">{result.content}</div>
                  <div className="result-meta">
                    <span className="result-score">
                      {(result.similarity_score * 100).toFixed(1)}% match
                    </span>
                    <span>{result.document_type}</span>
                    {result.category && <span>{result.category}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderSuggestions = () => {
    if (!results?.suggested_queries?.length) return null;

    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={20} />
            Suggested Queries
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {results.suggested_queries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* Search Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Search Knowledge Base</h2>
          <p className="card-subtitle">
            Ask questions in natural language and get intelligent answers
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="search-container">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question or search for information..."
                className="search-input flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-lg"
                disabled={loading || !query.trim()}
              >
                <SearchIcon size={20} />
                Search
              </button>
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-sm"
            >
              <Filter size={16} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.useRAG}
                onChange={(e) => setFilters({ ...filters, useRAG: e.target.checked })}
                className="rounded"
              />
              Use AI-powered answers (RAG)
            </label>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="form-group">
                <label className="form-label">Document Types</label>
                <select
                  multiple
                  value={filters.documentTypes}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({ ...filters, documentTypes: values });
                  }}
                  className="form-input form-select"
                >
                  <option value="kb_article">Knowledge Base Articles</option>
                  <option value="support_case">Support Cases</option>
                  <option value="pdf">PDF Documents</option>
                  <option value="csv">CSV Files</option>
                  <option value="txt">Text Files</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Categories</label>
                <select
                  multiple
                  value={filters.categories}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({ ...filters, categories: values });
                  }}
                  className="form-input form-select"
                >
                  <option value="Authentication">Authentication</option>
                  <option value="Installation">Installation</option>
                  <option value="Troubleshooting">Troubleshooting</option>
                  <option value="Administration">Administration</option>
                  <option value="Data Management">Data Management</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Similarity Threshold: {filters.similarityThreshold}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.similarityThreshold}
                  onChange={(e) => setFilters({ ...filters, similarityThreshold: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span className="ml-3">Searching...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card">
          <div className="text-red-600 text-center">
            <p className="font-semibold">Error</p>
            <p>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <>
          {renderSearchResults()}
          {renderSuggestions()}
        </>
      )}

      {/* Empty State */}
      {!results && !loading && query && (
        <div className="card text-center">
          <div className="text-gray-500">
            <SearchIcon size={48} className="mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No results found</p>
            <p>Try adjusting your search terms or filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 