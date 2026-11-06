import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [Credentials({
    credentials: { username: {}, password: {} },
    async authorize(credentials) {
      const username = String(credentials?.username ?? '').trim()
      const password = String(credentials?.password ?? '')
      if (!username || !password) return null
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1)
      if (!user?.passwordHash || !await compare(password, user.passwordHash)) return null
      return { id: user.id, name: user.name, email: null, username: user.username }
    },
  })],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (session.user && typeof token.id === 'string') session.user.id = token.id
      return session
    },
  },
})
