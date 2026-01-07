import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error
    if (response?.status === 401) {
      localStorage.removeItem('admin_token')
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export const get = (url, params) => request.get(url, { params })
export const post = (url, data) => request.post(url, data)
export const put = (url, data) => request.put(url, data)
export const del = (url) => request.delete(url)

export default request
