const { successResponse, errorResponse } = require('../utils/response')

// 生成闲置列表数据
const generateIdleList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    image: 'https://iph.href.lu/400x400?text=商品图片',
    title: ['刚买的书，现在用不上了，便宜出', '全新耳机，送朋友的没送出去', '二手自行车，骑了半年', '闲置台灯，搬寝室不需要了', '笔记本电脑包，全新未拆封'][i % 5],
    price: [50, 150, 200, 35, 80][i % 5],
    originalPrice: [99, 299, 500, 79, 159][i % 5],
    deliveryType: ['自提', '包邮', '自提/包邮'][i % 3],
    wantCount: Math.floor(Math.random() * 100) + 10,
    location: ['徐汇校区', '闵行校区', '海定校区', '杨浦校区'][i % 4],
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    time: '2天前',
    status: ['在售', '已售', '下架'][i % 3 === 0 ? 0 : (i % 3 === 1 ? 0 : 2)]
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
    title: '刚买的书，现在用不上了，便宜出',
    price: 50,
    originalPrice: 99,
    images: [
      'https://iph.href.lu/400x400?text=商品图1',
      'https://iph.href.lu/400x400?text=商品图2',
      'https://iph.href.lu/400x400?text=商品图3'
    ],
    content: '全新的书籍，买来一直没看过，现在不需要了，便宜出给有需要的同学。书本保存完好，无折痕无笔记。',
    deliveryType: '自提',
    location: '徐汇校区',
    wantCount: 97,
    viewCount: 328,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    time: '2天前',
    isFollowed: false,
    status: '在售',
    category: '书籍教材',
    condition: '全新',
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
  const { id, title, price, content, images, category, deliveryType } = req.body

  if (!title) {
    return errorResponse(res, '商品标题不能为空', 400)
  }

  if (!price) {
    return errorResponse(res, '请设置价格', 400)
  }

  if (id) {
    successResponse(res, { id }, '商品更新成功')
  } else {
    const newId = Date.now()
    successResponse(res, { id: newId }, '商品发布成功')
  }
}

// 想要商品
const want = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '已添加到想要列表')
}

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  want
}
