<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">帖子详情</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 帖子管理员操作菜单 -->
    <dm-admin-menu
      :show="showAdminMenu"
      :target="postData"
      :target-user="postData.userInfo"
      @update:show="showAdminMenu = $event"
      @action="handleAdminAction"
    />

    <!-- 评论管理员操作菜单 -->
    <dm-admin-menu
      :show="showCommentAdminMenu"
      :target="currentComment"
      :target-user="currentComment.userInfo"
      @update:show="showCommentAdminMenu = $event"
      @action="handleCommentAdminAction"
    />

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 用户信息 -->
      <view class="user-section">
        <image class="user-avatar" :src="postData.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill" @longpress="isAdmin && showPostAdminMenu()"></image>
        <view class="user-info">
          <view class="user-name-row">
            <text class="user-name">{{ postData.nickname }}</text>
            <text class="user-title" v-if="postData.userInfo && postData.userInfo.title">{{ postData.userInfo.title }}</text>
          </view>
          <text class="post-time">{{ postData.time }}</text>
        </view>
        <view class="post-tags">
          <text class="tag-item pinned" v-if="postData.isPinned">置顶</text>
          <text class="tag-item announcement" v-if="postData.isAnnouncement">公告</text>
        </view>
        <view class="follow-btn" @click="handleFollow">{{ postData.isFollowed ? '已关注' : '关注' }}</view>
      </view>

      <!-- 帖子内容 -->
      <view class="post-content">
        <text class="content-text">{{ postData.content }}</text>
        <view class="image-list" v-if="postData.images && postData.images.length">
          <image
            v-for="(img, index) in postData.images"
            :key="index"
            class="content-image"
            :src="img"
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
        </view>
        <text class="post-location" v-if="postData.location">{{ postData.location }}</text>
      </view>

      <!-- 互动数据和管理按钮 -->
      <view class="interact-section">
        <view class="interact-left">
          <text class="interact-item">{{ postData.likeCount }} 赞</text>
          <text class="interact-item">{{ postData.commentCount }} 评论</text>
          <text class="interact-item">{{ postData.shareCount }} 转发</text>
        </view>
        <view class="admin-btn" v-if="isAdmin" @click="showPostAdminMenu">
          <uni-icons type="settings" size="16" color="#FFFFFF"></uni-icons>
          <text>管理</text>
        </view>
      </view>

      <!-- 评论列表 -->
      <view class="comment-section">
        <view class="section-header">
          <text class="section-title">评论 {{ postData.commentCount }}</text>
        </view>
        <view v-for="(item, index) in commentList" :key="index" class="comment-item">
          <image
            class="comment-avatar"
            :src="item.avatar || 'https://iph.href.lu/100x100?text=头像'"
            mode="aspectFill"
            @longpress="isAdmin && showCommentMenu(item)"
          ></image>
          <view class="comment-main">
            <view class="comment-header">
              <view class="comment-user">
                <text class="comment-name">{{ item.nickname }}</text>
                <text class="comment-title" v-if="item.userInfo && item.userInfo.title">{{ item.userInfo.title }}</text>
                <text class="comment-author" v-if="item.isAuthor">作者</text>
              </view>
              <view class="comment-admin-btn" v-if="isAdmin" @click="showCommentMenu(item)">
                <uni-icons type="more-filled" size="16" color="#999"></uni-icons>
              </view>
            </view>
            <view class="comment-body">
              <text class="comment-pinned" v-if="item.isPinned">置顶</text>
              <text class="comment-text">{{ item.content }}</text>
            </view>
            <view class="comment-footer">
              <text class="comment-time">{{ item.time }}</text>
              <text class="comment-reply" @click="replyComment(item)">回复</text>
            </view>
          </view>
          <view class="comment-like" @click="likeComment(item)">
            <uni-icons type="heart" size="14" color="#999999"></uni-icons>
            <text class="like-count">{{ item.likeCount }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <input class="comment-input" placeholder="写评论..." @focus="showCommentInput" />
      <view class="action-btns">
        <view class="action-item" @click="handleLike">
          <uni-icons type="heart" size="20" color="#333333"></uni-icons>
          <text>{{ postData.likeCount }}</text>
        </view>
        <view class="action-item" @click="handleCollect">
          <uni-icons type="star" size="20" color="#333333"></uni-icons>
        </view>
        <view class="action-item" @click="handleShare">
          <uni-icons type="redo" size="20" color="#333333"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { postApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      postId: '',
      showAdminMenu: false,
      showCommentAdminMenu: false,
      currentComment: {
        id: '',
        isPinned: false,
        isRemoved: false,
        userInfo: {
          id: '',
          nickname: '',
          isBanned: false,
          title: '',
          isAdmin: false
        }
      },
      postData: {
        avatar: '',
        nickname: '',
        time: '',
        content: '',
        images: [],
        location: '',
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        isFollowed: false,
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
      },
      commentList: []
    }
  },
  computed: {
    isAdmin() {
      return userStore.isAdmin()
    }
  },
  onLoad(options) {
    this.postId = options.id
    this.getSystemInfo()
    this.loadPostDetail()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      this.safeAreaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
      const navHeight = uni.upx2px(88)
      const bottomHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - bottomHeight - this.safeAreaBottom
    },
    async loadPostDetail() {
      const data = await postApi.getDetail(this.postId)
      this.postData = data
      this.commentList = data.comments || []
    },
    goBack() { uni.navigateBack() },
    showPostAdminMenu() {
      this.showAdminMenu = true
    },
    showCommentMenu(comment) {
      this.currentComment = {
        ...comment,
        isPinned: comment.isPinned || false,
        isRemoved: comment.isRemoved || false,
        userInfo: comment.userInfo || {
          id: comment.id,
          nickname: comment.nickname,
          isBanned: false,
          title: '',
          isAdmin: false
        }
      }
      this.showCommentAdminMenu = true
    },
    handleAdminAction(data) {
      const { action, target, targetUser } = data

      switch (action) {
        case AdminAction.DELETE_POST:
          uni.showToast({ title: '帖子已删除', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1500)
          break
        case AdminAction.BAN_USER:
          this.postData.userInfo.isBanned = true
          uni.showToast({ title: '用户已封禁', icon: 'success' })
          break
        case AdminAction.UNBAN_USER:
          this.postData.userInfo.isBanned = false
          uni.showToast({ title: '用户已解禁', icon: 'success' })
          break
        case AdminAction.PIN_POST:
          this.postData.isPinned = true
          uni.showToast({ title: '帖子已置顶', icon: 'success' })
          break
        case AdminAction.UNPIN_POST:
          this.postData.isPinned = false
          uni.showToast({ title: '已取消置顶', icon: 'success' })
          break
        default:
          uni.showToast({ title: '操作成功', icon: 'success' })
      }
    },
    handleCommentAdminAction(data) {
      const { action } = data
      const commentIndex = this.commentList.findIndex(c => c.id === this.currentComment.id)
      if (commentIndex === -1) return

      switch (action) {
        case AdminAction.DELETE_POST:
          this.commentList.splice(commentIndex, 1)
          this.postData.commentCount--
          uni.showToast({ title: '评论已删除', icon: 'success' })
          break
        case AdminAction.PIN_POST:
          this.commentList.forEach(c => c.isPinned = false)
          this.commentList[commentIndex].isPinned = true
          const pinnedComment = this.commentList.splice(commentIndex, 1)[0]
          this.commentList.unshift(pinnedComment)
          uni.showToast({ title: '评论已置顶', icon: 'success' })
          break
        default:
          uni.showToast({ title: '操作成功', icon: 'success' })
      }
    },
    handleFollow() { this.postData.isFollowed = !this.postData.isFollowed },
    previewImage(index) {
      uni.previewImage({ urls: this.postData.images, current: index })
    },
    replyComment(item) { uni.showToast({ title: '回复' + item.nickname, icon: 'none' }) },
    likeComment(item) { item.likeCount++ },
    showCommentInput() { uni.showToast({ title: '输入评论', icon: 'none' }) },
    async handleLike() {
      await postApi.like(this.postId)
      this.postData.likeCount++
    },
    async handleCollect() {
      await postApi.collect(this.postId)
      uni.showToast({ title: '已收藏', icon: 'none' })
    },
    handleShare() { uni.showToast({ title: '分享', icon: 'none' }) }
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
.content-scroll { background: #FFF; }
.user-section { display: flex; align-items: center; padding: 24rpx;
  .user-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; margin-right: 16rpx; }
  .user-info { flex: 1;
    .user-name-row { display: flex; align-items: center; gap: 8rpx; }
    .user-name { font-size: 30rpx; color: #333; }
    .user-title { font-size: 20rpx; color: #FF9500; background: rgba(255,149,0,0.1); padding: 2rpx 8rpx; border-radius: 4rpx; }
    .post-time { font-size: 24rpx; color: #999; }
  }
  .post-tags { display: flex; gap: 8rpx; margin-right: 16rpx;
    .tag-item { font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 4rpx;
      &.pinned { color: #FF6B6B; background: rgba(255,107,107,0.1); }
      &.announcement { color: #007AFF; background: rgba(0,122,255,0.1); }
    }
  }
  .follow-btn { padding: 12rpx 32rpx; font-size: 26rpx; color: #007AFF; border: 1rpx solid #007AFF; border-radius: 24rpx; }
}
.post-content { padding: 0 24rpx 24rpx;
  .content-text { font-size: 30rpx; color: #333; line-height: 1.8; }
  .image-list { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 20rpx; .content-image { width: 220rpx; height: 220rpx; border-radius: 8rpx; } }
  .post-location { display: block; margin-top: 16rpx; font-size: 24rpx; color: #999; }
}
.interact-section { display: flex; align-items: center; justify-content: space-between; padding: 20rpx 24rpx; border-top: 1rpx solid #F5F5F5; border-bottom: 1rpx solid #F5F5F5;
  .interact-left { display: flex; }
  .interact-item { margin-right: 32rpx; font-size: 26rpx; color: #666; }
  .admin-btn { display: flex; align-items: center; gap: 6rpx; padding: 12rpx 24rpx; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); border-radius: 24rpx;
    text { font-size: 24rpx; color: #FFF; }
  }
}
.comment-section { padding: 24rpx;
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20rpx; }
  .section-title { font-size: 30rpx; color: #333; font-weight: 600; }
  .comment-item { display: flex; padding: 20rpx 0; border-bottom: 1rpx solid #F5F5F5;
    .comment-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; margin-right: 16rpx; flex-shrink: 0; }
    .comment-main { flex: 1; min-width: 0;
      .comment-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8rpx;
        .comment-user { display: flex; align-items: center; gap: 8rpx; flex-wrap: wrap; }
        .comment-name { font-size: 26rpx; color: #333; }
        .comment-title { font-size: 18rpx; color: #FF9500; background: rgba(255,149,0,0.1); padding: 2rpx 6rpx; border-radius: 4rpx; }
        .comment-author { font-size: 18rpx; color: #007AFF; background: rgba(0,122,255,0.1); padding: 2rpx 6rpx; border-radius: 4rpx; }
        .comment-admin-btn { padding: 8rpx; }
      }
      .comment-body { display: flex; align-items: flex-start; gap: 8rpx;
        .comment-pinned { font-size: 18rpx; color: #FF6B6B; background: rgba(255,107,107,0.1); padding: 2rpx 6rpx; border-radius: 4rpx; flex-shrink: 0; }
        .comment-text { font-size: 28rpx; color: #333; line-height: 1.6; }
      }
      .comment-footer { display: flex; margin-top: 8rpx; .comment-time { font-size: 22rpx; color: #999; margin-right: 24rpx; } .comment-reply { font-size: 22rpx; color: #007AFF; } }
    }
    .comment-like { display: flex; flex-direction: column; align-items: center; padding-left: 16rpx; .like-count { font-size: 22rpx; color: #999; } }
  }
}
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; align-items: center; padding-top: 16rpx; padding-left: 24rpx; padding-right: 24rpx; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); background: #FFF; box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.05); box-sizing: content-box;
  .comment-input { flex: 1; height: 72rpx; padding: 0 24rpx; background: #F5F5F5; border-radius: 36rpx; font-size: 28rpx; }
  .action-btns { display: flex; margin-left: 20rpx; .action-item { display: flex; flex-direction: column; align-items: center; margin-left: 24rpx; text { font-size: 20rpx; color: #999; } } }
}
</style>
