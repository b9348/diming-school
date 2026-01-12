/**
 * 主题状态管理
 * 管理全局夜间模式状态
 */

// 缓存 key
const THEME_CACHE_KEY = 'dark_mode'

// 主题状态
const state = {
  darkMode: false,
  listeners: [] // 监听器列表
}

// 初始化：从缓存读取
function initFromCache() {
  try {
    const darkMode = uni.getStorageSync(THEME_CACHE_KEY)
    if (darkMode !== undefined && darkMode !== null) {
      state.darkMode = darkMode
    }
  } catch (e) {
    console.error('读取主题缓存失败', e)
  }
}

// 保存到缓存
function saveToCache() {
  try {
    uni.setStorageSync(THEME_CACHE_KEY, state.darkMode)
  } catch (e) {
    console.error('保存主题缓存失败', e)
  }
}

// 通知所有监听器
function notifyListeners() {
  state.listeners.forEach(listener => {
    try {
      listener(state.darkMode)
    } catch (e) {
      console.error('主题监听器执行失败', e)
    }
  })
}

// 初始化
initFromCache()

export default {
  /**
   * 获取夜间模式状态
   */
  getDarkMode() {
    return state.darkMode
  },

  /**
   * 设置夜间模式
   * @param {boolean} darkMode - 是否开启夜间模式
   */
  setDarkMode(darkMode) {
    state.darkMode = darkMode
    saveToCache()
    notifyListeners()
  },

  /**
   * 切换夜间模式
   */
  toggleDarkMode() {
    this.setDarkMode(!state.darkMode)
    return state.darkMode
  },

  /**
   * 添加监听器
   * @param {function} listener - 监听器函数
   * @returns {function} 取消监听的函数
   */
  addListener(listener) {
    state.listeners.push(listener)
    // 返回取消监听的函数
    return () => {
      const index = state.listeners.indexOf(listener)
      if (index > -1) {
        state.listeners.splice(index, 1)
      }
    }
  },

  /**
   * 移除所有监听器
   */
  clearListeners() {
    state.listeners = []
  }
}
