# ADR-002: Bounded Agent Autonomy

## Status
Accepted

## Context
LLM-powered agents can take autonomous actions, but financial operations require safety guarantees.

## Decision
Agents may reason, retrieve, and recommend, but cannot execute write/action operations without human approval.

## Rationale
- Prevents unauthorized financial actions
- Maintains human accountability for decisions
- Aligns with financial services compliance requirements
- Reduces risk of hallucination-driven actions

## Consequences
- All final actions require analyst interaction
- Higher latency for case resolution
- Acceptable for the safety profile of financial operations
