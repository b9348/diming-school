<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-inner">
        <view class="navbar-left" @click="goBack">
          <text class="tn-icon-left" style="font-size: 18px; color: #333333;"></text>
        </view>
        <text class="navbar-title">身份认证</text>
        <view class="navbar-right"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 认证状态 -->
      <view class="verify-status" v-if="verifyInfo.status">
        <view class="status-icon-box" :class="statusClass">
          <image class="status-icon" :src="statusIcon" mode="aspectFit"></image>
        </view>
        <text class="status-text">{{ statusText }}</text>
        <text v-if="verifyInfo.status === 'rejected' && verifyInfo.reason" class="reject-reason">
          驳回原因：{{ verifyInfo.reason }}
        </text>
      </view>

      <!-- 认证说明 -->
      <view class="verify-desc">
        <text class="desc-text">上传真实身份认证信息，提升个人可信度</text>
        <text class="desc-text">认证信息仅供审核使用，平台严格对外保密</text>
      </view>

      <!-- 认证表单 -->
      <view class="verify-form">
        <!-- 学校 -->
        <view class="form-item school-item">
          <input
            class="school-input"
            v-model="formData.school"
            placeholder="请输入学校"
            :disabled="isVerified"
          />
        </view>

        <!-- 学号和专业 -->
        <view class="form-item info-box">
          <input
            class="info-input"
            v-model="formData.studentId"
            placeholder="学号"
            :disabled="isVerified"
          />
          <view class="divider"></view>
          <input
            class="info-input"
            v-model="formData.major"
            placeholder="专业"
            :disabled="isVerified"
          />
        </view>

        <!-- 学生证照片 -->
        <view class="form-item upload-item">
          <view class="upload-area">
            <view
              class="upload-box"
              v-for="(item, index) in studentCardImages"
              :key="index"
              @click="previewImage(index)"
            >
              <image class="upload-img" :src="item" mode="aspectFill"></image>
              <view class="delete-btn" @click.stop="deleteImage(index)" v-if="!isVerified">
                <text class="tn-icon-close" style="font-size: 12px; color: #FFFFFF;"></text>
              </view>
            </view>
            <view
              class="upload-box add-box"
              @click="chooseImage"
              v-if="studentCardImages.length === 0 && !isVerified"
            >
              <text class="tn-icon-plus" style="font-size: 40px; color: #999999;"></text>
            </view>
          </view>
          <text class="upload-tip">仅支持学生证（塑料卡）、毕业证、录取通知书认证</text>
          <text class="example-link" @click="viewExample">查看示例 ></text>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-btn-box" v-if="!isVerified">
        <button class="submit-btn" @click="submitVerify">提交认证</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      verifyInfo: {
        status: '', // pending: 审核中, approved: 已通过, rejected: 已驳回
        reason: ''
      },
      formData: {
        school: '',
        studentId: '',
        major: '',
      },
      studentCardImages: []
    }
  },
  computed: {
    isVerified() {
      return this.verifyInfo.status === 'approved'
    },
    statusClass() {
      const classMap = {
        pending: 'status-pending',
        approved: 'status-approved',
        rejected: 'status-rejected'
      }
      return classMap[this.verifyInfo.status] || ''
    },
    statusIcon() {
      const iconMap = {
        pending: 'https://iph.href.lu/50x50?text=⏰',
        approved: 'https://iph.href.lu/50x50?text=✓',
        rejected: 'https://iph.href.lu/50x50?text=✗'
      }
      return iconMap[this.verifyInfo.status] || ''
    },
    statusText() {
      const textMap = {
        pending: '认证审核中，请耐心等待',
        approved: '认证已通过',
        rejected: '认证未通过'
      }
      return textMap[this.verifyInfo.status] || ''
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadVerifyInfo()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navbarHeight = uni.upx2px(88)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navbarHeight
    },
    loadVerifyInfo() {
      // TODO: 从接口加载认证信息
      // this.verifyInfo = {
      //   status: 'pending',
      //   reason: ''
      // }
    },
    goBack() {
      uni.navigateBack()
    },
    chooseImage() {
      const count = 3 - this.studentCardImages.length
      uni.chooseImage({
        count,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.studentCardImages.push(...res.tempFilePaths)
        }
      })
    },
    previewImage(index) {
      uni.previewImage({
        urls: this.studentCardImages,
        current: index
      })
    },
    deleteImage(index) {
      this.studentCardImages.splice(index, 1)
    },
    viewExample() {
      // TODO: 显示示例图片
      uni.showToast({ title: '查看示例功能开发中', icon: 'none' })
    },
    validateForm() {
      if (!this.formData.school) {
        uni.showToast({ title: '请输入学校', icon: 'none' })
        return false
      }
      if (!this.formData.studentId) {
        uni.showToast({ title: '请输入学号', icon: 'none' })
        return false
      }
      if (!this.formData.major) {
        uni.showToast({ title: '请输入专业', icon: 'none' })
        return false
      }
      if (this.studentCardImages.length === 0) {
        uni.showToast({ title: '请上传学生证照片', icon: 'none' })
        return false
      }
      return true
    },
    submitVerify() {
      if (!this.validateForm()) {
        return
      }

      uni.showModal({
        title: '提示',
        content: '请确认信息无误，提交后将进入审核流程',
        success: (res) => {
          if (res.confirm) {
            this.doSubmit()
          }
        }
      })
    },
    doSubmit() {
      // TODO: 调用接口提交认证
      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '提交成功，等待审核', icon: 'success' })
        this.verifyInfo.status = 'pending'
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

.navbar {
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #EEEEEE;

  .navbar-inner {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;

    .navbar-left, .navbar-right {
      width: 120rpx;
    }

    .navbar-title {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      color: #333333;
      font-weight: 600;
    }
  }
}

.scroll-container {
  padding: 20rpx 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  box-sizing: border-box;
}

.verify-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;

  .status-icon-box {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24rpx;

    &.status-pending {
      background-color: #FFF3E0;
    }

    &.status-approved {
      background-color: #E8F5E9;
    }

    &.status-rejected {
      background-color: #FFEBEE;
    }

    .status-icon {
      width: 64rpx;
      height: 64rpx;
    }
  }

  .status-text {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
    margin-bottom: 12rpx;
  }

  .reject-reason {
    font-size: 26rpx;
    color: #F44336;
    text-align: center;
    line-height: 1.6;
  }
}

.verify-desc {
  text-align: center;
  padding: 40rpx 48rpx;
  margin-bottom: 40rpx;

  .desc-text {
    display: block;
    font-size: 26rpx;
    color: #666666;
    line-height: 1.8;
  }
}

.verify-form {
  padding: 0;
  margin-bottom: 20rpx;

  .form-item {
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }

    &.school-item {
      .school-input {
        width: 100%;
        height: 88rpx;
        padding: 0 32rpx;
        font-size: 28rpx;
        color: #333333;
        background-color: #FFFFFF;
        border: 2rpx solid #E5E5E5;
        border-radius: 44rpx;
        box-sizing: border-box;
      }
    }

    &.info-box {
      background-color: #FFFFFF;
      border: 2rpx solid #E5E5E5;
      border-radius: 16rpx;
      padding: 0;
      overflow: hidden;

      .info-input {
        width: 100%;
        height: 88rpx;
        padding: 0 32rpx;
        font-size: 28rpx;
        color: #333333;
        background-color: transparent;
        box-sizing: border-box;
      }

      .divider {
        width: 100%;
        height: 1rpx;
        background-color: #E5E5E5;
      }
    }

    &.upload-item {
      margin-bottom: 0;

      .upload-area {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 24rpx;

        .upload-box {
          position: relative;
          width: 100%;
          height: 420rpx;
          border: 2rpx solid #E5E5E5;
          border-radius: 16rpx;
          overflow: hidden;

          .upload-img {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }

          .delete-btn {
            position: absolute;
            top: 16rpx;
            right: 16rpx;
            width: 48rpx;
            height: 48rpx;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .add-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF;
        }
      }

      .upload-tip {
        display: block;
        font-size: 24rpx;
        color: #999999;
        text-align: center;
        margin-bottom: 12rpx;
      }

      .example-link {
        display: block;
        font-size: 24rpx;
        color: #666666;
        text-align: center;
        text-decoration: none;
      }
    }
  }
}

.submit-btn-box {
  padding: 40rpx 0;

  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
    border-radius: 44rpx;
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 600;
    border: none;
    box-sizing: border-box;

    &::after {
      border: none;
    }
  }
}
</style>
