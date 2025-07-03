# RAG Support Search - Quick Start Guide

Get your RAG Support Search system up and running in 5 minutes! 🚀

## Prerequisites
- Python 3.8+ and Node.js 16+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Quick Setup

### 1. Start Backend
```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### 2. Start Frontend (New Terminal)
```bash
cd frontend
npm start
```

### 3. Configure OpenAI Key
Edit `backend/app/core/config.py` and replace the API key:
```python
OPENAI_API_KEY: str = "sk-your_actual_openai_api_key_here"
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8001/docs

## Quick Test

### Upload a Document
1. Go to http://localhost:3000/upload
2. Upload a CSV, PDF, or TXT file
3. Wait for processing to complete

### Search with AI
1. Go to http://localhost:3000/search
2. Ask a question like "How do I reset my password?"
3. Get an AI-powered answer with sources!

## Troubleshooting

**Backend won't start?**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend proxy error?**
- Ensure backend is running on port 8001
- Check that both services are started

**No AI responses?**
- Verify your OpenAI API key is correct
- Check your OpenAI account has credits

## Next Steps
- Read the full [Documentation](DOCUMENTATION.md)
- Explore the API at http://localhost:8001/docs
- Upload more documents and test different queries

---

**Need help?** Check the [Troubleshooting section](DOCUMENTATION.md#troubleshooting) in the full documentation. 