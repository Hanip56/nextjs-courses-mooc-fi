import 'server-only'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function getUsers() {
  return db.select({ id: users.id, username: users.username, name: users.name })
    .from(users).orderBy(asc(users.name))
}

// Single Drizzle relational query; includes blogs through the `with` option.
export async function getUserWithBlogs(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: { blogs: true },
  })
}
