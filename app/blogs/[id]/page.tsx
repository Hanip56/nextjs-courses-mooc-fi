import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getBlog } from '@/lib/blogs'
import { isInReadingList } from '@/lib/reading-list'
import { addToReadingList } from '@/app/reading-list/actions'
import { likeBlogAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlog(id)
  if (!blog) notFound()
  const session = await auth()
  const alreadyAdded = session?.user?.id ? await isInReadingList(session.user.id, blog.id) : false

  return <main className="mx-auto max-w-2xl space-y-5">
    <Link href="/blogs" className="text-sm font-semibold text-blue-700 hover:underline">← All blogs</Link>
    <article data-testid="blog-detail" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 data-testid="blog-title" className="text-3xl font-bold tracking-tight">{blog.title}</h1>
      <p data-testid="blog-author" className="mt-2 text-slate-500">By {blog.author}</p>
      <div className="my-6 border-t border-slate-100" />
      <a className="break-all font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900" href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-slate-600">♥ {blog.likes} likes</span>
        <form action={likeBlogAction}><input type="hidden" name="id" value={blog.id} />
          <button type="submit" className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Like this blog</button>
        </form>
        {session?.user?.id && !alreadyAdded && <form action={addToReadingList}>
          <input type="hidden" name="blogId" value={blog.id} />
          <button data-testid="add-to-reading-list-button" type="submit" className="rounded-lg border border-blue-700 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">Add to Reading List</button>
        </form>}
        {session?.user?.id && alreadyAdded && <span className="text-sm font-medium text-green-700">In your reading list ✓</span>}
      </div>
    </article>
  </main>
}
