const { successResponse, errorResponse } = require('../utils/response')

// 默认配置
const defaultConfigs = {
  post: {
    sortOptions: ['latest', 'hot'],
    categoryOptions: ['all', 'newest', 'recent'],
    timeOptions: ['all', 'today', 'week']
  },
  vote: {
    sortOptions: ['latest', 'hot', 'ending'],
    categoryOptions: ['all', 'ongoing', 'ended', 'joined'],
    timeOptions: ['all', 'today', 'week', 'month']
  },
  errand: {
    sortOptions: ['latest', 'distance', 'price', 'urgent'],
    categoryOptions: ['all', 'delivery', 'purchase', 'pickup', 'other'],
    timeOptions: ['all', 'today', 'tomorrow', 'week']
  },
  idle: {
    sortOptions: ['latest', 'price_asc', 'price_desc', 'hot'],
    categoryOptions: ['all', 'electronics', 'clothing', 'books', 'life', 'other'],
    timeOptions: ['all', 'today', 'week', 'month']
  },
  love: {
    sortOptions: ['latest', 'active', 'recent'],
    categoryOptions: ['all', 'male', 'female', 'any'],
    timeOptions: ['all', 'today', 'week', 'month']
  },
  help: {
    sortOptions: ['latest', 'price', 'ongoing', 'ending'],
    categoryOptions: ['all', 'auctioning', 'ended', 'joined'],
    timeOptions: ['all', 'today', 'week', 'month']
  }
}

// 模拟存储的配置
let configs = { ...defaultConfigs }

// 获取模块配置
exports.getConfig = async (req, res) => {
  try {
    const { module } = req.params
    const moduleName = module || 'post'

    const config = configs[moduleName] || defaultConfigs[moduleName] || defaultConfigs.post
    successResponse(res, config)
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存模块配置
exports.saveOrUpdate = async (req, res) => {
  try {
    const { module, config } = req.body
    const moduleName = module || 'post'

    if (config) {
      configs[moduleName] = config
    }

    successResponse(res, null, '保存成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
