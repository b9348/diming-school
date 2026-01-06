<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">浏览历史</text>
        <view class="nav-right" @click="clearHistory">
          <text>清空</text>
        </view>
      </view>
    </view>

    <!-- 历史列表 -->
    <scroll-view
      class="list-scroll"
      scroll-y
      :style="{ height: listHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <!-- 按日期分组 -->
      <view class="date-group" v-for="(group, gIndex) in groupedHistory" :key="gIndex">
        <view class="date-header">
          <text class="date-text">{{ group.date }}</text>
          <text class="date-count">{{ group.list.length }}条记录</text>
        </view>

        <view class="history-item" v-for="(item, index) in group.list" :key="index" @click="goDetail(item)">
          <image class="item-image" :src="item.cover || (item.images && item.images[0]) || 'https://iph.href.lu/120x120?text=图'" mode="aspectFill"></image>
          <view class="item-content">
            <text class="item-title ellipsis-2">{{ item.title || item.content }}</text>
            <view class="item-meta">
              <view class="meta-left">
                <text class="meta-type">{{ getTypeName(item.type) }}</text>
                <text class="meta-author">{{ item.nickname || '匿名用户' }}</text>
              </view>
              <text class="meta-time">{{ item.viewTime }}</text>
            </view>
          </view>
          <view class="item-delete" @click.stop="deleteHistory(item, gIndex, index)">
            <uni-icons type="close" size="16" color="#999999"></uni-icons>
          </view>
        </view>
      </view>

      <view class="empty-tip" v-if="historyList.length === 0 && !loading">
        <uni-icons type="eye" size="48" color="#CCCCCC"></uni-icons>
        <text>暂无浏览记录</text>
      </view>

      <view class="load-more" v-if="historyList.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { userApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      listHeight: 0,
      historyList: [],
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false
    }
  },
  computed: {
    groupedHistory() {
      const groups = {}
      const today = this.formatDate(new Date())
      const yesterday = this.formatDate(new Date(Date.now() - 86400000))

      this.historyList.forEach(item => {
        const date = item.viewDate || this.formatDate(new Date(item.viewTime))
        let displayDate = date
        if (date === today) {
          displayDate = '今天'
        } else if (date === yesterday) {
          displayDate = '昨天'
        }

        if (!groups[displayDate]) {
          groups[displayDate] = {
            date: displayDate,
            list: []
          }
        }
        groups[displayDate].list.push(item)
      })

      return Object.values(groups)
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadHistory()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      this.listHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight
    },
    formatDate(date) {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },
    goBack() {
      uni.navigateBack()
    },
    async loadHistory() {
      if (this.loading || this.noMore) return
      this.loading = true

      try {
        const res = await userApi.getHistory({
          page: this.page,
          pageSize: this.pageSize
        })
        const list = res.list || []
        if (list.length < this.pageSize) {
          this.noMore = true
        }
        this.historyList = [...this.historyList, ...list]
        this.page++
      } catch (e) {
        console.error('加载历史失败', e)
      }
      this.loading = false
    },
    loadMore() {
      this.loadHistory()
    },
    getTypeName(type) {
      const typeMap = {
        post: '帖子',
        vote: '投票',
        errand: '跑腿',
        idle: '闲置',
        help: '互助',
        love: '交友'
      }
      return typeMap[type] || '帖子'
    },
    goDetail(item) {
      const detailPageMap = {
        post: '/pages/post/detail',
        vote: '/pages/vote/detail',
        errand: '/pages/errand/detail',
        idle: '/pages/idle/detail',
        help: '/pages/help/detail',
        love: '/pages/love/detail'
      }
      const url = detailPageMap[item.type] || '/pages/post/detail'
      uni.navigateTo({ url: `${url}?id=${item.id}` })
    },
    deleteHistory(item, gIndex, index) {
      uni.showModal({
        title: '删除记录',
        content: '确定删除这条浏览记录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.deleteHistory(item.id)
              this.historyList = this.historyList.filter(h => h.id !== item.id)
              uni.showToast({ title: '删除成功', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    clearHistory() {
      if (this.historyList.length === 0) {
        uni.showToast({ title: '暂无记录', icon: 'none' })
        return
      }
      uni.showModal({
        title: '清空历史',
        content: '确定清空所有浏览记录吗？',
        confirmText: '清空',
        confirmColor: '#FF3B30',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.clearHistory()
              this.historyList = []
              uni.showToast({ title: '清空成功', icon: 'success' })
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
    .nav-back { padding: 10rpx; }
    .nav-title { font-size: 34rpx; color: #333333; font-weight: 600; }
    .nav-right {
      font-size: 28rpx;
      color: #FF3B30;
      padding: 10rpx;
    }
  }
}

.list-scroll {
  padding: 20rpx 0;
}

.date-group {
  margin-bottom: 20rpx;

  .date-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;

    .date-text {
      font-size: 28rpx;
      color: #333333;
      font-weight: 600;
    }

    .date-count {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

.history-item {
  display: flex;
  align-items: center;
  margin: 0 24rpx 16rpx;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .item-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }

  .item-content {
    flex: 1;
    min-width: 0;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 140rpx;

    .item-title {
      font-size: 28rpx;
      color: #333333;
      font-weight: 500;
      line-height: 1.4;
    }

    .item-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .meta-left {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .meta-type {
          font-size: 22rpx;
          color: #007AFF;
          padding: 4rpx 12rpx;
          background-color: rgba(0, 122, 255, 0.1);
          border-radius: 4rpx;
        }

        .meta-author {
          font-size: 22rpx;
          color: #666666;
        }
      }

      .meta-time {
        font-size: 22rpx;
        color: #999999;
      }
    }
  }

  .item-delete {
    padding: 20rpx;
    margin-right: -10rpx;
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
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
