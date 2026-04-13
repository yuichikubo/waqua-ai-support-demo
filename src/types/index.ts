export type Channel = 'LINE' | 'HP' | '電話'
export type InquiryStatus = '新規' | 'AI対応中' | '対応待ち' | '解決済み'
export type InquiryCategory =
  | 'Water Pure Pro'
  | 'Water Pure'
  | 'Pitcher Pure'
  | 'Silica Pure'
  | '小型海水淡水化装置'
  | '循環式手洗いユニット'
  | '採用・エントリー'
  | 'その他'

export type WebInquiryIndustry =
  | '物流'
  | '防災・地域インフラ'
  | '建設'
  | '船舶'
  | '企業CSR活動'
  | 'その他'

export type WebInquirySource =
  | 'インターネット検索'
  | '雑誌・テレビ'
  | '展示会'
  | 'ニュースレター'
  | '紹介'
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

export type MessageApprovalStatus = 'pending' | 'approved' | 'rejected' | 'edited'

export interface ChatMessage {
  id: string
  sender: 'customer' | 'ai' | 'human'
  content: string
  timestamp: string
  // AI応答承認フロー
  approvalStatus?: MessageApprovalStatus  // undefined = 承認フロー対象外
  draftContent?: string                   // 編集前の元AIドラフト
  approvedBy?: string                     // 承認者名
  approvedAt?: string                     // 承認日時
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
  furigana: string
  email: string
  phone: string
  companyName?: string
  title?: string
  subject: string
  content: string
  category: InquiryCategory
  industry: WebInquiryIndustry
  isExistingCustomer?: boolean
  inquirySource?: WebInquirySource
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
