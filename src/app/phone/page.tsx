'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { FondeskCall } from '@/db/schema'
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  RefreshCw,
  Bot,
  CheckCheck,
  Clock,
  AlertCircle,
  Zap,
  User,
} from 'lucide-react'
import { toast } from 'sonner'

type CallStatus = '未確認' | '確認済み' | '折り返し待ち' | '折り返し済み'

const staffList = ['田中 美咲', '佐藤 健一', '鈴木 あかり', '高橋 大輔', '山田 花子']

const statusConfig: Record<CallStatus, { label: string; style: string; icon: React.ReactNode }> = {
  '未確認': { label: '未確認', style: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-3 h-3" /> },
  '確認済み': { label: '確認済み', style: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" /> },
  '折り返し待ち': { label: '折り返し待ち', style: 'bg-yellow-100 text-yellow-700', icon: <PhoneCall className="w-3 h-3" /> },
  '折り返し済み': { label: '折り返し済み', style: 'bg-green-100 text-green-700', icon: <CheckCheck className="w-3 h-3" /> },
}

function StatusBadge({ status }: { status: CallStatus }) {
  const { label, style, icon } = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {icon}{label}
    </span>
  )
}

export default function PhonePage() {
  const [calls, setCalls] = useState<FondeskCall[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<CallStatus | 'すべて'>('すべて')
  const [isLoading, setIsLoading] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  // 折り返しモーダル用
  const [callbackNote, setCallbackNote] = useState('')
  const [callbackBy, setCallbackBy] = useState('')
  const [showCallbackForm, setShowCallbackForm] = useState(false)

  const selected = calls.find((c) => c.id === selectedId)

  const fetchCalls = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/fondesk/calls?status=${statusFilter}`)
      const data = await res.json()
      setCalls(data)
    } catch {
      toast.error('データの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchCalls()
  }, [fetchCalls])

  // デモ用：Fondeskからの着信をシミュレート
  const simulateIncoming = async () => {
    setIsSimulating(true)
    try {
      const res = await fetch('/api/fondesk/webhook', { method: 'PUT' })
      const data = await res.json()
      await fetchCalls()
      toast.success('Fondeskから新着着信を受信しました', {
        description: data._mock ? 'デモモード（DB未接続）' : '着信データがDBに保存されました',
      })
    } catch {
      toast.error('シミュレーションに失敗しました')
    } finally {
      setIsSimulating(false)
    }
  }

  const updateStatus = async (id: number, status: CallStatus, extra?: { assignee?: string }) => {
    try {
      const res = await fetch(`/api/fondesk/calls/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      })
      const data = await res.json()
      // _mock時はローカルstateをマージして更新
      setCalls((prev) => prev.map((c) => {
        if (c.id !== id) return c
        return { ...c, status, ...extra, updatedAt: new Date(), ...(data._mock ? {} : data) }
      }))
      toast.success(`ステータスを「${status}」に更新しました`)
    } catch {
      toast.error('更新に失敗しました')
    }
  }

  const handleCallback = async () => {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/fondesk/calls/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: '折り返し済み',
          callbackNote,
          callbackBy,
        }),
      })
      const data = await res.json()
      setCalls((prev) => prev.map((c) => {
        if (c.id !== selectedId) return c
        return {
          ...c,
          status: '折り返し済み',
          callbackAt: new Date(),
          callbackNote,
          callbackBy,
          updatedAt: new Date(),
          ...(data._mock ? {} : data),
        }
      }))
      setShowCallbackForm(false)
      setCallbackNote('')
      setCallbackBy('')
      toast.success('折り返し完了として記録しました')
    } catch {
      toast.error('更新に失敗しました')
    }
  }

  const unconfirmedCount = calls.filter((c) => c.status === '未確認').length
  const waitingCount = calls.filter((c) => c.status === '折り返し待ち').length

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800">電話対応記録</h2>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <PhoneIncoming className="w-3 h-3" />
                  Fondesk連携
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {unconfirmedCount > 0 && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    未確認 {unconfirmedCount}件
                  </span>
                )}
                {waitingCount > 0 && (
                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" />
                    折り返し待ち {waitingCount}件
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCalls}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              更新
            </Button>
            <Button
              size="sm"
              onClick={simulateIncoming}
              disabled={isSimulating}
              className="gap-1.5 bg-orange-500 hover:bg-orange-600"
            >
              <Zap className="w-3.5 h-3.5" />
              {isSimulating ? '受信中...' : 'Fondesk着信シミュレート'}
            </Button>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 mt-3">
          {(['すべて', '未確認', '確認済み', '折り返し待ち', '折り返し済み'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                statusFilter === s
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Call List */}
        <div className="flex-1 overflow-y-auto">
          {calls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <PhoneIncoming className="w-10 h-10 opacity-30" />
              <p className="text-sm">
                {isLoading ? '読み込み中...' : 'Fondeskからの着信がありません'}
              </p>
              {!isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateIncoming}
                  className="gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  デモ着信を受信する
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">受電日時</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">発信者</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">電話番号</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">AI分類</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">用件（Fondesk）</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">担当</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr
                    key={call.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedId === call.id ? 'bg-blue-50' : ''
                    } ${call.status === '未確認' ? 'font-medium' : ''}`}
                    onClick={() => {
                      setSelectedId(call.id === selectedId ? null : call.id)
                      setShowCallbackForm(false)
                      // 未確認なら確認済みに自動更新
                      if (call.status === '未確認') {
                        updateStatus(call.id, '確認済み')
                      }
                    }}
                  >
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {call.status === '未確認' && (
                        <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1.5 animate-pulse" />
                      )}
                      {new Date(call.receivedAt).toLocaleString('ja-JP', {
                        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-3 text-gray-800">
                      {call.callerName || '（不明）'}
                    </td>
                    <td className="px-3 py-3 text-gray-600 text-xs">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 shrink-0" />
                        {call.callerPhone}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <CategoryBadge category={call.category ?? 'その他'} />
                    </td>
                    <td className="px-3 py-3 text-gray-500 text-xs max-w-xs truncate">
                      {call.message.slice(0, 45)}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">
                      {call.assignee || '—'}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={call.status as CallStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-4 space-y-4 shrink-0">
            {/* Fondesk着信情報 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
                  <PhoneIncoming className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fondesk着信</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date(selected.receivedAt).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-3 space-y-2.5">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">発信者</p>
                    <p className="text-sm font-medium text-gray-800">{selected.callerName || '（不明）'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">電話番号</p>
                    <p className="text-sm font-mono text-gray-800 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {selected.callerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Fondeskオペレーター</p>
                    <p className="text-xs text-gray-600">{selected.operatorName || '—'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 用件（Fondesk記録） */}
            <Card className="border border-orange-100 bg-orange-50">
              <CardContent className="p-3">
                <p className="text-xs font-semibold text-orange-700 mb-1.5">Fondesk用件メモ</p>
                <p className="text-sm text-orange-900 leading-relaxed">{selected.message}</p>
              </CardContent>
            </Card>

            {/* AI分類 */}
            <Card className="border border-purple-100 bg-purple-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <p className="text-xs font-semibold text-purple-700">AI分類</p>
                </div>
                <CategoryBadge category={selected.category ?? 'その他'} />
              </CardContent>
            </Card>

            {/* 担当者アサイン */}
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">担当者アサイン</Label>
              <Select
                value={selected.assignee ?? ''}
                onValueChange={(v) => updateStatus(selected.id, selected.status as CallStatus, { assignee: v ?? undefined })}
              >
                <SelectTrigger className="text-sm h-8">
                  <SelectValue placeholder="担当者を選択..." />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 折り返し記録（折り返し済みの場合） */}
            {selected.status === '折り返し済み' && selected.callbackAt && (
              <Card className="border border-green-100 bg-green-50">
                <CardContent className="p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-green-700 flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" />
                    折り返し完了
                  </p>
                  <p className="text-xs text-green-600">
                    {new Date(selected.callbackAt).toLocaleString('ja-JP')}
                  </p>
                  {selected.callbackBy && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />{selected.callbackBy}
                    </p>
                  )}
                  {selected.callbackNote && (
                    <p className="text-xs text-gray-600 bg-white p-2 rounded">{selected.callbackNote}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 折り返しフォーム */}
            {selected.status !== '折り返し済み' && (
              <>
                {showCallbackForm ? (
                  <Card className="border border-blue-200">
                    <CardContent className="p-3 space-y-3">
                      <p className="text-xs font-semibold text-blue-700">折り返し内容を記録</p>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">対応者名</Label>
                        <Select
                          value={callbackBy}
                          onValueChange={(v) => setCallbackBy(v ?? '')}
                        >
                          <SelectTrigger className="text-sm h-8">
                            <SelectValue placeholder="選択..." />
                          </SelectTrigger>
                          <SelectContent>
                            {staffList.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">対応内容メモ</Label>
                        <Textarea
                          value={callbackNote}
                          onChange={(e) => setCallbackNote(e.target.value)}
                          placeholder="折り返しの結果・対応内容を入力..."
                          rows={3}
                          className="text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setShowCallbackForm(false)}
                        >
                          キャンセル
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs bg-green-500 hover:bg-green-600"
                          onClick={handleCallback}
                        >
                          記録する
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {selected.status === '確認済み' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => updateStatus(selected.id, '折り返し待ち')}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        折り返し待ちにする
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="w-full gap-1.5 bg-green-500 hover:bg-green-600"
                      onClick={() => setShowCallbackForm(true)}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      折り返し完了を記録
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
