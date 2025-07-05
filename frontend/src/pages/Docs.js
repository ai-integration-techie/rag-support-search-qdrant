import React, { useState } from 'react';
import { BookOpen, Play, FileText, Layers, ChevronRight, ExternalLink } from 'lucide-react';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('quick-start');

  const sections = [
    { id: 'quick-start', label: 'Quick Start', icon: Play },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'architecture', label: 'Architecture', icon: Layers }
  ];

  const QuickStartGuide = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Play className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Get your RAG Support Search system up and running in 5 minutes!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Docker and Docker Compose</li>
          <li>OpenAI API key (<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Get one here</a>)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Setup with Docker</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`# 1. Clone and configure
git clone [repository-url]
cd RagSupportSearch

# 2. Configure OpenAI API Key
# Edit docker-compose.yml and update:
environment:
  - OPENAI_API_KEY=sk-your_actual_openai_api_key_here

# 3. Start the application
docker-compose up -d

# 4. Access the Application
# Frontend: http://localhost:4000
# Backend API: http://localhost:9000
# Qdrant UI: http://localhost:6333`}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Test</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Upload a document at <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:4000/upload</code></li>
          <li>Search with AI at <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:4000/search</code></li>
          <li>Ask questions like "How do I reset my password?"</li>
        </ol>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="h-5 w-5 text-yellow-400">⚠</div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> CSV files must be UTF-8 encoded. If you get encoding errors, convert with:
              <code className="block mt-2 bg-yellow-100 px-2 py-1 rounded text-xs">iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const Documentation = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Comprehensive documentation for the RAG Support Search system
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <p className="text-gray-700 mb-4">
            RAG Support Search is a powerful document search and question-answering system that combines 
            <strong>Retrieval-Augmented Generation (RAG)</strong> with semantic search capabilities.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• AI-Powered Answers with GPT-3.5-turbo</li>
            <li>• Semantic Search using Qdrant vector database</li>
            <li>• Multi-format support (CSV, PDF, TXT)</li>
            <li>• Real-time processing and search</li>
            <li>• Modern React frontend with Docker deployment</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">🔍</span>
              <span><strong>Semantic Search:</strong> Find relevant content using meaning, not just keywords</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">🤖</span>
              <span><strong>AI Responses:</strong> GPT-3.5-turbo generates human-like answers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">📄</span>
              <span><strong>Multi-Format:</strong> Upload CSV, PDF, and TXT files up to 50MB</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">⚡</span>
              <span><strong>Real-time:</strong> Instant search and answer generation</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">💾</span>
              <span><strong>Persistent:</strong> Qdrant vector database for reliable storage</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Reference</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Upload Document</h4>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              POST /api/upload
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Search Documents</h4>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              POST /api/search
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Get Documents</h4>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              GET /api/documents
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">System Stats</h4>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              GET /api/stats
            </div>
          </div>
        </div>
        <div className="mt-4">
          <a 
            href="http://localhost:9000/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View Full API Documentation
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );

  const Architecture = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Layers className="h-5 w-5 text-purple-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-purple-700">
              System architecture and component overview
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Architecture</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900">React UI</div>
                <div className="text-xs text-blue-700">Port: 4000</div>
              </div>
              <ChevronRight className="text-gray-400" />
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-sm font-medium text-green-900">FastAPI</div>
                <div className="text-xs text-green-700">Port: 9000</div>
              </div>
              <ChevronRight className="text-gray-400" />
              <div className="bg-purple-100 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-900">OpenAI API</div>
                <div className="text-xs text-purple-700">GPT-3.5-turbo</div>
              </div>
            </div>
            <div className="flex justify-center">
              <ChevronRight className="text-gray-400 transform rotate-90" />
            </div>
            <div className="bg-orange-100 p-3 rounded-lg inline-block">
              <div className="text-sm font-medium text-orange-900">Qdrant</div>
              <div className="text-xs text-orange-700">Vector DB (Port: 6333)</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Frontend Layer</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• React 18 with functional components</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Axios for API communication</li>
              <li>• React Router for navigation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Backend Layer</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• FastAPI for high-performance API</li>
              <li>• Qdrant for vector storage</li>
              <li>• OpenAI API integration</li>
              <li>• Sentence Transformers for embeddings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Flow</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <span className="text-blue-900 text-sm font-medium">1</span>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Document Upload</h5>
              <p className="text-sm text-gray-600">User uploads file → Frontend → Backend → Document Processor → Vector Store → Qdrant</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <span className="text-green-900 text-sm font-medium">2</span>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Search Process</h5>
              <p className="text-sm text-gray-600">User query → Frontend → Backend → RAG Service → Vector Store → Qdrant → OpenAI → Response</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <span className="text-purple-900 text-sm font-medium">3</span>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">RAG Pipeline</h5>
              <p className="text-sm text-gray-600">Query → Embedding → Vector Search → Context Retrieval → LLM Generation → Response</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• React 18</li>
              <li>• Tailwind CSS</li>
              <li>• Axios</li>
              <li>• React Router</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• FastAPI</li>
              <li>• Qdrant</li>
              <li>• OpenAI API</li>
              <li>• Sentence Transformers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Infrastructure</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Docker</li>
              <li>• Docker Compose</li>
              <li>• Uvicorn</li>
              <li>• Volume Storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'quick-start':
        return <QuickStartGuide />;
      case 'documentation':
        return <Documentation />;
      case 'architecture':
        return <Architecture />;
      default:
        return <QuickStartGuide />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contents</h2>
              <ul className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {section.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6">
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs; 