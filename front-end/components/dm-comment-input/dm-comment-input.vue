<template>
  <view class="dm-comment-input" v-if="visible">
    <view class="input-wrapper">
      <input
        v-model="inputText"
        type="text"
        :placeholder="placeholder"
        confirm-type="send"
        :focus="autoFocus"
        @confirm="handleSend"
      />
    </view>
    <view class="send-btn" :class="{ disabled: !inputText.trim() }" @click="handleSend">
      <text>发送</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dm-comment-input',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '写评论...'
    },
    autoFocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputText: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.inputText = ''
      }
    }
  },
  methods: {
    handleSend() {
      if (!this.inputText.trim()) return
      this.$emit('send', this.inputText.trim())
      this.inputText = ''
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-comment-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #FFFFFF;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  border-top: 1rpx solid #F5F5F5;
  z-index: 998;
  box-sizing: content-box;

  .input-wrapper {
    flex: 1;
    height: 72rpx;
    padding: 0 24rpx;
    background: #F5F5F5;
    border-radius: 36rpx;
    border: 1rpx solid #E5E5E5;

    input {
      height: 100%;
      font-size: 28rpx;
      color: #333333;

      &::placeholder {
        color: #999999;
      }
    }
  }

  .send-btn {
    margin-left: 16rpx;
    padding: 16rpx 32rpx;
    background: #007AFF;
    border-radius: 36rpx;

    text {
      font-size: 28rpx;
      color: #FFFFFF;
    }

    &.disabled {
      background: #CCCCCC;
    }
  }
}
</style>
