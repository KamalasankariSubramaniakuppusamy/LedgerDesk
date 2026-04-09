# Policy: Settlement Delay Handling
## Document ID: POL-TXN-004
## Version: 2.3 | Effective: 2024-01-20
## Category: Transaction Exceptions

### 1. Definition
A settlement delay occurs when the time between authorization and settlement exceeds the expected window for the transaction's merchant category.

### 2. Expected Settlement Windows
| Merchant Category | Expected Window | Extended Tolerance |
|---|---|---|
| Retail/grocery | 1-2 business days | 5 business days |
| Restaurants | 1-3 business days | 5 business days |
| Gas stations | 1-3 business days | 7 business days |
| Hotels/lodging | 1-7 business days | 14 business days |
| Car rental | 1-14 business days | 21 business days |
| Airlines | 1-3 business days | 7 business days |
| Online/e-commerce | 1-5 business days | 10 business days |

### 3. Investigation Steps
1. Verify authorization date and settlement expectation
2. Check processor batch submission status
3. Verify merchant account status (active, suspended, closed)
4. Check for network-level delays or outages
5. Review if merchant category permits delayed settlement

### 4. Resolution Actions
#### 4.1 Within Extended Tolerance
- Monitor for settlement
- Advise cardholder of expected timeframe
- No immediate action required

#### 4.2 Beyond Extended Tolerance
- Initiate settlement inquiry with processor
- Consider releasing authorization hold
- Document inquiry reference number

### 5. Escalation Criteria
- Settlement delay exceeds 30 calendar days
- Merchant account closed with outstanding settlements
- Pattern of delays from same processor
- Amount exceeds $25,000
