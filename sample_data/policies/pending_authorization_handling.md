# Policy: Pending Authorization Handling
## Document ID: POL-TXN-002
## Version: 2.8 | Effective: 2024-03-01
## Category: Transaction Exceptions

### 1. Definition
A pending authorization is a hold placed on a cardholder's available credit or funds that has not yet settled or been released by the merchant/processor.

### 2. Standard Authorization Lifecycle
- Authorization created: T+0
- Expected settlement: T+1 to T+5 business days
- Auto-release if unsettled: T+7 to T+30 (varies by MCC)

### 3. Common Exception Scenarios
#### 3.1 Authorization Not Releasing
If authorization is past expected release window:
- Verify MCC-specific hold duration rules
- Check if merchant has submitted a settlement file
- Determine if network timeout applies

#### 3.2 Authorization Amount Differs from Settlement
Permitted variance by category:
- Restaurants/hospitality: up to 20% (tip adjustment)
- Gas stations: initial auth up to $175, settles at pump amount
- Hotels/car rental: auth may exceed settlement (deposit holds)
- All others: variance > 5% requires review

#### 3.3 Multiple Authorizations, Single Settlement
Common in: hotels, car rentals, subscription services
- Verify merchant category permits incremental authorizations
- Confirm only one settlement posted
- Release orphaned authorizations

### 4. Cardholder Communication Guidelines
- Explain authorization vs. posted transaction distinction
- Provide expected release timeframe based on MCC
- Do NOT guarantee specific release dates
- Offer to initiate merchant contact if auth exceeds 10 business days

### 5. Escalation Criteria
Escalate if:
- Authorization hold exceeds 30 calendar days
- Multiple holds from same merchant with no settlements
- Cardholder reports merchant closed/unreachable
- Hold amount exceeds $10,000
