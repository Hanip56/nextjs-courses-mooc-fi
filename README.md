# Full Stack Open — Part 14 — Exercises 1–8

## What changed
- Exercises 1–6: blog list, create, detail page, likes, sorting, title filtering.
- Exercise 7: **manual task:** push your repository to GitHub and deploy it on Vercel. See steps below.
- Exercise 8: replace JSON storage with PostgreSQL + Drizzle ORM. The database schema contains `id`, `title`, `author`, `url`, and `likes`. Likes update atomically.

**This is an educational implementation through Exercise 8, not a finished Part 14 submission.** Exercises 9–24 and the official test suite remain outstanding.

## Exercise 8: PostgreSQL setup

1. Create a PostgreSQL database (e.g. [Neon](https://neon.tech), or local PostgreSQL).
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your real connection string. **Never commit `.env.local`.**
3. Install and migrate:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

4. Open `http://localhost:3000/blogs`, add a blog, click Like, search, restart the dev server, and confirm data persists.
5. Optionally view your data using `npm run db:studio`.

**Existing JSON data:** previous versions used `data/blogs.json`. This upgrade does not import those blogs automatically; the JSON file is untouched. You can recreate entries manually, or import them in a separate one-time migration before removing the file. Do not overwrite or remove your previous project directory until the new database version works.

## Exercise 7: Deploy on Vercel

1. Create your own GitHub repository and push this project (do not push `.env.local`).
2. In [Vercel](https://vercel.com), choose **Add New → Project → Import Git Repository**.
3. Set `DATABASE_URL` in **Project Settings → Environment Variables** using your hosted PostgreSQL connection string.
4. Apply migrations to the same database **from your local terminal** with `npm run db:migrate` (using `.env.local`). Do not run migrations automatically on every page request.
5. Deploy and test the resulting URL: create a blog and verify it remains after refresh. No local file writes are required now.

You can perform the Vercel deployment before or after adopting the database; when using the older JSON version, persistent blog creation will not work reliably on Vercel. Use the database version for a functioning deployed app.

## Files changed
- `db/schema.ts` — Drizzle blog table
- `db/index.ts` — Postgres client and Drizzle database instance
- `drizzle.config.ts` — CLI migration config
- `lib/blogs.ts` — database-based blog services
- `package.json` — database dependencies and scripts
- `.env.example` — environment variable template

The route and Server Action interfaces are unchanged, so Exercises 1–6 UI should continue working.

## Notes
- Node.js 20+ is recommended.
- The database must be reachable from your computer.
- Never expose `DATABASE_URL` through `NEXT_PUBLIC_` variables.
- Use a development database for practice; avoid running migration scripts against unrelated production data.
