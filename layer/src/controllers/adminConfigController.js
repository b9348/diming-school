const { successResponse } = require('../utils/response')

/**
 * 获取价格配置列表
 */
exports.getPricingList = async (req, res, next) => {
  try {
    // TODO: 从数据库获取配置
    const pricingList = {
      post: [
        { id: 1, label: '不置顶', days: 0, price: 0 },
        { id: 2, label: '置顶1天', days: 1, price: 5 },
        { id: 3, label: '置顶3天', days: 3, price: 12 },
        { id: 4, label: '置顶7天', days: 7, price: 25 }
      ],
      idle: [
        { id: 5, hours: 1, price: 8.8 },
        { id: 6, hours: 2, price: 18.8 },
        { id: 7, hours: 4, price: 28.8 },
        { id: 8, hours: 6, price: 38.8 },
        { id: 9, hours: 8, price: 48.8 },
        { id: 10, hours: 12, price: 58.8 }
      ],
      help: [
        { id: 11, hours: 1, price: 8.8 },
        { id: 12, hours: 2, price: 18.8 },
        { id: 13, hours: 4, price: 28.8 },
        { id: 14, hours: 6, price: 38.8 },
        { id: 15, hours: 8, price: 48.8 },
        { id: 16, hours: 12, price: 58.8 }
      ]
    }
    successResponse(res, pricingList)
  } catch (error) {
    next(error)
  }
}

/**
 * 保存价格配置
 */
exports.savePricing = async (req, res, next) => {
  try {
    const { type, items } = req.body
    // TODO: 保存到数据库
    successResponse(res, { type, items }, '保存成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取地区配置列表（用于后台管理）
 */
exports.getRegionList = async (req, res, next) => {
  try {
    // TODO: 从数据库获取配置
    const regions = [
      { id: 0, name: '全国', type: 'all', enabled: true },
      { id: 10, name: '上海', type: 'city', enabled: true },
      { id: 11, name: '北京', type: 'city', enabled: true },
      { id: 12, name: '广州', type: 'city', enabled: true },
      { id: 13, name: '深圳', type: 'city', enabled: true },
      { id: 14, name: '天津', type: 'city', enabled: true },
      { id: 15, name: '南京', type: 'city', enabled: true },
      { id: 99, name: '滴水湖大学城', type: 'zone', enabled: true },
      { id: 100, name: '南京大学城', type: 'zone', enabled: true }
    ]
    successResponse(res, regions)
  } catch (error) {
    next(error)
  }
}

/**
 * 保存地区配置
 */
exports.saveRegion = async (req, res, next) => {
  try {
    const { id, name, label, value, type, enabled } = req.body
    // TODO: 保存到数据库
    successResponse(res, { id, name, label, value, type, enabled }, '保存成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除地区配置
 */
exports.deleteRegion = async (req, res, next) => {
  try {
    const { id } = req.params
    // TODO: 从数据库删除
    successResponse(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取校区列表（用于后台管理）
 */
exports.getSchoolList = async (req, res, next) => {
  try {
    // TODO: 从数据库获取配置
    const schools = [
      { id: 1, name: '上海交通大学', region_id: 10, region_name: '上海', enabled: true },
      { id: 2, name: '复旦大学', region_id: 10, region_name: '上海', enabled: true },
      { id: 3, name: '同济大学', region_id: 10, region_name: '上海', enabled: true },
      { id: 4, name: '北京大学', region_id: 11, region_name: '北京', enabled: true },
      { id: 5, name: '清华大学', region_id: 11, region_name: '北京', enabled: true },
      { id: 6, name: '中山大学', region_id: 12, region_name: '广州', enabled: true },
      { id: 7, name: '深圳大学', region_id: 13, region_name: '深圳', enabled: true },
      { id: 8, name: '南开大学', region_id: 14, region_name: '天津', enabled: true },
      { id: 9, name: '天津大学', region_id: 14, region_name: '天津', enabled: true },
      { id: 10, name: '南京大学', region_id: 15, region_name: '南京', enabled: true }
    ]
    successResponse(res, schools)
  } catch (error) {
    next(error)
  }
}

/**
 * 保存校区配置
 */
exports.saveSchool = async (req, res, next) => {
  try {
    const { id, name, region_id, enabled } = req.body
    // TODO: 保存到数据库
    successResponse(res, { id, name, region_id, enabled }, '保存成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除校区配置
 */
exports.deleteSchool = async (req, res, next) => {
  try {
    const { id } = req.params
    // TODO: 从数据库删除
    successResponse(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}
