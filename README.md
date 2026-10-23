<div align="center">

# ⚖️ HARVEY SPECTER &bull; LEGAL TECH SAAS

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Cinzel&weight=700&size=28&duration=3000&pause=1000&color=D97706&center=true&vCenter=true&width=750&lines=HARVEY+SPECTER+LEGAL+ENTERPRISE;HIGH-PERFORMANCE+CORPORATE+LAW+FIRM+SAAS;ZERO-TRUST+MULTI-TENANT+ISOLATION;VISIONOS+FLUID+GLASS+%2B+WEBGL+PHYSICS" alt="Typing Banner" />
</p>

<p align="center">
  <em>"I don't play the odds, I play the man." — Harvey Specter</em>
</p>

<p align="center">
  <strong>An enterprise-grade, multi-tenant corporate legal operations platform engineered for top-tier law firms, litigators, and corporate counsels.</strong>
</p>

---

### 🌐 System Status & Badges

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL Multi-Tenant](https://img.shields.io/badge/PostgreSQL-Multi--Schema-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Apple VisionOS Design](https://img.shields.io/badge/UI_Design-Apple_VisionOS_Glass-white?style=for-the-badge&logo=apple&logoColor=black)](#apple-visionos--liquid-glass-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

<a href="#-executive-summary">Executive Summary</a> &bull;
<a href="#-architectural-blueprint">Architecture</a> &bull;
<a href="#-multi-tenant-engine">Multi-Tenancy</a> &bull;
<a href="#-repository-structure">Folder Structure</a> &bull;
<a href="#-visual-engine--webgl">Visual Engine</a> &bull;
<a href="#-security--zero-trust">Security</a> &bull;
<a href="#-getting-started">Installation</a> &bull;
<a href="#-branching-strategy">Git Workflow</a>

---

</div>

<br/>

## 🏛️ Executive Summary

**HARVEY SPECTER** is a sovereign, multi-tenant Legal Tech SaaS application designed to handle high-stakes corporate litigation, intellectual property, constitutional proceedings, client portals, and real-time attorney triage.

Built on **Next.js 16 (App Router + Turbopack)**, **React 19**, and a **PostgreSQL schema-per-tenant isolation model**, this platform delivers:

- 🛡️ **Absolute Cryptographic & Schema Separation:** Each legal firm operates in its own dedicated PostgreSQL schema, preventing cross-tenant data leaks and guaranteeing strict attorney-client privilege (*Secreto Profesional*).
- 💎 **Apple VisionOS Liquid Glass Interface:** High-end glassmorphic UI featuring real-time optical refractions, specular highlights, and dynamic light/dark modes.
- ⚡ **Interactive WebGL Physics:** Custom GLSL shaders powering interactive **Ferrofluid** magnetic liquid simulations, **Lightfall** justice streaks, and **ChromaGrid** optical lattices.
- 👥 **Suits-Inspired Firm Hierarchy:** Comprehensive RBAC supporting Senior Partners (*Socios*), Managing Partners, Senior Associates, Junior Associates, and Paralegals with automated legal complexity matching.
- 🔎 **Public Case Discovery & Citizen Onboarding:** Real-time case tracking for external clients via secure document IDs, tariff fee calculators, and public firm charters.
- 🌐 **Real-time Bilingual Engine:** Instant English ⇄ Spanish localization across all views and interactive widgets.

---

## 🏗️ Architectural Blueprint

The system enforces a **Zero-Trust Multi-Tenant Database Architecture**. Public metadata (tenants, auth credentials, rate limiting) is isolated from private firm records (clients, lawsuits, evidence, case files).

```mermaid
flowchart TD
    subgraph ClientLayer ["🖥️ Client & Presentation Layer"]
        UserBrowser["User Browser / Client"]
        ThemeLocale["Theme (Dark/Light) & i18n (EN/ES)"]
        WebGLCanvas["WebGL Canvas (Ferrofluid + Lightfall)"]
    end

    subgraph EdgeProxy ["🛡️ Edge & Routing Layer (src/proxy.ts)"]
        NextProxy["Next.js Edge Proxy"]
        JWTVerify["Jose JWT Verification & Extraction"]
        TenantResolver["Tenant Context Resolver"]
    end

    subgraph AppRouter ["⚡ Next.js 16 App Router"]
        PublicRoutes["Public Portal: / (Landing), /consultar-caso, /registro-cliente, /aranceles, /constitucion"]
        AuthRoutes["Auth: /login, /register, /api/auth/*"]
        PanelRoutes["Firm Panel: /panel/dashboard, /panel/casos, /panel/abogados, /panel/clientes"]
    end

    subgraph DatabaseLayer ["🗄️ PostgreSQL Multi-Schema Isolation"]
        subgraph PublicSchema ["Schema: 'public' (Global Meta)"]
            T_Tenants["tenants"]
            T_Users["users (auth + roles)"]
            T_Idempotency["idempotency_keys"]
            T_RateLimit["rate_limit_hits"]
        end

        subgraph TenantSchemaA ["Schema: 'tenant_specter_litt'"]
            TA_Clientes["clientes"]
            TA_Casos["casos (lawsuits & files)"]
            TA_Documentos["documentos"]
        end

        subgraph TenantSchemaB ["Schema: 'tenant_zane_associates'"]
            TB_Clientes["clientes"]
            TB_Casos["casos (lawsuits & files)"]
            TB_Documentos["documentos"]
        end
    end

    UserBrowser --> ThemeLocale --> WebGLCanvas --> NextProxy
    NextProxy --> JWTVerify --> TenantResolver
    TenantResolver --> PublicRoutes
    TenantResolver --> AuthRoutes
    TenantResolver --> PanelRoutes
    AuthRoutes --> PublicSchema
    PanelRoutes --> TenantSchemaA
    PanelRoutes --> TenantSchemaB
```

---

## 🗄️ Multi-Tenant Engine

Traditional multi-tenant systems use a shared `tenant_id` column on every table. **HARVEY SPECTER** implements an enterprise-grade **Schema-per-Tenant** pattern using dual Prisma clients:

<details open>
<summary><b>1. Dual Schema Architecture (Public vs. Tenant)</b></summary>

| Database Layer | Prisma Schema Path | Generated Client | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Public Database** | `prisma/public/schema.prisma` | `generated/public-client` | Manages tenant registration, user authentication, global rate-limits, and idempotency keys. |
| **Tenant Database** | `prisma/tenant/schema.prisma` | `generated/tenant-client` | Dedicated isolated schema generated dynamically per firm (`tenant_{slug}`). |

</details>

<details>
<summary><b>2. Dynamic Provisioning Lifecycle (`src/lib/db/provisionTenant.ts`)</b></summary>

When a new law firm registers:
1. A transaction creates the `Tenant` record in `public.tenants`.
2. A sanitized schema name is generated (e.g., `tenant_pearson_hardman`).
3. Direct DDL execution creates the Postgres schema: `CREATE SCHEMA IF NOT EXISTS "tenant_..."`.
4. The idempotent template `prisma/tenant/template.sql` is executed inside the new schema.
5. Search paths are locked to prevent cross-schema contamination:
   ```sql
   SET search_path TO "tenant_pearson_hardman", public;
   ```
6. An admin account is seeded with bcrypt-hashed credentials and assigned to the tenant.

</details>

<details>
<summary><b>3. Dynamic Client Factory (`src/lib/db/tenantClient.ts`)</b></summary>

Tenant database connections are instantiated at runtime by injecting the schema-scoped `DATABASE_URL` parameter into the Prisma Tenant Client pool:

```typescript
export function getTenantPrisma(schemaName: string): PrismaClient {
  const baseDbUrl = process.env.DATABASE_URL!;
  const tenantUrl = setSchemaInConnectionString(baseDbUrl, schemaName);
  return new PrismaClient({ datasources: { db: { url: tenantUrl } } });
}
```

</details>

---

## 📂 Repository Structure

The codebase is organized into strict functional boundaries following the **Next.js 16 App Router** standards:

```ascii
harvey-specter/
├── .env.example                     # Environment template (PostgreSQL, Direct URL, JWT secrets)
├── .gitignore                       # Production-grade git exclusions
├── package.json                     # Next.js 16, React 19, Tailwind v4, Prisma, Jose
├── tsconfig.json                    # Strict TypeScript compilation rules
├── README.md                        # Master animated technical documentation
│
├── prisma/                          # Multi-Schema Database Modeling
│   ├── public/                      # Global administrative schema
│   │   ├── migrations/              # Public schema historical migrations
│   │   └── schema.prisma            # Tenant, User, IdempotencyKey, RateLimitHit models
│   └── tenant/                      # Tenant business domain schema
│       ├── schema.prisma            # Cliente, Caso, Documento models
│       └── template.sql             # Compiled DDL script for instant tenant provisioning
│
├── public/                          # Static Assets & Media
│   ├── videos/                      # Law firm corporate background loops
│   │   ├── README.md                # Video assets guide
│   │   └── fondo-inicio.mp4         # High-resolution ambient video
│   ├── *.svg                        # Vector brand icons and logos
│   └── favicon.ico                  # Sovereign browser icon
│
├── src/                             # Source Directory
│   ├── proxy.ts                     # Edge proxy / Auth gatekeeper / Session interceptor
│   │
│   ├── app/                         # App Router Architecture
│   │   ├── layout.tsx               # Root application wrapper (Theme & Locale providers)
│   │   ├── globals.css              # Apple iOS 18 liquid glass variables & keyframe animations
│   │   │
│   │   ├── (public)/                # Public Facing Marketing & Client Portals
│   │   │   ├── page.tsx             # Animated Landing Page with WebGL shaders & profile cards
│   │   │   ├── aranceles/           # Legal Fees & Billable Rates Calculator
│   │   │   ├── constitucion/        # Interactive Firm Bylaws & Constitutional Charter
│   │   │   ├── consultar-caso/      # Sovereign Public Case Lookup (by Docket / ID)
│   │   │   └── registro-cliente/    # Direct intake form for prospective enterprise clients
│   │   │
│   │   ├── (auth)/                  # Authentication Gateways
│   │   │   ├── login/               # High-security credential login (email / national ID)
│   │   │   └── register/            # Law firm onboarding and tenant bootstrap
│   │   │
│   │   ├── panel/                   # Sovereign Law Firm Management Dashboard
│   │   │   ├── layout.tsx           # Authenticated panel layout (sidebar, header, glass backdrop)
│   │   │   ├── dashboard/           # Real-time KPIs, case volume, billables & win-loss metrics
│   │   │   ├── casos/               # Comprehensive legal case docket management
│   │   │   ├── abogados/            # Attorney hierarchy (Partners, Seniors, Juniors) & workload
│   │   │   └── clientes/            # Confidential corporate & personal client registry
│   │   │
│   │   └── api/                     # Backend RESTful & Multi-Tenant Endpoints
│   │       ├── auth/
│   │       │   ├── login/route.ts   # JWT issuance & password validation
│   │       │   ├── logout/route.ts  # HTTP-only cookie clearing
│   │       │   ├── me/route.ts      # Active user session introspection
│   │       │   └── register/route.ts# Tenant & firm admin atomic provisioning
│   │       ├── clientes/
│   │       │   ├── consulta-caso/   # Public case tracking API (tenant-scoped)
│   │       │   └── registro-publico/# Public client onboarding API
│   │       └── tenants/
│   │           └── publicos/        # Public tenant directory for instant routing
│   │
│   ├── components/                  # Reusable UI & WebGL Graphics
│   │   └── ui/
│   │       ├── BackgroundVideo.tsx  # Smooth looping background video component
│   │       ├── ChromaGrid.tsx       # Optical chromatic grid background (React Bits)
│   │       ├── ChromaGrid.css       # Grid scanlines and optical styling
│   │       ├── Ferrofluid.tsx       # Interactive WebGL magnetic liquid simulation
│   │       ├── Ferrofluid.css       # Ferrofluid viewport & canvas styles
│   │       ├── FluidGlassBackground.tsx # Apple VisionOS multi-layered liquid glass backdrop
│   │       ├── FluidGlassLens.tsx   # Glass lens refraction effect
│   │       ├── HeaderControls.tsx   # Interactive Theme & Language toggle pill
│   │       ├── Lightfall.tsx        # WebGL2 celestial light beams with bloom shaders
│   │       ├── Lightfall.css        # Lightfall shader canvas styles
│   │       ├── PillNav.tsx          # Apple dynamic pill floating navigation
│   │       ├── PillNav.css          # Glass navigation transitions & animations
│   │       ├── ProfileCard.tsx      # 3D interactive holographic legal team cards
│   │       ├── ProfileCard.css      # Card tilt & lighting reflections
│   │       ├── PublicNavbar.tsx     # Unified header navigation bar
│   │       ├── SpecularButton.tsx   # Liquid glass reflective push button
│   │       └── SpecularButton.css   # Button physics & active states
│   │
│   ├── context/                     # Global State Providers
│   │   ├── LanguageContext.tsx      # EN / ES localization dictionary provider
│   │   └── ThemeContext.tsx         # VisionOS Light / Dark mode synchronizer
│   │
│   └── lib/                         # Core Business Logic & Infrastructure
│       ├── ai/
│       │   └── triageLegal.ts       # Automated legal priority & attorney level matching
│       ├── auth/
│       │   ├── cookies.ts           # Secure cookie getter/setter helpers
│       │   ├── getSession.ts        # Server-side JWT session resolver
│       │   └── jwt.ts               # Jose HMAC-SHA256 signature and verification
│       ├── data/
│       │   └── constitucion.ts      # Comprehensive law firm charter data
│       ├── db/
│       │   ├── provisionTenant.ts   # Dynamic schema generation & DDL executor
│       │   ├── publicClient.ts      # Public Prisma singleton instance
│       │   ├── syncPublicTables.ts  # Database synchronization utilities
│       │   └── tenantClient.ts      # Dynamic tenant connection pool manager
│       ├── validation/
│       │   ├── auth.ts              # Zod validation schemas for credentials
│       │   └── cliente.ts           # Zod validation schemas for client intake
│       └── http.ts                  # Standardized API response formatters
│
└── scratch/                         # Development & Seeding Scripts
    ├── seed_supabase_completo.ts    # Complete database bootstrap and demo firm generator
    └── sync_public_tables.ts        # Schema repair script
```

---

## 🎨 Visual Engine & WebGL

The user interface breaks away from dull corporate dashboards by incorporating high-performance GPU shaders, Apple VisionOS design philosophies, and physical simulations.

```
       ┌────────────────────────────────────────────────────────┐
       │             APPLE VISIONOS LIQUID GLASS UI             │
       ├────────────────────────────────────────────────────────┤
       │  • Optical Refraction Blur: backdrop-filter: blur(40px) │
       │  • Specular Edge Highlight: inset 0 1px 1px rgba(...)  │
       │  • Multi-Tier Ambient Lighting: Cobalt / Gold / Violet │
       │  • Dynamic System Contrast: Automatic Light/Dark Mode  │
       └────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │              GLSL SHADERS & WEBGL GRAPHICS             │
       ├────────────────────────────────────────────────────────┤
       │  1. FERROFLUID (WebGL Canvas)                          │
       │     - Interactive magnetic fluid with cursor pull      │
       │     - Dynamic spikes, fluidity, tilt & color shifting  │
       │                                                        │
       │  2. LIGHTFALL (WebGL2 Shader + Bloom)                  │
       │     - Celestial justice streaks with realistic bloom   │
       │     - High-speed GPU particle computation              │
       │                                                        │
       │  3. 3D HOLOGRAPHIC PROFILE CARDS                       │
       │     - Real-time 3D rotation matrix on mouse move       │
       │     - Interactive legal team showcase                  │
       └────────────────────────────────────────────────────────┘
```

---

## 🔒 Security & Zero-Trust Architecture

1. **State-of-the-Art Cryptography**:
   - Authentication tokens are signed using **Jose** (`HS256`) with a cryptographically secure 256-bit secret.
   - Tokens are stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies to eliminate XSS token theft.
   - Passwords are salted and hashed using **bcryptjs** (10 salt rounds).

2. **Cross-Tenant Breach Prevention**:
   - Each tenant's data resides in a separate Postgres schema.
   - Database queries do not rely solely on `WHERE tenant_id = ...`. Every tenant request executes on a distinct database search path (`SET search_path = tenant_xyz`).
   - Leaking another firm's data through standard SQL injection or missing where-clauses is structurally impossible.

3. **Attack Mitigation & Idempotency**:
   - `IdempotencyKey` engine in the public schema prevents duplicate transactions or double billing.
   - `RateLimitHit` sliding-window bucket tracker defends against brute-force credential stuffing.

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **PostgreSQL**: `15+` or **Supabase** instance
- **Package Manager**: `npm`, `pnpm`, or `bun`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/emmanuelarchi30-alt/HARVEY-SPECTER.git
cd HARVEY-SPECTER
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Configure your credentials:

```env
# PostgreSQL connection string with connection pooler (e.g. Supabase port 6543)
DATABASE_URL="postgresql://postgres:yourpassword@db.your-supabase-ref.supabase.co:6543/postgres?pgbouncer=true"

# Direct connection string for DDL migrations and schema creation (port 5432)
DIRECT_URL="postgresql://postgres:yourpassword@db.your-supabase-ref.supabase.co:5432/postgres"

# Cryptographic JWT Secret (minimum 32 characters)
JWT_SECRET="harvey-specter-secure-jwt-secret-key-32-chars-minimum-2026"

# Public Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Schema Generation

Generate both the public and tenant Prisma clients:

```bash
# Generate Prisma Client for Public and Tenant schemas
npm run db:generate

# Apply public migrations
npm run db:migrate

# Update tenant DDL template
npm run db:template
```

### 4. Database Seeding (Optional)

To bootstrap the database with sample legal firms (Specter Litt, Pearson Hardman, Zane & Associates), attorneys, and active cases:

```bash
npx tsx scratch/seed_supabase_completo.ts
```

### 5. Launch Development Server

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to access the landing page.

---

## 🌿 Git Branching Strategy & Clean Architecture

This repository follows a strict **Clean Trunk & Feature Flow**:

```mermaid
gitGraph
   commit id: "Init Project"
   commit id: "Multi-Tenant Setup"
   branch develop
   checkout develop
   commit id: "WebGL Shaders"
   commit id: "VisionOS UI Glass"
   commit id: "Legal Triage Engine"
   checkout main
   merge develop id: "Release v1.0.0 (Production)"
   checkout develop
   branch feature/ai-briefing
   commit id: "Add AI Summarizer"
   checkout develop
   merge feature/ai-briefing id: "Integrate AI"
```

### Branches in this Repository:
- **`main`**: Production-ready, verified, deployable codebase.
- **`develop`**: Active integration branch for new features and visual enhancements.

---

## ⚖️ Legal Hierarchy & Roles

| Role Code | English Title | Spanish Title | Capabilities |
| :--- | :--- | :--- | :--- |
| `admin` | System Administrator | Administrador | Full tenant configuration, user management, billing, and schema control. |
| `socio` | Senior Equity Partner | Socio Principal | Case oversight, financial performance, high-stakes litigation assignment. |
| `senior` | Senior Trial Attorney | Abogado Senior | High-complexity trial defense, constitutional petitions, client negotiations. |
| `junior` | Associate Attorney | Abogado Junior | Standard procedural lawsuits, client interviews, document drafting. |

---

## 👨‍💻 Authors & Credits

- **Created by:** [emmanuelarchi30-alt](https://github.com/emmanuelarchi30-alt)
- **Contact:** `emmanuelarchi30@gmail.com`
- **Aesthetic Inspiration:** *Suits (USA Network)*, Harvey Specter, Apple VisionOS, React Bits.

---

<div align="center">
  <sub>Engineered with precision for the relentless legal minds who refuse to accept defeat.</sub>
</div>
