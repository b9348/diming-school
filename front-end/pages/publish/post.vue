<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
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
              <text class="tn-icon-close" style="font-size: 18px; color: #FFFFFF;"></text>
            </view>
          </view>
          <view v-if="formData.images.length < 9" class="add-image" @click="chooseImage">
            <text class="tn-icon-add" style="font-size: 40px; color: #999999;"></text>
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
          <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
        </view>
      </view>

      <!-- 位置选择 -->
      <view class="form-item" @click="chooseLocation">
        <text class="item-label">添加位置</text>
        <view class="item-value">
          <text v-if="formData.location">{{ formData.location }}</text>
          <text v-else class="placeholder">选择位置</text>
          <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
        </view>
      </view>

      <!-- 可见范围 -->
      <view class="form-item" @click="showVisiblePicker = true">
        <text class="item-label">可见范围</text>
        <view class="item-value">
          <text>{{ currentVisibleLabel || '请选择' }}</text>
          <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
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
          <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
        </view>
      </view>

      <!-- 底部占位,防止内容被按钮遮挡 -->
      <view style="height: 120rpx;"></view>
    </scroll-view>

    <!-- 可见范围选择器 -->
    <view v-if="showVisiblePicker" class="picker-mask" @click="showVisiblePicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择可见范围</text>
          <text class="picker-close" @click="showVisiblePicker = false">✕</text>
        </view>

        <!-- 搜索栏 -->
        <view class="picker-search">
          <view class="search-box">
            <text class="tn-icon-search" style="font-size: 16px; color: #999999;"></text>
            <input
              v-model="visibleKeyword"
              type="text"
              placeholder="搜索地区"
              @input="handleVisibleSearch"
            />
          </view>
        </view>

        <view class="picker-body">
          <!-- 基础可见范围 -->
          <view class="picker-section">
            <text class="section-title">基础范围</text>
            <view
              v-for="item in baseVisibleOptions"
              :key="item.value"
              class="picker-item"
              :class="{ active: formData.visibleType === item.type && formData.visibleValue === item.value }"
              @click="selectVisible(item)"
            >
              <text class="picker-item-name">{{ item.name }}</text>
              <text v-if="formData.visibleType === item.type && formData.visibleValue === item.value" class="picker-check">✓</text>
            </view>
          </view>

          <!-- 指定地区可见 -->
          <view class="picker-section">
            <text class="section-title">指定地区</text>
            <view
              v-for="region in filteredRegions"
              :key="region.id"
              class="picker-item"
              :class="{ active: formData.visibleType === 'region' && formData.visibleValue === region.id }"
              @click="selectRegionVisible(region)"
            >
              <text class="picker-item-name">{{ region.name }}可见</text>
              <text v-if="formData.visibleType === 'region' && formData.visibleValue === region.id" class="picker-check">✓</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部发布按钮 -->
    <view class="submit-bar">
      <button class="submit-btn" @click="handleSubmit">发布</button>
    </view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { regionApi, configApi } from '@/api/index.js'

export default {
  mixins: [pageBaseMixin],
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
        visibleType: 'all',
        visibleValue: 'all',
        anonymous: false,
        topType: 0
      },
      baseVisibleOptions: [
        { name: '全国可见', type: 'all', value: 'all' },
        { name: '本城市可见', type: 'city', value: 'current' },
        { name: '本校区可见', type: 'school', value: 'current' },
        { name: '外校可见', type: 'other', value: 'other' }
      ],
      regionList: [],
      visibleKeyword: '',
      topOptions: [],
      showTopicPicker: false,
      showVisiblePicker: false,
      showTopPicker: false
    }
  },
  computed: {
    currentVisibleLabel() {
      // 先检查基础可见范围
      const baseOption = this.baseVisibleOptions.find(
        item => item.type === this.formData.visibleType && item.value === this.formData.visibleValue
      )
      if (baseOption) return baseOption.name

      // 再检查指定地区
      if (this.formData.visibleType === 'region') {
        const region = this.regionList.find(r => r.id === this.formData.visibleValue)
        return region ? `${region.name}可见` : '请选择'
      }

      return '请选择'
    },
    filteredRegions() {
      if (!this.visibleKeyword) return this.regionList
      return this.regionList.filter(item => item.name.includes(this.visibleKeyword))
    }
  },
  onLoad() {
    const systemInfo = uni.getWindowInfo()
    this.statusBarHeight = systemInfo.statusBarHeight
    this.calcRightSafeArea()
    this.calcScrollHeight()
    this.loadRegionList()
    this.loadTopPricing()
  },
  methods: {
    async loadRegionList() {
      try {
        const data = await regionApi.getList()
        this.regionList = (data || []).filter(item => item.id !== 0)
      } catch (e) {
        console.error('加载地区列表失败', e)
        this.regionList = []
      }
    },
    async loadTopPricing() {
      try {
        const data = await configApi.getTopPricing('post')
        this.topOptions = (data || []).map(item => {
          if (item.days === 0) return item.label
          return `${item.label}(¥${item.price})`
        })
      } catch (e) {
        this.topOptions = ['不置顶', '置顶1天(¥5)', '置顶3天(¥12)', '置顶7天(¥25)']
      }
    },
    calcRightSafeArea() {
      // #ifdef MP-WEIXIN
      // 获取胶囊按钮位置信息
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      const systemInfo = uni.getWindowInfo()
      // 右侧安全距离 = 屏幕宽度 - 胶囊按钮左边界 + 间距
      this.rightSafeArea = systemInfo.windowWidth - menuButtonInfo.left + 10
      // #endif
    },
    calcScrollHeight() {
      const systemInfo = uni.getWindowInfo()
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
    selectVisible(item) {
      this.formData.visibleType = item.type
      this.formData.visibleValue = item.value
      this.showVisiblePicker = false
    },
    selectRegionVisible(region) {
      this.formData.visibleType = 'region'
      this.formData.visibleValue = region.id
      this.showVisiblePicker = false
    },
    handleVisibleSearch() {
      // 搜索由 computed 自动处理
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
@import '@/styles/dark-mode.scss';

.page-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: $dark-bg-primary;
  }
}

.nav-bar {
  background-color: #FFFFFF;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }

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
      transition: color 0.3s ease;

      .dark-mode & {
        color: $dark-text-secondary;
      }
    }

    .nav-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 34rpx;
      color: #333333;
      font-weight: 600;
      transition: color 0.3s ease;

      .dark-mode & {
        color: $dark-text-primary;
      }
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
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
    border-top-color: $dark-border;
  }

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
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }

  .content-input {
    width: 100%;
    min-height: 200rpx;
    font-size: 30rpx;
    color: #333333;
    line-height: 1.6;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }
  }

  .content-count {
    display: block;
    text-align: right;
    font-size: 24rpx;
    color: #999999;
    margin-top: 16rpx;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-tertiary;
    }
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
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
    border-bottom-color: $dark-border;
  }

  .item-label {
    font-size: 30rpx;
    color: #333333;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }
  }

  .item-value {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #333333;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }

    .placeholder {
      color: #999999;
      transition: color 0.3s ease;

      .dark-mode & {
        color: $dark-text-tertiary;
      }
    }
  }
}

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.picker-content {
  width: 100%;
  max-height: 70vh;
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-bottom-color: $dark-border;
  }
}

.picker-search {
  padding: 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-bottom-color: $dark-border;
  }

  .search-box {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    transition: background-color 0.3s ease;

    .dark-mode & {
      background-color: $dark-bg-tertiary;
    }

    input {
      flex: 1;
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #333333;
      transition: color 0.3s ease;

      .dark-mode & {
        color: $dark-text-primary;
      }
    }
  }
}

.picker-title {
  font-size: 32rpx;
  color: #333333;
  font-weight: 600;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.picker-close {
  font-size: 40rpx;
  color: #999999;
  line-height: 1;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-secondary;
  }
}

.picker-body {
  max-height: 60vh;
  overflow-y: auto;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.picker-section {
  margin-bottom: 24rpx;

  .section-title {
    display: block;
    padding: 24rpx 24rpx 16rpx;
    font-size: 26rpx;
    color: #999999;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-tertiary;
    }
  }
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    border-bottom-color: $dark-border;
  }

  &.active {
    background-color: #F8F8F8;

    .dark-mode & {
      background-color: $dark-bg-tertiary;
    }
  }
}

.picker-item-name {
  font-size: 30rpx;
  color: #333333;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.picker-check {
  font-size: 32rpx;
  color: #007AFF;
  font-weight: 600;
}
</style>
