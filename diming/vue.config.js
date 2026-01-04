// vue.config.js
// H5 开发环境代理配置
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5102',
        changeOrigin: true,
        ws: true
      }
    }
  }
}
