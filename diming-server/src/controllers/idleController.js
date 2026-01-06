const { successResponse, errorResponse } = require('../utils/response')

// 生成闲置列表数据
const generateIdleList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    image: 'https://iph.href.lu/400x400?text=商品图片',
    title: ['刚买的书，现在用不上了，便宜出', '全新耳机，送朋友的没送出去', '二手自行车，骑了半年', '闲置台灯，搬寝室不需要了', '笔记本电脑包，全新未拆封'][i % 5],
    content: ['全新的书籍，买来一直没看过', '正品苹果耳机，未拆封', '代步神器，性能良好', '9成新台灯，光线柔和', '商务风格，适合笔记本'][i % 5],
    price: [50, 150, 200, 35, 80][i % 5],
    originalPrice: [99, 299, 500, 79, 159][i % 5],
    freeShipping: i % 2 === 0,
    deliveryType: 'hours',
    deliveryHours: [24, 48, 12, 24, 72][i % 5],
    wantCount: Math.floor(Math.random() * 100) + 10,
    location: ['徐汇校区', '闵行校区', '海定校区', '杨浦校区'][i % 4],
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    time: '2天前',
    status: ['在售', '已售', '下架'][i % 3 === 0 ? 0 : (i % 3 === 1 ? 0 : 2)],
    isTop: i % 4 === 0,
    topHours: i % 4 === 0 ? [1, 2, 4, 6][i % 4] : 0
  }))
}

// 获取闲置列表
const getList = (req, res) => {
  const { page = 1, pageSize = 10, category = '全部' } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 36
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  const list = generateIdleList(pageNum, size)
  successResponse(res, { list, total })
}

// 获取闲置详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    content: '全新的书籍，买来一直没看过，现在不需要了，便宜出给有需要的同学。书本保存完好，无折痕无笔记。',
    images: [
      'https://iph.href.lu/400x400?text=商品图1',
      'https://iph.href.lu/400x400?text=商品图2',
      'https://iph.href.lu/400x400?text=商品图3'
    ],
    hiddenInfo: '取货地点：图书馆一楼大厅，联系我获取取货码',
    hiddenImages: [],
    price: 50,
    freeShipping: true,
    deliveryType: 'hours',
    deliveryHours: 24,
    deliveryDeadline: null,
    contactType: 'phone',
    contactValue: '138****8888',
    visibilityType: 'campus',
    visibilityValue: 'current',
    location: '徐汇校区',
    wantCount: 97,
    viewCount: 328,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    time: '2天前',
    isFollowed: false,
    status: '在售',
    isTop: false,
    topHours: 0,
    topExpireTime: null,
    userInfo: {
      id: 'idle_user_1',
      nickname: '张三',
      isBanned: false,
      title: '',
      isAdmin: false
    }
  }

  successResponse(res, detail)
}

// 创建或更新闲置商品
const saveOrUpdate = (req, res) => {
  const {
    id,
    content,
    images,
    hiddenInfo,
    hiddenImages,
    price,
    freeShipping,
    deliveryType,
    deliveryHours,
    deliveryDeadline,
    contactType,
    contactValue,
    visibilityType,
    visibilityValue,
    topHours
  } = req.body

  // 验证必填字段
  if (!content || !content.trim()) {
    return errorResponse(res, '请描述要售卖的闲置', 400)
  }

  if (!images || images.length === 0) {
    return errorResponse(res, '请上传商品图片', 400)
  }

  if (!price || price <= 0) {
    return errorResponse(res, '请设置有效价格', 400)
  }

  if (!contactValue || !contactValue.trim()) {
    return errorResponse(res, '请填写联系方式', 400)
  }

  // 验证发货时间
  if (deliveryType === 'hours' && deliveryHours !== null && deliveryHours < 0) {
    return errorResponse(res, '发货时间不能为负数', 400)
  }

  // 计算置顶费用
  const topPriceMap = {
    1: 8.8,
    2: 18.8,
    4: 28.8,
    6: 38.8,
    8: 48.8,
    12: 58.8
  }
  const topPrice = topHours ? (topPriceMap[topHours] || 0) : 0

  if (id) {
    successResponse(res, {
      id,
      topPrice,
      message: topHours ? `商品已更新，置顶${topHours}小时，需支付¥${topPrice}` : '商品更新成功'
    }, '商品更新成功')
  } else {
    const newId = Date.now()
    successResponse(res, {
      id: newId,
      topPrice,
      message: topHours ? `商品已发布，置顶${topHours}小时，需支付¥${topPrice}` : '商品发布成功'
    }, '商品发布成功')
  }
}

// 想要商品
const want = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '已添加到想要列表')
}

// 置顶商品
const setTop = (req, res) => {
  const { id } = req.params
  const { hours } = req.body

  const topPriceMap = {
    1: 8.8,
    2: 18.8,
    4: 28.8,
    6: 38.8,
    8: 48.8,
    12: 58.8
  }

  if (!hours || !topPriceMap[hours]) {
    return errorResponse(res, '请选择有效的置顶时长', 400)
  }

  const price = topPriceMap[hours]
  const expireTime = new Date(Date.now() + hours * 60 * 60 * 1000)

  successResponse(res, {
    id: parseInt(id),
    topHours: hours,
    topPrice: price,
    topExpireTime: expireTime.toISOString()
  }, `置顶${hours}小时成功，消费¥${price}`)
}

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  want,
  setTop
}
