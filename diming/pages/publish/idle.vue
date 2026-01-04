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

      <!-- 商品标题 -->
      <view class="form-item">
        <input class="title-input" v-model="formData.title" placeholder="请输入商品标题" :maxlength="30" />
      </view>

      <!-- 商品描述 -->
      <view class="form-section">
        <textarea
          class="content-input"
          v-model="formData.content"
          placeholder="描述一下宝贝的品牌、型号、入手渠道、转手原因..."
          :maxlength="500"
        ></textarea>
      </view>

      <!-- 商品分类 -->
      <view class="form-item" @click="showCategoryPicker = true">
        <text class="item-label">商品分类</text>
        <view class="item-value">
          <text>{{ categoryOptions[formData.category] }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 新旧程度 -->
      <view class="form-item" @click="showConditionPicker = true">
        <text class="item-label">新旧程度</text>
        <view class="item-value">
          <text>{{ conditionOptions[formData.condition] }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 价格 -->
      <view class="form-item">
        <text class="item-label">售价</text>
        <view class="price-input-box">
          <text class="price-symbol">¥</text>
          <input class="price-input" type="digit" v-model="formData.price" placeholder="0.00" />
        </view>
      </view>

      <!-- 交易方式 -->
      <view class="form-item" @click="showDeliveryPicker = true">
        <text class="item-label">交易方式</text>
        <view class="item-value">
          <text>{{ deliveryOptions[formData.delivery] }}</text>
          <uni-icons type="right" size="14" color="#999999"></uni-icons>
        </view>
      </view>

      <!-- 位置 -->
      <view class="form-item" @click="chooseLocation">
        <text class="item-label">所在位置</text>
        <view class="item-value">
          <text v-if="formData.location">{{ formData.location }}</text>
          <text v-else class="placeholder">选择位置</text>
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
        images: [],
        title: '',
        content: '',
        category: 0,
        condition: 0,
        price: '',
        delivery: 0,
        location: ''
      },
      categoryOptions: ['教材书籍', '数码产品', '生活用品', '服饰鞋包', '美妆护肤', '其他'],
      conditionOptions: ['全新', '几乎全新', '轻微使用痕迹', '明显使用痕迹'],
      deliveryOptions: ['自提', '快递', '自提/快递均可']
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
    goBack() { uni.navigateBack() },
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.formData.images.length,
        success: (res) => { this.formData.images = [...this.formData.images, ...res.tempFilePaths] }
      })
    },
    deleteImage(index) { this.formData.images.splice(index, 1) },
    chooseLocation() {
      uni.chooseLocation({ success: (res) => { this.formData.location = res.name || res.address } })
    },
    handleSubmit() {
      if (!this.formData.images.length) return uni.showToast({ title: '请上传商品图片', icon: 'none' })
      if (!this.formData.title.trim()) return uni.showToast({ title: '请输入商品标题', icon: 'none' })
      if (!this.formData.price) return uni.showToast({ title: '请输入售价', icon: 'none' })
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
.page-container { min-height: 100vh; background-color: #F8F8F8; }
.nav-bar {
  background-color: #FFFFFF;
  .nav-content { position: relative; display: flex; align-items: center; height: 88rpx; padding: 0 24rpx;
    .nav-cancel { font-size: 30rpx; color: #666; z-index: 10; }
    .nav-title { position: absolute; left: 50%; transform: translateX(-50%); font-size: 34rpx; color: #333; font-weight: 600; }
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
.form-section { padding: 24rpx; background: #FFF; margin-bottom: 20rpx;
  .content-input { width: 100%; min-height: 150rpx; font-size: 28rpx; color: #333; }
}
.image-list { display: flex; flex-wrap: wrap; gap: 16rpx;
  .image-item { position: relative; width: 200rpx; height: 200rpx;
    .preview-image { width: 100%; height: 100%; border-radius: 8rpx; }
    .delete-btn { position: absolute; top: -12rpx; right: -12rpx; width: 36rpx; height: 36rpx; background: rgba(0,0,0,0.6); border-radius: 50%; color: #FFF; font-size: 24rpx; display: flex; align-items: center; justify-content: center; }
  }
  .add-image { width: 200rpx; height: 200rpx; background: #F5F5F5; border-radius: 8rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8rpx;
    .add-text { font-size: 24rpx; color: #999; }
  }
}
.form-item { display: flex; align-items: center; justify-content: space-between; padding: 32rpx 24rpx; background: #FFF; border-bottom: 1rpx solid #F5F5F5;
  .item-label { font-size: 30rpx; color: #333; }
  .title-input { flex: 1; font-size: 30rpx; color: #333; }
  .item-value { display: flex; align-items: center; font-size: 28rpx; color: #333; .placeholder { color: #999; } }
  .price-input-box { display: flex; align-items: center; .price-symbol { font-size: 32rpx; color: #FF3B30; margin-right: 8rpx; } .price-input { width: 200rpx; text-align: right; font-size: 32rpx; color: #FF3B30; } }
}
</style>
