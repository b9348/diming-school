const { successResponse, errorResponse } = require('../utils/response')

// ==================== 我的帖子 ====================

// 生成用户帖子数据
const generateMyPosts = (page, pageSize, type) => {
  const startId = (page - 1) * pageSize
  const types = type ? [type] : ['post', 'vote', 'errand', 'idle', 'help', 'love']

  return Array(pageSize).fill(null).map((_, i) => {
    const itemType = types[i % types.length]
    return {
      id: startId + i + 1,
      type: itemType,
      title: `这是第${startId + i + 1}条${getTypeName(itemType)}内容标题`,
      content: '这是内容描述，显示前两行的内容预览，超出部分会被截断显示省略号...',
      images: i % 3 === 0 ? [] : [
        'https://iph.href.lu/400x300?text=图片1',
        'https://iph.href.lu/400x300?text=图片2'
      ].slice(0, (i % 2) + 1),
      time: ['2分钟前', '5分钟前', '1小时前', '昨天', '3天前'][i % 5],
      viewCount: Math.floor(Math.random() * 500) + 50,
      likeCount: Math.floor(Math.random() * 100) + 10,
      commentCount: Math.floor(Math.random() * 50) + 5,
      status: ['published', 'published', 'published', 'reviewing', 'published'][i % 5]
    }
  })
}

// 获取类型名称
const getTypeName = (type) => {
  const nameMap = {
    post: '帖子',
    vote: '投票',
    errand: '跑腿',
    idle: '闲置',
    help: '互助',
    love: '交友'
  }
  return nameMap[type] || '帖子'
}

// 获取我的帖子列表
const getMyPosts = (req, res) => {
  const { page = 1, pageSize = 10, type = '' } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 35
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  const list = generateMyPosts(pageNum, size, type)
  successResponse(res, { list, total })
}

// 删除帖子
const deletePost = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '删除成功')
}

// ==================== 我的收藏 ====================

// 生成收藏数据
const generateCollects = (page, pageSize, type) => {
  const startId = (page - 1) * pageSize
  const types = type ? [type] : ['post', 'vote', 'errand', 'idle', 'help', 'love']

  return Array(pageSize).fill(null).map((_, i) => {
    const itemType = types[i % types.length]
    return {
      id: startId + i + 1,
      type: itemType,
      title: `收藏的${getTypeName(itemType)}标题内容，显示两行`,
      content: '这是收藏内容的描述预览...',
      cover: `https://iph.href.lu/200x200?text=收藏${i + 1}`,
      images: [`https://iph.href.lu/200x200?text=收藏${i + 1}`],
      collectTime: ['2分钟前', '1小时前', '昨天', '3天前', '1周前'][i % 5],
      time: ['2分钟前', '1小时前', '昨天', '3天前', '1周前'][i % 5]
    }
  })
}

// 获取收藏列表
const getCollects = (req, res) => {
  const { page = 1, pageSize = 10, type = '' } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 28
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total, counts: {} })
  }

  const list = generateCollects(pageNum, size, type)
  const counts = {
    all: 28,
    post: 10,
    vote: 5,
    errand: 4,
    idle: 3,
    help: 3,
    love: 3
  }

  successResponse(res, { list, total, counts })
}

// 取消收藏
const cancelCollects = (req, res) => {
  const { ids } = req.body
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return errorResponse(res, '请选择要取消收藏的内容', 400)
  }
  successResponse(res, null, `成功取消${ids.length}条收藏`)
}

// ==================== 浏览历史 ====================

// 生成浏览历史数据
const generateHistory = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  const types = ['post', 'vote', 'errand', 'idle', 'help', 'love']
  const today = new Date()

  return Array(pageSize).fill(null).map((_, i) => {
    const daysAgo = Math.floor(i / 5)
    const viewDate = new Date(today)
    viewDate.setDate(viewDate.getDate() - daysAgo)
    const dateStr = viewDate.toISOString().split('T')[0]

    return {
      id: startId + i + 1,
      type: types[i % types.length],
      title: `浏览过的内容标题第${startId + i + 1}条`,
      content: '这是浏览过的内容描述预览...',
      cover: `https://iph.href.lu/200x200?text=历史${i + 1}`,
      images: [`https://iph.href.lu/200x200?text=历史${i + 1}`],
      nickname: ['张三', '李四', '王五', '赵六'][i % 4],
      viewTime: ['09:30', '10:15', '14:20', '16:45', '20:30'][i % 5],
      viewDate: dateStr
    }
  })
}

// 获取浏览历史
const getHistory = (req, res) => {
  const { page = 1, pageSize = 20 } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 50
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  const list = generateHistory(pageNum, size)
  successResponse(res, { list, total })
}

// 删除单条历史
const deleteHistory = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '删除成功')
}

// 清空历史
const clearHistory = (req, res) => {
  successResponse(res, null, '清空成功')
}

// ==================== 我的订单 ====================

// 生成订单数据
const generateOrders = (page, pageSize, status) => {
  const startId = (page - 1) * pageSize
  const types = ['errand', 'idle', 'help']
  const statuses = status === 'all' ? ['pending', 'accepted', 'processing', 'delivering', 'completed', 'cancelled'] :
    status === 'pending' ? ['pending'] :
    status === 'processing' ? ['accepted', 'processing', 'delivering'] :
    status === 'completed' ? ['completed'] :
    status === 'cancelled' ? ['cancelled'] : ['pending']

  return Array(pageSize).fill(null).map((_, i) => {
    const orderType = types[i % types.length]
    const orderStatus = statuses[i % statuses.length]

    return {
      id: `ORDER${Date.now()}${startId + i + 1}`,
      type: orderType,
      title: `这是一个${getTypeName(orderType)}订单标题`,
      desc: '订单描述信息，显示订单的简要说明',
      cover: `https://iph.href.lu/200x200?text=订单${i + 1}`,
      price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
      status: orderStatus,
      time: ['2025-01-05 10:30', '2025-01-04 15:20', '2025-01-03 09:15', '2025-01-02 18:45'][i % 4],
      targetUserId: `user_${i + 100}`,
      rated: orderStatus === 'completed' && i % 2 === 0
    }
  })
}

// 获取订单列表
const getOrders = (req, res) => {
  const { page = 1, pageSize = 10, status = 'all' } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 25
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total, counts: {} })
  }

  const list = generateOrders(pageNum, size, status)
  const counts = {
    all: 25,
    pending: 5,
    processing: 8,
    completed: 10,
    cancelled: 2
  }

  successResponse(res, { list, total, counts })
}

// 取消订单
const cancelOrder = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '订单已取消')
}

// 确认订单
const confirmOrder = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '订单已确认完成')
}

// 删除订单
const deleteOrder = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '订单已删除')
}

// ==================== 消息通知 ====================

// 生成通知数据
const generateNotifications = (page, pageSize, type) => {
  const startId = (page - 1) * pageSize
  const types = type === 'all' ? ['system', 'interact', 'trade'] : [type]

  return Array(pageSize).fill(null).map((_, i) => {
    const notifyType = types[i % types.length]
    const isRead = i % 3 !== 0

    return {
      id: startId + i + 1,
      type: notifyType,
      title: notifyType === 'system' ? '系统通知' :
        notifyType === 'interact' ? '互动消息' : '交易通知',
      content: notifyType === 'system' ? '您的身份认证已通过审核，现在可以使用全部功能了' :
        notifyType === 'interact' ? '张三 赞了你的帖子"今天天气真好"' :
        '您的跑腿订单已完成，收入 ¥15.00 已到账',
      time: ['刚刚', '5分钟前', '1小时前', '昨天', '3天前'][i % 5],
      isRead,
      targetType: notifyType === 'interact' ? 'post' : notifyType === 'trade' ? 'order' : null,
      targetId: notifyType !== 'system' ? `${startId + i + 1}` : null,
      extra: i % 4 === 0 ? {
        image: 'https://iph.href.lu/80x80?text=图',
        text: '相关内容预览'
      } : null
    }
  })
}

// 获取通知列表
const getNotifications = (req, res) => {
  const { page = 1, pageSize = 20, type = 'all' } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 40
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total, unreadCounts: {} })
  }

  const list = generateNotifications(pageNum, size, type)
  const unreadCounts = {
    all: 12,
    system: 3,
    interact: 5,
    trade: 4
  }

  successResponse(res, { list, total, unreadCounts })
}

// 标记通知已读
const markNotificationRead = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '已标记为已读')
}

// 全部标记已读
const markAllNotificationsRead = (req, res) => {
  successResponse(res, null, '全部已标记为已读')
}

// ==================== 设置相关 ====================

// 获取用户设置
const getSettings = (req, res) => {
  successResponse(res, {
    pushNotification: true,
    systemNotification: true,
    interactNotification: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    fontSize: 'normal',
    autoPlayVideo: true,
    wifiOnlyImage: false
  })
}

// 更新设置
const updateSetting = (req, res) => {
  const { key, value } = req.body
  if (!key) {
    return errorResponse(res, '设置项不能为空', 400)
  }
  successResponse(res, null, '设置已更新')
}

// ==================== 隐私设置 ====================

// 获取隐私设置
const getPrivacySettings = (req, res) => {
  successResponse(res, {
    settings: {
      showOnlineStatus: true,
      showLastActive: true,
      searchByPhone: true,
      showSchool: true,
      whoCanMessage: 'all',
      whoCanComment: 'all',
      whoCanSeeCollects: 'all'
    },
    blacklistCount: 3
  })
}

// 更新隐私设置
const updatePrivacySetting = (req, res) => {
  const { key, value } = req.body
  if (!key) {
    return errorResponse(res, '设置项不能为空', 400)
  }
  successResponse(res, null, '隐私设置已更新')
}

// 请求下载数据
const requestDataDownload = (req, res) => {
  successResponse(res, null, '数据导出申请已提交，我们将在1-3个工作日内发送到您的邮箱')
}

module.exports = {
  // 我的帖子
  getMyPosts,
  deletePost,

  // 我的收藏
  getCollects,
  cancelCollects,

  // 浏览历史
  getHistory,
  deleteHistory,
  clearHistory,

  // 我的订单
  getOrders,
  cancelOrder,
  confirmOrder,
  deleteOrder,

  // 消息通知
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,

  // 设置
  getSettings,
  updateSetting,

  // 隐私设置
  getPrivacySettings,
  updatePrivacySetting,
  requestDataDownload
}
