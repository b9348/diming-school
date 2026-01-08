const { successResponse, errorResponse } = require('../utils/response')

// 跑腿公告数据配置
const ERRAND_NOTICE_CONFIG = {
  '新任务': {
    noticeInfo: {
      id: 1,
      type: 'notice',
      content: '跑腿服务全新升级，支持更多任务类型，快来体验吧',
      url: '/pages/notice/detail?id=1'
    },
    activityInfo: {
      id: 2,
      type: 'activity',
      content: '新用户首单免跑腿费，快来发布你的第一个任务',
      url: '/pages/activity/detail?id=2'
    },
    recommendInfo: {
      id: 3,
      type: 'recommend',
      tag: '推荐',
      content: '热门任务：代取快递、代买东西、代送物品，收益多多',
      url: '/pages/recommend/detail?id=3'
    }
  },
  '我发布的': {
    noticeInfo: {
      id: 4,
      type: 'notice',
      content: '任务发布后，接单者会尽快联系您，请注意查收消息',
      url: '/pages/notice/detail?id=4'
    },
    activityInfo: null,
    recommendInfo: null
  },
  '我抢的': {
    noticeInfo: {
      id: 5,
      type: 'notice',
      content: '抢到任务后请尽快联系发布者，提高接单率可以获得更多任务',
      url: '/pages/notice/detail?id=5'
    },
    activityInfo: null,
    recommendInfo: null
  },
  '已被抢': {
    noticeInfo: {
      id: 6,
      type: 'notice',
      content: '任务已被抢，接单者正在为您服务中',
      url: '/pages/notice/detail?id=6'
    },
    activityInfo: null,
    recommendInfo: null
  },
  '被接单的': {
    noticeInfo: {
      id: 7,
      type: 'notice',
      content: '订单完成后请及时确认，评价接单者可以获得积分奖励',
      url: '/pages/notice/detail?id=7'
    },
    activityInfo: null,
    recommendInfo: null
  }
}

// 获取跑腿数据
const getData = (req, res) => {
  const { tab } = req.query
  const config = ERRAND_NOTICE_CONFIG[tab] || ERRAND_NOTICE_CONFIG['新任务']

  const data = {
    bannerList: [
      { id: 1, image: 'https://iph.href.lu/750x300?text=跑腿轮播图1', url: '' },
      { id: 2, image: 'https://iph.href.lu/750x300?text=跑腿轮播图2', url: '' }
    ],
    noticeInfo: config.noticeInfo,
    activityInfo: config.activityInfo,
    recommendInfo: config.recommendInfo
  }

  successResponse(res, data)
}

// 生成跑腿列表数据
const generateErrandList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    content: '找一位同学帮忙取快递，快递在菜鸟驿站，需要送到南区西苑八号楼909室，谢谢！',
    images: i % 2 === 0 ? ['https://iph.href.lu/400x300?text=图片1'] : [],
    timeType: ['hours', 'deadline'][i % 2],
    hours: '24',
    deadline: '2025-03-01',
    contactTypes: ['phone', 'wechat', 'qq'].slice(0, (i % 3) + 1),
    contactValue: '138****8888',
    visibilityType: ['campus', 'school'][i % 2],
    visibilityValue: ['all', 'dishui', 'east', 'province'][i % 4],
    location: ['闵行校区', '徐汇校区', '海定校区', '杨浦校区'][i % 4],
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    time: '2-23 18:24',
    status: ['待接单', '进行中', '已完成'][i % 3],
    price: [10, 20, 30, 40, 50][i % 5]
  }))
}

// 获取跑腿列表
const getList = (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    status = '',
    timeType = '',
    visibilityType = '',
    sort = 'default',
    timeRange = ''
  } = req.query

  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  let list = generateErrandList(pageNum, size)

  // 根据状态筛选
  if (status) {
    const statusMap = {
      'pending': '待接单',
      'ongoing': '进行中',
      'completed': '已完成'
    }
    if (statusMap[status]) {
      list = list.filter(item => item.status === statusMap[status])
    }
  }

  // 根据时间类型筛选
  if (timeType) {
    list = list.filter(item => item.timeType === timeType)
  }

  // 根据可见范围类型筛选
  if (visibilityType) {
    list = list.filter(item => item.visibilityType === visibilityType)
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
    content: '找一位女生打印资料送到南区，资料比较重要，请小心保管，谢谢！',
    images: ['https://iph.href.lu/400x300?text=示例图片'],
    hiddenInfo: '取件码：1234，在菜鸟驿站3号柜',
    hiddenImages: [],
    timeType: 'hours',
    hours: '24',
    deadline: '',
    contactTypes: ['phone'],
    contactValue: '138****8888',
    visibilityType: 'campus',
    visibilityValue: 'all',
    status: '待接单',
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    time: '2-23 18:24',
    isFollowed: false,
    price: 25,
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
  const {
    id,
    content,
    images,
    hiddenInfo,
    hiddenImages,
    timeType,
    hours,
    deadline,
    contactTypes,
    contactValue,
    visibilityType,
    visibilityValue
  } = req.body

  if (!content) {
    return errorResponse(res, '请填写任务描述', 400)
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
  getData,
  getList,
  getDetail,
  saveOrUpdate,
  accept,
  complete
}
