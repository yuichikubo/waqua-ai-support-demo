import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/db'
import { fondeskCalls } from '@/db/schema'
import { getCategoryFromMessage } from '@/utils/aiResponses'

// Fondeskのwebhookペイロード型（公式仕様に準拠）
// https://intercom.help/fondesk/ja/articles/webhook
interface FondeskPayload {
  id: number | string
  created_at: string          // 受電日時 ISO8601
  caller_number: string       // 発信者電話番号
  caller_name?: string        // 発信者名（会社名・担当者名）
  user_name?: string          // 対応したFondeskオペレーター名
  memo: string                // 用件メモ
  is_callback_requested?: boolean // 折り返し希望フラグ
}

export async function POST(request: NextRequest) {
  try {
    const payload: FondeskPayload = await request.json()

    // 必須フィールドのバリデーション
    if (!payload.id || !payload.created_at || !payload.caller_number || !payload.memo) {
      return NextResponse.json(
        { error: 'Missing required fields: id, created_at, caller_number, memo' },
        { status: 400 }
      )
    }

    // AI分類
    const category = getCategoryFromMessage(payload.memo)

    // DBに保存
    const db = getDb()
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

    return NextResponse.json({ success: true, id: inserted[0].id }, { status: 201 })
  } catch (error) {
    console.error('Fondesk webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// デモ用：Fondeskからの着信をシミュレートするエンドポイント
export async function PUT(request: NextRequest) {
  const samples = [
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

  const sample = samples[Math.floor(Math.random() * samples.length)]
  const category = getCategoryFromMessage(sample.memo)

  const db = getDb()
  const inserted = await db.insert(fondeskCalls).values({
    fondeskId: String(sample.id),
    receivedAt: new Date(sample.created_at),
    callerName: sample.caller_name,
    callerPhone: sample.caller_number,
    operatorName: sample.user_name,
    message: sample.memo,
    rawPayload: JSON.stringify(sample),
    status: '未確認',
    category,
  }).returning()

  return NextResponse.json({ success: true, id: inserted[0].id })
}
