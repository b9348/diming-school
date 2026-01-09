<template>
  <view class="page-container">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">个人详情</text>
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
      <!-- 头像和昵称 -->
      <view class="profile-header">
        <image class="profile-avatar" :src="data.avatar" mode="aspectFill"></image>
        <text class="profile-name">{{ data.nickname }}</text>
        <!-- 管理按钮 -->
        <dm-manage-btn :show="isAdmin" @click="showAdminMenu = true" />
      </view>

      <!-- 基本信息行 -->
      <view class="info-line">
        <text>{{ data.gender }}</text>
        <text>{{ data.birthday }}</text>
        <text>{{ data.height }}</text>
        <text>{{ data.weight }}</text>
        <text>{{ data.school }}</text>
        <text>{{ data.education }}</text>
        <text>{{ data.major }}</text>
      </view>

      <!-- 详细信息行 -->
      <view class="info-line detail">
        <text>{{ data.job }}</text>
        <text>现居{{ data.location }}</text>
        <text>{{ data.hometown }}人</text>
        <text>{{ data.schedule }}</text>
        <text>{{ data.smoke }}</text>
        <text>{{ data.drink }}</text>
        <text>{{ data.snore }}</text>
        <text>{{ data.longDistance }}</text>
      </view>

      <!-- 各项介绍 -->
      <view class="intro-item">
        <text class="intro-label">我的标签</text>
        <text class="intro-value">{{ data.tags }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">我的性格</text>
        <text class="intro-value">{{ data.personality }}</text>
      </view>

      <view class="intro-item highlight">
        <text class="intro-label">兴趣爱好</text>
        <text class="intro-value">{{ data.hobbies }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">爱情观</text>
        <text class="intro-value">{{ data.loveView }}</text>
      </view>

      <view class="intro-item highlight">
        <text class="intro-label">三观</text>
        <text class="intro-value">{{ data.values }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">日常生活</text>
        <text class="intro-value">{{ data.dailyLife }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">未来规划</text>
        <text class="intro-value">{{ data.futurePlan }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">成长经历</text>
        <text class="intro-value">{{ data.growthExp }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">家庭情况</text>
        <text class="intro-value">{{ data.family }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">自我评价</text>
        <text class="intro-value">{{ data.selfEval }}</text>
      </view>

      <view class="intro-item">
        <text class="intro-label">期待的ta</text>
        <text class="intro-value">{{ data.expectation }}</text>
      </view>

      <!-- 交友问题 -->
      <view class="qa-item">
        <text class="qa-question">对方不咋会聊天，会陪ta尬聊吗</text>
        <text class="qa-answer">{{ data.q1 }}</text>
      </view>

      <view class="qa-item">
        <text class="qa-question">对方心情差时，会为ta做些什么</text>
        <text class="qa-answer">{{ data.q2 }}</text>
      </view>

      <view class="qa-item">
        <text class="qa-question">网聊多久后会线下见面</text>
        <text class="qa-answer">{{ data.q3 }}</text>
      </view>

      <!-- 个人形象照片 -->
      <view class="photo-section">
        <view class="photo-grid">
          <image
            v-for="(img, i) in data.images"
            :key="i"
            class="photo-item"
            :src="img"
            mode="aspectFill"
            @click="previewImage(i)"
          ></image>
        </view>
      </view>

      <!-- 吃瓜数 -->
      <view class="stats-row">
        <text class="stats-text">{{ data.viewCount }}人吃瓜</text>
      </view>

      <!-- 互动按钮 -->
      <view class="action-row">
        <view class="action-item" @click="handleAction('like')">
          <text class="tn-icon-caring" style="font-size: 20px; color: #999999;"></text>
          <text>{{ data.likeCount }}</text>
        </view>
        <view class="action-item" @click="handleAction('comment')">
          <text class="tn-icon-comment" style="font-size: 20px; color: #999999;"></text>
          <text>{{ data.commentCount }}</text>
        </view>
        <view class="action-item" @click="toggleFavorite">
          <text class="tn-icon-isFavorite ? 'star-filled' : 'star'"></text>
          <text>{{ data.favoriteCount }}</text>
        </view>
        <view class="action-item" @click="handleAction('share')">
          <text class="tn-icon-redo" style="font-size: 20px; color: #999999;"></text>
          <text>{{ data.shareCount }}</text>
        </view>
        <view class="action-item" @click="handleAction('reward')">
          <text class="tn-icon-gift" style="font-size: 20px; color: #999999;"></text>
          <text>{{ data.rewardCount }}</text>
        </view>
        <view class="action-item" @click="showMore">
          <text class="tn-icon-more-circle-fill" style="font-size: 20px; color: #999999;"></text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部查看联系方式 -->
    <view class="bottom-bar">
      <view class="contact-btn" @click="viewContact">
        <text class="contact-text">查看联系方式</text>
        <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
      </view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { AdminAction } from '@/utils/admin.js'
import { loveApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      loveId: '',
      isFavorite: false,
      showAdminMenu: false,
      data: {
        avatar: '',
        nickname: '',
        gender: '',
        birthday: '',
        height: '',
        weight: '',
        school: '',
        education: '',
        major: '',
        job: '',
        location: '',
        hometown: '',
        schedule: '',
        smoke: '',
        drink: '',
        snore: '',
        longDistance: '',
        tags: '',
        personality: '',
        hobbies: '',
        loveView: '',
        values: '',
        dailyLife: '',
        futurePlan: '',
        growthExp: '',
        family: '',
        selfEval: '',
        expectation: '',
        q1: '',
        q2: '',
        q3: '',
        images: [],
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        favoriteCount: 0,
        shareCount: 0,
        rewardCount: 0,
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
    this.loveId = options.id
    const sys = uni.getWindowInfo()
    this.statusBarHeight = sys.statusBarHeight
    this.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom
    this.scrollHeight = sys.windowHeight - sys.statusBarHeight - uni.upx2px(88) - uni.upx2px(100) - this.safeAreaBottom
    this.loadLoveDetail()
  },
  methods: {
    async loadLoveDetail() {
      const data = await loveApi.getDetail(this.loveId)
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
              this.handleAction('share')
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
    async handleAction(type) {
      if (type === 'like') {
        await loveApi.like(this.loveId)
        this.data.likeCount++
      }
      const actions = {
        like: '已点赞',
        comment: '评论功能',
        share: '分享功能',
        reward: '打赏功能'
      }
      uni.showToast({ title: actions[type] || type, icon: 'none' })
    },
    viewContact() {
      uni.showModal({
        title: '联系方式',
        content: '微信号：zhangsan123\nQQ：123456789',
        showCancel: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #FFFFFF;
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
  background-color: #FFFFFF;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 0;
  position: relative;

  .profile-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-bottom: 16rpx;
  }

  .profile-name {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
  }

  .admin-btn {
    position: absolute;
    right: 24rpx;
    top: 32rpx;
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    border-radius: 24rpx;

    text {
      font-size: 24rpx;
      color: #FFF;
    }
  }
}

.info-line {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;

  text {
    font-size: 26rpx;
    color: #333333;
  }

  &.detail {
    text {
      color: #666666;
    }
  }
}

.intro-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;

  &.highlight {
    background-color: #FAFAFA;
  }

  .intro-label {
    font-size: 26rpx;
    color: #999999;
    width: 140rpx;
    flex-shrink: 0;
  }

  .intro-value {
    flex: 1;
    font-size: 26rpx;
    color: #333333;
    line-height: 1.5;
  }
}

.qa-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;

  .qa-question {
    font-size: 26rpx;
    color: #666666;
  }

  .qa-answer {
    font-size: 26rpx;
    color: #333333;
  }
}

.photo-section {
  padding: 24rpx;

  .photo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .photo-item {
      width: 218rpx;
      height: 218rpx;
      border-radius: 8rpx;
    }
  }
}

.stats-row {
  padding: 16rpx 24rpx;

  .stats-text {
    font-size: 26rpx;
    color: #BBBBBB;
  }
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16rpx 24rpx;
  gap: 32rpx;
  border-bottom: 1rpx solid #F5F5F5;

  .action-item {
    display: flex;
    align-items: center;
    gap: 8rpx;

    text {
      font-size: 24rpx;
      color: #999999;
    }
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

  .contact-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    background-color: #F8F8F8;
    border-radius: 12rpx;

    .contact-text {
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
