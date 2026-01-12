<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
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

      <!-- 商品列表 - 瀑布流 -->
      <view class="goods-list">
        <view class="goods-column">
          <view
            v-for="(item, index) in leftList"
            :key="index"
            class="goods-card"
            @click="goIdleDetail(item)"
          >
            <image class="goods-image" :src="item.image || 'https://iph.href.lu/400x400?text=商品图片'" mode="aspectFill"></image>
            <view class="goods-info">
              <text class="goods-title ellipsis-2">{{ item.title }}</text>
              <view class="goods-meta">
                <view class="price-box">
                  <text class="price-symbol">¥</text>
                  <text class="price-value">{{ item.price }}</text>
                  <text class="delivery-type">{{ item.deliveryType }}</text>
                </view>
                <text class="want-count">{{ item.wantCount }}人想要</text>
              </view>
              <text class="goods-location">{{ item.location }}</text>
            </view>
          </view>
        </view>
        <view class="goods-column">
          <view
            v-for="(item, index) in rightList"
            :key="index"
            class="goods-card"
            @click="goIdleDetail(item)"
          >
            <image class="goods-image" :src="item.image || 'https://iph.href.lu/400x400?text=商品图片'" mode="aspectFill"></image>
            <view class="goods-info">
              <text class="goods-title ellipsis-2">{{ item.title }}</text>
              <view class="goods-meta">
                <view class="price-box">
                  <text class="price-symbol">¥</text>
                  <text class="price-value">{{ item.price }}</text>
                  <text class="delivery-type">{{ item.deliveryType }}</text>
                </view>
                <text class="want-count">{{ item.wantCount }}人想要</text>
              </view>
              <text class="goods-location">{{ item.location }}</text>
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

    <!-- 筛选弹窗 -->
    <dm-filter
      :visible.sync="showFilter"
      :options="filterOptions || []"
      :value="filterValue"
      @confirm="handleFilterConfirm"
    />

    <!-- 自定义 TabBar -->
    <dm-tabbar />
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { idleApi } from '@/api/index.js'

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
      showFilter: false,
      bannerList: [],
      noticeInfo: null,
      activityInfo: null,
      recommendInfo: null,
      tabList: ['售卖中', '我发布的', '我买到的', '我卖出的', '聊过的'],
      goodsList: [],
      filterOptions: [
        {
          title: '价格',
          key: 'price',
          type: 'input-range',
          minPlaceholder: '最低价',
          maxPlaceholder: '最高价'
        },
        {
          title: '配送方式',
          key: 'delivery',
          items: [
            { label: '包邮', value: 'free_shipping' },
            { label: '自提', value: 'pickup' }
          ]
        },
        {
          title: '发货时间',
          key: 'shipTime',
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
  computed: {
    leftList() {
      return this.goodsList.filter((_, index) => index % 2 === 0)
    },
    rightList() {
      return this.goodsList.filter((_, index) => index % 2 === 1)
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadIdleData()
    this.loadGoodsList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const searchBarHeight = uni.upx2px(104)
      const tabBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - searchBarHeight - tabBarHeight
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    switchCommunity() {
      uni.navigateTo({ url: '/pages/region/index' })
    },
    handleBannerClick({ item, index }) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      }
    },
    handleInfoClick(item) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      } else {
        uni.showToast({ title: item.content, icon: 'none' })
      }
    },
    async loadIdleData() {
      const tabName = this.tabList[this.currentTab]
      const data = await idleApi.getData({ tab: tabName })
      this.bannerList = data.bannerList || []
      this.noticeInfo = data.noticeInfo || null
      this.activityInfo = data.activityInfo || null
      this.recommendInfo = data.recommendInfo || null
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.goodsList = []
      this.noMore = false
      this.loadIdleData()
      this.loadGoodsList()
    },
    handleFilterConfirm(value) {
      this.filterValue = value
      this.page = 1
      this.goodsList = []
      this.noMore = false
      this.loadGoodsList()
    },
    async loadGoodsList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await idleApi.getList({
        page: this.page,
        pageSize: 10,
        tab: this.tabList[this.currentTab],
        ...this.filterValue
      })

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.goodsList = [...this.goodsList, ...data.list]
        this.page++
      }
      this.loading = false
    },
    loadMore() {
      this.loadGoodsList()
    },
    goIdleDetail(item) {
      uni.navigateTo({ url: '/pages/idle/detail?id=' + item.id })
    },
    goPublish() {
      uni.navigateTo({ url: '/pages/publish/idle' })
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

.scroll-container {
  background-color: #F8F8F8;
  transition: background-color 0.3s ease;

  .page-container.dark-mode & {
    background-color: #1a1a1a;
  }
}

.info-section {
  margin: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  transition: background-color 0.3s ease;

  .page-container.dark-mode & {
    background-color: #2a2a2a;
  }

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
      transition: border-color 0.3s ease;

      .page-container.dark-mode & {
        border-bottom-color: #444444;
      }
    }

    &.recommend-item {
      // 最后一项无边框
    }

    .info-tag {
      flex-shrink: 0;
      font-size: 26rpx;
      font-weight: 500;

      &.notice-tag {
        color: #FF9500;
        background-color: #FFF3E0;
        padding: 4rpx 12rpx;
        border-radius: 0;
      }

      &.activity-tag {
        color: #333333;
        background-color: #E8F4F8;
        padding: 4rpx 12rpx;
        border-radius: 0;
        transition: background-color 0.3s ease, color 0.3s ease;

        .page-container.dark-mode & {
          color: #e0e0e0;
          background-color: rgba(232, 244, 248, 0.2);
        }
      }

      &.recommend-tag {
        color: #333333;
        background-color: #E8F8E8;
        padding: 4rpx 12rpx;
        border-radius: 0;
        transition: background-color 0.3s ease, color 0.3s ease;

        .page-container.dark-mode & {
          color: #e0e0e0;
          background-color: rgba(232, 248, 232, 0.2);
        }
      }
    }

    .info-divider {
      margin: 0 16rpx;
      color: #CCCCCC;
      font-size: 26rpx;
      transition: color 0.3s ease;

      .page-container.dark-mode & {
        color: #666666;
      }
    }

    .info-text {
      flex: 1;
      font-size: 26rpx;
      color: #666666;
      transition: color 0.3s ease;

      .page-container.dark-mode & {
        color: #b0b0b0;
      }
    }
  }
}

.goods-list {
  display: flex;
  padding: 0 24rpx;
  gap: 16rpx;

  .goods-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .goods-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    overflow: hidden;
    transition: background-color 0.3s ease;

    .page-container.dark-mode & {
      background-color: #2a2a2a;
    }

    .goods-image {
      width: 100%;
      height: 300rpx;
    }

    .goods-info {
      padding: 16rpx;
      display: flex;
      flex-direction: column;

      .goods-title {
        font-size: 26rpx;
        color: #333333;
        line-height: 1.4;
        margin-bottom: 12rpx;
        transition: color 0.3s ease;

        .page-container.dark-mode & {
          color: #e0e0e0;
        }
      }

      .goods-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8rpx;

        .price-box {
          display: flex;
          align-items: baseline;

          .price-symbol {
            font-size: 22rpx;
            color: #FF3B30;
          }

          .price-value {
            font-size: 36rpx;
            color: #FF3B30;
            font-weight: 600;
            margin-right: 8rpx;
          }

          .delivery-type {
            font-size: 20rpx;
            color: #999999;
            padding: 2rpx 8rpx;
            background-color: #F5F5F5;
            border-radius: 4rpx;
            transition: background-color 0.3s ease, color 0.3s ease;

            .page-container.dark-mode & {
              background-color: #3a3a3a;
              color: #808080;
            }
          }
        }

        .want-count {
          font-size: 22rpx;
          color: #999999;
          transition: color 0.3s ease;

          .page-container.dark-mode & {
            color: #808080;
          }
        }
      }

      .goods-location {
        font-size: 22rpx;
        color: #999999;
        align-self: flex-end;
        transition: color 0.3s ease;

        .page-container.dark-mode & {
          color: #808080;
        }
      }
    }
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
  transition: color 0.3s ease;

  .page-container.dark-mode & {
    color: #808080;
  }
}
</style>
