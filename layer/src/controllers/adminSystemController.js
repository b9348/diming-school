const { successResponse, errorResponse } = require('../utils/response')

let systemConfig = {
  basic: { platformName: '递明校园', logo: '', servicePhone: '', serviceEmail: '' },
  trade: { commissionRate: 5, minWithdraw: 10, orderTimeout: 30 },
  content: { maxImages: 9, maxContentLength: 2000, auditEnabled: true }
}

exports.getConfig = async (req, res) => {
  try {
    successResponse(res, systemConfig)
  } catch (error) {
    errorResponse(res, error.message)
  }
}

exports.saveConfig = async (req, res) => {
  try {
    systemConfig = { ...systemConfig, ...req.body }
    successResponse(res, null, '保存成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
