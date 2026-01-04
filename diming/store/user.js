/**
 * 用户状态管理
 * 包含用户信息和管理员状态
 */
import { AdminRole, AdminRoleName, isAdmin, hasPermission, getAvailableActions } from '@/utils/admin.js'

// 缓存 key
const USER_CACHE_KEY = 'user_info'
const ADMIN_CACHE_KEY = 'admin_info'

// 默认用户信息
const defaultUserInfo = {
  id: '',
  nickname: '',
  avatar: 'https://iph.href.lu/100x100?text=头像',
  phone: '',
  following: 0,
  followers: 0,
  likes: 0,
  isLogin: false
}

// 默认管理员信息
const defaultAdminInfo = {
  role: AdminRole.NONE,
  schoolId: '',       // 管辖的学校ID
  forumIds: [],       // 管辖的论坛ID列表
  permissions: []     // 额外权限
}

// 用户状态
const state = {
  userInfo: { ...defaultUserInfo },
  adminInfo: { ...defaultAdminInfo }
}

// 初始化：从缓存读取
function initFromCache() {
  try {
    const userCache = uni.getStorageSync(USER_CACHE_KEY)
    if (userCache) {
      state.userInfo = { ...defaultUserInfo, ...JSON.parse(userCache) }
    }
    const adminCache = uni.getStorageSync(ADMIN_CACHE_KEY)
    if (adminCache) {
      state.adminInfo = { ...defaultAdminInfo, ...JSON.parse(adminCache) }
    }
  } catch (e) {
    console.error('读取用户缓存失败', e)
  }
}

// 保存到缓存
function saveToCache() {
  try {
    uni.setStorageSync(USER_CACHE_KEY, JSON.stringify(state.userInfo))
    uni.setStorageSync(ADMIN_CACHE_KEY, JSON.stringify(state.adminInfo))
  } catch (e) {
    console.error('保存用户缓存失败', e)
  }
}

// 初始化
initFromCache()

export default {
  /**
   * 获取用户信息
   */
  getUserInfo() {
    return state.userInfo
  },

  /**
   * 设置用户信息
   * @param {object} info - 用户信息
   */
  setUserInfo(info) {
    state.userInfo = { ...state.userInfo, ...info }
    saveToCache()
  },

  /**
   * 获取管理员信息
   */
  getAdminInfo() {
    return state.adminInfo
  },

  /**
   * 设置管理员信息
   * @param {object} info - 管理员信息
   */
  setAdminInfo(info) {
    state.adminInfo = { ...state.adminInfo, ...info }
    saveToCache()
  },

  /**
   * 是否已登录
   */
  isLogin() {
    return state.userInfo.isLogin
  },

  /**
   * 是否为管理员
   */
  isAdmin() {
    return isAdmin(state.adminInfo.role)
  },

  /**
   * 获取当前管理员角色
   */
  getAdminRole() {
    return state.adminInfo.role
  },

  /**
   * 获取管理员角色名称
   */
  getAdminRoleName() {
    return AdminRoleName[state.adminInfo.role] || '普通用户'
  },

  /**
   * 检查是否有某权限
   * @param {string} action - 操作类型
   */
  hasPermission(action) {
    return hasPermission(state.adminInfo.role, action)
  },

  /**
   * 获取可用操作列表
   * @param {object} context - 上下文
   */
  getAvailableActions(context) {
    return getAvailableActions(state.adminInfo.role, context)
  },

  /**
   * 登录
   * @param {object} userInfo - 用户信息
   * @param {object} adminInfo - 管理员信息（可选）
   */
  login(userInfo, adminInfo = null) {
    state.userInfo = {
      ...defaultUserInfo,
      ...userInfo,
      isLogin: true
    }
    if (adminInfo) {
      state.adminInfo = { ...defaultAdminInfo, ...adminInfo }
    }
    saveToCache()
  },

  /**
   * 登出
   */
  logout() {
    state.userInfo = { ...defaultUserInfo }
    state.adminInfo = { ...defaultAdminInfo }
    uni.removeStorageSync(USER_CACHE_KEY)
    uni.removeStorageSync(ADMIN_CACHE_KEY)
  },

  /**
   * 模拟管理员登录（测试用）
   * @param {string} role - 管理员角色
   */
  mockAdminLogin(role = AdminRole.SUPER_ADMIN) {
    this.login({
      id: '100001',
      nickname: '管理员',
      avatar: 'https://iph.href.lu/100x100?text=头像',
      following: 0,
      followers: 0,
      likes: 0
    }, {
      role: role,
      schoolId: 'school_001',
      forumIds: ['forum_001', 'forum_002']
    })
  }
}
