const { successResponse, errorResponse } = require('../utils/response')

// 位置映射
const positionMap = {
  index: '首页',
  errand: '跑腿',
  idle: '闲置',
  vote: '投票',
  love: '恋爱',
  help: '互助'
}

// 获取轮播图列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, position, status } = req.query

    // 模拟数据
    const list = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      image: 'https://via.placeholder.com/200x120',
      title: `轮播图标题${i + 1}`,
      position: ['index', 'errand', 'idle', 'vote', 'love', 'help'][i % 6],
      jumpType: ['none', 'post', 'vote', 'url'][i % 4],
      targetId: i % 4 === 1 ? (i + 1).toString() : '',
      url: i % 4 === 3 ? 'https://example.com' : '',
      startTime: '2024-01-01',
      endTime: '2024-12-31',
      sort: i,
      status: i % 3 === 0 ? 0 : 1,
      createdAt: '2024-01-01 12:00:00'
    }))

    // 筛选
    let filtered = list
    if (position) filtered = filtered.filter(item => item.position === position)
    if (status) filtered = filtered.filter(item => item.status === parseInt(status))

    const start = (page - 1) * pageSize
    const pagedList = filtered.slice(start, start + parseInt(pageSize))

    successResponse(res, { list: pagedList, total: filtered.length })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存轮播图（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, image, title, position, jumpType, targetId, url, startTime, endTime, sort, status, deleted } = req.body

    if (deleted) {
      successResponse(res, null, '删除成功')
    } else if (id) {
      successResponse(res, null, '更新成功')
    } else {
      successResponse(res, { id: Date.now() }, '添加成功')
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}
