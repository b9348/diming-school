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
      <!-- 任务类型 -->
      <view class="form-item" @click="showTypePicker = true">
        <text class="item-label">任务类型</text>
        <view class="item-value">
          <text>{{ typeOptions[formData.type] }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 任务描述 -->
      <view class="form-section">
        <text class="section-title">任务描述</text>
        <textarea
          class="content-input"
          v-model="formData.content"
          placeholder="请详细描述您的需求..."
          :maxlength="500"
        ></textarea>
        <text class="content-count">{{ formData.content.length }}/500</text>
      </view>

      <!-- 图片上传 -->
      <view class="form-section">
        <text class="section-title">添加图片（选填）</text>
        <view class="image-list">
          <view v-for="(img, index) in formData.images" :key="index" class="image-item">
            <image class="preview-image" :src="img" mode="aspectFill"></image>
            <view class="delete-btn" @click="deleteImage(index)">
              <uni-icons type="close" size="18" color="#FFFFFF"></uni-icons>
            </view>
          </view>
          <view v-if="formData.images.length < 3" class="add-image" @click="chooseImage">
            <uni-icons type="plusempty" size="40" color="#999999"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 酬劳金额 -->
      <view class="form-item">
        <text class="item-label">酬劳金额</text>
        <view class="price-input-box">
          <text class="price-symbol">¥</text>
          <input class="price-input" type="digit" v-model="formData.price" placeholder="0.00" />
        </view>
      </view>

      <!-- 截止时间 -->
      <view class="form-item" @click="showTimePicker = true">
        <text class="item-label">截止时间</text>
        <view class="item-value">
          <text v-if="formData.deadline">{{ formData.deadline }}</text>
          <text v-else class="placeholder">选择截止时间</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 取货地点 -->
      <view class="form-item" @click="choosePickupLocation">
        <text class="item-label">取货地点</text>
        <view class="item-value">
          <text v-if="formData.pickupLocation">{{ formData.pickupLocation }}</text>
          <text v-else class="placeholder">选择取货地点</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 送达地点 -->
      <view class="form-item" @click="chooseDeliveryLocation">
        <text class="item-label">送达地点</text>
        <view class="item-value">
          <text v-if="formData.deliveryLocation">{{ formData.deliveryLocation }}</text>
          <text v-else class="placeholder">选择送达地点</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="form-item">
        <text class="item-label">联系电话</text>
        <input class="item-input" type="number" v-model="formData.phone" placeholder="请输入联系电话" />
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
        type: 0,
        content: '',
        images: [],
        price: '',
        deadline: '',
        pickupLocation: '',
        deliveryLocation: '',
        phone: ''
      },
      typeOptions: ['代取快递', '代买商品', '代打印/复印', '代排队', '其他跑腿'],
      showTypePicker: false,
      showTimePicker: false
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
    goBack() {
      uni.navigateBack()
    },
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.formData.images.length,
        success: (res) => {
          this.formData.images = [...this.formData.images, ...res.tempFilePaths]
        }
      })
    },
    deleteImage(index) {
      this.formData.images.splice(index, 1)
    },
    choosePickupLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.formData.pickupLocation = res.name || res.address
        }
      })
    },
    chooseDeliveryLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.formData.deliveryLocation = res.name || res.address
        }
      })
    },
    handleSubmit() {
      if (!this.formData.content.trim()) {
        return uni.showToast({ title: '请输入任务描述', icon: 'none' })
      }
      if (!this.formData.price) {
        return uni.showToast({ title: '请输入酬劳金额', icon: 'none' })
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

.form-section {
  padding: 24rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
  .section-title { display: block; font-size: 28rpx; color: #333; margin-bottom: 16rpx; }
  .content-input { width: 100%; min-height: 150rpx; font-size: 28rpx; color: #333; }
  .content-count { display: block; text-align: right; font-size: 24rpx; color: #999; margin-top: 12rpx; }
}

.image-list {
  display: flex; flex-wrap: wrap; gap: 16rpx;
  .image-item {
    position: relative; width: 160rpx; height: 160rpx;
    .preview-image { width: 100%; height: 100%; border-radius: 8rpx; }
    .delete-btn { position: absolute; top: -12rpx; right: -12rpx; width: 36rpx; height: 36rpx; background: rgba(0,0,0,0.6); border-radius: 50%; color: #FFF; font-size: 24rpx; display: flex; align-items: center; justify-content: center; }
  }
  .add-image { width: 160rpx; height: 160rpx; background: #F5F5F5; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; }
}

.form-item {
  display: flex; align-items: center; justify-content: space-between; padding: 32rpx 24rpx; background: #FFF; border-bottom: 1rpx solid #F5F5F5;
  .item-label { font-size: 30rpx; color: #333; }
  .item-value { display: flex; align-items: center; font-size: 28rpx; color: #333; .placeholder { color: #999; } }
  .item-input { flex: 1; text-align: right; font-size: 28rpx; color: #333; }
  .price-input-box { display: flex; align-items: center; .price-symbol { font-size: 32rpx; color: #FF3B30; margin-right: 8rpx; } .price-input { width: 200rpx; text-align: right; font-size: 32rpx; color: #FF3B30; } }
}
</style>
