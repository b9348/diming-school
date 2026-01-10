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
 * 获取地区配置列表
 */
exports.getRegionList = async (req, res, next) => {
  try {
    // TODO: 从数据库获取配置
    const regions = [
      { id: 0, name: '全国可见', label: '全国', value: 'all', type: 'all', enabled: true },
      { id: 1, name: '本城市可见', label: '全市', value: 'city', type: 'city', enabled: true },
      { id: 2, name: '本校区可见', label: '本校', value: 'campus', type: 'school', enabled: true },
      { id: 3, name: '外校可见', label: '外校', value: 'other', type: 'other', enabled: true },
      { id: 4, name: '滴水湖大学城', label: '滴水湖大学城', value: 'dishui', type: 'zone', enabled: true },
      { id: 5, name: '指定范围', label: '指定', value: 'specify', type: 'specify', enabled: true },
      { id: 6, name: '全区可见', label: '全区', value: 'district', type: 'district', enabled: true },
      { id: 7, name: '全省可见', label: '全省', value: 'province', type: 'province', enabled: true },
      { id: 8, name: '华东地区', label: '华东', value: 'east', type: 'region', enabled: true },
      { id: 9, name: '华中地区', label: '华中', value: 'central', type: 'region', enabled: true },
      { id: 10, name: '西南地区', label: '西南', value: 'southwest', type: 'region', enabled: true },
      { id: 11, name: '华南地区', label: '华南', value: 'south', type: 'region', enabled: true },
      { id: 12, name: '东北地区', label: '东北', value: 'northeast', type: 'region', enabled: true },
      { id: 13, name: '华北地区', label: '华北', value: 'north', type: 'region', enabled: true },
      { id: 14, name: '西北地区', label: '西北', value: 'northwest', type: 'region', enabled: true }
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
