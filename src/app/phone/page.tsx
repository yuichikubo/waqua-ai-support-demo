'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { phoneLogs } from '@/data/phoneLogs'
import { PhoneLog, InquiryCategory } from '@/types'
import { Plus, Phone, Bot } from 'lucide-react'
import { toast } from 'sonner'

const categories: InquiryCategory[] = ['レンタル希望', '部品請求', '故障・修理', '料金・契約', '設置・配送', 'その他']
const staffList = ['田中 美咲', '佐藤 健一', '鈴木 あかり', '高橋 大輔', '山田 花子']

export default function PhonePage() {
  const [logs, setLogs] = useState<PhoneLog[]>(phoneLogs)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newLog, setNewLog] = useState<Partial<PhoneLog>>({
    category: 'その他',
    assignee: '',
  })

  const selected = logs.find((l) => l.id === selectedId)

  const handleCreate = () => {
    if (!newLog.customerName || !newLog.content) {
      toast.error('顧客名と内容は必須です')
      return
    }
    const log: PhoneLog = {
      id: `TEL-2024-00${logs.length + 6}`,
      customerName: newLog.customerName ?? '',
      phone: newLog.phone ?? '',
      content: newLog.content ?? '',
      category: newLog.category as InquiryCategory ?? 'その他',
      assignee: newLog.assignee ?? '',
      status: '新規',
      memo: newLog.memo ?? '',
      createdAt: new Date().toLocaleString('ja-JP').replace(/\//g, '/').slice(0, 16),
      aiSummary: `${newLog.category}に関する問い合わせ。内容：${newLog.content?.slice(0, 50)}...`,
    }
    setLogs((prev) => [log, ...prev])
    setIsModalOpen(false)
    setNewLog({ category: 'その他', assignee: '' })
    toast.success('電話記録を作成しました')
  }

  const handleStatusChange = (id: string, status: '新規' | '対応中' | '完了') => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    toast.success('ステータスを更新しました')
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">電話対応記録</h2>
          <p className="text-sm text-gray-500 mt-0.5">{logs.length}件</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          新規電話記録
        </Button>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <Card className="flex-1 border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">顧客名</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">電話番号</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">分類</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">内容概要</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">対応者</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ステータス</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">記録日時</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedId === log.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedId(log.id === selectedId ? null : log.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.id}</td>
                    <td className="px-3 py-3 font-medium text-gray-800">{log.customerName}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs"><Phone className="w-3 h-3 inline mr-1" />{log.phone}</td>
                    <td className="px-3 py-3"><CategoryBadge category={log.category} /></td>
                    <td className="px-3 py-3 text-gray-600 max-w-xs truncate">{log.content.slice(0, 40)}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{log.assignee || '—'}</td>
                    <td className="px-3 py-3"><StatusBadge status={log.status} /></td>
                    <td className="px-3 py-3 text-xs text-gray-500">{log.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Side Panel */}
        {selected && (
          <div className="w-72 shrink-0 space-y-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{selected.customerName}</h3>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">電話番号</span>
                    <span className="text-xs">{selected.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">分類</span>
                    <CategoryBadge category={selected.category} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">対応者</span>
                    <span className="text-xs">{selected.assignee || '—'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">内容</span>
                  <p className="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded leading-relaxed">{selected.content}</p>
                </div>
                {selected.memo && (
                  <div>
                    <span className="text-xs text-gray-400">メモ</span>
                    <p className="text-xs text-gray-700 mt-1 bg-yellow-50 p-2 rounded">{selected.memo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-purple-100 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700">AI要約・推奨アクション</span>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">{selected.aiSummary}</p>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => handleStatusChange(selected.id, '対応中')}
                disabled={selected.status === '対応中' || selected.status === '完了'}
              >
                対応中
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs bg-green-500 hover:bg-green-600"
                onClick={() => handleStatusChange(selected.id, '完了')}
                disabled={selected.status === '完了'}
              >
                完了
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新規電話記録</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">顧客名 *</Label>
                <Input
                  placeholder="山田太郎"
                  value={newLog.customerName ?? ''}
                  onChange={(e) => setNewLog((p) => ({ ...p, customerName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">電話番号</Label>
                <Input
                  placeholder="090-0000-0000"
                  value={newLog.phone ?? ''}
                  onChange={(e) => setNewLog((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">問い合わせ内容 *</Label>
              <Textarea
                placeholder="内容を入力..."
                value={newLog.content ?? ''}
                onChange={(e) => setNewLog((p) => ({ ...p, content: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">分類</Label>
                <Select
                  value={newLog.category}
                  onValueChange={(v) => setNewLog((p) => ({ ...p, category: v as InquiryCategory }))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">対応者</Label>
                <Select
                  value={newLog.assignee}
                  onValueChange={(v) => setNewLog((p) => ({ ...p, assignee: v ?? '' }))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">メモ</Label>
              <Textarea
                placeholder="メモ..."
                value={newLog.memo ?? ''}
                onChange={(e) => setNewLog((p) => ({ ...p, memo: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>キャンセル</Button>
              <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600">作成</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
