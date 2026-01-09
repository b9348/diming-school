const { successResponse, errorResponse } = require('../utils/response')
const bannerData = require('../data/bannerData')

// 获取轮播图列表
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, position, status } = req.query
    const list = bannerData.getAllBanners({ position, status })
    const start = (page - 1) * pageSize
    const pagedList = list.slice(start, start + parseInt(pageSize))
    successResponse(res, { list: pagedList, total: list.length })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存轮播图（创建/更新/删除）
exports.saveOrUpdate = async (req, res) => {
  try {
    const result = bannerData.saveBanner(req.body)
    if (result.id) {
      successResponse(res, { id: result.id }, result.message)
    } else {
      successResponse(res, null, result.message)
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}
