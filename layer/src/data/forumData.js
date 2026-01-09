/**
 * 论坛共享数据存储
 * 后台管理配置的论坛数据
 */

// 论坛数据存储
let forums = [
  { id: 1, name: '校园讨论', icon: '', description: '校园生活相关话题讨论', adminCount: 2, postCount: 156, status: 1, admins: [{ id: 1, nickname: '管理员1' }, { id: 2, nickname: '管理员2' }] },
  { id: 2, name: '二手交易', icon: '', description: '校园二手物品交易', adminCount: 1, postCount: 89, status: 1, admins: [{ id: 3, nickname: '管理员3' }] },
  { id: 3, name: '失物招领', icon: '', description: '失物招领与寻物启事', adminCount: 1, postCount: 45, status: 1, admins: [{ id: 4, nickname: '管理员4' }] },
  { id: 4, name: '学习交流', icon: '', description: '学习资料分享与讨论', adminCount: 0, postCount: 78, status: 1, admins: [] },
  { id: 5, name: '社团活动', icon: '', description: '社团活动发布与报名', adminCount: 0, postCount: 34, status: 1, admins: [] }
]

let nextId = 6

// 获取论坛列表（用户端使用）
const getForumsForUser = () => {
  return forums
    .filter(f => f.status === 1)
    .map(f => ({ id: f.id, name: f.name, icon: f.icon, description: f.description }))
}

// 获取论坛详情
const getForumById = (id) => {
  return forums.find(f => f.id === parseInt(id) && f.status === 1)
}

// 获取所有论坛（后台管理使用）
const getAllForums = (filters = {}) => {
  let result = [...forums]
  if (filters.keyword) {
    result = result.filter(f => f.name.includes(filters.keyword) || f.description.includes(filters.keyword))
  }
  if (filters.status !== undefined && filters.status !== '') {
    result = result.filter(f => f.status === parseInt(filters.status))
  }
  return result
}

// 保存论坛
const saveForum = (data) => {
  if (data.deleted && data.id) {
    forums = forums.filter(f => f.id !== data.id)
    return { success: true, message: '删除成功' }
  }
  if (data.id) {
    const index = forums.findIndex(f => f.id === data.id)
    if (index !== -1) {
      forums[index] = { ...forums[index], ...data }
      return { success: true, message: '更新成功' }
    }
  }
  const newForum = { ...data, id: nextId++, adminCount: 0, postCount: 0, admins: [] }
  forums.push(newForum)
  return { success: true, message: '添加成功', id: newForum.id }
}

// 管理论坛管理员
const manageForumAdmin = (forumId, userId, removed) => {
  const forum = forums.find(f => f.id === parseInt(forumId))
  if (!forum) return { success: false, message: '论坛不存在' }

  if (removed) {
    forum.admins = forum.admins.filter(a => a.id !== userId)
    forum.adminCount = forum.admins.length
    return { success: true, message: '移除成功' }
  } else {
    if (!forum.admins.some(a => a.id === userId)) {
      forum.admins.push({ id: userId, nickname: `用户${userId}` })
      forum.adminCount = forum.admins.length
    }
    return { success: true, message: '添加成功' }
  }
}

module.exports = {
  getForumsForUser,
  getForumById,
  getAllForums,
  saveForum,
  manageForumAdmin
}
