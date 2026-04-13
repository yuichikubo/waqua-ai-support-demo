import { InquiryCategory } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: InquiryCategory | string
  className?: string
}

const categoryStyles: Record<string, string> = {
  'Water Pure Pro': 'bg-blue-100 text-blue-700',
  'Water Pure': 'bg-cyan-100 text-cyan-700',
  'Pitcher Pure': 'bg-sky-100 text-sky-700',
  'Silica Pure': 'bg-indigo-100 text-indigo-700',
  '小型海水淡水化装置': 'bg-teal-100 text-teal-700',
  '循環式手洗いユニット': 'bg-emerald-100 text-emerald-700',
  '採用・エントリー': 'bg-purple-100 text-purple-700',
  'その他': 'bg-gray-100 text-gray-600',
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        categoryStyles[category] ?? 'bg-gray-100 text-gray-600',
        className
      )}
    >
      {category}
    </span>
  )
}
