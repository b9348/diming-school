const { successResponse, errorResponse } = require('../utils/response')
const navData = require('../data/navData')

// 获取导航列表
exports.getList = async (req, res) => {
  try {
    const list = navData.getAllNavs()
    successResponse(res, { list })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存导航（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const result = navData.saveNav(req.body)
    if (result.id) {
      successResponse(res, { id: result.id }, result.message)
    } else {
      successResponse(res, null, result.message)
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}
