const { successResponse, errorResponse } = require('../utils/response')

// 生成跑腿列表数据
const generateErrandList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    price: [350, 200, 150, 500, 280][i % 5],
    deadline: ['24小时内完成', '2-30 18:20前完成', '今天下午6点前', '明天中午前', '本周五前'][i % 5],
    content: '找一位同学帮忙取快递，快递在菜鸟驿站，需要送到南区西苑八号楼909室，谢谢！',
    images: i % 2 === 0 ? ['https://iph.href.lu/400x300?text=图片1'] : [],
    location: ['闵行校区', '徐汇校区', '海定校区', '杨浦校区'][i % 4],
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    time: '2-23 18:24',
    status: ['待接单', '进行中', '已完成'][i % 3],
    type: ['代取快递', '代买东西', '代打印', '代排队', '其他'][i % 5]
  }))
}

// 获取跑腿列表
const getList = (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    tab = '全部',
    type,        // 任务类型: express/buy/print/queue/other
    priceRange,  // 价格范围: 0-5/5-10/10-20/20+
    timeLimit,   // 时间要求: 1h/today/tomorrow
    sort         // 排序方式: price_desc/price_asc/time_desc
  } = req.query

  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  // 生成基础列表
  let list = generateErrandList(pageNum, size)

  // 根据任务类型筛选
  if (type) {
    const typeMap = {
      'express': '代取快递',
      'buy': '代买东西',
      'print': '代打印',
      'queue': '代排队',
      'other': '其他'
    }
    list = list.filter(item => item.type === typeMap[type])
  }

  // 根据价格范围筛选
  if (priceRange) {
    list = list.filter(item => {
      const price = item.price
      switch (priceRange) {
        case '0-5': return price <= 5
        case '5-10': return price > 5 && price <= 10
        case '10-20': return price > 10 && price <= 20
        case '20+': return price > 20
        default: return true
      }
    })
  }

  // 根据排序方式排序
  if (sort) {
    switch (sort) {
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'time_desc':
        // 按时间倒序（最新发布）
        list.sort((a, b) => b.id - a.id)
        break
    }
  }

  const total = 30
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  successResponse(res, { list, total })
}

// 获取跑腿详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    price: 350,
    status: '待接单',
    type: '代取快递',
    deadline: '24小时内完成',
    pickupLocation: '菜鸟驿站',
    deliveryLocation: '南区西苑八号楼909室',
    content: '找一位女生打印资料送到南区，资料比较重要，请小心保管，谢谢！',
    images: ['https://iph.href.lu/400x300?text=示例图片'],
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    time: '2-23 18:24',
    phone: '138****8888',
    isFollowed: false,
    userInfo: {
      id: 'errand_user_1',
      nickname: '张三',
      isBanned: false,
      title: '',
      isAdmin: false
    }
  }

  successResponse(res, detail)
}

// 创建或更新跑腿任务
const saveOrUpdate = (req, res) => {
  const { id, content, price, deadline, type, pickupLocation, deliveryLocation } = req.body

  if (!content) {
    return errorResponse(res, '任务描述不能为空', 400)
  }

  if (!price) {
    return errorResponse(res, '请设置价格', 400)
  }

  if (id) {
    successResponse(res, { id }, '任务更新成功')
  } else {
    const newId = Date.now()
    successResponse(res, { id: newId }, '任务发布成功')
  }
}

// 接单
const accept = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '接单成功')
}

// 完成订单
const complete = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '订单已完成')
}

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  accept,
  complete
}
