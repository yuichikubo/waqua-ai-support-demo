'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bot, Bell, Tag, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const defaultCategories = ['レンタル希望', '部品請求', '故障・修理', '料金・契約', '設置・配送', 'その他']

export default function SettingsPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true)
  const [channelToggles, setChannelToggles] = useState({ LINE: true, HP: true, 電話: false })
  const [responseDelay, setResponseDelay] = useState([3])
  const [faqThreshold, setFaqThreshold] = useState([75])
  const [notificationInterval, setNotificationInterval] = useState('15分')
  const [escalationThreshold, setEscalationThreshold] = useState([60])
  const [notificationEmail, setNotificationEmail] = useState('admin@waqua.com')
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [newCategory, setNewCategory] = useState('')

  const handleSave = () => {
    toast.success('設定を保存しました')
  }

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory])
      setNewCategory('')
    }
  }

  const removeCategory = (cat: string) => {
    if (cat === 'その他') return
    setCategories((prev) => prev.filter((c) => c !== cat))
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800">設定</h2>
        <p className="text-sm text-gray-500 mt-0.5">通知・自動応答の設定</p>
      </div>

      {/* Auto Reply Settings */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-500" />
            自動応答設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">自動応答の有効/無効</p>
              <p className="text-xs text-gray-400 mt-0.5">AIによる自動応答機能を切り替えます</p>
            </div>
            <button
              onClick={() => setAutoReplyEnabled((p) => !p)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoReplyEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                  autoReplyEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">チャネルごとの自動応答</p>
            <div className="space-y-2">
              {(['LINE', 'HP', '電話'] as const).map((ch) => (
                <div key={ch} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{ch}</span>
                  <button
                    onClick={() => setChannelToggles((p) => ({ ...p, [ch]: !p[ch] }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      channelToggles[ch] ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                        channelToggles[ch] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700">応答遅延時間</Label>
              <span className="text-sm font-semibold text-blue-600">{responseDelay[0]}秒</span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={responseDelay}
              onValueChange={(val) => { if (Array.isArray(val)) setResponseDelay(val as number[]) }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1秒</span>
              <span>10秒</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700">FAQ一致閾値</Label>
              <span className="text-sm font-semibold text-blue-600">{faqThreshold[0]}%</span>
            </div>
            <Slider
              min={50}
              max={100}
              step={5}
              value={faqThreshold}
              onValueChange={(val) => { if (Array.isArray(val)) setFaqThreshold(val as number[]) }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-500" />
            通知設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">未対応案件の通知間隔</Label>
            <Select value={notificationInterval} onValueChange={(v) => setNotificationInterval(v ?? '15分')}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['5分', '15分', '30分', '1時間'].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700">
                エスカレーション条件（AI信頼度 {escalationThreshold[0]}% 以下で自動エスカレーション）
              </Label>
            </div>
            <Slider
              min={30}
              max={90}
              step={5}
              value={escalationThreshold}
              onValueChange={(val) => { if (Array.isArray(val)) setEscalationThreshold(val as number[]) }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30%</span>
              <span>90%</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">通知先メールアドレス</Label>
            <Input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-72"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Settings */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-500" />
            分類設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="新しいカテゴリ..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              className="flex-1"
            />
            <Button onClick={addCategory} variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              追加
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  disabled={cat === 'その他'}
                  className="text-gray-300 hover:text-red-400 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 px-8">
          保存する
        </Button>
      </div>
    </div>
  )
}
