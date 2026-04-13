import { Channel } from '@/types'
import { cn } from '@/lib/utils'

interface ChannelBadgeProps {
  channel: Channel
  className?: string
}

const channelStyles: Record<Channel, string> = {
  LINE: 'bg-green-100 text-green-700',
  HP: 'bg-blue-100 text-blue-700',
  電話: 'bg-orange-100 text-orange-700',
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        channelStyles[channel],
        className
      )}
    >
      {channel}
    </span>
  )
}
