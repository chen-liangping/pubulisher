"use client"

import { useState } from "react"
import ChatConsultation from "@/components/chat-consultation"
import ChatHistory from "@/components/chat-history"
import ChatDetail from "@/components/chat-detail"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("chat")
  const [selectedConversation, setSelectedConversation] = useState(null)

  const handleViewDetail = (conversation: any) => {
    setSelectedConversation(conversation)
    setActiveView("detail")
  }

  const handleBackToHistory = () => {
    setSelectedConversation(null)
    setActiveView("history")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 只在非详情页显示 */}
      {activeView !== "detail" && (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <span className="text-orange-500 font-bold text-xl">G123</span>
                <span className="text-gray-700 font-medium">Publisher 管理后台</span>
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">STG</span>
              </div>
              <nav className="flex space-x-6">
                <button
                  className={`text-sm font-medium ${
                    activeView === "chat" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveView("chat")}
                >
                  对话管理
                </button>
                <button
                  className={`text-sm font-medium ${
                    activeView === "history" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveView("history")}
                >
                  历史对话
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 根据当前视图渲染不同内容 */}
      {activeView === "detail" ? (
        <ChatDetail conversation={selectedConversation} onBack={handleBackToHistory} />
      ) : (
        <div className="flex">
          {/* Sidebar - 只在非详情页显示 */}
          <aside className="w-48 bg-white border-r border-gray-200 min-h-screen">
            <nav className="p-4">
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium ${
                    activeView === "chat" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveView("chat")}
                >
                  💬 对话管理
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium ${
                    activeView === "history" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveView("history")}
                >
                  📋 历史对话
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeView === "chat" ? <ChatConsultation /> : <ChatHistory onViewDetail={handleViewDetail} />}
          </main>
        </div>
      )}
    </div>
  )
}
