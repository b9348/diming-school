<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">出价记录</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <view class="bid-list">
        <view v-for="(bid, index) in bidList" :key="index" class="bid-item">
          <image class="bid-avatar" :src="bid.avatar" mode="aspectFill"></image>
          <view class="bid-info">
            <text class="bid-name">{{ bid.nickname }}</text>
            <text class="bid-time">{{ bid.time }}</text>
          </view>
          <text class="bid-price">¥{{ bid.price }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { helpApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      helpId: '',
      bidList: []
    }
  },
  onLoad(options) {
    this.helpId = options.id
    const sys = uni.getWindowInfo()
    this.statusBarHeight = sys.statusBarHeight
    this.scrollHeight = sys.windowHeight - sys.statusBarHeight - uni.upx2px(88)
    this.loadBidList()
  },
  methods: {
    async loadBidList() {
      const data = await helpApi.getBidList(this.helpId)
      this.bidList = data.list || []
    },
    goBack() {
      uni.navigateBack()
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

.bid-list {
  background-color: #FFFFFF;

  .bid-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #F5F5F5;

    &:last-child {
      border-bottom: none;
    }

    .bid-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .bid-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .bid-name {
        font-size: 30rpx;
        color: #333333;
        font-weight: 500;
      }

      .bid-time {
        font-size: 24rpx;
        color: #999999;
      }
    }

    .bid-price {
      font-size: 36rpx;
      color: #FF3B30;
      font-weight: 600;
      flex-shrink: 0;
    }
  }
}
</style>
