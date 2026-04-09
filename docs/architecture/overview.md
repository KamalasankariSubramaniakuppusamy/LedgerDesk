# Architecture Overview

## Service Interactions

```
Frontend (Next.js) ──HTTP──▶ API (FastAPI) ──SQL──▶ PostgreSQL
                                   │
                                   ├──▶ Redis (cache, queue broker)
                                   ├──▶ Celery Workers (background tasks)
                                   ├──▶ Agent Orchestrator (state machine)
                                   └──▶ Mock Tool Services (data lookup)
```

## Request Flow

1. Frontend sends request to API
2. API authenticates and validates
3. For case operations: CRUD against PostgreSQL
4. For workflow runs: Agent orchestrator processes through state machine
5. Agent calls retrieval layer for policy context
6. Agent calls tool services for structured evidence
7. Decision agent generates recommendation
8. Safety gate validates recommendation
9. Case transitions to awaiting_review
10. Analyst reviews and acts
11. All steps logged to audit_events

## Key Design Decisions

- **Explicit state machine** over free-form agent — predictability and auditability
- **Typed tool interfaces** — every tool has Pydantic input/output schemas
- **Safety-first defaults** — human review required unless confidence exceeds threshold
- **Structured logging** — JSON logs with trace IDs for cross-service correlation
