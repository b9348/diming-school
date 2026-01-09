<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 用户信息区域 -->
    <view class="user-header" :style="{ paddingTop: capsuleTop ? (capsuleTop - statusBarHeight + capsuleHeight + 8) + 'px' : '32rpx' }">
      <view class="user-info" @click="goProfile">
        <view class="user-detail">
          <view class="name-row">
            <text class="user-name">{{ userInfo.nickname || '点击登录' }}</text>
            <text class="admin-badge" v-if="isAdmin">{{ adminRoleName }}</text>
          </view>
          <text class="forum-name">{{ currentForum || '论坛名称' }}</text>
        </view>
        <image class="user-avatar" :src="userInfo.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
        <view class="switch-forum-btn" @click.stop="switchForum">
          <i class="tn-icon-refresh" style="color: #FFFFFF; font-size: 22px;"></i>
        </view>
      </view>
    </view>

    <!-- 滚动区域 -->
    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 功能入口 -->
      <view class="function-grid">
        <view class="function-item" v-for="(item, index) in functionList" :key="index" @click="handleFunction(item)">
          <view class="function-icon-box" :style="{ backgroundColor: item.bgColor }">
            <i :class="'tn-icon-' + (item.action === 'toggleDarkMode' ? (darkMode ? 'moon' : 'wea-sun') : item.icon)" :style="{ color: item.iconColor, fontSize: '20px' }"></i>
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

      <!-- 论坛图片展示区域 -->
      <view class="forum-banner" v-if="forumBanner">
        <image class="banner-image" :src="forumBanner" mode="aspectFill" @click="handleBannerClick"></image>
      </view>
      <view class="forum-banner-placeholder" v-else>
        <text class="placeholder-text">论坛管理员可上传图片</text>
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
      capsuleHeight: 0, // 胶囊按钮高度
      capsuleTop: 0, // 胶囊按钮距离顶部距离
      scrollHeight: 0,
      userInfo: {
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '张三',
        id: '123456'
      },
      darkMode: false,
      currentForum: '',
      baseFunctionList: [
        // 第一排
        { name: '我的发布', icon: 'edit', iconColor: '#4CAF50', bgColor: '#E8F5E9', path: '/pages/mine/posts' },
        { name: '夜间模式', icon: 'sun', iconColor: '#FF9800', bgColor: '#FFF3E0', action: 'toggleDarkMode' },
        { name: '我的评论', icon: 'message', iconColor: '#2196F3', bgColor: '#E3F2FD', path: '/pages/mine/comments' },
        { name: '我的收藏', icon: 'star', iconColor: '#FF9800', bgColor: '#FFF3E0', path: '/pages/mine/collect' },
        // 第二排
        { name: '学生认证', icon: 'identity', iconColor: '#9C27B0', bgColor: '#F3E5F5', path: '/pages/mine/verify' },
        { name: '编辑资料', icon: 'edit-form', iconColor: '#3F51B5', bgColor: '#E8EAF6', path: '/pages/mine/profile/edit' },
        { name: '收益中心', icon: 'lucky-money', iconColor: '#FF5722', bgColor: '#FBE9E7', path: '/pages/mine/wallet/index' },
        { name: '申请解禁', icon: 'lock', iconColor: '#795548', bgColor: '#EFEBE9', path: '/pages/mine/unban' },
        // 第三排
        { name: '意见建议', icon: 'edit', iconColor: '#CDDC39', bgColor: '#FFFDE7', path: '/pages/mine/feedback/index' },
        { name: '本校客服', icon: 'service', iconColor: '#00BCD4', bgColor: '#E0F7FA', path: '/pages/mine/service/forum' },
        { name: '总管理员客服', icon: 'service', iconColor: '#607D8B', bgColor: '#ECEFF1', path: '/pages/mine/service/admin' },
        { name: '平台客服', icon: 'service', iconColor: '#FF5722', bgColor: '#FBE9E7', path: '/pages/mine/service/platform' }
      ],
      adminFunctionList: [],
      tagList: ['学习', '运动', '音乐', '电影', '旅行', '美食'],
      forumBanner: '',
      
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
        // 在第6个位置后插入管理员功能（编辑资料之后，申请解禁之前）
        return [...this.baseFunctionList.slice(0, 6), ...this.adminFunctionList, ...this.baseFunctionList.slice(6)]
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
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight

      // 获取胶囊按钮信息（仅小程序环境）
      // #ifdef MP-WEIXIN
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.capsuleTop = menuButtonInfo.top
      this.capsuleHeight = menuButtonInfo.height
      // #endif

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
    switchForum() {
      // 跳转到论坛搜索/切换页面
      uni.navigateTo({ url: '/pages/forum/switch' })
    },
    editTags() {
      uni.showToast({ title: '编辑标签', icon: 'none' })
    },
    handleBannerClick() {
      // 点击论坛图片的处理逻辑
      if (this.forumBanner) {
        uni.previewImage({
          urls: [this.forumBanner]
        })
      }
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

      .forum-name {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .user-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 20rpx;
    }

    .switch-forum-btn {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
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

.forum-banner {
  margin: 0 24rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .banner-image {
    width: 100%;
    height: 300rpx;
  }
}

.forum-banner-placeholder {
  margin: 0 24rpx 20rpx;
  height: 300rpx;
  background-color: #F5F5F5;
  border-radius: 16rpx;
  border: 2rpx dashed #DDDDDD;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder-text {
    font-size: 26rpx;
    color: #999999;
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
