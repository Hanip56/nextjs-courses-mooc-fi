import Link from "next/link"
import { getBlogs } from "@/lib/blogs"
export const dynamic = "force-dynamic"
type Props = { searchParams: Promise<{ filter?: string | string[] }> }
export default async function Blogs({ searchParams }: Props) {
  const params = await searchParams
  const raw = Array.isArray(params.filter) ? params.filter[0] : params.filter
  const filter = (raw ?? "").trim()
  const blogs = (await getBlogs()).filter(b => b.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.likes - a.likes)
  return <main className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Discover</p>
      <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
      <p className="mt-1 text-sm text-slate-500">Browse and search community blogs, sorted by likes.</p>
    </div><Link href="/blogs/new" className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Create new blog</Link></div>
    <form action="/blogs" method="GET" className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label htmlFor="filter" className="min-w-48 flex-1 space-y-1"><span className="block text-sm font-semibold">Search by title</span>
      <input id="filter" name="filter" type="search" defaultValue={filter} placeholder="Search blogs..." className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-offset-2 focus:border-blue-600" /></label>
      <button type="submit" className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700">Search</button>
      {filter && <Link href="/blogs" className="rounded-lg px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">Clear</Link>}
    </form>
    {blogs.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">No blogs found{filter ? ` for “${filter}”` : ""}.</p> :
      <ul className="grid gap-3 sm:grid-cols-2">{blogs.map(b => <li key={b.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
        <Link href={`/blogs/${b.id}`} className="text-lg font-semibold text-slate-900 hover:text-blue-700 hover:underline">{b.title}</Link>
        <p className="mt-2 text-sm text-slate-500">By {b.author}</p>
        <p className="mt-4 text-sm font-medium text-blue-700">♥ {b.likes} likes</p>
      </li>)}</ul>}
  </main>
}
