import { ActivityLog } from '@/types'

export const activityLogs: ActivityLog[] = [
  { id: 'log-1', inquiryId: 'WQ-2024-0003', channel: 'LINE', action: '担当者引継ぎ', operator: '鈴木 あかり', detail: 'AI信頼度45%のため担当者にエスカレーション', createdAt: '2024/04/13 10:15:32' },
  { id: 'log-2', inquiryId: 'WQ-2024-0013', channel: 'LINE', action: 'AI自動応答', operator: 'AI', detail: 'レンタル希望に分類、カタログ送付を提案', createdAt: '2024/04/13 11:51:05' },
  { id: 'log-3', inquiryId: 'WQ-2024-0011', channel: '電話', action: 'エスカレーション', operator: '佐藤 健一', detail: '温水故障の緊急対応。本日午後訪問予定', createdAt: '2024/04/13 11:20:44' },
  { id: 'log-4', inquiryId: 'WQ-2024-0001', channel: 'LINE', action: 'AI自動応答', operator: 'AI', detail: '料金プランをご案内。スタンダードプランを提案', createdAt: '2024/04/13 09:16:12' },
  { id: 'log-5', inquiryId: 'WQ-2024-0006', channel: 'HP', action: 'AI自動応答', operator: 'AI', detail: '法人向けプランをご案内。営業担当への引継ぎを提案', createdAt: '2024/04/13 08:46:33' },
  { id: 'log-6', inquiryId: 'WQ-2024-0007', channel: 'HP', action: 'エスカレーション', operator: '佐藤 健一', detail: 'AI信頼度55%。水圧低下の詳細確認が必要', createdAt: '2024/04/13 09:52:17' },
  { id: 'log-7', inquiryId: 'WQ-2024-0008', channel: 'HP', action: 'エスカレーション', operator: '鈴木 あかり', detail: '解約対応は人間対応必須のためエスカレーション', createdAt: '2024/04/12 16:22:01' },
  { id: 'log-8', inquiryId: 'WQ-2024-0004', channel: 'LINE', action: 'AI自動応答', operator: 'AI', detail: '料金確認。契約内容に変更なし', createdAt: '2024/04/13 10:26:44' },
  { id: 'log-9', inquiryId: 'WQ-2024-0010', channel: '電話', action: '対応中', operator: '山田 花子', detail: '契約更新の相談。新プランへの移行を提案中', createdAt: '2024/04/13 10:47:29' },
  { id: 'log-10', inquiryId: 'WQ-2024-0002', channel: 'LINE', action: 'AI自動応答', operator: 'AI', detail: 'フィルター交換案内。WF-150の注文フォームへ誘導', createdAt: '2024/04/13 09:33:55' },
  { id: 'log-11', inquiryId: 'WQ-2024-0009', channel: 'HP', action: '解決済み変更', operator: '高橋 大輔', detail: 'フィルター注文完了。発送手配済み', createdAt: '2024/04/11 11:05:22' },
  { id: 'log-12', inquiryId: 'WQ-2024-0005', channel: 'LINE', action: '解決済み変更', operator: 'AI', detail: '設置変更の日程確定。AI対応で完結', createdAt: '2024/04/12 14:38:10' },
  { id: 'log-13', inquiryId: 'TEL-2024-0003', channel: '電話', action: '解決済み変更', operator: '田中 美咲', detail: '新規レンタル申込完了。設置日程確定', createdAt: '2024/04/12 15:30:00' },
  { id: 'log-14', inquiryId: 'TEL-2024-0004', channel: '電話', action: '解決済み変更', operator: '鈴木 あかり', detail: '請求差異の説明完了。年次メンテ費用と確認', createdAt: '2024/04/11 11:00:15' },
  { id: 'log-15', inquiryId: 'TEL-2024-0005', channel: '電話', action: '解決済み変更', operator: '高橋 大輔', detail: 'フィルター＆ボトル注文完了', createdAt: '2024/04/10 14:45:33' },
  { id: 'log-16', inquiryId: 'WQ-2024-0015', channel: '電話', action: '解決済み変更', operator: '鈴木 あかり', detail: '請求金額の不明点を解消。対応完了', createdAt: '2024/04/11 11:10:00' },
  { id: 'log-17', inquiryId: 'WQ-2024-0012', channel: '電話', action: 'AI自動応答', operator: 'AI', detail: '新規レンタル申込の案内。申込フォームへ誘導', createdAt: '2024/04/12 15:02:44' },
  { id: 'log-18', inquiryId: 'WQ-2024-0014', channel: 'HP', action: 'AI自動応答', operator: 'AI', detail: '見積依頼。コンパクトモデルを提案', createdAt: '2024/04/12 13:11:58' },
  { id: 'log-19', inquiryId: 'WQ-2024-0001', channel: 'LINE', action: '受付', operator: 'AI', detail: '新規問い合わせ受付。レンタル希望に自動分類', createdAt: '2024/04/13 09:15:01' },
  { id: 'log-20', inquiryId: 'WQ-2024-0003', channel: 'LINE', action: '受付', operator: 'AI', detail: '新規問い合わせ受付。故障・修理に自動分類（信頼度45%）', createdAt: '2024/04/13 10:05:03' },
]
