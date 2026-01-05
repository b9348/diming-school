const { successResponse, errorResponse } = require('../utils/response')

exports.getList = async (req, res) => {
  try {
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

exports.add = async (req, res) => {
  try {
    successResponse(res, { id: Date.now() }, '发布成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

exports.update = async (req, res) => {
  try {
    successResponse(res, null, '更新成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
