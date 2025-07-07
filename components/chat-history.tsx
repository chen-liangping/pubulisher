"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, User } from "lucide-react"

// 模拟历史对话数据
const historyData = [
  {
    id: "1",
    title: "好友接口friends/external/api/v1/cp/users报错",
    userName: "gamedemo",
    time: "2025-07-04 13:38:42",
    isHandedOver: true,
    summonCount: 3,
    messages: [
      {
        id: 1,
        type: "user",
        content: "好友接口friends/external/api/v1/cp/users一直报错，返回500状态码",
        time: "2025-07-04 13:30:15",
        user: "gamedemo",
        isDisliked: false,
      },
      {
        id: 2,
        type: "ai",
        content: "根据您提供的信息，这可能是数据库连接或参数验证的问题。建议检查：",
        time: "2025-07-04 13:32:30",
        details: ["数据库连接状态是否正常", "userId和friendId参数是否符合格式要求", "是否存在数据库表结构变更"],
        isDisliked: true,
      },
      {
        id: 3,
        type: "user",
        content: "检查了数据库连接正常，参数格式也没问题，但是在高并发情况下还是会出现500错误",
        time: "2025-07-04 13:34:15",
        user: "gamedemo",
        isDisliked: false,
      },
      {
        id: 4,
        type: "ai",
        content: "高并发场景下的500错误通常与资源竞争有关，建议采取以下措施：",
        time: "2025-07-04 13:34:39",
        details: [
          "检查数据库连接池配置，增加最大连接数",
          "添加接口限流和熔断机制",
          "优化SQL查询，避免长时间锁表",
          "考虑使用Redis缓存减少数据库压力",
        ],
        isDisliked: false,
      },
    ],
  },
  {
    id: "2",
    title: "用户登录接口响应缓慢",
    userName: "developer01",
    time: "2025-07-04 10:22:15",
    isHandedOver: false,
    summonCount: 1,
    messages: [
      {
        id: 1,
        type: "user",
        content: "用户登录接口/api/v1/auth/login响应时间超过5秒，用户体验很差",
        time: "2025-07-04 10:20:15",
        user: "developer01",
        isDisliked: false,
      },
      {
        id: 2,
        type: "ai",
        content: "登录接口响应缓慢可能由以下原因造成：",
        time: "2025-07-04 10:21:30",
        details: [
          "数据库查询效率低下，建议检查索引",
          "密码加密算法复杂度过高",
          "网络延迟或服务器负载过高",
          "缓存机制未生效",
        ],
        isDisliked: false,
      },
    ],
  },
  {
    id: "3",
    title: "支付接口返回异常",
    userName: "tester02",
    time: "2025-07-03 16:45:30",
    isHandedOver: true,
    summonCount: 5,
    messages: [
      {
        id: 1,
        type: "user",
        content: "支付接口调用后返回success但实际未扣款",
        time: "2025-07-03 16:40:30",
        user: "tester02",
        isDisliked: false,
      },
      {
        id: 2,
        type: "ai",
        content: "这是一个严重的支付逻辑问题，建议立即检查：",
        time: "2025-07-03 16:42:15",
        details: ["支付回调处理逻辑", "订单状态更新机制", "第三方支付平台配置", "事务处理是否正确"],
        isDisliked: true,
      },
    ],
  },
]

interface ChatHistoryProps {
  onViewDetail: (conversation: any) => void
}

export default function ChatHistory({ onViewDetail }: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [handoverFilter, setHandoverFilter] = useState("all")

  const filteredHistory = historyData.filter((item) => {
    // 文本搜索
    if (
      searchTerm &&
      !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.userName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // 时间筛选 - 替换现有的时间筛选逻辑
    if (startDate || endDate) {
      const itemDate = new Date(item.time.split(" ")[0])

      if (startDate) {
        const start = new Date(startDate)
        if (itemDate < start) {
          return false
        }
      }

      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999) // 包含结束日期的整天
        if (itemDate > end) {
          return false
        }
      }
    }

    // 人工接入状态筛选
    if (handoverFilter === "handed" && !item.isHandedOver) {
      return false
    }
    if (handoverFilter === "not-handed" && item.isHandedOver) {
      return false
    }

    return true
  })

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">历史对话记录</h1>
        <p className="text-gray-600">查看和管理所有的历史对话记录</p>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="mb-6 space-y-4">
        {/* 搜索框 */}
        <div className="relative max-w-md">
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
            placeholder="搜索对话标题或用户名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* 时间筛选 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">时间范围:</label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="开始日期"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="结束日期"
              />
            </div>
          </div>

          {/* 人工接入状态筛选 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">接入状态:</label>
            <select
              value={handoverFilter}
              onChange={(e) => setHandoverFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="handed">已人工接入</option>
              <option value="not-handed">未人工接入</option>
            </select>
          </div>

          {/* 清除筛选按钮 */}
          {(startDate || endDate || handoverFilter !== "all" || searchTerm) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setStartDate("")
                setEndDate("")
                setHandoverFilter("all")
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              清除筛选
            </Button>
          )}
        </div>
      </div>

      {/* 历史对话表格 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">对话标题</TableHead>
              <TableHead className="font-semibold text-gray-900">对话人名称</TableHead>
              <TableHead className="font-semibold text-gray-900">时间</TableHead>
              <TableHead className="font-semibold text-gray-900">召唤次数</TableHead>
              <TableHead className="font-semibold text-gray-900">人工接入状态</TableHead>
              <TableHead className="font-semibold text-gray-900">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((conversation) => (
              <TableRow key={conversation.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate" title={conversation.title}>
                    {conversation.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        <User className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{conversation.userName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{conversation.time}</TableCell>
                <TableCell className="text-gray-900 font-medium">{conversation.summonCount}</TableCell>
                <TableCell>
                  <Badge
                    variant={conversation.isHandedOver ? "destructive" : "secondary"}
                    className={conversation.isHandedOver ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                  >
                    {conversation.isHandedOver ? "已接入" : "未接入"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onViewDetail(conversation)}>
                    <Eye className="w-4 h-4 mr-1" />
                    查看详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 空状态 */}
      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无对话记录</h3>
          <p className="text-gray-500">没有找到符合条件的历史对话记录</p>
        </div>
      )}
    </div>
  )
}
