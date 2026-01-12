<template>
  <view class="page-container" :class="{ 'dark-mode': darkMode }">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-cancel" @click="goBack">取消</text>
        <text class="nav-title">发布交友</text>
      </view>
    </view>

    <scroll-view class="form-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 基本信息 -->
      <view class="form-group">
        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">性别</text>
            <picker :range="genderOptions" @change="formData.gender = genderOptions[$event.detail.value]">
              <view class="item-value">{{ formData.gender || '选择' }}</view>
            </picker>
          </view>
          <view class="form-item half">
            <text class="item-label">生日</text>
            <picker mode="date" @change="formData.birthday = $event.detail.value">
              <view class="item-value">{{ formData.birthday || '选择' }}</view>
            </picker>
          </view>
        </view>

        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">身高</text>
            <input class="item-input" type="digit" v-model="formData.height" placeholder="如1.75" />
            <text class="item-unit">m</text>
          </view>
          <view class="form-item half">
            <text class="item-label">体重</text>
            <input class="item-input" type="digit" v-model="formData.weight" placeholder="如60" />
            <text class="item-unit">kg</text>
          </view>
        </view>

        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">学校</text>
            <input class="item-input" v-model="formData.school" placeholder="请填写学校" />
          </view>
          <view class="form-item half">
            <text class="item-label">学历</text>
            <input class="item-input" v-model="formData.education" placeholder="如本科" />
          </view>
        </view>

        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">专业</text>
            <input class="item-input" v-model="formData.major" placeholder="请填写专业" />
          </view>
          <view class="form-item half">
            <text class="item-label">职业</text>
            <input class="item-input" v-model="formData.job" placeholder="学生/职业" />
          </view>
        </view>

        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">现居</text>
            <input class="item-input" v-model="formData.location" placeholder="如北京" />
          </view>
          <view class="form-item half">
            <text class="item-label">籍贯</text>
            <input class="item-input" v-model="formData.hometown" placeholder="如山东" />
          </view>
        </view>

        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">抽烟?</text>
            <input class="item-input" v-model="formData.smoke" placeholder="是/否" />
          </view>
          <view class="form-item half">
            <text class="item-label">喝酒?</text>
            <input class="item-input" v-model="formData.drink" placeholder="是/否/偶尔" />
          </view>
        </view>

        <view class="form-row">
          <view class="form-item half">
            <text class="item-label">打呼噜?</text>
            <input class="item-input" v-model="formData.snore" placeholder="轻微视为不打" />
          </view>
          <view class="form-item half">
            <text class="item-label">作息</text>
            <input class="item-input" v-model="formData.schedule" placeholder="几点起几点睡" />
          </view>
        </view>

        <view class="form-row">
          <view class="form-item">
            <text class="item-label">接受异地恋吗?</text>
            <input class="item-input" v-model="formData.longDistance" placeholder="接受/不接受/看情况" />
          </view>
        </view>
      </view>

      <!-- 个人介绍 -->
      <view class="form-group">
        <view class="form-section">
          <text class="section-label">我的标签</text>
          <input class="section-input" v-model="formData.tags" placeholder="用几个词描述自己，如：开朗、爱运动、喜欢旅行" />
        </view>

        <view class="form-section">
          <text class="section-label">我的性格</text>
          <input class="section-input" v-model="formData.personality" placeholder="描述你的性格特点" />
        </view>

        <view class="form-section">
          <text class="section-label">兴趣爱好</text>
          <input class="section-input" v-model="formData.hobbies" placeholder="平时喜欢做什么" />
        </view>

        <view class="form-section">
          <text class="section-label">爱情观</text>
          <input class="section-input" v-model="formData.loveView" placeholder="你对爱情的看法和态度" />
        </view>

        <view class="form-section">
          <text class="section-label">三观</text>
          <input class="section-input" v-model="formData.values" placeholder="人生观、价值观、世界观" />
        </view>

        <view class="form-section">
          <text class="section-label">日常生活</text>
          <input class="section-input" v-model="formData.dailyLife" placeholder="描述你的日常生活状态" />
        </view>

        <view class="form-section">
          <text class="section-label">未来规划</text>
          <input class="section-input" v-model="formData.futurePlan" placeholder="对未来的计划和目标" />
        </view>

        <view class="form-section">
          <text class="section-label">成长经历</text>
          <input class="section-input" v-model="formData.growthExp" placeholder="分享你的成长故事" />
        </view>

        <view class="form-section">
          <text class="section-label">家庭情况（选填）</text>
          <input class="section-input" v-model="formData.family" placeholder="家庭成员、父母职业等" />
        </view>

        <view class="form-section">
          <text class="section-label">自我评价</text>
          <input class="section-input" v-model="formData.selfEval" placeholder="客观评价一下自己" />
        </view>

        <view class="form-section">
          <text class="section-label">期待的ta</text>
          <textarea class="section-textarea" v-model="formData.expectation" placeholder="描述你理想中的另一半" />
        </view>
      </view>

      <!-- 交友问题 -->
      <view class="form-group">
        <view class="form-section">
          <text class="section-label">对方不咋会聊天，会陪ta尬聊吗</text>
          <input class="section-input" v-model="formData.q1" placeholder="会/不会，说说你的想法" />
        </view>

        <view class="form-section">
          <text class="section-label">对方心情差时，会为ta做些什么</text>
          <input class="section-input" v-model="formData.q2" placeholder="描述你会怎么做" />
        </view>

        <view class="form-section">
          <text class="section-label">网聊多久后会线下见面</text>
          <input class="section-input" v-model="formData.q3" placeholder="如：聊一周后/看感觉" />
        </view>
      </view>

      <!-- 照片上传 -->
      <view class="form-group">
        <text class="group-title">个人形象生活照片</text>
        <view class="image-list">
          <view v-for="(img, index) in formData.images" :key="index" class="image-item">
            <image class="preview-image" :src="img" mode="aspectFill"></image>
            <view class="delete-btn" @click="deleteImage(index)">
              <text class="tn-icon-close" style="font-size: 14px; color: #FFFFFF;"></text>
            </view>
          </view>
          <view v-if="formData.images.length < 9" class="add-image" @click="chooseImage">
            <text class="tn-icon-add" style="font-size: 32px; color: #999999;"></text>
          </view>
        </view>
        <text class="image-tip">展示前9张，可以发100张</text>
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
import pageBaseMixin from '@/mixins/page-base.js'

export default {
  mixins: [pageBaseMixin],
  data() {
    return {
      statusBarHeight: 0,
      rightSafeArea: 12,
      scrollHeight: 0,
      genderOptions: ['男', '女'],
      formData: {
        gender: '',
        birthday: '',
        height: '',
        weight: '',
        school: '',
        education: '',
        major: '',
        job: '',
        location: '',
        hometown: '',
        smoke: '',
        drink: '',
        snore: '',
        schedule: '',
        longDistance: '',
        tags: '',
        personality: '',
        hobbies: '',
        loveView: '',
        values: '',
        dailyLife: '',
        futurePlan: '',
        growthExp: '',
        family: '',
        selfEval: '',
        expectation: '',
        q1: '',
        q2: '',
        q3: '',
        images: []
      }
    }
  },
  onLoad() {
    this.statusBarHeight = uni.getWindowInfo().statusBarHeight
    this.calcRightSafeArea()
    this.calcScrollHeight()
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
    handleSubmit() {
      if (!this.formData.gender) {
        return uni.showToast({ title: '请选择性别', icon: 'none' })
      }
      if (!this.formData.birthday) {
        return uni.showToast({ title: '请选择生日', icon: 'none' })
      }
      if (!this.formData.images.length) {
        return uni.showToast({ title: '请上传照片', icon: 'none' })
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
    background: linear-gradient(135deg, #FF6B81 0%, #FF3B5C 100%);
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

.form-group {
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
  padding: 0 24rpx;

  .group-title {
    display: block;
    padding: 24rpx 0 16rpx;
    font-size: 28rpx;
    color: #333333;
  }
}

.form-row {
  display: flex;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child {
    border-bottom: none;
  }
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  flex: 1;

  &.half {
    flex: 0 0 50%;
  }

  .item-label {
    font-size: 28rpx;
    color: #333333;
    margin-right: 16rpx;
    white-space: nowrap;
  }

  .item-value {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    padding: 8rpx 16rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    text-align: center;
  }

  .item-input {
    flex: 1;
    height: 60rpx;
    line-height: 44rpx;
    font-size: 28rpx;
    color: #333333;
    padding: 8rpx 16rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    text-align: center;
  }

  .item-unit {
    font-size: 26rpx;
    color: #666666;
    margin-left: 8rpx;
  }
}

.form-section {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child {
    border-bottom: none;
  }

  .section-label {
    display: block;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 12rpx;
  }

  .section-input {
    width: 100%;
    height: 80rpx;
    line-height: 48rpx;
    font-size: 28rpx;
    color: #333333;
    padding: 16rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    box-sizing: border-box;
  }

  .section-textarea {
    width: 100%;
    min-height: 120rpx;
    font-size: 28rpx;
    color: #333333;
    padding: 16rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    box-sizing: border-box;
  }
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  padding-bottom: 16rpx;

  .image-item {
    position: relative;
    width: 210rpx;
    height: 210rpx;

    .preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }

    .delete-btn {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      width: 36rpx;
      height: 36rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .add-image {
    width: 210rpx;
    height: 210rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.image-tip {
  font-size: 24rpx;
  color: #999999;
}
</style>
