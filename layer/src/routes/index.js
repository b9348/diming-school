const express = require('express')
const router = express.Router()
const { successResponse } = require('../utils/response')

// 控制器
const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const postController = require('../controllers/postController')
const voteController = require('../controllers/voteController')
const errandController = require('../controllers/errandController')
const idleController = require('../controllers/idleController')
const loveController = require('../controllers/loveController')
const helpController = require('../controllers/helpController')
const auctionController = require('../controllers/auctionController')
const messageController = require('../controllers/messageController')
const searchController = require('../controllers/searchController')
const userController = require('../controllers/userController')
const groupController = require('../controllers/groupController')
const regionController = require('../controllers/regionController')
const configController = require('../controllers/configController')

// 管理后台控制器
const adminController = require('../controllers/adminController')
const adminUserController = require('../controllers/adminUserController')
const adminContentController = require('../controllers/adminContentController')
const adminReportController = require('../controllers/adminReportController')
const adminSensitiveController = require('../controllers/adminSensitiveController')
const adminAIConfigController = require('../controllers/adminAIConfigController')
const adminTradeController = require('../controllers/adminTradeController')
const adminDisputeController = require('../controllers/adminDisputeController')
const adminRefundController = require('../controllers/adminRefundController')
const adminFundController = require('../controllers/adminFundController')
const adminStatisticsController = require('../controllers/adminStatisticsController')
const adminRoleController = require('../controllers/adminRoleController')
const adminSystemController = require('../controllers/adminSystemController')
const adminNoticeController = require('../controllers/adminNoticeController')
const adminVersionController = require('../controllers/adminVersionController')
const adminBannerController = require('../controllers/adminBannerController')
const adminNavController = require('../controllers/adminNavController')
const adminModuleConfigController = require('../controllers/adminModuleConfigController')
const adminForumController = require('../controllers/adminForumController')
const adminConfigController = require('../controllers/adminConfigController')
const adminAuctionController = require('../controllers/adminAuctionController')

// 健康检查
router.get('/health', (req, res) => {
  successResponse(res, { status: 'ok' }, '服务正常')
})

// ==================== 认证 ====================
router.post('/auth/login', authController.login)
router.get('/auth/userInfo', authController.getUserInfo)
router.get('/auth/testAccounts', authController.getTestAccounts)

// ==================== 首页 ====================
router.get('/home/data', homeController.getData)

// ==================== 搜索 ====================
router.get('/search', searchController.search)

// ==================== 帖子 ====================
router.get('/post/list', postController.getList)
router.get('/post/detail/:id', postController.getDetail)
router.post('/post/saveOrUpdate', postController.saveOrUpdate)
router.post('/post/like/:id', postController.like)
router.post('/post/collect/:id', postController.collect)
router.post('/post/comment/:id', postController.comment)

// ==================== 投票 ====================
router.get('/vote/list', voteController.getList)
router.get('/vote/detail/:id', voteController.getDetail)
router.post('/vote/saveOrUpdate', voteController.saveOrUpdate)
router.post('/vote/submit', voteController.submit)
router.post('/vote/comment/:id', voteController.comment)

// ==================== 跑腿 ====================
router.get('/errand/data', errandController.getData)
router.get('/errand/list', errandController.getList)
router.get('/errand/detail/:id', errandController.getDetail)
router.post('/errand/saveOrUpdate', errandController.saveOrUpdate)
router.post('/errand/accept/:id', errandController.accept)
router.post('/errand/complete/:id', errandController.complete)

// ==================== 闲置 ====================
router.get('/idle/list', idleController.getList)
router.get('/idle/detail/:id', idleController.getDetail)
router.post('/idle/saveOrUpdate', idleController.saveOrUpdate)
router.post('/idle/want/:id', idleController.want)
router.post('/idle/setTop/:id', idleController.setTop)

// ==================== 交友 ====================
router.get('/love/list', loveController.getList)
router.get('/love/detail/:id', loveController.getDetail)
router.post('/love/saveOrUpdate', loveController.saveOrUpdate)
router.post('/love/like/:id', loveController.like)
router.post('/love/comment/:id', loveController.comment)

// ==================== 互助拍卖 ====================
router.get('/help/data', helpController.getData)
router.get('/help/list', helpController.getList)
router.get('/help/detail/:id', helpController.getDetail)
router.post('/help/saveOrUpdate', helpController.saveOrUpdate)
router.post('/help/bid', helpController.bid)
router.get('/help/bidList/:id', helpController.getBidList)

// ==================== 拍卖 ====================
router.get('/auction/list', auctionController.getList)
router.get('/auction/detail/:id', auctionController.getDetail)
router.post('/auction/saveOrUpdate', auctionController.saveOrUpdate)
router.post('/auction/bid', auctionController.bid)
router.get('/auction/bidList/:id', auctionController.getBidList)

// ==================== 消息 ====================
router.get('/message/list', messageController.getList)
router.get('/chat/list/:targetId', messageController.getChatList)
router.post('/chat/send', messageController.send)
router.post('/message/markRead', messageController.markRead)

// ==================== 互助群 ====================
router.get('/group/messages', groupController.getMessages)
router.post('/group/message/send', groupController.sendMessage)

// ==================== 地区 ====================
router.get('/region/list', regionController.getList)
router.get('/region/schools', regionController.getSchools)
router.get('/region/visible-options', regionController.getVisibleOptions)

// ==================== 配置 ====================
router.get('/config/top-pricing', configController.getTopPricing)
router.get('/config/default-hours', configController.getDefaultHours)

// ==================== 用户中心 ====================
// 我的帖子
router.get('/user/posts', userController.getMyPosts)
router.post('/user/posts/:id/delete', userController.deletePost)

// 我的收藏
router.get('/user/collects', userController.getCollects)
router.post('/user/collects/cancel', userController.cancelCollects)

// 浏览历史
router.get('/user/history', userController.getHistory)
router.post('/user/history/:id/delete', userController.deleteHistory)
router.post('/user/history/clear', userController.clearHistory)

// 我的订单
router.get('/user/orders', userController.getOrders)
router.post('/user/orders/:id/cancel', userController.cancelOrder)
router.post('/user/orders/:id/confirm', userController.confirmOrder)
router.post('/user/orders/:id/delete', userController.deleteOrder)

// 消息通知
router.get('/user/notifications', userController.getNotifications)
router.post('/user/notifications/:id/read', userController.markNotificationRead)
router.post('/user/notifications/read-all', userController.markAllNotificationsRead)

// 设置
router.get('/user/settings', userController.getSettings)
router.post('/user/settings/update', userController.updateSetting)

// 隐私设置
router.get('/user/privacy', userController.getPrivacySettings)
router.post('/user/privacy/update', userController.updatePrivacySetting)
router.post('/user/data/download', userController.requestDataDownload)

// ==================== 管理后台 ====================
// 管理员认证
router.post('/admin/login', adminController.login)
router.get('/admin/userInfo', adminController.getUserInfo)
router.post('/admin/logout', adminController.logout)

// 用户管理
router.get('/admin/user/list', adminUserController.getList)
router.get('/admin/user/detail/:id', adminUserController.getDetail)
router.post('/admin/user/ban/:id', adminUserController.ban)
router.post('/admin/user/unban/:id', adminUserController.unban)
router.get('/admin/user/verify/list', adminUserController.getVerifyList)
router.post('/admin/user/verify/approve/:id', adminUserController.approveVerify)
router.post('/admin/user/verify/reject/:id', adminUserController.rejectVerify)

// 内容管理
router.get('/admin/content/audit/list', adminContentController.getAuditList)
router.post('/admin/content/approve/:id', adminContentController.approve)
router.post('/admin/content/reject/:id', adminContentController.reject)
router.post('/admin/content/saveOrUpdate', adminContentController.saveOrUpdate)

// 举报管理
router.get('/admin/report/list', adminReportController.getList)
router.post('/admin/report/handle/:id', adminReportController.handle)

// 敏感词管理
router.get('/admin/sensitive/list', adminSensitiveController.getList)
router.post('/admin/sensitive/saveOrUpdate', adminSensitiveController.saveOrUpdate)
router.post('/admin/sensitive/batch', adminSensitiveController.batchAdd)

// AI审核配置
router.get('/admin/ai-config', adminAIConfigController.getConfig)
router.post('/admin/ai-config', adminAIConfigController.saveConfig)
router.post('/admin/ai-config/test', adminAIConfigController.testConfig)

// 交易管理
router.get('/admin/order/list', adminTradeController.getOrderList)
router.get('/admin/order/detail/:id', adminTradeController.getOrderDetail)
router.get('/admin/dispute/list', adminDisputeController.getDisputeList)
router.post('/admin/dispute/handle/:id', adminDisputeController.handleDispute)
router.get('/admin/refund/list', adminRefundController.getRefundList)
router.post('/admin/refund/approve/:id', adminRefundController.approveRefund)
router.post('/admin/refund/reject/:id', adminRefundController.rejectRefund)
router.get('/admin/fund/flow', adminFundController.getFundFlow)

// 数据统计
router.get('/admin/statistics/dashboard', adminStatisticsController.getDashboard)
router.get('/admin/statistics/user-growth', adminStatisticsController.getUserGrowth)
router.get('/admin/statistics/active', adminStatisticsController.getActiveData)
router.get('/admin/statistics/trade', adminStatisticsController.getTradeData)
router.get('/admin/statistics/income', adminStatisticsController.getIncomeData)

// 系统设置
router.get('/admin/role/list', adminRoleController.getRoleList)
router.get('/admin/permission/list', adminRoleController.getPermissions)
router.post('/admin/role/saveOrUpdate', adminRoleController.saveOrUpdate)
router.get('/admin/system/config', adminSystemController.getConfig)
router.post('/admin/system/config', adminSystemController.saveConfig)
router.get('/admin/notice/list', adminNoticeController.getList)
router.post('/admin/notice/saveOrUpdate', adminNoticeController.saveOrUpdate)
router.get('/admin/version/list', adminVersionController.getList)
router.post('/admin/version/saveOrUpdate', adminVersionController.saveOrUpdate)

// 轮播图管理
router.get('/admin/banner/list', adminBannerController.getList)
router.post('/admin/banner/saveOrUpdate', adminBannerController.saveOrUpdate)

// 导航分类管理
router.get('/admin/nav/list', adminNavController.getList)
router.post('/admin/nav/saveOrUpdate', adminNavController.saveOrUpdate)

// 模块筛选配置
router.get('/admin/module-config/:module', adminModuleConfigController.getConfig)
router.post('/admin/module-config/saveOrUpdate', adminModuleConfigController.saveOrUpdate)

// 论坛管理
router.get('/admin/forum/list', adminForumController.getList)
router.post('/admin/forum/saveOrUpdate', adminForumController.saveOrUpdate)
router.post('/admin/forum/:id/admins', adminForumController.addAdmins)

// 配置管理
router.get('/admin/config/pricing', adminConfigController.getPricingList)
router.post('/admin/config/pricing', adminConfigController.savePricing)
router.get('/admin/config/region', adminConfigController.getRegionList)
router.post('/admin/config/region', adminConfigController.saveRegion)
router.post('/admin/config/region/:id/delete', adminConfigController.deleteRegion)

// 拍卖管理
router.get('/admin/auction/list', adminAuctionController.getList)
router.get('/admin/auction/detail/:id', adminAuctionController.getDetail)
router.post('/admin/auction/saveOrUpdate', adminAuctionController.saveOrUpdate)
router.post('/admin/auction/delete/:id', adminAuctionController.delete)
router.get('/admin/auction/bidList/:id', adminAuctionController.getBidList)

module.exports = router
