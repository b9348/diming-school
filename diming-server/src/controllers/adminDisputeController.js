const { successResponse, errorResponse } = require('../utils/response')

// 获取纠纷列表
exports.getDisputeList = async (req, res) => {
  try {
    const { page = 1, orderNo, applicant, respondent, status = 'pending', dateRange } = req.query
    // orderNo: 订单号, applicant: 申请人, respondent: 被申请人
    // dateRange: ['2024-01-01', '2024-12-31'] 用于按申请时间筛选

    const list = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      orderNo: `ORD${Date.now()}${i}`,
      reason: '交易纠纷原因说明',
      applicant: `user_${i + 1}`,
      respondent: `user_${i + 10}`,
      amount: (Math.random() * 100 + 10).toFixed(2),
      status,
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 20 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 处理纠纷
exports.handleDispute = async (req, res) => {
  try {
    successResponse(res, null, '处理成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
