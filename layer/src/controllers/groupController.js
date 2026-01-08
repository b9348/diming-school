const { successResponse, errorResponse } = require('../utils/response')

// 模拟群消息数据
const mockMessages = [
  {
    id: 1,
    nickname: '张三',
    avatar: 'https://iph.href.lu/100x100?text=张三',
    content: '1、谁帮我代写一下',
    time: '10:34'
  },
  {
    id: 2,
    nickname: '张三',
    avatar: 'https://iph.href.lu/100x100?text=张三',
    content: '2、谁帮我代写一下',
    time: '10:34'
  },
  {
    id: 3,
    nickname: '张三',
    avatar: 'https://iph.href.lu/100x100?text=张三',
    content: '3、谁帮我代写一下',
    time: '10:34'
  }
]

// 获取群消息
const getMessages = (req, res) => {
  const { page = 1, pageSize = 20 } = req.query
  successResponse(res, { list: mockMessages })
}

// 发送群消息
const sendMessage = (req, res) => {
  const { content } = req.body

  if (!content) {
    return errorResponse(res, '消息内容不能为空', 400)
  }

  const newMessage = {
    id: Date.now(),
    nickname: '我',
    avatar: 'https://iph.href.lu/100x100?text=我',
    content,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  successResponse(res, newMessage, '发送成功')
}

module.exports = {
  getMessages,
  sendMessage
}
