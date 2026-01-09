<template>
  <view class="dm-card" @click="handleClick">
    <!-- 用户信息 -->
    <view class="card-header" v-if="showHeader">
      <image class="avatar" :src="data.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
      <view class="user-info">
        <view class="user-top">
          <text v-if="data.title" class="user-title">{{ data.title }}</text>
          <text class="nickname">{{ data.nickname || '匿名用户' }}</text>
        </view>
      </view>
      <view class="header-right">
        <text class="time">{{ data.time || '' }}</text>
        <text v-if="data.isTop" class="top-tag"> 置顶</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="card-content">
      <text class="desc" v-if="data.content">{{ truncateText(data.content, 200) }}</text>

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
      </view>
    </view>

    <!-- 评论预览 -->
    <view class="comment-preview" v-if="data.comments && data.comments.length">
      <view class="comment-item" v-for="(comment, idx) in data.comments.slice(0, 3)" :key="idx">
        <image class="comment-avatar" :src="comment.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
        <text class="comment-text">{{ truncateText(comment.content, 20) }}</text>
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="card-footer" v-if="showFooter">
      <view class="footer-left">
        <text v-if="data.viewCount" class="view-count">{{ data.viewCount }}人吃瓜</text>
        <text v-if="data.location" class="location">{{ data.location }}</text>
      </view>
      <view class="footer-right">
        <view class="action-item" v-if="showLike" @click.stop="handleLike">
          <text :class="data.isLiked ? 'tn-icon-like-fill' : 'tn-icon-like'" :style="{ fontSize: '16px', color: data.isLiked ? '#FF3B30' : '#999999' }"></text>
          <text class="action-text" :class="{ 'is-liked': data.isLiked }">{{ data.likeCount || 0 }}</text>
        </view>
        <view class="action-item" v-if="showComment" @click.stop="handleComment">
          <text class="tn-icon-comment" style="font-size: 16px; color: #999999;"></text>
          <text class="action-text">{{ data.commentCount || 0 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
  emits: ['click', 'like', 'comment'],
  methods: {
    handleClick() {
      this.$emit('click', this.data)
    },
    handleLike() {
      this.$emit('like', this.data)
    },
    handleComment() {
      this.$emit('comment', this.data)
    },
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
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

      .user-top {
        display: flex;
        align-items: center;

        .nickname {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
        }

        .user-title {
          font-size: 20rpx;
          color: #FFFFFF;
          background-color: #00BFBF;
          padding: 2rpx 8rpx;
          border-radius: 4rpx;
          margin-left: 8rpx;
          line-height: 1.5;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;

      .time {
        font-size: 22rpx;
        color: #999999;
      }

      .top-tag {
        font-size: 20rpx;
        color: #FFFFFF;
        background-color: #FF3B30;
        padding: 2rpx 8rpx;
        border-radius: 4rpx;
        margin-left: 8rpx;
        line-height: 1.5;
      }
    }
  }

  .card-content {
    .desc {
      font-size: 28rpx;
      color: #333333;
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
    }
  }

  .comment-preview {
    margin-top: 20rpx;
    padding: 16rpx;
    background-color: #F8F8F8;
    border-radius: 8rpx;

    .comment-item {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .comment-avatar {
        width: 36rpx;
        height: 36rpx;
        border-radius: 50%;
        margin-right: 12rpx;
      }

      .comment-text {
        flex: 1;
        font-size: 24rpx;
        color: #666666;
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
      gap: 24rpx;

      .view-count {
        font-size: 24rpx;
        color: #BBBBBB;
      }

      .location {
        font-size: 24rpx;
        color: #999999;
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

          &.is-liked {
            color: #FF3B30;
          }
        }
      }
    }
  }
}
</style>
