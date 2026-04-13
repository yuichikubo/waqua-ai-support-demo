'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChannelBadge } from '@/components/ui/ChannelBadge'
import { activityLogs } from '@/data/activityLogs'
import { Channel } from '@/types'

type Period = '今日' | '過去7日' | '過去30日'
type ActionType = 'すべて' | 'AI自動応答' | '人間対応' | 'エスカレーション' | '解決済み変更'

export default function LogsPage() {
  const [period, setPeriod] = useState<Period>('今日')
  const [actionType, setActionType] = useState<ActionType>('すべて')
  const [channelFilter, setChannelFilter] = useState<Channel | 'すべて'>('すべて')

  const filtered = activityLogs.filter((log) => {
    if (channelFilter !== 'すべて' && log.channel !== channelFilter) return false
    if (actionType !== 'すべて' && !log.action.includes(actionType === 'AI自動応答' ? 'AI' : actionType)) return false
    return true
  })

  const actionStyles: Record<string, string> = {
    'AI自動応答': 'bg-purple-100 text-purple-700',
    '受付': 'bg-gray-100 text-gray-600',
    'エスカレーション': 'bg-orange-100 text-orange-700',
    '担当者引継ぎ': 'bg-orange-100 text-orange-700',
    '解決済み変更': 'bg-green-100 text-green-700',
    '対応中': 'bg-blue-100 text-blue-700',
  }

  const getActionStyle = (action: string) => {
    for (const key of Object.keys(actionStyles)) {
      if (action.includes(key)) return actionStyles[key]
    }
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">対応ログ</h2>
        <p className="text-sm text-gray-500 mt-0.5">AI・担当者の対応履歴（{filtered.length}件）</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium w-10">期間</span>
          <div className="flex gap-1">
            {(['今日', '過去7日', '過去30日'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  period === p ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium w-14">対応種別</span>
          <div className="flex gap-1">
            {(['すべて', 'AI自動応答', '人間対応', 'エスカレーション'] as ActionType[]).map((a) => (
              <button
                key={a}
                onClick={() => setActionType(a)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  actionType === a ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium w-16">チャネル</span>
          <div className="flex gap-1">
            {(['すべて', 'LINE', 'HP', '電話'] as (Channel | 'すべて')[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  channelFilter === ch ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">日時</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">問い合わせID</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">チャネル</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">アクション</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">対応者</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">詳細</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{log.createdAt}</td>
                  <td className="px-3 py-3 font-mono text-xs text-blue-500">{log.inquiryId}</td>
                  <td className="px-3 py-3"><ChannelBadge channel={log.channel} /></td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">{log.operator}</td>
                  <td className="px-3 py-3 text-xs text-gray-500 max-w-xs truncate">{log.detail.slice(0, 50)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
