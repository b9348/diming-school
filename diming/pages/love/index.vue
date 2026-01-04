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

      <!-- 用户列表 - 双列 -->
      <view class="user-list">
        <view class="user-column">
          <view
            v-for="(item, index) in leftList"
            :key="index"
            class="user-card"
            @click="goLoveDetail(item)"
          >
            <view class="user-photo-box">
              <image class="user-photo" :src="item.photo || 'https://iph.href.lu/400x400?text=用户照片'" mode="aspectFill"></image>
              <view class="like-btn" @click.stop="handleLike(item)">
                <image class="like-icon" src="https://iph.href.lu/50x50?text=❤" mode="aspectFit"></image>
                <text class="like-count">{{ item.likeCount }}</text>
              </view>
            </view>
            <view class="user-info">
              <view class="info-row">
                <text class="user-birth">{{ item.birth }}</text>
                <text class="user-height">{{ item.height }}</text>
                <text class="user-gender">{{ item.gender }}</text>
              </view>
              <view class="info-row">
                <text class="user-education">{{ item.education }}</text>
                <text class="user-status">{{ item.status }}</text>
                <text class="user-location">{{ item.location }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="user-column">
          <view
            v-for="(item, index) in rightList"
            :key="index"
            class="user-card"
            @click="goLoveDetail(item)"
          >
            <view class="user-photo-box">
              <image class="user-photo" :src="item.photo || 'https://iph.href.lu/400x400?text=用户照片'" mode="aspectFill"></image>
              <view class="like-btn" @click.stop="handleLike(item)">
                <image class="like-icon" src="https://iph.href.lu/50x50?text=❤" mode="aspectFit"></image>
                <text class="like-count">{{ item.likeCount }}</text>
              </view>
            </view>
            <view class="user-info">
              <view class="info-row">
                <text class="user-birth">{{ item.birth }}</text>
                <text class="user-height">{{ item.height }}</text>
                <text class="user-gender">{{ item.gender }}</text>
              </view>
              <view class="info-row">
                <text class="user-education">{{ item.education }}</text>
                <text class="user-status">{{ item.status }}</text>
                <text class="user-location">{{ item.location }}</text>
              </view>
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
import { loveApi } from '@/api/index.js'

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
      categoryList: ['最新', '恋爱', '热门', '推荐'],
      tabList: ['寻觅中', '我心动的', '喜欢我的', '我发布的', '聊过的'],
      userList: [],
      filterOptions: [
        {
          title: '性别',
          key: 'gender',
          items: [
            { label: '全部', value: '' },
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]
        },
        {
          title: '年龄',
          key: 'age',
          items: [
            { label: '全部', value: '' },
            { label: '18-22岁', value: '18-22' },
            { label: '22-25岁', value: '22-25' },
            { label: '25岁以上', value: '25+' }
          ]
        },
        {
          title: '身高',
          key: 'height',
          items: [
            { label: '全部', value: '' },
            { label: '160cm以下', value: '-160' },
            { label: '160-170cm', value: '160-170' },
            { label: '170-180cm', value: '170-180' },
            { label: '180cm以上', value: '180+' }
          ]
        },
        {
          title: '学历',
          key: 'education',
          items: [
            { label: '全部', value: '' },
            { label: '本科', value: 'bachelor' },
            { label: '硕士', value: 'master' },
            { label: '博士', value: 'doctor' }
          ]
        }
      ],
      filterValue: {}
    }
  },
  computed: {
    leftList() {
      return this.userList.filter((_, index) => index % 2 === 0)
    },
    rightList() {
      return this.userList.filter((_, index) => index % 2 === 1)
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadUserList()
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
    handleCategoryChange(index) {
      this.currentCategory = index
      this.page = 1
      this.userList = []
      this.noMore = false
      this.loadUserList()
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.userList = []
      this.noMore = false
      this.loadUserList()
    },
    handleFilterConfirm(value) {
      this.filterValue = value
      this.page = 1
      this.userList = []
      this.noMore = false
      this.loadUserList()
    },
    async handleLike(item) {
      await loveApi.like(item.id)
      item.likeCount++
      uni.showToast({ title: '已心动', icon: 'none' })
    },
    async loadUserList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const data = await loveApi.getList({
        page: this.page,
        pageSize: 10,
        category: this.categoryList[this.currentCategory],
        tab: this.tabList[this.currentTab],
        ...this.filterValue
      })

      if (data.list.length === 0) {
        this.noMore = true
      } else {
        this.userList = [...this.userList, ...data.list]
        this.page++
      }
      this.loading = false
    },
    loadMore() {
      this.loadUserList()
    },
    goLoveDetail(item) {
      uni.navigateTo({ url: '/pages/love/detail?id=' + item.id })
    },
    goPublish() {
      uni.navigateTo({ url: '/pages/publish/love' })
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
          color: #FF6B81;
          background-color: rgba(255, 107, 129, 0.1);
        }
      }
    }
  }
}

.user-list {
  display: flex;
  padding: 0 24rpx;
  gap: 16rpx;

  .user-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .user-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    overflow: hidden;

    .user-photo-box {
      position: relative;

      .user-photo {
        width: 100%;
        height: 360rpx;
      }

      .like-btn {
        position: absolute;
        right: 12rpx;
        bottom: 12rpx;
        display: flex;
        align-items: center;
        padding: 8rpx 16rpx;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 24rpx;

        .like-icon {
          width: 28rpx;
          height: 28rpx;
          margin-right: 6rpx;
        }

        .like-count {
          font-size: 24rpx;
          color: #FF6B81;
        }
      }
    }

    .user-info {
      padding: 16rpx;

      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;

        &:last-child {
          margin-bottom: 0;
        }

        text {
          font-size: 22rpx;
          color: #666666;
          margin-right: 16rpx;

          &:last-child {
            margin-right: 0;
          }
        }

        .user-gender {
          color: #FF6B81;
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
}

.publish-btn {
  position: fixed;
  right: 40rpx;
  bottom: 100rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #FF6B81;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(255, 107, 129, 0.4);
  z-index: 100;
}
</style>
