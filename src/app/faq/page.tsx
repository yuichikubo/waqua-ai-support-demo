'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { faqData } from '@/data/faqData'
import { FAQ } from '@/types'
import { Sparkles, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const generatedFAQs: Omit<FAQ, 'id' | 'createdAt'>[] = [
  {
    question: '水の硬度は選べますか？',
    answer: '富士山麓の天然水は軟水（硬度約30mg/L）です。硬水をご希望の場合はミネラルウォーターオプションをお選びください。',
    category: '一般',
    status: '下書き',
  },
  {
    question: '停電時でも水は使えますか？',
    answer: '停電時は温水・冷水機能は停止しますが、常温水は使用可能です。UPS（無停電電源装置）オプションもございます。',
    category: '一般',
    status: '下書き',
  },
  {
    question: '複数台契約した場合の請求はまとめられますか？',
    answer: 'はい、複数台のご契約は1枚の請求書にまとめることが可能です。法人向け一括請求サービスもご利用いただけます。',
    category: '料金',
    status: '下書き',
  },
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(faqData)
  const [filterStatus, setFilterStatus] = useState<FAQ['status'] | 'すべて'>('すべて')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)

  const filtered = faqs.filter((f) => {
    if (filterStatus !== 'すべて' && f.status !== filterStatus) return false
    if (categoryFilter && !f.category.includes(categoryFilter)) return false
    return true
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerateProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150))
      setGenerateProgress(i)
    }

    await new Promise((r) => setTimeout(r, 500))

    const newFaqs: FAQ[] = generatedFAQs.map((f, i) => ({
      ...f,
      id: `faq-gen-${Date.now()}-${i}`,
      createdAt: '2024/04/13',
    }))

    setFaqs((prev) => [...prev, ...newFaqs])
    setIsGenerating(false)
    setGenerateProgress(0)
    toast.success('3件のFAQ候補を生成しました')
  }

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id))
    toast.success('削除しました')
  }

  const handleApprove = (id: string) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, status: '承認済み' } : f)))
    toast.success('承認しました')
  }

  const statusStyles: Record<FAQ['status'], string> = {
    '承認済み': 'bg-green-100 text-green-700',
    '下書き': 'bg-yellow-100 text-yellow-700',
    '却下': 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">FAQ管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">FAQ候補管理（{faqs.length}件）</p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="gap-2 bg-purple-500 hover:bg-purple-600"
        >
          <Sparkles className="w-4 h-4" />
          FAQ自動生成
        </Button>
      </div>

      {isGenerating && (
        <Card className="border border-purple-200 bg-purple-50">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm text-purple-700 font-medium">過去の問い合わせを分析中...</p>
            <Progress value={generateProgress} className="h-2 bg-purple-100 [&>div]:bg-purple-500" />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium">ステータス</span>
          <div className="flex gap-1">
            {(['すべて', '承認済み', '下書き', '却下'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filterStatus === s
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Input
          placeholder="カテゴリで絞り込み..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-48 h-7 text-xs"
        />
      </div>

      {/* Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">質問</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">回答</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">カテゴリ</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ステータス</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">作成日</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((faq) => (
                <tr key={faq.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 max-w-xs">
                    <p className="text-sm font-medium leading-snug">{faq.question}</p>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs max-w-sm">
                    {faq.answer.slice(0, 60)}...
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{faq.category}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[faq.status]}`}>
                      {faq.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{faq.createdAt}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      {faq.status === '下書き' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleApprove(faq.id)}
                        >
                          承認
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-500">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">該当するFAQがありません</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
