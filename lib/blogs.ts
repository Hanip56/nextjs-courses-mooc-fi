import 'server-only'
import { desc, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { blogs } from '@/db/schema'

export type Blog = typeof blogs.$inferSelect

export async function getBlogs(): Promise<Blog[]> {
  return db.select().from(blogs).orderBy(desc(blogs.likes))
}

export async function getBlog(id: string): Promise<Blog | undefined> {
  // Avoid a database UUID cast exception for invalid dynamic route IDs.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return undefined
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1)
  return blog
}

export async function createBlog(blog: Pick<Blog, 'title' | 'author' | 'url'>) {
  const [created] = await db.insert(blogs).values(blog).returning()
  return created
}

export async function likeBlog(id: string) {
  const [updated] = await db.update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id))
    .returning()
  if (!updated) throw new Error('Blog not found')
  return updated
}
