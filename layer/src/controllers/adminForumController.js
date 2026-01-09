const { successResponse, errorResponse } = require('../utils/response')
const forumData = require('../data/forumData')

// 获取论坛列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, status } = req.query
    const list = forumData.getAllForums({ keyword, status })
    const start = (page - 1) * pageSize
    const pagedList = list.slice(start, start + parseInt(pageSize))
    successResponse(res, { list: pagedList, total: list.length })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存论坛（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const result = forumData.saveForum(req.body)
    if (result.id) {
      successResponse(res, { id: result.id }, result.message)
    } else {
      successResponse(res, null, result.message)
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
    const result = forumData.manageForumAdmin(id, userId, removed)
    successResponse(res, null, result.message)
  } catch (error) {
    errorResponse(res, error.message)
  }
}
