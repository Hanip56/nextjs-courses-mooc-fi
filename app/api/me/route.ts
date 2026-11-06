import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'

// Never cache the response, and never include the token or password hash in JSON.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i)
  if (!match) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

  const token = match[1]
  const [user] = await db.select({ id: users.id, username: users.username, name: users.name })
    .from(users).where(eq(users.token, token)).limit(1)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

  return NextResponse.json(user, { headers: { 'Cache-Control': 'no-store' } })
}
