# Authentication Module API Design (AUTHENTICATION_API.md)

This document defines the API contracts, endpoint patterns, validation constraints, security rules, and communication protocols for the **Authentication Module** of ClinicOS.

---

## 1. Module Overview
The Authentication API acts as the secure entry gateway for the ClinicOS platform. It provides RESTful endpoints to process tenant registrations, authenticate identities, issue session tokens, validate workspace contexts, and recover lost credentials. 

---

## 2. API Design Principles
All endpoints in this module comply with the following standards (derived from `docs/API_DESIGN.md`):
- **RESTful Resource Scoping**: Explicit URLs using standard HTTP verbs (`POST`, `GET`, `DELETE`).
- **Stateless Communication**: The server holds no active session state; client requests must transmit authentication details on every call.
- **Consistent Path Naming**: Kebab-case URL routing (e.g. `/api/v1/auth/reset-password`).
- **API Versioning**: Prefix all endpoints with version identifiers (`/api/v1/`).
- **Error Uniformity**: Failures must return standard HTTP status codes accompanied by a structured JSON error envelope.

---

## 3. Endpoint Catalog (Version 1)

### Public Endpoints (No Token Required)
- **POST** `/api/v1/auth/register-clinic`: Onboard a new clinic tenant application.
- **POST** `/api/v1/auth/onboard-staff`: Complete registration for invited staff members using a token.
- **POST** `/api/v1/auth/login`: Authenticate credentials, resolve Tenant ID, and issue a JWT.
- **POST** `/api/v1/auth/forgot-password`: Initiate password recovery by requesting a reset email.
- **POST** `/api/v1/auth/reset-password`: Update credentials using a valid reset token.

### Protected Endpoints (Valid JWT Bearer Required)
- **POST** `/api/v1/auth/logout`: Revoke the user's session token.
- **POST** `/api/v1/auth/refresh-session`: Re-issue a fresh JWT before the active token expires.
- **POST** `/api/v1/auth/change-password`: Update active credentials from within the user profile.
- **GET** `/api/v1/auth/me`: Retrieve the identity metadata of the currently authenticated user.
- **GET** `/api/v1/auth/validate-session`: Fast middleware checkpoint verifying active token integrity.

---

## 4. Endpoint Specifications

### 1. Register Clinic
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/register-clinic`
- **Authentication Required**: No
- **Authorization Rules**: Open public endpoint.
- **Request Summary**: Accepts clinic name, owner credentials, and verification contacts.
- **Response Summary**: Confirms application registration, setting tenant status to `PENDING_APPROVAL`.
- **Possible Error Responses**: `400 Bad Request` (Validation error), `409 Conflict` (Email already registered).
- **Business Rules**: Creates a suspended workspace context waiting for Super Admin approval.
- **Dependencies**: Tenant module, Notification module (triggers confirmation email).

### 2. Onboard Staff
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/onboard-staff`
- **Authentication Required**: No
- **Authorization Rules**: Public flow, requires verification of onboarding token.
- **Request Summary**: Accepts registration invitation token, user name, and chosen password.
- **Response Summary**: Returns registration confirmation.
- **Possible Error Responses**: `400 Bad Request` (Token expired/invalid), `409 Conflict` (Identity already exists).
- **Business Rules**: Token must exist in invitations table and be under 72 hours old.
- **Dependencies**: User module, Database engine.

### 3. Login
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/login`
- **Authentication Required**: No
- **Authorization Rules**: Open public endpoint.
- **Request Summary**: Accepts email, password, and optionally workspace identifier.
- **Response Summary**: Returns user profile metadata and signed JWT token.
- **Possible Error Responses**: `401 Unauthorized` (Invalid credentials), `403 Forbidden` (Clinic suspended), `423 Locked` (Account temporarily locked).
- **Business Rules**: Locks account for 15 minutes on the 5th consecutive failed attempt.
- **Dependencies**: Audit module (records access event).

### 4. Logout
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/logout`
- **Authentication Required**: Yes
- **Authorization Rules**: Requires active user token.
- **Request Summary**: Accepts request payload containing token invalidation markers.
- **Response Summary**: Confirms session termination and token blacklisting.
- **Possible Error Responses**: `401 Unauthorized` (Invalid session).
- **Business Rules**: Blacklists JWT token.
- **Dependencies**: Cache/Session engine.

### 5. Refresh Session
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/refresh-session`
- **Authentication Required**: Yes
- **Authorization Rules**: Requires valid active token.
- **Request Summary**: Transmits active JWT bearer header.
- **Response Summary**: Issues a new signed JWT with refreshed 8-hour expiration.
- **Possible Error Responses**: `401 Unauthorized` (Token expired or revoked).
- **Business Rules**: Only allowed within 30 minutes of token expiration.
- **Dependencies**: Security validation middleware.

### 6. Forgot Password
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/forgot-password`
- **Authentication Required**: No
- **Authorization Rules**: Open public endpoint.
- **Request Summary**: Accepts registered email.
- **Response Summary**: Returns generic confirmation message (regardless of email existence to prevent user enumeration).
- **Possible Error Responses**: `400 Bad Request` (Malformed email).
- **Business Rules**: Limits link generation to one active token per user at a time.
- **Dependencies**: Notification module (triggers email dispatch).

### 7. Reset Password
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/reset-password`
- **Authentication Required**: No
- **Authorization Rules**: Public, requires reset token verification.
- **Request Summary**: Accepts reset token and new password.
- **Response Summary**: Confirms password update.
- **Possible Error Responses**: `400 Bad Request` (Token expired/used).
- **Business Rules**: Token expires in 1 hour; token must be invalidated immediately upon use.
- **Dependencies**: Database engine.

### 8. Change Password
- **HTTP Method**: `POST`
- **URL Pattern**: `/api/v1/auth/change-password`
- **Authentication Required**: Yes
- **Authorization Rules**: Requires active session.
- **Request Summary**: Accepts active password and chosen new password.
- **Response Summary**: Confirms password update.
- **Possible Error Responses**: `400 Bad Request` (Weak password), `401 Unauthorized` (Active password incorrect).
- **Business Rules**: Checks new password against strength rules.
- **Dependencies**: Database engine.

### 9. Get Current User
- **HTTP Method**: `GET`
- **URL Pattern**: `/api/v1/auth/me`
- **Authentication Required**: Yes
- **Authorization Rules**: Requires active session.
- **Request Summary**: Transmits active token.
- **Response Summary**: Returns user profile metadata, role, and tenant workspace configs.
- **Possible Error Responses**: `401 Unauthorized` (Invalid session).
- **Business Rules**: User must be active in the system.
- **Dependencies**: User module.

### 10. Validate Session
- **GET** `/api/v1/auth/validate-session`
- **Authentication Required**: Yes
- **Authorization Rules**: Requires active session.
- **Request Summary**: Transmits active token.
- **Response Summary**: Returns verification status.
- **Possible Error Responses**: `401 Unauthorized` (Token expired or revoked).
- **Business Rules**: Fast middleware checkpoint verifying active token integrity.
- **Dependencies**: Security validation middleware.

---

## 5. Authentication Strategy
- **JWT Tokens**: Authentication uses JSON Web Tokens (JWT) signed with a secure server-side secret (HS256 or RS256).
- **Bearer Header**: Protected endpoints decode and validate the JWT passed via the `Authorization: Bearer <token>` HTTP header.
- **Scoping Context**: Every API request must pass the target tenant identifier via the `X-Tenant-ID` header. The validation middleware cross-references this header with the tenant scope within the token before allowing backend processing.

---

## 6. Authorization Strategy (RBAC)
- **Role Scoping**: Decentralized role checking. The JWT claims contain the user's role.
- **Access Gates**: Endpoint controllers evaluate role scopes before execution, returning `403 Forbidden` if permissions do not match policy requirements.

---

## 7. Standard Response Format
Consistent with `docs/API_DESIGN.md` rules, responses use standard structures:
- **Success Responses**: Return a standard envelope enclosing `success: true`, the requested data, and request metadata (e.g. timestamps, request IDs).
- **Error Responses**: Return a standard envelope enclosing `success: false`, an error object (code, message, array of validation details), and request metadata.

---

## 8. Validation Strategy
Input validators validate fields at the API boundary, returning `400 Bad Request` with code `VALIDATION_FAILED` for:
- Malformed inputs (e.g. invalid email format, weak passwords).
- Missing required fields.
- Duplicate tenant creation requests.

---

## 9. Error Handling Strategy
Exceptions are mapped to standard HTTP statuses by the global error handler middleware:
- Malformed payloads ➔ `400 Bad Request`
- Invalid token/expired session ➔ `401 Unauthorized`
- Role mismatch/access denied ➔ `403 Forbidden`
- Brute-force lockout active ➔ `423 Locked`
- Tenant already registered ➔ `409 Conflict`
- Connection/unhandled server errors ➔ `500 Internal Server Error`

---

## 10. Rate Limiting Considerations
Rate limiting rules apply to public endpoints to prevent abuse:
- `/api/v1/auth/login` (brute-force prevention).
- `/api/v1/auth/forgot-password` (email dispatch spam protection).
- `/api/v1/auth/register-clinic` (spam protection).

---

## 11. Security Considerations
- **No Token Logs**: Logging middleware must exclude token payloads and password fields.
- **Sanitized Response**: Do not return system path names or raw database error stacks to clients.
- **Enumeration Prevention**: Return generic success messages on forgot password flows to avoid exposing email presence.

---

## 12. API Versioning Strategy
- Version routing is defined in URL paths (e.g. `/api/v1/...`). 
- When breaking API changes occur, version prefixes increment to `/api/v2/`, allowing legacy integrations to function without breaking.

---

## 13. Integration Points
- **Clinic Module**: Resolves active subscription status.
- **User Module**: Resolves staff profile data.
- **Notification Module**: Triggers SMTP dispatches for invitations and resets.
- **Audit Module**: Saves logs of access modifications.

---

## 14. Risks
- **Secret Compromise**: If the JWT signature secret is leaked, attackers can forge credentials.
  * *Mitigation*: Store secrets in environment files and load them using secure configuration managers.
- **JWT Key Rotation**: Rotating JWT keys invalidates all active sessions.
  * *Mitigation*: Design future token decoders to support key rotation schedules with short overlapping lifespans.

---

## 15. Open Questions
1. **HTTP Status for locked accounts**: Should we use `423 Locked` or `401 Unauthorized` when login fails due to lockout?
   - *Proposal*: V1 will return `423 Locked` with a clear explanation of the remaining lockout time.
