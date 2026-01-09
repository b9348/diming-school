<template>
  <view class="login-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部装饰 -->
    <view class="header-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>

    <!-- Logo 和标题 -->
    <view class="logo-section">
      <image class="logo" src="https://iph.href.lu/160x160?text=LOGO" mode="aspectFit"></image>
      <text class="app-name">地鸣校园</text>
      <text class="app-slogan">连接校园，分享生活</text>
    </view>

    <!-- 测试账号区域 -->
    <view class="test-accounts" v-if="!loading">
      <text class="section-title">快速登录（测试）</text>

      <!-- 管理员账号 -->
      <view class="account-group">
        <text class="group-title">管理员账号</text>
        <view class="account-list">
          <view
            class="account-btn admin-btn"
            v-for="item in adminAccounts"
            :key="item.id"
            @click="quickLogin(item)"
          >
            <view class="account-info">
              <text class="account-name">{{ item.nickname }}</text>
              <text class="account-role">{{ item.roleName }}</text>
            </view>
            <text class="tn-icon-right" style="font-size: 16px; color: #FFFFFF;"></text>
          </view>
        </view>
      </view>

      <!-- 普通用户账号 -->
      <view class="account-group">
        <text class="group-title">普通用户账号</text>
        <view class="account-list">
          <view
            class="account-btn user-btn"
            v-for="item in userAccounts"
            :key="item.id"
            @click="quickLogin(item)"
          >
            <view class="account-info">
              <text class="account-name">{{ item.nickname }}</text>
              <text class="account-id">ID: {{ item.id }}</text>
            </view>
            <text class="tn-icon-right" style="font-size: 16px; color: #007AFF;"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view class="loading-section" v-else>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 底部说明 -->
    <view class="footer-tips">
      <text class="tips-text">仅供测试使用，点击即可快速登录</text>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { authApi, setToken } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      loading: true,
      adminAccounts: [],
      userAccounts: []
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.checkLogin()
    this.loadTestAccounts()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
    },
    checkLogin() {
      // 直接从缓存读取登录状态，避免 Pinia 注入上下文问题
      try {
        const userCache = uni.getStorageSync('user_info')
        const isLogin = userCache ? JSON.parse(userCache).isLogin : false
        if (isLogin) {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }
      } catch (e) {
        console.error('检查登录状态失败', e)
      }
    },
    loadTestAccounts() {
      this.loading = true
      authApi.getTestAccounts().then(data => {
        this.adminAccounts = data.admins || []
        this.userAccounts = data.users || []
        this.loading = false
      })
    },
    quickLogin(account) {
      uni.showLoading({ title: '登录中...' })

      authApi.login({ accountId: account.id }).then(data => {
        setToken(data.token)
        userStore.login(data.userInfo, data.adminInfo)
        uni.hideLoading()
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.status-bar {
  background-color: transparent;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .circle-1 {
    width: 300rpx;
    height: 300rpx;
    top: -100rpx;
    right: -50rpx;
  }

  .circle-2 {
    width: 200rpx;
    height: 200rpx;
    top: 100rpx;
    left: -80rpx;
  }

  .circle-3 {
    width: 150rpx;
    height: 150rpx;
    top: 250rpx;
    right: 100rpx;
  }
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 60rpx;
  position: relative;
  z-index: 1;

  .logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 32rpx;
    background-color: #FFFFFF;
    border-radius: 32rpx;
  }

  .app-name {
    font-size: 48rpx;
    color: #FFFFFF;
    font-weight: 600;
    margin-bottom: 16rpx;
  }

  .app-slogan {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.test-accounts {
  padding: 0 32rpx;
  position: relative;
  z-index: 1;

  .section-title {
    display: block;
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 600;
    margin-bottom: 32rpx;
    text-align: center;
  }

  .account-group {
    margin-bottom: 40rpx;

    .group-title {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 20rpx;
      padding-left: 12rpx;
    }

    .account-list {
      display: flex;
      flex-direction: column;
      gap: 16rpx;
    }

    .account-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 28rpx;
      border-radius: 16rpx;
      transition: all 0.3s;

      &:active {
        opacity: 0.8;
        transform: scale(0.98);
      }

      .account-info {
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .account-name {
          font-size: 32rpx;
          font-weight: 500;
        }

        .account-role,
        .account-id {
          font-size: 24rpx;
          opacity: 0.8;
        }
      }
    }

    .admin-btn {
      background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
      color: #FFFFFF;
    }

    .user-btn {
      background: #FFFFFF;
      color: #333333;

      .account-id {
        color: #999999;
      }
    }
  }
}

.loading-section {
  padding: 100rpx 0;
  text-align: center;

  .loading-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.footer-tips {
  padding: 40rpx 32rpx;
  text-align: center;
  position: relative;
  z-index: 1;

  .tips-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
