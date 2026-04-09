# Policy: Duplicate Charge Handling
## Document ID: POL-TXN-001
## Version: 3.2 | Effective: 2024-01-15
## Category: Transaction Exceptions

### 1. Definition
A duplicate charge occurs when a cardholder is billed more than once for the same transaction at the same merchant within a 72-hour window.

### 2. Identification Criteria
A transaction pair is classified as a potential duplicate when ALL of the following conditions are met:
- Same cardholder account
- Same merchant (by MCC or merchant ID)
- Same or similar amount (within 1% tolerance)
- Transactions occur within 72 hours of each other
- Different authorization codes

### 3. Exception: Recurring Charges
Transactions flagged as recurring (MCC codes 4814, 4899, 5968) should NOT be auto-classified as duplicates unless the billing interval is shorter than the merchant's declared billing cycle.

### 4. Resolution Workflow
#### 4.1 Auto-Resolution Eligible
If confidence score >= 0.85 AND amount <= $500:
- Issue provisional credit within 1 business day
- Initiate merchant dispute via network
- Notify cardholder of provisional credit

#### 4.2 Manual Review Required
If confidence score < 0.85 OR amount > $500:
- Route to senior analyst
- Require merchant transaction receipt comparison
- Verify authorization log timestamps

### 5. Escalation Criteria
Escalate to supervisor if:
- Amount exceeds $5,000
- Merchant disputes the duplicate claim
- Three or more potential duplicates exist on same account within 30 days
- Cardholder has prior fraud flags

### 6. Documentation Requirements
All duplicate charge cases must include:
- Transaction timeline comparison
- Authorization code verification
- Merchant category and ID match evidence
- Settlement status of both transactions
- Final determination rationale
