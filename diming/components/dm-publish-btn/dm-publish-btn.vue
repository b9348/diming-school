<template>
  <view class="dm-publish-btn" @click="handleClick">
    <uni-icons type="plusempty" size="24" color="#FFFFFF"></uni-icons>
  </view>
</template>

<script>
export default {
  name: 'dm-publish-btn',
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-publish-btn {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
  background-color: #007AFF;
  border-radius: 50%;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.4);
  z-index: 100;
}
</style>
