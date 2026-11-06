import 'server-only'
import { desc, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { blogs, readingList } from '@/db/schema'

export type Blog = typeof blogs.$inferSelect

export async function getBlogs(): Promise<Blog[]> {
  return db.select().from(blogs).orderBy(desc(blogs.likes))
}

export async function getBlog(id: string): Promise<Blog | undefined> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return undefined
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)
  return blog
}

export async function createBlog(blog: Pick<Blog, 'title' | 'author' | 'url' | 'userId'>) {
  if (!blog.userId) throw new Error('A blog author must be logged in')
  // Both writes succeed or both roll back: the author's new blog is in their reading list.
  return db.transaction(async (tx) => {
    const [created] = await tx.insert(blogs).values(blog).returning()
    await tx.insert(readingList).values({ userId: blog.userId!, blogId: created.id })
    return created
  })
}

export async function likeBlog(id: string) {
  const [updated] = await db.update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id))
    .returning()
  if (!updated) throw new Error('Blog not found')
  return updated
}
