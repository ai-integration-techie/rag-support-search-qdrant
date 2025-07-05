# RAG Support Search with Qdrant

A powerful **Retrieval-Augmented Generation (RAG)** system that combines semantic search with AI-powered question answering. Built with FastAPI, React, and Qdrant vector database.

![RAG Support Search](https://img.shields.io/badge/RAG-Support%20Search-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-orange)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## 🚀 Features

- **🤖 AI-Powered Answers**: GPT-3.5-turbo generates human-like responses
- **🔍 Semantic Search**: Find relevant content using meaning, not just keywords
- **📄 Multi-Format Support**: Upload CSV, PDF, and TXT files (up to 50MB)
- **⚡ Real-time Processing**: Instant search and answer generation
- **💾 Persistent Storage**: Qdrant vector database for reliable data storage
- **🐳 Docker Ready**: Complete containerized setup with Docker Compose
- **🎨 Modern UI**: Clean React frontend with Tailwind CSS
- **📊 Document Management**: View and manage uploaded documents

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React UI  │───▶│   FastAPI   │───▶│  OpenAI API │
│   (Port 4K) │    │  (Port 9K)  │    │ GPT-3.5-turbo│
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Qdrant    │
                   │ Vector DB   │
                   │ (Port 6333) │
                   └─────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

### Backend
- **FastAPI** - High-performance Python web framework
- **Qdrant** - Vector database for semantic search
- **OpenAI API** - GPT-3.5-turbo for text generation
- **Sentence Transformers** - Text embeddings

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Uvicorn** - ASGI server

## 📋 Prerequisites

- Docker and Docker Compose
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ai-integration-techie/rag-support-search-qdrant.git
cd rag-support-search-qdrant
```

### 2. Configure OpenAI API Key
Edit `docker-compose.yml` and update the environment variable:
```yaml
environment:
  - OPENAI_API_KEY=sk-your_actual_openai_api_key_here
```

### 3. Start the Application
```bash
docker-compose up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:9000
- **Qdrant UI**: http://localhost:6333
- **API Documentation**: http://localhost:9000/docs

## 📖 Usage

### 1. Upload Documents
- Navigate to the **Upload** page
- Select CSV, PDF, or TXT files (up to 50MB)
- Files are automatically processed and indexed

### 2. Search with AI
- Go to the **Search** page
- Ask questions in natural language
- Get AI-powered answers based on your documents

### 3. Manage Documents
- View uploaded documents in the **Documents** page
- See processing status and metadata

## 🔧 Configuration

### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional (defaults shown)
QDRANT_HOST=host.docker.internal
QDRANT_PORT=6333
MAX_FILE_SIZE=52428800  # 50MB
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

### Port Configuration
- **Frontend**: 4000
- **Backend**: 9000
- **Qdrant**: 6333

## 📚 API Reference

### Endpoints
- `POST /api/upload` - Upload documents
- `POST /api/search` - Search documents
- `GET /api/documents` - List documents
- `GET /api/stats` - System statistics

### Example Search Request
```bash
curl -X POST "http://localhost:9000/api/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I reset my password?"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **CSV Encoding Errors**
   ```bash
   # Convert to UTF-8
   iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv
   ```

2. **Port Conflicts**
   - Change ports in `docker-compose.yml`
   - Ensure ports 4000, 9000, and 6333 are available

3. **OpenAI API Errors**
   - Verify API key is correct
   - Check API quota and billing

4. **Large File Upload Timeouts**
   - Files are automatically processed with dynamic timeouts
   - Maximum file size: 50MB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-3.5-turbo
- [Qdrant](https://qdrant.tech/) for vector database
- [FastAPI](https://fastapi.tiangolo.com/) for the web framework
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ai-integration-techie/rag-support-search-qdrant/issues)
- **Documentation**: [Wiki](https://github.com/ai-integration-techie/rag-support-search-qdrant/wiki)
- **Email**: hiren.shah@gmail.com

---

⭐ **Star this repository if you find it helpful!** 