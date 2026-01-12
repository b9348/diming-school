/**
 * 夜间模式 Mixin
 * 在页面中引入此 mixin 即可自动支持夜间模式
 */
import themeStore from '@/store/theme.js'

export default {
  data() {
    return {
      darkMode: false
    }
  },
  onLoad() {
    // 初始化夜间模式状态
    this.darkMode = themeStore.getDarkMode()
    // 监听主题变化
    this.unsubscribeTheme = themeStore.addListener((darkMode) => {
      this.darkMode = darkMode
    })
  },
  onUnload() {
    // 取消监听
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme()
    }
  }
}
