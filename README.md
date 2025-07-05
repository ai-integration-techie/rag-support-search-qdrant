# RAG Support Search 🔍

A powerful **Retrieval-Augmented Generation (RAG)** system that combines semantic search with AI-powered question answering. Upload your documents and get intelligent, context-aware answers!

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-purple.svg)](https://openai.com)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-orange.svg)](https://qdrant.tech)

## ✨ Features

- **🤖 AI-Powered Answers**: GPT-3.5-turbo generates human-like responses
- **🔍 Semantic Search**: Find relevant content using meaning, not just keywords
- **📄 Multi-Format Support**: Upload CSV, PDF, and TXT files (up to 50MB)
- **📊 Large File Handling**: Optimized processing for files up to 4MB+ with chunked reading
- **⚡ Real-time Processing**: Instant search and answer generation
- **🎨 Modern UI**: Beautiful React frontend with responsive design
- **🔧 Easy Setup**: Docker Compose for simple deployment
- **💾 Persistent Storage**: Qdrant vector database for reliable data storage
- **🔄 Robust Error Handling**: Graceful handling of collection conflicts and network issues

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RagSupportSearch
   ```

2. **Configure OpenAI API Key**
   Edit `docker-compose.yml` and update the OPENAI_API_KEY:
   ```yaml
   environment:
     - OPENAI_API_KEY=sk-your_actual_openai_api_key_here
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the Application**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:9000
   - Qdrant UI: http://localhost:6333
   - API Docs: http://localhost:9000/docs

### Manual Installation

1. **Start Backend**
   ```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
   ```

2. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm start
   ```

3. **Start Qdrant** (new terminal)
   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

4. **Configure OpenAI Key**
   Edit `backend/app/core/config.py`:
   ```python
   OPENAI_API_KEY: str = "sk-your_actual_openai_api_key_here"
   ```

### Quick Test

1. **Upload a document** at http://localhost:4000/upload
2. **Search with AI** at http://localhost:4000/search
3. **Ask questions** like "How do I reset my password?"

## 📚 Documentation

- **[📖 Complete Documentation](DOCUMENTATION.md)** - Comprehensive guide with setup, usage, and troubleshooting
- **[⚡ Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[🏗️ Technical Architecture](ARCHITECTURE.md)** - Detailed system design and components
- **[🔧 API Reference](DOCUMENTATION.md#api-reference)** - Complete API documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │◄──►│   FastAPI       │◄──►│   OpenAI API    │
│   (Frontend)    │    │   (Backend)     │    │   (LLM)         │
│   Port: 4000    │    │   Port: 9000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Qdrant        │
                       │   (Vector DB)   │
                       │   Port: 6333    │
                       └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **FastAPI** - High-performance Python API
- **Qdrant** - Vector database for semantic search
- **OpenAI API** - GPT-3.5-turbo for AI responses
- **Sentence Transformers** - Text embeddings

### Data Processing
- **Document Chunking** - Optimal text segmentation
- **Semantic Embeddings** - Meaning-based search
- **RAG Pipeline** - Retrieval-Augmented Generation

## 📁 Project Structure

```
RagSupportSearch/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   ├── data/               # Data storage
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json        # Node.js dependencies
├── qdrant_data/            # Qdrant persistent storage
├── docker-compose.yml      # Docker orchestration
├── DOCUMENTATION.md        # Complete documentation
├── QUICK_START.md          # Quick start guide
├── ARCHITECTURE.md         # Technical architecture
└── README.md              # This file
```

## 🔧 Configuration

### Docker Environment Variables
The application uses the following environment variables in `docker-compose.yml`:

```yaml
environment:
  - OPENAI_API_KEY=sk-your_openai_api_key_here
  - QDRANT_HOST=host.docker.internal
  - QDRANT_PORT=6333
  - UPLOAD_DIR=./data/uploads
  - MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
```

### Key Settings
- **Chunk Size**: 2000 characters (configurable)
- **Search Results**: Top 5 by default
- **File Size Limit**: 50MB
- **Supported Formats**: CSV, PDF, TXT
- **Vector Dimension**: 384 (all-MiniLM-L6-v2)

## 🚀 Usage Examples

### Upload Documents
```bash
# Via web interface
# Go to http://localhost:4000/upload

# Via API
curl -X POST http://localhost:9000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Search with AI
```bash
# Via web interface
# Go to http://localhost:4000/search

# Via API
curl -X POST http://localhost:9000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I reset my password?",
    "use_rag": true,
    "top_k": 5
  }'
```

### Manage Documents
```bash
# List all documents
curl http://localhost:9000/api/documents

# Get system stats
curl http://localhost:9000/api/stats

# Delete a document
curl -X DELETE http://localhost:9000/api/documents/{doc_id}

# Clear all documents
curl -X POST http://localhost:9000/api/documents/clear
```

## 🐛 Troubleshooting

### Common Issues

**Docker containers won't start?**
```bash
# Check if ports are available
docker-compose down
docker-compose up -d
```

**No AI responses?**
- Verify your OpenAI API key is correct in `docker-compose.yml`
- Check your OpenAI account has credits
- Ensure the backend is running on port 9000

**File upload encoding issues?**
```bash
# Convert CSV files to UTF-8 (macOS)
iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv
```

**Qdrant connection issues?**
- Ensure Qdrant is running on port 6333
- Check backend logs for connection errors
- Verify `host.docker.internal` is accessible (Mac/Windows)

### Port Configuration
- **Frontend**: 4000 (React)
- **Backend**: 9000 (FastAPI)
- **Qdrant**: 6333 (Vector Database)

## 🔄 Migration from ChromaDB

This project has been migrated from ChromaDB to Qdrant for improved:
- **Performance**: Faster vector operations
- **Scalability**: Better handling of large datasets
- **Reliability**: More robust error handling
- **Persistence**: Reliable data storage across restarts

## 📈 Performance

- **Search Speed**: Sub-second response times
- **File Processing**: Handles files up to 50MB
- **Concurrent Users**: Supports multiple simultaneous users
- **Memory Usage**: Optimized for efficient resource utilization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Need help?** Check the [Troubleshooting section](DOCUMENTATION.md#troubleshooting) in the full documentation or open an issue on GitHub. 