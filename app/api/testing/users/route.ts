import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/db'
import { users } from '@/db/schema'

// Exercise 23: test fixture factory. NEVER expose in production.
export async function POST(request: NextRequest) {
  const testMode = process.env.FSO_E2E_TEST === 'true'
  const localRequest = new URL(request.url).hostname === 'localhost'
  if (!testMode || !localRequest) {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Expected a user object' }, { status: 400 })
  }
  const values = body as Record<string, unknown>
  const { username, name, password } = values
  if (typeof username !== 'string' || username.trim().length < 1 ||
      typeof name !== 'string' || name.trim().length < 1 ||
      typeof password !== 'string' || password.length < 1) {
    return NextResponse.json(
      { error: 'username, name, and password are required' },
      { status: 400 },
    )
  }

  try {
    const [created] = await db.insert(users).values({
      username: username.trim(),
      name: name.trim(),
      passwordHash: await hash(password, 10),
    }).returning({ id: users.id, username: users.username, name: users.name })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Failed to create testing user', error)
    return NextResponse.json({ error: 'Could not create user (possibly duplicate username)' }, { status: 409 })
  }
}
