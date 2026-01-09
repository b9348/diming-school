/**
 * 轮播图共享数据存储
 * 后台管理配置的轮播图数据，用户端各模块从这里读取
 */

// 轮播图数据存储
let banners = [
  // 首页轮播图
  { id: 1, image: 'https://iph.href.lu/750x300?text=首页轮播图1', title: '首页轮播图1', position: 'index', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 0, status: 1 },
  { id: 2, image: 'https://iph.href.lu/750x300?text=首页轮播图2', title: '首页轮播图2', position: 'index', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 1, status: 1 },
  { id: 3, image: 'https://iph.href.lu/750x300?text=首页轮播图3', title: '首页轮播图3', position: 'index', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 2, status: 1 },
  // 跑腿轮播图
  { id: 4, image: 'https://iph.href.lu/750x300?text=跑腿轮播图1', title: '跑腿轮播图1', position: 'errand', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 0, status: 1 },
  { id: 5, image: 'https://iph.href.lu/750x300?text=跑腿轮播图2', title: '跑腿轮播图2', position: 'errand', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 1, status: 1 },
  // 闲置轮播图
  { id: 6, image: 'https://iph.href.lu/750x300?text=闲置轮播图1', title: '闲置轮播图1', position: 'idle', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 0, status: 1 },
  { id: 7, image: 'https://iph.href.lu/750x300?text=闲置轮播图2', title: '闲置轮播图2', position: 'idle', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 1, status: 1 },
  // 投票轮播图
  { id: 8, image: 'https://iph.href.lu/750x300?text=投票轮播图1', title: '投票轮播图1', position: 'vote', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 0, status: 1 },
  { id: 9, image: 'https://iph.href.lu/750x300?text=投票轮播图2', title: '投票轮播图2', position: 'vote', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 1, status: 1 },
  // 恋爱轮播图
  { id: 10, image: 'https://iph.href.lu/750x300?text=恋爱轮播图1', title: '恋爱轮播图1', position: 'love', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 0, status: 1 },
  { id: 11, image: 'https://iph.href.lu/750x300?text=恋爱轮播图2', title: '恋爱轮播图2', position: 'love', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 1, status: 1 },
  // 互助轮播图
  { id: 12, image: 'https://iph.href.lu/750x300?text=互助轮播图1', title: '互助轮播图1', position: 'help', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 0, status: 1 },
  { id: 13, image: 'https://iph.href.lu/750x300?text=互助轮播图2', title: '互助轮播图2', position: 'help', jumpType: 'none', targetId: '', url: '', startTime: '2024-01-01', endTime: '2030-12-31', sort: 1, status: 1 }
]

let nextId = 14

// 跳转类型对应的URL生成
const jumpTypeUrlMap = {
  post: (id) => `/pages/post/detail?id=${id}`,
  vote: (id) => `/pages/vote/detail?id=${id}`,
  errand: (id) => `/pages/errand/detail?id=${id}`,
  idle: (id) => `/pages/idle/detail?id=${id}`,
  love: (id) => `/pages/love/detail?id=${id}`,
  help: (id) => `/pages/help/detail?id=${id}`
}

// 生成轮播图跳转URL
const generateBannerUrl = (banner) => {
  if (banner.jumpType === 'none') return ''
  if (banner.jumpType === 'url') return banner.url || ''
  if (jumpTypeUrlMap[banner.jumpType] && banner.targetId) {
    return jumpTypeUrlMap[banner.jumpType](banner.targetId)
  }
  return ''
}

// 检查轮播图是否在有效期内
const isInValidPeriod = (banner) => {
  const now = new Date().toISOString().split('T')[0]
  return banner.startTime <= now && now <= banner.endTime
}

// 获取指定位置的轮播图列表（用户端使用）
const getBannersByPosition = (position) => {
  return banners
    .filter(b => b.position === position && b.status === 1 && isInValidPeriod(b))
    .sort((a, b) => a.sort - b.sort)
    .map(b => ({
      id: b.id,
      image: b.image,
      url: generateBannerUrl(b)
    }))
}

// 获取所有轮播图（后台管理使用）
const getAllBanners = (filters = {}) => {
  let result = [...banners]
  if (filters.position) result = result.filter(b => b.position === filters.position)
  if (filters.status !== undefined && filters.status !== '') result = result.filter(b => b.status === parseInt(filters.status))
  return result.sort((a, b) => a.sort - b.sort)
}

// 保存轮播图
const saveBanner = (data) => {
  if (data.deleted && data.id) {
    banners = banners.filter(b => b.id !== data.id)
    return { success: true, message: '删除成功' }
  }
  if (data.id) {
    const index = banners.findIndex(b => b.id === data.id)
    if (index !== -1) {
      banners[index] = { ...banners[index], ...data }
      return { success: true, message: '更新成功' }
    }
  }
  const newBanner = { ...data, id: nextId++ }
  banners.push(newBanner)
  return { success: true, message: '添加成功', id: newBanner.id }
}

module.exports = {
  getBannersByPosition,
  getAllBanners,
  saveBanner
}
