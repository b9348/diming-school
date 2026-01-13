/**
 * 统一网络请求工具
 * - 自动添加 token
 * - 统一响应处理（code 判断、错误提示）
 * - 401 自动跳转登录
 * - 直接返回 res.data，页面无需判断 code
 */
import userStore from '@/store/user.js'

// API 基础路径
const getBaseUrl = () => {
  // #ifdef H5
  // H5 开发环境使用相对路径，由 devServer 代理
  return '/api'
  // #endif

  // #ifdef MP-WEIXIN
  // #ifdef DEV
  return 'http://localhost:5102/api'
  // #else
  return 'http://47.120.68.27:20715/api'
  // #endif
  // #endif

  // #ifdef APP-PLUS
  // #ifdef DEV
  return 'http://localhost:5102/api'
  // #else
  return 'http://47.120.68.27:20715/api'
  // #endif
  // #endif

  return '/api'
}

const BASE_URL = getBaseUrl()

// Token 缓存 key
const TOKEN_KEY = 'access_token'

/**
 * 获取 token
 */
const getToken = () => {
  return uni.getStorageSync(TOKEN_KEY)
}

/**
 * 设置 token
 */
const setToken = (token) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

/**
 * 移除 token
 */
const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}

/**
 * 统一请求方法
 * @param {object} options - 请求配置
 * @returns {Promise} - 返回 Promise，resolve 时直接返回 data
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = getToken()

    // 构建请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }

    // 添加 token
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header,
      timeout: options.timeout || 10000,
      success: (res) => {
        const { statusCode, data } = res

        // HTTP 状态码错误
        if (statusCode !== 200) {
          handleError(statusCode, data?.message || '请求失败')
          reject(new Error(data?.message || '请求失败'))
          return
        }

        // 业务状态码判断
        if (data.code === 200) {
          // 成功，直接返回 data 字段
          resolve(data.data)
        } else if (data.code === 401) {
          // 未授权，跳转登录
          handleUnauthorized()
          reject(new Error(data.message || '请先登录'))
        } else {
          // 其他业务错误
          handleError(data.code, data.message)
          reject(new Error(data.message || '请求失败'))
        }
      },
      fail: (err) => {
        // 网络错误
        handleNetworkError(err)
        reject(err)
      }
    })
  })
}

/**
 * 处理未授权
 */
const handleUnauthorized = () => {
  // 清除 token 和用户信息
  removeToken()
  userStore.logout()

  // 显示提示
  uni.showToast({
    title: '请先登录',
    icon: 'none',
    duration: 1500
  })

  // 跳转登录页
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/index'
    })
  }, 1500)
}

/**
 * 处理业务错误
 */
const handleError = (code, message) => {
  uni.showToast({
    title: message || '请求失败',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 处理网络错误
 */
const handleNetworkError = (err) => {
  let message = '网络连接失败'

  if (err.errMsg) {
    if (err.errMsg.includes('timeout')) {
      message = '请求超时'
    } else if (err.errMsg.includes('fail')) {
      message = '网络连接失败'
    }
  }

  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * GET 请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求参数
 * @param {object} options - 额外配置
 */
export const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST 请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求数据
 * @param {object} options - 额外配置
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

// 导出 token 相关方法
export { getToken, setToken, removeToken }

export default request
