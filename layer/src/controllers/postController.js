const { successResponse, errorResponse } = require('../utils/response')

// 生成评论预览数据
const generateCommentPreview = (index) => {
  const comments = [
    { avatar: 'https://iph.href.lu/100x100?text=头像', content: '最热评论，显示该评论前20字' },
    { avatar: 'https://iph.href.lu/100x100?text=头像', content: '最新评论，显示该评论的前20字' },
    { avatar: 'https://iph.href.lu/100x100?text=头像', content: '次最新评论，显示该评论前20字' }
  ]
  // 部分帖子不显示评论预览
  if (index % 4 === 3) return []
  return comments.slice(0, (index % 3) + 1)
}

// 生成帖子列表数据
const generatePostList = (page, pageSize, tab) => {
  const startId = (page - 1) * pageSize
  const titles = ['头衔', '学长', '学姐', '校友', '']

  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    title: titles[i % 5],
    time: ['2分钟前', '5分钟前', '10分钟前', '30分钟前', '1小时前'][i % 5],
    isTop: i === 0,
    content: '今天天气很好，测试文本的代价弟弟得到好的好的环境的基督教弟弟弟弟等级地方法的那段艰难的大家都降低看到，这里显示帖子里的文字前200字',
    images: i % 3 === 0 ? [] : [
      'https://iph.href.lu/400x300?text=图片1',
      'https://iph.href.lu/400x300?text=图片2',
      'https://iph.href.lu/400x300?text=图片3'
    ].slice(0, (i % 3) + 1),
    comments: generateCommentPreview(i),
    viewCount: Math.floor(Math.random() * 900) + 100,
    location: ['闵行校区', '徐汇校区', '海定校区', '杨浦校区'][i % 4],
    likeCount: Math.floor(Math.random() * 100) + 10,
    commentCount: Math.floor(Math.random() * 50) + 5,
    isLiked: false
  }))
}

// 获取帖子列表
const getList = (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    tab = '最新',
    sort = 'latest',
    contentType = '',
    timeRange = ''
  } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  // 模拟总共30条数据
  const total = 30
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  let list = generatePostList(pageNum, size, tab)

  // 根据排序方式排序
  switch (sort) {
    case 'hot':
      list.sort((a, b) => b.likeCount - a.likeCount)
      break
    case 'most_likes':
      list.sort((a, b) => b.likeCount - a.likeCount)
      break
    case 'most_comments':
      list.sort((a, b) => b.commentCount - a.commentCount)
      break
  }

  // 根据内容类型筛选（模拟）
  // contentType: image_text, text, image

  // 根据发布时间筛选（模拟）
  // timeRange: 1d, 3d, 1w, 15d, 1m, 3m, 6m

  successResponse(res, { list, total })
}

// 获取帖子详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    avatar: 'https://iph.href.lu/100x100?text=头像',
    nickname: '张三',
    title: '头衔',
    time: '2分钟前',
    isTop: true,
    content: '今天天气很好，测试文本的代价弟弟得到好的好的环境的基督教弟弟弟弟等级地方法的那段艰难的大家都降低看到，这里显示帖子里的文字前200字',
    images: [
      'https://iph.href.lu/400x300?text=图片1',
      'https://iph.href.lu/400x300?text=图片2'
    ],
    viewCount: 888,
    location: '闵行校区',
    likeCount: 77,
    commentCount: 95,
    shareCount: 12,
    isFollowed: false,
    isLiked: false,
    isPinned: false,
    isRemoved: false,
    isAnnouncement: false,
    userInfo: {
      id: '123456',
      nickname: '张三',
      isBanned: false,
      title: '头衔',
      isAdmin: false
    },
    // 评论列表
    comments: Array(5).fill(null).map((_, i) => ({
      id: 'comment_' + i,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: '用户' + i,
      content: '这是一条评论内容，评论者对帖子发表了自己的看法。',
      time: i + '分钟前',
      likeCount: 10 + i,
      isPinned: i === 0,
      isRemoved: false,
      isAuthor: i === 1,
      userInfo: {
        id: 'user_' + i,
        nickname: '用户' + i,
        isBanned: false,
        title: i === 0 ? '热心网友' : '',
        isAdmin: false
      }
    }))
  }

  successResponse(res, detail)
}

// 创建或更新帖子
const saveOrUpdate = (req, res) => {
  const { id, content, images, location } = req.body

  if (!content) {
    return errorResponse(res, '帖子内容不能为空', 400)
  }

  if (id) {
    // 更新
    successResponse(res, { id }, '帖子更新成功')
  } else {
    // 创建
    const newId = Date.now()
    successResponse(res, { id: newId }, '帖子发布成功')
  }
}

// 点赞帖子
const like = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '点赞成功')
}

// 收藏帖子
const collect = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '收藏成功')
}

// 评论帖子
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
  like,
  collect,
  comment
}
