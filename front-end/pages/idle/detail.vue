<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
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

    <!-- 评论管理员操作菜单 -->
    <dm-admin-menu
      :show="showCommentAdminMenu"
      :target="currentComment"
      :target-user="currentComment.userInfo"
      @update:show="showCommentAdminMenu = $event"
      @action="handleCommentAdminAction"
    />

    <scroll-view class="content-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 价格区域 -->
      <view class="price-section">
        <view class="price-left">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ data.price }}</text>
        </view>
        <view class="price-right">
          <text class="want-count">{{ data.wantCount }}人想要</text>
          <text class="delivery-tag">{{ data.deliveryType }}</text>
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

      <!-- 发布者信息 -->
      <view class="info-section">
        <view class="info-row">
          <text class="location">{{ data.location }}</text>
        </view>
        <view class="user-row">
          <image class="user-avatar" :src="data.avatar" mode="aspectFill"></image>
          <text class="user-name">{{ data.nickname }}</text>
        </view>
        <view class="action-row">
          <view class="action-item" @click="handleCollect">
            <text :class="data.isCollected ? 'tn-icon-star-fill' : 'tn-icon-star'" style="font-size: 20px; color: #999999;"></text>
          </view>
          <view class="action-item" @click="handleShare">
            <text class="tn-icon-share" style="font-size: 20px; color: #999999;"></text>
          </view>
          <dm-manage-btn :show="isAdmin" @click="showAdminMenu = true" />
        </view>
      </view>

      <!-- 查看联系方式 -->
      <view class="contact-section" @click="handleViewContact">
        <text class="contact-text">查看联系方式</text>
        <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
      </view>

      <!-- 评论区域 -->
      <view class="comment-wrapper">
        <dm-comment-list
          :list="commentList"
          :total="data.commentCount"
          :sort-type="commentSort"
          :show-admin="isAdmin"
          @sort-change="handleSortChange"
          @like="handleLikeComment"
          @reply="handleReplyComment"
          @admin="showCommentMenu"
        />
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="btn-chat" @click="handleChat">聊一聊</view>
      <view class="btn-buy" @click="handleBuy">立即购买</view>
    </view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { idleApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      idleId: '',
      showAdminMenu: false,
      showCommentAdminMenu: false,
      commentSort: 'newest',
      commentList: [],
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
        isCollected: false,
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
    this.idleId = options.id
    const sys = uni.getWindowInfo()
    this.statusBarHeight = sys.statusBarHeight
    this.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
    this.scrollHeight = sys.windowHeight - sys.statusBarHeight - uni.upx2px(88) - uni.upx2px(120) - this.safeAreaBottom
    this.loadIdleDetail()
  },
  methods: {
    async loadIdleDetail() {
      const data = await idleApi.getDetail(this.idleId)
      this.data = data
      this.commentList = data.comments || []
    },
    goBack() {
      uni.navigateBack()
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
        default:
          uni.showToast({ title: '操作成功', icon: 'success' })
      }
    },
    showCommentMenu(e) {
      if (!e) return
      const comment = e.detail ? e.detail[0] : e
      if (!comment) return
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
    handleCommentAdminAction(data) {
      const { action } = data
      const commentIndex = this.commentList.findIndex(c => c.id === this.currentComment.id)
      if (commentIndex === -1) return

      switch (action) {
        case AdminAction.DELETE_POST:
          this.commentList.splice(commentIndex, 1)
          this.data.commentCount--
          uni.showToast({ title: '评论已删除', icon: 'success' })
          break
        case AdminAction.PIN_POST:
          this.commentList.forEach(c => c.isPinned = false)
          this.commentList[commentIndex].isPinned = true
          const pinnedComment = this.commentList.splice(commentIndex, 1)[0]
          this.commentList.unshift(pinnedComment)
          uni.showToast({ title: '评论已置顶', icon: 'success' })
          break
        case AdminAction.UNPIN_POST:
          this.commentList[commentIndex].isPinned = false
          uni.showToast({ title: '已取消置顶', icon: 'success' })
          break
        default:
          uni.showToast({ title: '操作成功', icon: 'success' })
      }
    },
    previewImage(i) {
      uni.previewImage({ urls: this.data.images, current: i })
    },
    handleShare() {
      uni.showToast({ title: '分享功能', icon: 'none' })
    },
    handleCollect() {
      this.data.isCollected = !this.data.isCollected
      uni.showToast({ title: this.data.isCollected ? '已收藏' : '已取消收藏', icon: 'none' })
    },
    handleViewContact() {
      uni.showModal({
        title: '联系方式',
        content: this.data.contact || '暂无联系方式',
        showCancel: false
      })
    },
    handleSortChange(e) {
      const type = e && e.detail ? e.detail[0] : (e || 'newest')
      this.commentSort = type
    },
    handleLikeComment(e) {
      if (!e) return
      const item = e.detail ? e.detail[0] : e
      if (item) item.likeCount = (item.likeCount || 0) + 1
    },
    handleReplyComment(e) {
      if (!e) return
      const comment = e.detail ? e.detail[0] : e
      const reply = e.detail && e.detail[1] ? e.detail[1] : null
      const replyTo = reply ? reply.nickname : (comment ? comment.nickname : '')
      if (replyTo) uni.showToast({ title: '回复 ' + replyTo, icon: 'none' })
    },
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
    handleBuy() {
      uni.showToast({ title: '立即购买', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;

  &.dark-mode {
    background-color: #1a1a1a;
  }
}

.nav-bar {
  background-color: #FFFFFF;

  .dark-mode & {
    background-color: #2a2a2a;
  }

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

      .dark-mode & {
        color: #e0e0e0;
      }
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }
}

.content-scroll {
  background-color: #F8F8F8;

  .dark-mode & {
    background-color: #1a1a1a;
  }
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  background-color: #FFFFFF;
  gap: 16rpx;

  .dark-mode & {
    background-color: #2a2a2a;
  }

  .price-left {
    display: flex;
    align-items: baseline;

    .price-symbol {
      font-size: 32rpx;
      color: #333333;

      .dark-mode & {
        color: #e0e0e0;
      }
    }

    .price-value {
      font-size: 56rpx;
      color: #333333;
      font-weight: 600;

      .dark-mode & {
        color: #e0e0e0;
      }
    }
  }

  .price-right {
    flex: 1;
    text-align: right;

    .want-count {
      display: block;
      font-size: 26rpx;
      color: #333333;

      .dark-mode & {
        color: #e0e0e0;
      }
    }

    .delivery-tag {
      display: block;
      font-size: 24rpx;
      color: #999999;
      margin-top: 8rpx;

      .dark-mode & {
        color: #808080;
      }
    }
  }
}

.desc-section {
  margin-top: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;

  .dark-mode & {
    background-color: #2a2a2a;
  }

  .desc-text {
    font-size: 30rpx;
    color: #333333;
    line-height: 1.6;

    .dark-mode & {
      color: #e0e0e0;
    }
  }
}

.image-section {
  padding: 0 24rpx 24rpx;
  background-color: #FFFFFF;

  .dark-mode & {
    background-color: #2a2a2a;
  }

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

  .dark-mode & {
    background-color: #2a2a2a;
  }

  .info-row {
    margin-bottom: 20rpx;

    .location {
      font-size: 26rpx;
      color: #999999;

      .dark-mode & {
        color: #808080;
      }
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

      .dark-mode & {
        color: #e0e0e0;
      }
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

  .dark-mode & {
    background-color: #2a2a2a;
  }

  .contact-text {
    font-size: 28rpx;
    color: #333333;

    .dark-mode & {
      color: #e0e0e0;
    }
  }
}

.comment-wrapper {
  margin-top: 20rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 24rpx;
  padding-top: 16rpx;
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
  box-sizing: content-box;

  .dark-mode & {
    background-color: #2a2a2a;
    box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.3);
  }

  .btn-chat {
    flex: 1;
    height: 88rpx;
    border: 1rpx solid #007AFF;
    border-radius: 44rpx;
    font-size: 30rpx;
    color: #007AFF;
    display: flex;
    align-items: center;
    justify-content: center;

    .dark-mode & {
      color: #5a9fff;
      border-color: #5a9fff;
      background: rgba(90,159,255,0.1);
    }
  }

  .btn-buy {
    flex: 1;
    height: 88rpx;
    background-color: #007AFF;
    border-radius: 44rpx;
    font-size: 30rpx;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
