const { successResponse, errorResponse } = require('../utils/response')

// 反馈类型映射
const typeMap = {
  bug: '功能异常',
  suggest: '功能建议',
  complaint: '投诉举报',
  other: '其他问题'
}

// 获取反馈列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, type, status, keyword, dateRange } = req.query

    const list = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: ['bug', 'suggest', 'complaint', 'other'][i % 4],
      content: '这是一条用户反馈内容，描述了用户遇到的问题或建议...',
      images: i % 2 === 0 ? ['https://placeholder.com/img1.jpg'] : [],
      contact: i % 3 === 0 ? '13800138000' : '',
      userId: `user_${i + 1}`,
      nickname: `用户${i + 1}`,
      avatar: '',
      status: i < 3 ? 'pending' : 'handled',
      reply: i >= 3 ? '感谢您的反馈，我们已收到并处理。' : '',
      handledBy: i >= 3 ? 'admin' : '',
      handledAt: i >= 3 ? '2024-01-02 10:00:00' : '',
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 30 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取反馈详情
exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params

    const detail = {
      id: parseInt(id),
      type: 'bug',
      content: '这是一条详细的用户反馈内容，描述了用户遇到的问题或建议，内容比较详细...',
      images: ['https://placeholder.com/img1.jpg', 'https://placeholder.com/img2.jpg'],
      contact: '13800138000',
      userId: 'user_1',
      nickname: '用户1',
      avatar: '',
      status: 'pending',
      reply: '',
      handledBy: '',
      handledAt: '',
      createdAt: '2024-01-01 12:00:00'
    }

    successResponse(res, detail)
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 处理反馈（回复）
exports.handle = async (req, res) => {
  try {
    const { id } = req.params
    const { reply } = req.body

    if (!reply || !reply.trim()) {
      return errorResponse(res, '请输入回复内容')
    }

    successResponse(res, null, '处理成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 删除反馈
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    successResponse(res, null, '删除成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
