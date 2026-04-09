# LedgerDesk

### An agentic financial operations copilot for transaction exception handling, policy-grounded case resolution, and auditable workflow automation.

---

## Overview

LedgerDesk is a production-grade internal platform designed for financial operations teams. It helps analysts handle transaction exceptions faster, more consistently, and more safely by combining:

- **Agentic AI workflows** that reason over context, retrieve evidence, call tools, and recommend actions
- **Retrieval-augmented generation** over internal policy documents and SOPs
- **Tool-orchestrated reasoning** against structured financial data (transactions, accounts, settlements, refunds)
- **Safety gates** with confidence thresholds, grounding checks, and human-in-the-loop review
- **Full audit trail** of every system action, tool call, prompt, and analyst decision

This is not a chatbot. It's a serious operational copilot for financial services.

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│   FastAPI    │────▶│  PostgreSQL  │
│   Frontend   │     │   Backend    │     │  + pgvector  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────┴───────┐
                     │              │
              ┌──────▼──────┐ ┌────▼─────┐
              │   Agent     │ │  Redis   │
              │ Orchestrator│ │ + Celery │
              └──────┬──────┘ └──────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼───┐  ┌────▼───┐  ┌───▼────┐
    │ Triage │  │  RAG   │  │ Tools  │
    │ Agent  │  │Retrieval│  │Service │
    └────────┘  └────────┘  └────────┘
```

### Agent Workflow State Machine

```
created → triaged → context_retrieved → tools_selected → tools_executed
    → recommendation_generated → safety_checked → awaiting_review
    → approved → completed
    → rejected / escalated / failed_safe
```

---

## Features

### Case Management
- Ingest and create transaction exception cases
- Structured case details with financial context
- Priority-based queue with search and filtering

### Agent Workflow
- **Triage Agent**: Classifies issue type, extracts entities, assigns workflow path
- **Retrieval Agent**: Fetches relevant policy snippets and prior cases
- **Tool Planner**: Selects and prioritizes internal tool calls
- **Tool Executor**: Runs tools with typed JSON input/output
- **Decision Agent**: Generates grounded recommendations with citations
- **Safety Gate**: Validates confidence, grounding quality, and policy support

### Policy RAG
- Ingests internal policy documents (markdown)
- Chunks and indexes with pgvector embeddings
- Semantic retrieval with citation tracking
- Displayed alongside recommendations in the UI

### Mock Internal Tools
- `get_transaction_timeline` - Transaction history for an account
- `get_account_activity` - Account details and recent activity
- `get_settlement_status` - Settlement status lookup
- `get_refund_status` - Refund tracking by reference
- `search_similar_cases` - Prior case similarity search
- `get_merchant_reference` - Merchant information lookup

### Human Review
- Approve, reject, escalate, or edit recommendations
- Analyst notes and case annotations
- Status history tracking
- Reassignment support

### Audit Trail
- Every action logged with actor, timestamp, and trace ID
- Tool invocation records with latency and status
- Prompt version tracking
- Analyst override history

### Monitoring & Metrics
- Case throughput and status distribution
- Recommendation confidence distribution
- Tool call latency tracking
- Approval/override rates
- Health endpoints for all services

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.13, Pydantic |
| Database | PostgreSQL 16 + pgvector |
| Cache/Queue | Redis, Celery |
| ORM | SQLAlchemy 2.0, Alembic |
| LLM | OpenAI-compatible provider abstraction |
| Logging | structlog (structured JSON) |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions |

---

## Design System

LedgerDesk uses a **vintage-inspired financial aesthetic**:

- Cream/ivory/parchment backgrounds
- Deep navy, charcoal, muted green, and burgundy accents
- Playfair Display serif for headings
- Inter sans-serif for body text
- IBM Plex Mono for data and codes
- Ledger-like separators and clean table layouts
- Stamp-style status badges
- Generous spacing with minimal decoration

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/LedgerDesk.git
cd LedgerDesk

# Start infrastructure
make docker-up

# Setup backend
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run migrations and seed data
python -m app.seed

# Start API server
uvicorn app.main:app --reload --port 8000

# In another terminal, setup and start frontend
cd apps/web
npm install
npm run dev
```

Visit `http://localhost:3000` to access the dashboard.

### Docker (Full Stack)

```bash
docker compose up -d
```

---

## Demo Walkthrough

1. Open the LedgerDesk dashboard at `http://localhost:3000`
2. Navigate to **Case Queue** to see seeded exception cases
3. Open a case (e.g., "Suspected Duplicate Charge - Whole Foods")
4. Click **Run Workflow** to trigger the agent pipeline
5. Review the system recommendation, confidence score, and citations
6. **Approve**, **Reject**, or **Escalate** the recommendation
7. Add analyst notes for documentation
8. View the full **Audit Trail** for the case
9. Check **Metrics** for system performance

---

## Project Structure

```
LedgerDesk/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # FastAPI backend
├── packages/                   # Shared modules
│   ├── agent-core/             # State machine & orchestrator
│   ├── retrieval/              # RAG pipeline
│   ├── tool-services/          # Mock internal tools
│   ├── recommendation-engine/  # Decision synthesis
│   └── ...
├── sample_data/                # Seed data
│   ├── cases/                  # Exception cases
│   ├── policies/               # Policy documents
│   ├── transactions/           # Transaction records
│   └── ...
├── docs/                       # Architecture & decisions
├── tests/                      # Integration & E2E tests
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Database Schema

Key tables: `users`, `cases`, `case_status_history`, `case_entities`, `case_notes`, `policy_documents`, `policy_chunks`, `agent_runs`, `tool_invocations`, `case_retrieval_results`, `recommendations`, `analyst_actions`, `audit_events`, `prompt_versions`, `evaluation_runs`

---

## Safety Model

LedgerDesk implements layered safety controls:

1. **Confidence thresholds** — Low-confidence recommendations require human review
2. **Grounding requirements** — No recommendation without policy citation support
3. **Schema validation** — All agent inputs/outputs validated against Pydantic schemas
4. **Bounded autonomy** — Agents operate within explicit state machine transitions
5. **Human-in-the-loop** — Sensitive actions always require analyst approval
6. **Audit logging** — Every system action is recorded and inspectable
7. **Fail-safe behavior** — On failure, cases enter `failed_safe` state, never proceed unsupported

---

## Roadmap

### v1.1
- [ ] Full LLM-powered agent orchestration (LangGraph)
- [ ] Embedding-based policy retrieval
- [ ] Similar case search with vector similarity
- [ ] Real-time workflow progress updates (WebSocket)

### v1.2
- [ ] Multi-tenant workspace support
- [ ] Role-based access control
- [ ] Batch case processing
- [ ] Evaluation regression suite
- [ ] Performance dashboards with charts

### v2.0
- [ ] Write action support with approval workflows
- [ ] Slack/Teams integration for escalations
- [ ] Custom tool registration API
- [ ] Prompt versioning and A/B testing
- [ ] Production deployment guides

---

## License

MIT
