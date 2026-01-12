<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">我的收藏</text>
        <view class="nav-right" @click="toggleEdit">
          <text>{{ isEdit ? '完成' : '编辑' }}</text>
        </view>
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-tabs">
        <view
          class="tab-item"
          :class="{ active: currentCategory === item.key }"
          v-for="item in categoryList"
          :key="item.key"
          @click="switchCategory(item.key)"
        >
          {{ item.name }}
          <text class="tab-count" v-if="item.count">({{ item.count }})</text>
        </view>
      </view>
    </scroll-view>

    <!-- 收藏列表 -->
    <scroll-view
      class="list-scroll"
      scroll-y
      :style="{ height: listHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="collect-item" v-for="(item, index) in collectList" :key="index" @click="goDetail(item)">
        <view class="select-box" v-if="isEdit" @click.stop="toggleSelect(item)">
          <view class="checkbox" :class="{ checked: selectedIds.includes(item.id) }">
            <text v-if="selectedIds.includes(item.id)" class="tn-icon-success" style="font-size: 14px; color: #FFFFFF;"></text>
          </view>
        </view>
        <image class="item-image" :src="item.cover || (item.images && item.images[0]) || 'https://iph.href.lu/120x120?text=图'" mode="aspectFill"></image>
        <view class="item-content">
          <text class="item-title ellipsis-2">{{ item.title || item.content }}</text>
          <view class="item-meta">
            <text class="meta-type">{{ getTypeName(item.type) }}</text>
            <text class="meta-time">{{ item.collectTime || item.time }}</text>
          </view>
        </view>
      </view>

      <view class="empty-tip" v-if="collectList.length === 0 && !loading">
        <text class="tn-icon-star" style="font-size: 48px; color: #CCCCCC;"></text>
        <text>暂无收藏</text>
      </view>

      <view class="load-more" v-if="collectList.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="isEdit">
      <view class="select-all" @click="toggleSelectAll">
        <view class="checkbox" :class="{ checked: isAllSelected }">
          <text v-if="isAllSelected" class="tn-icon-success" style="font-size: 14px; color: #FFFFFF;"></text>
        </view>
        <text>全选</text>
      </view>
      <view class="delete-btn" :class="{ disabled: selectedIds.length === 0 }" @click="deleteSelected">
        删除 {{ selectedIds.length > 0 ? `(${selectedIds.length})` : '' }}
      </view>
    </view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { userApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      listHeight: 0,
      currentCategory: 'all',
      categoryList: [
        { key: 'all', name: '全部', count: 0 },
        { key: 'post', name: '帖子', count: 0 },
        { key: 'vote', name: '投票', count: 0 },
        { key: 'errand', name: '跑腿', count: 0 },
        { key: 'idle', name: '闲置', count: 0 },
        { key: 'help', name: '互助', count: 0 },
        { key: 'love', name: '交友', count: 0 }
      ],
      collectList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      isEdit: false,
      selectedIds: []
    }
  },
  computed: {
    isAllSelected() {
      return this.collectList.length > 0 && this.selectedIds.length === this.collectList.length
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadCollectList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      const tabHeight = uni.upx2px(100)
      const bottomBarHeight = this.isEdit ? uni.upx2px(100) : 0
      this.listHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - tabHeight - bottomBarHeight
    },
    goBack() {
      uni.navigateBack()
    },
    toggleEdit() {
      this.isEdit = !this.isEdit
      this.selectedIds = []
      this.getSystemInfo()
    },
    switchCategory(key) {
      this.currentCategory = key
      this.page = 1
      this.collectList = []
      this.noMore = false
      this.selectedIds = []
      this.loadCollectList()
    },
    async loadCollectList() {
      if (this.loading || this.noMore) return
      this.loading = true

      try {
        const res = await userApi.getCollects({
          page: this.page,
          pageSize: this.pageSize,
          type: this.currentCategory === 'all' ? '' : this.currentCategory
        })
        const list = res.list || []
        if (list.length < this.pageSize) {
          this.noMore = true
        }
        this.collectList = [...this.collectList, ...list]
        this.page++

        // 更新分类数量
        if (res.counts) {
          this.categoryList.forEach(cat => {
            cat.count = res.counts[cat.key] || 0
          })
        }
      } catch (e) {
        console.error('加载收藏失败', e)
      }
      this.loading = false
    },
    loadMore() {
      this.loadCollectList()
    },
    getTypeName(type) {
      const typeMap = {
        post: '帖子',
        vote: '投票',
        errand: '跑腿',
        idle: '闲置',
        help: '互助',
        love: '交友'
      }
      return typeMap[type] || '帖子'
    },
    goDetail(item) {
      if (this.isEdit) return
      const detailPageMap = {
        post: '/pages/post/detail',
        vote: '/pages/vote/detail',
        errand: '/pages/errand/detail',
        idle: '/pages/idle/detail',
        help: '/pages/help/detail',
        love: '/pages/love/detail'
      }
      const url = detailPageMap[item.type] || '/pages/post/detail'
      uni.navigateTo({ url: `${url}?id=${item.id}` })
    },
    toggleSelect(item) {
      const index = this.selectedIds.indexOf(item.id)
      if (index > -1) {
        this.selectedIds.splice(index, 1)
      } else {
        this.selectedIds.push(item.id)
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedIds = []
      } else {
        this.selectedIds = this.collectList.map(item => item.id)
      }
    },
    deleteSelected() {
      if (this.selectedIds.length === 0) return
      uni.showModal({
        title: '取消收藏',
        content: `确定取消收藏选中的 ${this.selectedIds.length} 项吗？`,
        confirmText: '确定',
        confirmColor: '#FF3B30',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.cancelCollects(this.selectedIds)
              uni.showToast({ title: '取消成功', icon: 'success' })
              this.collectList = this.collectList.filter(item => !this.selectedIds.includes(item.id))
              this.selectedIds = []
            } catch (e) {
              uni.showToast({ title: '操作失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.nav-bar {
  background-color: #FFFFFF;
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 24rpx;
    .nav-back { padding: 10rpx; }
    .nav-title { font-size: 34rpx; color: #333333; font-weight: 600; }
    .nav-right {
      font-size: 28rpx;
      color: #007AFF;
      padding: 10rpx;
    }
  }
}

.category-scroll {
  background-color: #FFFFFF;
  white-space: nowrap;
  border-bottom: 1rpx solid #F5F5F5;
}

.category-tabs {
  display: inline-flex;
  padding: 20rpx 24rpx;
  gap: 24rpx;

  .tab-item {
    padding: 12rpx 28rpx;
    font-size: 26rpx;
    color: #666666;
    background-color: #F5F5F5;
    border-radius: 28rpx;

    .tab-count {
      font-size: 22rpx;
      color: #999999;
    }

    &.active {
      color: #FFFFFF;
      background-color: #007AFF;

      .tab-count {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.list-scroll {
  padding: 20rpx 0;
}

.collect-item {
  display: flex;
  align-items: center;
  margin: 0 24rpx 20rpx;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .select-box {
    padding-right: 20rpx;

    .checkbox {
      width: 40rpx;
      height: 40rpx;
      border: 2rpx solid #DDDDDD;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.checked {
        background-color: #007AFF;
        border-color: #007AFF;
      }
    }
  }

  .item-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }

  .item-content {
    flex: 1;
    min-width: 0;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;

    .item-title {
      font-size: 28rpx;
      color: #333333;
      font-weight: 500;
      line-height: 1.4;
    }

    .item-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .meta-type {
        font-size: 22rpx;
        color: #007AFF;
        padding: 4rpx 12rpx;
        background-color: rgba(0, 122, 255, 0.1);
        border-radius: 4rpx;
      }

      .meta-time {
        font-size: 22rpx;
        color: #999999;
      }
    }
  }
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  text {
    font-size: 28rpx;
    color: #999999;
    margin-top: 20rpx;
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  border-top: 1rpx solid #F5F5F5;

  .select-all {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 28rpx;
    color: #333333;

    .checkbox {
      width: 40rpx;
      height: 40rpx;
      border: 2rpx solid #DDDDDD;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.checked {
        background-color: #007AFF;
        border-color: #007AFF;
      }
    }
  }

  .delete-btn {
    padding: 16rpx 48rpx;
    font-size: 28rpx;
    color: #FFFFFF;
    background-color: #FF3B30;
    border-radius: 32rpx;

    &.disabled {
      background-color: #CCCCCC;
    }
  }
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
