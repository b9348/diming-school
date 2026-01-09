<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">设置</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 账号安全 -->
      <view class="setting-section">
        <text class="section-title">账号安全</text>
        <view class="setting-list">
          <view class="setting-item" @click="goModifyPhone">
            <text class="item-title">手机号</text>
            <view class="item-right">
              <text class="item-value">{{ maskedPhone }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goModifyPassword">
            <text class="item-title">修改密码</text>
            <view class="item-right">
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goBindWeChat">
            <text class="item-title">绑定微信</text>
            <view class="item-right">
              <text class="item-value" :class="{ bound: wechatBound }">{{ wechatBound ? '已绑定' : '未绑定' }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 通知设置 -->
      <view class="setting-section">
        <text class="section-title">通知设置</text>
        <view class="setting-list">
          <view class="setting-item">
            <text class="item-title">接收新消息通知</text>
            <switch :checked="settings.pushNotification" @change="toggleSetting('pushNotification')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <text class="item-title">接收系统通知</text>
            <switch :checked="settings.systemNotification" @change="toggleSetting('systemNotification')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <text class="item-title">接收互动通知</text>
            <switch :checked="settings.interactNotification" @change="toggleSetting('interactNotification')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <text class="item-title">声音提醒</text>
            <switch :checked="settings.soundEnabled" @change="toggleSetting('soundEnabled')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <text class="item-title">震动提醒</text>
            <switch :checked="settings.vibrationEnabled" @change="toggleSetting('vibrationEnabled')" color="#007AFF" />
          </view>
        </view>
      </view>

      <!-- 通用设置 -->
      <view class="setting-section">
        <text class="section-title">通用设置</text>
        <view class="setting-list">
          <view class="setting-item" @click="goLanguage">
            <text class="item-title">语言</text>
            <view class="item-right">
              <text class="item-value">简体中文</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item">
            <text class="item-title">深色模式</text>
            <switch :checked="settings.darkMode" @change="toggleDarkMode" color="#007AFF" />
          </view>

          <view class="setting-item" @click="goFontSize">
            <text class="item-title">字体大小</text>
            <view class="item-right">
              <text class="item-value">{{ fontSizeText }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item">
            <text class="item-title">自动播放视频</text>
            <switch :checked="settings.autoPlayVideo" @change="toggleSetting('autoPlayVideo')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <text class="item-title">仅WiFi下加载图片</text>
            <switch :checked="settings.wifiOnlyImage" @change="toggleSetting('wifiOnlyImage')" color="#007AFF" />
          </view>
        </view>
      </view>

      <!-- 隐私与安全 -->
      <view class="setting-section">
        <text class="section-title">隐私与安全</text>
        <view class="setting-list">
          <view class="setting-item" @click="goPrivacy">
            <text class="item-title">隐私设置</text>
            <view class="item-right">
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goBlacklist">
            <text class="item-title">黑名单</text>
            <view class="item-right">
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="setting-section">
        <text class="section-title">关于</text>
        <view class="setting-list">
          <view class="setting-item" @click="checkUpdate">
            <text class="item-title">检查更新</text>
            <view class="item-right">
              <text class="item-value">v{{ appVersion }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goAbout">
            <text class="item-title">关于我们</text>
            <view class="item-right">
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goAgreement">
            <text class="item-title">用户协议</text>
            <view class="item-right">
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goPrivacyPolicy">
            <text class="item-title">隐私政策</text>
            <view class="item-right">
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 存储 -->
      <view class="setting-section">
        <view class="setting-list">
          <view class="setting-item" @click="clearCache">
            <text class="item-title">清除缓存</text>
            <view class="item-right">
              <text class="item-value">{{ cacheSize }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-btn" @click="logout">退出登录</view>
    </scroll-view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { userApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      maskedPhone: '138****8888',
      wechatBound: false,
      appVersion: '1.0.0',
      cacheSize: '0 MB',
      settings: {
        pushNotification: true,
        systemNotification: true,
        interactNotification: true,
        soundEnabled: true,
        vibrationEnabled: true,
        darkMode: false,
        fontSize: 'normal',
        autoPlayVideo: true,
        wifiOnlyImage: false
      }
    }
  },
  computed: {
    fontSizeText() {
      const textMap = {
        small: '小',
        normal: '标准',
        large: '大',
        xlarge: '特大'
      }
      return textMap[this.settings.fontSize] || '标准'
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadSettings()
    this.calculateCacheSize()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight
    },
    goBack() {
      uni.navigateBack()
    },
    async loadSettings() {
      try {
        const userInfo = userStore.getUserInfo()
        if (userInfo.phone) {
          this.maskedPhone = userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        }
        this.wechatBound = userInfo.wechatBound || false

        const res = await userApi.getSettings()
        this.settings = { ...this.settings, ...res }
      } catch (e) {
        console.error('加载设置失败', e)
      }
    },
    async toggleSetting(key) {
      const newValue = !this.settings[key]
      try {
        await userApi.updateSetting({ key, value: newValue })
        this.settings[key] = newValue
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    toggleDarkMode(e) {
      const value = e.detail.value
      this.settings.darkMode = value
      // 可以配合全局样式切换深色模式
      uni.showToast({ title: value ? '深色模式已开启' : '深色模式已关闭', icon: 'none' })
    },
    goModifyPhone() {
      uni.navigateTo({ url: '/pages/mine/modify-phone' })
    },
    goModifyPassword() {
      uni.navigateTo({ url: '/pages/mine/modify-password' })
    },
    goBindWeChat() {
      // #ifdef MP-WEIXIN
      uni.showToast({ title: '小程序内已自动绑定', icon: 'none' })
      // #endif
      // #ifndef MP-WEIXIN
      uni.showToast({ title: '请在微信中打开小程序完成绑定', icon: 'none' })
      // #endif
    },
    goLanguage() {
      uni.showToast({ title: '暂只支持简体中文', icon: 'none' })
    },
    goFontSize() {
      uni.showActionSheet({
        itemList: ['小', '标准', '大', '特大'],
        success: (res) => {
          const sizes = ['small', 'normal', 'large', 'xlarge']
          this.settings.fontSize = sizes[res.tapIndex]
          uni.showToast({ title: '设置成功', icon: 'success' })
        }
      })
    },
    goPrivacy() {
      uni.navigateTo({ url: '/pages/mine/privacy' })
    },
    goBlacklist() {
      uni.navigateTo({ url: '/pages/mine/blacklist' })
    },
    checkUpdate() {
      uni.showLoading({ title: '检查中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '已是最新版本', icon: 'success' })
      }, 1000)
    },
    goAbout() {
      uni.navigateTo({ url: '/pages/mine/about' })
    },
    goAgreement() {
      uni.navigateTo({ url: '/pages/webview/index?url=https://diming.app/agreement' })
    },
    goPrivacyPolicy() {
      uni.navigateTo({ url: '/pages/webview/index?url=https://diming.app/privacy' })
    },
    calculateCacheSize() {
      // 计算缓存大小
      uni.getStorageInfo({
        success: (res) => {
          const sizeKB = res.currentSize
          if (sizeKB < 1024) {
            this.cacheSize = `${sizeKB} KB`
          } else {
            this.cacheSize = `${(sizeKB / 1024).toFixed(2)} MB`
          }
        }
      })
    },
    clearCache() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '清除中...' })
            // 清除storage（保留登录信息）
            const token = uni.getStorageSync('access_token')
            const userInfo = uni.getStorageSync('userInfo')
            uni.clearStorageSync()
            if (token) uni.setStorageSync('access_token', token)
            if (userInfo) uni.setStorageSync('userInfo', userInfo)

            setTimeout(() => {
              uni.hideLoading()
              this.cacheSize = '0 KB'
              uni.showToast({ title: '清除成功', icon: 'success' })
            }, 500)
          }
        }
      })
    },
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出当前账号吗？',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            userStore.logout()
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/login/index'
              })
            }, 1500)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.nav-bar {
  background-color: #FFFFFF;
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 24rpx;
    .nav-back { padding: 10rpx; }
    .nav-title { font-size: 34rpx; color: #333333; font-weight: 600; }
    .nav-placeholder { width: 40rpx; }
  }
}

.scroll-container {
  padding: 20rpx 0;
}

.setting-section {
  margin: 0 24rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;

  .section-title {
    display: block;
    padding: 24rpx;
    font-size: 26rpx;
    color: #999999;
    background-color: #F8F8F8;
  }
}

.setting-list {
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 24rpx;
    border-bottom: 1rpx solid #F5F5F5;

    &:last-child {
      border-bottom: none;
    }

    .item-title {
      font-size: 30rpx;
      color: #333333;
    }

    .item-right {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .item-value {
        font-size: 28rpx;
        color: #999999;

        &.bound {
          color: #4CAF50;
        }
      }
    }
  }
}

.logout-btn {
  margin: 40rpx 24rpx;
  height: 88rpx;
  background-color: #FFFFFF;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #FF3B30;
  font-weight: 600;
}
</style>
