/**
 * 导航分类共享数据存储
 * 后台管理配置的导航数据，用户端首页从这里读取
 */

// 导航数据存储
let navs = [
  { id: 1, icon: '', name: '秘密树洞', jumpType: 'post', target: '', sort: 0, status: 1 },
  { id: 2, icon: '', name: '校园跑腿', jumpType: 'errand', target: '', sort: 1, status: 1 },
  { id: 3, icon: '', name: '表白墙', jumpType: 'love', target: '', sort: 2, status: 1 },
  { id: 4, icon: '', name: '失物招领', jumpType: 'idle', target: '', sort: 3, status: 1 },
  { id: 5, icon: '', name: '互助拍卖', jumpType: 'help', target: '', sort: 4, status: 1 },
  { id: 6, icon: '', name: '投票', jumpType: 'vote', target: '', sort: 5, status: 1 },
  { id: 7, icon: '', name: '闲置市场', jumpType: 'idle', target: '', sort: 6, status: 1 },
  { id: 8, icon: '', name: '社团活动', jumpType: 'url', target: '', sort: 7, status: 1 },
  { id: 9, icon: '', name: '学习交流', jumpType: 'url', target: '', sort: 8, status: 1 },
  { id: 10, icon: '', name: '兼职信息', jumpType: 'url', target: '', sort: 9, status: 1 },
  { id: 11, icon: '', name: '校园资讯', jumpType: 'url', target: '', sort: 10, status: 1 },
  { id: 12, icon: '', name: '运动打卡', jumpType: 'url', target: '', sort: 11, status: 1 }
]

let nextId = 13

// 跳转类型对应的URL
const jumpTypeUrlMap = {
  post: '/pages/post/index',
  vote: '/pages/vote/index',
  errand: '/pages/errand/index',
  idle: '/pages/idle/index',
  love: '/pages/love/index',
  help: '/pages/help/index',
  message: '/pages/message/index',
  mine: '/pages/mine/index'
}

// 生成导航跳转URL
const generateNavUrl = (nav) => {
  if (nav.jumpType === 'url') return nav.target || ''
  return jumpTypeUrlMap[nav.jumpType] || ''
}

// 获取导航列表（用户端使用）
const getNavsForUser = () => {
  return navs
    .filter(n => n.status === 1)
    .sort((a, b) => a.sort - b.sort)
    .map(n => ({
      id: n.id,
      name: n.name,
      icon: n.icon,
      url: generateNavUrl(n)
    }))
}

// 获取所有导航（后台管理使用）
const getAllNavs = () => {
  return [...navs].sort((a, b) => a.sort - b.sort)
}

// 保存导航
const saveNav = (data) => {
  if (data.deleted && data.id) {
    navs = navs.filter(n => n.id !== data.id)
    return { success: true, message: '删除成功' }
  }
  if (data.id) {
    const index = navs.findIndex(n => n.id === data.id)
    if (index !== -1) {
      navs[index] = { ...navs[index], ...data }
      return { success: true, message: '更新成功' }
    }
  }
  const newNav = { ...data, id: nextId++ }
  navs.push(newNav)
  return { success: true, message: '添加成功', id: newNav.id }
}

module.exports = {
  getNavsForUser,
  getAllNavs,
  saveNav
}
