<template>
  <view class="page-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingRight: navRightPadding + 'px' }">
      <view class="back-btn" @click="goBack">
        <text class="tn-icon-left" style="font-size: 20px; color: #333333;"></text>
      </view>
      <text class="nav-title">切换校区</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar" :style="{ paddingRight: navRightPadding + 'px' }">
      <view class="search-box">
        <text class="tn-icon-search" style="font-size: 16px; color: #999999;"></text>
        <input
          v-model="keyword"
          type="text"
          placeholder="请输入学校搜索"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 地区按钮列表 -->
    <view class="region-list">
      <view
        v-for="item in filteredRegions"
        :key="item.id"
        class="region-item"
        :class="{ active: currentRegion === item.id, fixed: item.is_fixed }"
        @click="selectRegion(item)"
      >
        <text>{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { regionApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      navRightPadding: 24,
      keyword: '',
      regions: [],
      currentRegion: null
    }
  },
  computed: {
    filteredRegions() {
      if (!this.keyword) return this.regions
      return this.regions.filter(item =>
        item.name.includes(this.keyword)
      )
    }
  },
  onLoad() {
    const systemInfo = uni.getWindowInfo()
    this.statusBarHeight = systemInfo.statusBarHeight
    // #ifdef MP-WEIXIN
    const menuButton = uni.getMenuButtonBoundingClientRect()
    this.navRightPadding = systemInfo.windowWidth - menuButton.left + 10
    // #endif
    this.currentRegion = uni.getStorageSync('currentRegionId') || 0
    this.loadRegions()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    async loadRegions() {
      try {
        const data = await regionApi.getList()
        this.regions = data || []
      } catch (e) {
        console.error('加载地区列表失败', e)
      }
    },
    handleSearch() {
      // 搜索由 computed 自动处理
    },
    selectRegion(item) {
      this.currentRegion = item.id
      uni.setStorageSync('currentRegionId', item.id)
      uni.setStorageSync('currentRegionName', item.name)
      uni.setStorageSync('currentRegionType', item.type)

      // 返回上一页并刷新
      const pages = getCurrentPages()
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2]
        if (prevPage.$vm && prevPage.$vm.onRegionChange) {
          prevPage.$vm.onRegionChange(item)
        }
      }
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #FFFFFF;
}

.status-bar {
  background-color: #FFFFFF;
}

.nav-bar {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #FFFFFF;

  .back-btn {
    padding: 10rpx;
    margin-right: 16rpx;
  }

  .nav-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
  }
}

.search-bar {
  padding: 16rpx 24rpx;

  .search-box {
    display: flex;
    align-items: center;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #F5F5F5;
    border-radius: 36rpx;
    border: 1rpx solid #E5E5E5;

    input {
      flex: 1;
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #333333;
    }
  }
}

.region-list {
  padding: 20rpx 24rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .region-item {
    padding: 16rpx 32rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333333;

    &.active {
      border-color: #007AFF;
      color: #007AFF;
      background-color: rgba(0, 122, 255, 0.05);
    }

    &.fixed {
      color: #007AFF;
    }
  }
}
</style>
