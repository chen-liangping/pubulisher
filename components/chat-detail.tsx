"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, ThumbsDown, ThumbsUp, Copy, MoreHorizontal, User } from "lucide-react"

interface ChatDetailProps {
  conversation: any
  onBack: () => void
}

export default function ChatDetail({ conversation, onBack }: ChatDetailProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null)

  const handleCopyMessage = async (content: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const formatMessageContent = (message: any) => {
    let content = message.content
    if (message.details) {
      content += "\n\n" + message.details.map((detail: string, index: number) => `${index + 1}. ${detail}`).join("\n")
    }
    return content
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-gray-700 w-full justify-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回历史对话
          </Button>
        </div>

        <div className="p-4 flex-1">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">对话信息</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">标题：</span>
                  <span className="text-white">{conversation.title}</span>
                </div>
                <div>
                  <span className="text-gray-400">用户：</span>
                  <span className="text-white">{conversation.userName}</span>
                </div>
                <div>
                  <span className="text-gray-400">时间：</span>
                  <span className="text-white">{conversation.time}</span>
                </div>
                <div>
                  <span className="text-gray-400">状态：</span>
                  <Badge
                    variant={conversation.isHandedOver ? "destructive" : "secondary"}
                    className={
                      conversation.isHandedOver
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }
                  >
                    {conversation.isHandedOver ? "已人工接入" : "未人工接入"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{conversation.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                与 {conversation.userName} 的对话 • {conversation.time}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {conversation.messages.map((message: any, index: number) => (
                <div key={message.id} className="group">
                  {message.type === "user" ? (
                    // User Message
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg px-4 py-3">
                          <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // AI Message
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-green-500 text-white">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm2 0h-2v2h2V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">AI助手</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                          {message.isDisliked && (
                            <div className="flex items-center space-x-1 text-red-500">
                              <ThumbsDown className="w-3 h-3" />
                              <span className="text-xs">已点踩</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 relative group">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-900 mb-3 whitespace-pre-wrap">{message.content}</p>
                            {message.details && (
                              <ol className="list-decimal list-inside space-y-1 text-gray-900 pl-4">
                                {message.details.map((detail: string, detailIndex: number) => (
                                  <li key={detailIndex} className="text-sm">
                                    {detail}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>

                          {/* Message Actions */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-gray-500 hover:text-gray-700"
                                onClick={() => handleCopyMessage(formatMessageContent(message), message.id)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                {copiedMessageId === message.id ? "已复制" : "复制"}
                              </Button>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 px-2 ${message.isDisliked ? "text-red-500" : "text-gray-500 hover:text-green-600"}`}
                              >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                <span className="text-xs">赞</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 px-2 ${message.isDisliked ? "text-red-500" : "text-gray-500 hover:text-red-600"}`}
                              >
                                <ThumbsDown className="w-3 h-3 mr-1" />
                                <span className="text-xs">踩</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>对话已结束</span>
              <span>共 {conversation.messages.length} 条消息</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
