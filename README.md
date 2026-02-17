# Stogra

Professional US Stock monitoring platform with editorial precision.

## Quick Start

### Backend (FastAPI)

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React + Vite)

```bash
cd client
npm install
npm run dev
```

## Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS 4.0
- **Backend**: FastAPI + Python 3.11+ + yfinance
- **Deployment**: Cloudflare Pages (Frontend) + Koyeb Tokyo (Backend)

## Documentation

See `.docs/` for detailed specifications.
