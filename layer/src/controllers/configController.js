const { successResponse } = require('../utils/response')

/**
 * 获取置顶价格配置
 * @query type - 类型: post(帖子), idle(闲置), help(互助)
 */
exports.getTopPricing = async (req, res, next) => {
  try {
    const { type = 'post' } = req.query

    // TODO: 从数据库获取后台配置的价格数据
    const pricingConfig = {
      post: [
        { label: '不置顶', days: 0, price: 0 },
        { label: '置顶1天', days: 1, price: 5 },
        { label: '置顶3天', days: 3, price: 12 },
        { label: '置顶7天', days: 7, price: 25 }
      ],
      idle: [
        { hours: 1, price: 8.8 },
        { hours: 2, price: 18.8 },
        { hours: 4, price: 28.8 },
        { hours: 6, price: 38.8 },
        { hours: 8, price: 48.8 },
        { hours: 12, price: 58.8 }
      ],
      help: [
        { hours: 1, price: 8.8 },
        { hours: 2, price: 18.8 },
        { hours: 4, price: 28.8 },
        { hours: 6, price: 38.8 },
        { hours: 8, price: 48.8 },
        { hours: 12, price: 58.8 }
      ]
    }

    successResponse(res, pricingConfig[type] || pricingConfig.post)
  } catch (error) {
    next(error)
  }
}

/**
 * 获取默认时间配置
 * @query type - 类型: errand(跑腿), idle(闲置), help(互助)
 */
exports.getDefaultHours = async (req, res, next) => {
  try {
    const { type } = req.query

    // TODO: 从数据库获取后台配置的默认时间
    const defaultHoursConfig = {
      errand: 24,
      idle: 24,
      help: 24
    }

    successResponse(res, { hours: defaultHoursConfig[type] || 24 })
  } catch (error) {
    next(error)
  }
}
