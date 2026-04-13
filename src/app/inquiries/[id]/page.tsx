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
import { inquiries } from '@/data/inquiries'
import { generateAIResponse, getRecommendedAction } from '@/utils/aiResponses'
import { ChatMessage, Inquiry } from '@/types'
import { ArrowLeft, Bot, User, Send, CheckCircle, UserCheck } from 'lucide-react'
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
    setInput('')
    setIsTyping(true)

    const delay = 1500 + Math.random() * 1000
    await new Promise((r) => setTimeout(r, delay))

    const responseContent = mode === 'AI'
      ? generateAIResponse(input)
      : `[${mode}対応] 内容を確認いたしました。担当者より折り返しご連絡いたします。`

    const aiMsg: ChatMessage = {
      id: `m${Date.now() + 1}`,
      sender: mode === 'AI' ? 'ai' : 'human',
      content: responseContent,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    }
    setIsTyping(false)
    setMessages((prev) => [...prev, aiMsg])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      sendMessage()
    }
  }

  const handleResolve = () => {
    setInquiry((prev) => prev ? { ...prev, status: '解決済み' } : prev)
    toast.success('対応完了にしました')
  }

  const handleEscalate = () => {
    setInquiry((prev) => prev ? { ...prev, status: '対応待ち' } : prev)
    toast.info('担当者に引き継ぎました')
  }

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
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-500">{inquiry.id}</span>
          <ChannelBadge channel={inquiry.channel} />
          <StatusBadge status={inquiry.status} />
          <CategoryBadge category={inquiry.category} />
        </div>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'customer' ? '' : ''}`}>
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
                        {msg.sender === 'ai' ? <Bot className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        <span className="text-xs font-medium">{msg.sender === 'ai' ? 'AI' : '担当者'}</span>
                      </div>
                    )}
                    {msg.content}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
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
