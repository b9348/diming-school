const { successResponse, errorResponse } = require('../utils/response')

// 获取订单列表
exports.getOrderList = async (req, res) => {
  try {
    const { page = 1, orderNo, type, status } = req.query

    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      orderNo: `ORD${Date.now()}${i}`,
      type: ['errand', 'idle', 'help'][i % 3],
      title: `订单商品/服务 ${i + 1}`,
      buyer: `buyer_${i + 1}`,
      seller: `seller_${i + 1}`,
      amount: (Math.random() * 100 + 10).toFixed(2),
      status: ['pending', 'processing', 'completed', 'cancelled'][i % 4],
      createdAt: '2024-01-01 12:00:00'
    }))

    successResponse(res, { list, total: 100 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取订单详情
exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params
    successResponse(res, {
      id,
      orderNo: `ORD${Date.now()}`,
      type: 'errand',
      title: '订单详情',
      buyer: 'buyer_1',
      seller: 'seller_1',
      amount: '50.00',
      status: 'completed',
      createdAt: '2024-01-01 12:00:00'
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}
