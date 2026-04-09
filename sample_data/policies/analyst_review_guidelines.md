# Policy: Analyst Review Guidelines
## Document ID: POL-OPS-002
## Version: 3.1 | Effective: 2024-02-15
## Category: Operations

### 1. Review Standards
Every system-generated recommendation must be evaluated against:
- Policy compliance: Does the recommendation follow applicable policies?
- Evidence sufficiency: Is there enough evidence to support the action?
- Proportionality: Is the recommended action proportional to the issue?
- Cardholder impact: Does the action serve the cardholder's interest?

### 2. Approval Criteria
An analyst may approve a recommendation when:
- Confidence score >= 0.75
- At least one policy citation directly supports the action
- All required tool outputs are present and consistent
- No conflicting evidence exists
- Action is within analyst's authorization level

### 3. Rejection Criteria
An analyst should reject a recommendation when:
- Evidence contradicts the recommended action
- Policy citation is misapplied or outdated
- Critical tool output is missing or inconsistent
- Confidence score is below threshold without justification

### 4. Edit Guidelines
When editing a recommendation:
- Document the specific changes made
- Provide rationale for the modification
- Ensure edited recommendation still has policy support
- Re-evaluate confidence score if evidence basis changed

### 5. Override Documentation
Any override of a system recommendation requires:
- Clear written rationale
- Identification of what the system missed or got wrong
- Supervisor notification if override contradicts high-confidence recommendation (>= 0.90)
