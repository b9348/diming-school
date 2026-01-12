<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">消息通知</text>
        <view class="nav-right" @click="markAllRead" v-if="hasUnread">
          <text>全部已读</text>
        </view>
        <view class="nav-placeholder" v-else></view>
      </view>
    </view>

    <!-- 通知类型 Tabs -->
    <view class="notify-tabs">
      <view
        class="tab-item"
        :class="{ active: currentTab === index }"
        v-for="(tab, index) in tabList"
        :key="index"
        @click="switchTab(index)"
      >
        <text class="tab-text">{{ tab.name }}</text>
        <view class="tab-badge" v-if="tab.unread > 0">{{ tab.unread > 99 ? '99+' : tab.unread }}</view>
      </view>
    </view>

    <!-- 通知列表 -->
    <scroll-view
      class="list-scroll"
      scroll-y
      :style="{ height: listHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view
        class="notify-item"
        :class="{ unread: !item.isRead }"
        v-for="(item, index) in notifyList"
        :key="index"
        @click="goNotifyDetail(item)"
      >
        <view class="notify-icon" :style="{ backgroundColor: getIconBg(item.type) }">
          <text class="tn-icon-getIcon(item.type)"></text>
        </view>
        <view class="notify-content">
          <view class="notify-header">
            <text class="notify-title">{{ item.title }}</text>
            <text class="notify-time">{{ item.time }}</text>
          </view>
          <text class="notify-desc ellipsis-2">{{ item.content }}</text>
          <view class="notify-extra" v-if="item.extra">
            <image
              class="extra-image"
              v-if="item.extra.image"
              :src="item.extra.image"
              mode="aspectFill"
            ></image>
            <text class="extra-text" v-if="item.extra.text">{{ item.extra.text }}</text>
          </view>
        </view>
        <view class="unread-dot" v-if="!item.isRead"></view>
      </view>

      <view class="empty-tip" v-if="notifyList.length === 0 && !loading">
        <text class="tn-icon-notification" style="font-size: 48px; color: #CCCCCC;"></text>
        <text>暂无消息</text>
      </view>

      <view class="load-more" v-if="notifyList.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { userApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      listHeight: 0,
      currentTab: 0,
      tabList: [
        { name: '全部', key: 'all', unread: 0 },
        { name: '系统通知', key: 'system', unread: 0 },
        { name: '互动消息', key: 'interact', unread: 0 },
        { name: '交易通知', key: 'trade', unread: 0 }
      ],
      notifyList: [],
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false
    }
  },
  computed: {
    hasUnread() {
      return this.notifyList.some(item => !item.isRead)
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadNotifyList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      const tabHeight = uni.upx2px(88)
      this.listHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - tabHeight
    },
    goBack() {
      uni.navigateBack()
    },
    switchTab(index) {
      this.currentTab = index
      this.page = 1
      this.notifyList = []
      this.noMore = false
      this.loadNotifyList()
    },
    async loadNotifyList() {
      if (this.loading || this.noMore) return
      this.loading = true

      try {
        const res = await userApi.getNotifications({
          page: this.page,
          pageSize: this.pageSize,
          type: this.tabList[this.currentTab].key
        })
        const list = res.list || []
        if (list.length < this.pageSize) {
          this.noMore = true
        }
        this.notifyList = [...this.notifyList, ...list]
        this.page++

        // 更新未读数量
        if (res.unreadCounts) {
          this.tabList.forEach(tab => {
            tab.unread = res.unreadCounts[tab.key] || 0
          })
        }
      } catch (e) {
        console.error('加载通知失败', e)
      }
      this.loading = false
    },
    loadMore() {
      this.loadNotifyList()
    },
    getIcon(type) {
      const iconMap = {
        system: 'info-filled',
        interact: 'chat-filled',
        trade: 'wallet-filled',
        like: 'heart-filled',
        comment: 'chatbubble-filled',
        follow: 'personadd-filled'
      }
      return iconMap[type] || 'notification-filled'
    },
    getIconBg(type) {
      const bgMap = {
        system: '#007AFF',
        interact: '#FF9500',
        trade: '#4CAF50',
        like: '#FF3B30',
        comment: '#5856D6',
        follow: '#00BCD4'
      }
      return bgMap[type] || '#999999'
    },
    async goNotifyDetail(item) {
      // 标记为已读
      if (!item.isRead) {
        try {
          await userApi.markNotificationRead(item.id)
          item.isRead = true
          const tab = this.tabList.find(t => t.key === item.type || t.key === 'all')
          if (tab && tab.unread > 0) tab.unread--
        } catch (e) {
          console.error('标记已读失败', e)
        }
      }

      // 跳转到相关页面
      if (item.targetUrl) {
        uni.navigateTo({ url: item.targetUrl })
      } else if (item.targetType && item.targetId) {
        const urlMap = {
          post: '/pages/post/detail',
          vote: '/pages/vote/detail',
          errand: '/pages/errand/detail',
          idle: '/pages/idle/detail',
          help: '/pages/help/detail',
          order: '/pages/mine/order-detail',
          user: '/pages/user/profile'
        }
        const url = urlMap[item.targetType]
        if (url) {
          uni.navigateTo({ url: `${url}?id=${item.targetId}` })
        }
      }
    },
    async markAllRead() {
      uni.showModal({
        title: '全部已读',
        content: '确定将所有消息标记为已读吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.markAllNotificationsRead()
              this.notifyList.forEach(item => {
                item.isRead = true
              })
              this.tabList.forEach(tab => {
                tab.unread = 0
              })
              uni.showToast({ title: '已全部标记', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '操作失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/dark-mode.scss';

.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;

  .dark-mode & {
    background-color: $dark-bg-primary;
  }
}

.nav-bar {
  background-color: #FFFFFF;
  .dark-mode & {
    background-color: $dark-bg-secondary;
  }
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 24rpx;
    .nav-back { padding: 10rpx; }
    .nav-title {
      font-size: 34rpx;
      color: #333333;
      font-weight: 600;
      .dark-mode & {
        color: $dark-text-primary;
      }
    }
    .nav-right {
      font-size: 28rpx;
      color: #007AFF;
      padding: 10rpx;
    }
    .nav-placeholder { width: 80rpx; }
  }
}

.notify-tabs {
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F5F5F5;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
    border-color: $dark-border;
  }

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    position: relative;

    .tab-text {
      font-size: 28rpx;
      color: #666666;
      transition: color 0.3s ease;

      .dark-mode & {
        color: $dark-text-secondary;
      }
    }

    .tab-badge {
      position: absolute;
      top: 16rpx;
      right: 16rpx;
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      font-size: 20rpx;
      color: #FFFFFF;
      background-color: #FF3B30;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.active .tab-text {
      color: #007AFF;
      font-weight: 600;
    }
  }
}

.list-scroll {
  padding: 20rpx 0;
}

.notify-item {
  display: flex;
  align-items: flex-start;
  margin: 0 24rpx 16rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  position: relative;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }

  &.unread {
    background-color: #F0F7FF;

    .dark-mode & {
      background-color: rgba(0, 122, 255, 0.15);
    }
  }

  .notify-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .notify-content {
    flex: 1;
    min-width: 0;
    margin-left: 20rpx;

    .notify-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .notify-title {
        font-size: 28rpx;
        color: #333333;
        font-weight: 500;
        .dark-mode & {
          color: $dark-text-primary;
        }
      }

      .notify-time {
        font-size: 22rpx;
        color: #999999;
        .dark-mode & {
          color: $dark-text-tertiary;
        }
      }
    }

    .notify-desc {
      font-size: 26rpx;
      color: #666666;
      line-height: 1.5;
      .dark-mode & {
        color: $dark-text-secondary;
      }
    }

    .notify-extra {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      padding: 16rpx;
      background-color: #F8F8F8;
      border-radius: 8rpx;
      transition: background-color 0.3s ease;

      .dark-mode & {
        background-color: $dark-bg-tertiary;
      }

      .extra-image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 8rpx;
        margin-right: 16rpx;
      }

      .extra-text {
        flex: 1;
        font-size: 24rpx;
        color: #999999;
        .dark-mode & {
          color: $dark-text-tertiary;
        }
      }
    }
  }

  .unread-dot {
    position: absolute;
    top: 24rpx;
    right: 24rpx;
    width: 16rpx;
    height: 16rpx;
    background-color: #FF3B30;
    border-radius: 50%;
  }
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  text {
    font-size: 28rpx;
    color: #999999;
    margin-top: 20rpx;
    .dark-mode & {
      color: $dark-text-tertiary;
    }
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
  .dark-mode & {
    color: $dark-text-tertiary;
  }
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
