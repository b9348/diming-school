<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">编辑资料</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 头像 -->
      <view class="profile-item">
        <text class="item-label">头像</text>
        <view class="item-right" @click="chooseAvatar">
          <image class="avatar-img" :src="userInfo.avatar" mode="aspectFill"></image>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="profile-item">
        <text class="item-label">昵称</text>
        <view class="item-right">
          <input
            class="item-input"
            v-model="userInfo.nickname"
            placeholder="请输入昵称"
            maxlength="20"
          />
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 性别 -->
      <view class="profile-item" @click="showGenderPicker = true">
        <text class="item-label">性别</text>
        <view class="item-right">
          <text class="item-value">{{ genderText }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 生日 -->
      <view class="profile-item">
        <text class="item-label">生日</text>
        <view class="item-right">
          <picker mode="date" :value="userInfo.birthday" @change="onBirthdayChange">
            <view class="picker-view">
              <text class="item-value">{{ userInfo.birthday || '请选择' }}</text>
              <uni-icons type="right" size="14" color="#999999"></uni-icons>
            </view>
          </picker>
        </view>
      </view>

      <!-- 学校 -->
      <view class="profile-item">
        <text class="item-label">学校</text>
        <view class="item-right">
          <input
            class="item-input"
            v-model="userInfo.school"
            placeholder="请输入学校"
            maxlength="30"
          />
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 专业 -->
      <view class="profile-item">
        <text class="item-label">专业</text>
        <view class="item-right">
          <input
            class="item-input"
            v-model="userInfo.major"
            placeholder="请输入专业"
            maxlength="30"
          />
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 个性签名 -->
      <view class="profile-item textarea-item">
        <text class="item-label">个性签名</text>
        <view class="item-right full-width">
          <textarea
            class="item-textarea"
            v-model="userInfo.signature"
            placeholder="写下你的个性签名..."
            maxlength="100"
            auto-height
          />
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="save-btn" @click="saveProfile">保存</view>
    </scroll-view>

    <!-- 性别选择器 -->
    <uni-popup ref="genderPopup" type="bottom">
      <view class="gender-picker">
        <view class="picker-header">
          <text class="picker-cancel" @click="showGenderPicker = false">取消</text>
          <text class="picker-title">选择性别</text>
          <text class="picker-confirm" @click="confirmGender">确定</text>
        </view>
        <view class="gender-options">
          <view
            class="gender-option"
            v-for="item in genderOptions"
            :key="item.value"
            :class="{ active: tempGender === item.value }"
            @click="tempGender = item.value"
          >
            <text class="option-text">{{ item.label }}</text>
            <uni-icons v-if="tempGender === item.value" type="checkmarkempty" size="20" color="#007AFF"></uni-icons>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      userInfo: {
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '',
        gender: '',
        birthday: '',
        school: '',
        major: '',
        signature: ''
      },
      showGenderPicker: false,
      tempGender: '',
      genderOptions: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '保密', value: 'secret' }
      ]
    }
  },
  computed: {
    genderText() {
      const item = this.genderOptions.find(g => g.value === this.userInfo.gender)
      return item ? item.label : '请选择'
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadUserInfo()
  },
  watch: {
    showGenderPicker(val) {
      if (val) {
        this.tempGender = this.userInfo.gender
      }
    }
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navbarHeight = uni.upx2px(88)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navbarHeight
    },
    loadUserInfo() {
      // TODO: 从接口加载用户信息
      this.userInfo = {
        avatar: 'https://iph.href.lu/100x100?text=头像',
        nickname: '张三',
        gender: 'male',
        birthday: '2000-01-01',
        school: '某某大学',
        major: '计算机科学与技术',
        signature: '这是一条个性签名...'
      }
    },
    goBack() {
      uni.navigateBack()
    },
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0]
          // TODO: 上传头像
        }
      })
    },
    onBirthdayChange(e) {
      this.userInfo.birthday = e.detail.value
    },
    confirmGender() {
      this.userInfo.gender = this.tempGender
      this.showGenderPicker = false
    },
    saveProfile() {
      // 验证必填项
      if (!this.userInfo.nickname) {
        uni.showToast({ title: '请输入昵称', icon: 'none' })
        return
      }

      // TODO: 调用接口保存
      uni.showLoading({ title: '保存中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
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

.scroll-container {
  padding: 20rpx 0;
}

.profile-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  padding-right: calc(24rpx + env(safe-area-inset-right));
  padding-left: calc(24rpx + env(safe-area-inset-left));
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F5F5F5;

  &.textarea-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-label {
    font-size: 30rpx;
    color: #333333;
    flex-shrink: 0;
  }

  .item-right {
    display: flex;
    align-items: center;
    gap: 8rpx;

    &.full-width {
      width: 100%;
      margin-top: 20rpx;
    }

    .avatar-img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }

    .item-input {
      flex: 1;
      font-size: 28rpx;
      color: #333333;
      text-align: right;
      min-width: 200rpx;
    }

    .item-textarea {
      width: 100%;
      min-height: 120rpx;
      font-size: 28rpx;
      color: #333333;
      line-height: 1.6;
    }

    .item-value {
      font-size: 28rpx;
      color: #999999;
    }

    .picker-view {
      display: flex;
      align-items: center;
      gap: 8rpx;
    }
  }
}

.save-btn {
  margin: 40rpx 24rpx;
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

.gender-picker {
  background-color: #FFFFFF;
  border-radius: 32rpx 32rpx 0 0;

  .picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx;
    border-bottom: 1rpx solid #F5F5F5;

    .picker-cancel, .picker-confirm {
      font-size: 28rpx;
      color: #007AFF;
    }

    .picker-title {
      font-size: 32rpx;
      color: #333333;
      font-weight: 600;
    }
  }

  .gender-options {
    .gender-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      border-bottom: 1rpx solid #F5F5F5;

      &.active {
        .option-text {
          color: #007AFF;
        }
      }

      .option-text {
        font-size: 30rpx;
        color: #333333;
      }
    }
  }
}
</style>
