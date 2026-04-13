'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Check, Pencil, X, ChevronDown, ChevronUp } from 'lucide-react'

interface AIDraftApprovalProps {
  messageId: string
  draftContent: string
  onApprove: (messageId: string, content: string) => void
  onReject: (messageId: string) => void
}

export function AIDraftApproval({
  messageId,
  draftContent,
  onApprove,
  onReject,
}: AIDraftApprovalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(draftContent)
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] w-full">
        {/* ドラフト吹き出し */}
        <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-2xl rounded-br-sm px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">AI応答ドラフト</span>
              <span className="text-xs bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                承認待ち
              </span>
            </div>
            <button
              onClick={() => setIsExpanded((p) => !p)}
              className="text-amber-500 hover:text-amber-700"
            >
              {isExpanded
                ? <ChevronUp className="w-3.5 h-3.5" />
                : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isExpanded && (
            <>
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="text-sm bg-white border-amber-200 min-h-[100px] resize-none"
                  autoFocus
                />
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {editedContent}
                </p>
              )}

              {/* 編集前の原文を確認 */}
              {isEditing && editedContent !== draftContent && (
                <div className="mt-2 pt-2 border-t border-amber-200">
                  <p className="text-xs text-amber-500 mb-1">元のAI生成文：</p>
                  <p className="text-xs text-gray-400 line-through leading-relaxed">{draftContent}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 承認アクションバー */}
        {isExpanded && (
          <div className="flex items-center gap-2 mt-2 justify-end">
            <button
              onClick={() => onReject(messageId)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
            >
              <X className="w-3 h-3" />
              却下
            </button>
            <button
              onClick={() => setIsEditing((p) => !p)}
              className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded ${
                isEditing
                  ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                  : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <Pencil className="w-3 h-3" />
              {isEditing ? '編集中' : '編集'}
            </button>
            <Button
              size="sm"
              onClick={() => onApprove(messageId, editedContent)}
              className="h-7 text-xs gap-1.5 bg-green-500 hover:bg-green-600"
            >
              <Check className="w-3 h-3" />
              {editedContent !== draftContent ? '編集して送信' : '承認して送信'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
