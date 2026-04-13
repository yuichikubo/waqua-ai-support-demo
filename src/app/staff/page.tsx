'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { staffData } from '@/data/staffData'
import { Staff } from '@/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(staffData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    role: 'スタッフ',
    status: '初回変更待ち',
  })

  const handleCreate = () => {
    if (!newStaff.name || !newStaff.email) {
      toast.error('名前とメールは必須です')
      return
    }
    const s: Staff = {
      id: `staff-${Date.now()}`,
      name: newStaff.name ?? '',
      email: newStaff.email ?? '',
      role: newStaff.role as Staff['role'] ?? 'スタッフ',
      status: '初回変更待ち',
      createdAt: new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/'),
    }
    setStaff((prev) => [...prev, s])
    setIsModalOpen(false)
    setNewStaff({ role: 'スタッフ', status: '初回変更待ち' })
    toast.success('スタッフを追加しました')
  }

  const handleDelete = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id))
    toast.success('削除しました')
  }

  const roleStyles: Record<Staff['role'], string> = {
    '管理者': 'bg-blue-100 text-blue-700',
    'スタッフ': 'bg-gray-100 text-gray-600',
  }

  const statusStyles: Record<Staff['status'], string> = {
    'アクティブ': 'bg-green-100 text-green-700',
    '初回変更待ち': 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">スタッフ管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">スタッフ一覧（{staff.length}名）</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          スタッフを追加
        </Button>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">名前</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">メールアドレス</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ロール</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ステータス</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">作成日</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {s.name[0]}
                      </div>
                      <span className="font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-sm">{s.email}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleStyles[s.role]}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{s.createdAt}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-500">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(s.id)}
                        disabled={s.role === '管理者'}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>スタッフを追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">名前 *</Label>
              <Input
                placeholder="山田太郎"
                value={newStaff.name ?? ''}
                onChange={(e) => setNewStaff((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">メールアドレス *</Label>
              <Input
                type="email"
                placeholder="yamada@waqua.com"
                value={newStaff.email ?? ''}
                onChange={(e) => setNewStaff((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ロール</Label>
              <Select
                value={newStaff.role}
                onValueChange={(v) => setNewStaff((p) => ({ ...p, role: v as Staff['role'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="スタッフ">スタッフ</SelectItem>
                  <SelectItem value="管理者">管理者</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>キャンセル</Button>
              <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600">追加</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
