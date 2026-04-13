import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { fondeskCalls } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Status = '未確認' | '確認済み' | '折り返し待ち' | '折り返し済み'

interface UpdateBody {
  status?: Status
  assignee?: string
  callbackNote?: string
  callbackBy?: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body: UpdateBody = await request.json()

  const updates: Partial<typeof fondeskCalls.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (body.status) updates.status = body.status
  if (body.assignee !== undefined) updates.assignee = body.assignee

  // 折り返し済みにする場合は日時も記録
  if (body.status === '折り返し済み') {
    updates.callbackAt = new Date()
    if (body.callbackNote) updates.callbackNote = body.callbackNote
    if (body.callbackBy) updates.callbackBy = body.callbackBy
  }

  const db = getDb()
  const updated = await db
    .update(fondeskCalls)
    .set(updates)
    .where(eq(fondeskCalls.id, Number(id)))
    .returning()

  if (!updated.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(updated[0])
}
