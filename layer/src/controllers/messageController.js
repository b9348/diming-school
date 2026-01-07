const { successResponse, errorResponse } = require('../utils/response')

// 消息类型
const messageTypes = ['系统', '跑腿', '互助', '闲置', '群聊', '恋爱']

// 生成消息列表数据
const generateMessageList = (page, pageSize, type) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    name: type + '消息' + (startId + i + 1),
    lastMessage: '今天天气很好哦，我们一起出去交友一下吧，期待你的回复！',
    time: ['刚刚', '5分钟前', '1小时前', '昨天', '9-13'][i % 5],
    unread: i < 2 ? i + 1 : 0,
    lastImage: i % 3 === 0 ? 'https://iph.href.lu/200x200?text=消息图片' : ''
  }))
}

// 获取消息列表
const getList = (req, res) => {
  const { page = 1, pageSize = 10, type = '系统' } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 20
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  const list = generateMessageList(pageNum, size, type)
  successResponse(res, { list, total, types: messageTypes })
}

// 获取聊天记录
const getChatList = (req, res) => {
  const { targetId } = req.params
  const { page = 1, pageSize = 20 } = req.query

  const messages = Array(parseInt(pageSize)).fill(null).map((_, i) => ({
    id: 'msg_' + i,
    content: i % 2 === 0 ? '你好，很高兴认识你！' : '我也很高兴认识你，有什么可以帮助你的吗？',
    type: 'text',
    isSelf: i % 2 === 0,
    time: '10:' + (30 + i).toString().padStart(2, '0'),
    avatar: 'https://iph.href.lu/100x100?text=头像'
  }))

  successResponse(res, {
    list: messages,
    targetInfo: {
      id: targetId,
      nickname: '对方用户',
      avatar: 'https://iph.href.lu/100x100?text=头像'
    }
  })
}

// 发送消息
const send = (req, res) => {
  const { targetId, content, type = 'text' } = req.body

  if (!targetId) {
    return errorResponse(res, '目标用户不能为空', 400)
  }

  if (!content) {
    return errorResponse(res, '消息内容不能为空', 400)
  }

  const newMessage = {
    id: 'msg_' + Date.now(),
    content,
    type,
    isSelf: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: 'https://iph.href.lu/100x100?text=头像'
  }

  successResponse(res, newMessage, '发送成功')
}

// 标记已读
const markRead = (req, res) => {
  const { messageId } = req.body
  successResponse(res, null, '已标记为已读')
}

module.exports = {
  getList,
  getChatList,
  send,
  markRead
}
