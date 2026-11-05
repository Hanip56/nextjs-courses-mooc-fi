import { notFound } from 'next/navigation'
import { getBlog } from '@/lib/blogs'
import { likeBlogAction } from '../actions'
export const dynamic = 'force-dynamic'
export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlog(id)
  if (!blog) notFound()
  return <main><h1 className="mb-4 text-2xl font-bold">{blog.title}</h1>
    <p>By {blog.author}</p><p><a className="underline" href={blog.url}>{blog.url}</a></p>
    <p className="my-3">Likes: {blog.likes}</p>
    <form action={likeBlogAction}><input type="hidden" name="id" value={blog.id} />
      <button className="rounded bg-blue-700 px-4 py-2 text-white">Like</button>
    </form>
  </main>
}
