const { successResponse, errorResponse } = require('../utils/response')

// 获取敏感词列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, keyword, category, dateRange } = req.query
    // dateRange: ['2024-01-01', '2024-12-31'] 用于按添加时间筛选

    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      word: `敏感词${i + 1}`,
      category: ['political', 'porn', 'violence', 'ad', 'other'][i % 5],
      level: (i % 3) + 1,
      replacement: '***',
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 100 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存敏感词（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, word, category, level, replacement, deleted } = req.body

    if (deleted) {
      successResponse(res, null, '删除成功')
    } else if (id) {
      successResponse(res, null, '更新成功')
    } else {
      successResponse(res, { id: Date.now() }, '添加成功')
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 批量添加
exports.batchAdd = async (req, res) => {
  try {
    const { words } = req.body
    successResponse(res, { count: words?.length || 0 }, '导入成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
