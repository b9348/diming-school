const { successResponse, errorResponse } = require('../utils/response')

exports.getList = async (req, res) => {
  try {
    const { page = 1, platform, dateRange } = req.query
    // dateRange: ['2024-01-01', '2024-12-31'] 用于按发布时间筛选

    const list = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      version: `1.${i}.0`,
      platform: ['android', 'ios', 'all'][i % 3],
      description: '版本更新说明...',
      downloadUrl: '',
      forceUpdate: i === 0,
      createdAt: '2024-01-01 12:00:00'
    }))
    successResponse(res, { list, total: 10 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存版本（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, version, platform, description, downloadUrl, forceUpdate, deleted } = req.body

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
