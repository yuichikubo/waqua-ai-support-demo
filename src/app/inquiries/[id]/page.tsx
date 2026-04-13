'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChannelBadge } from '@/components/ui/ChannelBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { AIDraftApproval } from '@/components/ui/AIDraftApproval'
import { inquiries } from '@/data/inquiries'
import { generateAIResponse, getRecommendedAction } from '@/utils/aiResponses'
import { ChatMessage, Inquiry } from '@/types'
import { ArrowLeft, Bot, User, Send, CheckCircle, UserCheck, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function InquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const inquiryId = params.id as string

  const [inquiry, setInquiry] = useState<Inquiry | null>(() =>
    inquiries.find((inq) => inq.id === inquiryId) ?? null
  )
  const [messages, setMessages] = useState<ChatMessage[]>(
    inquiry?.messages ?? []
  )
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'AI' | '人間'>('AI')
  // AI応答を送信前に承認するかどうか
  const [approvalMode, setApprovalMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (!inquiry) {
    return (
      <div className="p-6 text-center text-gray-500">
        問い合わせが見つかりません
        <Button variant="link" onClick={() => router.push('/inquiries')}>一覧に戻る</Button>
      </div>
    )
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const customerMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'customer',
      content: input,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, customerMsg])
    const sentInput = input
    setInput('')
    setIsTyping(true)

    const delay = 1500 + Math.random() * 1000
    await new Promise((r) => setTimeout(r, delay))
    setIsTyping(false)

    if (mode === '人間') {
      // 人間対応モードはそのまま送信
      const humanMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        sender: 'human',
        content: '内容を確認いたしました。担当者より折り返しご連絡いたします。',
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, humanMsg])
      return
    }

    const aiContent = generateAIResponse(sentInput)

    if (approvalMode) {
      // 承認フロー：ドラフトとして追加
      const draftMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        sender: 'ai',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        approvalStatus: 'pending',
        draftContent: aiContent,
      }
      setMessages((prev) => [...prev, draftMsg])
    } else {
      // 承認なし：そのまま送信
      const aiMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        sender: 'ai',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    }
  }

  const handleApprove = (messageId: string, finalContent: string) => {
    const now = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m
        const wasEdited = finalContent !== m.draftContent
        return {
          ...m,
          content: finalContent,
          approvalStatus: wasEdited ? 'edited' : 'approved',
          approvedBy: '久保 裕一',
          approvedAt: now,
        }
      })
    )
    toast.success('AI応答を承認しました', {
      description: '顧客へ送信されました',
    })
  }

  const handleReject = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, approvalStatus: 'rejected' } : m
      )
    )
    toast.warning('AI応答を却下しました')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') sendMessage()
  }

  const handleResolve = () => {
    setInquiry((prev) => prev ? { ...prev, status: '解決済み' } : prev)
    toast.success('対応完了にしました')
  }

  const handleEscalate = () => {
    setInquiry((prev) => prev ? { ...prev, status: '対応待ち' } : prev)
    toast.info('担当者に引き継ぎました')
  }

  const pendingCount = messages.filter((m) => m.approvalStatus === 'pending').length
  const recommendedAction = getRecommendedAction(inquiry.category)

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Sub header */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-4">
        <button
          onClick={() => router.push('/inquiries')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <span className="font-mono text-sm text-gray-500">{inquiry.id}</span>
          <ChannelBadge channel={inquiry.channel} />
          <StatusBadge status={inquiry.status} />
          <CategoryBadge category={inquiry.category} />
        </div>
        {pendingCount > 0 && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            承認待ち {pendingCount}件
          </span>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
          {/* Chat header */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{inquiry.customerName}</p>
              <p className="text-xs text-gray-400">{inquiry.channel} チャネル</p>
            </div>
            <div className="flex items-center gap-3">
              {/* 承認モード切替 */}
              <button
                onClick={() => setApprovalMode((p) => !p)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  approvalMode
                    ? 'bg-amber-50 border-amber-200 text-amber-700 font-medium'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                送信前承認 {approvalMode ? 'ON' : 'OFF'}
              </button>

              {/* AI/人間切替 */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setMode('AI')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === 'AI' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  AI
                </button>
                <button
                  onClick={() => setMode('人間')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === '人間' ? 'bg-orange-400 text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  人間
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map((msg) => {
              // 承認待ちドラフト
              if (msg.approvalStatus === 'pending') {
                return (
                  <AIDraftApproval
                    key={msg.id}
                    messageId={msg.id}
                    draftContent={msg.draftContent ?? msg.content}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                )
              }

              // 却下されたドラフト
              if (msg.approvalStatus === 'rejected') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[70%]">
                      <div className="px-4 py-2 rounded-2xl text-sm bg-gray-100 text-gray-400 rounded-br-sm line-through">
                        <div className="flex items-center gap-1 mb-1 opacity-60">
                          <Bot className="w-3 h-3" />
                          <span className="text-xs">AI（却下済み）</span>
                        </div>
                        {msg.content.slice(0, 40)}...
                      </div>
                    </div>
                  </div>
                )
              }

              // 通常メッセージ（顧客・承認済みAI・人間）
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="max-w-[70%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.sender === 'customer'
                          ? 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                          : msg.sender === 'ai'
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-blue-500 text-white rounded-br-sm'
                      }`}
                    >
                      {msg.sender !== 'customer' && (
                        <div className="flex items-center gap-1 mb-1.5 opacity-75">
                          {msg.sender === 'ai'
                            ? <Bot className="w-3 h-3" />
                            : <UserCheck className="w-3 h-3" />}
                          <span className="text-xs font-medium">
                            {msg.sender === 'ai' ? 'AI' : '担当者'}
                          </span>
                          {/* 承認・編集バッジ */}
                          {msg.approvalStatus === 'approved' && (
                            <span className="text-xs bg-white/20 px-1.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              承認済み
                            </span>
                          )}
                          {msg.approvalStatus === 'edited' && (
                            <span className="text-xs bg-white/20 px-1.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              編集承認
                            </span>
                          )}
                        </div>
                      )}
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <p className="text-xs text-gray-400">{msg.timestamp}</p>
                      {msg.approvedBy && (
                        <p className="text-xs text-gray-300">承認: {msg.approvedBy}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="flex justify-end">
                <div>
                  <p className="text-xs text-gray-400 mb-1 text-right">AIが応答を生成中...</p>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            {approvalMode && mode === 'AI' && (
              <div className="flex items-center gap-1.5 mb-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                送信前承認モード：AI応答は担当者の承認後に顧客へ届きます
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力... (Ctrl+Enter で送信)"
                className="resize-none text-sm min-h-[60px] max-h-[120px] bg-gray-50"
                rows={2}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="w-80 bg-white overflow-y-auto p-4 space-y-4">
          {/* AI Classification */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-blue-500" />
                AI分類結果
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <CategoryBadge category={inquiry.category} />
                <span className="text-sm font-bold text-blue-600">{inquiry.confidence}%</span>
              </div>
              <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${inquiry.confidence}%` }}
                />
              </div>
              {inquiry.confidence < 60 && (
                <p className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1.5 rounded">
                  信頼度が低いため担当者対応を推奨
                </p>
              )}
            </CardContent>
          </Card>

          {/* Approval Mode Info */}
          <Card className={`border ${approvalMode ? 'border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${approvalMode ? 'text-amber-600' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${approvalMode ? 'text-amber-700' : 'text-gray-500'}`}>
                      送信前承認モード
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {approvalMode
                        ? 'AI応答は承認後に送信'
                        : 'AI応答を自動送信'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setApprovalMode((p) => !p)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                    approvalMode ? 'bg-amber-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                    approvalMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              {pendingCount > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    承認待ち {pendingCount}件
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    チャット画面で「承認して送信」を押してください
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wide">顧客情報</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">氏名</span>
                <span className="text-xs font-medium">{inquiry.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">チャネル</span>
                <ChannelBadge channel={inquiry.channel} />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">担当者</span>
                <span className="text-xs font-medium">{inquiry.assignee || '未割当'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">受付日時</span>
                <span className="text-xs text-gray-600">{inquiry.createdAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Action */}
          <Card className="border border-blue-100 bg-blue-50">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-blue-700 uppercase tracking-wide">AI推奨アクション</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-blue-800 leading-relaxed">{recommendedAction}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleResolve}
              className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
              disabled={inquiry.status === '解決済み'}
            >
              <CheckCircle className="w-4 h-4" />
              対応完了にする
            </Button>
            <Button
              variant="outline"
              onClick={handleEscalate}
              className="w-full gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
              disabled={inquiry.status === '対応待ち' || inquiry.status === '解決済み'}
            >
              <UserCheck className="w-4 h-4" />
              担当者に引き継ぐ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
