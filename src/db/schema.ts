import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

// Fondeskから受信した着信記録
export const fondeskCalls = pgTable('fondesk_calls', {
  id: serial('id').primaryKey(),

  // Fondesk送信データ
  fondeskId: text('fondesk_id').notNull().unique(),   // FondeskのコールID
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull(), // 受電日時
  callerName: text('caller_name'),                    // 発信者名（会社名・担当者）
  callerPhone: text('caller_phone').notNull(),        // 発信者電話番号
  operatorName: text('operator_name'),                // Fondeskオペレーター名
  message: text('message').notNull(),                 // 用件メモ
  rawPayload: text('raw_payload'),                    // Webhookの生データ（JSON文字列）

  // 社内ステータス管理
  status: text('status', {
    enum: ['未確認', '確認済み', '折り返し待ち', '折り返し済み'],
  }).notNull().default('未確認'),
  assignee: text('assignee'),                         // 対応担当者
  category: text('category').default('その他'),       // AI分類カテゴリ

  // 折り返し記録
  callbackAt: timestamp('callback_at', { withTimezone: true }),  // 折り返し実施日時
  callbackNote: text('callback_note'),                            // 折り返し内容メモ
  callbackBy: text('callback_by'),                               // 折り返し担当者

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type FondeskCall = typeof fondeskCalls.$inferSelect
export type NewFondeskCall = typeof fondeskCalls.$inferInsert
