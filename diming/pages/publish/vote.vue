<template>
  <view class="page-container">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布投票</text>
      </view>
    </view>

    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 投票标题 -->
      <view class="form-section">
        <textarea class="content-input" v-model="formData.title" placeholder="请输入投票标题..." :maxlength="200"></textarea>
      </view>

      <!-- 投票选项 -->
      <view class="form-section">
        <text class="section-title">投票选项</text>
        <view v-for="(opt, index) in formData.options" :key="index" class="option-item">
          <input class="option-input" v-model="opt.text" :placeholder="'选项' + (index + 1)" />
          <view v-if="formData.options.length > 2" class="delete-option" @click="deleteOption(index)">
            <uni-icons type="close" size="18" color="#FFFFFF"></uni-icons>
          </view>
        </view>
        <view v-if="formData.options.length < 6" class="add-option" @click="addOption">
          <text>+ 添加选项</text>
        </view>
      </view>

      <!-- 投票类型 -->
      <view class="form-item">
        <text class="item-label">投票类型</text>
        <view class="type-options">
          <view class="type-btn" :class="{ active: formData.type === 'single' }" @click="formData.type = 'single'">单选</view>
          <view class="type-btn" :class="{ active: formData.type === 'multiple' }" @click="formData.type = 'multiple'">多选</view>
        </view>
      </view>

      <!-- 截止时间 -->
      <view class="form-item" @click="showTimePicker = true">
        <text class="item-label">截止时间</text>
        <view class="item-value">
          <text v-if="formData.deadline">{{ formData.deadline }}</text>
          <text v-else class="placeholder">选择截止时间</text>
        </view>
      </view>

      <!-- 匿名投票 -->
      <view class="form-item">
        <text class="item-label">匿名投票</text>
        <switch :checked="formData.anonymous" @change="formData.anonymous = $event.detail.value" color="#007AFF" />
      </view>

      <!-- 底部占位,防止内容被按钮遮挡 -->
      <view style="height: 120rpx;"></view>
    </scroll-view>

    <!-- 底部发布按钮 -->
    <view class="submit-bar">
      <button class="submit-btn" @click="handleSubmit">发布</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      rightSafeArea: 12,
      scrollHeight: 0,
      formData: {
        title: '',
        options: [{ text: '' }, { text: '' }],
        type: 'single',
        deadline: '',
        anonymous: false
      }
    }
  },
  onLoad() {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
    this.calcRightSafeArea()
    this.calcScrollHeight()
  },
  methods: {
    calcRightSafeArea() {
      // #ifdef MP-WEIXIN
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const systemInfo = uni.getSystemInfoSync()
      this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left + 10
      // #endif
    },
    calcScrollHeight() {
      const systemInfo = uni.getSystemInfoSync()
      const navBarHeight = uni.upx2px(88)
      const submitBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navBarHeight - submitBarHeight
    },
    goBack() { uni.navigateBack() },
    addOption() { this.formData.options.push({ text: '' }) },
    deleteOption(index) { this.formData.options.splice(index, 1) },
    handleSubmit() {
      if (!this.formData.title.trim()) return uni.showToast({ title: '请输入投票标题', icon: 'none' })
      const validOptions = this.formData.options.filter(o => o.text.trim())
      if (validOptions.length < 2) return uni.showToast({ title: '至少需要2个选项', icon: 'none' })
      uni.showLoading({ title: '发布中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '发布成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container { min-height: 100vh; background: #F8F8F8; }
.nav-bar { background: #FFF;
  .nav-content { position: relative; display: flex; align-items: center; height: 88rpx; padding: 0 24rpx;
    .nav-cancel { font-size: 30rpx; color: #666; z-index: 10; }
    .nav-title { position: absolute; left: 50%; transform: translateX(-50%); font-size: 34rpx; color: #333; font-weight: 600; }
  }
}
.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  border-top: 1rpx solid #F5F5F5;
  z-index: 100;
  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
    border-radius: 44rpx;
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 600;
    border: none;
    line-height: 88rpx;
    &::after { border: none; }
  }
}
.form-scroll {}
.form-section { padding: 24rpx; background: #FFF; margin-bottom: 20rpx;
  .section-title { display: block; font-size: 28rpx; color: #333; margin-bottom: 16rpx; }
  .content-input { width: 100%; min-height: 120rpx; font-size: 28rpx; color: #333; }
}
.option-item { display: flex; align-items: center; margin-bottom: 16rpx;
  .option-input { flex: 1; height: 80rpx; padding: 0 20rpx; background: #F5F5F5; border-radius: 8rpx; font-size: 28rpx; }
  .delete-option { width: 60rpx; height: 60rpx; margin-left: 16rpx; background: #FF3B30; border-radius: 50%; color: #FFF; font-size: 32rpx; display: flex; align-items: center; justify-content: center; }
}
.add-option { height: 80rpx; background: #F5F5F5; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #007AFF; }
.form-item { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 24rpx; background: #FFF; border-bottom: 1rpx solid #F5F5F5;
  .item-label { font-size: 30rpx; color: #333; }
  .item-value { font-size: 28rpx; color: #333; .placeholder { color: #999; } }
  .type-options { display: flex; gap: 16rpx;
    .type-btn { padding: 12rpx 32rpx; font-size: 26rpx; color: #666; background: #F5F5F5; border-radius: 24rpx;
      &.active { color: #007AFF; background: rgba(0,122,255,0.1); }
    }
  }
}
</style>
