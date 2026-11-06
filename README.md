# Full Stack Open – Part 14 – Exercises 1–20 (learning implementation)

This update starts from the **fixed** Exercises 1–18 project (the `"use server"` export issue remains fixed).

## Exercise 19: `GET /api/me`

- `Authorization: Bearer <token>` required.
- Looks up the stored UUID in `users.token` and returns only `id`, `username`, `name` (never the token or password hash).
- Missing or invalid token returns HTTP 401; response is not cached.

**PowerShell example:**

```powershell
$token = 'PASTE_TOKEN_FROM_ME_PAGE'
Invoke-RestMethod -Uri 'http://localhost:3000/api/me' -Headers @{ Authorization = "Bearer $token" }
```

Generate a token at `/me` first. Test missing/invalid tokens with:

```powershell
try { Invoke-WebRequest 'http://localhost:3000/api/me' } catch { $_.Exception.Response.StatusCode }
```

## Exercise 20: reading list

- `reading_list`: UUID id, foreign keys `user_id` and `blog_id`, `read boolean default false`.
- Every blog created by a signed-in user is added to **their** reading list in the same database transaction.
- Each blog detail page shows **Add to Reading List** for a signed-in user who has not added the blog yet.
- `/me` shows the signed-in user's list; no cross-user data is exposed.
- Database-level unique `(user_id, blog_id)` and on-conflict handling prevent duplicate items.

**Upgrade:** Back up your project and database, then copy these files over the previous version. Keep your existing `.env.local` and database.

Added files:
- `app/api/me/route.ts`
- `app/reading-list/actions.ts`
- `lib/reading-list.ts`

Changed files:
- `db/schema.ts`
- `lib/blogs.ts`
- `app/blogs/[id]/page.tsx`
- `app/blogs/actions.ts`
- `app/me/page.tsx`

Run from the project folder:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run typecheck
npm run dev
```

**Inspect the generated migration SQL before running `db:migrate`.** The intended change is only a new `reading_list` table and its unique index/foreign keys. Your existing users and blogs must remain intact. Existing blogs do not automatically populate the reading list; this exercise's requirement concerns **newly created** blogs.

### Manual verification

1. Sign in, visit `/me`, generate an API token, then send `GET /api/me` with a Bearer token. The response includes only the correct user's public details.
2. Missing/incorrect token returns 401; generating a *new* token invalidates the previous token.
3. Sign in as User A and create a new blog. It appears on A's `/me` reading list.
4. Sign in as User B. Open A's blog and select **Add to Reading List**; B's `/me` now includes it.
5. The same blog can't be added twice, and B can't see A's private reading-list entries (unless also added to B's own list).
6. Previously implemented blog sorting, search, likes, users, registration and token generation still work.

**Not implemented:** Mark as read/unread controls belong to Exercise 21.

This is sample implementation, not an officially graded submission. Run the course's tests before submitting.


## Exercises 21–22

See [UPDATE-21-22.md](UPDATE-21-22.md) for the latest changes, setup and verification.


## Exercises 23–24

See [EXERCISES-23-24.md](EXERCISES-23-24.md) for destructive test endpoint safety, test database setup, and official GitHub Actions steps.
