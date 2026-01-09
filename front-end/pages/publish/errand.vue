<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布跑腿</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 写明要帮做的事 -->
      <view class="form-section">
        <text class="section-title">写明要帮做的事</text>
        <view class="input-box">
          <textarea
            class="content-input"
            v-model="formData.content"
            placeholder="请详细描述您的需求..."
            :maxlength="500"
          ></textarea>
          <view class="image-upload-area">
            <view v-for="(img, index) in formData.images" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="deleteImage(index)">
                <text class="tn-icon-close" style="font-size: 14px; color: #FFFFFF;"></text>
              </view>
            </view>
            <view v-if="formData.images.length < 9" class="add-image" @click="chooseImage">
              <text class="tn-icon-add" style="font-size: 32px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 隐藏信息（仅抢单人可见） -->
      <view class="form-section">
        <text class="section-title">隐藏信息（仅抢单人可见）</text>
        <view class="input-box">
          <textarea
            class="content-input"
            v-model="formData.hiddenInfo"
            placeholder="填写仅抢单人可见的信息，如取件码、详细地址等..."
            :maxlength="500"
          ></textarea>
          <view class="image-upload-area">
            <view v-for="(img, index) in formData.hiddenImages" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="deleteHiddenImage(index)">
                <text class="tn-icon-close" style="font-size: 14px; color: #FFFFFF;"></text>
              </view>
            </view>
            <view v-if="formData.hiddenImages.length < 9" class="add-image" @click="chooseHiddenImage">
              <text class="tn-icon-add" style="font-size: 32px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 完成时间（2选1） -->
      <view class="form-section">
        <text class="section-title">完成时间（2选1）</text>
        <view class="time-selector">
          <view
            class="time-option"
            :class="{ active: formData.timeType === 'hours' }"
            @click="formData.timeType = 'hours'"
          >
            <text>小时内</text>
          </view>
          <view
            class="time-option"
            :class="{ active: formData.timeType === 'deadline' }"
            @click="formData.timeType = 'deadline'"
          >
            <text>指定时间前</text>
          </view>
        </view>
        <view class="time-input-box">
          <input
            v-if="formData.timeType === 'hours'"
            class="time-input"
            type="digit"
            v-model="formData.hours"
            placeholder="默认选左边且默认值为24小时，可为小数"
          />
          <picker
            v-else
            mode="date"
            :value="formData.deadline"
            @change="onDeadlineChange"
          >
            <view class="time-input picker-input">
              {{ formData.deadline || '点击选择截止日期' }}
            </view>
          </picker>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <view class="contact-header">
          <text class="section-title-inline">联系方式</text>
          <view class="contact-types">
            <text
              class="contact-type"
              :class="{ active: formData.contactTypes.includes('phone') }"
              @click="toggleContactType('phone')"
            >手机号</text>
            <text
              class="contact-type"
              :class="{ active: formData.contactTypes.includes('wechat') }"
              @click="toggleContactType('wechat')"
            >微信号</text>
            <text
              class="contact-type"
              :class="{ active: formData.contactTypes.includes('qq') }"
              @click="toggleContactType('qq')"
            >QQ号</text>
          </view>
        </view>
        <view class="contact-input-box">
          <input
            class="contact-input"
            v-model="formData.contactValue"
            placeholder="自动同步个人资料里的联系方式，如有误可修改"
          />
        </view>
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
        hiddenInfo: '',
        hiddenImages: [],
        timeType: 'hours',
        hours: '24',
        deadline: '',
        contactTypes: ['phone'],
        contactValue: '',
        visibilityType: 'campus',
        visibilityValue: 'all'
      },
      visibilityOptions: [
        { label: '外校', value: 'other' },
        { label: '全国', value: 'all' },
        { label: '滴水湖大学城', value: 'dishui' },
        { label: '指定', value: 'specify' },
        { label: '全区', value: 'district' },
        { label: '全市', value: 'city' },
        { label: '全省', value: 'province' },
        { label: '华东', value: 'east' },
        { label: '华中', value: 'central' },
        { label: '西南', value: 'southwest' },
        { label: '华南', value: 'south' },
        { label: '东北', value: 'northeast' },
        { label: '华北', value: 'north' },
        { label: '西北', value: 'northwest' }
      ]
    }
  },
  methods: {
    calcRightSafeArea() {
      // #ifdef MP-WEIXIN
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const systemInfo = uni.getWindowInfo()
      this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left + 10
      // #endif
    },
    calcScrollHeight() {
      const systemInfo = uni.getWindowInfo()
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
    chooseHiddenImage() {
      uni.chooseImage({
        count: 9 - this.formData.hiddenImages.length,
        success: (res) => {
          this.formData.hiddenImages = [...this.formData.hiddenImages, ...res.tempFilePaths]
        }
      })
    },
    deleteHiddenImage(index) {
      this.formData.hiddenImages.splice(index, 1)
    },
    onDeadlineChange(e) {
      this.formData.deadline = e.detail.value
    },
    toggleContactType(type) {
      const index = this.formData.contactTypes.indexOf(type)
      if (index > -1) {
        if (this.formData.contactTypes.length > 1) {
          this.formData.contactTypes.splice(index, 1)
        }
      } else {
        this.formData.contactTypes.push(type)
      }
    },
    handleSubmit() {
      if (!this.formData.content.trim()) {
        return uni.showToast({ title: '请输入任务描述', icon: 'none' })
      }
      uni.showLoading({ title: '发布中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '发布成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1500)
      }, 1000)
    },
    initPage() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      this.calcRightSafeArea()
      this.calcScrollHeight()
    }
  },
  onLoad() {
    this.initPage()
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

    &::after {
      border: none;
    }
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

.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;

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

.time-selector {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;

  .time-option {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #666;
    background: #FFFFFF;
    border-right: 1rpx solid #E5E5E5;

    &:last-child {
      border-right: none;
    }

    &.active {
      color: #333;
      font-weight: 500;
    }
  }
}

.time-input-box {
  margin-top: 16rpx;

  .time-input {
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 26rpx;
    color: #999;
    background: #FFFFFF;
    box-sizing: border-box;
  }

  .picker-input {
    display: flex;
    align-items: center;
  }
}

.contact-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  .section-title-inline {
    font-size: 28rpx;
    color: #333;
    margin-right: 20rpx;
  }

  .contact-types {
    display: flex;
    gap: 20rpx;

    .contact-type {
      font-size: 26rpx;
      color: #999;

      &.active {
        color: #333;
      }
    }
  }
}

.contact-input-box {
  .contact-input {
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #E5E5E5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 26rpx;
    color: #999;
    background: #FFFFFF;
    box-sizing: border-box;
  }
}

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

    &:last-child {
      border-right: none;
    }

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
