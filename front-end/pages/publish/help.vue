<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布互助</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 描述需要帮助的事情 -->
      <view class="form-section">
        <text class="section-title">描述需要帮助的事情</text>
        <view class="content-box">
          <textarea
            class="content-input"
            v-model="formData.content"
            placeholder="详细描述你需要帮助的事情，如代取快递、代买东西、代排队等..."
            :maxlength="500"
          ></textarea>
          <view class="image-upload">
            <view v-for="(img, index) in formData.images" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="deleteImage('images', index)">
                <text class="tn-icon-close" style="font-size: 14px; color: #FFFFFF;"></text>
              </view>
            </view>
            <view v-if="formData.images.length < 9" class="add-image" @click="chooseImage('images')">
              <text class="tn-icon-add" style="font-size: 32px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 隐藏信息（仅接单人可见） -->
      <view class="form-section">
        <text class="section-title">隐藏信息（仅接单人可见）</text>
        <view class="content-box">
          <textarea
            class="content-input"
            v-model="formData.hiddenInfo"
            placeholder="可填写取货地点、取货码等敏感信息..."
            :maxlength="500"
          ></textarea>
          <view class="image-upload">
            <view v-for="(img, index) in formData.hiddenImages" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="deleteImage('hiddenImages', index)">
                <text class="tn-icon-close" style="font-size: 14px; color: #FFFFFF;"></text>
              </view>
            </view>
            <view v-if="formData.hiddenImages.length < 9" class="add-image" @click="chooseImage('hiddenImages')">
              <text class="tn-icon-add" style="font-size: 32px; color: #CCCCCC;"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 价格设置 -->
      <view class="form-section">
        <text class="section-title">价格设置</text>
        <view class="price-group">
          <view class="price-item">
            <text class="price-label">起拍价</text>
            <view class="price-input-box">
              <text class="price-unit">¥</text>
              <input class="price-input" type="digit" v-model="formData.startPrice" placeholder="0.00" />
            </view>
          </view>
          <view class="price-item">
            <text class="price-label">一口价（可选）</text>
            <view class="price-input-box">
              <text class="price-unit">¥</text>
              <input class="price-input" type="digit" v-model="formData.buyNowPrice" placeholder="不设置" />
            </view>
          </view>
        </view>
        <text class="price-tip">一口价：出价达到此价格直接成交，不设置则按竞拍结束时最低价成交</text>
      </view>

      <!-- 竞拍截止时间 -->
      <view class="form-section">
        <text class="section-title">竞拍截止时间</text>
        <view class="deadline-tabs">
          <view
            class="deadline-tab"
            :class="{ active: formData.deadlineType === 'hours' }"
            @click="formData.deadlineType = 'hours'"
          >
            <text>小时后</text>
          </view>
          <view
            class="deadline-tab"
            :class="{ active: formData.deadlineType === 'datetime' }"
            @click="formData.deadlineType = 'datetime'"
          >
            <text>指定时间</text>
          </view>
        </view>
        <view class="deadline-input-box">
          <input
            v-if="formData.deadlineType === 'hours'"
            class="deadline-input"
            type="digit"
            v-model="formData.deadlineHours"
            placeholder="24"
          />
          <picker
            v-else
            mode="date"
            :value="formData.deadlineDatetime"
            @change="onDeadlineChange"
          >
            <view class="deadline-input picker-input">
              {{ formData.deadlineDatetime || '选择日期' }}
            </view>
          </picker>
        </view>
        <text class="deadline-tip">竞拍结束后，出价最低者中标</text>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <view class="contact-header">
          <text class="section-title">联系方式</text>
          <view class="contact-types">
            <text class="contact-type" :class="{ active: formData.contactType === 'phone' }" @click="formData.contactType = 'phone'">手机号</text>
            <text class="contact-type" :class="{ active: formData.contactType === 'wechat' }" @click="formData.contactType = 'wechat'">微信号</text>
            <text class="contact-type" :class="{ active: formData.contactType === 'qq' }" @click="formData.contactType = 'qq'">QQ号</text>
          </view>
        </view>
        <view class="contact-input-box">
          <input
            class="contact-input"
            v-model="formData.contactValue"
            :placeholder="contactPlaceholder"
          />
        </view>
        <text class="contact-tip">这里自动同步个人资料里的联系方式，如有误可修改</text>
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
        <view class="visibility-tags">
          <view
            v-for="tag in visibilityOptions"
            :key="tag.value"
            class="visibility-tag"
            :class="{ active: formData.visibilityValue === tag.value }"
            @click="formData.visibilityValue = tag.value"
          >
            <text>{{ tag.label }}</text>
          </view>
        </view>
      </view>

      <!-- 置顶选项 -->
      <view class="form-section" @click="showTopPopup = true">
        <view class="top-option">
          <text class="section-title">置顶推广</text>
          <view class="top-value">
            <text v-if="formData.topHours">置顶{{ formData.topHours }}小时 ¥{{ getTopPrice(formData.topHours) }}</text>
            <text v-else class="placeholder">选择置顶时长（可选）</text>
            <text class="tn-icon-right" style="font-size: 14px; color: #999999;"></text>
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

    <!-- 置顶选择弹窗 -->
    <view class="popup-mask" v-if="showTopPopup" @click="showTopPopup = false"></view>
    <view class="top-popup" :class="{ show: showTopPopup }">
      <view class="popup-header">
        <text class="popup-title">选择置顶时长</text>
        <view class="popup-close" @click="showTopPopup = false">
          <text class="tn-icon-close" style="font-size: 20px; color: #999999;"></text>
        </view>
      </view>
      <view class="top-options">
        <view
          v-for="option in topOptions"
          :key="option.hours"
          class="top-option-item"
          :class="{ active: formData.topHours === option.hours }"
          @click="selectTopOption(option.hours)"
        >
          <view class="option-radio">
            <view class="radio-inner" v-if="formData.topHours === option.hours"></view>
          </view>
          <text class="option-text">置顶{{ option.hours }}小时</text>
          <text class="option-price">¥ {{ option.price }}</text>
        </view>
      </view>
      <view class="popup-footer">
        <button class="confirm-btn" @click="confirmTop">开始置顶</button>
      </view>
    </view>
  </view>
</template>

<script>
import pageBaseMixin from '@/mixins/page-base.js'

import { helpApi, configApi, regionApi } from '@/api/index.js'
import userStore from '@/store/user.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      showTopPopup: false,
      formData: {
        content: '',
        images: [],
        hiddenInfo: '',
        hiddenImages: [],
        startPrice: '',
        buyNowPrice: '',
        deadlineType: 'hours',
        deadlineHours: '24',
        deadlineDatetime: '',
        contactType: 'phone',
        contactValue: '',
        visibilityType: 'campus',
        visibilityValue: 'current',
        topHours: 0
      },
      visibilityOptions: [],
      topOptions: []
    }
  },
  computed: {
    contactPlaceholder() {
      const map = {
        phone: '请输入手机号',
        wechat: '请输入微信号',
        qq: '请输入QQ号'
      }
      return map[this.formData.contactType]
    }
  },
  onLoad() {
    this.initPage()
    this.loadUserContact()
    this.loadVisibilityOptions()
    this.loadTopPricing()
    this.loadDefaultHours()
  },
  methods: {
    initPage() {
      const windowInfo = uni.getWindowInfo()
      this.statusBarHeight = windowInfo.statusBarHeight
      const navBarHeight = uni.upx2px(88)
      const submitBarHeight = uni.upx2px(100)
      this.scrollHeight = windowInfo.windowHeight - this.statusBarHeight - navBarHeight - submitBarHeight
    },
    loadUserContact() {
      const userInfo = userStore.getUserInfo()
      if (userInfo.phone) {
        this.formData.contactValue = userInfo.phone
        this.formData.contactType = 'phone'
      }
    },
    async loadVisibilityOptions() {
      try {
        const data = await regionApi.getVisibleOptions()
        this.visibilityOptions = (data || []).map(item => ({
          label: item.label,
          value: item.value
        }))
      } catch (e) {
        this.visibilityOptions = [
          { label: '外校', value: 'other' },
          { label: '全国', value: 'all' },
          { label: '本校', value: 'campus' }
        ]
      }
    },
    async loadTopPricing() {
      try {
        const data = await configApi.getTopPricing('help')
        this.topOptions = data || []
      } catch (e) {
        this.topOptions = [
          { hours: 1, price: 8.8 },
          { hours: 2, price: 18.8 },
          { hours: 4, price: 28.8 },
          { hours: 6, price: 38.8 },
          { hours: 8, price: 48.8 },
          { hours: 12, price: 58.8 }
        ]
      }
    },
    async loadDefaultHours() {
      try {
        const data = await configApi.getDefaultHours('help')
        if (data && data.hours) {
          this.formData.deadlineHours = String(data.hours)
        }
      } catch (e) {
        // 保持默认值
      }
    },
    goBack() {
      uni.navigateBack()
    },
    chooseImage(field) {
      const maxCount = 9 - this.formData[field].length
      uni.chooseImage({
        count: maxCount,
        success: (res) => {
          this.formData[field] = [...this.formData[field], ...res.tempFilePaths]
        }
      })
    },
    deleteImage(field, index) {
      this.formData[field].splice(index, 1)
    },
    onDeadlineChange(e) {
      this.formData.deadlineDatetime = e.detail.value
    },
    getTopPrice(hours) {
      const option = this.topOptions.find(o => o.hours === hours)
      return option ? option.price : 0
    },
    selectTopOption(hours) {
      this.formData.topHours = this.formData.topHours === hours ? 0 : hours
    },
    confirmTop() {
      this.showTopPopup = false
    },
    async handleSubmit() {
      if (!this.formData.content.trim()) {
        return uni.showToast({ title: '请描述需要帮助的事情', icon: 'none' })
      }
      if (!this.formData.startPrice) {
        return uni.showToast({ title: '请输入起拍价', icon: 'none' })
      }
      if (!this.formData.contactValue.trim()) {
        return uni.showToast({ title: '请填写联系方式', icon: 'none' })
      }

      uni.showLoading({ title: '发布中...' })

      try {
        await helpApi.saveOrUpdate({
          content: this.formData.content,
          images: this.formData.images,
          hiddenInfo: this.formData.hiddenInfo,
          hiddenImages: this.formData.hiddenImages,
          startPrice: parseFloat(this.formData.startPrice),
          buyNowPrice: this.formData.buyNowPrice ? parseFloat(this.formData.buyNowPrice) : null,
          deadlineType: this.formData.deadlineType,
          deadlineHours: this.formData.deadlineType === 'hours' ? parseFloat(this.formData.deadlineHours || 24) : null,
          deadlineDatetime: this.formData.deadlineType === 'datetime' ? this.formData.deadlineDatetime : null,
          contactType: this.formData.contactType,
          contactValue: this.formData.contactValue,
          visibilityType: this.formData.visibilityType,
          visibilityValue: this.formData.visibilityValue,
          topHours: this.formData.topHours
        })

        uni.hideLoading()
        uni.showToast({ title: '发布成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1500)
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: error.message || '发布失败', icon: 'none' })
      }
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
}

.section-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 20rpx;
  display: block;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.content-box {
  border: 1rpx solid #E5E5E5;
  border-radius: 12rpx;
  padding: 20rpx;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-color: $dark-border;
  }
}

.content-input {
  width: 100%;
  min-height: 120rpx;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 20rpx;
}

.image-item {
  position: relative;
  width: 140rpx;
  height: 140rpx;
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
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.add-image {
  width: 140rpx;
  height: 140rpx;
  border: 2rpx dashed #CCCCCC;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-color: $dark-border;
  }
}

.price-group {
  display: flex;
  gap: 24rpx;
}

.price-item {
  flex: 1;
  .price-label {
    font-size: 26rpx;
    color: #666666;
    margin-bottom: 12rpx;
    display: block;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-secondary;
    }
  }
}

.price-input-box {
  display: flex;
  align-items: center;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-color: $dark-border;
  }

  .price-unit {
    font-size: 28rpx;
    color: #333333;
    margin-right: 8rpx;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }
  }
  .price-input {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }
  }
}

.price-tip {
  font-size: 22rpx;
  color: #999999;
  margin-top: 16rpx;
  display: block;
  line-height: 1.6;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-tertiary;
  }
}

.deadline-tabs {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-color: $dark-border;
  }
}

.deadline-tab {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  background-color: #FFFFFF;
  border-right: 1rpx solid #E5E5E5;
  transition: all 0.3s ease;

  &:last-child {
    border-right: none;
  }

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-right-color: $dark-border;
    color: $dark-text-secondary;
  }

  &.active {
    background-color: #007AFF;
    color: #FFFFFF;
  }
}

.deadline-input-box {
  margin-bottom: 16rpx;
}

.deadline-input {
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  color: #333333;
  width: 200rpx;
  transition: all 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-color: $dark-border;
    color: $dark-text-primary;
  }
}

.picker-input {
  display: flex;
  align-items: center;
}

.deadline-tip {
  font-size: 22rpx;
  color: #999999;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-tertiary;
  }
}

.contact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .section-title {
    margin-bottom: 0;
  }
}

.contact-types {
  display: flex;
  gap: 24rpx;
}

.contact-type {
  font-size: 26rpx;
  color: #999999;
  transition: color 0.3s ease;

  &.active {
    color: #007AFF;
  }

  .dark-mode & {
    color: $dark-text-tertiary;

    &.active {
      color: $dark-link;
    }
  }
}

.contact-input-box {
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 16rpx;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-color: $dark-border;
  }
}

.contact-input {
  font-size: 28rpx;
  color: #333333;
  width: 100%;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.contact-tip {
  font-size: 22rpx;
  color: #999999;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-tertiary;
  }
}

.visibility-tabs {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-color: $dark-border;
  }
}

.visibility-tab {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  background-color: #FFFFFF;
  transition: all 0.3s ease;

  &:first-child {
    border-right: 1rpx solid #E5E5E5;

    .dark-mode & {
      border-right-color: $dark-border;
    }
  }

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    color: $dark-text-secondary;
  }

  &.active {
    background-color: #007AFF;
    color: #FFFFFF;
  }
}

.visibility-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.visibility-tag {
  padding: 16rpx 32rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #666666;
  transition: all 0.3s ease;

  &.active {
    border-color: #007AFF;
    color: #007AFF;
    background-color: rgba(0, 122, 255, 0.05);
  }

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-color: $dark-border;
    color: $dark-text-secondary;

    &.active {
      border-color: $dark-link;
      color: $dark-link;
      background-color: rgba(90, 159, 255, 0.1);
    }
  }
}

.top-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .section-title {
    margin-bottom: 0;
  }
  .top-value {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 28rpx;
    color: #333333;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }

    .placeholder {
      color: #999999;

      .dark-mode & {
        color: $dark-text-tertiary;
      }
    }
  }
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.top-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  z-index: 1001;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  padding-bottom: env(safe-area-inset-bottom);
  transition: background-color 0.3s ease;

  .dark-mode & {
    background-color: $dark-bg-secondary;
  }

  &.show {
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-bottom-color: $dark-border;
  }

  .popup-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
    transition: color 0.3s ease;

    .dark-mode & {
      color: $dark-text-primary;
    }
  }
}

.top-options {
  padding: 24rpx;
}

.top-option-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;

  &.active {
    border-color: #007AFF;
    background-color: rgba(0, 122, 255, 0.02);
  }

  .dark-mode & {
    background-color: $dark-bg-tertiary;
    border-color: $dark-border;

    &.active {
      border-color: $dark-link;
      background-color: rgba(90, 159, 255, 0.1);
    }
  }
}

.option-radio {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #CCCCCC;
  border-radius: 50%;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-color: $dark-border;
  }

  .radio-inner {
    width: 24rpx;
    height: 24rpx;
    background-color: #007AFF;
    border-radius: 50%;
  }
}

.top-option-item.active .option-radio {
  border-color: #007AFF;

  .dark-mode & {
    border-color: $dark-link;
  }
}

.option-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.option-price {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  transition: color 0.3s ease;

  .dark-mode & {
    color: $dark-text-primary;
  }
}

.popup-footer {
  padding: 24rpx;
  border-top: 1rpx solid #F5F5F5;
  transition: border-color 0.3s ease;

  .dark-mode & {
    border-top-color: $dark-border;
  }
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background-color: #333333;
  border-radius: 44rpx;
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
  border: none;
  line-height: 88rpx;
  &::after {
    border: none;
  }
}
</style>
