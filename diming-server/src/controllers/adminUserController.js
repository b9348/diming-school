const { successResponse, errorResponse } = require('../utils/response')

// 获取用户列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, username, phone, status } = req.query

    // 模拟数据
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: (page - 1) * pageSize + i + 1,
      avatar: '',
      username: `user_${(page - 1) * pageSize + i + 1}`,
      nickname: `用户${(page - 1) * pageSize + i + 1}`,
      phone: `138****${String(1000 + i).slice(-4)}`,
      school: '示例大学',
      department: '计算机学院',
      verified: i % 3 === 0,
      status: i % 5 === 0 ? 'banned' : 'normal',
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 100 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取用户详情
exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params
    successResponse(res, {
      id,
      username: `user_${id}`,
      nickname: `用户${id}`,
      phone: '138****1234',
      school: '示例大学',
      department: '计算机学院',
      verified: true,
      status: 'normal',
      createdAt: '2024-01-01 12:00:00'
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 封禁用户
exports.ban = async (req, res) => {
  try {
    const { id } = req.params
    const { reason, duration } = req.body
    successResponse(res, null, '封禁成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 解封用户
exports.unban = async (req, res) => {
  try {
    const { id } = req.params
    successResponse(res, null, '解封成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取实名认证列表
exports.getVerifyList = async (req, res) => {
  try {
    const { page = 1, status = 'pending' } = req.query

    const list = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      username: `user_${i + 1}`,
      realName: `张${i + 1}`,
      idCard: '110***********1234',
      school: '示例大学',
      studentId: `2024${String(i + 1).padStart(4, '0')}`,
      images: [],
      status,
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 20 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 通过认证
exports.approveVerify = async (req, res) => {
  try {
    successResponse(res, null, '审核通过')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 拒绝认证
exports.rejectVerify = async (req, res) => {
  try {
    successResponse(res, null, '已拒绝')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
