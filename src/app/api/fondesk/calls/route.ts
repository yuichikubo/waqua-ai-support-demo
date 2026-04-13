import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { fondeskCalls } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const db = getDb()

  const rows = status && status !== 'すべて'
    ? await db.select().from(fondeskCalls)
        .where(eq(fondeskCalls.status, status as '未確認' | '確認済み' | '折り返し待ち' | '折り返し済み'))
        .orderBy(desc(fondeskCalls.receivedAt))
    : await db.select().from(fondeskCalls).orderBy(desc(fondeskCalls.receivedAt))

  return NextResponse.json(rows)
}
