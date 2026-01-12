/**
 * 组件基类 Mixin - 提供夜间模式等通用功能
 * 所有组件都应该引入此 mixin
 */
import themeStore from '@/store/theme.js'

export default {
  data() {
    return {
      darkMode: false
    }
  },
  created() {
    // 初始化夜间模式状态
    this.darkMode = themeStore.getDarkMode()
    // 监听主题变化
    this._unsubscribeTheme = themeStore.addListener((darkMode) => {
      this.darkMode = darkMode
    })
  },
  beforeDestroy() {
    // 取消监听
    if (this._unsubscribeTheme) {
      this._unsubscribeTheme()
    }
  }
}
