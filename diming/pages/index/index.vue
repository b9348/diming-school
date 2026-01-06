<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 搜索栏 -->
    <dm-search
      placeholder="请输入搜索关键词"
      :disabled="true"
      :show-switch="true"
      @click="goSearch"
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

      <!-- 导航分类 -->
      <dm-nav :list="navList" @click="handleNavClick" @more="goNavMore" />

      <!-- 今日热榜 -->
      <view class="hot-section">
        <view class="hot-header">
          <text class="hot-title">今日热榜</text>
          <text class="hot-desc">间隔n秒上下滚动显示20条最热的帖子</text>
        </view>
        <swiper class="hot-swiper" vertical :autoplay="true" :interval="3000" circular>
          <swiper-item v-for="(item, index) in hotList" :key="index" @click="goHotDetail(item)">
            <view class="hot-item">
              <text class="hot-rank">{{ index + 1 }}</text>
              <text class="hot-text ellipsis">{{ item.title }}</text>
            </view>
          </swiper-item>
        </swiper>
      </view>

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

      <!-- 内容分类Tabs -->
      <dm-tabs :list="tabList" :current="currentTab" @change="handleTabChange" />

      <!-- 帖子列表 -->
      <view class="post-list">
        <dm-card
          v-for="(item, index) in postList"
          :key="index"
          :data="item"
          @click="goPostDetail(item)"
        />
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
import { homeApi, postApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      currentTab: 0,
      loading: false,
      noMore: false,
      page: 1,
      bannerList: [],
      navList: [],
      hotList: [],
      noticeInfo: null,
      activityInfo: null,
      recommendInfo: null,
      tabList: [],
      postList: []
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadHomeData()
    this.loadPostList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const searchBarHeight = uni.upx2px(104)
      const tabBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - searchBarHeight - tabBarHeight
    },
    async loadHomeData() {
      const data = await homeApi.getData()
      this.bannerList = data.bannerList || []
      this.navList = data.navList || []
      this.hotList = data.hotList || []
      this.noticeInfo = data.noticeInfo || null
      this.activityInfo = data.activityInfo || null
      this.recommendInfo = data.recommendInfo || null
      this.tabList = data.tabList || ['最新']

      // 初始化全局tab状态
      getApp().globalData = getApp().globalData || {}
      getApp().globalData.currentIndexTab = this.tabList[this.currentTab]
    },
    async loadPostList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await postApi.getList({
        page: this.page,
        pageSize: 10,
        tab: this.tabList[this.currentTab]
      })

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.postList = [...this.postList, ...data.list]
        this.page++
      }
      this.loading = false
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
    handleNavClick({ item, index }) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      } else {
        uni.showToast({ title: item.name, icon: 'none' })
      }
    },
    goNavMore() {
      uni.showToast({ title: '更多分类', icon: 'none' })
    },
    handleInfoClick(item) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      } else {
        uni.showToast({ title: item.content, icon: 'none' })
      }
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.postList = []
      this.noMore = false
      this.loadPostList()

      const tabName = this.tabList[index]
      getApp().globalData = getApp().globalData || {}
      getApp().globalData.currentIndexTab = tabName
    },
    loadMore() {
      this.loadPostList()
    },
    goHotDetail(item) {
      uni.navigateTo({ url: '/pages/post/detail?id=' + item.id })
    },
    goPostDetail(item) {
      const currentTabName = this.tabList[this.currentTab]
      const detailPageMap = {
        '投票': '/pages/vote/detail',
        '恋爱': '/pages/love/detail'
      }
      const detailUrl = detailPageMap[currentTabName] || '/pages/post/detail'
      uni.navigateTo({ url: detailUrl + '?id=' + item.id })
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

.hot-section {
  margin: 20rpx 24rpx;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .hot-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .hot-title {
      font-size: 30rpx;
      color: #333333;
      font-weight: 600;
      margin-right: 16rpx;
    }

    .hot-desc {
      font-size: 22rpx;
      color: #999999;
    }
  }

  .hot-swiper {
    height: 60rpx;

    .hot-item {
      display: flex;
      align-items: center;
      height: 60rpx;

      .hot-rank {
        width: 40rpx;
        font-size: 28rpx;
        color: #FF9500;
        font-weight: 600;
      }

      .hot-text {
        flex: 1;
        font-size: 26rpx;
        color: #333333;
      }
    }
  }
}

.info-section {
  margin: 0 24rpx 20rpx;
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

.post-list {
  padding-bottom: 20rpx;
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}
</style>
