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
const messageController = require('../controllers/messageController')

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

// ==================== 帖子 ====================
router.get('/post/list', postController.getList)
router.get('/post/detail/:id', postController.getDetail)
router.post('/post/saveOrUpdate', postController.saveOrUpdate)
router.post('/post/like/:id', postController.like)
router.post('/post/collect/:id', postController.collect)

// ==================== 投票 ====================
router.get('/vote/list', voteController.getList)
router.get('/vote/detail/:id', voteController.getDetail)
router.post('/vote/saveOrUpdate', voteController.saveOrUpdate)
router.post('/vote/submit', voteController.submit)

// ==================== 跑腿 ====================
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

// ==================== 交友 ====================
router.get('/love/list', loveController.getList)
router.get('/love/detail/:id', loveController.getDetail)
router.post('/love/saveOrUpdate', loveController.saveOrUpdate)
router.post('/love/like/:id', loveController.like)

// ==================== 互助拍卖 ====================
router.get('/help/list', helpController.getList)
router.get('/help/detail/:id', helpController.getDetail)
router.post('/help/saveOrUpdate', helpController.saveOrUpdate)
router.post('/help/bid', helpController.bid)

// ==================== 消息 ====================
router.get('/message/list', messageController.getList)
router.get('/chat/list/:targetId', messageController.getChatList)
router.post('/chat/send', messageController.send)
router.post('/message/markRead', messageController.markRead)

module.exports = router
