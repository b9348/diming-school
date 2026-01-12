/**
 * API 模块
 * 按业务模块组织所有 API 接口
 */
import { get, post, setToken } from '@/utils/request'

/**
 * 认证相关 API
 */
export const authApi = {
  // 登录
  login: (data) => post('/auth/login', data),

  // 获取用户信息
  getUserInfo: () => get('/auth/userInfo'),

  // 获取测试账号列表
  getTestAccounts: () => get('/auth/testAccounts')
}

/**
 * 首页相关 API
 */
export const homeApi = {
  // 获取首页数据（轮播图、热榜、公告、导航等）
  getData: (params) => get('/home/data', params)
}

/**
 * 帖子相关 API
 */
export const postApi = {
  // 获取帖子列表
  getList: (params) => get('/post/list', params),

  // 获取帖子详情
  getDetail: (id) => get(`/post/detail/${id}`),

  // 创建/更新帖子
  saveOrUpdate: (data) => post('/post/saveOrUpdate', data),

  // 点赞帖子
  like: (id) => post(`/post/like/${id}`),

  // 收藏帖子
  collect: (id) => post(`/post/collect/${id}`),

  // 评论帖子
  comment: (id, content) => post(`/post/comment/${id}`, { content })
}

/**
 * 投票相关 API
 */
export const voteApi = {
  // 获取投票列表
  getList: (params) => get('/vote/list', params),

  // 获取投票详情
  getDetail: (id) => get(`/vote/detail/${id}`),

  // 创建/更新投票
  saveOrUpdate: (data) => post('/vote/saveOrUpdate', data),

  // 提交投票
  submit: (data) => post('/vote/submit', data),

  // 评论投票
  comment: (id, content) => post(`/vote/comment/${id}`, { content })
}

/**
 * 跑腿相关 API
 */
export const errandApi = {
  // 获取跑腿数据（轮播图、公告等）
  getData: (params) => get('/errand/data', params),

  // 获取跑腿列表
  getList: (params) => get('/errand/list', params),

  // 获取跑腿详情
  getDetail: (id) => get(`/errand/detail/${id}`),

  // 创建/更新跑腿任务
  saveOrUpdate: (data) => post('/errand/saveOrUpdate', data),

  // 接单
  accept: (id) => post(`/errand/accept/${id}`),

  // 完成订单
  complete: (id) => post(`/errand/complete/${id}`)
}

/**
 * 闲置相关 API
 */
export const idleApi = {
  // 获取闲置列表
  getList: (params) => get('/idle/list', params),

  // 获取闲置详情
  getDetail: (id) => get(`/idle/detail/${id}`),

  // 创建/更新闲置商品
  saveOrUpdate: (data) => post('/idle/saveOrUpdate', data),

  // 想要商品
  want: (id) => post(`/idle/want/${id}`),

  // 置顶商品
  setTop: (id, hours) => post(`/idle/setTop/${id}`, { hours })
}

/**
 * 交友相关 API
 */
export const loveApi = {
  // 获取交友列表
  getList: (params) => get('/love/list', params),

  // 获取交友详情
  getDetail: (id) => get(`/love/detail/${id}`),

  // 创建/更新交友信息
  saveOrUpdate: (data) => post('/love/saveOrUpdate', data),

  // 喜欢/取消喜欢
  like: (id) => post(`/love/like/${id}`),

  // 评论交友
  comment: (id, content) => post(`/love/comment/${id}`, { content })
}

/**
 * 拍卖相关 API
 */
export const auctionApi = {
  // 获取拍卖列表
  getList: (params) => get('/auction/list', params),

  // 获取拍卖详情
  getDetail: (id) => get(`/auction/detail/${id}`),

  // 创建/更新拍卖
  saveOrUpdate: (data) => post('/auction/saveOrUpdate', data),

  // 出价
  bid: (data) => post('/auction/bid', data),

  // 获取出价记录
  getBidList: (id) => get(`/auction/bidList/${id}`)
}

 /**
 * 互助拍卖相关 API
 */
export const helpApi = {
  // 获取互助拍卖数据（轮播图、公告等）
  getData: (params) => get('/help/data', params),

  // 获取互助拍卖列表
  getList: (params) => get('/help/list', params),

  // 获取互助拍卖详情
  getDetail: (id) => get(`/help/detail/${id}`),

  // 创建/更新互助拍卖
  saveOrUpdate: (data) => post('/help/saveOrUpdate', data),

  // 出价
  bid: (data) => post('/help/bid', data),

  // 获取出价记录列表
  getBidList: (id) => get(`/help/bidList/${id}`)
}

/**
 * 消息相关 API
 */
export const messageApi = {
  // 获取消息列表
  getList: (params) => get('/message/list', params),

  // 标记已读
  markRead: (data) => post('/message/markRead', data)
}

/**
 * 聊天相关 API
 */
export const chatApi = {
  // 获取聊天记录
  getList: (targetId, params) => get(`/chat/list/${targetId}`, params),

  // 发送消息
  send: (data) => post('/chat/send', data)
}

/**
 * 互助群相关 API
 */
export const groupApi = {
  // 获取群消息
  getMessages: (params) => get('/group/messages', params),

  // 发送群消息
  sendMessage: (data) => post('/group/message/send', data)
}

/**
 * 搜索相关 API
 */
export const searchApi = {
  // 搜索内容
  search: (params) => get('/search', params)
}

/**
 * 地区相关 API
 */
export const regionApi = {
  // 获取地区列表
  getList: () => get('/region/list'),
  // 获取校区列表
  getSchools: (regionId) => get('/region/schools', { regionId }),
  // 获取可见范围选项
  getVisibleOptions: () => get('/region/visible-options')
}

/**
 * 配置相关 API
 */
export const configApi = {
  // 获取置顶价格配置
  getTopPricing: (type) => get('/config/top-pricing', { type }),
  // 获取默认时间配置
  getDefaultHours: (type) => get('/config/default-hours', { type })
}

/**
 * 用户中心相关 API
 */
export const userApi = {
  // 我的帖子
  getMyPosts: (params) => get('/user/posts', params),
  deletePost: (id) => post(`/user/posts/${id}/delete`),

  // 我的收藏
  getCollects: (params) => get('/user/collects', params),
  cancelCollects: (ids) => post('/user/collects/cancel', { ids }),

  // 浏览历史
  getHistory: (params) => get('/user/history', params),
  deleteHistory: (id) => post(`/user/history/${id}/delete`),
  clearHistory: () => post('/user/history/clear'),

  // 我的订单
  getOrders: (params) => get('/user/orders', params),
  cancelOrder: (id) => post(`/user/orders/${id}/cancel`),
  confirmOrder: (id) => post(`/user/orders/${id}/confirm`),
  deleteOrder: (id) => post(`/user/orders/${id}/delete`),

  // 消息通知
  getNotifications: (params) => get('/user/notifications', params),
  markNotificationRead: (id) => post(`/user/notifications/${id}/read`),
  markAllNotificationsRead: () => post('/user/notifications/read-all'),

  // 设置相关
  getSettings: () => get('/user/settings'),
  updateSetting: (data) => post('/user/settings/update', data),

  // 隐私设置
  getPrivacySettings: () => get('/user/privacy'),
  updatePrivacySetting: (data) => post('/user/privacy/update', data),
  requestDataDownload: () => post('/user/data/download'),

  // 意见反馈
  submitFeedback: (data) => post('/user/feedback', data)
}

// 导出 setToken 供登录时使用
export { setToken }
