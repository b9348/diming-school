<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">拍卖详情</text>
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
      <!-- 倒计时和当前价 -->
      <view class="price-section">
        <view class="countdown-box">
          <text class="countdown">{{ data.countdown }}</text>
        </view>
        <view class="current-price">
          <text class="price-label">当前价</text>
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ data.currentPrice }}</text>
        </view>
        <!-- 管理按钮 -->
        <dm-manage-btn :show="isAdmin" @click="showAdminMenu = true" />
      </view>

      <!-- 加价幅度 -->
      <view class="increment-section">
        <text class="increment-label">加价幅度</text>
        <text class="increment-value">¥{{ data.bidIncrement }}</text>
      </view>

      <!-- 出价记录 -->
      <view class="bid-section">
        <view class="bid-header">
          <text class="bid-title">出价记录</text>
          <view class="bid-more" @click="viewAllBids">
            <text class="bid-count">{{ data.bidCount }}次</text>
            <uni-icons type="right" size="12" color="#999999"></uni-icons>
          </view>
        </view>
        <view class="bid-list">
          <view v-for="(bid, index) in data.bidList.slice(0, 3)" :key="index" class="bid-item">
            <image class="bid-avatar" :src="bid.avatar" mode="aspectFill"></image>
            <text class="bid-name">{{ bid.nickname }}</text>
            <text class="bid-time">{{ bid.time }}</text>
            <view class="bid-price">
              <text class="bid-price-symbol">¥</text>
              <text class="bid-price-value">{{ bid.price }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品描述 -->
      <view class="desc-section">
        <text class="desc-text">{{ data.content }}</text>
      </view>

      <!-- 图片 -->
      <view class="image-section" v-if="data.images && data.images.length">
        <view class="image-grid">
          <image
            v-for="(img, i) in data.images"
            :key="i"
            class="desc-image"
            :src="img"
            mode="aspectFill"
            @click="previewImage(i)"
          ></image>
        </view>
      </view>

      <!-- 发货信息和发布者 -->
      <view class="info-section">
        <view class="info-row">
          <text class="delivery-time">{{ data.deliveryTime }}</text>
          <text class="location">{{ data.location }}</text>
        </view>
        <view class="user-row">
          <image class="user-avatar" :src="data.avatar" mode="aspectFill"></image>
          <text class="user-name">{{ data.nickname }}</text>
        </view>
        <view class="action-row">
          <view class="action-item" @click="toggleFavorite">
            <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="20" :color="isFavorite ? '#FF9500' : '#999999'"></uni-icons>
          </view>
          <view class="action-item" @click="shareItem">
            <uni-icons type="redo" size="20" color="#999999"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 查看联系方式 -->
      <view class="contact-section" @click="viewContact">
        <text class="contact-text">查看联系方式</text>
        <uni-icons type="right" size="14" color="#999999"></uni-icons>
      </view>
    </scroll-view>

    <!-- 底部出价按钮 -->
    <view class="bottom-bar">
      <view class="btn-bid" @click="handleBid">出 价</view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { helpApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      helpId: '',
      isFavorite: false,
      showAdminMenu: false,
      data: {
        countdown: '',
        currentPrice: 0,
        bidIncrement: 0,
        bidCount: 0,
        bidList: [],
        content: '',
        images: [],
        deliveryTime: '',
        location: '',
        avatar: '',
        nickname: '',
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
    this.helpId = options.id
    const sys = uni.getSystemInfoSync()
    this.statusBarHeight = sys.statusBarHeight
    this.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
    this.scrollHeight = sys.windowHeight - sys.statusBarHeight - uni.upx2px(88) - uni.upx2px(120) - this.safeAreaBottom
    this.loadHelpDetail()
  },
  methods: {
    async loadHelpDetail() {
      const data = await helpApi.getDetail(this.helpId)
      this.data = data
    },
    goBack() {
      uni.navigateBack()
    },
    showMore() {
      if (this.isAdmin) {
        this.showAdminMenu = true
      } else {
        uni.showActionSheet({
          itemList: ['举报', '分享'],
          success: (res) => {
            if (res.tapIndex === 0) {
              uni.showToast({ title: '举报成功', icon: 'none' })
            } else {
              this.shareItem()
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
    viewAllBids() {
      uni.navigateTo({
        url: `/pages/help/bid-list?id=${this.helpId}`
      })
    },
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.data.images
      })
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      uni.showToast({
        title: this.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'none'
      })
    },
    shareItem() {
      uni.showToast({ title: '分享功能', icon: 'none' })
    },
    viewContact() {
      uni.showModal({
        title: '联系方式',
        content: '微信号：zhangsan123',
        showCancel: false
      })
    },
    async handleBid() {
      const nextPrice = this.data.currentPrice + this.data.bidIncrement
      uni.showModal({
        title: '确认出价',
        content: `出价金额：¥${nextPrice}`,
        success: async (res) => {
          if (res.confirm) {
            await helpApi.bid({ id: this.helpId, price: nextPrice })
            uni.showToast({ title: '出价成功', icon: 'success' })
            this.data.currentPrice = nextPrice
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

    .nav-back {
      padding: 10rpx;
    }

    .nav-title {
      font-size: 34rpx;
      color: #333333;
      font-weight: 600;
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

.content-scroll {
  background-color: #F8F8F8;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  background-color: #FFFFFF;
  gap: 16rpx;

  .countdown-box {
    padding: 16rpx 32rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;

    .countdown {
      font-size: 36rpx;
      color: #FF3B30;
      font-weight: 600;
      font-family: monospace;
    }
  }

  .current-price {
    display: flex;
    align-items: baseline;
    flex: 1;
    justify-content: flex-end;

    .price-label {
      font-size: 26rpx;
      color: #999999;
      margin-right: 8rpx;
    }

    .price-symbol {
      font-size: 32rpx;
      color: #FF3B30;
    }

    .price-value {
      font-size: 56rpx;
      color: #FF3B30;
      font-weight: 600;
    }
  }

  .admin-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    border-radius: 24rpx;
    flex-shrink: 0;

    text {
      font-size: 24rpx;
      color: #FFF;
    }
  }
}

.increment-section {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-top: 1rpx solid #F5F5F5;

  .increment-label {
    font-size: 28rpx;
    color: #666666;
    margin-right: 16rpx;
  }

  .increment-value {
    font-size: 32rpx;
    color: #FF9500;
    font-weight: 600;
  }
}

.bid-section {
  margin-top: 20rpx;
  background-color: #FFFFFF;

  .bid-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    border-bottom: 1rpx solid #F5F5F5;

    .bid-title {
      font-size: 30rpx;
      color: #333333;
      font-weight: 600;
    }

    .bid-more {
      display: flex;
      align-items: center;

      .bid-count {
        font-size: 26rpx;
        color: #999999;
        margin-right: 8rpx;
      }
    }
  }

  .bid-list {
    .bid-item {
      display: flex;
      align-items: center;
      padding: 20rpx 24rpx;
      border-bottom: 1rpx solid #F5F5F5;

      &:last-child {
        border-bottom: none;
      }

      .bid-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      .bid-name {
        flex: 1;
        font-size: 28rpx;
        color: #333333;
      }

      .bid-time {
        font-size: 24rpx;
        color: #999999;
        margin-right: 24rpx;
      }

      .bid-price {
        display: flex;
        align-items: baseline;
        font-size: 32rpx;
        color: #FF3B30;
        font-weight: 600;

        .bid-price-symbol {
          font-size: 24rpx;
          margin-right: 2rpx;
        }

        .bid-price-value {
          font-size: 32rpx;
        }
      }
    }
  }
}

.desc-section {
  margin-top: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;

  .desc-text {
    font-size: 30rpx;
    color: #333333;
    line-height: 1.6;
  }
}

.image-section {
  padding: 0 24rpx 24rpx;
  background-color: #FFFFFF;

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .desc-image {
      width: 218rpx;
      height: 218rpx;
      border-radius: 8rpx;
    }
  }
}

.info-section {
  margin-top: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;

  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .delivery-time {
      font-size: 26rpx;
      color: #666666;
    }

    .location {
      font-size: 26rpx;
      color: #999999;
    }
  }

  .user-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .user-avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .user-name {
      font-size: 28rpx;
      color: #333333;
    }
  }

  .action-row {
    display: flex;
    justify-content: flex-end;
    gap: 32rpx;

    .action-item {
      padding: 10rpx;
    }
  }
}

.contact-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;

  .contact-text {
    font-size: 28rpx;
    color: #333333;
  }
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 16rpx;
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
  box-sizing: content-box;

  .btn-bid {
    height: 88rpx;
    background-color: #007AFF;
    border-radius: 44rpx;
    font-size: 34rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 8rpx;
  }
}
</style>
