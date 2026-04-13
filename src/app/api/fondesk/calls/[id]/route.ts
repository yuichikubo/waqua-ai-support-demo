import { NextRequest, NextResponse } from 'next/server'

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

  if (!process.env.DATABASE_URL) {
    // DB未設定時はモックレスポンスを返す（クライアント側でローカル更新）
    return NextResponse.json({ id: Number(id), ...body, _mock: true })
  }

  try {
    const { getDb } = await import('@/db')
    const { fondeskCalls } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()

    const updates: Partial<typeof fondeskCalls.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (body.status) updates.status = body.status
    if (body.assignee !== undefined) updates.assignee = body.assignee

    if (body.status === '折り返し済み') {
      updates.callbackAt = new Date()
      if (body.callbackNote) updates.callbackNote = body.callbackNote
      if (body.callbackBy) updates.callbackBy = body.callbackBy
    }

    const updated = await db
      .update(fondeskCalls)
      .set(updates)
      .where(eq(fondeskCalls.id, Number(id)))
      .returning()

    if (!updated.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('DB error:', error)
    return NextResponse.json({ id: Number(id), ...body, _mock: true })
  }
}
