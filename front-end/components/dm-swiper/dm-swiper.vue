<template>
  <view class="dm-swiper">
    <swiper
      class="swiper-container"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      @change="handleChange"
    >
      <swiper-item v-for="(item, index) in list" :key="index" @click="handleClick(item, index)">
        <image
          class="swiper-image"
          :src="item.image || item.url || item"
          mode="aspectFill"
        ></image>
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
    },
    indicatorDots: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    },
    duration: {
      type: Number,
      default: 500
    },
    circular: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'click'],
  methods: {
    handleChange(e) {
      this.$emit('change', e.detail.current)
    },
    handleClick(item, index) {
      this.$emit('click', { item, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-swiper {
  padding: 0 24rpx;

  .swiper-container {
    width: 100%;
    height: 280rpx;
    border-radius: 16rpx;
    overflow: hidden;

    .swiper-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
