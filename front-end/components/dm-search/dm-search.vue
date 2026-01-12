<template>
  <view class="dm-search" :class="{ 'dark-mode': darkMode }" :style="{ backgroundColor: computedBgColor, paddingRight: rightSafeArea + 'px' }">
    <view class="search-box" @click="handleClick">
      <text class="tn-icon-search search-icon" :style="{ fontSize: '16px', color: darkMode ? '#808080' : '#999999' }"></text>
      <input
        v-if="!disabled"
        class="search-input"
        type="text"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :value="value"
        @input="handleInput"
        @confirm="handleConfirm"
        confirm-type="search"
      />
      <text v-else class="search-placeholder">{{ placeholder }}</text>
    </view>
    <view v-if="showFilter" class="filter-btn" @click="$emit('filter')">
      <text class="tn-icon-filter filter-icon" :style="{ fontSize: '20px', color: darkMode ? '#e0e0e0' : '#333333' }"></text>
    </view>
    <view v-if="showSwitch" class="switch-btn" @click="$emit('switch')">
      <text class="tn-icon-location-fill switch-icon" :style="{ fontSize: '20px', color: darkMode ? '#e0e0e0' : '#333333' }"></text>
    </view>
  </view>
</template>

<script>
import componentBaseMixin from '@/mixins/component-base.js'

export default {
  mixins: [componentBaseMixin],
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
  computed: {
    computedBgColor() {
      // 如果是夜间模式，返回深色背景，否则使用 prop 传入的背景色
      return this.darkMode ? '#2a2a2a' : this.bgColor
    },
    placeholderStyle() {
      // 动态设置 placeholder 颜色
      return this.darkMode ? 'color: #808080' : 'color: #999999'
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
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: #2a2a2a !important;
  }

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #F5F5F5;
    border-radius: 36rpx;
    transition: background-color 0.3s ease;

    .search-icon {
      margin-right: 16rpx;
    }

    .search-input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      color: #333333;
      transition: color 0.3s ease;
    }

    .search-placeholder {
      flex: 1;
      font-size: 28rpx;
      color: #999999;
      transition: color 0.3s ease;
    }
  }

  &.dark-mode .search-box {
    background-color: #3a3a3a;

    .search-input {
      color: #e0e0e0;
    }

    .search-placeholder {
      color: #808080;
    }
  }

  .filter-btn,
  .switch-btn {
    margin-left: 20rpx;
    padding: 10rpx;
  }
}
</style>
