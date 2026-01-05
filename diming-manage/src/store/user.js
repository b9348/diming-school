import { defineStore } from 'pinia'
import { adminApi } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    userInfo: null,
    permissions: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    role: (state) => state.userInfo?.role || ''
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('admin_token', token)
    },

    setUserInfo(info) {
      this.userInfo = info
      this.permissions = info.permissions || []
    },

    async login(credentials) {
      const res = await adminApi.login(credentials)
      if (res.code === 200) {
        this.setToken(res.data.token)
        this.setUserInfo(res.data.userInfo)
      }
      return res
    },

    async getUserInfo() {
      const res = await adminApi.getUserInfo()
      if (res.code === 200) {
        this.setUserInfo(res.data)
      }
      return res
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      localStorage.removeItem('admin_token')
    },

    hasPermission(permission) {
      return this.permissions.includes(permission) || this.role === 'SUPER_ADMIN'
    }
  }
})
