import { NextResponse } from 'next/server'
import { db } from '@/db'
import { blogs, readingList, users } from '@/db/schema'

// Exercise 23: destructive fixture reset. NEVER expose in production.
export async function DELETE() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 },
    )
  }

  try {
    await db.transaction(async (tx) => {
      await tx.delete(readingList)
      await tx.delete(blogs)
      await tx.delete(users)
    })
    return NextResponse.json({ message: 'Database reset successfully' })
  } catch (error) {
    console.error('Failed to reset testing database', error)
    return NextResponse.json({ error: 'Could not reset database' }, { status: 500 })
  }
}
