<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">我的订单</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 订单类型 Tabs -->
    <view class="order-tabs">
      <view
        class="tab-item"
        :class="{ active: currentTab === index }"
        v-for="(tab, index) in tabList"
        :key="index"
        @click="switchTab(index)"
      >
        <text class="tab-text">{{ tab.name }}</text>
        <view class="tab-badge" v-if="tab.count > 0">{{ tab.count > 99 ? '99+' : tab.count }}</view>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view
      class="list-scroll"
      scroll-y
      :style="{ height: listHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="order-card" v-for="(order, index) in orderList" :key="index" @click="goOrderDetail(order)">
        <view class="order-header">
          <view class="order-type">
            <uni-icons :type="getOrderIcon(order.type)" size="16" :color="getOrderColor(order.type)"></uni-icons>
            <text class="type-text">{{ getOrderTypeName(order.type) }}</text>
          </view>
          <text class="order-status" :style="{ color: getStatusColor(order.status) }">{{ getStatusText(order.status) }}</text>
        </view>

        <view class="order-content">
          <image class="order-image" :src="order.cover || 'https://iph.href.lu/100x100?text=订单'" mode="aspectFill"></image>
          <view class="order-info">
            <text class="order-title ellipsis-2">{{ order.title }}</text>
            <text class="order-desc ellipsis">{{ order.desc }}</text>
          </view>
          <view class="order-price" v-if="order.price">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ order.price.toFixed(2) }}</text>
          </view>
        </view>

        <view class="order-footer">
          <text class="order-time">{{ order.time }}</text>
          <view class="order-actions">
            <view
              class="action-btn"
              :class="btn.type"
              v-for="(btn, bIndex) in getOrderActions(order)"
              :key="bIndex"
              @click.stop="handleAction(btn.action, order)"
            >
              {{ btn.text }}
            </view>
          </view>
        </view>
      </view>

      <view class="empty-tip" v-if="orderList.length === 0 && !loading">
        <uni-icons type="list" size="48" color="#CCCCCC"></uni-icons>
        <text>暂无订单</text>
      </view>

      <view class="load-more" v-if="orderList.length > 0">
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
      currentTab: 0,
      tabList: [
        { name: '全部', key: 'all', count: 0 },
        { name: '待处理', key: 'pending', count: 0 },
        { name: '进行中', key: 'processing', count: 0 },
        { name: '已完成', key: 'completed', count: 0 },
        { name: '已取消', key: 'cancelled', count: 0 }
      ],
      orderList: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false
    }
  },
  onLoad(options) {
    this.getSystemInfo()
    if (options.tab) {
      const tabIndex = this.tabList.findIndex(t => t.key === options.tab)
      if (tabIndex > -1) this.currentTab = tabIndex
    }
    this.loadOrderList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      const tabHeight = uni.upx2px(88)
      this.listHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - tabHeight
    },
    goBack() {
      uni.navigateBack()
    },
    switchTab(index) {
      this.currentTab = index
      this.page = 1
      this.orderList = []
      this.noMore = false
      this.loadOrderList()
    },
    async loadOrderList() {
      if (this.loading || this.noMore) return
      this.loading = true

      try {
        const res = await userApi.getOrders({
          page: this.page,
          pageSize: this.pageSize,
          status: this.tabList[this.currentTab].key
        })
        const list = res.list || []
        if (list.length < this.pageSize) {
          this.noMore = true
        }
        this.orderList = [...this.orderList, ...list]
        this.page++

        // 更新各状态数量
        if (res.counts) {
          this.tabList.forEach(tab => {
            tab.count = res.counts[tab.key] || 0
          })
        }
      } catch (e) {
        console.error('加载订单失败', e)
      }
      this.loading = false
    },
    loadMore() {
      this.loadOrderList()
    },
    getOrderIcon(type) {
      const iconMap = {
        errand: 'car',
        idle: 'shop',
        help: 'hand-up'
      }
      return iconMap[type] || 'list'
    },
    getOrderColor(type) {
      const colorMap = {
        errand: '#FF9500',
        idle: '#4CAF50',
        help: '#007AFF'
      }
      return colorMap[type] || '#666666'
    },
    getOrderTypeName(type) {
      const nameMap = {
        errand: '跑腿订单',
        idle: '闲置交易',
        help: '互助拍卖'
      }
      return nameMap[type] || '订单'
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待处理',
        accepted: '已接单',
        processing: '进行中',
        delivering: '配送中',
        completed: '已完成',
        cancelled: '已取消',
        refunding: '退款中',
        refunded: '已退款'
      }
      return statusMap[status] || status
    },
    getStatusColor(status) {
      const colorMap = {
        pending: '#FF9500',
        accepted: '#007AFF',
        processing: '#007AFF',
        delivering: '#4CAF50',
        completed: '#999999',
        cancelled: '#999999',
        refunding: '#FF3B30',
        refunded: '#999999'
      }
      return colorMap[status] || '#666666'
    },
    getOrderActions(order) {
      const actions = []
      switch (order.status) {
        case 'pending':
          actions.push({ text: '取消订单', action: 'cancel', type: '' })
          if (order.type === 'errand') {
            actions.push({ text: '催一下', action: 'urge', type: 'primary' })
          }
          break
        case 'accepted':
        case 'processing':
          actions.push({ text: '联系对方', action: 'contact', type: 'primary' })
          break
        case 'delivering':
          actions.push({ text: '确认收货', action: 'confirm', type: 'primary' })
          break
        case 'completed':
          if (!order.rated) {
            actions.push({ text: '去评价', action: 'rate', type: 'primary' })
          }
          actions.push({ text: '再来一单', action: 'reorder', type: '' })
          break
        case 'cancelled':
          actions.push({ text: '删除订单', action: 'delete', type: '' })
          break
      }
      return actions
    },
    goOrderDetail(order) {
      uni.navigateTo({ url: `/pages/mine/order-detail?id=${order.id}` })
    },
    handleAction(action, order) {
      switch (action) {
        case 'cancel':
          this.cancelOrder(order)
          break
        case 'urge':
          this.urgeOrder(order)
          break
        case 'contact':
          uni.navigateTo({ url: `/pages/chat/index?targetId=${order.targetUserId}` })
          break
        case 'confirm':
          this.confirmOrder(order)
          break
        case 'rate':
          uni.navigateTo({ url: `/pages/mine/rate?orderId=${order.id}` })
          break
        case 'reorder':
          this.reorder(order)
          break
        case 'delete':
          this.deleteOrder(order)
          break
      }
    },
    cancelOrder(order) {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消这个订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.cancelOrder(order.id)
              order.status = 'cancelled'
              uni.showToast({ title: '已取消', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '操作失败', icon: 'none' })
            }
          }
        }
      })
    },
    urgeOrder(order) {
      uni.showToast({ title: '已催促，请耐心等待', icon: 'none' })
    },
    confirmOrder(order) {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到货物/服务吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.confirmOrder(order.id)
              order.status = 'completed'
              uni.showToast({ title: '已确认', icon: 'success' })
            } catch (e) {
              uni.showToast({ title: '操作失败', icon: 'none' })
            }
          }
        }
      })
    },
    reorder(order) {
      const publishPageMap = {
        errand: '/pages/publish/errand',
        idle: '/pages/idle/detail',
        help: '/pages/help/detail'
      }
      const url = publishPageMap[order.type]
      if (url) {
        uni.navigateTo({ url: `${url}?reorder=${order.id}` })
      }
    },
    deleteOrder(order) {
      uni.showModal({
        title: '删除订单',
        content: '确定要删除这个订单吗？',
        confirmColor: '#FF3B30',
        success: async (res) => {
          if (res.confirm) {
            try {
              await userApi.deleteOrder(order.id)
              this.orderList = this.orderList.filter(o => o.id !== order.id)
              uni.showToast({ title: '已删除', icon: 'success' })
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

.order-tabs {
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F5F5F5;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    position: relative;

    .tab-text {
      font-size: 28rpx;
      color: #666666;
    }

    .tab-badge {
      position: absolute;
      top: 12rpx;
      right: 20rpx;
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      font-size: 20rpx;
      color: #FFFFFF;
      background-color: #FF3B30;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tab-line {
      position: absolute;
      bottom: 0;
      width: 48rpx;
      height: 4rpx;
      background-color: #007AFF;
      border-radius: 2rpx;
    }

    &.active .tab-text {
      color: #007AFF;
      font-weight: 600;
    }
  }
}

.list-scroll {
  padding: 20rpx 0;
}

.order-card {
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .order-type {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .type-text {
        font-size: 26rpx;
        color: #333333;
        font-weight: 500;
      }
    }

    .order-status {
      font-size: 26rpx;
      font-weight: 500;
    }
  }

  .order-content {
    display: flex;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #F5F5F5;

    .order-image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      flex-shrink: 0;
    }

    .order-info {
      flex: 1;
      min-width: 0;
      margin-left: 20rpx;

      .order-title {
        font-size: 28rpx;
        color: #333333;
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: 12rpx;
      }

      .order-desc {
        font-size: 24rpx;
        color: #999999;
      }
    }

    .order-price {
      margin-left: 20rpx;
      text-align: right;

      .price-symbol {
        font-size: 24rpx;
        color: #FF3B30;
      }

      .price-value {
        font-size: 36rpx;
        color: #FF3B30;
        font-weight: 600;
      }
    }
  }

  .order-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;

    .order-time {
      font-size: 24rpx;
      color: #999999;
    }

    .order-actions {
      display: flex;
      gap: 16rpx;

      .action-btn {
        padding: 12rpx 28rpx;
        font-size: 26rpx;
        color: #666666;
        background-color: #F5F5F5;
        border-radius: 28rpx;

        &.primary {
          color: #FFFFFF;
          background-color: #007AFF;
        }
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
