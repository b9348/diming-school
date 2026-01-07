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

      <!-- 分类标签 -->
      <view class="category-tabs">
        <scroll-view scroll-x class="category-scroll">
          <view class="category-wrapper">
            <view
              v-for="(item, index) in categoryList"
              :key="index"
              class="category-item"
              :class="{ active: currentCategory === index }"
              @click="handleCategoryChange(index)"
            >
              {{ item }}
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Tabs -->
      <dm-tabs :list="tabList" :current="currentTab" @change="handleTabChange" />

      <!-- 投票列表 -->
      <view class="vote-list">
        <view
          v-for="(item, index) in voteList"
          :key="index"
          class="vote-card"
          @click="goVoteDetail(item)"
        >
          <!-- 文字投票 -->
          <template v-if="item.type === 'text'">
            <text class="vote-title ellipsis-2">{{ item.title }}</text>
            <view class="vote-options">
              <view
                v-for="(opt, optIdx) in item.options"
                :key="optIdx"
                class="vote-option"
              >
                <view class="option-content">
                  <text class="option-text">{{ opt.text }}</text>
                  <text class="option-count">{{ opt.count }}</text>
                </view>
                <view class="option-progress" :style="{ width: opt.percent + '%' }"></view>
              </view>
            </view>
          </template>

          <!-- 图片投票 -->
          <template v-else>
            <text class="vote-title ellipsis-2">{{ item.title }}</text>
            <view class="vote-images">
              <view
                v-for="(opt, optIdx) in item.options.slice(0, 2)"
                :key="optIdx"
                class="vote-image-item"
              >
                <image class="vote-image" :src="opt.image" mode="aspectFill"></image>
                <text class="image-count">{{ opt.count }}</text>
                <view class="image-progress" :style="{ width: opt.percent + '%' }"></view>
                <text class="image-desc ellipsis">{{ opt.text }}</text>
              </view>
            </view>
          </template>

          <view class="vote-footer">
            <view class="vote-info">
              <text class="vote-deadline">{{ item.deadline }}</text>
              <text class="vote-count">{{ item.totalVotes }}人参与</text>
            </view>
            <view class="vote-user">
              <image class="user-avatar" :src="item.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
              <text class="user-name">{{ item.nickname }}</text>
              <text class="vote-time">{{ item.time }}</text>
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

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goPublish">
      <uni-icons type="plusempty" size="28" color="#FFFFFF"></uni-icons>
    </view>
  </view>
</template>

<script>
import { voteApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      currentCategory: 0,
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
      categoryList: ['最新', '投票', '热门', '推荐'],
      tabList: ['投票', '我参与的', '我发布的', '未开始', '已结束'],
      voteList: [],
      filterOptions: [
        {
          title: '投票类型',
          key: 'type',
          items: [
            { label: '全部', value: '' },
            { label: '文字投票', value: 'text' },
            { label: '图片投票', value: 'image' }
          ]
        }
      ],
      filterValue: {}
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadVoteList()
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
    handleBannerClick({ item }) {
      if (item.url) {
        uni.navigateTo({ url: item.url })
      }
    },
    handleNoticeClick({ item }) {
      uni.showToast({ title: item.content, icon: 'none' })
    },
    handleCategoryChange(index) {
      this.currentCategory = index
      this.page = 1
      this.voteList = []
      this.noMore = false
      this.loadVoteList()
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.voteList = []
      this.noMore = false
      this.loadVoteList()
    },
    handleFilterConfirm(value) {
      this.filterValue = value
      this.page = 1
      this.voteList = []
      this.noMore = false
      this.loadVoteList()
    },
    async loadVoteList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await voteApi.getList({
        page: this.page,
        pageSize: 10,
        category: this.categoryList[this.currentCategory],
        tab: this.tabList[this.currentTab],
        ...this.filterValue
      })

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.voteList = [...this.voteList, ...data.list]
        this.page++
      }
      this.loading = false
    },
    loadMore() {
      this.loadVoteList()
    },
    goVoteDetail(item) {
      uni.navigateTo({ url: '/pages/vote/detail?id=' + item.id })
    },
    goPublish() {
      uni.navigateTo({ url: '/pages/publish/vote' })
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

.category-tabs {
  background-color: #FFFFFF;
  padding: 16rpx 0;

  .category-scroll {
    white-space: nowrap;

    .category-wrapper {
      display: inline-flex;
      padding: 0 24rpx;

      .category-item {
        padding: 12rpx 24rpx;
        margin-right: 16rpx;
        font-size: 26rpx;
        color: #666666;
        background-color: #F5F5F5;
        border-radius: 24rpx;

        &.active {
          color: #007AFF;
          background-color: rgba(0, 122, 255, 0.1);
        }
      }
    }
  }
}

.vote-list {
  padding: 0 24rpx;
}

.vote-card {
  margin-bottom: 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;

  .vote-title {
    font-size: 28rpx;
    color: #333333;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }

  .vote-options {
    .vote-option {
      position: relative;
      padding: 20rpx;
      margin-bottom: 12rpx;
      background-color: #F5F5F5;
      border-radius: 8rpx;
      overflow: hidden;

      .option-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .option-text { font-size: 28rpx; color: #333333; }
        .option-count { font-size: 28rpx; color: #007AFF; font-weight: 500; }
      }

      .option-progress {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        background-color: rgba(0, 122, 255, 0.15);
        border-radius: 8rpx;
      }
    }
  }

  .vote-images {
    display: flex;
    gap: 16rpx;

    .vote-image-item {
      flex: 1;
      position: relative;

      .vote-image { width: 100%; height: 240rpx; border-radius: 8rpx; }
      .image-count { position: absolute; right: 12rpx; bottom: 60rpx; font-size: 32rpx; color: #FFFFFF; font-weight: 600; text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3); }
      .image-progress { height: 8rpx; background-color: #007AFF; border-radius: 4rpx; margin: 8rpx 0; }
      .image-desc { font-size: 24rpx; color: #666666; }
    }
  }

  .vote-footer {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #F5F5F5;

    .vote-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;

      .vote-deadline { font-size: 24rpx; color: #FF9500; }
      .vote-count { font-size: 24rpx; color: #999999; }
    }

    .vote-user {
      display: flex;
      align-items: center;

      .user-avatar { width: 40rpx; height: 40rpx; border-radius: 50%; margin-right: 8rpx; }
      .user-name { font-size: 24rpx; color: #666666; margin-right: 16rpx; }
      .vote-time { font-size: 22rpx; color: #999999; }
    }
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}

.publish-btn {
  position: fixed;
  right: 40rpx;
  bottom: 100rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #007AFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.4);
  z-index: 100;
}
</style>
