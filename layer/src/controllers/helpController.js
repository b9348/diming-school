const { successResponse, errorResponse } = require('../utils/response')

// 生成互助拍卖列表数据
const generateHelpList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    countdown: ['24:20:09', '12:30:45', '06:15:22', '48:00:00', '02:45:30'][i % 5],
    currentPrice: [235, 150, 500, 80, 320][i % 5],
    startPrice: [100, 50, 200, 30, 150][i % 5],
    content: '拍卖一支笔，非常昂贵，限量版，全新未拆封，机会难得！',
    images: ['https://iph.href.lu/400x300?text=图片1', 'https://iph.href.lu/400x300?text=图片2'],
    deliveryTime: ['24小时内发货', '3-28前发货', '拍后即发', '一周内发货'][i % 4],
    location: ['海定校区', '闵行校区', '徐汇校区', '杨浦校区'][i % 4],
    bidIncrement: [2, 5, 10, 1, 20][i % 5],
    bidCount: Math.floor(Math.random() * 20) + 5,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    status: ['进行中', '已结束', '待开始'][i % 3 === 0 ? 0 : (i % 3 === 1 ? 0 : 2)]
  }))
}

// 获取互助拍卖列表
const getList = (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    price_min = '',
    price_max = '',
    status = '',
    remainTime_min = '',
    remainTime_max = '',
    sort = 'default',
    timeRange = ''
  } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 30
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  let list = generateHelpList(pageNum, size)

  // 根据价格范围筛选
  if (price_min) {
    list = list.filter(item => item.currentPrice >= parseInt(price_min))
  }
  if (price_max) {
    list = list.filter(item => item.currentPrice <= parseInt(price_max))
  }

  // 根据状态筛选
  if (status) {
    const statusMap = { 'ongoing': '进行中', 'ended': '已结束' }
    if (statusMap[status]) {
      list = list.filter(item => item.status === statusMap[status])
    }
  }

  // 根据剩余时间筛选（模拟）
  // remainTime_min, remainTime_max

  // 根据排序方式排序
  switch (sort) {
    case 'price_asc':
      list.sort((a, b) => a.currentPrice - b.currentPrice)
      break
    case 'price_desc':
      list.sort((a, b) => b.currentPrice - a.currentPrice)
      break
    case 'default':
    default:
      // 综合排序，保持原顺序
      break
  }

  // 根据发布时间筛选（模拟）
  // timeRange: 1d, 3d, 1w, 15d, 1m, 3m, 6m

  successResponse(res, { list, total })
}

// 获取互助拍卖详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    countdown: '24:20:09',
    endTime: '2024-03-28 18:00:00',
    currentPrice: 235,
    startPrice: 100,
    bidIncrement: 2,
    bidCount: 15,
    title: '限量版钢笔',
    content: '拍卖一支笔，非常昂贵，限量版，全新未拆封，机会难得！这是一支来自德国的限量版钢笔，全球仅发行1000支，编号888。',
    images: [
      'https://iph.href.lu/400x300?text=图片1',
      'https://iph.href.lu/400x300?text=图片2',
      'https://iph.href.lu/400x300?text=图片3'
    ],
    deliveryTime: '24小时内发货',
    deliveryType: '包邮',
    location: '海定校区',
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    status: '进行中',
    isFollowed: false,
    // 出价记录
    bidHistory: Array(5).fill(null).map((_, i) => ({
      id: 'bid_' + i,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '出价者' + (i + 1),
      price: 235 - i * 10,
      time: (i + 1) + '分钟前'
    })),
    userInfo: {
      id: 'help_user_1',
      nickname: '张三',
      isBanned: false,
      title: '',
      isAdmin: false
    }
  }

  successResponse(res, detail)
}

// 创建或更新互助拍卖
const saveOrUpdate = (req, res) => {
  const { id, title, content, images, startPrice, bidIncrement, endTime, deliveryTime } = req.body

  if (!content) {
    return errorResponse(res, '请填写拍品描述', 400)
  }

  if (!startPrice) {
    return errorResponse(res, '请设置起拍价', 400)
  }

  if (id) {
    successResponse(res, { id }, '拍卖信息更新成功')
  } else {
    const newId = Date.now()
    successResponse(res, { id: newId }, '拍卖发布成功')
  }
}

// 出价
const bid = (req, res) => {
  const { id, price } = req.body

  if (!id || !price) {
    return errorResponse(res, '参数不完整', 400)
  }

  successResponse(res, {
    newPrice: price,
    bidCount: 16
  }, '出价成功')
}

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  bid
}
