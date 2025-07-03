import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload, FileText, Brain, Zap, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="card text-center">
        <div className="card-header">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to RAG Support Search
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Intelligent document search and retrieval powered by AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg">
            <Search className="text-blue-600 mb-4" size={48} />
            <h3 className="font-semibold mb-2">Smart Search</h3>
            <p className="text-sm text-gray-600 text-center">
              Find relevant information using natural language queries
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-green-50 rounded-lg">
            <Brain className="text-green-600 mb-4" size={48} />
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600 text-center">
              Get intelligent answers based on your knowledge base
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-purple-50 rounded-lg">
            <Zap className="text-purple-600 mb-4" size={48} />
            <h3 className="font-semibold mb-2">Fast & Accurate</h3>
            <p className="text-sm text-gray-600 text-center">
              Quick results with high relevance scores
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/search" className="btn btn-lg">
            <Search size={20} />
            Start Searching
          </Link>
          <Link to="/upload" className="btn btn-outline btn-lg">
            <Upload size={20} />
            Upload Documents
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Supported File Types</h2>
            <p className="card-subtitle">
              Upload and process various document formats
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <div>
                <h4 className="font-semibold">CSV Files</h4>
                <p className="text-sm text-gray-600">
                  Knowledge base articles and support cases
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FileText className="text-green-600" size={20} />
              <div>
                <h4 className="font-semibold">PDF Documents</h4>
                <p className="text-sm text-gray-600">
                  Manuals, guides, and technical documentation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FileText className="text-purple-600" size={20} />
              <div>
                <h4 className="font-semibold">Text Files</h4>
                <p className="text-sm text-gray-600">
                  Support cases and general documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Key Features</h2>
            <p className="card-subtitle">
              What makes our system powerful
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="text-blue-600" size={20} />
              <div>
                <h4 className="font-semibold">RAG Technology</h4>
                <p className="text-sm text-gray-600">
                  Retrieval-Augmented Generation for accurate answers
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Search className="text-green-600" size={20} />
              <div>
                <h4 className="font-semibold">Semantic Search</h4>
                <p className="text-sm text-gray-600">
                  Find relevant content using meaning, not just keywords
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="text-purple-600" size={20} />
              <div>
                <h4 className="font-semibold">Secure & Private</h4>
                <p className="text-sm text-gray-600">
                  Your data stays on your infrastructure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
          <p className="card-subtitle">
            Get started with these common tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/search?q=How do I reset my password" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-semibold mb-2">Password Reset</h4>
            <p className="text-sm text-gray-600">
              Find password reset instructions
            </p>
          </Link>
          
          <Link 
            to="/search?q=Installation guide" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-semibold mb-2">Installation</h4>
            <p className="text-sm text-gray-600">
              Get installation instructions
            </p>
          </Link>
          
          <Link 
            to="/search?q=Troubleshooting" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-semibold mb-2">Troubleshooting</h4>
            <p className="text-sm text-gray-600">
              Common issues and solutions
            </p>
          </Link>
          
          <Link 
            to="/upload" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-semibold mb-2">Upload Files</h4>
            <p className="text-sm text-gray-600">
              Add new documents to the system
            </p>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">System Status</h2>
          <p className="card-subtitle">
            Current system statistics
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Documents Indexed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Search Chunks</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 