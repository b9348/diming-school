const { successResponse, errorResponse } = require('../utils/response')

// 获取拍卖列表（后台管理）
exports.getList = async (req, res) => {
  try {
    const { page = 1, keyword, publisher, status, dateRange } = req.query
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: (page - 1) * 10 + i + 1,
      title: `拍卖商品 ${(page - 1) * 10 + i + 1}`,
      content: `这是拍卖商品的描述内容`,
      images: [`https://picsum.photos/200/200?random=${i}`],
      publisher: `user_${i + 1}`,
      startPrice: (Math.random() * 100 + 10).toFixed(2),
      currentPrice: (Math.random() * 200 + 50).toFixed(2),
      bidIncrement: (Math.random() * 10 + 1).toFixed(2),
      bidCount: Math.floor(Math.random() * 20),
      biddingPeriod: 60,
      delayPeriod: 5,
      freeShipping: i % 2 === 0,
      anonymous: i % 3 === 0,
      status: ['pending', 'bidding', 'completed', 'failed', 'cancelled'][i % 5],
      createdAt: '2024-01-01 12:00:00'
    }))
    successResponse(res, { list, total: 100 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取拍卖详情（后台管理）
exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params
    successResponse(res, {
      id,
      title: `拍卖商品 ${id}`,
      content: '这是一个拍卖商品的详细描述，包含品牌、型号、入手渠道等信息。',
      images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=2'],
      hiddenInfo: '隐藏信息：取货地点在xxx',
      hiddenImages: [],
      publisher: 'user_1',
      publisherId: 1,
      startPrice: '50.00',
      currentPrice: '120.00',
      bidIncrement: '5.00',
      bidCount: 14,
      biddingPeriod: 60,
      delayPeriod: 5,
      freeShipping: true,
      deliveryType: 'hours',
      deliveryHours: 24,
      contactType: 'phone',
      contactValue: '13888888888',
      visibilityType: 'campus',
      visibilityValue: 'current',
      anonymous: false,
      topHours: 0,
      status: 'bidding',
      winner: null,
      winnerPrice: null,
      endTime: new Date(Date.now() + 3600000).toISOString(),
      createdAt: '2024-01-01 12:00:00',
      updatedAt: '2024-01-01 12:00:00'
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存/更新拍卖（后台管理）
exports.saveOrUpdate = async (req, res) => {
  try {
    const data = req.body
    successResponse(res, { id: data.id || Date.now() }, data.id ? '更新成功' : '创建成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 删除拍卖（后台管理）
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    successResponse(res, { id }, '删除成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取出价记录（后台管理）
exports.getBidList = async (req, res) => {
  try {
    const { id } = req.params
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      auctionId: id,
      bidder: `user_${i + 1}`,
      bidderId: i + 1,
      amount: (100 + i * 5).toFixed(2),
      createdAt: new Date(Date.now() - i * 60000).toLocaleString()
    }))
    successResponse(res, list)
  } catch (error) {
    errorResponse(res, error.message)
  }
}
