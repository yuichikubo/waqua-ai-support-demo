'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { webInquiries } from '@/data/webInquiries'
import { WebInquiry } from '@/types'
import { Search, Mail, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function WebPage() {
  const [inquiries, setInquiries] = useState<WebInquiry[]>(webInquiries)
  const [selectedId, setSelectedId] = useState<string>(webInquiries[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [editedReplies, setEditedReplies] = useState<Record<string, string>>(
    Object.fromEntries(webInquiries.map((i) => [i.id, i.aiReply]))
  )

  const selected = inquiries.find((i) => i.id === selectedId)
  const filtered = inquiries.filter(
    (i) => i.name.includes(searchQuery) || i.subject.includes(searchQuery)
  )

  const handleResolve = (id: string) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: '解決済み' } : i))
    )
    toast.success('解決済みにしました')
  }

  const handleSend = (id: string) => {
    toast.success('返信メールを送信しました')
    handleResolve(id)
  }

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* List */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 text-sm h-8 border-gray-200"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelectedId(inq.id)}
              className={`w-full flex flex-col items-start gap-1 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors ${
                selectedId === inq.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-sm font-medium text-gray-800 truncate">{inq.name}</span>
                <StatusBadge status={inq.status} />
              </div>
              <span className="text-xs text-gray-400 truncate w-full">{inq.email}</span>
              <span className="text-xs text-gray-500 truncate w-full">{inq.subject}</span>
              <div className="flex items-center justify-between w-full">
                <CategoryBadge category={inq.category} />
                <span className="text-xs text-gray-400">{inq.createdAt.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{selected.subject}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{selected.createdAt}</p>
            </div>
            <div className="flex items-center gap-2">
              <CategoryBadge category={selected.category} />
              <StatusBadge status={selected.status} />
            </div>
          </div>

          {/* Inquiry Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <span className="text-xs text-gray-400">名前</span>
                  <p className="text-sm font-medium">{selected.name}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">メールアドレス</span>
                  <p className="text-sm font-medium">{selected.email}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">問い合わせ種別</span>
                  <p className="text-sm"><CategoryBadge category={selected.category} /></p>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400">お問い合わせ内容</span>
                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg leading-relaxed">
                  {selected.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ステータス:</span>
              <StatusBadge status={selected.status} />
            </div>
            {selected.status !== '解決済み' && (
              <Button
                onClick={() => handleResolve(selected.id)}
                variant="outline"
                size="sm"
                className="gap-2 border-green-200 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4" />
                解決済みにする
              </Button>
            )}
          </div>

          {/* AI Reply */}
          <Card className="border border-purple-100 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                  <Mail className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-700">AI生成返信案</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">編集可能</span>
              </div>
              <Textarea
                value={editedReplies[selected.id]}
                onChange={(e) =>
                  setEditedReplies((prev) => ({ ...prev, [selected.id]: e.target.value }))
                }
                className="min-h-[180px] text-sm leading-relaxed bg-purple-50 border-purple-200 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSend(selected.id)}
                  className="bg-purple-500 hover:bg-purple-600 gap-2"
                  disabled={selected.status === '解決済み'}
                >
                  <Send className="w-4 h-4" />
                  送信
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
