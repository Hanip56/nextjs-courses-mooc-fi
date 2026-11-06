# Blog App — Full Stack Open, Part 14 (Next.js)

A full-stack blog application built with **Next.js 15**, **React 19**, **TypeScript**, **PostgreSQL**, and **Drizzle ORM** as part of the University of Helsinki's [Full Stack Open](https://fullstackopen.com/en/) Next.js course (Part 14).

The application lets users register and sign in, publish and browse blogs, like posts, search by title, maintain a personal reading list, and create an API token for accessing their profile through a protected endpoint. It also includes automated browser tests with Playwright and a GitHub Actions workflow.

## Features

### Authentication and user accounts
- Register with a username, display name, and password confirmation.
- Server-side validation with field-specific error messages.
- Sign in and sign out using **Auth.js / NextAuth.js v5** credentials authentication.
- Passwords stored as **bcrypt hashes**, not plaintext.
- JWT-based sessions and authenticated actions.
- Browse users and view an individual user's blogs.

### Blog management
- Create a blog with a **title**, **author**, and **URL** after signing in.
- Server-side form validation; entered values are preserved after validation errors.
- Browse blogs sorted by likes, with title filtering via URL search parameters.
- Open individual blog detail pages at `/blogs/[id]` and like posts.
- Blogs are linked to their creators.

### Reading list and profile
- Add posts to a personal reading list.
- View **Unread** and **Read** sections on `/me`, and mark an item as read.
- New blogs are added to their creator's reading list automatically.
- Generate or regenerate a personal API token.
- Retrieve basic user profile data from `GET /api/me` with a Bearer token.

### UI and quality
- Responsive styling with Tailwind CSS v4.
- A Markdown/MDX-powered homepage.
- Status notifications and accessible labels for forms and navigation.
- End-to-end tests using **Playwright** and continuous testing with **GitHub Actions**.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon or local PostgreSQL) |
| ORM and migrations | Drizzle ORM and Drizzle Kit |
| Authentication | Auth.js / NextAuth.js v5, bcryptjs |
| Validation | Zod and Server Actions |
| Content | MDX (`@next/mdx`) |
| Testing | Playwright |
| CI | GitHub Actions |

## Requirements

- Node.js and npm compatible with Next.js 15 (Node.js **20.9+** recommended as a minimum; a current supported LTS version is preferable).
- A PostgreSQL database and its connection string.
- Git (recommended for version control and submission).

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
cd <YOUR_REPOSITORY>
npm ci
```

If you are working with a downloaded ZIP instead, extract it, open the project folder, and run `npm install`.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and replace the sample values:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
AUTH_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
AUTH_TRUST_HOST=true
```

Generate an authentication secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

On Windows PowerShell, the same Node.js command works. Do **not** commit `.env.local`, `.env.test`, actual credentials, or API tokens.

### 3. Initialize the database

For a fresh database, generate and apply Drizzle migrations:

```bash
npm run db:generate
npm run db:migrate
```

You can inspect your database using:

```bash
npm run db:studio
```

> **Existing database:** Back up important data and inspect generated SQL before applying schema changes. Avoid running test-reset operations against your regular database.

### 4. Run the app

```bash
npm run dev
```

Open **http://localhost:3000**.

For a production build:

```bash
npm run build
npm run start
```

## Main application routes

| Path | Purpose |
| --- | --- |
| `/` | MDX homepage |
| `/register` | Create an account |
| `/login` | Sign in |
| `/blogs` | Browse, sort, and filter blog posts |
| `/blogs/new` | Create a blog (requires sign-in) |
| `/blogs/[id]` | View and like a blog; add it to the reading list |
| `/users` | Browse registered users |
| `/users/[username]` | View a user's blogs |
| `/me` | Personal profile, reading list, and API token (requires sign-in) |
| `/api/me` | Token-authenticated profile API |

### Token-authenticated API

Generate a token on `/me`, then call:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/me
```

A valid token returns the associated user's public profile details (`id`, `username`, `name`). Missing or invalid tokens return **401 Unauthorized**. Treat generated tokens as secrets.

## Database design

The PostgreSQL schema is defined in `db/schema.ts` and includes:

- **`users`** — UUID primary key, unique username, display name, password hash, optional API token.
- **`blogs`** — UUID internal key, numeric public ID, title, author, URL, like count, optional creator reference.
- **`reading_list`** — relationship between user and blog, read/unread flag, unique `(user_id, blog_id)` constraint.

Drizzle relations connect users to their blogs and reading-list entries.

## Tests

The repository includes the official Full Stack Open Playwright test suite under `tests/`.

### Local browser tests

Install browser dependencies once:

```bash
npx playwright install chromium
```

Configure a **separate test database** before executing the suite. The included Playwright configuration starts a freshly built Next.js server and enables test-only fixture endpoints for the local run.

```bash
npm run typecheck
npm run test:e2e
```

Other useful commands:

```bash
npx playwright test --list
npx playwright test --reporter=line
npm run test:e2e:ui
npx playwright show-report
```

**Reported result:** The project's latest local run passed **28 of 28 Playwright tests**. CI results should be checked independently in GitHub Actions.

> **Destructive testing warning:** The test suite calls `DELETE /api/testing/reset`, which deletes test users, blogs, and reading-list rows. Always run browser tests against a dedicated database with no important data. The testing endpoints are gated by an explicit test flag and localhost checks; never make them publicly accessible.

## GitHub Actions

The repository contains a workflow at `.github/workflows/playwright.yml`. It runs for pushes and pull requests to `main` or `master`, installs dependencies and Chromium, prepares the database, and runs Playwright tests. Failed-run artifacts include a Playwright HTML report.

Add the following repository secrets at **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL URL for a dedicated **test** database |
| `AUTH_SECRET` | Authentication secret for the test server (the workflow also accepts `NEXTAUTH_SECRET`) |
| `NEXTAUTH_URL` | Set to `http://localhost:3000` if required by your workflow |

Never use your production database in GitHub Actions tests. Confirm the workflow's latest status in the **Actions** tab before submitting the course project.

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run development server |
| `npm run build` | Compile a production build |
| `npm run start` | Start the compiled server |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply Drizzle migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:e2e:ui` | Open Playwright interactive mode |

## Project structure

```text
app/
  api/
    auth/[...nextauth]/       # Auth.js handlers
    me/                       # Bearer-token profile endpoint
    testing/                  # Local test fixture endpoints
  blogs/                      # Blog list, details, creation, Server Actions
  login/                      # Login page
  register/                   # Registration page and form
  me/                         # Profile, reading list, API token
  reading-list/               # Reading-list actions
  users/                      # User listing and profile pages
  homepage.mdx                # Homepage content
  layout.tsx                  # Navigation and shared layout
  globals.css                 # Global styling
components/                   # Shared UI and notifications
db/                           # Drizzle client and schema
lib/                          # Business logic and authentication helpers
drizzle/                      # Database migrations
tests/                        # Official Playwright end-to-end tests
.github/workflows/            # GitHub Actions configuration
auth.ts                       # Auth.js configuration
playwright.config.ts          # Browser-test configuration
drizzle.config.ts             # Drizzle Kit configuration
```

## Course submission

This project was developed for **Full Stack Open Part 14 — Next.js**. Before submitting the final exercise, ensure the application code is committed, the required official tests pass, the GitHub Actions workflow is green, and course reviewers have repository access if it is private.

## Acknowledgments

- [Full Stack Open](https://fullstackopen.com/en/) — University of Helsinki
- [Official Next.js course test suite](https://github.com/fullstack-hy2020/next-js-tests)

This repository is an educational course project, not an official University of Helsinki product.
