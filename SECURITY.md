# Security Policy (SECURITY.md) - Opentunes.ai

## 1. Authentication & Identity
*   **Provider**: We use **Supabase Auth** (GoTrue) for all identity management.
*   **Mechanism**: Secure **JWT (JSON Web Tokens)** stored in HttpOnly cookies (recommended) or LocalStorage.
*   **OAuth**: Supports Google and GitHub providers.
*   **MFA**: Multi-Factor Authentication is supported via Supabase for Admin accounts.

## 2. Authorization & RBAC
*   **Database Firewall**: We utilize **PostgreSQL Row Level Security (RLS)** as the primary defense layer.
    *   *Rule 1*: Users can `SELECT` public data.
    *   *Rule 2*: Users can only `INSERT/UPDATE/DELETE` rows where `user_id == auth.uid()`.
*   **Service Roles**: The Backend API (`ACE-Step` engine) operates with a restricted Service Key, scoped only to necessary buckets and tables.

## 3. Data Protection
*   **Encryption in Transit**: All traffic (Frontend <-> API <-> Database) is encrypted via **TLS 1.2+ (HTTPS)**.
*   **Encryption at Rest**:
    *   **Database**: Supabase manages disk encryption for Postgres.
    *   **Secrets**: API Keys (Stripe, OpenAI) are stored in encrypted environment variables (`.env`) and never committed to version control.
*   **Sanitization**:
    *   **SQL Injection**: Prevented by using Parameterized Queries (SQLAlchemy/Supabase Client).
    *   **XSS**: Next.js automatically scapes Output. `dangerouslySetInnerHTML` is strictly forbidden.

## 4. Payment Security (PCI-DSS)
*   **Processing**: We do **NOT** store or process credit card numbers on our servers.
*   **Provider**: All payments are handled by **Stripe** via hosted Checkouts or Elements.
*   **Compliance**: We rely on Stripe's PCI-DSS Level 1 certification.

## 5. Secrets Management
*   **Development**: `.env.local` files are strictly git-ignored.
*   **Production**: Secrets are injected via Cloud Provider environments (Cloudflare/Modal) at runtime.
*   **Audit**: `git-secrets` or similar tools are used to scan for accidental credential leaks.

## 6. Rate Limiting & API Protection
*   **Edge Layer**: Cloudflare provides DDoS protection and IP-based rate limiting for the Frontend.
*   **Application Layer**: The `/generate` endpoint implements a Job Queue (Semaphore) to prevent GPU resource exhaustion.

## 7. Compliance (GDPR/CCPA)
*   **Right to Delete**: Users can delete their account via the Settings UI, which cascades deletes to all user data (Songs, Profile, Images).
*   **Data Portability**: Users can download their original `.wav` files and metadata.

## 8. Reporting a Vulnerability
If you discover a security vulnerability, please do **NOT** open a public issue.
Email us strictly at: **security@opentunes.ai**.
We will acknowledge receipt within 48 hours.
