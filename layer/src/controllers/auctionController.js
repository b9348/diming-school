const { successResponse, errorResponse } = require('../utils/response')

// 获取拍卖列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, keyword, type } = req.query
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `拍卖商品 ${i + 1}`,
      content: `这是拍卖商品${i + 1}的描述`,
      images: [`https://picsum.photos/200/200?random=${i}`],
      publisher: `user_${i + 1}`,
      publisherAvatar: `https://picsum.photos/50/50?random=${i}`,
      startPrice: (Math.random() * 100 + 10).toFixed(2),
      currentPrice: (Math.random() * 200 + 50).toFixed(2),
      bidIncrement: (Math.random() * 10 + 1).toFixed(2),
      bidCount: Math.floor(Math.random() * 20),
      biddingPeriod: 60,
      delayPeriod: 5,
      freeShipping: i % 2 === 0,
      status: ['pending', 'bidding', 'completed', 'failed'][i % 4],
      endTime: new Date(Date.now() + 3600000 * (i + 1)).toISOString(),
      createdAt: '2024-01-01 12:00:00'
    }))
    successResponse(res, { list, total: 100 })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取拍卖详情
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
      publisherAvatar: 'https://picsum.photos/50/50?random=1',
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
      contactValue: '138****8888',
      anonymous: false,
      status: 'bidding',
      endTime: new Date(Date.now() + 3600000).toISOString(),
      createdAt: '2024-01-01 12:00:00'
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 创建/更新拍卖
exports.saveOrUpdate = async (req, res) => {
  try {
    const data = req.body
    successResponse(res, { id: data.id || Date.now() }, data.id ? '更新成功' : '发布成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 出价
exports.bid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body
    successResponse(res, { auctionId, amount, bidTime: new Date().toISOString() }, '出价成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取出价记录
exports.getBidList = async (req, res) => {
  try {
    const { id } = req.params
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      bidder: `user_${i + 1}`,
      bidderAvatar: `https://picsum.photos/50/50?random=${i}`,
      amount: (100 + i * 5).toFixed(2),
      createdAt: new Date(Date.now() - i * 60000).toISOString()
    }))
    successResponse(res, list)
  } catch (error) {
    errorResponse(res, error.message)
  }
}
