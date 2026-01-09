<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">隐私设置</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 个人信息可见性 -->
      <view class="setting-section">
        <text class="section-title">个人信息可见性</text>
        <view class="setting-list">
          <view class="setting-item">
            <view class="item-info">
              <text class="item-title">显示在线状态</text>
              <text class="item-desc">其他用户可以看到你是否在线</text>
            </view>
            <switch :checked="settings.showOnlineStatus" @change="toggleSetting('showOnlineStatus')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <view class="item-info">
              <text class="item-title">显示最近活跃时间</text>
              <text class="item-desc">其他用户可以看到你的最近活跃时间</text>
            </view>
            <switch :checked="settings.showLastActive" @change="toggleSetting('showLastActive')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <view class="item-info">
              <text class="item-title">允许通过手机号搜索</text>
              <text class="item-desc">其他用户可以通过手机号找到你</text>
            </view>
            <switch :checked="settings.searchByPhone" @change="toggleSetting('searchByPhone')" color="#007AFF" />
          </view>

          <view class="setting-item">
            <view class="item-info">
              <text class="item-title">显示学校信息</text>
              <text class="item-desc">在个人主页显示你的学校</text>
            </view>
            <switch :checked="settings.showSchool" @change="toggleSetting('showSchool')" color="#007AFF" />
          </view>
        </view>
      </view>

      <!-- 互动权限 -->
      <view class="setting-section">
        <text class="section-title">互动权限</text>
        <view class="setting-list">
          <view class="setting-item" @click="goToSetting('whoCanMessage')">
            <view class="item-info">
              <text class="item-title">谁可以私信我</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ getOptionText('whoCanMessage', settings.whoCanMessage) }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goToSetting('whoCanComment')">
            <view class="item-info">
              <text class="item-title">谁可以评论我的内容</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ getOptionText('whoCanComment', settings.whoCanComment) }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>

          <view class="setting-item" @click="goToSetting('whoCanSeeCollects')">
            <view class="item-info">
              <text class="item-title">谁可以看我的收藏</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ getOptionText('whoCanSeeCollects', settings.whoCanSeeCollects) }}</text>
              <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 黑名单管理 -->
      <view class="setting-section">
        <text class="section-title">黑名单管理</text>
        <view class="setting-list">
          <view class="setting-item" @click="goBlacklist">
            <view class="item-info">
              <text class="item-title">黑名单</text>
              <text class="item-desc">已拉黑 {{ blacklistCount }} 人</text>
            </view>
            <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
          </view>
        </view>
      </view>

      <!-- 数据与安全 -->
      <view class="setting-section">
        <text class="section-title">数据与安全</text>
        <view class="setting-list">
          <view class="setting-item" @click="downloadData">
            <view class="item-info">
              <text class="item-title">下载我的数据</text>
              <text class="item-desc">导出你在平台的所有数据</text>
            </view>
            <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
          </view>

          <view class="setting-item" @click="deleteAccount">
            <view class="item-info">
              <text class="item-title delete">注销账号</text>
              <text class="item-desc">永久删除你的账号和所有数据</text>
            </view>
            <text class="tn-icon-right" style="font-size: 16px; color: #CCCCCC;"></text>
          </view>
        </view>
      </view>

      <!-- 协议 -->
      <view class="agreement-section">
        <text class="agreement-link" @click="goPrivacyPolicy">《隐私政策》</text>
        <text class="agreement-link" @click="goUserAgreement">《用户协议》</text>
      </view>
    </scroll-view>

    <!-- 选项弹窗 -->
    <uni-popup ref="optionPopup" type="bottom">
      <view class="option-popup">
        <view class="popup-header">
          <text class="popup-title">{{ currentOptionTitle }}</text>
        </view>
        <view class="option-list">
          <view
            class="option-item"
            :class="{ active: currentOptionValue === option.value }"
            v-for="option in currentOptions"
            :key="option.value"
            @click="selectOption(option.value)"
          >
            <text>{{ option.label }}</text>
            <text v-if="currentOptionValue === option.value" class="tn-icon-success" style="font-size: 18px; color: #007AFF;"></text>
          </view>
        </view>
        <view class="popup-cancel" @click="closePopup">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { userApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      settings: {
        showOnlineStatus: true,
        showLastActive: true,
        searchByPhone: true,
        showSchool: true,
        whoCanMessage: 'all',
        whoCanComment: 'all',
        whoCanSeeCollects: 'all'
      },
      blacklistCount: 0,
      currentSettingKey: '',
      currentOptionTitle: '',
      currentOptionValue: '',
      currentOptions: [],
      optionConfigs: {
        whoCanMessage: {
          title: '谁可以私信我',
          options: [
            { label: '所有人', value: 'all' },
            { label: '仅我订阅的人', value: 'following' },
            { label: '相互订阅的人', value: 'mutual' },
            { label: '关闭私信', value: 'none' }
          ]
        },
        whoCanComment: {
          title: '谁可以评论我的内容',
          options: [
            { label: '所有人', value: 'all' },
            { label: '仅我订阅的人', value: 'following' },
            { label: '关闭评论', value: 'none' }
          ]
        },
        whoCanSeeCollects: {
          title: '谁可以看我的收藏',
          options: [
            { label: '所有人', value: 'all' },
            { label: '仅自己', value: 'self' }
          ]
        }
      }
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadPrivacySettings()
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
    async loadPrivacySettings() {
      try {
        const res = await userApi.getPrivacySettings()
        this.settings = { ...this.settings, ...res.settings }
        this.blacklistCount = res.blacklistCount || 0
      } catch (e) {
        console.error('加载隐私设置失败', e)
      }
    },
    async toggleSetting(key) {
      const newValue = !this.settings[key]
      try {
        await userApi.updatePrivacySetting({ key, value: newValue })
        this.settings[key] = newValue
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
        // 恢复原值
        this.settings[key] = !newValue
      }
    },
    getOptionText(key, value) {
      const config = this.optionConfigs[key]
      if (!config) return ''
      const option = config.options.find(o => o.value === value)
      return option ? option.label : ''
    },
    goToSetting(key) {
      const config = this.optionConfigs[key]
      if (!config) return

      this.currentSettingKey = key
      this.currentOptionTitle = config.title
      this.currentOptions = config.options
      this.currentOptionValue = this.settings[key]
      this.$refs.optionPopup.open()
    },
    async selectOption(value) {
      try {
        await userApi.updatePrivacySetting({
          key: this.currentSettingKey,
          value
        })
        this.settings[this.currentSettingKey] = value
        this.closePopup()
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    closePopup() {
      this.$refs.optionPopup.close()
    },
    goBlacklist() {
      uni.navigateTo({ url: '/pages/mine/blacklist' })
    },
    downloadData() {
      uni.showModal({
        title: '下载数据',
        content: '我们将收集你在平台的所有数据并发送到你的邮箱，这可能需要1-3个工作日',
        confirmText: '确定下载',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.requestDataDownload()
              uni.showToast({ title: '申请已提交', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '申请失败', icon: 'none' })
            }
          }
        }
      })
    },
    deleteAccount() {
      uni.showModal({
        title: '注销账号',
        content: '注销后，你的账号和所有数据将被永久删除，且无法恢复。确定要注销吗？',
        confirmText: '确定注销',
        confirmColor: '#FF3B30',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/mine/delete-account' })
          }
        }
      })
    },
    goPrivacyPolicy() {
      uni.navigateTo({ url: '/pages/webview/index?url=https://diming.app/privacy' })
    },
    goUserAgreement() {
      uni.navigateTo({ url: '/pages/webview/index?url=https://diming.app/agreement' })
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

    .item-info {
      flex: 1;

      .item-title {
        display: block;
        font-size: 30rpx;
        color: #333333;
        margin-bottom: 8rpx;

        &.delete {
          color: #FF3B30;
        }
      }

      .item-desc {
        font-size: 24rpx;
        color: #999999;
      }
    }

    .item-right {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .item-value {
        font-size: 28rpx;
        color: #999999;
      }
    }
  }
}

.agreement-section {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  padding: 40rpx 0;

  .agreement-link {
    font-size: 26rpx;
    color: #007AFF;
  }
}

.option-popup {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);

  .popup-header {
    padding: 32rpx;
    text-align: center;
    border-bottom: 1rpx solid #F5F5F5;

    .popup-title {
      font-size: 32rpx;
      color: #333333;
      font-weight: 600;
    }
  }

  .option-list {
    .option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx;
      border-bottom: 1rpx solid #F5F5F5;

      text {
        font-size: 30rpx;
        color: #333333;
      }

      &.active text {
        color: #007AFF;
      }
    }
  }

  .popup-cancel {
    padding: 32rpx;
    text-align: center;
    font-size: 30rpx;
    color: #999999;
    border-top: 16rpx solid #F5F5F5;
  }
}
</style>
