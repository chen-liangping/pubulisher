"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const consultations = [
  {
    id: "15",
    title: "好友接口friends/external/api/v1/cp/users报错",
    user: "highschool",
    time: "2025-07-04 13:38:42",
    status: "active",
    preview: "Could you please provide detailed informat...",
    date: "2025-07-04",
  },
  {
    id: "14",
    title: "好友接口friends/external/api/v1/cp/users报错",
    user: "highschool",
    time: "2025-07-04 17:34:45",
    status: "waiting",
    preview: "Could you please provide detailed informat...",
    date: "2025-07-04",
  },
  {
    id: "124",
    title: "好友接口friends/external/api/v1/cp/users报错",
    user: "highschool",
    time: "2025-07-03 16:11:13",
    status: "active",
    preview: "",
    date: "2025-07-03",
  },
  {
    id: "13",
    title: "好友接口friends/external/api/v1/cp/users报错",
    user: "highschool",
    time: "2025-07-02 17:18:17",
    status: "waiting",
    preview: "",
    date: "2025-07-02",
  },
  {
    id: "12",
    title: "好友接口friends/external/api/v1/cp/users报错",
    user: "highschool",
    time: "2025-07-02 09:15:16",
    status: "waiting",
    preview: "",
    date: "2025-07-02",
  },
  {
    id: "11",
    title: "好友接口friends/external/api/v1/cp/users报错",
    user: "highschool",
    time: "2025-06-09 19:19:02",
    status: "waiting",
    preview: "",
    date: "2025-06-09",
  },
]

const currentChat = {
  title: "好友接口friends/external/api/v1/cp/users报错",
  status: "ACTIVE",
  time: "2025-07-02 17:33:58",
  user: "gamedemo",
  userId: "123",
}

export default function ChatConsultation() {
  const [selectedChat, setSelectedChat] = useState(consultations[1])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [waitingFilter, setWaitingFilter] = useState(true)
  const [atMeFilter, setAtMeFilter] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "user",
      content: "好友接口friends/external/api/v1/cp/users一直报错，返回500状态码",
      time: "2025-07-02 17:30:15",
      user: "gamedemo",
    },
    {
      id: 4,
      type: "ai",
      content: "根据您提供的信息，这可能是数据库连接或参数验证的问题。建议检查：",
      time: "2025-07-02 17:32:30",
      details: ["数据库连接状态是否正常", "userId和friendId参数是否符合格式要求", "是否存在数据库表结构变更"],
    },
    {
      id: 6,
      type: "ai",
      content: "高并发场景下的500错误通常与资源竞争有关，建议采取以下措施：",
      time: "2025-07-02 17:34:39",
      details: [
        "检查数据库连接池配置，增加最大连接数",
        "添加接口限流和熔断机制",
        "优化SQL查询，避免长时间锁表",
        "考虑使用Redis缓存减少数据库压力",
      ],
    },
  ])

  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editingContent, setEditingContent] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "ai",
        content: inputMessage,
        time: new Date()
          .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/\//g, "-"),
      }
      setMessages([...messages, newMessage])
      setInputMessage("")

      setTimeout(() => {
        const userResponse = {
          id: messages.length + 2,
          type: "user",
          content: "收到，我会按照您的建议进行处理。",
          time: new Date()
            .toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-"),
          user: "gamedemo",
        }
        setMessages((prev) => [...prev, userResponse])
      }, 1500)
    }
  }

  const handleEditMessage = (messageId, content) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  const handleSaveEdit = (messageId) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, content: editingContent } : msg)))
    setEditingMessageId(null)
    setEditingContent("")
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditingContent("")
  }

  // 获取今天、昨天、最近三天的日期
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const filteredConsultations = consultations.filter((consultation) => {
    if (searchTerm && !consultation.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // 时间筛选
    if (activeTab === "today" && consultation.date !== today) {
      return false
    }
    if (activeTab === "yesterday" && consultation.date !== yesterday) {
      return false
    }
    if (activeTab === "recent" && consultation.date < threeDaysAgo) {
      return false
    }

    return true
  })

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Chat List */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-4">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Search consultations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* 时间筛选按钮 */}
          <div className="flex space-x-2 mb-4">
            <Button
              variant={activeTab === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("today")}
            >
              今天
            </Button>
            <Button
              variant={activeTab === "yesterday" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("yesterday")}
            >
              昨天
            </Button>
            <Button
              variant={activeTab === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("recent")}
            >
              最近三天
            </Button>
            <Button variant={activeTab === "All" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("All")}>
              所有未读消息
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConsultations.map((consultation, index) => (
            <div
              key={index}
              onClick={() => setSelectedChat(consultation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === consultation.id && selectedChat?.title === consultation.title
                  ? "bg-blue-50 border-r-2 border-r-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-6 rounded text-xs font-medium flex items-center justify-center text-white ${
                      consultation.id === "15" ? "bg-red-500" : "bg-red-400"
                    }`}
                  >
                    {consultation.id}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{consultation.title}</h3>
                      <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {messages.length}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {consultation.status === "active" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                  {consultation.preview && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{consultation.preview}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {consultation.status === "waiting" && (
                        <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">{consultation.user}</span>
                    </div>
                    <span className="text-xs text-gray-400">{consultation.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">{currentChat.title}</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 text-xs">{currentChat.status}</Badge>
                <span className="text-sm text-gray-500">time.</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{currentChat.user}</span>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-500 text-white text-sm">👤</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{currentChat.time}</div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {message.type === "user" ? (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentChat.userId}
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm2 0h-2v2h2V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.type === "user" ? message.user : "AI"}
                    </span>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 h-6 px-2"
                      onClick={() => handleEditMessage(message.id, message.content)}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 h-6 px-2"></Button>
                  </div>
                </div>
                {editingMessageId === message.id ? (
                  <div className={`rounded-lg p-4 ${message.type === "user" ? "bg-blue-50" : "bg-gray-50"}`}>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        取消
                      </Button>
                      <Button size="sm" onClick={() => handleSaveEdit(message.id)}>
                        保存
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-lg p-4 ${message.type === "user" ? "bg-blue-50" : "bg-gray-50"}`}>
                    <p className="text-sm text-gray-900 mb-3">{message.content}</p>
                    {message.details && (
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-900">
                        {message.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ol>
                    )}
                    <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-gray-200">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600 h-6 px-2">
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-600 h-6 px-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        <span className="ml-1 text-xs">点赞</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600 h-6 px-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                          />
                        </svg>
                        <span className="ml-1 text-xs">踩</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="输入消息..."
                className="pr-12 border-gray-200"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0"
                onClick={handleSendMessage}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
