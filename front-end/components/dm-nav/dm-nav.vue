<template>
  <view class="dm-nav">
    <scroll-view class="nav-scroll" scroll-x>
      <view class="nav-wrapper">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="nav-item"
          @click="handleClick(item, index)"
        >
          <view class="nav-icon-box">
            <image v-if="item.icon" class="nav-icon" :src="item.icon" mode="aspectFit"></image>
            <text v-else class="nav-icon-text">{{ (item.name || '').substring(0, 2) }}</text>
          </view>
          <text class="nav-text ellipsis">{{ item.name || item }}</text>
        </view>
      </view>
    </scroll-view>
    <view v-if="showArrow" class="nav-arrow" @click="$emit('more')">
      <uni-icons type="right" size="12" color="#999999"></uni-icons>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dm-nav',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    showArrow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick(item, index) {
      this.$emit('click', { item, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-nav {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  background-color: #FFFFFF;

  .nav-scroll {
    flex: 1;
    white-space: nowrap;

    .nav-wrapper {
      display: inline-flex;
      padding: 0 12rpx;

      .nav-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 120rpx;
        margin: 0 12rpx;

        .nav-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 88rpx;
          height: 88rpx;
          margin-bottom: 12rpx;
          background-color: #F5F5F5;
          border-radius: 16rpx;

          .nav-icon {
            width: 48rpx;
            height: 48rpx;
          }

          .nav-icon-text {
            font-size: 24rpx;
            color: #666666;
          }
        }

        .nav-text {
          width: 100%;
          font-size: 24rpx;
          color: #333333;
          text-align: center;
        }
      }
    }
  }

  .nav-arrow {
    flex-shrink: 0;
    padding: 20rpx;
  }
}
</style>
