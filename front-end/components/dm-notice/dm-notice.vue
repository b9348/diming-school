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
import componentBaseMixin from '@/mixins/component-base.js'

export default {
  mixins: [componentBaseMixin],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['click'],
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
      transition: background-color 0.3s ease;

      .page-container.dark-mode & {
        background-color: #2a2a2a;
      }

      .notice-tag {
        flex-shrink: 0;
        padding: 4rpx 12rpx;
        margin-right: 16rpx;
        font-size: 22rpx;
        color: #FF9500;
        background-color: #FFF3E0;
        border-radius: 0;
        transition: background-color 0.3s ease;

        .page-container.dark-mode & {
          background-color: rgba(255, 243, 224, 0.2);
        }
      }

      .notice-text {
        flex: 1;
        font-size: 26rpx;
        color: #666666;
        transition: color 0.3s ease;

        .page-container.dark-mode & {
          color: #b0b0b0;
        }
      }
    }
  }
}
</style>
