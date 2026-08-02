# Doctor Financial Accounts REST API Specification (DOCTOR_FINANCIAL_ACCOUNTS_API.md)

This document establishes the official REST API specification for the **Doctor Financial Accounts Module** (Module-010) of ClinicOS. It defines endpoint paths, HTTP verbs, security requirements, request schemas, validation rules, standardized JSON response structures, error codes, and future V2 endpoint signatures.

---

## 1. Global REST Architecture & Conventions

### A. Base URL & Protocol
All API endpoints are hosted under the versioned gateway prefix:
```
https://api.clinicos.com/api/v1/doctor-financial-accounts
```

### B. Global Headers & Context
Every request must include the following standard HTTP headers:
- `Authorization`: `Bearer <JWT_TOKEN>` (Required for authentication)
- `X-Tenant-ID`: `<TENANT_ID>` (Required for multi-tenant workspace isolation)
- `X-Client-Request-ID`: `<UUID_V4>` (Required for desktop sync & request idempotency)
- `Content-Type`: `application/json`

### C. Standard Response Envelopes
#### Success Response Schema (200 OK / 201 Created)
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-07-30T18:45:00Z",
    "total": 1,
    "page": 1,
    "totalPages": 1
  }
}
```

#### Error Response Schema (4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "message": "Platform Administrators are strictly barred from viewing or managing clinic financial records.",
    "code": "PLATFORM_ADMIN_FINANCIAL_RESTRICTED",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-07-30T18:45:00Z"
  }
}
```

---

## 2. Security, Permission Matrix & Ownership Validation

### A. Role-Based Access Control (RBAC) & Scoping Table

| Endpoint Category | Permitted Roles | Ownership Validation Criteria |
| --- | --- | --- |
| **Get Doctor Account** | Doctor (Self), Clinic Manager | Doctor can only query `:doctorId == req.user.id` |
| **Create / Update Settlement** | Clinic Manager | Validates `tenantId` match |
| **Submit / Approve Settlement** | Clinic Manager | Validates `tenantId` match |
| **Disburse Payment** | Clinic Manager | Validates `tenantId` match |
| **Archive / Restore** | Clinic Manager | Validates `tenantId` match |
| **Financial Reports & List** | Doctor (Self), Clinic Manager | Doctor results strictly scoped to `doctorId == req.user.id` |
| **All Financial Endpoints** | **Platform Owner (`PLATFORM_ADMIN`)** | **STRICTLY DENIED (`403 Forbidden` `PLATFORM_ADMIN_FINANCIAL_RESTRICTED`)** |

---

## 3. Endpoint Specifications Catalog

### 1. Get Doctor Financial Account Summary
- **HTTP Method**: `GET`
- **Path**: `/api/v1/doctor-financial-accounts/:doctorId`
- **Description**: Retrieves current balance, total realized earnings, total disbursements paid, unsettled balance, and active compensation model settings for a specific doctor.
- **Access Control**: Doctor (Self), Clinic Manager.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "doctorId": "doc_101",
    "doctorName": "Dr. Sarah Jenkins",
    "tenantId": "clinic_main",
    "compensationModel": "PERCENTAGE",
    "compensationPercentage": 60.0,
    "fixedFeePerVisit": null,
    "currency": "EGP",
    "totalRealizedEarnings": 125000.0,
    "totalDisbursedPaid": 105000.0,
    "unsettledBalance": 20000.0,
    "lastSettlementDate": "2026-06-30"
  },
  "meta": {
    "timestamp": "2026-07-30T18:45:00Z"
  }
}
```

---

### 2. Create Settlement Statement (`STL-YYYYMM-XXXXX`)
- **HTTP Method**: `POST`
- **Path**: `/api/v1/doctor-financial-accounts/settlements`
- **Description**: Generates a new draft settlement statement aggregating completed appointments for a given doctor and date range.
- **Access Control**: Clinic Manager.
- **Request Body**:
```json
{
  "doctorId": "doc_101",
  "clinicId": "branch_main",
  "startDate": "2026-07-01",
  "endDate": "2026-07-31",
  "notes": "July 2026 monthly consultation settlement"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "stl_889201",
    "settlementNumber": "STL-202607-00012",
    "tenantId": "clinic_main",
    "clinicId": "branch_main",
    "doctorId": "doc_101",
    "doctorName": "Dr. Sarah Jenkins",
    "settlementPeriod": {
      "startDate": "2026-07-01",
      "endDate": "2026-07-31"
    },
    "completedVisitsCount": 42,
    "grossRevenue": 35000.0,
    "doctorShare": 21000.0,
    "clinicShare": 14000.0,
    "amountPaid": 0.0,
    "outstandingBalance": 21000.0,
    "paymentMethod": "BANK_TRANSFER",
    "status": "DRAFT",
    "auditInfo": {
      "createdBy": "usr_manager_1",
      "createdAt": "2026-07-30T18:45:00Z"
    },
    "archived": false,
    "version": 1
  },
  "meta": {
    "timestamp": "2026-07-30T18:45:00Z"
  }
}
```

---

### 3. Get Settlement Details By ID
- **HTTP Method**: `GET`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id`
- **Description**: Fetches detailed settlement record, line items, and audit trail by settlement ID.
- **Access Control**: Doctor (Self), Clinic Manager.
- **Success Response (200 OK)**: Returns full settlement object.

---

### 4. Update Draft Settlement
- **HTTP Method**: `PUT`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id`
- **Description**: Modifies notes or date ranges of a draft settlement. Allowed only when `status == 'DRAFT'`.
- **Access Control**: Clinic Manager.

---

### 5. Submit Settlement For Review
- **HTTP Method**: `PATCH`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/submit`
- **Description**: Transitions settlement state from `DRAFT` to `PENDING_REVIEW`.

---

### 6. Approve Settlement
- **HTTP Method**: `PATCH`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/approve`
- **Description**: Approves settlement (`PENDING_REVIEW` ➔ `APPROVED`), locking line items against modification.

---

### 7. Close Settlement
- **HTTP Method**: `PATCH`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/close`
- **Description**: Closes settlement statement. Allowed ONLY after `outstandingBalance == 0`.

---

### 8. Archive Settlement (Soft Delete)
- **HTTP Method**: `PATCH`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/archive`
- **Description**: Soft deletes settlement record (`archived: true`). Requires non-empty `reason` string.

---

### 9. Restore Soft-Deleted Settlement
- **HTTP Method**: `PATCH`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/restore`
- **Description**: Restores archived settlement statement (`archived: false`).

---

### 10. Add Payment Disbursement (Full or Partial)
- **HTTP Method**: `POST`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/payments`
- **Description**: Records a full or partial payment disbursement to the doctor.
- **Request Body**:
```json
{
  "amountPaid": 10000.0,
  "paymentDate": "2026-07-30",
  "paymentMethod": "BANK_TRANSFER",
  "referenceNumber": "TRX-998201",
  "notes": "First installment payout for July 2026"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "settlementId": "stl_889201",
    "settlementNumber": "STL-202607-00012",
    "cumulativeAmountPaid": 10000.0,
    "outstandingBalance": 11000.0,
    "status": "PAID",
    "paymentRecord": {
      "paymentId": "pmt_1001",
      "amountPaid": 10000.0,
      "paymentDate": "2026-07-30",
      "paymentMethod": "BANK_TRANSFER",
      "referenceNumber": "TRX-998201",
      "recordedBy": "usr_manager_1",
      "recordedAt": "2026-07-30T18:45:00Z"
    }
  },
  "meta": {
    "timestamp": "2026-07-30T18:45:00Z"
  }
}
```

---

### 11. Get Payment Disbursement History
- **HTTP Method**: `GET`
- **Path**: `/api/v1/doctor-financial-accounts/settlements/:id/payments`
- **Description**: Returns all historical payment disbursement transactions recorded for a settlement statement.

---

### 12. Financial Reports & Analytics Summary
- **HTTP Method**: `GET`
- **Path**: `/api/v1/doctor-financial-accounts/reports`
- **Description**: Generates monthly, annual, outstanding balance, and revenue distribution reports.
- **Query Parameters**: `doctorId`, `period` (`MONTHLY`, `ANNUAL`), `year`, `month`.

---

### 13. Search, Filter & Paginate Settlements
- **HTTP Method**: `GET`
- **Path**: `/api/v1/doctor-financial-accounts/settlements`
- **Query Parameters**: `doctorId`, `status`, `paymentMethod`, `startDate`, `endDate`, `search`, `page`, `limit`, `sortBy`, `sortOrder`.

---

## 4. Standard Error Codes Catalog

| HTTP Status | Error Code | Description / Remedy |
| --- | --- | --- |
| `400` | `INVALID_DATE_RANGE` | Provided `startDate` is after `endDate` |
| `400` | `INVALID_PAYMENT_AMOUNT` | Payment amount is negative or exceeds `outstandingBalance` |
| `400` | `MISSING_REASON_TEXT` | Archive or rejection reason string is empty |
| `403` | `PLATFORM_ADMIN_FINANCIAL_RESTRICTED` | Platform Owner attempted financial operation |
| `403` | `INSUFFICIENT_PERMISSIONS` | Role lacks permission or doctor queried foreign account |
| `404` | `SETTLEMENT_NOT_FOUND` | Settlement record not found or cross-tenant query |
| `409` | `SETTLEMENT_PERIOD_OVERLAP` | Settlement period overlaps an existing active settlement |
| `409` | `SETTLEMENT_LOCKED` | Attempted modification of `PAID` or `CLOSED` settlement |
| `409` | `CONCURRENT_MODIFICATION_CONFLICT` | Optimistic locking version conflict during edit |

---

## 5. Reserved Future Endpoint Signatures (V2 Specification)

1. `POST /api/v1/doctor-financial-accounts/payroll/export` — Export payroll batch for direct bank deposit.
2. `POST /api/v1/doctor-financial-accounts/tax/calculate` — Compute tax withholding deductions.
3. `POST /api/v1/doctor-financial-accounts/accounting/post-ledger` — Post Debit/Credit ledger entries to general ledger.
4. `POST /api/v1/doctor-financial-accounts/settlements/:id/sign` — Cryptographically sign settlement statement receipt.

---

## 6. CHANGELOG & Compliance Statement

This API specification has been verified against all ClinicOS standards (`SYSTEM_ARCHITECTURE.md`, `API_STANDARDS.md`, `CODING_STANDARDS.md`).
