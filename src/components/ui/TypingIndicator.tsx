'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-green-50 rounded-2xl rounded-bl-sm w-16">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
    </div>
  )
}
