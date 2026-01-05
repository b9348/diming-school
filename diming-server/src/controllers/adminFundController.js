const { successResponse, errorResponse } = require('../utils/response')

// 获取资金流水
exports.getFundFlow = async (req, res) => {
  try {
    const { page = 1, type } = req.query

    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      orderNo: `ORD${Date.now()}${i}`,
      type: ['income', 'expense', 'refund', 'withdraw'][i % 4],
      amount: (Math.random() * 100 + 10).toFixed(2),
      balance: (1000 + Math.random() * 500).toFixed(2),
      remark: '交易备注说明',
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 100 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}
