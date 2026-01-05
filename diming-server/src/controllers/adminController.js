const { successResponse, errorResponse } = require('../utils/response')

// 管理员登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 模拟管理员验证
    if (username === 'admin' && password === 'admin123') {
      successResponse(res, {
        token: 'admin_token_' + Date.now(),
        userInfo: {
          id: 1,
          username: 'admin',
          role: 'SUPER_ADMIN',
          permissions: ['*']
        }
      }, '登录成功')
    } else {
      errorResponse(res, '用户名或密码错误', 401)
    }
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 获取管理员信息
exports.getUserInfo = async (req, res) => {
  try {
    successResponse(res, {
      id: 1,
      username: 'admin',
      role: 'SUPER_ADMIN',
      permissions: ['*']
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 登出
exports.logout = async (req, res) => {
  successResponse(res, null, '登出成功')
}
