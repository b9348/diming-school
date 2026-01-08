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

      <!-- 公告/活动/推荐 -->
      <view class="info-section" v-if="noticeInfo || activityInfo || recommendInfo">
        <view class="info-item notice-item" v-if="noticeInfo" @click="handleInfoClick(noticeInfo)">
          <text class="info-tag notice-tag">公告</text>
          <text class="info-divider">|</text>
          <text class="info-text ellipsis">{{ noticeInfo.content }}</text>
        </view>
        <view class="info-item activity-item" v-if="activityInfo" @click="handleInfoClick(activityInfo)">
          <text class="info-tag activity-tag">活动</text>
          <text class="info-divider">|</text>
          <text class="info-text ellipsis">{{ activityInfo.content }}</text>
        </view>
        <view class="info-item recommend-item" v-if="recommendInfo" @click="handleInfoClick(recommendInfo)">
          <text class="info-tag recommend-tag">{{ recommendInfo.tag || '推荐' }}</text>
          <text class="info-divider">|</text>
          <text class="info-text ellipsis">{{ recommendInfo.content }}</text>
        </view>
      </view>

      <!-- Tabs -->
      <dm-tabs :list="tabList" :current="currentTab" @change="handleTabChange" />

      <!-- 互助列表(拍卖/竞价) -->
      <view class="help-list">
        <view
          v-for="(item, index) in helpList"
          :key="index"
          class="help-card"
          @click="goHelpDetail(item)"
        >
          <!-- 倒计时和当前价 -->
          <view class="help-header">
            <view class="countdown-box">
              <text class="countdown">{{ item.countdown }}</text>
            </view>
            <view class="current-price">
              <text class="price-label">当前</text>
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ item.currentPrice }}</text>
            </view>
          </view>

          <!-- 商品描述 -->
          <text class="help-content ellipsis-2">{{ item.content }}</text>

          <!-- 图片 -->
          <view class="help-images" v-if="item.images && item.images.length">
            <image
              v-for="(img, idx) in item.images.slice(0, 3)"
              :key="idx"
              class="help-image"
              :src="img"
              mode="aspectFill"
            ></image>
          </view>

          <!-- 底部信息 -->
          <view class="help-footer">
            <text class="delivery-time">{{ item.deliveryTime }}</text>
            <text class="help-location">{{ item.location }}</text>
          </view>
          <view class="help-meta">
            <text class="bid-increment">加价幅度 ¥{{ item.bidIncrement }}</text>
            <view class="help-user">
              <image class="user-avatar" :src="item.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
              <text class="user-name">{{ item.nickname }}</text>
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
      <view class="action-btn" @click="goBid">出 价</view>
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
import { helpApi } from '@/api/index.js'

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
      bannerList: [],
      noticeInfo: null,
      activityInfo: null,
      recommendInfo: null,
      tabList: ['竞价中', '已结束', '我出价的', '我发的', '竞标的', '被竞标的'],
      helpList: [],
      filterOptions: [
        {
          title: '当前价',
          key: 'price',
          type: 'input-range',
          minPlaceholder: '最低价',
          maxPlaceholder: '最高价'
        },
        {
          title: '拍卖状态',
          key: 'status',
          items: [
            { label: '竞价中', value: 'ongoing' },
            { label: '已结束', value: 'ended' }
          ]
        },
        {
          title: '剩余时间',
          key: 'remainTime',
          type: 'input-range',
          minPlaceholder: '最少',
          maxPlaceholder: '最多'
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
    this.loadHelpData()
    this.loadHelpList()
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
    handleInfoClick(item) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      } else {
        uni.showToast({ title: item.content, icon: 'none' })
      }
    },
    async loadHelpData() {
      const tabName = this.tabList[this.currentTab]
      const data = await helpApi.getData({ tab: tabName })
      this.bannerList = data.bannerList || []
      this.noticeInfo = data.noticeInfo || null
      this.activityInfo = data.activityInfo || null
      this.recommendInfo = data.recommendInfo || null
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.helpList = []
      this.noMore = false
      this.loadHelpData()
      this.loadHelpList()
    },
    handleFilterConfirm(value) {
      this.filterValue = value
      this.page = 1
      this.helpList = []
      this.noMore = false
      this.loadHelpList()
    },
    async loadHelpList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await helpApi.getList({
        page: this.page,
        pageSize: 10,
        tab: this.tabList[this.currentTab],
        ...this.filterValue
      })

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.helpList = [...this.helpList, ...data.list]
        this.page++
      }
      this.loading = false
    },
    loadMore() {
      this.loadHelpList()
    },
    goHelpDetail(item) {
      uni.navigateTo({ url: '/pages/help/detail?id=' + item.id })
    },
    goBid() {
      uni.navigateTo({ url: '/pages/publish/help' })
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

.info-section {
  margin: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .info-item {
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx;
    position: relative;

    &.notice-item {
      border-bottom: 2rpx solid #007AFF;
    }

    &.activity-item {
      border-bottom: 1rpx solid #F5F5F5;
    }

    &.recommend-item {
      // 最后一项无边框
    }

    .info-tag {
      flex-shrink: 0;
      font-size: 26rpx;
      font-weight: 500;

      &.notice-tag {
        color: #007AFF;
      }

      &.activity-tag {
        color: #333333;
      }

      &.recommend-tag {
        color: #333333;
      }
    }

    .info-divider {
      margin: 0 16rpx;
      color: #CCCCCC;
      font-size: 26rpx;
    }

    .info-text {
      flex: 1;
      font-size: 26rpx;
      color: #666666;
    }
  }
}

.help-list {
  padding: 0 24rpx;
}

.help-card {
  margin-bottom: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;

  .help-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .countdown-box {
      padding: 12rpx 24rpx;
      background-color: #F5F5F5;
      border-radius: 8rpx;

      .countdown {
        font-size: 32rpx;
        color: #333333;
        font-weight: 600;
        font-family: monospace;
      }
    }

    .current-price {
      display: flex;
      align-items: baseline;

      .price-label {
        font-size: 24rpx;
        color: #999999;
        margin-right: 8rpx;
      }

      .price-symbol {
        font-size: 28rpx;
        color: #FF3B30;
      }

      .price-value {
        font-size: 48rpx;
        color: #FF3B30;
        font-weight: 600;
      }
    }
  }

  .help-content {
    font-size: 28rpx;
    color: #333333;
    line-height: 1.6;
    margin-bottom: 16rpx;
  }

  .help-images {
    display: flex;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .help-image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 8rpx;
    }
  }

  .help-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;

    .delivery-time {
      font-size: 24rpx;
      color: #666666;
    }

    .help-location {
      font-size: 24rpx;
      color: #999999;
    }
  }

  .help-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .bid-increment {
      font-size: 24rpx;
      color: #FF9500;
    }

    .help-user {
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
