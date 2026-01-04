<template>
  <view class="dm-filter" v-if="visible">
    <view class="filter-mask" @click="close"></view>
    <view class="filter-content">
      <!-- 状态栏占位 -->
      <view class="filter-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 胶囊按钮区域占位（小程序） -->
      <view class="filter-capsule-bar" :style="{ height: capsuleHeight + 'px' }"></view>
      <view class="filter-header">
        <text class="filter-title">筛选</text>
        <text class="filter-reset" @click="handleReset">重置</text>
      </view>

      <scroll-view class="filter-body" scroll-y>
        <view v-for="(group, gIdx) in options" :key="gIdx" class="filter-group">
          <text class="group-title">{{ group.title }}</text>
          <view class="group-items">
            <view
              v-for="(item, iIdx) in group.items"
              :key="iIdx"
              class="filter-item"
              :class="{ active: isSelected(group.key, item.value) }"
              @click="handleSelect(group.key, item.value)"
            >
              {{ item.label }}
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="filter-footer">
        <view class="btn-cancel" @click="close">取消</view>
        <view class="btn-confirm" @click="handleConfirm">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dm-filter',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selected: {},
      statusBarHeight: 0,
      capsuleHeight: 0
    }
  },
  created() {
    this.getSystemInfo()
  },
  watch: {
    visible(val) {
      if (val) {
        this.selected = { ...this.value }
      }
    }
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0

      // #ifdef MP-WEIXIN
      // 获取小程序胶囊按钮信息
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      // 胶囊按钮底部到状态栏底部的距离
      this.capsuleHeight = menuButtonInfo.bottom - systemInfo.statusBarHeight + 8
      // #endif
    },
    isSelected(key, value) {
      return this.selected[key] === value
    },
    handleSelect(key, value) {
      if (this.selected[key] === value) {
        delete this.selected[key]
      } else {
        this.selected[key] = value
      }
      this.selected = { ...this.selected }
    },
    handleReset() {
      this.selected = {}
    },
    handleConfirm() {
      this.$emit('confirm', this.selected)
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-filter {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  .filter-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .filter-content {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 600rpx;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
  }

  .filter-status-bar {
    background-color: #FFFFFF;
    flex-shrink: 0;
  }

  .filter-capsule-bar {
    background-color: #FFFFFF;
    flex-shrink: 0;
  }

  .filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx;
    border-bottom: 1rpx solid #EEEEEE;

    .filter-title {
      font-size: 32rpx;
      color: #333333;
      font-weight: 600;
    }

    .filter-reset {
      font-size: 28rpx;
      color: #007AFF;
    }
  }

  .filter-body {
    flex: 1;
    padding: 24rpx;

    .filter-group {
      margin-bottom: 32rpx;

      .group-title {
        display: block;
        font-size: 28rpx;
        color: #333333;
        font-weight: 500;
        margin-bottom: 20rpx;
      }

      .group-items {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .filter-item {
          padding: 16rpx 28rpx;
          font-size: 26rpx;
          color: #666666;
          background-color: #F5F5F5;
          border-radius: 8rpx;

          &.active {
            color: #007AFF;
            background-color: rgba(0, 122, 255, 0.1);
          }
        }
      }
    }
  }

  .filter-footer {
    display: flex;
    padding: 24rpx;
    border-top: 1rpx solid #EEEEEE;

    .btn-cancel,
    .btn-confirm {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      border-radius: 44rpx;
    }

    .btn-cancel {
      color: #666666;
      background-color: #F5F5F5;
      margin-right: 24rpx;
    }

    .btn-confirm {
      color: #FFFFFF;
      background-color: #007AFF;
    }
  }
}
</style>
