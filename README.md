# Car Rental Listings Admin Dashboard

[Live Demo](https://car-rental-dashboard-yashraj-jaiswal-project.vercel.app)

This project is an internal admin dashboard for reviewing, approving, rejecting, and editing car rental listings submitted by users. It was built as part of a technical assessment to demonstrate proficiency with Next.js, React, API integration, and clean UI/UX practices.

## Features

- **Login & Authentication**: Secure login (email & password, with registration on first sign-in), using NextAuth.
- **Dashboard**: Paginated, sortable table view of all car rental listings, fetched from an API (mock or SQLite-backed).
- **Actionable Table**: Each listing row provides Approve, Reject, Edit, and Delete actions. Approve/Reject update listing status immediately.
- **Edit Listings**: Editing opens a form with pre-filled data for updating car name, description, or owner.
- **Generate Mock Listings**: Quickly populate the database with demo data for easy testing.
- **Sorting & Pagination**: Easily sort listings by Car Name, Owner, Status, Submission date, or Last update. Pagination ensures performance with many listings.
- **Feedback Messaging**: Uses React Context & hooks to display success/error toasts on actions.
- **Route Protection**: All dashboard and API routes require authentication; unauthenticated users are redirected to login.
- **Responsive Design**: TailwindCSS ensures a mobile- and desktop-friendly UI with accessible components.

## Stretch Goals

- [x] Filtering by listing status (approved, pending, rejected)
- [x] Audit trail/logging
- [x] Run using SQLite
- [x] Performance optimizations (uses React Query, only re-renders changed rows)
- [x] Vercel deployment instructions

## Tech Stack

- **Framework:** Next.js (with SSR, API routes, and getServerSideProps)
- **UI:** TailwindCSS, Radix UI (for components)
- **State management:** React Context API, React Query
- **Database:** Drizzle ORM with SQLite (in-memory for demo or file-based for persistence)
- **Authentication:** NextAuth.js (credentials provider, secure JWT)
- **Validation:** Zod schemas, React Hook Form

## Directory Structure

- `src/pages/` — Next.js pages (login, dashboard, API routes)
- `src/components/` — Reusable UI components (listing table, edit form, etc.)
- `src/hooks/` — Custom React hooks for listings logic
- `src/lib/` — Utilities, types, db queries
- `src/constants/` — Constants and enums
- `src/styles/` — Global styles (Tailwind)

## Requirements

- Node.js 18+ (or Bun)
- SQLite (all setup handled automatically)
- (Recommended) [Bun](https://bun.sh/) for fast scripts, but npm/yarn work too.

## Getting Started

### 1. Clone the repository

```bash
git clone <repo_url>
cd car-rental-dashboard
```

### 2. Install dependencies

```bash
bun install     # or
npm install     # or
yarn install
```

### 3. Set up the database (SQLite)

By default, the app uses SQLite with Drizzle ORM. Run the following to create the schema (in-memory by default, or file for persistence):

```bash
bun run db:push     # or
npm run db:push
```

### 4. Start the development server

```bash
bun run dev     # or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 5. Login

Go to `/login` and use any email/password combination. (Accounts are created automatically on first sign-in.)

### 6. Generate mock listings

On the dashboard, click "Generate Mock Listings" to add demo listings.

## Scripts

- `dev` — Start local dev server
- `build` — Build for production
- `start` — Start production server
- `db:push` — Create DB schema (Drizzle ORM)
- `db:generate` — Generate migrations
- `db:migrate` — Run migrations
- `lint` — Lint code
- `typecheck` — TypeScript check

## Deployment

The app can be deployed to [Vercel](https://vercel.com/) with zero configuration. SQLite is supported—no cloud DB setup needed. For SQLite persistence, ensure the database file is included in `vercel.json` or as a build output.

**Local:**

- Use the Getting Started steps above.

**Vercel:**

- Push to a GitHub repo and import into Vercel. Vercel will detect Next.js and build automatically.
- Ensure you add environment variables for any secrets (see `.env.example` if present).
- For production SQLite, configure Drizzle and Next.js for file-based SQLite; see Drizzle ORM docs for details.

## Assessment Task

This project was built to solve the following assessment:

> **Task:** Build a Custom Admin Dashboard for Managing User-Generated Car Rental Listings. Admins can review, approve, reject, or edit listings. Use Next.js (SSR, API routes), protect routes, use React Context, TailwindCSS, sorting, pagination, and filtering. See `/login` to begin.

## License

MIT

---

For more details, see the source code and comments throughout the project.
