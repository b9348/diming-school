const { successResponse, errorResponse } = require('../utils/response')

// 模拟论坛数据
const forums = [
  {
    id: 1,
    name: '校园讨论',
    icon: 'https://via.placeholder.com/40',
    description: '校园生活相关话题讨论',
    adminCount: 2,
    postCount: 156,
    status: 1,
    admins: [
      { id: 1, nickname: '管理员1' },
      { id: 2, nickname: '管理员2' }
    ]
  },
  {
    id: 2,
    name: '二手交易',
    icon: 'https://via.placeholder.com/40',
    description: '校园二手物品交易',
    adminCount: 1,
    postCount: 89,
    status: 1,
    admins: [
      { id: 3, nickname: '管理员3' }
    ]
  },
  {
    id: 3,
    name: '失物招领',
    icon: 'https://via.placeholder.com/40',
    description: '失物招领与寻物启事',
    adminCount: 1,
    postCount: 45,
    status: 1,
    admins: [
      { id: 4, nickname: '管理员4' }
    ]
  }
]

// 获取论坛列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, status } = req.query

    let filtered = [...forums]

    // 筛选
    if (keyword) {
      filtered = filtered.filter(f => f.name.includes(keyword) || f.description.includes(keyword))
    }
    if (status) {
      filtered = filtered.filter(f => f.status === parseInt(status))
    }

    const start = (page - 1) * pageSize
    const pagedList = filtered.slice(start, start + parseInt(pageSize))

    successResponse(res, { list: pagedList, total: filtered.length })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存论坛（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const { id, name, icon, description, status, deleted } = req.body

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

// 分配管理员
exports.addAdmins = async (req, res) => {
  try {
    const { id } = req.params
    const { userId, removed } = req.body

    successResponse(res, null, removed ? '移除成功' : '添加成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
