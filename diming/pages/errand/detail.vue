<template>
  <view class="page-container">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">跑腿详情</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 管理员操作菜单 -->
    <dm-admin-menu
      :show="showAdminMenu"
      :target="data"
      :target-user="data.userInfo"
      @update:show="showAdminMenu = $event"
      @action="handleAdminAction"
    />

    <scroll-view class="content-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 价格和状态 -->
      <view class="price-section">
        <view class="price-box">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ data.price }}</text>
        </view>
        <text class="status-tag">{{ data.status }}</text>
        <!-- 管理按钮 -->
        <view class="admin-btn" v-if="isAdmin" @click="showAdminMenu = true">
          <uni-icons type="gear" size="16" color="#FF6B6B"></uni-icons>
          <text>管理</text>
        </view>
      </view>

      <!-- 任务信息 -->
      <view class="info-section">
        <view class="info-item">
          <text class="info-label">任务类型</text>
          <text class="info-value">{{ data.type }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">截止时间</text>
          <text class="info-value">{{ data.deadline }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">取货地点</text>
          <text class="info-value">{{ data.pickupLocation }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">送达地点</text>
          <text class="info-value">{{ data.deliveryLocation }}</text>
        </view>
      </view>

      <!-- 任务描述 -->
      <view class="desc-section">
        <text class="section-title">任务描述</text>
        <text class="desc-text">{{ data.content }}</text>
        <view class="image-list" v-if="data.images && data.images.length">
          <image v-for="(img, i) in data.images" :key="i" class="desc-image" :src="img" mode="aspectFill" @click="previewImage(i)"></image>
        </view>
      </view>

      <!-- 发布者信息 -->
      <view class="user-section">
        <image class="user-avatar" :src="data.avatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ data.nickname }}</text>
          <text class="user-time">{{ data.time }}</text>
        </view>
        <view class="contact-btn" @click="contactUser">联系TA</view>
      </view>
    </scroll-view>

    <view class="bottom-bar safe-area-bottom">
      <view class="btn-grab" @click="handleGrab">立即抢单</view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { errandApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      errandId: '',
      showAdminMenu: false,
      data: {
        price: 0,
        status: '',
        type: '',
        deadline: '',
        pickupLocation: '',
        deliveryLocation: '',
        content: '',
        images: [],
        avatar: '',
        nickname: '',
        time: '',
        isPinned: false,
        isRemoved: false,
        isAnnouncement: false,
        userInfo: {
          id: '',
          nickname: '',
          isBanned: false,
          title: '',
          isAdmin: false
        }
      }
    }
  },
  computed: {
    isAdmin() {
      return userStore.isAdmin()
    }
  },
  onLoad(options) {
    this.errandId = options.id
    const sys = uni.getSystemInfoSync()
    this.statusBarHeight = sys.statusBarHeight
    this.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
    this.scrollHeight = sys.windowHeight - sys.statusBarHeight - uni.upx2px(88) - uni.upx2px(120) - this.safeAreaBottom
    this.loadErrandDetail()
  },
  methods: {
    async loadErrandDetail() {
      const data = await errandApi.getDetail(this.errandId)
      this.data = data
    },
    goBack() { uni.navigateBack() },
    showMore() {
      if (this.isAdmin) {
        this.showAdminMenu = true
      } else {
        uni.showActionSheet({
          itemList: ['举报', '分享'],
          success: (res) => {
            if (res.tapIndex === 0) {
              uni.showToast({ title: '举报成功', icon: 'none' })
            }
          }
        })
      }
    },
    handleAdminAction(actionData) {
      const { action } = actionData
      switch (action) {
        case AdminAction.DELETE_POST:
          uni.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1500)
          break
        case AdminAction.BAN_USER:
          this.data.userInfo.isBanned = true
          uni.showToast({ title: '用户已封禁', icon: 'success' })
          break
        case AdminAction.UNBAN_USER:
          this.data.userInfo.isBanned = false
          uni.showToast({ title: '用户已解禁', icon: 'success' })
          break
        case AdminAction.REMOVE_POST:
          this.data.isRemoved = true
          uni.showToast({ title: '已下架', icon: 'success' })
          break
        case AdminAction.RESTORE_POST:
          this.data.isRemoved = false
          uni.showToast({ title: '已上架', icon: 'success' })
          break
        case AdminAction.PIN_POST:
          this.data.isPinned = true
          uni.showToast({ title: '已置顶', icon: 'success' })
          break
        case AdminAction.UNPIN_POST:
          this.data.isPinned = false
          uni.showToast({ title: '已取消置顶', icon: 'success' })
          break
        case AdminAction.SET_TITLE:
          this.data.userInfo.title = actionData.data.title
          uni.showToast({ title: '头衔设置成功', icon: 'success' })
          break
        case AdminAction.CANCEL_TITLE:
          this.data.userInfo.title = ''
          uni.showToast({ title: '已取消头衔', icon: 'success' })
          break
        default:
          uni.showToast({ title: '操作成功', icon: 'success' })
      }
    },
    previewImage(i) { uni.previewImage({ urls: this.data.images, current: i }) },
    contactUser() { uni.showToast({ title: '联系发布者', icon: 'none' }) },
    async handleGrab() {
      await errandApi.accept(this.errandId)
      uni.showToast({ title: '抢单成功', icon: 'success' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container { min-height: 100vh; background: #F8F8F8; }
.nav-bar { background: #FFF;
  .nav-content { display: flex; align-items: center; justify-content: space-between; height: 88rpx; padding: 0 24rpx;
    .nav-back { padding: 10rpx; }
    .nav-title { font-size: 34rpx; color: #333; font-weight: 600; }
    .nav-placeholder { width: 60rpx; }
  }
}
.content-scroll { background: #F8F8F8; }
.price-section { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 24rpx; background: #FFF; margin-bottom: 20rpx; gap: 16rpx;
  .price-box { .price-symbol { font-size: 28rpx; color: #FF3B30; } .price-value { font-size: 56rpx; color: #FF3B30; font-weight: 600; } }
  .status-tag { padding: 8rpx 24rpx; font-size: 26rpx; color: #FF9500; background: rgba(255,149,0,0.1); border-radius: 20rpx; }
  .admin-btn { display: flex; align-items: center; gap: 6rpx; padding: 12rpx 24rpx; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); border-radius: 24rpx;
    text { font-size: 24rpx; color: #FFF; }
  }
}
.info-section { padding: 24rpx; background: #FFF; margin-bottom: 20rpx;
  .info-item { display: flex; justify-content: space-between; padding: 16rpx 0; border-bottom: 1rpx solid #F5F5F5;
    &:last-child { border-bottom: none; }
    .info-label { font-size: 28rpx; color: #999; }
    .info-value { font-size: 28rpx; color: #333; }
  }
}
.desc-section { padding: 24rpx; background: #FFF; margin-bottom: 20rpx;
  .section-title { font-size: 30rpx; color: #333; font-weight: 600; margin-bottom: 16rpx; }
  .desc-text { font-size: 28rpx; color: #333; line-height: 1.6; }
  .image-list { display: flex; gap: 12rpx; margin-top: 16rpx; .desc-image { width: 200rpx; height: 200rpx; border-radius: 8rpx; } }
}
.user-section { display: flex; align-items: center; padding: 24rpx; background: #FFF;
  .user-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; margin-right: 16rpx; }
  .user-info { flex: 1; .user-name { display: block; font-size: 28rpx; color: #333; } .user-time { font-size: 24rpx; color: #999; } }
  .contact-btn { padding: 12rpx 32rpx; font-size: 26rpx; color: #007AFF; border: 1rpx solid #007AFF; border-radius: 24rpx; }
}
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 16rpx 24rpx; background: #FFF; box-sizing: content-box;
  .btn-grab { height: 88rpx; background: #007AFF; border-radius: 44rpx; font-size: 32rpx; color: #FFF; display: flex; align-items: center; justify-content: center; }
}
</style>
