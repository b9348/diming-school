<template>
  <view class="page-container">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">投票详情</text>
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

    <scroll-view class="content-scroll" scroll-y>
      <!-- 投票标题 -->
      <view class="vote-header">
        <view class="vote-header-top">
          <text class="vote-title">{{ data.title }}</text>
          <!-- 管理按钮 -->
          <view class="admin-btn" v-if="isAdmin" @click="showAdminMenu = true">
            <uni-icons type="settings" size="16" color="#FFFFFF"></uni-icons>
            <text>管理</text>
          </view>
        </view>
        <text class="vote-deadline">截止时间：{{ data.deadline }}</text>
      </view>

      <!-- 投票图片 -->
      <view class="vote-images" v-if="data.images && data.images.length > 0">
        <view class="images-grid" :class="'grid-' + data.images.length">
          <image
            v-for="(img, index) in data.images"
            :key="index"
            class="vote-image"
            :src="img"
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
        </view>
      </view>

      <!-- 投票选项 -->
      <view class="vote-options">
        <view v-for="(opt, i) in data.options" :key="i"
          class="option-item" :class="{ voted: opt.voted }"
          @click="handleVote(opt)">
          <view class="option-content">
            <view class="option-left">
              <view class="check-icon" v-if="opt.voted">
                <uni-icons type="checkmarkempty" size="14" color="#007AFF"></uni-icons>
              </view>
              <image v-if="opt.image" class="option-image" :src="opt.image" mode="aspectFill"></image>
              <text class="option-text">{{ opt.text }}</text>
            </view>
            <text class="option-percent">{{ opt.percent }}%</text>
          </view>
          <view class="option-bar" :style="{ width: opt.percent + '%' }"></view>
        </view>
      </view>

      <!-- 投票统计 -->
      <view class="vote-stats">
        <text>{{ data.totalVotes }}人参与 · {{ data.viewCount }}人围观</text>
      </view>

      <!-- 发布者 -->
      <view class="user-section">
        <image class="user-avatar" :src="data.avatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ data.nickname }}</text>
          <text class="user-time">{{ data.time }}</text>
        </view>
        <view class="follow-btn" :class="{ followed: data.isFollowed }" @click="handleFollow">{{ data.isFollowed ? '已关注' : '关注' }}</view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="input-wrap" @click="goComment">
        <text class="input-placeholder">说点什么...</text>
      </view>
      <view class="action-btns">
        <view class="action-item" @click="handleLike">
          <uni-icons :type="data.isLiked ? 'heart-filled' : 'heart'" size="22" :color="data.isLiked ? '#FF6B6B' : '#666'"></uni-icons>
          <text>{{ data.likeCount || 0 }}</text>
        </view>
        <view class="action-item">
          <uni-icons type="chat" size="22" color="#666"></uni-icons>
          <text>{{ data.commentCount || 0 }}</text>
        </view>
        <view class="action-item" @click="handleShare">
          <uni-icons type="redo" size="22" color="#666"></uni-icons>
          <text>分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { voteApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      voteId: '',
      showAdminMenu: false,
      data: {
        title: '',
        deadline: '',
        images: [],
        options: [],
        totalVotes: 0,
        viewCount: 0,
        avatar: '',
        nickname: '',
        time: '',
        isPinned: false,
        isRemoved: false,
        isAnnouncement: false,
        isFollowed: false,
        hasVoted: false,
        isLiked: false,
        likeCount: 0,
        commentCount: 0,
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
    this.voteId = options.id
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
    this.loadVoteDetail()
  },
  methods: {
    async loadVoteDetail() {
      const data = await voteApi.getDetail(this.voteId)
      this.data = data
    },
    goBack() { uni.navigateBack() },
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
        case AdminAction.PIN_POST:
          this.data.isPinned = true
          uni.showToast({ title: '已置顶', icon: 'success' })
          break
        case AdminAction.UNPIN_POST:
          this.data.isPinned = false
          uni.showToast({ title: '已取消置顶', icon: 'success' })
          break
        default:
          uni.showToast({ title: '操作成功', icon: 'success' })
      }
    },
    async handleVote(option) {
      if (this.data.hasVoted) {
        uni.showToast({ title: '您已投过票', icon: 'none' })
        return
      }

      await voteApi.submit({ id: this.voteId, optionId: option.id })

      this.data.options.forEach(o => o.voted = false)
      option.voted = true
      this.data.hasVoted = true
      this.data.totalVotes++
      uni.showToast({ title: '投票成功', icon: 'success' })
    },
    handleFollow() {
      this.data.isFollowed = !this.data.isFollowed
    },
    goComment() {
      // 跳转到评论页或打开评论输入框
    },
    handleLike() {
      this.data.isLiked = !this.data.isLiked
      this.data.likeCount += this.data.isLiked ? 1 : -1
    },
    handleShare() {
      uni.share && uni.share({ title: this.data.title })
    },
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.data.images
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container { min-height: 100vh; background: #F8F8F8; display: flex; flex-direction: column; }
.nav-bar { background: #FFF;
  .nav-content { display: flex; align-items: center; justify-content: space-between; height: 88rpx; padding: 0 24rpx;
    .nav-back { padding: 10rpx; }
    .nav-title { font-size: 34rpx; color: #333; font-weight: 600; }
    .nav-placeholder { width: 60rpx; }
  }
}
.content-scroll { flex: 1; padding-bottom: 120rpx; }
.vote-header { padding: 24rpx; background: #FFF;
  .vote-header-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16rpx; }
  .vote-title { flex: 1; font-size: 32rpx; color: #333; font-weight: 600; line-height: 1.6; }
  .admin-btn { display: flex; align-items: center; gap: 6rpx; padding: 12rpx 24rpx; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); border-radius: 24rpx; flex-shrink: 0;
    text { font-size: 24rpx; color: #FFF; }
  }
  .vote-deadline { display: block; margin-top: 12rpx; font-size: 24rpx; color: #FF9500; }
}
.vote-images { padding: 0 24rpx 24rpx; background: #FFF;
  .images-grid { display: grid; gap: 8rpx;
    &.grid-1 { grid-template-columns: 1fr; .vote-image { height: 400rpx; } }
    &.grid-2, &.grid-4 { grid-template-columns: repeat(2, 1fr); .vote-image { height: 200rpx; } }
    &.grid-3, &.grid-5, &.grid-6, &.grid-7, &.grid-8, &.grid-9 { grid-template-columns: repeat(3, 1fr); .vote-image { height: 200rpx; } }
    .vote-image { width: 100%; border-radius: 8rpx; }
  }
}
.vote-options { padding: 24rpx; background: #FFF; margin-top: 20rpx;
  .option-item { position: relative; padding: 24rpx; margin-bottom: 16rpx; background: #F5F5F5; border-radius: 12rpx; overflow: hidden;
    &:last-child { margin-bottom: 0; }
    &.voted { background: rgba(0,122,255,0.08); }
    .option-content { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center;
      .option-left { display: flex; align-items: center; gap: 12rpx; }
      .check-icon { width: 36rpx; height: 36rpx; background: #007AFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
      .option-image { width: 60rpx; height: 60rpx; border-radius: 8rpx; }
      .option-text { font-size: 28rpx; color: #333; }
      .option-percent { font-size: 28rpx; color: #007AFF; font-weight: 500; }
    }
    .option-bar { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(0,122,255,0.12); border-radius: 12rpx; }
  }
}
.vote-stats { padding: 24rpx; font-size: 26rpx; color: #999; }
.user-section { display: flex; align-items: center; padding: 24rpx; background: #FFF; margin-top: 20rpx;
  .user-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; margin-right: 16rpx; }
  .user-info { flex: 1; .user-name { display: block; font-size: 28rpx; color: #333; } .user-time { font-size: 24rpx; color: #999; } }
  .follow-btn { padding: 12rpx 32rpx; font-size: 26rpx; color: #007AFF; border: 1rpx solid #007AFF; border-radius: 24rpx;
    &.followed { color: #999; border-color: #DDD; background: #F5F5F5; }
  }
}
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; align-items: center; gap: 20rpx; padding: 16rpx 24rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); background: #FFF; border-top: 1rpx solid #EAEAEA;
  .input-wrap { flex: 1; height: 64rpx; background: #F5F5F5; border-radius: 32rpx; display: flex; align-items: center; padding: 0 24rpx;
    .input-placeholder { font-size: 26rpx; color: #999; }
  }
  .action-btns { display: flex; align-items: center; gap: 32rpx;
    .action-item { display: flex; flex-direction: column; align-items: center; gap: 4rpx;
      text { font-size: 20rpx; color: #666; }
    }
  }
}
</style>
