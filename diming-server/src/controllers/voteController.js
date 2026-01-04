const { successResponse, errorResponse } = require('../utils/response')

// 生成投票列表数据
const generateVoteList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return [
    {
      id: startId + 1,
      type: 'text',
      title: '今天不知道吃什么，大家帮我选一个吧',
      deadline: '9天19小时4分结束',
      options: [
        { id: 1, text: '西瓜', count: 566, percent: 60.56 },
        { id: 2, text: '萝卜', count: 200, percent: 21.42 },
        { id: 3, text: '西红柿', count: 100, percent: 10.71 },
        { id: 4, text: '苹果', count: 68, percent: 7.31 }
      ],
      totalVotes: 934,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '张三',
      time: '5天前'
    },
    {
      id: startId + 2,
      type: 'image',
      title: '哪个头像更好看？',
      deadline: '3天12小时结束',
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
  const { page = 1, pageSize = 10 } = req.query
  const pageNum = parseInt(page)

  const total = 6
  const maxPage = Math.ceil(total / 2)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  const list = generateVoteList(pageNum, parseInt(pageSize))
  successResponse(res, { list, total })
}

// 获取投票详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    type: 'text',
    title: '今天不知道吃什么，大家帮我选一个吧',
    deadline: '9天19小时4分结束',
    options: [
      { id: 1, text: '西瓜', count: 566, percent: 60, voted: false },
      { id: 2, text: '萝卜', count: 200, percent: 21, voted: false },
      { id: 3, text: '西红柿', count: 100, percent: 11, voted: false },
      { id: 4, text: '苹果', count: 68, percent: 8, voted: false }
    ],
    totalVotes: 934,
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
  const { id, title, options, deadline } = req.body

  if (!title) {
    return errorResponse(res, '投票标题不能为空', 400)
  }

  if (!options || options.length < 2) {
    return errorResponse(res, '至少需要2个选项', 400)
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
