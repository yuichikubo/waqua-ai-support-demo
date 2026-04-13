'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChannelBadge } from '@/components/ui/ChannelBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { inquiries } from '@/data/inquiries'
import { Channel, InquiryCategory, InquiryStatus } from '@/types'
import { Search } from 'lucide-react'

const channels: (Channel | 'すべて')[] = ['すべて', 'LINE', 'HP', '電話']
const statuses: (InquiryStatus | 'すべて')[] = ['すべて', '新規', 'AI対応中', '対応待ち', '解決済み']
const categories: (InquiryCategory | 'すべて')[] = ['すべて', 'レンタル希望', '部品請求', '故障・修理', '料金・契約', '設置・配送', 'その他']

export default function InquiriesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState<Channel | 'すべて'>('すべて')
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | 'すべて'>('すべて')
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory | 'すべて'>('すべて')

  const filtered = inquiries.filter((inq) => {
    if (selectedChannel !== 'すべて' && inq.channel !== selectedChannel) return false
    if (selectedStatus !== 'すべて' && inq.status !== selectedStatus) return false
    if (selectedCategory !== 'すべて' && inq.category !== selectedCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!inq.customerName.includes(q) && !inq.subject.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">問い合わせ一覧</h2>
        <p className="text-sm text-gray-500 mt-0.5">全チャネル統合 — {filtered.length}件</p>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="顧客名・内容で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium w-14">チャネル</span>
              <div className="flex gap-1">
                {channels.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedChannel === ch
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium w-14">ステータス</span>
              <div className="flex gap-1">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedStatus === st
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium w-14">分類</span>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">チャネル</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">顧客名</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">分類</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">件名・概要</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ステータス</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">担当者</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">受付日時</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr
                  key={inq.id}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/inquiries/${inq.id}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{inq.id}</td>
                  <td className="px-3 py-3"><ChannelBadge channel={inq.channel} /></td>
                  <td className="px-3 py-3 font-medium text-gray-800">{inq.customerName}</td>
                  <td className="px-3 py-3"><CategoryBadge category={inq.category} /></td>
                  <td className="px-3 py-3 text-gray-600 max-w-xs truncate">{inq.subject.slice(0, 40)}</td>
                  <td className="px-3 py-3"><StatusBadge status={inq.status} /></td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{inq.assignee || '—'}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{inq.createdAt}</td>
                  <td className="px-3 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => { e.stopPropagation(); router.push(`/inquiries/${inq.id}`) }}
                    >
                      詳細
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              条件に一致する問い合わせがありません
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
