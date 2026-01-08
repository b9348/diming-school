<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布投票</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 投票标题 -->
      <view class="form-section">
        <text class="section-title">投票标题</text>
        <view class="input-box">
          <textarea
            class="content-input"
            v-model="formData.title"
            placeholder="输入投票标题"
            :maxlength="200"
          ></textarea>
        </view>
      </view>

      <!-- 投票主图片 -->
      <view class="form-section">
        <text class="section-title">投票图片（最多9张）</text>
        <view class="input-box">
          <view class="image-upload-area">
            <view v-for="(img, index) in formData.images" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="removeImage(index)">
                <uni-icons type="close" size="14" color="#FFFFFF"></uni-icons>
              </view>
            </view>
            <view v-if="formData.images.length < 9" class="add-image" @click="chooseImages">
              <uni-icons type="plusempty" size="32" color="#CCCCCC"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 投票选项 -->
      <view class="form-section">
        <text class="section-title">投票选项</text>
        <view v-for="(opt, index) in formData.options" :key="index" class="option-item">
          <view class="option-input-box">
            <input class="option-input" v-model="opt.text" placeholder="输入选项名称" />
          </view>
          <view class="option-actions">
            <view class="action-btn" @click="deleteOption(index)">
              <uni-icons type="minus" size="20" color="#999999"></uni-icons>
            </view>
            <view class="action-btn" @click="chooseOptionImage(index)">
              <image v-if="opt.image" :src="opt.image" class="option-image-preview" mode="aspectFill" />
              <uni-icons v-else type="image" size="20" color="#999999"></uni-icons>
            </view>
          </view>
        </view>
        <view class="add-option" @click="addOption">
          <uni-icons type="plusempty" size="24" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 投票类型 -->
      <view class="form-section">
        <text class="section-title">投票类型</text>
        <view class="type-selector">
          <view
            class="type-option"
            :class="{ active: formData.type === 'single' }"
            @click="formData.type = 'single'"
          >
            <text>单选（默认）</text>
          </view>
          <view
            class="type-option"
            :class="{ active: formData.type === 'multiple' }"
            @click="formData.type = 'multiple'"
          >
            <text>多选</text>
          </view>
        </view>
      </view>

      <!-- 隐藏信息 -->
      <view class="form-section">
        <text class="section-title">隐藏信息（仅投票人可见）</text>
        <view class="input-box">
          <view class="image-upload-area">
            <view v-for="(img, index) in formData.hiddenImages" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="removeHiddenImage(index)">
                <uni-icons type="close" size="14" color="#FFFFFF"></uni-icons>
              </view>
            </view>
            <view v-if="formData.hiddenImages.length < 9" class="add-image" @click="chooseHiddenImages">
              <uni-icons type="plusempty" size="32" color="#CCCCCC"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 投票截止时间 -->
      <view class="form-section">
        <text class="section-title">投票截止时间</text>
        <picker mode="date" :value="formData.deadline" @change="onDeadlineChange">
          <view class="time-input-box">
            <text :class="['time-text', { placeholder: !formData.deadline }]">
              {{ formData.deadline || '点击选择截止时间' }}
            </text>
          </view>
        </picker>
      </view>

      <!-- 预约投票开始时间 -->
      <view class="form-section">
        <text class="section-title">预约投票开始时间（默认发布后开始）</text>
        <picker mode="date" :value="formData.startTime" @change="onStartTimeChange">
          <view class="time-input-box">
            <text :class="['time-text', { placeholder: !formData.startTime }]">
              {{ formData.startTime || '点击选择开始时间' }}
            </text>
          </view>
        </picker>
      </view>

      <!-- 可见范围 -->
      <view class="form-section">
        <view class="visibility-tabs">
          <view
            class="visibility-tab"
            :class="{ active: formData.visibilityType === 'campus' }"
            @click="formData.visibilityType = 'campus'"
          >
            <text>可见校区</text>
          </view>
          <view
            class="visibility-tab"
            :class="{ active: formData.visibilityType === 'school' }"
            @click="formData.visibilityType = 'school'"
          >
            <text>可见学校</text>
          </view>
        </view>
        <view class="visibility-options">
          <view
            v-for="(option, index) in visibilityOptions"
            :key="index"
            class="visibility-option"
            :class="{ active: formData.visibilityValue === option.value }"
            @click="formData.visibilityValue = option.value"
          >
            <text>{{ option.label }}</text>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
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
      scrollHeight: 0,
      formData: {
        title: '',
        images: [],
        options: [
          { text: '', image: '' },
          { text: '', image: '' },
          { text: '', image: '' },
          { text: '', image: '' }
        ],
        type: 'single',
        hiddenImages: [],
        deadline: '',
        startTime: '',
        visibilityType: 'campus',
        visibilityValue: 'all'
      },
      visibilityOptions: [
        { label: '外校', value: 'other' },
        { label: '全国', value: 'all' },
        { label: '滴水湖大学城', value: 'dishui' }
      ]
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
    this.calcScrollHeight()
  },
  methods: {
    calcScrollHeight() {
      const systemInfo = uni.getSystemInfoSync()
      const navBarHeight = uni.upx2px(88)
      const submitBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navBarHeight - submitBarHeight
    },
    goBack() {
      uni.navigateBack()
    },
    addOption() {
      if (this.formData.options.length < 10) {
        this.formData.options.push({ text: '', image: '' })
      }
    },
    deleteOption(index) {
      if (this.formData.options.length > 2) {
        this.formData.options.splice(index, 1)
      } else {
        uni.showToast({ title: '至少保留2个选项', icon: 'none' })
      }
    },
    chooseImages() {
      const remaining = 9 - this.formData.images.length
      if (remaining <= 0) return
      uni.chooseImage({
        count: remaining,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData.images = [...this.formData.images, ...res.tempFilePaths]
        }
      })
    },
    removeImage(index) {
      this.formData.images.splice(index, 1)
    },
    chooseOptionImage(index) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData.options[index].image = res.tempFilePaths[0]
        }
      })
    },
    chooseHiddenImages() {
      const remaining = 9 - this.formData.hiddenImages.length
      if (remaining <= 0) return
      uni.chooseImage({
        count: remaining,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData.hiddenImages = [...this.formData.hiddenImages, ...res.tempFilePaths]
        }
      })
    },
    removeHiddenImage(index) {
      this.formData.hiddenImages.splice(index, 1)
    },
    onDeadlineChange(e) {
      this.formData.deadline = e.detail.value
    },
    onStartTimeChange(e) {
      this.formData.startTime = e.detail.value
    },
    handleSubmit() {
      if (!this.formData.title.trim()) {
        return uni.showToast({ title: '请输入投票标题', icon: 'none' })
      }
      const validOptions = this.formData.options.filter(o => o.text.trim())
      if (validOptions.length < 2) {
        return uni.showToast({ title: '至少需要2个有效选项', icon: 'none' })
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
    .nav-cancel { font-size: 30rpx; color: #666666; z-index: 10; }
    .nav-title { position: absolute; left: 50%; transform: translateX(-50%); font-size: 34rpx; color: #333333; font-weight: 600; }
  }
}

.form-scroll {
  padding: 24rpx;
  box-sizing: border-box;
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

.form-section {
  margin-bottom: 24rpx;
  .section-title {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
  }
}

.input-box {
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 20rpx;
  background: #FFFFFF;
  .content-input {
    width: 100%;
    min-height: 120rpx;
    font-size: 28rpx;
    color: #333;
  }
}

// 投票选项
.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  .option-input-box {
    flex: 1;
    border: 1rpx solid #E5E5E5;
    border-radius: 8rpx;
    background: #FFFFFF;
    .option-input {
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
  .option-actions {
    display: flex;
    align-items: center;
    margin-left: 16rpx;
    gap: 12rpx;
  }
  .action-btn {
    width: 64rpx;
    height: 64rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 50%;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .option-image-preview {
      width: 100%;
      height: 100%;
    }
  }
}

.add-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  margin: 0 auto;
  border: 1rpx solid #E5E5E5;
  border-radius: 50%;
  background: #FFFFFF;
}

// 投票类型
.type-selector {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;
  .type-option {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #666;
    background: #FFFFFF;
    border-right: 1rpx solid #E5E5E5;
    &:last-child { border-right: none; }
    &.active {
      color: #333;
      font-weight: 500;
    }
  }
}

// 图片上传
.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  .image-item {
    position: relative;
    width: 120rpx;
    height: 120rpx;
    .preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }
    .delete-btn {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      width: 32rpx;
      height: 32rpx;
      background: rgba(0,0,0,0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .add-image {
    width: 120rpx;
    height: 120rpx;
    border: 1rpx dashed #CCCCCC;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 时间选择
.time-input-box {
  height: 80rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  .time-text {
    font-size: 26rpx;
    color: #333;
    &.placeholder { color: #999; }
  }
}

// 可见范围
.visibility-tabs {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  .visibility-tab {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #666;
    background: #FFFFFF;
    border-right: 1rpx solid #E5E5E5;
    &:last-child { border-right: none; }
    &.active {
      color: #333;
      font-weight: 500;
    }
  }
}

.visibility-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  .visibility-option {
    padding: 16rpx 28rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #666;
    background: #FFFFFF;
    &.active {
      border-color: #007AFF;
      color: #007AFF;
    }
  }
}
</style>
