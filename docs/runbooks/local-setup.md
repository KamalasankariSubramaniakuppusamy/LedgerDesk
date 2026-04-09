# Local Development Setup

## Prerequisites
- Docker Desktop
- Python 3.11+
- Node.js 20+
- PostgreSQL client (optional, for direct DB access)

## Steps

### 1. Start Infrastructure
```bash
make docker-up
```
This starts PostgreSQL (with pgvector) and Redis.

### 2. Setup Backend
```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Seed Database
```bash
python -m app.seed
```

### 4. Start API
```bash
uvicorn app.main:app --reload --port 8000
```
API docs available at http://localhost:8000/docs

### 5. Setup Frontend
```bash
cd apps/web
npm install
npm run dev
```
Frontend at http://localhost:3000

## Troubleshooting
- If PostgreSQL won't start: check if port 5432 is in use
- If Redis won't start: check if port 6379 is in use
- If seed fails: ensure PostgreSQL is running and pgvector extension is available
