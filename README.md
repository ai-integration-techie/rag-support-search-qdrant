# RAG Support Search 🔍

A powerful **Retrieval-Augmented Generation (RAG)** system that combines semantic search with AI-powered question answering. Upload your documents and get intelligent, context-aware answers!

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-purple.svg)](https://openai.com)

## ✨ Features

- **🤖 AI-Powered Answers**: GPT-3.5-turbo generates human-like responses
- **🔍 Semantic Search**: Find relevant content using meaning, not just keywords
- **📄 Multi-Format Support**: Upload CSV, PDF, and TXT files
- **⚡ Real-time Processing**: Instant search and answer generation
- **🎨 Modern UI**: Beautiful React frontend with responsive design
- **🔧 Easy Setup**: Simple installation and configuration

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ and Node.js 16+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RagSupportSearch
   ```

2. **Start Backend**
   ```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
   ```

3. **Start Frontend** (new terminal)
   ```bash
   cd frontend
   npm start
   ```

4. **Configure OpenAI Key**
   Edit `backend/app/core/config.py`:
   ```python
   OPENAI_API_KEY: str = "sk-your_actual_openai_api_key_here"
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8001/docs

### Quick Test

1. **Upload a document** at http://localhost:3000/upload
2. **Search with AI** at http://localhost:3000/search
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
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   ChromaDB      │
                       │   (Vector DB)   │
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
- **ChromaDB** - Vector database for semantic search
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
├── DOCUMENTATION.md        # Complete documentation
├── QUICK_START.md          # Quick start guide
├── ARCHITECTURE.md         # Technical architecture
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
MAX_TOKENS=500
CHROMA_DB_PATH=./data/chroma_db
UPLOAD_DIR=./data/uploads
MAX_FILE_SIZE=52428800
```

### Key Settings
- **Chunk Size**: 1000 characters (configurable)
- **Search Results**: Top 5 by default
- **File Size Limit**: 50MB
- **Supported Formats**: CSV, PDF, TXT

## 🚀 Usage Examples

### Upload Documents
```bash
# Via web interface
# Go to http://localhost:3000/upload

# Via API
curl -X POST http://localhost:8001/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

### Search with AI
```bash
# Via web interface
# Go to http://localhost:3000/search

# Via API
curl -X POST http://localhost:8001/api/search \
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
curl http://localhost:8001/api/documents

# Delete a document
curl -X DELETE http://localhost:8001/api/documents/{doc_id}

# Clear all documents
curl -X POST http://localhost:8001/api/documents/clear
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start?**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**No AI responses?**
- Verify your OpenAI API key is correct
- Check your OpenAI account has credits

**Frontend proxy error?**
- Ensure backend is running on port 8001
- Check that both services are started

**File upload fails?**
- Check file size (max 50MB)
- Verify file format (CSV, PDF, TXT)

### Getting Help
1. Check the [Troubleshooting section](DOCUMENTATION.md#troubleshooting)
2. Review the [API documentation](http://localhost:8001/docs)
3. Check the browser console for frontend errors
4. Check the terminal for backend logs

## 🔒 Security

- **API Key Security**: Environment variable storage
- **File Upload Validation**: Type and size restrictions
- **CORS Configuration**: Restricted origins
- **Input Validation**: Pydantic model validation
- **Error Handling**: Sanitized error messages

## 📈 Performance

- **Async Processing**: FastAPI async endpoints
- **Vector Search**: Optimized similarity search
- **Chunking**: Efficient document processing
- **Caching**: Vector similarity caching

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Frontend
cd frontend && npm start
```

### Production
```bash
# Backend with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend build
npm run build
```

### Docker
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-3.5-turbo
- [ChromaDB](https://chromadb.com) for vector storage
- [FastAPI](https://fastapi.tiangolo.com) for the backend framework
- [React](https://reactjs.org) for the frontend framework

---

**Made with ❤️ for intelligent document search and AI-powered answers**

**Version**: 1.0.0  
**Last Updated**: January 2025 