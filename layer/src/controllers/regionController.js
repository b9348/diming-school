const { successResponse } = require('../utils/response')

/**
 * 获取地区列表（城市+片区）
 */
exports.getList = async (req, res, next) => {
  try {
    // TODO: 从数据库获取后台配置的地区数据
    const regions = [
      { id: 0, name: '全国', type: 'all', is_fixed: true },
      { id: 10, name: '上海', type: 'city', is_fixed: false },
      { id: 11, name: '北京', type: 'city', is_fixed: false },
      { id: 12, name: '广州', type: 'city', is_fixed: false },
      { id: 13, name: '深圳', type: 'city', is_fixed: false },
      { id: 14, name: '天津', type: 'city', is_fixed: false },
      { id: 15, name: '南京', type: 'city', is_fixed: false },
      { id: 99, name: '滴水湖大学城', type: 'zone', is_fixed: false },
      { id: 100, name: '南京大学城', type: 'zone', is_fixed: false }
    ]
    successResponse(res, regions)
  } catch (error) {
    next(error)
  }
}

/**
 * 获取校区列表
 * @query regionId - 地区ID（可选，不传返回全部）
 */
exports.getSchools = async (req, res, next) => {
  try {
    const { regionId } = req.query
    // TODO: 从数据库获取校区数据
    let schools = [
      { id: 1, name: '上海交通大学', region_id: 10, region_name: '上海' },
      { id: 2, name: '复旦大学', region_id: 10, region_name: '上海' },
      { id: 3, name: '同济大学', region_id: 10, region_name: '上海' },
      { id: 4, name: '北京大学', region_id: 11, region_name: '北京' },
      { id: 5, name: '清华大学', region_id: 11, region_name: '北京' },
      { id: 6, name: '中国人民大学', region_id: 11, region_name: '北京' },
      { id: 7, name: '中山大学', region_id: 12, region_name: '广州' },
      { id: 8, name: '华南理工大学', region_id: 12, region_name: '广州' },
      { id: 9, name: '深圳大学', region_id: 13, region_name: '深圳' },
      { id: 10, name: '南方科技大学', region_id: 13, region_name: '深圳' },
      { id: 11, name: '南开大学', region_id: 14, region_name: '天津' },
      { id: 12, name: '天津大学', region_id: 14, region_name: '天津' },
      { id: 13, name: '南京大学', region_id: 15, region_name: '南京' },
      { id: 14, name: '东南大学', region_id: 15, region_name: '南京' }
    ]
    if (regionId && regionId !== '0') {
      schools = schools.filter(s => s.region_id === parseInt(regionId))
    }
    successResponse(res, schools)
  } catch (error) {
    next(error)
  }
}

/**
 * 获取可见范围选项
 */
exports.getVisibleOptions = async (req, res, next) => {
  try {
    // TODO: 从数据库获取后台配置的可见范围选项
    const options = [
      { id: 0, name: '全国可见', label: '全国', value: 'all', type: 'all' },
      { id: 1, name: '本城市可见', label: '全市', value: 'city', type: 'city' },
      { id: 2, name: '本校区可见', label: '本校', value: 'campus', type: 'school' },
      { id: 3, name: '外校可见', label: '外校', value: 'other', type: 'other' },
      { id: 4, name: '滴水湖大学城', label: '滴水湖大学城', value: 'dishui', type: 'zone' },
      { id: 5, name: '指定范围', label: '指定', value: 'specify', type: 'specify' },
      { id: 6, name: '全区可见', label: '全区', value: 'district', type: 'district' },
      { id: 7, name: '全省可见', label: '全省', value: 'province', type: 'province' },
      { id: 8, name: '华东地区', label: '华东', value: 'east', type: 'region' },
      { id: 9, name: '华中地区', label: '华中', value: 'central', type: 'region' },
      { id: 10, name: '西南地区', label: '西南', value: 'southwest', type: 'region' },
      { id: 11, name: '华南地区', label: '华南', value: 'south', type: 'region' },
      { id: 12, name: '东北地区', label: '东北', value: 'northeast', type: 'region' },
      { id: 13, name: '华北地区', label: '华北', value: 'north', type: 'region' },
      { id: 14, name: '西北地区', label: '西北', value: 'northwest', type: 'region' }
    ]
    successResponse(res, options)
  } catch (error) {
    next(error)
  }
}
