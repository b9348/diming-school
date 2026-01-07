const { successResponse, errorResponse } = require('../utils/response')

// 生成搜索结果数据
const generateSearchResults = (keyword, category, sort, page, pageSize) => {
  const startId = (page - 1) * pageSize

  // 根据分类生成不同类型的数据
  const categoryTypes = {
    'all': ['post', 'idle', 'errand', 'vote', 'love', 'help'],
    'post': ['post'],
    'idle': ['idle'],
    'errand': ['errand'],
    'vote': ['vote'],
    'love': ['love'],
    'help': ['help']
  }

  const types = categoryTypes[category] || categoryTypes['all']

  return Array(pageSize).fill(null).map((_, i) => {
    const type = types[i % types.length]
    const id = startId + i + 1

    // 基础数据
    const baseData = {
      id,
      type,
      avatar: 'https://iph.href.lu/100x100?text=头像',
      nickname: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
      time: ['2分钟前', '5分钟前', '10分钟前', '30分钟前', '1小时前'][i % 5],
      likeCount: Math.floor(Math.random() * 100) + 10,
      commentCount: Math.floor(Math.random() * 50) + 5,
      isLiked: false
    }

    // 根据类型生成特定数据
    switch (type) {
      case 'post':
        return {
          ...baseData,
          title: `搜索到的帖子：${keyword} - ${id}`,
          content: `这是一条包含"${keyword}"关键词的帖子内容，今天天气很好，校园里的花都开了...`,
          images: i % 3 === 0 ? [] : ['https://iph.href.lu/400x300?text=图片1'],
          location: ['闵行校区', '徐汇校区'][i % 2]
        }

      case 'idle':
        return {
          ...baseData,
          title: `闲置商品：${keyword} - ${id}`,
          content: `出售闲置${keyword}，九成新，价格优惠...`,
          images: ['https://iph.href.lu/400x300?text=商品图'],
          price: (Math.random() * 100 + 10).toFixed(2),
          originalPrice: (Math.random() * 200 + 50).toFixed(2),
          location: ['闵行校区', '徐汇校区'][i % 2],
          status: '在售'
        }

      case 'errand':
        return {
          ...baseData,
          title: `跑腿任务：${keyword} - ${id}`,
          content: `需要帮忙${keyword}，报酬丰厚...`,
          reward: (Math.random() * 20 + 5).toFixed(2),
          location: ['闵行校区', '徐汇校区'][i % 2],
          deadline: '今天18:00',
          status: '进行中'
        }

      case 'vote':
        return {
          ...baseData,
          title: `投票：${keyword} - ${id}`,
          content: `关于${keyword}的投票，请大家积极参与...`,
          options: ['选项A', '选项B', '选项C'],
          voteCount: Math.floor(Math.random() * 200) + 50,
          deadline: '2024-12-31'
        }

      case 'love':
        return {
          ...baseData,
          title: `交友：${keyword} - ${id}`,
          content: `寻找志同道合的朋友，兴趣爱好：${keyword}...`,
          age: Math.floor(Math.random() * 5) + 18,
          gender: ['男', '女'][i % 2],
          tags: ['运动', '音乐', '旅游'].slice(0, 2)
        }

      case 'help':
        return {
          ...baseData,
          title: `互助拍卖：${keyword} - ${id}`,
          content: `互助拍卖${keyword}，起拍价优惠...`,
          currentPrice: (Math.random() * 50 + 10).toFixed(2),
          bidCount: Math.floor(Math.random() * 20) + 1,
          deadline: '2024-12-31 18:00'
        }

      default:
        return baseData
    }
  })
}

// 搜索接口
const search = (req, res) => {
  const { keyword = '', category = 'all', sort = 'comprehensive', page = 1, pageSize = 10 } = req.query

  // 验证关键词
  if (!keyword.trim()) {
    return errorResponse(res, '请输入搜索关键词', 400)
  }

  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  // 模拟总共50条搜索结果
  const total = 50
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  const list = generateSearchResults(keyword, category, sort, pageNum, size)
  successResponse(res, { list, total })
}

module.exports = {
  search
}

