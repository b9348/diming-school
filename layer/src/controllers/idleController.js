const { successResponse, errorResponse } = require('../utils/response')

// 生成闲置列表数据
const generateIdleList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  // 配送类型映射: 0-不包邮, 1-包邮, 2-自提
  const deliveryTypes = ['不包邮', '包邮', '自提']
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    image: 'https://iph.href.lu/400x400?text=商品图片',
    title: ['刚买的书，现在用不上了，便宜出', '全新耳机，送朋友的没送出去', '二手自行车，骑了半年', '闲置台灯，搬寝室不需要了', '笔记本电脑包，全新未拆封'][i % 5],
    content: ['全新的书籍，买来一直没看过', '正品苹果耳机，未拆封', '代步神器，性能良好', '9成新台灯，光线柔和', '商务风格，适合笔记本'][i % 5],
    price: [50, 150, 200, 35, 80][i % 5],
    originalPrice: [99, 299, 500, 79, 159][i % 5],
    freeShipping: i % 3 !== 0,  // 约2/3包邮
    deliveryType: deliveryTypes[i % 3],  // 循环返回 [不包邮, 包邮, 自提]
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
  const {
    page = 1,
    pageSize = 10,
    price_min = '',
    price_max = '',
    delivery = '',
    shipTime = '',
    sort = 'default',
    timeRange = ''
  } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 36
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  let list = generateIdleList(pageNum, size)

  // 根据价格范围筛选
  if (price_min) {
    list = list.filter(item => item.price >= parseInt(price_min))
  }
  if (price_max) {
    list = list.filter(item => item.price <= parseInt(price_max))
  }

  // 根据配送方式筛选（模拟）
  // delivery: free_shipping, pickup

  // 根据发货时间筛选（模拟）
  // shipTime: hours, date

  // 根据排序方式排序
  switch (sort) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
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

// 获取闲置详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    content: '出售我心爱的鞋子，它长这样。今天天气晴朗，我今天的心，此为测试文本的内容，显示帖子内容的前两百字',
    images: Array(12).fill(null).map((_, i) => `https://iph.href.lu/400x400?text=图片${i + 1}`),
    hiddenInfo: '取货地点：图书馆一楼大厅，联系我获取取货码',
    hiddenImages: [],
    price: 1000,
    freeShipping: false,
    deliveryType: '自提',
    deliveryHours: 24,
    deliveryDeadline: null,
    contact: '微信号：zhangsan123',
    contactType: 'wechat',
    contactValue: 'zhangsan123',
    visibilityType: 'campus',
    visibilityValue: 'current',
    location: '徐汇校区',
    wantCount: 56,
    viewCount: 328,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    time: '2天前',
    isFollowed: false,
    isCollected: false,
    status: '在售',
    isTop: false,
    topHours: 0,
    topExpireTime: null,
    commentCount: 78,
    comments: [
      {
        id: 'c1',
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '张三',
        title: '头衔',
        time: '4分钟前',
        content: '你这个图配得很好看的，我很喜欢你发的图片。',
        likeCount: 467,
        isPinned: true,
        replies: [
          {
            id: 'r1',
            avatar: 'https://iph.href.lu/100x100?text=头像',
            nickname: '李四',
            time: '2天前',
            content: '你说的很对！',
            likeCount: 467,
            isAuthor: true
          }
        ]
      },
      {
        id: 'c2',
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '王五',
        time: '1小时前',
        content: '这个价格可以小刀吗？',
        likeCount: 23,
        isPinned: false,
        replies: []
      },
      {
        id: 'c3',
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '赵六',
        title: '活跃用户',
        time: '3小时前',
        content: '鞋子是什么码数的？',
        likeCount: 15,
        isPinned: false,
        replies: []
      }
    ],
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
