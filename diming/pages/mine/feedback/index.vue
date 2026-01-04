<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">意见反馈</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 表单区域 -->
    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 反馈类型 -->
      <view class="form-section">
        <text class="section-title">反馈类型</text>
        <view class="type-list">
          <view
            class="type-item"
            :class="{ active: feedbackType === item.key }"
            v-for="item in typeList"
            :key="item.key"
            @click="feedbackType = item.key"
          >
            {{ item.name }}
          </view>
        </view>
      </view>

      <!-- 反馈内容 -->
      <view class="form-section">
        <text class="section-title">反馈内容</text>
        <textarea
          class="content-input"
          v-model="content"
          placeholder="请详细描述您的问题或建议..."
          maxlength="500"
          :show-count="true"
        ></textarea>
        <text class="word-count">{{ content.length }}/500</text>
      </view>

      <!-- 上传图片 -->
      <view class="form-section">
        <text class="section-title">上传图片（选填）</text>
        <view class="image-list">
          <view class="image-item" v-for="(img, index) in imageList" :key="index">
            <image :src="img" mode="aspectFill"></image>
            <view class="delete-btn" @click="deleteImage(index)">
              <uni-icons type="close" size="12" color="#FFFFFF"></uni-icons>
            </view>
          </view>
          <view class="add-image" @click="chooseImage" v-if="imageList.length < 4">
            <uni-icons type="plusempty" size="32" color="#CCCCCC"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <text class="section-title">联系方式（选填）</text>
        <input
          class="contact-input"
          v-model="contact"
          placeholder="请输入手机号或邮箱，方便我们联系您"
        />
      </view>
    </scroll-view>

    <!-- 提交按钮 -->
    <view class="submit-section safe-area-bottom">
      <view class="submit-btn" @click="handleSubmit">提交反馈</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      feedbackType: 'bug',
      content: '',
      imageList: [],
      contact: '',
      typeList: [
        { key: 'bug', name: '功能异常' },
        { key: 'suggest', name: '功能建议' },
        { key: 'complaint', name: '投诉举报' },
        { key: 'other', name: '其他问题' }
      ]
    }
  },
  onLoad() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      const submitHeight = uni.upx2px(120)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight - submitHeight
    },
    goBack() {
      uni.navigateBack()
    },
    chooseImage() {
      uni.chooseImage({
        count: 4 - this.imageList.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageList = [...this.imageList, ...res.tempFilePaths]
        }
      })
    },
    deleteImage(index) {
      this.imageList.splice(index, 1)
    },
    handleSubmit() {
      if (!this.content.trim()) {
        uni.showToast({ title: '请输入反馈内容', icon: 'none' })
        return
      }
      if (this.content.length < 10) {
        uni.showToast({ title: '反馈内容至少10个字', icon: 'none' })
        return
      }
      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '提交成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.nav-bar {
  background-color: #FFFFFF;
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 24rpx;
    .nav-back { padding: 10rpx; }
    .nav-title { font-size: 34rpx; color: #333333; font-weight: 600; }
    .nav-placeholder { width: 40rpx; }
  }
}

.form-scroll {
  padding: 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  box-sizing: border-box;
}

.form-section {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20rpx;
  }
}

.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  .type-item {
    padding: 16rpx 32rpx;
    font-size: 26rpx;
    color: #666666;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    border: 2rpx solid transparent;
    &.active {
      color: #007AFF;
      background-color: #E8F4FF;
      border-color: #007AFF;
    }
  }
}

.content-input {
  width: 100%;
  height: 240rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background-color: #F8F8F8;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.word-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  .image-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
      box-sizing: border-box;
    }
    .delete-btn {
      position: absolute;
      top: -12rpx;
      right: -12rpx;
      width: 36rpx;
      height: 36rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .add-image {
    width: 160rpx;
    height: 160rpx;
    background-color: #F8F8F8;
    border: 2rpx dashed #DDDDDD;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.contact-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #F8F8F8;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  background-color: #FFFFFF;
  box-sizing: border-box;
  .submit-btn {
    height: 88rpx;
    background-color: #007AFF;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 600;
  }
}
</style>
