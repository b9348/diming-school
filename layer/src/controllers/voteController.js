const { successResponse, errorResponse } = require('../utils/response')

// 生成投票列表数据
const generateVoteList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return [
    // 文字投票示例
    {
      id: startId + 1,
      voteType: 'text',
      title: '今天不知道吃什么大家的急啊急啊按时间多久啊就撤旦大神，大家帮我选一个吧',
      deadline: '9天19小时4分结束',
      forumName: '海定校区',
      images: [],
      options: [
        { id: 1, text: '西瓜', count: 566, percent: 60.56 },
        { id: 2, text: '萝卜', count: 300, percent: 32.12 },
        { id: 3, text: '西红柿', count: 50, percent: 5.35 },
        { id: 4, text: '苹果', count: 19, percent: 2.03 }
      ],
      totalVotes: 935,
      viewCount: 888,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '张三',
      time: '5天前'
    },
    // 图片投票示例1
    {
      id: startId + 2,
      voteType: 'image',
      title: '今天不知道吃什么大家的急啊急啊按时间多久啊就撤旦大神，大家帮我选一个吧',
      deadline: '9天19小时4分结束',
      forumName: '海定校区',
      images: [],
      options: [
        { id: 1, text: '图片1，点击图片即可参与投票', image: 'https://iph.href.lu/300x300?text=图片1', count: 9000, percent: 80.79 },
        { id: 2, text: '图片2', image: 'https://iph.href.lu/300x300?text=图片2', count: 2000, percent: 17.96 },
        { id: 3, text: '图片3', image: 'https://iph.href.lu/300x300?text=图片3', count: 120, percent: 1.08 },
        { id: 4, text: '图片4', image: 'https://iph.href.lu/300x300?text=图片4', count: 20, percent: 0.18 }
      ],
      totalVotes: 11140,
      viewCount: 1200,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '张三',
      time: '5天前',
      optionDesc: '无条件支持黑米摩尔对封侯都会对的'
    },
    // 文字投票示例2
    {
      id: startId + 3,
      voteType: 'text',
      title: '周末去哪里玩比较好？求推荐一个地方',
      deadline: '2天10小时结束',
      forumName: '朝阳校区',
      images: [],
      options: [
        { id: 1, text: '颐和园', count: 320, percent: 45.07 },
        { id: 2, text: '故宫', count: 250, percent: 35.21 },
        { id: 3, text: '长城', count: 100, percent: 14.08 },
        { id: 4, text: '天坛', count: 40, percent: 5.63 }
      ],
      totalVotes: 710,
      viewCount: 650,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '李四',
      time: '3天前'
    },
    // 图片投票示例2
    {
      id: startId + 4,
      voteType: 'image',
      title: '哪个配色方案更好看？帮忙选一下',
      deadline: '5天8小时结束',
      forumName: '西城校区',
      images: [],
      options: [
        { id: 1, text: '蓝色系', image: 'https://iph.href.lu/300x300?text=蓝色', count: 1200, percent: 55.56 },
        { id: 2, text: '红色系', image: 'https://iph.href.lu/300x300?text=红色', count: 800, percent: 37.04 },
        { id: 3, text: '绿色系', image: 'https://iph.href.lu/300x300?text=绿色', count: 100, percent: 4.63 },
        { id: 4, text: '黄色系', image: 'https://iph.href.lu/300x300?text=黄色', count: 60, percent: 2.78 }
      ],
      totalVotes: 2160,
      viewCount: 1500,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '王五',
      time: '1天前'
    }
  ]
}

// 获取投票列表
const getList = (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    sort = 'latest',
    status = '',
    remainTime_min = '',
    remainTime_max = '',
    voteType = '',
    timeRange = ''
  } = req.query
  const pageNum = parseInt(page)

  const total = 6
  const maxPage = Math.ceil(total / 2)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  let list = generateVoteList(pageNum, parseInt(pageSize))

  // 根据排序方式排序
  switch (sort) {
    case 'hot':
      list.sort((a, b) => b.totalVotes - a.totalVotes)
      break
    case 'most_comments':
      list.sort((a, b) => b.totalVotes - a.totalVotes)
      break
    case 'most_likes':
      list.sort((a, b) => b.totalVotes - a.totalVotes)
      break
    case 'most_participants':
      list.sort((a, b) => b.totalVotes - a.totalVotes)
      break
    case 'most_votes':
      list.sort((a, b) => b.totalVotes - a.totalVotes)
      break
  }

  // 根据状态筛选（模拟）
  // status: ongoing, pending, ended

  // 根据剩余时间筛选（模拟）
  // remainTime_min, remainTime_max

  // 根据投票类型筛选（模拟）
  // voteType: text, image_text

  // 根据发布时间筛选（模拟）
  // timeRange: 1d, 3d, 1w, 15d, 1m, 3m, 6m

  successResponse(res, { list, total })
}

// 获取投票详情
const getDetail = (req, res) => {
  const { id } = req.params
  const voteId = parseInt(id)

  // 生成所有投票数据
  const allVotes = [
    ...generateVoteList(1, 10),
    ...generateVoteList(2, 10)
  ]

  // 查找对应的投票
  const vote = allVotes.find(v => v.id === voteId)

  if (!vote) {
    return errorResponse(res, '投票不存在', 404)
  }

  // 构建详情数据
  const detail = {
    ...vote,
    images: vote.voteType === 'image' ? [
      'https://iph.href.lu/600x400?text=投票图片1',
      'https://iph.href.lu/600x400?text=投票图片2',
      'https://iph.href.lu/600x400?text=投票图片3'
    ] : [],
    options: vote.options.map(opt => ({
      ...opt,
      voted: false
    })),
    isFollowed: false,
    hasVoted: false,
    votedOptionId: null,
    userInfo: {
      id: 'vote_user_' + voteId,
      nickname: vote.nickname,
      isBanned: false,
      title: '',
      isAdmin: false
    }
  }

  successResponse(res, detail)
}

// 创建或更新投票
const saveOrUpdate = (req, res) => {
  const { id, title, images, options, deadline, type, hiddenImages, startTime, visibilityType, visibilityValue } = req.body

  if (!title) {
    return errorResponse(res, '投票标题不能为空', 400)
  }

  if (!options || options.length < 2) {
    return errorResponse(res, '至少需要2个选项', 400)
  }

  // 验证图片数量
  if (images && images.length > 9) {
    return errorResponse(res, '投票图片最多9张', 400)
  }

  if (hiddenImages && hiddenImages.length > 9) {
    return errorResponse(res, '隐藏图片最多9张', 400)
  }

  if (id) {
    successResponse(res, { id }, '投票更新成功')
  } else {
    const newId = Date.now()
    successResponse(res, { id: newId }, '投票创建成功')
  }
}

// 提交投票
const submit = (req, res) => {
  const { id, optionId } = req.body

  if (!id || !optionId) {
    return errorResponse(res, '参数不完整', 400)
  }

  successResponse(res, null, '投票成功')
}

// 评论投票
const comment = (req, res) => {
  const { id } = req.params
  const { content } = req.body

  if (!content) {
    return errorResponse(res, '评论内容不能为空', 400)
  }

  successResponse(res, null, '评论成功')
}

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  submit,
  comment
}
