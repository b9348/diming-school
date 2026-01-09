const { successResponse, errorResponse } = require('../utils/response')

exports.getList = async (req, res) => {
  try {
    const { page = 1, type, status, dateRange } = req.query
    // dateRange: ['2024-01-01', '2024-12-31'] 用于按创建时间筛选

    const list = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `公告标题 ${i + 1}`,
      type: ['system', 'activity', 'update'][i % 3],
      content: '公告内容详情...',
      status: i % 2 === 0 ? 'published' : 'draft',
      createdAt: '2024-01-01 12:00:00'
    }))
    successResponse(res, { list, total: 20 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存公告（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, title, type, content, status, deleted } = req.body

    if (deleted) {
      successResponse(res, null, '删除成功')
    } else if (id) {
      successResponse(res, null, '更新成功')
    } else {
      successResponse(res, { id: Date.now() }, '发布成功')
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}
