<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">我的帖子</text>
        <view class="nav-placeholder"></view>
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
        </view>
      </view>
    </scroll-view>

    <!-- 帖子列表 -->
    <scroll-view
      class="list-scroll"
      scroll-y
      :style="{ height: listHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="post-item" v-for="(item, index) in postList" :key="index" @click="goDetail(item)">
        <view class="post-content">
          <view class="post-info">
            <text class="post-title ellipsis">{{ item.title || item.content }}</text>
            <text class="post-desc ellipsis-2">{{ item.content }}</text>
            <view class="post-meta">
              <text class="meta-time">{{ item.time }}</text>
              <view class="meta-stats">
                <text class="stat-item">{{ item.viewCount || 0 }} 浏览</text>
                <text class="stat-item">{{ item.likeCount || 0 }} 赞</text>
                <text class="stat-item">{{ item.commentCount || 0 }} 评论</text>
              </view>
            </view>
          </view>
          <image
            v-if="item.images && item.images.length"
            class="post-image"
            :src="item.images[0]"
            mode="aspectFill"
          ></image>
        </view>
        <view class="post-actions">
          <view class="action-btn" @click.stop="editPost(item)">
            <uni-icons type="compose" size="16" color="#666666"></uni-icons>
            <text>编辑</text>
          </view>
          <view class="action-btn delete" @click.stop="deletePost(item)">
            <uni-icons type="trash" size="16" color="#FF3B30"></uni-icons>
            <text>删除</text>
          </view>
        </view>
      </view>

      <view class="empty-tip" v-if="postList.length === 0 && !loading">
        <uni-icons type="compose" size="48" color="#CCCCCC"></uni-icons>
        <text>暂无帖子</text>
      </view>

      <view class="load-more" v-if="postList.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { userApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      listHeight: 0,
      currentCategory: 'all',
      categoryList: [
        { key: 'all', name: '全部' },
        { key: 'post', name: '帖子' },
        { key: 'vote', name: '投票' },
        { key: 'errand', name: '跑腿' },
        { key: 'idle', name: '闲置' },
        { key: 'help', name: '互助' },
        { key: 'love', name: '交友' }
      ],
      postList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadPostList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      const tabHeight = uni.upx2px(100)
      this.listHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - tabHeight
    },
    goBack() {
      uni.navigateBack()
    },
    switchCategory(key) {
      this.currentCategory = key
      this.page = 1
      this.postList = []
      this.noMore = false
      this.loadPostList()
    },
    async loadPostList() {
      if (this.loading || this.noMore) return
      this.loading = true

      try {
        const res = await userApi.getMyPosts({
          page: this.page,
          pageSize: this.pageSize,
          type: this.currentCategory === 'all' ? '' : this.currentCategory
        })
        const list = res.list || []
        if (list.length < this.pageSize) {
          this.noMore = true
        }
        this.postList = [...this.postList, ...list]
        this.page++
      } catch (e) {
        console.error('加载帖子失败', e)
      }
      this.loading = false
    },
    loadMore() {
      this.loadPostList()
    },
    goDetail(item) {
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
    editPost(item) {
      const publishPageMap = {
        post: '/pages/publish/post',
        vote: '/pages/publish/vote',
        errand: '/pages/publish/errand',
        idle: '/pages/publish/idle',
        love: '/pages/publish/love'
      }
      const url = publishPageMap[item.type] || '/pages/publish/post'
      uni.navigateTo({ url: `${url}?id=${item.id}` })
    },
    deletePost(item) {
      uni.showModal({
        title: '删除确认',
        content: '确定要删除这条内容吗？删除后无法恢复',
        confirmText: '删除',
        confirmColor: '#FF3B30',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.deletePost(item.id)
              uni.showToast({ title: '删除成功', icon: 'success' })
              this.postList = this.postList.filter(p => p.id !== item.id)
            } catch (e) {
              uni.showToast({ title: '删除失败', icon: 'none' })
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
    .nav-placeholder { width: 40rpx; }
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

    &.active {
      color: #FFFFFF;
      background-color: #007AFF;
    }
  }
}

.list-scroll {
  padding: 20rpx 0;
}

.post-item {
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .post-content {
    display: flex;

    .post-info {
      flex: 1;
      min-width: 0;

      .post-title {
        font-size: 30rpx;
        color: #333333;
        font-weight: 600;
        margin-bottom: 12rpx;
      }

      .post-desc {
        font-size: 26rpx;
        color: #666666;
        line-height: 1.5;
        margin-bottom: 16rpx;
      }

      .post-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .meta-time {
          font-size: 24rpx;
          color: #999999;
        }

        .meta-stats {
          display: flex;
          gap: 16rpx;

          .stat-item {
            font-size: 22rpx;
            color: #999999;
          }
        }
      }
    }

    .post-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
      margin-left: 20rpx;
      flex-shrink: 0;
    }
  }

  .post-actions {
    display: flex;
    justify-content: flex-end;
    gap: 32rpx;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #F5F5F5;

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #666666;

      &.delete {
        color: #FF3B30;
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

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
