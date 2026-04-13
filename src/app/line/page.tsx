'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { lineUsers } from '@/data/lineChats'
import { generateAIResponse } from '@/utils/aiResponses'
import { ChatMessage, LineUser } from '@/types'
import { Search, Bot, User, Send, UserCheck } from 'lucide-react'

export default function LinePage() {
  const [users, setUsers] = useState<LineUser[]>(lineUsers)
  const [selectedUserId, setSelectedUserId] = useState<string>(lineUsers[0].id)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(
    Object.fromEntries(lineUsers.map((u) => [u.id, u.messages]))
  )
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'AI' | '人間'>('AI')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedUser = users.find((u) => u.id === selectedUserId)
  const currentMessages = messages[selectedUserId] ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isTyping])

  const filteredUsers = users.filter((u) =>
    u.name.includes(searchQuery) || u.lastMessage.includes(searchQuery)
  )

  const selectUser = (userId: string) => {
    setSelectedUserId(userId)
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, unreadCount: 0 } : u))
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
    setMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] ?? []), customerMsg],
    }))
    const sentInput = input
    setInput('')
    setIsTyping(true)

    const delay = 1500 + Math.random() * 1000
    await new Promise((r) => setTimeout(r, delay))

    const responseContent = mode === 'AI'
      ? generateAIResponse(sentInput)
      : `承知いたしました。詳細を確認して折り返しご連絡いたします。`

    const aiMsg: ChatMessage = {
      id: `m${Date.now() + 1}`,
      sender: mode === 'AI' ? 'ai' : 'human',
      content: responseContent,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    }
    setIsTyping(false)
    setMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] ?? []), aiMsg],
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') sendMessage()
  }

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* User List */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="友達を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 text-sm h-8 border-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => selectUser(user.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                selectedUserId === user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600 shrink-0">
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-medium text-gray-800 truncate">{user.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{user.lastMessageAt}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{user.lastMessage}</p>
                <CategoryBadge category={user.category} className="mt-1" />
              </div>
              {user.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center shrink-0">
                  {user.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
          友達数: {users.length}
        </div>
      </div>

      {/* Chat Area */}
      {selectedUser && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600">
                {selectedUser.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{selectedUser.name}</p>
                <p className="text-xs text-gray-400">{selectedUser.lineId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CategoryBadge category={selectedUser.category} />
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setMode('AI')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === 'AI' ? 'bg-blue-500 text-white' : 'text-gray-600'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  AI
                </button>
                <button
                  onClick={() => setMode('人間')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === '人間' ? 'bg-orange-400 text-white' : 'text-gray-600'
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
            {currentMessages.map((msg) => (
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
                className="bg-green-500 hover:bg-green-600 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
