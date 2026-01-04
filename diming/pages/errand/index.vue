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
          title: '任务类型',
          key: 'type',
          items: [
            { label: '全部', value: '' },
            { label: '代取快递', value: 'express' },
            { label: '代买商品', value: 'buy' },
            { label: '代打印/复印', value: 'print' },
            { label: '代排队', value: 'queue' },
            { label: '其他跑腿', value: 'other' }
          ]
        },
        {
          title: '价格范围',
          key: 'price',
          items: [
            { label: '全部', value: '' },
            { label: '0-5元', value: '0-5' },
            { label: '5-10元', value: '5-10' },
            { label: '10-20元', value: '10-20' },
            { label: '20元以上', value: '20+' }
          ]
        },
        {
          title: '时间要求',
          key: 'time',
          items: [
            { label: '全部', value: '' },
            { label: '1小时内', value: '1h' },
            { label: '今天内', value: 'today' },
            { label: '明天内', value: 'tomorrow' }
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
