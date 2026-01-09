<template>
  <view class="dm-comment-list">
    <!-- 评论头部 -->
    <view class="comment-header">
      <view class="header-left">
        <text class="comment-count">评论 {{ total }}</text>
        <text class="tn-icon-comment" style="font-size: 16px; color: #666666;"></text>
      </view>
      <view class="sort-tabs">
        <text :class="['sort-item', sortType === 'newest' && 'active']" @click="changeSort('newest')">最新</text>
        <text :class="['sort-item', sortType === 'hottest' && 'active']" @click="changeSort('hottest')">最热</text>
      </view>
    </view>

    <!-- 评论列表 -->
    <view v-for="(item, index) in list" :key="item.id || `comment-${index}`" class="comment-item">
      <image
        class="comment-avatar"
        :src="item.avatar || defaultAvatar"
        mode="aspectFill"
        @longpress="$emit('admin', item)"
      ></image>
      <view class="comment-main">
        <view class="comment-header-row">
          <view class="comment-user">
            <text class="user-title" v-if="item.title">{{ item.title }}</text>
            <text class="user-name">{{ item.nickname }}</text>
            <text class="author-tag" v-if="item.isAuthor">作者</text>
          </view>
          <view class="comment-admin-btn" v-if="showAdmin" @click="$emit('admin', item)">
            <text class="tn-icon-more-circle-fill" style="font-size: 16px; color: #999999;"></text>
          </view>
        </view>
        <view class="comment-content">
          <text class="pinned-tag" v-if="item.isPinned">置顶</text>
          <text class="content-text">{{ item.content }}</text>
        </view>
        <view class="comment-footer">
          <text class="comment-time">{{ item.time }}</text>
          <text class="comment-reply-btn" @click="$emit('reply', item)">回复</text>
        </view>
        <!-- 楼中楼回复 -->
        <view v-if="item.replies && item.replies.length" class="reply-list">
          <view v-for="(reply, rIndex) in item.replies" :key="reply.id || `reply-${index}-${rIndex}`" class="reply-item">
            <image class="reply-avatar" :src="reply.avatar || defaultAvatar" mode="aspectFill"></image>
            <view class="reply-main">
              <view class="reply-user">
                <text class="user-name">{{ reply.nickname }}</text>
                <text class="author-tag" v-if="reply.isAuthor">作者</text>
              </view>
              <text class="reply-content">{{ reply.content }}</text>
              <view class="reply-footer">
                <text class="reply-time">{{ reply.time }}</text>
                <text class="reply-btn" @click="$emit('reply', item, reply)">回复</text>
              </view>
            </view>
            <view class="reply-like" @click="$emit('like-reply', { comment: item, reply })">
              <text class="tn-icon-like" style="font-size: 14px; color: #999999;"></text>
              <text class="like-count">{{ reply.likeCount || 0 }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="comment-like" @click="$emit('like', item)">
        <text class="tn-icon-like" style="font-size: 14px; color: #999999;"></text>
        <text class="like-count">{{ item.likeCount || 0 }}</text>
      </view>
    </view>

    <view v-if="!list.length" class="empty-tip">暂无评论</view>
  </view>
</template>

<script>
export default {
  name: 'dm-comment-list',
  props: {
    list: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    sortType: { type: String, default: 'newest' },
    showAdmin: { type: Boolean, default: false }
  },
  emits: ['sort-change', 'like', 'like-reply', 'reply', 'admin'],
  data() {
    return {
      defaultAvatar: 'https://iph.href.lu/100x100?text=头像'
    }
  },
  methods: {
    changeSort(type) {
      this.$emit('sort-change', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-comment-list {
  padding: 24rpx;
  background-color: #FFFFFF;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .comment-count {
      font-size: 30rpx;
      color: #333333;
      font-weight: 600;
    }
  }

  .sort-tabs {
    display: flex;
    gap: 24rpx;

    .sort-item {
      font-size: 26rpx;
      color: #999999;

      &.active {
        color: #333333;
      }
    }
  }
}

.comment-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F5F5F5;

  .comment-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-right: 16rpx;
    flex-shrink: 0;
  }

  .comment-main {
    flex: 1;
    min-width: 0;

    .comment-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8rpx;

      .comment-user {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .user-title {
          font-size: 18rpx;
          color: #FF9500;
          background: rgba(255, 149, 0, 0.1);
          padding: 2rpx 6rpx;
          border-radius: 4rpx;
        }

        .user-name {
          font-size: 26rpx;
          color: #333333;
        }

        .author-tag {
          font-size: 18rpx;
          color: #007AFF;
          background: rgba(0, 122, 255, 0.1);
          padding: 2rpx 6rpx;
          border-radius: 4rpx;
        }
      }

      .comment-admin-btn {
        padding: 8rpx;
      }
    }

    .comment-content {
      .pinned-tag {
        font-size: 18rpx;
        color: #FF6B6B;
        background: rgba(255, 107, 107, 0.1);
        padding: 2rpx 6rpx;
        border-radius: 4rpx;
        margin-right: 8rpx;
      }

      .content-text {
        font-size: 28rpx;
        color: #333333;
        line-height: 1.6;
      }
    }

    .comment-footer {
      display: flex;
      margin-top: 8rpx;

      .comment-time {
        font-size: 22rpx;
        color: #999999;
        margin-right: 24rpx;
      }

      .comment-reply-btn {
        font-size: 22rpx;
        color: #007AFF;
      }
    }
  }

  .comment-like {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 16rpx;

    .like-count {
      font-size: 22rpx;
      color: #999999;
    }
  }
}

.reply-list {
  margin-top: 16rpx;
  background-color: #F8F8F8;
  border-radius: 8rpx;
  padding: 12rpx;

  .reply-item {
    display: flex;
    padding: 12rpx 0;

    &:not(:last-child) {
      border-bottom: 1rpx solid #EEEEEE;
    }

    .reply-avatar {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      margin-right: 12rpx;
      flex-shrink: 0;
    }

    .reply-main {
      flex: 1;

      .reply-user {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .user-name {
          font-size: 24rpx;
          color: #333333;
        }

        .author-tag {
          font-size: 18rpx;
          color: #007AFF;
          background: rgba(0, 122, 255, 0.1);
          padding: 2rpx 6rpx;
          border-radius: 4rpx;
        }
      }

      .reply-content {
        font-size: 26rpx;
        color: #333333;
        margin-top: 4rpx;
        display: block;
      }

      .reply-footer {
        display: flex;
        margin-top: 8rpx;

        .reply-time {
          font-size: 20rpx;
          color: #999999;
          margin-right: 16rpx;
        }

        .reply-btn {
          font-size: 20rpx;
          color: #007AFF;
        }
      }
    }

    .reply-like {
      display: flex;
      flex-direction: column;
      align-items: center;

      .like-count {
        font-size: 20rpx;
        color: #999999;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 40rpx;
  font-size: 28rpx;
  color: #999999;
}
</style>
