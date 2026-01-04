<template>
  <view class="dm-notice">
    <swiper
      class="notice-swiper"
      vertical
      :autoplay="true"
      :interval="3000"
      :duration="500"
      circular
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(item, index)"
      >
        <view class="notice-item">
          <text class="notice-tag">{{ item.tag || '公告' }}</text>
          <text class="notice-text ellipsis">{{ item.content || item.title || item }}</text>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'dm-notice',
  props: {
    list: {
      type: Array,
      default: () => []
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
.dm-notice {
  padding: 0 24rpx;

  .notice-swiper {
    height: 80rpx;

    .notice-item {
      display: flex;
      align-items: center;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #FFF9E6;
      border-radius: 8rpx;

      .notice-tag {
        flex-shrink: 0;
        padding: 4rpx 12rpx;
        margin-right: 16rpx;
        font-size: 22rpx;
        color: #FF9500;
        background-color: #FFE5B4;
        border-radius: 4rpx;
      }

      .notice-text {
        flex: 1;
        font-size: 26rpx;
        color: #666666;
      }
    }
  }
}
</style>
