# RAG Support Search - Quick Start Guide

Get your RAG Support Search system up and running in 5 minutes! 🚀

## Prerequisites
- Docker and Docker Compose
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Quick Setup with Docker (Recommended)

### 1. Clone and Configure
```bash
git clone <repository-url>
cd RagSupportSearch
```

### 2. Configure OpenAI API Key
Edit `docker-compose.yml` and update the OPENAI_API_KEY:
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
- **API Docs**: http://localhost:9000/docs

## Manual Setup (Alternative)

### 1. Start Backend
```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
```

### 2. Start Frontend (New Terminal)
```bash
cd frontend
npm start
```

### 3. Start Qdrant (New Terminal)
```bash
docker run -p 6333:6333 qdrant/qdrant
```

### 4. Configure OpenAI Key
Edit `backend/app/core/config.py` and replace the API key:
```python
OPENAI_API_KEY: str = "sk-your_actual_openai_api_key_here"
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9000
- **Qdrant UI**: http://localhost:6333
- **API Docs**: http://localhost:9000/docs

## Quick Test

### Upload a Document
1. Go to http://localhost:4000/upload (Docker) or http://localhost:3000/upload (Manual)
2. Upload a CSV, PDF, or TXT file
3. Wait for processing to complete

**Note**: CSV files must be UTF-8 encoded. If you get encoding errors, convert with:
```bash
iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv
```

### Search with AI
1. Go to http://localhost:4000/search (Docker) or http://localhost:3000/search (Manual)
2. Ask a question like "How do I reset my password?"
3. Get an AI-powered answer with sources!

### View Documents and Stats
1. Go to http://localhost:4000/documents (Docker) or http://localhost:3000/documents (Manual)
2. See all uploaded documents and system statistics
3. Check Qdrant UI at http://localhost:6333 for database inspection

## Troubleshooting

### Docker Issues
**Containers won't start?**
```bash
# Check if ports are available
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs backend
```

**Port conflicts?**
- Ensure ports 4000, 9000, and 6333 are available
- Stop other services using these ports

### Manual Setup Issues
**Backend won't start?**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend proxy error?**
- Ensure backend is running on port 9000
- Check that both services are started

**Qdrant connection issues?**
- Ensure Qdrant is running on port 6333
- Check backend logs for connection errors

### Common Issues
**No AI responses?**
- Verify your OpenAI API key is correct
- Check your OpenAI account has credits
- Ensure the backend is running on port 9000

**File upload encoding errors?**
```bash
# Convert CSV files to UTF-8 (macOS/Linux)
iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv
```

**Network errors in frontend?**
- Verify backend is accessible at http://localhost:9000
- Check CORS configuration

## Port Configuration
- **Frontend**: 4000 (Docker) / 3000 (Manual)
- **Backend**: 9000
- **Qdrant**: 6333

## Next Steps
- Read the full [Documentation](DOCUMENTATION.md)
- Explore the API at http://localhost:9000/docs
- Upload more documents and test different queries
- Check the [Architecture Guide](ARCHITECTURE.md) for technical details

---

**Need help?** Check the [Troubleshooting section](DOCUMENTATION.md#troubleshooting) in the full documentation. 