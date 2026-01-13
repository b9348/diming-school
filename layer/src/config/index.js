module.exports = {
  port: process.env.NODE_ENV === 'production' ? 20715 : (process.env.PORT || 5102),
  isDev: process.env.NODE_ENV === 'development',
  backendUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'http://47.120.68.27:8000'
}
