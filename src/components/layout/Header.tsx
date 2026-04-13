'use client'

import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold text-gray-800">Waqua AI Support</h1>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">デモ</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
            久
          </div>
          <span className="text-sm font-medium text-gray-700">管理者</span>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 gap-1.5">
          <LogOut className="w-4 h-4" />
          ログアウト
        </Button>
      </div>
    </header>
  )
}
