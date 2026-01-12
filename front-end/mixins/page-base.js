/**
 * 页面基类 Mixin - 提供夜间模式等通用功能
 * 所有页面都应该引入此 mixin
 */
import themeStore from '@/store/theme.js'

export default {
  data() {
    return {
      darkMode: false
    }
  },
  onShow() {
    // 每次显示页面时更新夜间模式状态
    this.darkMode = themeStore.getDarkMode()
  },
  onLoad() {
    // 初始化夜间模式状态
    this.darkMode = themeStore.getDarkMode()
    // 监听主题变化
    this._unsubscribeTheme = themeStore.addListener((darkMode) => {
      this.darkMode = darkMode
    })
  },
  onUnload() {
    // 取消监听
    if (this._unsubscribeTheme) {
      this._unsubscribeTheme()
    }
  }
}
