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
      :options="filterOptions"
      :value="filterValue"
      @confirm="handleFilterConfirm"
    />

    <!-- 自定义 TabBar -->
    <dm-tabbar />
  </view>
</template>

<script>
import { idleApi } from '@/api/index.js'

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
      tabList: ['售卖中', '我发布的', '我买到的', '我卖出的', '聊过的'],
      goodsList: [],
      filterOptions: [
        {
          title: '商品分类',
          key: 'category',
          items: [
            { label: '全部', value: '' },
            { label: '教材书籍', value: 'book' },
            { label: '数码产品', value: 'digital' },
            { label: '生活用品', value: 'daily' },
            { label: '服饰鞋包', value: 'clothes' },
            { label: '其他', value: 'other' }
          ]
        },
        {
          title: '价格范围',
          key: 'price',
          items: [
            { label: '全部', value: '' },
            { label: '0-50元', value: '0-50' },
            { label: '50-100元', value: '50-100' },
            { label: '100-500元', value: '100-500' },
            { label: '500元以上', value: '500+' }
          ]
        },
        {
          title: '交易方式',
          key: 'delivery',
          items: [
            { label: '全部', value: '' },
            { label: '自提', value: 'pickup' },
            { label: '快递', value: 'express' }
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
    this.loadGoodsList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const searchBarHeight = uni.upx2px(104)
      const tabBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - searchBarHeight - tabBarHeight
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
      this.goodsList = []
      this.noMore = false
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
}

.status-bar {
  background-color: #FFFFFF;
}

.scroll-container {
  background-color: #F8F8F8;
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

    .goods-image {
      width: 100%;
      height: 300rpx;
    }

    .goods-info {
      padding: 16rpx;

      .goods-title {
        font-size: 26rpx;
        color: #333333;
        line-height: 1.4;
        margin-bottom: 12rpx;
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
          }
        }

        .want-count {
          font-size: 22rpx;
          color: #999999;
        }
      }

      .goods-location {
        font-size: 22rpx;
        color: #999999;
      }
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
