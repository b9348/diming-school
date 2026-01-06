<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 搜索栏 -->
    <dm-search
      placeholder="请输入搜索关键词"
      :disabled="true"
      :show-filter="true"
      :show-switch="true"
      @click="goSearch"
      @filter="showFilter = true"
      @switch="switchCommunity"
    />

    <!-- 滚动区域 -->
    <scroll-view
      class="scroll-container"
      scroll-y
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <!-- 轮播图 -->
      <dm-swiper :list="bannerList" @click="handleBannerClick" />

      <!-- 公告栏 -->
      <dm-notice :list="noticeList" @click="handleNoticeClick" />

      <!-- Tabs -->
      <dm-tabs :list="tabList" :current="currentTab" @change="handleTabChange" />

      <!-- 跑腿列表 -->
      <view class="errand-list">
        <view
          v-for="(item, index) in errandList"
          :key="index"
          class="errand-card"
          @click="goErrandDetail(item)"
        >
          <view class="errand-header">
            <view class="price-box">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ item.price }}</text>
            </view>
            <text class="errand-deadline">{{ item.deadline }}</text>
          </view>
          <text class="errand-content ellipsis-2">{{ item.content }}</text>
          <view class="errand-images" v-if="item.images && item.images.length">
            <image
              v-for="(img, idx) in item.images.slice(0, 3)"
              :key="idx"
              class="errand-image"
              :src="img"
              mode="aspectFill"
            ></image>
          </view>
          <view class="errand-footer">
            <text class="errand-location">{{ item.location }}</text>
            <view class="errand-user">
              <image class="user-avatar" :src="item.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
              <text class="user-name">{{ item.nickname }}</text>
              <text class="errand-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-area-bottom">
      <view class="action-btn" @click="handleAction">抢单/进行中/已完成</view>
    </view>

    <!-- 筛选弹窗 -->
    <dm-filter
      :visible.sync="showFilter"
      :options="filterOptions"
      :value="filterValue"
      @confirm="handleFilterConfirm"
    />

    <!-- 自定义 TabBar -->
    <dm-tabbar />
  </view>
</template>

<script>
import { errandApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      currentTab: 0,
      loading: false,
      noMore: false,
      page: 1,
      showFilter: false,
      bannerList: [
        { image: 'https://iph.href.lu/750x300?text=轮播图1', url: '' }
      ],
      noticeList: [
        { tag: '公告', content: '显示公告前50字' }
      ],
      tabList: ['新任务', '我发布的', '我抢的', '已被抢', '被接单的'],
      errandList: [],
      filterOptions: [
        {
          title: '价格',
          key: 'price',
          type: 'input-range',
          minPlaceholder: '最低价',
          maxPlaceholder: '最高价'
        },
        {
          title: '任务状态',
          key: 'status',
          items: [
            { label: '待抢单', value: 'pending' },
            { label: '进行中', value: 'ongoing' },
            { label: '已完成', value: 'completed' }
          ]
        },
        {
          title: '完成时间',
          key: 'finishTime',
          items: [
            { label: '多少小时内', value: 'hours' },
            { label: '指定日期前', value: 'date' }
          ]
        },
        {
          title: '排序方式',
          key: 'sort',
          items: [
            { label: '综合排序', value: 'default' },
            { label: '价格升序', value: 'price_asc' },
            { label: '价格降序', value: 'price_desc' }
          ]
        },
        {
          title: '发布时间',
          key: 'timeRange',
          items: [
            { label: '不限', value: '' },
            { label: '一天内', value: '1d' },
            { label: '三天内', value: '3d' },
            { label: '一周内', value: '1w' },
            { label: '半个月内', value: '15d' },
            { label: '一个月内', value: '1m' },
            { label: '三个月内', value: '3m' },
            { label: '六个月内', value: '6m' }
          ]
        }
      ],
      filterValue: {}
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadErrandList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const searchBarHeight = uni.upx2px(104)
      const bottomBarHeight = uni.upx2px(120)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - searchBarHeight - bottomBarHeight
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    switchCommunity() {
      uni.showToast({ title: '切换社区', icon: 'none' })
    },
    handleBannerClick({ item, index }) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      }
    },
    handleNoticeClick({ item, index }) {
      uni.showToast({ title: item.content, icon: 'none' })
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.errandList = []
      this.noMore = false
      this.loadErrandList()
    },
    handleFilterConfirm(value) {
      this.filterValue = value
      this.page = 1
      this.errandList = []
      this.noMore = false
      this.loadErrandList()
    },
    async loadErrandList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await errandApi.getList({
        page: this.page,
        pageSize: 10,
        tab: this.tabList[this.currentTab],
        ...this.filterValue
      })

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.errandList = [...this.errandList, ...data.list]
        this.page++
      }
      this.loading = false
    },
    loadMore() {
      this.loadErrandList()
    },
    goErrandDetail(item) {
      uni.navigateTo({ url: '/pages/errand/detail?id=' + item.id })
    },
    handleAction() {
      uni.showToast({ title: '切换状态', icon: 'none' })
    },
    goPublish() {
      uni.navigateTo({ url: '/pages/publish/errand' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.status-bar {
  background-color: #FFFFFF;
}

.scroll-container {
  background-color: #F8F8F8;
}

.errand-list {
  padding: 0 24rpx;
}

.errand-card {
  margin-bottom: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;

  .errand-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .price-box {
      .price-symbol {
        font-size: 24rpx;
        color: #FF3B30;
      }

      .price-value {
        font-size: 48rpx;
        color: #FF3B30;
        font-weight: 600;
      }
    }

    .errand-deadline {
      font-size: 24rpx;
      color: #999999;
    }
  }

  .errand-content {
    font-size: 28rpx;
    color: #333333;
    line-height: 1.6;
    margin-bottom: 16rpx;
  }

  .errand-images {
    display: flex;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .errand-image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 8rpx;
    }
  }

  .errand-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .errand-location {
      font-size: 24rpx;
      color: #999999;
    }

    .errand-user {
      display: flex;
      align-items: center;

      .user-avatar {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        margin-right: 8rpx;
      }

      .user-name {
        font-size: 24rpx;
        color: #666666;
        margin-right: 16rpx;
      }

      .errand-time {
        font-size: 22rpx;
        color: #999999;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx;
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);

  .action-btn {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    color: #333333;
    background-color: #F5F5F5;
    border-radius: 44rpx;
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}
</style>
