<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布闲置</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 写明要售卖的闲置 -->
      <view class="form-section">
        <text class="section-title">写明要售卖的闲置</text>
        <view class="content-box">
          <textarea
            class="content-input"
            v-model="formData.content"
            placeholder="描述一下宝贝的品牌、型号、入手渠道、转手原因..."
            :maxlength="500"
          ></textarea>
          <view class="image-upload">
            <view v-for="(img, index) in formData.images" :key="index" class="image-item">
              <image class="preview-image" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="deleteImage('images', index)">
                <uni-icons type="close" size="14" color="#FFFFFF"></uni-icons>
              </view>
            </view>
            <view v-if="formData.images.length < 9" class="add-image" @click="chooseImage('images')">
              <uni-icons type="plusempty" size="32" color="#CCCCCC"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 隐藏信息（仅购买人可见） -->
      <view class="form-section">
        <text class="section-title">隐藏信息（仅购买人可见）</text>
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
                <uni-icons type="close" size="14" color="#FFFFFF"></uni-icons>
              </view>
            </view>
            <view v-if="formData.hiddenImages.length < 9" class="add-image" @click="chooseImage('hiddenImages')">
              <uni-icons type="plusempty" size="32" color="#CCCCCC"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <!-- 价格和包邮 -->
      <view class="form-section">
        <text class="section-title">价格</text>
        <view class="price-row">
          <view class="price-input-box">
            <input class="price-input" type="digit" v-model="formData.price" placeholder="0.00" />
          </view>
          <view class="shipping-option">
            <text class="shipping-label">包邮</text>
            <switch :checked="formData.freeShipping" @change="onShippingChange" color="#007AFF" />
            <text class="shipping-tip">此按钮默认打开，关闭则自提</text>
          </view>
        </view>
      </view>

      <!-- 发货时间 -->
      <view class="form-section">
        <text class="section-title">发货时间（2选1）</text>
        <view class="delivery-tabs">
          <view
            class="delivery-tab"
            :class="{ active: formData.deliveryType === 'hours' }"
            @click="formData.deliveryType = 'hours'"
          >
            <text>小时内</text>
          </view>
          <view
            class="delivery-tab"
            :class="{ active: formData.deliveryType === 'deadline' }"
            @click="formData.deliveryType = 'deadline'"
          >
            <text>指定时间前</text>
          </view>
        </view>
        <view class="delivery-input-box">
          <input
            v-if="formData.deliveryType === 'hours'"
            class="delivery-input"
            type="digit"
            v-model="formData.deliveryHours"
            placeholder="24"
          />
          <picker
            v-else
            mode="date"
            :value="formData.deliveryDeadline"
            @change="onDeadlineChange"
          >
            <view class="delivery-input picker-input">
              {{ formData.deliveryDeadline || '选择日期' }}
            </view>
          </picker>
        </view>
        <text class="delivery-tip">默认选左边且默认值是24小时内，可为0，即拍中后自动线上发货，可为小数</text>
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
            <uni-icons type="right" size="14" color="#999999"></uni-icons>
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

    <!-- 置顶选择弹窗 -->
    <view class="popup-mask" v-if="showTopPopup" @click="showTopPopup = false"></view>
    <view class="top-popup" :class="{ show: showTopPopup }">
      <view class="popup-header">
        <text class="popup-title">选择置顶时长</text>
        <view class="popup-close" @click="showTopPopup = false">
          <uni-icons type="close" size="20" color="#999999"></uni-icons>
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
import { idleApi } from '@/api/index.js'
import userStore from '@/store/user.js'

export default {
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
        price: '',
        freeShipping: true,
        deliveryType: 'hours',
        deliveryHours: '24',
        deliveryDeadline: '',
        contactType: 'phone',
        contactValue: '',
        visibilityType: 'campus',
        visibilityValue: 'current',
        topHours: 0
      },
      visibilityOptions: [
        { label: '外校', value: 'other' },
        { label: '全国', value: 'national' },
        { label: '滴水湖大学城', value: 'dishui' },
        { label: '指定', value: 'specified' },
        { label: '全区', value: 'district' },
        { label: '全市', value: 'city' },
        { label: '全省', value: 'province' },
        { label: '华东', value: 'east' },
        { label: '华中', value: 'central' }
      ],
      topOptions: [
        { hours: 1, price: 8.8 },
        { hours: 2, price: 18.8 },
        { hours: 4, price: 28.8 },
        { hours: 6, price: 38.8 },
        { hours: 8, price: 48.8 },
        { hours: 12, price: 58.8 }
      ]
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
  },
  methods: {
    initPage() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navBarHeight = uni.upx2px(88)
      const submitBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navBarHeight - submitBarHeight
    },
    loadUserContact() {
      // 自动同步用户资料中的联系方式
      const userInfo = userStore.getUserInfo()
      if (userInfo.phone) {
        this.formData.contactValue = userInfo.phone
        this.formData.contactType = 'phone'
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
    onShippingChange(e) {
      this.formData.freeShipping = e.detail.value
    },
    onDeadlineChange(e) {
      this.formData.deliveryDeadline = e.detail.value
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
      // 表单验证
      if (!this.formData.content.trim()) {
        return uni.showToast({ title: '请描述要售卖的闲置', icon: 'none' })
      }
      if (!this.formData.images.length) {
        return uni.showToast({ title: '请上传商品图片', icon: 'none' })
      }
      if (!this.formData.price) {
        return uni.showToast({ title: '请输入价格', icon: 'none' })
      }
      if (!this.formData.contactValue.trim()) {
        return uni.showToast({ title: '请填写联系方式', icon: 'none' })
      }

      uni.showLoading({ title: '发布中...' })

      try {
        await idleApi.saveOrUpdate({
          content: this.formData.content,
          images: this.formData.images,
          hiddenInfo: this.formData.hiddenInfo,
          hiddenImages: this.formData.hiddenImages,
          price: parseFloat(this.formData.price),
          freeShipping: this.formData.freeShipping,
          deliveryType: this.formData.deliveryType,
          deliveryHours: this.formData.deliveryType === 'hours' ? parseFloat(this.formData.deliveryHours || 24) : null,
          deliveryDeadline: this.formData.deliveryType === 'deadline' ? this.formData.deliveryDeadline : null,
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

.form-scroll {}

.form-section {
  padding: 24rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 20rpx;
  display: block;
}

.content-box {
  border: 1rpx solid #E5E5E5;
  border-radius: 12rpx;
  padding: 20rpx;
}

.content-input {
  width: 100%;
  min-height: 120rpx;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
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
}

.price-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.price-input-box {
  width: 200rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  .price-input {
    font-size: 28rpx;
    color: #333333;
  }
}

.shipping-option {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  .shipping-label {
    font-size: 28rpx;
    color: #333333;
  }
  .shipping-tip {
    font-size: 22rpx;
    color: #999999;
    flex: 1;
  }
}

.delivery-tabs {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.delivery-tab {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  background-color: #FFFFFF;
  border-right: 1rpx solid #E5E5E5;
  &:last-child {
    border-right: none;
  }
  &.active {
    background-color: #007AFF;
    color: #FFFFFF;
  }
}

.delivery-input-box {
  margin-bottom: 16rpx;
}

.delivery-input {
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  color: #333333;
  width: 200rpx;
}

.picker-input {
  display: flex;
  align-items: center;
}

.delivery-tip {
  font-size: 22rpx;
  color: #999999;
  line-height: 1.6;
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
  &.active {
    color: #007AFF;
  }
}

.contact-input-box {
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 16rpx;
}

.contact-input {
  font-size: 28rpx;
  color: #333333;
  width: 100%;
}

.contact-tip {
  font-size: 22rpx;
  color: #999999;
}

.visibility-tabs {
  display: flex;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.visibility-tab {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  background-color: #FFFFFF;
  &:first-child {
    border-right: 1rpx solid #E5E5E5;
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
  &.active {
    border-color: #007AFF;
    color: #007AFF;
    background-color: rgba(0, 122, 255, 0.05);
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
    .placeholder {
      color: #999999;
    }
  }
}

// 弹窗样式
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
  .popup-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
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
  &.active {
    border-color: #007AFF;
    background-color: rgba(0, 122, 255, 0.02);
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
  .radio-inner {
    width: 24rpx;
    height: 24rpx;
    background-color: #007AFF;
    border-radius: 50%;
  }
}

.top-option-item.active .option-radio {
  border-color: #007AFF;
}

.option-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.option-price {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.popup-footer {
  padding: 24rpx;
  border-top: 1rpx solid #F5F5F5;
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
