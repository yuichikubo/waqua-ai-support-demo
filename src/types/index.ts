export type Channel = 'LINE' | 'HP' | '電話'
export type InquiryStatus = '新規' | 'AI対応中' | '対応待ち' | '解決済み'
export type InquiryCategory =
  | 'レンタル希望'
  | '部品請求'
  | '故障・修理'
  | '料金・契約'
  | '設置・配送'
  | 'その他'

export interface Inquiry {
  id: string
  channel: Channel
  customerName: string
  category: InquiryCategory
  subject: string
  status: InquiryStatus
  assignee: string
  createdAt: string
  confidence: number
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  sender: 'customer' | 'ai' | 'human'
  content: string
  timestamp: string
}

export interface LineUser {
  id: string
  name: string
  lineId: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  category: InquiryCategory
  messages: ChatMessage[]
}

export interface WebInquiry {
  id: string
  name: string
  email: string
  subject: string
  content: string
  category: InquiryCategory
  status: '未解決' | '解決済み'
  createdAt: string
  aiReply: string
}

export interface PhoneLog {
  id: string
  customerName: string
  phone: string
  content: string
  category: InquiryCategory
  assignee: string
  status: '新規' | '対応中' | '完了'
  memo: string
  createdAt: string
  aiSummary: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  status: '承認済み' | '下書き' | '却下'
  createdAt: string
}

export interface TrainingData {
  id: string
  questionPattern: string
  answerTemplate: string
  category: string
  createdAt: string
}

export interface Staff {
  id: string
  name: string
  email: string
  role: '管理者' | 'スタッフ'
  status: 'アクティブ' | '初回変更待ち'
  createdAt: string
}

export interface ActivityLog {
  id: string
  inquiryId: string
  channel: Channel
  action: string
  operator: string
  detail: string
  createdAt: string
}
