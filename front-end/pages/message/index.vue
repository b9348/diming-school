<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 搜索栏 -->
    <dm-search
      placeholder="请输入搜索关键词"
      :disabled="true"
      @click="goSearch"
    />

    <!-- 消息分类Tabs -->
    <view class="message-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view class="tabs-wrapper">
          <view
            v-for="(item, index) in tabList"
            :key="index"
            class="tab-item"
            :class="{ active: currentTab === index }"
            @click="handleTabChange(index)"
          >
            <text class="tab-text">{{ item }}</text>
            <view v-if="unreadCounts[index] > 0" class="tab-badge">{{ unreadCounts[index] > 99 ? '99+' : unreadCounts[index] }}</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="message-scroll"
      scroll-y
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="message-list">
        <view
          v-for="(item, index) in messageList"
          :key="index"
          class="message-item"
          @click="goChat(item)"
        >
          <view class="avatar-box">
            <image class="message-avatar" :src="item.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
            <view v-if="item.unread > 0" class="unread-badge">{{ item.unread > 99 ? '99+' : item.unread }}</view>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-name">{{ item.name }}</text>
              <text class="message-time">{{ item.time }}</text>
            </view>
            <text class="message-text ellipsis">{{ item.lastMessage }}</text>
          </view>
          <image v-if="item.lastImage" class="message-image" :src="item.lastImage" mode="aspectFill"></image>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>

    <!-- 自定义 TabBar -->
    <dm-tabbar />
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { messageApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      currentTab: 0,
      loading: false,
      noMore: false,
      page: 1,
      tabList: ['系统通知', '跑腿私信', '互助私信', '闲置私信', '群私信', '恋爱私信'],
      unreadCounts: [0, 0, 0, 0, 0, 0],
      messageList: []
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadMessageList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const searchBarHeight = uni.upx2px(104)
      const tabsHeight = uni.upx2px(88)
      const tabBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - searchBarHeight - tabsHeight - tabBarHeight
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.messageList = []
      this.noMore = false
      this.loadMessageList()
    },
    async loadMessageList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await messageApi.getList({
        page: this.page,
        pageSize: 10,
        type: this.tabList[this.currentTab]
      })

      // 更新未读数
      if (data.unreadCounts) {
        this.unreadCounts = data.unreadCounts
      }

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.messageList = [...this.messageList, ...data.list]
        this.page++
      }
      this.loading = false
    },
    loadMore() {
      this.loadMessageList()
    },
    goChat(item) {
      uni.navigateTo({ url: '/pages/chat/index?id=' + item.id + '&name=' + item.name })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: #1a1a1a;
  }
}

.status-bar {
  background-color: #FFFFFF;
  transition: background-color 0.3s ease;

  .page-container.dark-mode & {
    background-color: #2a2a2a;
  }
}

.message-tabs {
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #EEEEEE;
  transition: all 0.3s ease;

  .page-container.dark-mode & {
    background-color: #2a2a2a;
    border-bottom-color: #444444;
  }

  .tabs-scroll {
    white-space: nowrap;

    .tabs-wrapper {
      display: inline-flex;

      .tab-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 24rpx 28rpx;

        .tab-text {
          font-size: 28rpx;
          color: #666666;
          transition: color 0.3s ease;

          .page-container.dark-mode & {
            color: #b0b0b0;
          }
        }

        .tab-badge {
          position: absolute;
          top: 12rpx;
          right: 8rpx;
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

        &.active {
          .tab-text {
            color: #007AFF;
            font-weight: 600;

            .page-container.dark-mode & {
              color: #5a9fff;
            }
          }
        }
      }
    }
  }
}

.message-scroll {
  background-color: #FFFFFF;
  transition: background-color 0.3s ease;

  .page-container.dark-mode & {
    background-color: #1a1a1a;
  }
}

.message-list {
  .message-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #F5F5F5;
    transition: all 0.3s ease;

    .page-container.dark-mode & {
      border-bottom-color: #3a3a3a;
    }

    .avatar-box {
      position: relative;
      margin-right: 20rpx;

      .message-avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
      }

      .unread-badge {
        position: absolute;
        top: -8rpx;
        right: -8rpx;
        min-width: 36rpx;
        height: 36rpx;
        padding: 0 10rpx;
        font-size: 22rpx;
        color: #FFFFFF;
        background-color: #FF3B30;
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .message-content {
      flex: 1;
      overflow: hidden;

      .message-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8rpx;

        .message-name {
          font-size: 30rpx;
          color: #333333;
          font-weight: 500;
          transition: color 0.3s ease;

          .page-container.dark-mode & {
            color: #e0e0e0;
          }
        }

        .message-time {
          font-size: 24rpx;
          color: #999999;
          transition: color 0.3s ease;

          .page-container.dark-mode & {
            color: #808080;
          }
        }
      }

      .message-text {
        font-size: 26rpx;
        color: #999999;
        transition: color 0.3s ease;

        .page-container.dark-mode & {
          color: #808080;
        }
      }
    }

    .message-image {
      width: 80rpx;
      height: 80rpx;
      margin-left: 16rpx;
      border-radius: 8rpx;
    }
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}
</style>
