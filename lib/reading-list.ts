import 'server-only'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { readingList } from '@/db/schema'

export async function getReadingList(userId: string) {
  return db.query.readingList.findMany({
    where: eq(readingList.userId, userId),
    with: { blog: true },
  })
}

export async function isInReadingList(userId: string, blogId: string): Promise<boolean> {
  const [item] = await db.select({ id: readingList.id })
    .from(readingList)
    .where(and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)))
    .limit(1)
  return Boolean(item)
}
