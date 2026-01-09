const { successResponse, errorResponse } = require('../utils/response')

// 跳转类型映射
const jumpTypeMap = {
  post: '帖子列表',
  vote: '投票',
  errand: '跑腿',
  idle: '闲置',
  love: '恋爱',
  help: '互助',
  message: '消息',
  mine: '个人中心',
  url: '外链'
}

// 获取导航列表
exports.getList = async (req, res) => {
  try {
    // 模拟数据
    const list = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      icon: 'https://via.placeholder.com/64',
      name: `导航${i + 1}`,
      jumpType: ['post', 'vote', 'errand', 'idle', 'love', 'help', 'message', 'mine'][i],
      target: '',
      sort: i,
      status: i % 3 === 0 ? 0 : 1
    }))

    successResponse(res, { list })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存导航（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, icon, name, jumpType, target, sort, status, deleted } = req.body

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
