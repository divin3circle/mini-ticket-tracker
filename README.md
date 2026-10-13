# Mini Ticket Tracker

A full-stack ticket tracking application with a Go backend and React/TypeScript frontend.

## Tech Stack

**Backend:**
- Go with Gin framework
- PostgreSQL with sqlc for type-safe queries
- CORS enabled for frontend integration

**Frontend:**
- React 19 with TypeScript
- TanStack Query v5 for server state management
- TanStack Table v9 for data grid with pagination, filtering, sorting
- @base-ui/react for accessible UI components
- Tailwind CSS v4 for styling
- Vite for build tooling

---

## Setup & Run Instructions

### Prerequisites
- Go 1.21+
- Node.js 18+ / Bun
- Docker (for PostgreSQL via Makefile)

### Backend Setup (using Makefile)

```bash
cd server

# Start PostgreSQL in Docker
make postgres

# Create database
make createdb

# Run migrations
make migrateup

# Generate sqlc code (if schema changes)
make sqlc

# Start server (runs on :8080)
make server
```

**Other useful Makefile commands:**
- `make stop` — stop PostgreSQL container
- `make remove` — remove PostgreSQL container
- `make dropdb` — drop the database
- `make migratedown` — rollback last migration
- `make test` — run Go tests
- `make sqlc` — regenerate sqlc after schema changes

### Frontend Setup

```bash
cd mini-ticket-tracker

# Install dependencies
bun install  # or npm install

# Configure API base URL (create .env if needed)
echo "VITE_API_BASE=http://localhost:8080" > .env

# Start dev server (runs on :5173)
bun run dev  # or npm run dev
```

### Running Both

1. Start PostgreSQL & backend: `cd server && make postgres && make createdb && make migrateup && make server`
2. Run frontend: `cd mini-ticket-tracker && bun run dev`
3. Open http://localhost:5173

---

## Decisions & Tradeoffs

**Backend shortcuts:** Started with nullable fields in the schema which caused sqlc/type complexity, requiring a schema redesign to use non-nullable fields with proper defaults. This delayed backend completion but resulted in cleaner generated code.

**TanStack Table v9 type inference:** The table features API uses complex generic types that don't fully infer when combining multiple features (sorting, filtering, pagination). Used `@ts-expect-error` on component boundaries to unblock development rather than spending days on type gymnastics.

**Optimistic updates:** Implemented for create/update mutations with targeted invalidation. This gives instant UI feedback but adds complexity in rollback logic on error.

**Frontend component splitting:** Broke the monolithic table into ~8 small components (Header, Body, Head, Pagination, Skeleton, StatusBadge, PriorityBadge, columns). Increases file count but improves readability and reuse.

**State management:** Kept server state entirely in TanStack Query cache; only UI state (current page, filter, selected row) lives in React useState. Avoided global stores (Zustand/Redux) since query cache handles server state well.

**UI library choice:** Used @base-ui/react (headless accessible primitives) over shadcn/ui or Material UI to minimize bundle size and avoid opinionated styling. Required building custom components (Badge, Skeleton, LoadingSpinner) but gives full control.