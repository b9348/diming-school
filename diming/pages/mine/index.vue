<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 用户信息区域 -->
    <view class="user-header">
      <view class="user-info" @click="goProfile">
        <image class="user-avatar" :src="userInfo.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
        <view class="user-detail">
          <view class="name-row">
            <text class="user-name">{{ userInfo.nickname || '点击登录' }}</text>
            <text class="admin-badge" v-if="isAdmin">{{ adminRoleName }}</text>
          </view>
          <text class="user-id">ID: {{ userInfo.id || '------' }}</text>
        </view>
        <uni-icons type="right" size="14" color="#999999"></uni-icons>
      </view>
    </view>

    <!-- 滚动区域 -->
    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 功能入口 -->
      <view class="function-grid">
        <view class="function-item" v-for="(item, index) in functionList" :key="index" @click="handleFunction(item)">
          <view class="function-icon-box" :style="{ backgroundColor: item.bgColor }">
            <uni-icons :type="item.action === 'toggleDarkMode' ? (darkMode ? 'smallcircle-filled' : 'smallcircle') : item.icon" size="20" :color="item.iconColor"></uni-icons>
          </view>
          <text class="function-name">{{ item.name }}</text>
        </view>
      </view>

      <!-- 自定义标签 -->
      <view class="tag-section">
        <view class="section-header">
          <text class="section-title">自定义标签</text>
          <text class="section-more" @click="editTags">编辑</text>
        </view>
        <view class="tag-list">
          <view class="tag-item" v-for="(tag, index) in tagList" :key="index">
            {{ tag }}
          </view>
        </view>
      </view>
 

      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <view class="logout-btn" @click="logout">退出登录</view>
      </view>

      <!-- 底部安全区域占位 -->
      <view class="safe-area-bottom"></view>
    </scroll-view>

    <!-- 自定义 TabBar -->
    <dm-tabbar />
  </view>
</template>

<script>
import userStore from '@/store/user.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      userInfo: {
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '张三',
        id: '123456'
      },
      darkMode: false,
      baseFunctionList: [
        { name: '我的帖子', icon: 'compose', iconColor: '#4CAF50', bgColor: '#E8F5E9', path: '/pages/mine/posts' },
        { name: '夜间模式', icon: 'eye-slash', iconColor: '#5856D6', bgColor: '#EDE7F6', action: 'toggleDarkMode' },
        { name: '我的收藏', icon: 'star', iconColor: '#FF9800', bgColor: '#FFF3E0', path: '/pages/mine/collect' },
        { name: '浏览历史', icon: 'eye', iconColor: '#2196F3', bgColor: '#E3F2FD', path: '/pages/mine/history' },
        { name: '我的订单', icon: 'list', iconColor: '#F44336', bgColor: '#FFEBEE', path: '/pages/mine/orders' },
        { name: '身份认证', icon: 'checkmarkempty', iconColor: '#9C27B0', bgColor: '#F3E5F5', path: '/pages/mine/verify' },
        { name: '意见反馈', icon: 'chatbubble', iconColor: '#CDDC39', bgColor: '#FFFDE7', path: '/pages/mine/feedback/index' },
        { name: '客服中心', icon: 'contact', iconColor: '#3F51B5', bgColor: '#E8EAF6', path: '/pages/mine/service' },
        { name: '消息通知', icon: 'notification', iconColor: '#FF5722', bgColor: '#FBE9E7', path: '/pages/mine/notification' },
        { name: '隐私设置', icon: 'locked', iconColor: '#795548', bgColor: '#EFEBE9', path: '/pages/mine/privacy' },
        { name: '设置', icon: 'gear', iconColor: '#607D8B', bgColor: '#ECEFF1', path: '/pages/mine/setting' }
      ],
      adminFunctionList: [
        { name: '收益中心', icon: 'wallet', iconColor: '#FF5722', bgColor: '#FBE9E7', path: '/pages/mine/wallet/index' }
      ],
      tagList: ['学习', '运动', '音乐', '电影', '旅行', '美食'],
      
    }
  },
  computed: {
    isAdmin() {
      return userStore.isAdmin()
    },
    adminRoleName() {
      return userStore.getAdminRoleName()
    },
    functionList() {
      if (this.isAdmin) {
        // 在第4个位置后插入管理员功能
        return [...this.baseFunctionList.slice(0, 4), ...this.adminFunctionList, ...this.baseFunctionList.slice(4)]
      }
      return this.baseFunctionList
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadUserInfo()
    this.darkMode = uni.getStorageSync('darkMode') || false
  },
  onShow() {
    this.loadUserInfo()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const headerHeight = uni.upx2px(200) // 调整头部高度，移除了统计数据部分
      const tabBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - headerHeight - tabBarHeight
    },
    loadUserInfo() {
      const info = userStore.getUserInfo()
      if (info.isLogin) {
        this.userInfo = { ...this.userInfo, ...info }
      }
    },
    goProfile() {
      uni.navigateTo({ url: '/pages/mine/profile' })
    },
    handleFunction(item) {
      if (item.action) {
        this[item.action]()
      } else if (item.path) {
        uni.navigateTo({ url: item.path })
      }
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      uni.setStorageSync('darkMode', this.darkMode)
      uni.showToast({ title: this.darkMode ? '夜间模式已开启' : '夜间模式已关闭', icon: 'none' })
    },
    editTags() {
      uni.showToast({ title: '编辑标签', icon: 'none' })
    },
    handleMenu(item) {
      if (item.path) {
        uni.navigateTo({ url: item.path })
      }
    },
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出当前账号吗？',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 清除用户信息
            userStore.logout()

            // 提示用户
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })

            // 使用 reLaunch 跳转到登录页，清除所有页面栈
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

.status-bar {
  background-color: #007AFF;
}

.user-header {
  padding: 32rpx 24rpx;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);

  .user-info {
    display: flex;
    align-items: center;

    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 24rpx;
    }

    .user-detail {
      flex: 1;

      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
      }

      .user-name {
        font-size: 36rpx;
        color: #FFFFFF;
        font-weight: 600;
      }

      .admin-badge {
        margin-left: 12rpx;
        padding: 4rpx 12rpx;
        font-size: 20rpx;
        color: #FFFFFF;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 8rpx;
      }

      .user-id {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .arrow-icon {
      width: 32rpx;
      height: 32rpx;
      opacity: 0.7;
    }
  }
}

.scroll-container {
  background-color: #F8F8F8;
}

.function-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 24rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;

  .function-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;

    .function-icon-box {
      width: 88rpx;
      height: 88rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;

      .function-icon {
        width: 44rpx;
        height: 44rpx;
      }
    }

    .function-name {
      font-size: 24rpx;
      color: #333333;
    }
  }
}

.tag-section {
  padding: 24rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      color: #333333;
      font-weight: 600;
    }

    .section-more {
      font-size: 26rpx;
      color: #007AFF;
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag-item {
      padding: 12rpx 24rpx;
      font-size: 26rpx;
      color: #666666;
      background-color: #F5F5F5;
      border-radius: 24rpx;
    }
  }
}

.menu-list {
  background-color: #FFFFFF;

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx;
    border-bottom: 1rpx solid #F5F5F5;

    &:last-child {
      border-bottom: none;
    }

    .menu-name {
      font-size: 30rpx;
      color: #333333;
    }

    .menu-right {
      display: flex;
      align-items: center;

      .menu-value {
        font-size: 28rpx;
        color: #999999;
        margin-right: 12rpx;
      }

      .menu-arrow {
        width: 28rpx;
        height: 28rpx;
        opacity: 0.5;
      }
    }
  }
}

.logout-section {
  margin-top: 40rpx;
  padding: 20rpx 24rpx 40rpx;

  .logout-btn {
    height: 88rpx;
    background-color: #FFFFFF;
    border: 2rpx solid #E5E5E5;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #FF3B30;
    font-weight: 600;
  }
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
