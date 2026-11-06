import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { blogs, readingList, users } from '@/db/schema'

// Exercise 23: destructive fixture reset. NEVER expose in production.
export async function DELETE(request: NextRequest) {
  const testMode = process.env.FSO_E2E_TEST === 'true'
  const localRequest = new URL(request.url).hostname === 'localhost'
  if (!testMode || !localRequest) {
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
