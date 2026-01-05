const { successResponse, errorResponse } = require('../utils/response')

// 获取举报列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, status = 'pending', type } = req.query

    const list = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: ['content', 'user', 'trade'][i % 3],
      reason: '违规内容举报原因说明',
      reporter: `user_${i + 10}`,
      reported: `user_${i + 1}`,
      status,
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 30 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 处理举报
exports.handle = async (req, res) => {
  try {
    successResponse(res, null, '处理成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
