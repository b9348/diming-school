const { successResponse, errorResponse } = require('../utils/response')

// 测试账号数据
const testAccounts = {
  admins: [
    {
      id: 'admin001',
      nickname: '总管理员',
      avatar: 'https://iph.href.lu/100x100?text=总管',
      role: 'super_admin',
      roleName: '总管理员',
      following: 500,
      followers: 1000,
      likes: 5000
    },
    {
      id: 'admin002',
      nickname: '平台管理员',
      avatar: 'https://iph.href.lu/100x100?text=平台',
      role: 'platform_admin',
      roleName: '平台管理员',
      following: 450,
      followers: 900,
      likes: 4500
    },
    {
      id: 'admin003',
      nickname: '平台分管理员',
      avatar: 'https://iph.href.lu/100x100?text=平台分',
      role: 'platform_sub_admin',
      roleName: '平台分管理员',
      following: 300,
      followers: 600,
      likes: 3000
    },
    {
      id: 'admin004',
      nickname: '论坛管理员',
      avatar: 'https://iph.href.lu/100x100?text=论坛',
      role: 'forum_admin',
      roleName: '论坛管理员（分管理员）',
      following: 250,
      followers: 500,
      likes: 2500
    },
    {
      id: 'admin005',
      nickname: '论坛子管理员',
      avatar: 'https://iph.href.lu/100x100?text=子管',
      role: 'sub_admin',
      roleName: '论坛子管理员',
      following: 200,
      followers: 400,
      likes: 2000
    }
  ],
  users: [
    {
      id: 'user001',
      nickname: '张三',
      avatar: 'https://iph.href.lu/100x100?text=头像',
      role: 'user',
      following: 128,
      followers: 256,
      likes: 1024
    },
    {
      id: 'user002',
      nickname: '李四',
      avatar: 'https://iph.href.lu/100x100?text=头像',
      role: 'user',
      following: 88,
      followers: 156,
      likes: 688
    },
    {
      id: 'user003',
      nickname: '王五',
      avatar: 'https://iph.href.lu/100x100?text=头像',
      role: 'user',
      following: 66,
      followers: 99,
      likes: 456
    }
  ]
}

// 登录
const login = (req, res) => {
  const { accountId } = req.body

  if (!accountId) {
    return errorResponse(res, '账号ID不能为空', 400)
  }

  // 查找账号
  const allAccounts = [...testAccounts.admins, ...testAccounts.users]
  const account = allAccounts.find(a => a.id === accountId)

  if (!account) {
    return errorResponse(res, '账号不存在', 404)
  }

  // 生成 token
  const token = `token-${account.id}-${Date.now()}`

  // 构建用户信息
  const { role, roleName, ...userInfo } = account
  userInfo.isLogin = true

  // 构建管理员信息
  let adminInfo = null
  if (role && role !== 'user') {
    adminInfo = {
      role: role,
      schoolId: 'school_001',
      forumIds: ['forum_001', 'forum_002'],
      permissions: []
    }
  }

  successResponse(res, {
    token,
    userInfo,
    adminInfo
  }, '登录成功')
}

// 获取用户信息
const getUserInfo = (req, res) => {
  // 从 token 中解析用户 ID
  const token = req.headers.authorization
  if (!token) {
    return errorResponse(res, '未登录', 401)
  }

  // 简单解析 token 获取用户 ID
  const parts = token.replace('Bearer ', '').split('-')
  const accountId = parts[1]

  const allAccounts = [...testAccounts.admins, ...testAccounts.users]
  const account = allAccounts.find(a => a.id === accountId)

  if (!account) {
    return errorResponse(res, '用户不存在', 404)
  }

  const { role, roleName, ...userInfo } = account
  userInfo.isLogin = true

  let adminInfo = null
  if (role && role !== 'user') {
    adminInfo = {
      role: role,
      schoolId: 'school_001',
      forumIds: ['forum_001', 'forum_002'],
      permissions: []
    }
  }

  successResponse(res, {
    userInfo,
    adminInfo
  })
}

// 获取测试账号列表
const getTestAccounts = (req, res) => {
  successResponse(res, testAccounts)
}

module.exports = {
  login,
  getUserInfo,
  getTestAccounts
}
