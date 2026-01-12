<template>
  <view class="dm-tabs" :class="{ 'dark-mode': darkMode }">
    <scroll-view
      class="tabs-scroll"
      scroll-x
      :scroll-left="scrollLeft"
      scroll-with-animation
    >
      <view class="tabs-wrapper">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="tab-item"
          :class="{ active: current === index }"
          @click="handleClick(index)"
        >
          <text class="tab-text">{{ item.name || item }}</text>
          <view v-if="current === index" class="tab-line"></view>
        </view>
      </view>
    </scroll-view>
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
    },
    current: {
      type: Number,
      default: 0
    }
  },
  emits: ['change', 'update:current'],
  data() {
    return {
      scrollLeft: 0
    }
  },
  methods: {
    handleClick(index) {
      if (index === this.current) return
      this.$emit('change', index)
      this.$emit('update:current', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-tabs {
  background-color: #FFFFFF;
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: #2a2a2a;
  }

  .tabs-scroll {
    white-space: nowrap;

    .tabs-wrapper {
      display: inline-flex;
      padding: 0 12rpx;

      .tab-item {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 24rpx 24rpx;

        .tab-text {
          font-size: 28rpx;
          color: #666666;
          transition: all 0.3s;
        }

        .tab-line {
          position: absolute;
          bottom: 8rpx;
          width: 40rpx;
          height: 6rpx;
          background-color: #007AFF;
          border-radius: 3rpx;
        }

        &.active {
          .tab-text {
            color: #007AFF;
            font-weight: 600;
          }
        }
      }
    }
  }

  &.dark-mode {
    .tabs-scroll .tabs-wrapper .tab-item .tab-text {
      color: #b0b0b0;
    }

    .tabs-scroll .tabs-wrapper .tab-item.active .tab-text {
      color: #5a9fff;
    }
  }
}
</style>
