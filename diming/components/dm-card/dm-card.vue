<template>
  <view class="dm-card" @click="handleClick">
    <!-- 用户信息 -->
    <view class="card-header" v-if="showHeader">
      <image class="avatar" :src="data.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
      <view class="user-info">
        <text class="nickname">{{ data.nickname || '匿名用户' }}</text>
        <text class="time">{{ data.time || '' }}</text>
      </view>
      <view v-if="data.tag" class="card-tag">{{ data.tag }}</view>
    </view>

    <!-- 内容区域 -->
    <view class="card-content">
      <text class="title" v-if="data.title">{{ data.title }}</text>
      <text class="desc ellipsis-2" v-if="data.content">{{ data.content }}</text>

      <!-- 图片展示 -->
      <view class="image-list" v-if="data.images && data.images.length">
        <image
          v-for="(img, idx) in data.images.slice(0, 3)"
          :key="idx"
          class="content-image"
          :class="{ 'single': data.images.length === 1 }"
          :src="img"
          mode="aspectFill"
        ></image>
        <view v-if="data.images.length > 3" class="image-more">
          +{{ data.images.length - 3 }}
        </view>
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="card-footer" v-if="showFooter">
      <view class="footer-left">
        <text v-if="data.location" class="location">{{ data.location }}</text>
        <text v-if="data.price" class="price">¥{{ data.price }}</text>
      </view>
      <view class="footer-right">
        <view class="action-item" v-if="showLike">
          <uni-icons type="heart" size="16" color="#999999"></uni-icons>
          <text class="action-text">{{ data.likeCount || 0 }}</text>
        </view>
        <view class="action-item" v-if="showComment">
          <uni-icons type="chat" size="16" color="#999999"></uni-icons>
          <text class="action-text">{{ data.commentCount || 0 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dm-card',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showLike: {
      type: Boolean,
      default: true
    },
    showComment: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-card {
  margin: 20rpx 24rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .avatar {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .nickname {
        font-size: 28rpx;
        color: #333333;
        font-weight: 500;
      }

      .time {
        font-size: 22rpx;
        color: #999999;
        margin-top: 4rpx;
      }
    }

    .card-tag {
      padding: 6rpx 16rpx;
      font-size: 22rpx;
      color: #007AFF;
      background-color: rgba(0, 122, 255, 0.1);
      border-radius: 20rpx;
    }
  }

  .card-content {
    .title {
      display: block;
      font-size: 32rpx;
      color: #333333;
      font-weight: 600;
      margin-bottom: 12rpx;
    }

    .desc {
      font-size: 28rpx;
      color: #666666;
      line-height: 1.6;
    }

    .image-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 16rpx;
      gap: 12rpx;

      .content-image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 8rpx;

        &.single {
          width: 400rpx;
          height: 300rpx;
        }
      }

      .image-more {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200rpx;
        height: 200rpx;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 8rpx;
        font-size: 32rpx;
        color: #FFFFFF;
      }
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #F5F5F5;

    .footer-left {
      display: flex;
      align-items: center;

      .location {
        font-size: 24rpx;
        color: #999999;
      }

      .price {
        font-size: 32rpx;
        color: #FF3B30;
        font-weight: 600;
      }
    }

    .footer-right {
      display: flex;
      align-items: center;

      .action-item {
        display: flex;
        align-items: center;
        margin-left: 32rpx;
        gap: 8rpx;

        .action-text {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }
}
</style>
