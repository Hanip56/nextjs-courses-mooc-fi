import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import { getReadingList } from '@/lib/reading-list'
import { generateToken } from './actions'
import { markAsRead } from '@/app/reading-list/actions'

export const dynamic = 'force-dynamic'

export default async function MyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const [user] = await db.select({ name: users.name, username: users.username, token: users.token })
    .from(users).where(eq(users.id, session.user.id)).limit(1)
  if (!user) redirect('/login')
  const items = await getReadingList(session.user.id)
  const unread = items.filter(item => !item.read)
  const read = items.filter(item => item.read)

  return <main className="mx-auto max-w-2xl space-y-6">
    <header><p className="text-sm font-medium uppercase tracking-wide text-blue-600">Account</p>
      <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      <p className="mt-1 text-slate-500">Manage your account, reading list and API token.</p></header>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <dl className="space-y-3 text-sm">
        <div><dt className="font-semibold text-slate-500">Name</dt><dd className="mt-1 text-lg font-medium">{user.name}</dd></div>
        <div><dt className="font-semibold text-slate-500">Username</dt><dd className="mt-1 text-lg">{user.username}</dd></div>
      </dl>
      <hr className="my-6 border-slate-200" />
      <h2 className="text-xl font-semibold">API Token</h2>
      <p className="mt-1 text-sm text-slate-500">Treat this token like a password. Generating a new one invalidates the previous one.</p>
      <div className="my-4 rounded-lg bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Current token</p>
        {user.token ? <code className="block break-all rounded bg-white p-3 text-sm text-slate-900 ring-1 ring-slate-200">{user.token}</code> :
          <p className="text-sm text-slate-500">No token has been generated yet.</p>}
      </div>
      <form action={generateToken}><button type="submit" className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Generate New Token</button></form>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">My Reading List</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No blogs yet. Browse the <Link href="/blogs" className="text-blue-700 underline">blogs</Link> to add some.</p>
      ) : (
        <div className="mt-5 space-y-8">
          <section aria-labelledby="unread-heading">
            <h3 id="unread-heading" className="text-lg font-semibold">Unread ({unread.length})</h3>
            {unread.length === 0 ? <p className="mt-2 text-sm text-slate-500">All caught up!</p> : (
              <ul className="mt-3 space-y-3">{unread.map(item => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                  <Link href={`/blogs/${item.blogId}`} className="font-medium text-blue-700 hover:underline">{item.blog.title}</Link>
                  <form action={markAsRead}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800">Mark as read</button>
                  </form>
                </li>
              ))}</ul>
            )}
          </section>
          <section aria-labelledby="read-heading">
            <h3 id="read-heading" className="text-lg font-semibold">Read ({read.length})</h3>
            {read.length === 0 ? <p className="mt-2 text-sm text-slate-500">Nothing marked as read yet.</p> : (
              <ul className="mt-3 space-y-3">{read.map(item => (
                <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <Link href={`/blogs/${item.blogId}`} className="font-medium text-blue-700 hover:underline">{item.blog.title}</Link>
                </li>
              ))}</ul>
            )}
          </section>
        </div>
      )}
    </section>
  </main>
}
