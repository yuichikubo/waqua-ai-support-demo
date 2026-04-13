'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  MessageCircle,
  Globe,
  Phone,
  HelpCircle,
  Database,
  Users,
  FileText,
  Settings,
  Droplets,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { label: 'ダッシュボード', path: '/', icon: LayoutDashboard },
  { label: '問い合わせ一覧', path: '/inquiries', icon: Inbox },
  { label: 'LINE対応', path: '/line', icon: MessageCircle },
  { label: 'HP問い合わせ', path: '/web', icon: Globe },
  { label: '電話対応記録', path: '/phone', icon: Phone },
  { label: 'FAQ管理', path: '/faq', icon: HelpCircle },
  { label: '学習データ', path: '/training', icon: Database },
  { label: 'スタッフ管理', path: '/staff', icon: Users },
  { label: '対応ログ', path: '/logs', icon: FileText },
  { label: '設定', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
        <div className="bg-blue-500 text-white rounded-lg p-1.5">
          <Droplets className="w-5 h-5" />
        </div>
        <span className="font-bold text-gray-800 text-sm leading-tight">
          Waqua AI<br />Support
        </span>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/'
              ? pathname === '/'
              : pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
            久
          </div>
          <div className="text-xs">
            <p className="font-medium text-gray-800">久保 裕一</p>
            <p className="text-gray-500">管理者</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
