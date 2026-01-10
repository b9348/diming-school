import { get, post, put, del } from '@/utils/request'

// 管理员认证
export const adminApi = {
  login: (data) => post('/admin/login', data),
  getUserInfo: () => get('/admin/userInfo'),
  logout: () => post('/admin/logout')
}

// 用户管理
export const userApi = {
  getList: (params) => get('/admin/user/list', params),
  getDetail: (id) => get(`/admin/user/detail/${id}`),
  ban: (id, data) => post(`/admin/user/ban/${id}`, data),
  unban: (id) => post(`/admin/user/unban/${id}`),
  getVerifyList: (params) => get('/admin/user/verify/list', params),
  approveVerify: (id) => post(`/admin/user/verify/approve/${id}`),
  rejectVerify: (id, data) => post(`/admin/user/verify/reject/${id}`, data)
}

// 内容管理
export const contentApi = {
  getAuditList: (params) => get('/admin/content/audit/list', params),
  approve: (id) => post(`/admin/content/approve/${id}`),
  reject: (id, data) => post(`/admin/content/reject/${id}`, data),
  saveOrUpdate: (data) => post('/admin/content/saveOrUpdate', data),
  getReportList: (params) => get('/admin/report/list', params),
  handleReport: (id, data) => post(`/admin/report/handle/${id}`, data)
}

// 敏感词管理
export const sensitiveApi = {
  getList: (params) => get('/admin/sensitive/list', params),
  saveOrUpdate: (data) => post('/admin/sensitive/saveOrUpdate', data),
  batchAdd: (data) => post('/admin/sensitive/batch', data)
}

// AI审核配置
export const aiConfigApi = {
  getConfig: () => get('/admin/ai-config'),
  saveConfig: (data) => post('/admin/ai-config', data),
  testConfig: (data) => post('/admin/ai-config/test', data)
}

// 交易管理
export const tradeApi = {
  getOrderList: (params) => get('/admin/order/list', params),
  getOrderDetail: (id) => get(`/admin/order/detail/${id}`),
  getDisputeList: (params) => get('/admin/dispute/list', params),
  handleDispute: (id, data) => post(`/admin/dispute/handle/${id}`, data),
  getRefundList: (params) => get('/admin/refund/list', params),
  approveRefund: (id) => post(`/admin/refund/approve/${id}`),
  rejectRefund: (id, data) => post(`/admin/refund/reject/${id}`, data),
  getFundFlow: (params) => get('/admin/fund/flow', params)
}

// 数据统计
export const statisticsApi = {
  getDashboard: () => get('/admin/statistics/dashboard'),
  getUserGrowth: (params) => get('/admin/statistics/user-growth', params),
  getActiveData: (params) => get('/admin/statistics/active', params),
  getTradeData: (params) => get('/admin/statistics/trade', params),
  getIncomeData: (params) => get('/admin/statistics/income', params)
}

// 系统设置
export const systemApi = {
  getRoleList: () => get('/admin/role/list'),
  getPermissions: () => get('/admin/permission/list'),
  saveRole: (data) => post('/admin/role/saveOrUpdate', data),
  getConfig: () => get('/admin/system/config'),
  saveConfig: (data) => post('/admin/system/config', data),
  getNoticeList: (params) => get('/admin/notice/list', params),
  saveNotice: (data) => post('/admin/notice/saveOrUpdate', data),
  getVersionList: (params) => get('/admin/version/list', params),
  saveVersion: (data) => post('/admin/version/saveOrUpdate', data)
}

// 轮播图管理
export const bannerApi = {
  list: (params) => get('/admin/banner/list', params),
  saveOrUpdate: (data) => post('/admin/banner/saveOrUpdate', data)
}

// 导航分类管理
export const navApi = {
  list: (params) => get('/admin/nav/list', params),
  saveOrUpdate: (data) => post('/admin/nav/saveOrUpdate', data)
}

// 模块筛选配置
export const moduleConfigApi = {
  getConfig: (module) => get(`/admin/module-config/${module}`),
  saveOrUpdate: (data) => post('/admin/module-config/saveOrUpdate', data)
}

// 论坛管理
export const forumApi = {
  list: (params) => get('/admin/forum/list', params),
  saveOrUpdate: (data) => post('/admin/forum/saveOrUpdate', data),
  addAdmins: (id, data) => post(`/admin/forum/${id}/admins`, data)
}

// 配置管理
export const configApi = {
  getPricingList: () => get('/admin/config/pricing'),
  savePricing: (data) => post('/admin/config/pricing', data),
  getRegionList: () => get('/admin/config/region'),
  saveRegion: (data) => post('/admin/config/region', data),
  deleteRegion: (id) => post(`/admin/config/region/${id}/delete`)
}
