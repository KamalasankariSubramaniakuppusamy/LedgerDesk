# ADR-001: Explicit State Machine for Agent Workflow

## Status
Accepted

## Context
We need to orchestrate multi-step AI agent workflows for case resolution. Options include free-form agent loops, DAG-based orchestration, or explicit state machines.

## Decision
Use an explicit state machine with defined states and valid transitions.

## Rationale
- Financial operations require predictable, auditable behavior
- State machines make invalid transitions impossible
- Every state change is logged and inspectable
- Recovery and retry are straightforward
- Easier to explain to regulators and auditors

## Consequences
- Less flexible than free-form agents
- New workflow paths require state machine updates
- Acceptable tradeoff for financial services safety requirements
