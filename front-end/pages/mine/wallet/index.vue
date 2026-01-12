<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="nav-title">收益中心</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 钱包区域 -->
    <view class="wallet-section">
      <view class="wallet-card">
        <view class="wallet-item">
          <text class="wallet-amount">{{ walletInfo.balance.toFixed(2) }}</text>
          <text class="wallet-label">我的钱包</text>
        </view>
        <view class="wallet-btn" @click="handleWithdraw('balance')">提现</view>
      </view>
      <view class="wallet-card" v-if="isAdmin">
        <view class="wallet-item">
          <text class="wallet-amount">{{ walletInfo.deposit.toFixed(2) }}</text>
          <text class="wallet-label">保证金</text>
        </view>
        <view class="wallet-btn" @click="handleWithdraw('deposit')">提现</view>
      </view>
    </view>

    <!-- 账单明细 -->
    <view class="bill-section">
      <text class="section-title">账单明细</text>

      <!-- 一级分类标签 -->
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

      <!-- 二级分类标签（置顶相关） -->
      <scroll-view class="sub-category-scroll" scroll-x v-if="subCategoryList.length > 0">
        <view class="sub-category-tabs">
          <view
            class="sub-tab-item"
            :class="{ active: currentSubCategory === item.key }"
            v-for="item in subCategoryList"
            :key="item.key"
            @click="switchSubCategory(item.key)"
          >
            {{ item.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 账单列表 -->
    <scroll-view class="bill-list" scroll-y :style="{ height: listHeight + 'px' }">
      <view class="bill-item" v-for="(item, index) in billList" :key="index">
        <view class="bill-info">
          <text class="bill-title">{{ item.title }}</text>
          <text class="bill-desc">订单编号: {{ item.orderId }}</text>
          <text class="bill-time">时间: {{ item.time }}</text>
        </view>
        <text class="bill-amount" :class="{ income: item.amount > 0 }">
          {{ item.amount > 0 ? '+' : '' }}{{ item.amount.toFixed(2) }}
        </text>
      </view>
      <view class="empty-tip" v-if="billList.length === 0">
        <text>暂无账单记录</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import userStore from '@/store/user.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      listHeight: 0,
      walletInfo: {
        balance: 20.76,
        deposit: 20.76
      },
      currentCategory: 'errand',
      currentSubCategory: 'post_pin',
      categoryList: [
        { key: 'errand', name: '跑腿' },
        { key: 'help', name: '互助' },
        { key: 'idle', name: '闲置' },
        { key: 'boost', name: '加油' },
        { key: 'deposit', name: '保证金' }
      ],
      // 管理员额外的分类
      adminCategoryList: [
        { key: 'post_pin', name: '帖子置顶' },
        { key: 'vote_pin', name: '投票置顶' },
        { key: 'errand_pin', name: '跑腿置顶' },
        { key: 'help_pin', name: '互助置顶' },
        { key: 'idle_pin', name: '闲置置顶' },
        { key: 'love_pin', name: '恋爱置顶' }
      ],
      billList: []
    }
  },
  computed: {
    isAdmin() {
      return userStore.isAdmin()
    },
    subCategoryList() {
      // 管理员显示置顶收益分类
      if (this.isAdmin && ['errand', 'help', 'idle'].includes(this.currentCategory)) {
        return this.adminCategoryList
      }
      return []
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadBillList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      const walletHeight = uni.upx2px(this.isAdmin ? 200 : 140)
      const billHeaderHeight = uni.upx2px(180)
      this.listHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - walletHeight - billHeaderHeight
    },
    goBack() {
      uni.navigateBack()
    },
    handleWithdraw(type) {
      const amount = type === 'balance' ? this.walletInfo.balance : this.walletInfo.deposit
      if (amount <= 0) {
        uni.showToast({ title: '余额不足', icon: 'none' })
        return
      }
      uni.showModal({
        title: '提现',
        content: `确定提现 ¥${amount.toFixed(2)} 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '提现申请已提交', icon: 'success' })
          }
        }
      })
    },
    switchCategory(key) {
      this.currentCategory = key
      this.currentSubCategory = ''
      this.loadBillList()
    },
    switchSubCategory(key) {
      this.currentSubCategory = key
      this.loadBillList()
    },
    loadBillList() {
      // 模拟账单数据
      this.billList = [
        {
          title: '帮我买一个被子，黑色被子，(显示前15字)',
          orderId: '2783909200',
          time: '2025.2.18 18:35',
          amount: 21
        },
        {
          title: '帮我买一个被子，黑色被子，(显示前15字)',
          orderId: '2783909201',
          time: '2025.2.18 18:35',
          amount: 21
        },
        {
          title: '保证金被扣，黑色被子，(显示前15字)',
          orderId: '2783909202',
          time: '2025.2.18 18:35',
          amount: -21
        },
        {
          title: '扣除手续费，黑色被子，(显示前15字)',
          orderId: '2783909203',
          time: '2025.2.18 18:35',
          amount: -21
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/dark-mode.scss';

.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;

  .dark-mode & {
    background-color: $dark-bg-primary;
  }
}

.nav-bar {
  background-color: #FFFFFF;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 24rpx;

    .nav-back {
      padding: 10rpx;
    }

    .nav-title {
      font-size: 34rpx;
      color: #333333;
      font-weight: 600;
      .dark-mode & {
        color: $dark-text-primary;
      }
    }

    .nav-placeholder {
      width: 40rpx;
    }
  }
}

.wallet-section {
  display: flex;
  padding: 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  gap: 24rpx;
  background-color: #FFFFFF;
  box-sizing: border-box;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }
}

.wallet-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-tertiary;
  }

  .wallet-item {
    display: flex;
    flex-direction: column;

    .wallet-amount {
      font-size: 40rpx;
      font-weight: 600;
      color: #333333;
      .dark-mode & {
        color: $dark-text-primary;
      }

      &::before {
        content: '¥';
        font-size: 28rpx;
      }
    }

    .wallet-label {
      font-size: 24rpx;
      color: #999999;
      margin-top: 8rpx;
      .dark-mode & {
        color: $dark-text-tertiary;
      }
    }
  }

  .wallet-btn {
    padding: 12rpx 32rpx;
    background-color: #FFFFFF;
    border: 1rpx solid #DDDDDD;
    border-radius: 24rpx;
    font-size: 26rpx;
    color: #333333;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    .dark-mode & {
      background-color: $dark-bg-secondary;
      border-color: $dark-border;
      color: $dark-text-primary;
    }
  }
}

.bill-section {
  background-color: #FFFFFF;
  margin-top: 20rpx;
  padding: 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  box-sizing: border-box;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20rpx;
    .dark-mode & {
      color: $dark-text-primary;
    }
  }
}

.category-scroll {
  white-space: nowrap;
}

.category-tabs {
  display: inline-flex;
  gap: 16rpx;
  padding-bottom: 16rpx;

  .tab-item {
    padding: 12rpx 24rpx;
    font-size: 26rpx;
    color: #666666;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    transition: all 0.3s ease;

    .dark-mode & {
      color: $dark-text-secondary;
      background-color: $dark-bg-tertiary;
    }

    &.active {
      color: #007AFF;
      background-color: #E8F4FF;

      .dark-mode & {
        background-color: rgba(0, 122, 255, 0.15);
      }
    }
  }
}

.sub-category-scroll {
  white-space: nowrap;
  margin-top: 16rpx;
}

.sub-category-tabs {
  display: inline-flex;
  gap: 12rpx;

  .sub-tab-item {
    padding: 8rpx 20rpx;
    font-size: 24rpx;
    color: #999999;
    background-color: #F8F8F8;
    border-radius: 6rpx;
    transition: all 0.3s ease;

    .dark-mode & {
      color: $dark-text-tertiary;
      background-color: $dark-bg-tertiary;
    }

    &.active {
      color: #333333;
      background-color: #EEEEEE;

      .dark-mode & {
        color: $dark-text-primary;
        background-color: $dark-border;
      }
    }
  }
}

.bill-list {
  background-color: #FFFFFF;
  padding: 0 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  box-sizing: border-box;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }
}

.bill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-color: $dark-border;
  }

  &:last-child {
    border-bottom: none;
  }

  .bill-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .bill-title {
      font-size: 28rpx;
      color: #333333;
      margin-bottom: 8rpx;
      .dark-mode & {
        color: $dark-text-primary;
      }
    }

    .bill-desc {
      font-size: 24rpx;
      color: #999999;
      .dark-mode & {
        color: $dark-text-tertiary;
      }
    }

    .bill-time {
      font-size: 24rpx;
      color: #999999;
      margin-top: 4rpx;
      .dark-mode & {
        color: $dark-text-tertiary;
      }
    }
  }

  .bill-amount {
    font-size: 32rpx;
    font-weight: 600;
    color: #999999;
    .dark-mode & {
      color: $dark-text-tertiary;
    }

    &.income {
      color: #4CAF50;
    }
  }
}

.empty-tip {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;

  text {
    font-size: 28rpx;
    color: #999999;
    .dark-mode & {
      color: $dark-text-tertiary;
    }
  }
}
</style>
