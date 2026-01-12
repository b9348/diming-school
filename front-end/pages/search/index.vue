<template>
  <view class="search-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 搜索栏 -->
    <view class="search-header" :style="{ paddingRight: rightSafeArea + 'px' }">
      <view class="search-back" @click="goBack">
        <text class="iconfont icon-back">←</text>
      </view>
      <view class="search-input-wrapper">
        <input
          class="search-input"
          v-model="keyword"
          placeholder="请输入搜索关键词"
          confirm-type="search"
          @confirm="handleSearch"
          @input="handleInput"
          focus
        />
        <text v-if="keyword" class="clear-btn" @click="clearKeyword">×</text>
      </view>
      <text class="search-btn" @click="handleSearch">搜索</text>
    </view>

    <!-- 排序标签 -->
    <view class="sort-tabs">
      <view
        v-for="(item, index) in sortList"
        :key="index"
        class="sort-item"
        :class="{ active: currentSort === item.value }"
        @click="handleSortChange(item.value)"
      >
        <text>{{ item.label }}</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view
          v-for="(item, index) in categoryList"
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === item.value }"
          @click="handleCategoryChange(item.value)"
        >
          <text>{{ item.label }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 搜索结果列表 -->
    <scroll-view
      class="result-scroll"
      scroll-y
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view v-if="!hasSearched" class="empty-tip">
        <text>请输入关键词进行搜索</text>
      </view>

      <view v-else-if="resultList.length === 0 && !loading" class="empty-result">
        <text>暂无搜索结果</text>
      </view>

      <view v-else class="result-list">
        <dm-card
          v-for="(item, index) in resultList"
          :key="index"
          :data="item"
          @click="goDetail(item)"
        />
      </view>

      <!-- 加载更多 -->
      <view v-if="hasSearched && resultList.length > 0" class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { searchApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      rightSafeArea: 12,
      keyword: '',
      currentSort: 'comprehensive',
      currentCategory: 'all',
      hasSearched: false,
      loading: false,
      noMore: false,
      page: 1,
      resultList: [],
      sortList: [
        { label: '综合', value: 'comprehensive' },
        { label: '最新', value: 'latest' },
        { label: '最热', value: 'hot' }
      ],
      categoryList: [
        { label: '全部', value: 'all' },
        { label: '闲置', value: 'idle' },
        { label: '表白墙', value: 'post' },
        { label: '跑腿', value: 'errand' },
        { label: '投票', value: 'vote' },
        { label: '恋爱', value: 'love' },
        { label: '互助', value: 'help' }
      ]
    }
  },
  onLoad(options) {
    this.getSystemInfo()
    this.calcRightSafeArea()
    if (options.keyword) {
      this.keyword = options.keyword
      this.handleSearch()
    }
  },
  methods: {
    calcRightSafeArea() {
      // #ifdef MP-WEIXIN
      // 获取胶囊按钮位置信息
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const systemInfo = uni.getWindowInfo()
      // 右侧安全距离 = 屏幕宽度 - 胶囊按钮左边界 + 间距
      this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left + 10
      // #endif
    },
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const headerHeight = uni.upx2px(88)
      const sortHeight = uni.upx2px(88)
      const categoryHeight = uni.upx2px(88)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - headerHeight - sortHeight - categoryHeight
    },
    goBack() {
      uni.navigateBack()
    },
    clearKeyword() {
      this.keyword = ''
      this.resultList = []
      this.hasSearched = false
    },
    handleInput(e) {
      this.keyword = e.detail.value
    },
    handleSearch() {
      if (!this.keyword.trim()) {
        uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
        return
      }
      this.page = 1
      this.resultList = []
      this.noMore = false
      this.hasSearched = true
      this.loadSearchResults()
    },
    handleSortChange(value) {
      if (this.currentSort === value) return
      this.currentSort = value
      if (this.hasSearched) {
        this.page = 1
        this.resultList = []
        this.noMore = false
        this.loadSearchResults()
      }
    },
    handleCategoryChange(value) {
      if (this.currentCategory === value) return
      this.currentCategory = value
      if (this.hasSearched) {
        this.page = 1
        this.resultList = []
        this.noMore = false
        this.loadSearchResults()
      }
    },
    async loadSearchResults() {
      if (this.loading || this.noMore) return
      this.loading = true

      try {
        const data = await searchApi.search({
          keyword: this.keyword,
          sort: this.currentSort,
          category: this.currentCategory,
          page: this.page,
          pageSize: 10
        })

        if (data.list.length === 0) {
          this.noMore = true
        } else {
          this.resultList = [...this.resultList, ...data.list]
          this.page++
        }
      } catch (error) {
        uni.showToast({ title: '搜索失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      if (this.hasSearched) {
        this.loadSearchResults()
      }
    },
    goDetail(item) {
      const detailPageMap = {
        idle: '/pages/idle/detail',
        post: '/pages/post/detail',
        errand: '/pages/errand/detail',
        vote: '/pages/vote/detail',
        love: '/pages/love/detail',
        help: '/pages/help/detail'
      }
      const detailUrl = detailPageMap[item.type] || '/pages/post/detail'
      uni.navigateTo({ url: detailUrl + '?id=' + item.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.status-bar {
  background-color: #FFFFFF;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;

  .search-back {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;

    .icon-back {
      font-size: 40rpx;
      color: #333333;
    }
  }

  .search-input-wrapper {
    flex: 1;
    position: relative;
    height: 56rpx;
    background-color: #F5F5F5;
    border-radius: 28rpx;
    display: flex;
    align-items: center;
    padding: 0 32rpx;

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333333;
    }

    .clear-btn {
      width: 32rpx;
      height: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      color: #999999;
      margin-left: 16rpx;
    }
  }

  .search-btn {
    margin-left: 16rpx;
    font-size: 28rpx;
    color: #007AFF;
  }
}

.sort-tabs {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #F0F0F0;

  .sort-item {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #666666;
    position: relative;

    &.active {
      color: #007AFF;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #007AFF;
        border-radius: 2rpx;
      }
    }
  }
}

.category-scroll {
  background-color: #FFFFFF;
  white-space: nowrap;
  border-bottom: 1rpx solid #F0F0F0;

  .category-list {
    display: inline-flex;
    padding: 20rpx 24rpx;

    .category-item {
      padding: 12rpx 24rpx;
      margin-right: 16rpx;
      background-color: #F5F5F5;
      border-radius: 32rpx;
      font-size: 26rpx;
      color: #666666;

      &.active {
        background-color: #007AFF;
        color: #FFFFFF;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.result-scroll {
  .empty-tip,
  .empty-result {
    padding: 200rpx 0;
    text-align: center;
    font-size: 28rpx;
    color: #999999;
  }

  .result-list {
    padding-bottom: 20rpx;
  }

  .load-more {
    padding: 30rpx;
    text-align: center;
    font-size: 26rpx;
    color: #999999;
  }
}
</style>
