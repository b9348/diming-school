<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布帖子</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 内容输入 -->
      <view class="form-section">
        <textarea
          class="content-input"
          v-model="formData.content"
          placeholder="分享你的想法..."
          :maxlength="2000"
          auto-height
        ></textarea>
        <text class="content-count">{{ formData.content.length }}/2000</text>
      </view>

      <!-- 图片上传 -->
      <view class="form-section">
        <view class="image-list">
          <view v-for="(img, index) in formData.images" :key="index" class="image-item">
            <image class="preview-image" :src="img" mode="aspectFill"></image>
            <view class="delete-btn" @click="deleteImage(index)">
              <uni-icons type="close" size="18" color="#FFFFFF"></uni-icons>
            </view>
          </view>
          <view v-if="formData.images.length < 9" class="add-image" @click="chooseImage">
            <uni-icons type="plusempty" size="40" color="#999999"></uni-icons>
            <text class="add-text">添加图片</text>
          </view>
        </view>
      </view>

      <!-- 话题选择 -->
      <view class="form-item" @click="showTopicPicker = true">
        <text class="item-label">添加话题</text>
        <view class="item-value">
          <text v-if="formData.topic">{{ formData.topic }}</text>
          <text v-else class="placeholder">#选择话题</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 位置选择 -->
      <view class="form-item" @click="chooseLocation">
        <text class="item-label">添加位置</text>
        <view class="item-value">
          <text v-if="formData.location">{{ formData.location }}</text>
          <text v-else class="placeholder">选择位置</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 可见范围 -->
      <view class="form-item" @click="showVisiblePicker = true">
        <text class="item-label">可见范围</text>
        <view class="item-value">
          <text>{{ visibleOptions[formData.visible] }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 匿名发布 -->
      <view class="form-item">
        <text class="item-label">匿名发布</text>
        <switch :checked="formData.anonymous" @change="formData.anonymous = $event.detail.value" color="#007AFF" />
      </view>

      <!-- 置顶选项 -->
      <view class="form-item" @click="showTopPicker = true">
        <text class="item-label">置顶</text>
        <view class="item-value">
          <text>{{ topOptions[formData.topType] }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
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
        content: '',
        images: [],
        topic: '',
        location: '',
        visible: 0,
        anonymous: false,
        topType: 0
      },
      visibleOptions: ['全校可见', '本院系可见', '仅好友可见'],
      topOptions: ['不置顶', '置顶1天(¥5)', '置顶3天(¥12)', '置顶7天(¥25)'],
      showTopicPicker: false,
      showVisiblePicker: false,
      showTopPicker: false
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
    this.calcRightSafeArea()
    this.calcScrollHeight()
  },
  methods: {
    calcRightSafeArea() {
      // #ifdef MP-WEIXIN
      // 获取胶囊按钮位置信息
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const systemInfo = uni.getSystemInfoSync()
      // 右侧安全距离 = 屏幕宽度 - 胶囊按钮左边界 + 间距
      this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left + 10
      // #endif
    },
    calcScrollHeight() {
      const systemInfo = uni.getSystemInfoSync()
      // 计算滚动区域高度 = 屏幕高度 - 状态栏 - 导航栏(88rpx) - 底部按钮栏(100rpx)
      const navBarHeight = uni.upx2px(88)
      const submitBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navBarHeight - submitBarHeight
    },
    goBack() {
      uni.navigateBack()
    },
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.formData.images.length,
        success: (res) => {
          this.formData.images = [...this.formData.images, ...res.tempFilePaths]
        }
      })
    },
    deleteImage(index) {
      this.formData.images.splice(index, 1)
    },
    chooseLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.formData.location = res.name || res.address
        }
      })
    },
    handleSubmit() {
      if (!this.formData.content.trim()) {
        return uni.showToast({ title: '请输入内容', icon: 'none' })
      }
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
.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

.nav-bar {
  background-color: #FFFFFF;

  .nav-content {
    position: relative;
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 24rpx;

    .nav-cancel {
      font-size: 30rpx;
      color: #666666;
      z-index: 10;
    }

    .nav-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 34rpx;
      color: #333333;
      font-weight: 600;
    }
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

    &::after {
      border: none;
    }
  }
}

.form-section {
  padding: 24rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;

  .content-input {
    width: 100%;
    min-height: 200rpx;
    font-size: 30rpx;
    color: #333333;
    line-height: 1.6;
  }

  .content-count {
    display: block;
    text-align: right;
    font-size: 24rpx;
    color: #999999;
    margin-top: 16rpx;
  }
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .image-item {
    position: relative;
    width: 200rpx;
    height: 200rpx;

    .preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }

    .delete-btn {
      position: absolute;
      top: -16rpx;
      right: -16rpx;
      width: 40rpx;
      height: 40rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      color: #FFFFFF;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .add-image {
    width: 200rpx;
    height: 200rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;

    .add-text {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F5F5F5;

  .item-label {
    font-size: 30rpx;
    color: #333333;
  }

  .item-value {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #333333;

    .placeholder {
      color: #999999;
    }
  }
}
</style>
