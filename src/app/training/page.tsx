'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { trainingData } from '@/data/trainingData'
import { TrainingData } from '@/types'
import { Upload, Play, Pencil, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function TrainingPage() {
  const [data, setData] = useState<TrainingData[]>(trainingData)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [trainProgress, setTrainProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 120))
      setUploadProgress(i)
    }
    setIsUploading(false)
    setUploadProgress(0)
    toast.success('CSVファイルをアップロードしました（3件追加）')
  }

  const handleTrain = async () => {
    setIsTraining(true)
    setTrainProgress(0)
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 80))
      setTrainProgress(i)
    }
    setIsTraining(false)
    setTrainProgress(0)
    toast.success('学習が完了しました。精度が向上しました！')
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id))
    toast.success('削除しました')
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">学習データ管理</h2>
        <p className="text-sm text-gray-500 mt-0.5">AIの応答品質向上のための学習データ管理</p>
      </div>

      {/* CSV Format Guide */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">CSVフォーマット</p>
              <code className="text-xs text-gray-500 font-mono block">
                質問パターン, 回答テンプレート, カテゴリ
              </code>
              <code className="text-xs text-blue-500 font-mono block mt-0.5">
                例: &quot;レンタル料金を教えてください&quot;,&quot;月額3,280円（税込）からご利用いただけます。&quot;,&quot;料金&quot;
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleUpload}
        />
        <div className="space-y-2 flex-1">
          <Button
            onClick={() => fileInputRef.current?.click() ?? handleUpload()}
            disabled={isUploading}
            variant="outline"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            CSVアップロード
          </Button>
          {isUploading && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">アップロード中...</p>
              <Progress value={uploadProgress} className="h-1.5 w-48" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleTrain}
            disabled={isTraining}
            className="gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <Play className="w-4 h-4" />
            学習を実行
          </Button>
          {isTraining && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">学習中... {trainProgress}%</p>
              <Progress value={trainProgress} className="h-1.5 w-48 [&>div]:bg-blue-500" />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">質問パターン</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">回答テンプレート</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">カテゴリ</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">登録日</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.id}</td>
                  <td className="px-3 py-3 text-gray-800 max-w-xs">
                    <p className="text-sm font-medium truncate">{item.questionPattern}</p>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs max-w-sm">
                    {item.answerTemplate.slice(0, 60)}...
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{item.createdAt}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-500">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
