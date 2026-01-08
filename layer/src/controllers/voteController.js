const { successResponse, errorResponse } = require('../utils/response')

// 生成投票列表数据
const generateVoteList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return [
    {
      id: startId + 1,
      type: 'image',
      title: '今天不知道吃什么，大家帮我选一个吧',
      deadline: '9天19小时4分结束',
      images: [
        'https://iph.href.lu/600x400?text=投票图片1',
        'https://iph.href.lu/600x400?text=投票图片2'
      ],
      options: [
        { id: 1, text: '西瓜', image: 'https://iph.href.lu/200x200?text=西瓜', count: 566, percent: 35.42 },
        { id: 2, text: '萝卜', image: 'https://iph.href.lu/200x200?text=萝卜', count: 320, percent: 20.03 },
        { id: 3, text: '西红柿', image: 'https://iph.href.lu/200x200?text=西红柿', count: 280, percent: 17.53 },
        { id: 4, text: '苹果', image: 'https://iph.href.lu/200x200?text=苹果', count: 200, percent: 12.52 },
        { id: 5, text: '香蕉', image: 'https://iph.href.lu/200x200?text=香蕉', count: 150, percent: 9.39 },
        { id: 6, text: '橙子', image: 'https://iph.href.lu/200x200?text=橙子', count: 82, percent: 5.13 }
      ],
      totalVotes: 1598,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '张三',
      time: '5天前'
    },
    {
      id: startId + 2,
      type: 'image',
      title: '哪个头像更好看？',
      deadline: '3天12小时结束',
      images: [
        'https://iph.href.lu/600x400?text=投票主图'
      ],
      options: [
        { id: 1, text: '选项A', image: 'https://iph.href.lu/300x300?text=选项1', count: 9000, percent: 80.79 },
        { id: 2, text: '选项B', image: 'https://iph.href.lu/300x300?text=选项2', count: 1100, percent: 9.88 },
        { id: 3, text: '选项C', image: 'https://iph.href.lu/300x300?text=选项3', count: 750, percent: 6.73 },
        { id: 4, text: '选项D', image: 'https://iph.href.lu/300x300?text=选项4', count: 290, percent: 2.6 }
      ],
      totalVotes: 11140,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '李四',
      time: '2天前'
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

  const detail = {
    id: parseInt(id),
    type: 'image',
    title: '今天不知道吃什么，大家帮我选一个吧',
    deadline: '9天19小时4分结束',
    images: [
      'https://iph.href.lu/600x400?text=投票图片1',
      'https://iph.href.lu/600x400?text=投票图片2',
      'https://iph.href.lu/600x400?text=投票图片3',
      'https://iph.href.lu/600x400?text=投票图片4',
      'https://iph.href.lu/600x400?text=投票图片5',
      'https://iph.href.lu/600x400?text=投票图片6'
    ],
    options: [
      { id: 1, text: '西瓜', image: 'https://iph.href.lu/200x200?text=西瓜', count: 566, percent: 35, voted: false },
      { id: 2, text: '萝卜', image: 'https://iph.href.lu/200x200?text=萝卜', count: 320, percent: 20, voted: false },
      { id: 3, text: '西红柿', image: 'https://iph.href.lu/200x200?text=西红柿', count: 280, percent: 18, voted: false },
      { id: 4, text: '苹果', image: 'https://iph.href.lu/200x200?text=苹果', count: 200, percent: 13, voted: false },
      { id: 5, text: '香蕉', image: 'https://iph.href.lu/200x200?text=香蕉', count: 150, percent: 9, voted: false },
      { id: 6, text: '橙子', image: 'https://iph.href.lu/200x200?text=橙子', count: 82, percent: 5, voted: false }
    ],
    totalVotes: 1598,
    viewCount: 888,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    time: '5天前',
    isFollowed: false,
    hasVoted: false,
    votedOptionId: null,
    userInfo: {
      id: 'vote_user_1',
      nickname: '张三',
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

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  submit
}
