<template>
  <view class="page-container">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">闲置详情</text>
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
      <!-- 商品图片轮播 -->
      <swiper class="goods-swiper" indicator-dots circular>
        <swiper-item v-for="(img, i) in data.images" :key="i">
          <image class="goods-image" :src="img" mode="aspectFill" @click="previewImage(i)"></image>
        </swiper-item>
      </swiper>

      <!-- 价格信息 -->
      <view class="price-section">
        <view class="price-row">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ data.price }}</text>
          <text class="delivery-tag">{{ data.deliveryType }}</text>
        </view>
        <view class="price-right">
          <text class="want-count">{{ data.wantCount }}人想要</text>
          <!-- 管理按钮 -->
          <view class="admin-btn" v-if="isAdmin" @click="showAdminMenu = true">
            <uni-icons type="settings" size="16" color="#FFFFFF"></uni-icons>
            <text>管理</text>
          </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="info-section">
        <text class="goods-title">{{ data.title }}</text>
        <text class="goods-desc">{{ data.content }}</text>
        <view class="info-tags">
          <text class="tag-item">{{ data.category }}</text>
          <text class="tag-item">{{ data.condition }}</text>
          <text class="tag-item">{{ data.location }}</text>
        </view>
      </view>

      <!-- 卖家信息 -->
      <view class="user-section">
        <image class="user-avatar" :src="data.avatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ data.nickname }}</text>
          <text class="user-time">{{ data.time }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="btn-chat" @click="handleChat">私聊</view>
      <view class="btn-want" @click="handleWant">我想要</view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { idleApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      idleId: '',
      showAdminMenu: false,
      data: {
        images: [],
        price: 0,
        deliveryType: '',
        wantCount: 0,
        title: '',
        content: '',
        category: '',
        condition: '',
        location: '',
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
    this.idleId = options.id
    const sys = uni.getSystemInfoSync()
    this.statusBarHeight = sys.statusBarHeight
    this.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
    this.scrollHeight = sys.windowHeight - sys.statusBarHeight - uni.upx2px(88) - uni.upx2px(120) - this.safeAreaBottom
    this.loadIdleDetail()
  },
  methods: {
    async loadIdleDetail() {
      const data = await idleApi.getDetail(this.idleId)
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
    handleChat() {
      const targetUser = {
        id: this.data.userInfo.id,
        nickname: this.data.nickname,
        avatar: this.data.avatar,
        location: this.data.location
      }
      const goodsInfo = {
        id: this.idleId,
        title: this.data.title,
        price: this.data.price,
        image: this.data.images[0],
        deliveryType: this.data.deliveryType
      }
      uni.navigateTo({
        url: `/pages/chat/index?type=idle&targetUser=${encodeURIComponent(JSON.stringify(targetUser))}&goodsInfo=${encodeURIComponent(JSON.stringify(goodsInfo))}`
      })
    },
    async handleWant() {
      await idleApi.want(this.idleId)
      this.data.wantCount++
      uni.showToast({ title: '已标记想要', icon: 'success' })
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
.goods-swiper { height: 600rpx; .goods-image { width: 100%; height: 100%; } }
.price-section { padding: 24rpx; background: #FFF; display: flex; align-items: center; justify-content: space-between;
  .price-row { display: flex; align-items: baseline;
    .price-symbol { font-size: 28rpx; color: #FF3B30; }
    .price-value { font-size: 48rpx; color: #FF3B30; font-weight: 600; }
    .delivery-tag { margin-left: 16rpx; padding: 4rpx 12rpx; font-size: 22rpx; color: #999; background: #F5F5F5; border-radius: 4rpx; }
  }
  .price-right { display: flex; align-items: center; gap: 16rpx; }
  .want-count { font-size: 24rpx; color: #999; }
  .admin-btn { display: flex; align-items: center; gap: 6rpx; padding: 12rpx 24rpx; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); border-radius: 24rpx;
    text { font-size: 24rpx; color: #FFF; }
  }
}
.info-section { padding: 24rpx; background: #FFF; margin-top: 20rpx;
  .goods-title { font-size: 32rpx; color: #333; font-weight: 600; }
  .goods-desc { font-size: 28rpx; color: #666; line-height: 1.6; margin-top: 12rpx; }
  .info-tags { display: flex; gap: 12rpx; margin-top: 16rpx;
    .tag-item { padding: 8rpx 16rpx; font-size: 24rpx; color: #666; background: #F5F5F5; border-radius: 4rpx; }
  }
}
.user-section { display: flex; align-items: center; padding: 24rpx; background: #FFF; margin-top: 20rpx;
  .user-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; margin-right: 16rpx; }
  .user-info { flex: 1; .user-name { display: block; font-size: 28rpx; color: #333; } .user-time { font-size: 24rpx; color: #999; } }
}
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 24rpx; padding-top: 16rpx; padding-left: 24rpx; padding-right: 24rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); background: #FFF; box-sizing: content-box;
  .btn-chat { flex: 1; height: 88rpx; border: 1rpx solid #007AFF; border-radius: 44rpx; font-size: 30rpx; color: #007AFF; display: flex; align-items: center; justify-content: center; }
  .btn-want { flex: 1; height: 88rpx; background: #007AFF; border-radius: 44rpx; font-size: 30rpx; color: #FFF; display: flex; align-items: center; justify-content: center; }
}
</style>
