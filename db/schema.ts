import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, serial, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  token: text('token'),
})

export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  publicId: serial('public_id').unique().notNull(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
  likes: integer('likes').notNull().default(0),
  userId: uuid('user_id').references(() => users.id),
})

// Exercise 20. A unique pair makes duplicate additions impossible, even on double-click.
export const readingList = pgTable('reading_list', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  blogId: uuid('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
  read: boolean('read').notNull().default(false),
}, (table) => [uniqueIndex('reading_list_user_blog_unique').on(table.userId, table.blogId)])

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  readingList: many(readingList),
}))

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  user: one(users, { fields: [blogs.userId], references: [users.id] }),
  readingList: many(readingList),
}))

export const readingListRelations = relations(readingList, ({ one }) => ({
  user: one(users, { fields: [readingList.userId], references: [users.id] }),
  blog: one(blogs, { fields: [readingList.blogId], references: [blogs.id] }),
}))
