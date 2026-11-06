# Full Stack Open, Part 14 — Exercises 21–22

Based on the working Exercises 1–20 application. These changes do not require a database migration.

## Exercise 21 — Better reading list
- `/me` separates entries into **Unread** and **Read** sections.
- A **Mark as read** button submits a Server Action.
- The database UPDATE checks both the reading list entry ID and the signed-in user ID.
- Revalidation refreshes `/me` so the item moves to the Read section.

## Exercise 22 — Static homepage from Markdown
- `app/homepage.mdx` contains the homepage copy.
- `app/page.tsx` imports and renders the MDX component.
- `next.config.mjs`, `mdx-components.tsx`, and MDX dependencies enable Next.js 15 App Router MDX support.
- `app/globals.css` styles the generated HTML.

## Updating your current application

Copy these files from the ZIP (and keep all other files unchanged):

- `app/reading-list/actions.ts`
- `app/me/page.tsx`
- `app/page.tsx`
- `app/homepage.mdx` (new)
- `app/globals.css`
- `package.json`
- `next.config.mjs` (new; if you already have a config, merge instead of overwriting)
- `mdx-components.tsx` (new)

Run:

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

### Test
1. Sign in and visit `/me`.
2. Add a blog to your reading list if necessary.
3. Verify it appears under Unread.
4. Click Mark as read, then confirm it moves to Read.
5. Refresh `/me` and confirm it remains under Read.
6. Visit `/` and confirm the Markdown homepage renders with styled headings and links.

Note: no build or database tests were executed in the packaging environment. Review and run the commands locally before submission.
