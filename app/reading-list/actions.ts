"use server"

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/db'
import { blogs, readingList } from '@/db/schema'

export async function addToReadingList(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const blogId = String(formData.get('blogId') ?? '')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(blogId)) throw new Error('Invalid blog ID')

  const [blog] = await db.select({ id: blogs.id }).from(blogs)
    .where(eq(blogs.id, blogId)).limit(1)
  if (!blog) throw new Error('Blog not found')

  // onConflictDoNothing + unique index also handles concurrent requests safely.
  await db.insert(readingList).values({ userId: session.user.id, blogId })
    .onConflictDoNothing({ target: [readingList.userId, readingList.blogId] })

  revalidatePath(`/blogs/${blogId}`)
  revalidatePath('/me')
}


/** Exercise 21: only the owner can mark an item as read. */
export async function markAsRead(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const itemId = String(formData.get('itemId') ?? '')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId)) {
    throw new Error('Invalid reading-list item ID')
  }

  // Ownership is part of the UPDATE condition, not just checked in the UI.
  await db.update(readingList).set({ read: true })
    .where(and(eq(readingList.id, itemId), eq(readingList.userId, session.user.id)))

  revalidatePath('/me')
}
