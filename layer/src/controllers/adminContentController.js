const { successResponse, errorResponse } = require('../utils/response')

// 获取待审核内容列表
exports.getAuditList = async (req, res) => {
  try {
    const { page = 1, username, type, status = 'pending', dateRange } = req.query
    // username: 发布者
    // dateRange: ['2024-01-01', '2024-12-31'] 用于按发布时间筛选

    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      type: ['post', 'vote', 'errand', 'idle', 'love', 'help'][i % 6],
      title: `测试内容标题 ${i + 1}`,
      content: '这是内容详情...',
      username: `user_${i + 1}`,
      status,
      aiResult: i % 3 === 0 ? 'risk' : 'pass',
      aiReason: i % 3 === 0 ? '检测到敏感词' : null,
      images: [],
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 50 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 通过审核
exports.approve = async (req, res) => {
  try {
    successResponse(res, null, '审核通过')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 拒绝审核
exports.reject = async (req, res) => {
  try {
    successResponse(res, null, '已拒绝')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 删除内容
exports.delete = async (req, res) => {
  try {
    successResponse(res, null, '删除成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存内容（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, deleted } = req.body

    if (deleted) {
      successResponse(res, null, '删除成功')
    } else if (id) {
      successResponse(res, null, '更新成功')
    } else {
      successResponse(res, { id: Date.now() }, '创建成功')
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}
