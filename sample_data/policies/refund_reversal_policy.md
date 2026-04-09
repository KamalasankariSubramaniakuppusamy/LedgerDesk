# Policy: Refunds and Reversals
## Document ID: POL-TXN-003
## Version: 4.1 | Effective: 2024-02-01
## Category: Transaction Exceptions

### 1. Definitions
- **Refund**: A credit initiated by the merchant to return funds for a completed transaction.
- **Reversal**: A cancellation of an authorization before settlement occurs.
- **Chargeback**: A dispute-initiated return of funds through the card network.

### 2. Refund Processing Standards
#### 2.1 Timing
- Merchant-initiated refund: 3-10 business days to post
- Network-processed refund: 5-15 business days
- International refund: up to 20 business days

#### 2.2 Amount Matching
- Full refund: must match original transaction amount exactly
- Partial refund: must be less than original amount
- Refund exceeding original amount: BLOCK and escalate immediately

### 3. Refund Mismatch Resolution
When a cardholder reports a refund not received:
1. Verify merchant refund confirmation (ARN/reference number)
2. Check settlement files for matching credit
3. Verify refund was applied to correct account/card
4. Check for currency conversion discrepancies
5. If refund confirmed sent but not posted after 15 business days, initiate tracer

### 4. Reversal Handling
#### 4.1 Merchant-Initiated Reversal
- Should clear within 1-3 business days
- Verify authorization was actually reversed (not just a new auth)
- Confirm available credit restored

#### 4.2 System-Initiated Reversal
- Timeout reversals: auto-processed after network timeout
- Decline reversals: auto-processed when authorization declined
- These should NOT appear on cardholder statements

### 5. Escalation Criteria
Escalate if:
- Refund exceeds original transaction amount
- Refund not posted after 20 business days with valid ARN
- Multiple refund attempts from same merchant
- Refund currency differs from original transaction currency
- Cardholder disputes refund amount

### 6. Audit Requirements
Log all refund/reversal investigations with:
- Original transaction reference
- Refund reference (ARN)
- Timeline of actions taken
- Merchant communication records
- Final resolution and rationale
