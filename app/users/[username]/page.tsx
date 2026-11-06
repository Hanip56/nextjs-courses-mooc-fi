import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getUserWithBlogs } from '@/lib/users'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ username: string }> }

export default async function UserPage({ params }: Props) {
  const { username } = await params
  const user = await getUserWithBlogs(username)
  if (!user) notFound()

  return (
    <main>
      <Link href="/users" className="text-blue-700 underline">← All users</Link>
      <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
      <p className="mb-5 text-slate-500">@{user.username}</p>
      <h2 className="mb-3 text-xl font-semibold">Blogs added</h2>
      {user.blogs.length === 0 ? (
        <p className="text-slate-600">This user has no blogs yet.</p>
      ) : (
        <ul className="space-y-3">
          {user.blogs.map(blog => (
            <li key={blog.id} className="rounded border p-3">
              <Link className="text-blue-700 underline" href={`/blogs/${blog.id}`}>
                {blog.title}
              </Link>
              <span className="ml-2 text-sm text-slate-500">({blog.likes} likes)</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
