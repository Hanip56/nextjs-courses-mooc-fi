import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
  likes: integer('likes').notNull().default(0),
})
