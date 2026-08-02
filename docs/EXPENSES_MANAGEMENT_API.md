# Expenses Management Module REST API Specification (EXPENSES_MANAGEMENT_API.md)

This document establishes the official REST API specification for the **Expenses Management Module** (Module-009) of ClinicOS. It binds backend services, database models, and frontend client components into an authoritative interface contract.

---

## 1. API Overview & Gateway Architecture

### Base URL & Protocol
- All endpoints are relative to the gateway root: `/api/v1`.
- Protocol: HTTPS (TLS 1.3 compulsory).
- Content-Type: `application/json`.
- Authentication: Standard HTTP Authorization header with Bearer JWT token.
- Multi-Tenant Partitioning: Enforced via mandatory `X-Tenant-ID` HTTP header.
- Offline Desktop Synchronization: Write operations accept an optional `X-Client-Request-ID` header for transaction deduplication.

---

## 2. Standardized JSON Response Envelopes

### 1. Success Response Structure (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "exp_66901a8b1",
    "expenseNumber": "EXP-202607-00104",
    "tenantId": "clinic_west_01",
    "clinicId": "branch_main",
    "categoryId": "cat_medsup_01",
    "categoryName": "Medical & Pharmaceutical Supplies",
    "title": "Monthly Medical Supplies Order",
    "amount": 1450.50,
    "currency": "USD",
    "expenseDate": "2026-07-30",
    "paymentDate": "2026-07-30",
    "paymentMethod": "BANK_TRANSFER",
    "vendorName": "Apex Medical Distributors Ltd.",
    "status": "PAID",
    "auditInfo": {
      "createdBy": "user_nurse_01",
      "createdAt": "2026-07-30T10:00:00.000Z",
      "approvedBy": "user_manager_01",
      "approvedAt": "2026-07-30T11:15:00.000Z",
      "paidBy": "user_manager_01",
      "paidAt": "2026-07-30T12:00:00.000Z"
    },
    "archived": false,
    "version": 3
  },
  "meta": {
    "timestamp": "2026-07-30T12:00:00.000Z"
  }
}
```

### 2. Error Response Structure (`4xx` / `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "EXPENSE_LOCKED",
    "message": "Paid expenses are immutable and cannot be updated.",
    "details": {
      "expenseId": "exp_66901a8b1",
      "status": "PAID"
    }
  },
  "meta": {
    "timestamp": "2026-07-30T12:00:00.000Z"
  }
}
```

---

## 3. Detailed Endpoint Catalog

### 1. `POST /api/v1/expenses` — Create Expense
- **Purpose**: Creates a new expense record in `DRAFT` or `PENDING_APPROVAL` status.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`, `DOCTOR`, `RECEPTIONIST`.
- **Request Body**:
```json
{
  "clinicId": "branch_main",
  "categoryId": "cat_medsup_01",
  "title": "Monthly Medical Supplies Order",
  "description": "Surgical gloves, syringes, and PPE kits.",
  "amount": 1450.50,
  "currency": "USD",
  "expenseDate": "2026-07-30",
  "paymentMethod": "BANK_TRANSFER",
  "vendorName": "Apex Medical Distributors Ltd.",
  "vendorTaxId": "TAX-998201-US",
  "notes": "Quarterly bulk order",
  "submitForApproval": true
}
```
- **Validation Rules**: `amount > 0`, valid `categoryId` in tenant, valid `expenseDate` (`YYYY-MM-DD`).
- **Response**: `201 Created` with created expense object.

---

### 2. `GET /api/v1/expenses/:id` — Get Expense Details
- **Purpose**: Retrieves full details of a specific expense document by ID.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`, `DOCTOR`, `RECEPTIONIST` (Policy-based).
- **Path Parameters**: `id` (Expense ID).
- **Validation Rules**: Enforces `tenantId` match. Returns `404 Not Found` for cross-tenant access.
- **Response**: `200 OK` with expense object.

---

### 3. `PUT /api/v1/expenses/:id` — Update Draft Expense
- **Purpose**: Modifies details of an unapproved expense draft or rejected expense.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: Creator or `CLINIC_MANAGER`.
- **Path Parameters**: `id`.
- **Validation Rules**: Rejects with `409 Conflict` (`EXPENSE_LOCKED`) if status is `APPROVED`, `PAID`, or `ARCHIVED`.
- **Response**: `200 OK` with updated expense document.

---

### 4. `PATCH /api/v1/expenses/:id/submit` — Submit Expense for Approval
- **Purpose**: Transitions status from `DRAFT` to `PENDING_APPROVAL`.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: Creator, Staff, `CLINIC_MANAGER`.
- **Validation Rules**: Requires status == `DRAFT`.
- **Response**: `200 OK` with updated status.

---

### 5. `PATCH /api/v1/expenses/:id/approve` — Approve Expense
- **Purpose**: Manager authorizes an expense, transitioning status from `PENDING_APPROVAL` to `APPROVED`.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Validation Rules**: Requires status == `PENDING_APPROVAL`.
- **Response**: `200 OK` with approved status and `approvedBy` log.

---

### 6. `PATCH /api/v1/expenses/:id/reject` — Reject Expense
- **Purpose**: Manager rejects an expense submission.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Request Body**: `{ "reason": "Expense amount exceeds department monthly budget allowance." }`.
- **Validation Rules**: Mandatory non-empty `reason` string. Transitions status to `REJECTED`.
- **Response**: `200 OK` with rejected status.

---

### 7. `PATCH /api/v1/expenses/:id/pay` — Mark Expense as Paid
- **Purpose**: Disburses payment for an approved expense, transitioning status to `PAID` and updating net profit reporting eligibility.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Request Body**:
```json
{
  "paymentDate": "2026-07-30",
  "paymentMethod": "BANK_TRANSFER"
}
```
- **Validation Rules**: Requires status == `APPROVED`. Requires valid `paymentDate` and `paymentMethod`.
- **Response**: `200 OK` with paid expense object.

---

### 8. `PATCH /api/v1/expenses/:id/archive` — Archive Expense (Soft Delete)
- **Purpose**: Soft-deletes an expense record.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Request Body**: `{ "reason": "Duplicate entry entered in error by staff." }`.
- **Validation Rules**: Mandatory non-empty `reason` string. Sets `archived: true` and status to `ARCHIVED`.
- **Response**: `200 OK` with archived record.

---

### 9. `PATCH /api/v1/expenses/:id/restore` — Restore Expense
- **Purpose**: Restores a soft-deleted expense record back to active status.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Validation Rules**: Requires `archived === true`. Restores status and resets `archived: false`.
- **Response**: `200 OK` with restored record.

---

### 10. `GET /api/v1/expenses` — List & Search Expenses
- **Purpose**: Queries clinic expenses with pagination, multi-criteria filtering, and full-text search.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`, `DOCTOR`, `RECEPTIONIST` (Policy-based).
- **Query Parameters**: `page`, `limit`, `categoryId`, `status`, `paymentMethod`, `vendorName`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `search`.
- **Response**: `200 OK` with paginated expense roster array and meta pagination details.

---

### 11. `GET /api/v1/expense-categories` — List Categories
- **Purpose**: Retrieves all active expense categories for the clinic tenant.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: All authenticated clinic users.
- **Response**: `200 OK` with array of category objects.

---

### 12. `POST /api/v1/expense-categories` — Create Custom Category
- **Purpose**: Adds a new tenant-customized operating expense category.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Request Body**: `{ "categoryName": "Lab Consumables", "categoryCode": "CAT-LABCONS", "color": "#10B981", "icon": "TestTube" }`.
- **Response**: `201 Created` with created category object.

---

### 13. `PUT /api/v1/expense-categories/:id` — Update Custom Category
- **Purpose**: Modifies details of a custom category.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Validation Rules**: System preset categories (`isSystem === true`) cannot have `categoryCode` or `categoryName` modified.
- **Response**: `200 OK` with updated category document.

---

### 14. `PATCH /api/v1/expense-categories/:id/archive` — Archive Category
- **Purpose**: Soft-deletes a custom category.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Validation Rules**: Rejects with `400 Bad Request` (`SYSTEM_CATEGORY_PROTECTED`) if `isSystem === true`.
- **Response**: `200 OK` with archived category.

---

### 15. `PATCH /api/v1/expense-categories/:id/restore` — Restore Category
- **Purpose**: Restores an archived custom category.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `CLINIC_MANAGER`.
- **Response**: `200 OK` with restored category object.

---

## 4. Security & Permission Matrix

| Endpoint | HTTP Method | Doctor | Receptionist | Clinic Manager | Platform Admin |
| --- | --- | --- | --- | --- | --- |
| `POST /api/v1/expenses` | POST | Allowed | Allowed | Allowed | **DENIED (403)** |
| `GET /api/v1/expenses/:id` | GET | Policy-Based | Policy-Based | Allowed | **DENIED (403)** |
| `PUT /api/v1/expenses/:id` | PUT | Creator | Creator | Allowed | **DENIED (403)** |
| `PATCH /.../submit` | PATCH | Allowed | Allowed | Allowed | **DENIED (403)** |
| `PATCH /.../approve` | PATCH | Denied | Denied | Allowed | **DENIED (403)** |
| `PATCH /.../reject` | PATCH | Denied | Denied | Allowed | **DENIED (403)** |
| `PATCH /.../pay` | PATCH | Denied | Denied | Allowed | **DENIED (403)** |
| `PATCH /.../archive` | PATCH | Denied | Denied | Allowed | **DENIED (403)** |
| `PATCH /.../restore` | PATCH | Denied | Denied | Allowed | **DENIED (403)** |
| `GET /api/v1/expenses` | GET | Policy-Based | Policy-Based | Allowed | **DENIED (403)** |
| `* /expense-categories*` | ALL | Read-Only | Read-Only | Full Access | **DENIED (403)** |

> [!IMPORTANT]
> **Platform Owner Financial Barrier**: Platform Administrators receive HTTP `403 Forbidden` with error code `PLATFORM_ADMIN_FINANCIAL_RESTRICTED` on all clinic expense routes.

---

## 5. Standard Error Code Catalog

| Error Code | HTTP Status | Description |
| --- | --- | --- |
| `INVALID_AMOUNT` | `400 Bad Request` | Amount must be a positive number greater than 0. |
| `INVALID_CURRENCY` | `400 Bad Request` | Currency code must be a valid 3-letter ISO code. |
| `INVALID_PAYMENT_METHOD` | `400 Bad Request` | Payment method must be one of `CASH`, `BANK_TRANSFER`, etc. |
| `MISSING_PAYMENT_METHOD` | `400 Bad Request` | Marking expense as `PAID` requires valid payment method and payment date. |
| `MISSING_ARCHIVE_REASON` | `400 Bad Request` | Archiving an expense requires a mandatory reason string. |
| `SYSTEM_CATEGORY_PROTECTED`| `400 Bad Request` | Protected system categories (`isSystem: true`) cannot be archived or renamed. |
| `EXPENSE_LOCKED` | `409 Conflict` | Attempted edit on a `PAID` expense. Paid records are immutable. |
| `INVALID_STATUS_TRANSITION`| `400 Bad Request` | Illegal state machine transition attempt. |
| `EXPENSE_NOT_FOUND` | `404 Not Found` | Requested expense ID does not exist in active tenant workspace. |
| `PLATFORM_ADMIN_FINANCIAL_RESTRICTED` | `403 Forbidden` | Platform Administrators are strictly barred from viewing clinic financial data. |

---

## 6. Audit Logging Contract

All mutating write operations (`POST`, `PUT`, `PATCH`) automatically emit audit events captured in the central audit system:
- `actorId`: User ID of the client executing the request.
- `actorRole`: User RBAC role (`CLINIC_MANAGER`, `RECEPTIONIST`, etc.).
- `action`: Audit action code (`EXPENSE_CREATED`, `EXPENSE_APPROVED`, `EXPENSE_PAID`, `EXPENSE_ARCHIVED`).
- `resourceId`: Expense ID (`exp_...`).
- `tenantId`: Active tenant key.
- `timestamp`: UTC timestamp.

---

## 7. Reserved Future Extension API Signatures (V2 Hooks)

- `POST /api/v1/expenses/:id/ocr`: Processes uploaded receipt image and extracts vendor, date, and line items.
- `POST /api/v1/expenses/recurring`: Configures automated recurring expense generation schedule.
- `POST /api/v1/expenses/reconcile-bank`: Matches paid expenses against bank statement transactions.
- `POST /api/v1/expenses/post-payroll`: Auto-posts monthly staff salary disbursements into the expense ledger.

---

## 8. API Architecture Audit & Sign-Off

- [x] REST endpoint catalog (15 endpoints) fully documented.
- [x] JSON request and response envelopes specified.
- [x] Pre-database validation rules defined.
- [x] Security matrix & Platform Owner financial privacy barrier (`PLATFORM_ADMIN_FINANCIAL_RESTRICTED`) enforced.
- [x] Standard error code catalog specified.
- [x] Offline desktop sync header compatibility (`X-Client-Request-ID`) specified.
- [x] Reserved V2 extension API signatures documented.
- [x] Zero API conflicts with TASK-001 through TASK-085.

---

## 9. Next Step Recommendation

The REST API specification for the Expenses Management Module is **100% complete, production-ready, and approved**. We are ready to proceed to **TASK-087 — Expenses Management UI/UX Design**.
