import Link from 'next/link'
import { getUsers } from '@/lib/users'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const users = await getUsers()
  return (
    <main>
      <h1 className="mb-5 text-2xl font-bold">Users</h1>
      {users.length === 0 ? (
        <p className="text-slate-600">No users yet. Add one using Drizzle Studio.</p>
      ) : (
        <ul className="space-y-3">
          {users.map(user => (
            <li key={user.id} className="rounded border p-4">
              <Link href={`/users/${encodeURIComponent(user.username)}`} className="font-medium text-blue-700 underline">
                {user.name}
              </Link>
              <span className="ml-2 text-sm text-slate-500">@{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
