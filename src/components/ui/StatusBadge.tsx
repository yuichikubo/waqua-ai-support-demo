import { InquiryStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: InquiryStatus | '新規' | '対応中' | '完了' | '未解決' | '解決済み'
  className?: string
}

const statusStyles: Record<string, string> = {
  新規: 'bg-gray-100 text-gray-600',
  AI対応中: 'bg-purple-100 text-purple-700',
  対応待ち: 'bg-yellow-100 text-yellow-700',
  解決済み: 'bg-green-100 text-green-700',
  対応中: 'bg-blue-100 text-blue-700',
  完了: 'bg-green-100 text-green-700',
  未解決: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status] ?? 'bg-gray-100 text-gray-600',
        className
      )}
    >
      {status}
    </span>
  )
}
