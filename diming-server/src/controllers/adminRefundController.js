const { successResponse, errorResponse } = require('../utils/response')

// 获取退款列表
exports.getRefundList = async (req, res) => {
  try {
    const { page = 1, status = 'pending' } = req.query

    const list = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      orderNo: `ORD${Date.now()}${i}`,
      reason: '退款原因说明',
      applicant: `user_${i + 1}`,
      amount: (Math.random() * 50 + 10).toFixed(2),
      status,
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 15 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 通过退款
exports.approveRefund = async (req, res) => {
  try {
    successResponse(res, null, '退款已通过')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 拒绝退款
exports.rejectRefund = async (req, res) => {
  try {
    successResponse(res, null, '退款已拒绝')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
