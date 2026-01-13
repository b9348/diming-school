// vue.config.js
// H5 开发环境代理配置
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.120.68.27:20715',
        changeOrigin: true,
        ws: true
      }
    }
  }
}
