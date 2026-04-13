import { NextRequest, NextResponse } from 'next/server'
import { fondeskMockData } from '@/data/fondeskMock'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  if (!process.env.DATABASE_URL) {
    // DB未設定時はモックデータを返す
    const rows = status && status !== 'すべて'
      ? fondeskMockData.filter((r) => r.status === status)
      : fondeskMockData
    return NextResponse.json(rows)
  }

  try {
    const { getDb } = await import('@/db')
    const { fondeskCalls } = await import('@/db/schema')
    const { desc, eq } = await import('drizzle-orm')
    const db = getDb()

    const rows = status && status !== 'すべて'
      ? await db.select().from(fondeskCalls)
          .where(eq(fondeskCalls.status, status as '未確認' | '確認済み' | '折り返し待ち' | '折り返し済み'))
          .orderBy(desc(fondeskCalls.receivedAt))
      : await db.select().from(fondeskCalls).orderBy(desc(fondeskCalls.receivedAt))

    return NextResponse.json(rows)
  } catch (error) {
    console.error('DB error, falling back to mock:', error)
    const rows = status && status !== 'すべて'
      ? fondeskMockData.filter((r) => r.status === status)
      : fondeskMockData
    return NextResponse.json(rows)
  }
}
