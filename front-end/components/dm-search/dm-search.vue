<template>
  <view class="dm-search" :style="{ backgroundColor: bgColor, paddingRight: rightSafeArea + 'px' }">
    <view class="search-box" @click="handleClick">
      <uni-icons type="search" size="16" color="#999999" class="search-icon"></uni-icons>
      <input
        v-if="!disabled"
        class="search-input"
        type="text"
        :placeholder="placeholder"
        :value="value"
        @input="handleInput"
        @confirm="handleConfirm"
        confirm-type="search"
      />
      <text v-else class="search-placeholder">{{ placeholder }}</text>
    </view>
    <view v-if="showFilter" class="filter-btn" @click="$emit('filter')">
      <uni-icons type="tune" size="20" color="#333333" class="filter-icon"></uni-icons>
    </view>
    <view v-if="showSwitch" class="switch-btn" @click="$emit('switch')">
      <uni-icons type="loop" size="20" color="#333333" class="switch-icon"></uni-icons>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dm-search',
  data() {
    return {
      rightSafeArea: 12 // 默认右侧内边距
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showFilter: {
      type: Boolean,
      default: false
    },
    showSwitch: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: '#FFFFFF'
    }
  },
  mounted() {
    this.calcRightSafeArea()
  },
  methods: {
    calcRightSafeArea() {
      // #ifdef MP-WEIXIN
      // 获取胶囊按钮位置信息
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const systemInfo = uni.getSystemInfoSync()
      // 右侧安全距离 = 屏幕宽度 - 胶囊按钮左边界 + 间距
      this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left + 10
      // #endif
    },
    handleClick() {
      if (this.disabled) {
        this.$emit('click')
      }
    },
    handleInput(e) {
      this.$emit('input', e.detail.value)
      this.$emit('update:value', e.detail.value)
    },
    handleConfirm(e) {
      this.$emit('search', e.detail.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-search {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #F5F5F5;
    border-radius: 36rpx;

    .search-icon {
      margin-right: 16rpx;
    }

    .search-input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      color: #333333;
    }

    .search-placeholder {
      flex: 1;
      font-size: 28rpx;
      color: #999999;
    }
  }

  .filter-btn,
  .switch-btn {
    margin-left: 20rpx;
    padding: 10rpx;
  }
}
</style>
