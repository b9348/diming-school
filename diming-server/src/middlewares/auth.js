const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未授权，请先登录',
      data: null
    })
  }

  // 将 token 传递给后续中间件
  req.token = token
  next()
}

module.exports = authMiddleware
