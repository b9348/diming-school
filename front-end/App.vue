<script>
/**
 * 检查登录状态并处理路由
 */
const checkLoginStatus = () => {
  // 从缓存直接读取登录状态
  try {
    const userCache = uni.getStorageSync('user_info')
    const isLogin = userCache ? JSON.parse(userCache).isLogin : false

    // 获取当前页面栈
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage ? currentPage.route : ''

    console.log('当前登录状态:', isLogin)
    console.log('当前页面:', currentRoute)

    // 如果已登录且在登录页，跳转到首页
    if (isLogin && currentRoute === 'pages/login/index') {
      console.log('已登录，跳转到首页')
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }, 100)
    }
    // 如果未登录且不在登录页，跳转到登录页
    else if (!isLogin && currentRoute !== 'pages/login/index') {
      console.log('未登录，跳转到登录页')
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }, 100)
    }
  } catch (e) {
    console.error('检查登录状态失败', e)
  }
}

export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
    checkLoginStatus()
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style>
@import '@tuniao/tn-icon/dist/index.css';

/* 全局样式 */
page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

view, text, input, textarea, button, image {
  box-sizing: border-box;
}

/* 清除按钮默认样式 */
button {
  padding: 0;
  margin: 0;
  background-color: transparent;
  border: none;
  border-radius: 0;
}

button::after {
  border: none;
}

/* 文字省略 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* flex布局 */
.flex {
  display: flex;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-1 {
  flex: 1;
}

/* 安全区域适配 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}
</style>
