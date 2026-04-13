'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChannelBarChart } from '@/components/charts/BarChart'
import {
  MessageCircle,
  Bot,
  Clock,
  CheckCircle2,
  TrendingUp,
  Phone,
  Globe,
  Timer,
} from 'lucide-react'

const kpiCards = [
  { label: '今日の問い合わせ', value: '12', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50', change: '+2' },
  { label: 'AI自動応答済み', value: '8', icon: Bot, color: 'text-purple-500', bg: 'bg-purple-50', change: '+1' },
  { label: '対応待ち', value: '3', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', change: '-1' },
  { label: '今月の対応完了', value: '156', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', change: '+12' },
]

const subKpiCards = [
  { label: 'LINE', value: '5', icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'HP問い合わせ', value: '4', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: '電話', value: '3', icon: Phone, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: '平均応答時間', value: '2.3分', icon: Timer, color: 'text-cyan-500', bg: 'bg-cyan-50' },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">ダッシュボード</h2>
          <p className="text-sm text-gray-500 mt-0.5">2024年4月13日（土）のサマリー</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          AI自動応答 稼働中
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="border border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">前日比 {card.change}</p>
                  </div>
                  <div className={`${card.bg} ${card.color} p-2.5 rounded-xl`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Sub KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {subKpiCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{card.label}</p>
                    <p className="text-xl font-bold text-gray-800">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Resolution Metrics */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              解決率メトリクス
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>解決率</span>
                <span className="font-semibold text-green-600">67% (8/12)</span>
              </div>
              <Progress value={67} className="h-2 bg-gray-100 [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>ハンドオフ率</span>
                <span className="font-semibold text-orange-600">25% (3/12)</span>
              </div>
              <Progress value={25} className="h-2 bg-gray-100 [&>div]:bg-orange-400" />
            </div>
            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">AI解決</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-xs text-gray-400">件</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">完了セッション</p>
                <p className="text-2xl font-bold text-green-600">156</p>
                <p className="text-xs text-gray-400">件（今月）</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="col-span-2 border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">チャネル別日別推移（過去13日間）</CardTitle>
          </CardHeader>
          <CardContent>
            <ChannelBarChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">最近の問い合わせ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[
              { id: 'WQ-2024-0013', name: '伊藤みなみ', ch: 'LINE', cat: 'レンタル希望', status: '新規', time: '11:50', chColor: 'bg-green-100 text-green-700' },
              { id: 'WQ-2024-0011', name: '松本さくら', ch: '電話', cat: '故障・修理', status: '対応待ち', time: '11:15', chColor: 'bg-orange-100 text-orange-700' },
              { id: 'WQ-2024-0010', name: '木村正人', ch: '電話', cat: '料金・契約', status: '対応中', time: '10:45', chColor: 'bg-orange-100 text-orange-700' },
              { id: 'WQ-2024-0003', name: '鈴木一郎', ch: 'LINE', cat: '故障・修理', status: '対応待ち', time: '10:05', chColor: 'bg-green-100 text-green-700' },
              { id: 'WQ-2024-0007', name: '中村大輔', ch: 'HP', cat: '故障・修理', status: '対応待ち', time: '09:50', chColor: 'bg-blue-100 text-blue-700' },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400 w-28 shrink-0 font-mono">{item.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.chColor}`}>{item.ch}</span>
                <span className="text-sm font-medium text-gray-700 w-24 shrink-0">{item.name}</span>
                <span className="text-xs text-gray-500 flex-1">{item.cat}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.status === '新規' ? 'bg-gray-100 text-gray-600' :
                  item.status === '対応待ち' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{item.status}</span>
                <span className="text-xs text-gray-400 w-12 text-right">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
