import Link from 'next/link'
import { getBlogs } from '@/lib/blogs'

// Exercises 5–6: Sort by likes and filter blogs using URL search parameters.
export const dynamic = 'force-dynamic'

type BlogsPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>
}

export default async function Blogs({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const rawFilter = Array.isArray(params.filter) ? params.filter[0] : params.filter
  const filter = (rawFilter ?? '').trim()
  const blogs = (await getBlogs())
    .filter(blog => blog.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.likes - a.likes)

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Blogs</h1>
      <form action="/blogs" method="GET" className="mb-5 flex flex-wrap items-end gap-3">
        <label htmlFor="filter" className="flex flex-col gap-1">
          <span className="text-sm font-medium">Search blogs by title</span>
          <input
            id="filter"
            name="filter"
            type="search"
            defaultValue={filter}
            placeholder="e.g. React"
            className="rounded border px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white">
          Search
        </button>
        {filter && <Link href="/blogs" className="px-2 py-2 underline">Clear</Link>}
      </form>

      {blogs.length === 0 ? (
        <p>No blogs found{filter ? ` for “${filter}”` : ''}.</p>
      ) : (
        <ul className="space-y-3">
          {blogs.map(blog => (
            <li key={blog.id} className="rounded border p-3">
              <Link className="underline" href={`/blogs/${blog.id}`}>{blog.title}</Link>
              {' — '}{blog.author} ({blog.likes} likes)
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
