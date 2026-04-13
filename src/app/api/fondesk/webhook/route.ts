import { NextRequest, NextResponse } from 'next/server'
import { getCategoryFromMessage } from '@/utils/aiResponses'

interface FondeskPayload {
  id: number | string
  created_at: string
  caller_number: string
  caller_name?: string
  user_name?: string
  memo: string
  is_callback_requested?: boolean
}

const demoSamples: FondeskPayload[] = [
  {
    id: `demo-${Date.now()}-1`,
    created_at: new Date().toISOString(),
    caller_number: '03-1234-5678',
    caller_name: '株式会社ABC 総務部 田村様',
    user_name: 'Fondeskオペレーター 加藤',
    memo: 'ウォーターサーバーのレンタル料金について確認したいとのことです。折り返しのご連絡をお願いしたいとのことでした。',
    is_callback_requested: true,
  },
  {
    id: `demo-${Date.now()}-2`,
    created_at: new Date().toISOString(),
    caller_number: '080-9999-1111',
    caller_name: '村上 健司様',
    user_name: 'Fondeskオペレーター 山本',
    memo: 'お湯が出なくなってしまったとのことで、早急に対応してほしいとのことです。',
    is_callback_requested: true,
  },
  {
    id: `demo-${Date.now()}-3`,
    created_at: new Date().toISOString(),
    caller_number: '06-3333-4444',
    caller_name: '有限会社やまだ商店 山田様',
    user_name: 'Fondeskオペレーター 鈴木',
    memo: 'フィルターの交換パーツを注文したいとのことです。型番はWF-150で2本希望とのことでした。',
    is_callback_requested: false,
  },
]

async function insertCall(payload: FondeskPayload) {
  if (!process.env.DATABASE_URL) {
    return { id: Math.floor(Math.random() * 10000), _mock: true }
  }

  const { getDb } = await import('@/db')
  const { fondeskCalls } = await import('@/db/schema')
  const db = getDb()
  const category = getCategoryFromMessage(payload.memo)

  const inserted = await db.insert(fondeskCalls).values({
    fondeskId: String(payload.id),
    receivedAt: new Date(payload.created_at),
    callerName: payload.caller_name ?? null,
    callerPhone: payload.caller_number,
    operatorName: payload.user_name ?? null,
    message: payload.memo,
    rawPayload: JSON.stringify(payload),
    status: '未確認',
    category,
  }).returning()

  return inserted[0]
}

// Fondesk本番Webhook受信
export async function POST(request: NextRequest) {
  try {
    const payload: FondeskPayload = await request.json()

    if (!payload.id || !payload.created_at || !payload.caller_number || !payload.memo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await insertCall(payload)
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
  } catch (error) {
    console.error('Fondesk webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// デモ用シミュレーション
export async function PUT() {
  try {
    const sample = demoSamples[Math.floor(Math.random() * demoSamples.length)]
    sample.id = `demo-${Date.now()}`
    sample.created_at = new Date().toISOString()

    const result = await insertCall(sample)
    return NextResponse.json({ success: true, id: result.id, _mock: !process.env.DATABASE_URL })
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
