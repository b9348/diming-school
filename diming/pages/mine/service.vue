<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <text class="nav-title">客服中心</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <scroll-view class="scroll-container" scroll-y :style="{ height: scrollHeight + 'px' }">
      <!-- 客服入口 -->
      <view class="service-card">
        <view class="service-item" @click="contactOnline">
          <view class="item-icon online">
            <uni-icons type="chatbubble-filled" size="28" color="#FFFFFF"></uni-icons>
          </view>
          <view class="item-info">
            <text class="item-title">在线客服</text>
            <text class="item-desc">工作时间：9:00-22:00</text>
          </view>
          <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
        </view>

        <view class="service-item" @click="callPhone">
          <view class="item-icon phone">
            <uni-icons type="phone-filled" size="28" color="#FFFFFF"></uni-icons>
          </view>
          <view class="item-info">
            <text class="item-title">电话客服</text>
            <text class="item-desc">{{ servicePhone }}</text>
          </view>
          <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
        </view>

        <view class="service-item" @click="goFeedback">
          <view class="item-icon feedback">
            <uni-icons type="compose" size="28" color="#FFFFFF"></uni-icons>
          </view>
          <view class="item-info">
            <text class="item-title">意见反馈</text>
            <text class="item-desc">提交问题或建议</text>
          </view>
          <uni-icons type="right" size="16" color="#CCCCCC"></uni-icons>
        </view>
      </view>

      <!-- 常见问题 -->
      <view class="faq-section">
        <text class="section-title">常见问题</text>
        <view class="faq-list">
          <view
            class="faq-item"
            v-for="(item, index) in faqList"
            :key="index"
            @click="toggleFaq(index)"
          >
            <view class="faq-question">
              <text class="question-text">{{ item.question }}</text>
              <uni-icons
                :type="expandedIndex === index ? 'up' : 'down'"
                size="16"
                color="#999999"
              ></uni-icons>
            </view>
            <view class="faq-answer" v-if="expandedIndex === index">
              <text>{{ item.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 问题分类 -->
      <view class="category-section">
        <text class="section-title">问题分类</text>
        <view class="category-grid">
          <view
            class="category-item"
            v-for="(item, index) in categoryList"
            :key="index"
            @click="goCategoryDetail(item)"
          >
            <view class="category-icon" :style="{ backgroundColor: item.bgColor }">
              <uni-icons :type="item.icon" size="24" :color="item.iconColor"></uni-icons>
            </view>
            <text class="category-name">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="contact-section">
        <text class="section-title">其他联系方式</text>
        <view class="contact-list">
          <view class="contact-item" @click="copyEmail">
            <text class="contact-label">邮箱</text>
            <text class="contact-value">{{ serviceEmail }}</text>
            <text class="copy-text">复制</text>
          </view>
          <view class="contact-item" @click="copyWechat">
            <text class="contact-label">微信公众号</text>
            <text class="contact-value">{{ wechatOfficialAccount }}</text>
            <text class="copy-text">复制</text>
          </view>
        </view>
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
      servicePhone: '400-123-4567',
      serviceEmail: 'service@diming.app',
      wechatOfficialAccount: '递明校园',
      expandedIndex: -1,
      faqList: [
        {
          question: '如何发布跑腿任务？',
          answer: '在首页点击底部的"+"按钮，选择"跑腿"，填写任务详情和价格后即可发布。'
        },
        {
          question: '如何进行身份认证？',
          answer: '进入"我的"-"身份认证"，按照提示上传学生证或校园卡照片，等待审核通过即可。'
        },
        {
          question: '交易出现纠纷怎么办？',
          answer: '请保留好相关证据（聊天记录、订单截图等），通过在线客服或意见反馈提交申诉，我们会在24小时内处理。'
        },
        {
          question: '如何提现？',
          answer: '进入"我的"-"我的钱包"，点击提现按钮，绑定支付宝或银行卡后即可提现，一般1-3个工作日到账。'
        },
        {
          question: '发布的内容为什么被删除？',
          answer: '可能违反了平台规定，如包含广告、违法违规信息等。请查看消息通知了解具体原因，如有疑问可联系客服申诉。'
        }
      ],
      categoryList: [
        { name: '账号问题', icon: 'person', iconColor: '#007AFF', bgColor: '#E8F4FF' },
        { name: '交易问题', icon: 'wallet', iconColor: '#FF9500', bgColor: '#FFF3E0' },
        { name: '跑腿问题', icon: 'car', iconColor: '#4CAF50', bgColor: '#E8F5E9' },
        { name: '闲置问题', icon: 'shop', iconColor: '#9C27B0', bgColor: '#F3E5F5' },
        { name: '投诉举报', icon: 'flag', iconColor: '#F44336', bgColor: '#FFEBEE' },
        { name: '其他问题', icon: 'help', iconColor: '#607D8B', bgColor: '#ECEFF1' }
      ]
    }
  },
  onLoad() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      const navHeight = uni.upx2px(88)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - navHeight
    },
    goBack() {
      uni.navigateBack()
    },
    contactOnline() {
      // 可以接入在线客服系统，如腾讯云IM、环信等
      uni.showModal({
        title: '在线客服',
        content: '是否跳转到在线客服？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/chat/index?targetId=customer_service' })
          }
        }
      })
    },
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: this.servicePhone.replace(/-/g, ''),
        fail: () => {
          uni.showToast({ title: '拨打失败', icon: 'none' })
        }
      })
    },
    goFeedback() {
      uni.navigateTo({ url: '/pages/mine/feedback/index' })
    },
    toggleFaq(index) {
      this.expandedIndex = this.expandedIndex === index ? -1 : index
    },
    goCategoryDetail(item) {
      uni.navigateTo({ url: `/pages/mine/faq-list?category=${item.name}` })
    },
    copyEmail() {
      uni.setClipboardData({
        data: this.serviceEmail,
        success: () => {
          uni.showToast({ title: '邮箱已复制', icon: 'success' })
        }
      })
    },
    copyWechat() {
      uni.setClipboardData({
        data: this.wechatOfficialAccount,
        success: () => {
          uni.showToast({ title: '已复制，请到微信搜索关注', icon: 'none' })
        }
      })
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

.service-card {
  margin: 0 24rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;

  .service-item {
    display: flex;
    align-items: center;
    padding: 28rpx 24rpx;
    border-bottom: 1rpx solid #F5F5F5;

    &:last-child {
      border-bottom: none;
    }

    .item-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.online { background-color: #007AFF; }
      &.phone { background-color: #4CAF50; }
      &.feedback { background-color: #FF9500; }
    }

    .item-info {
      flex: 1;
      margin-left: 20rpx;

      .item-title {
        display: block;
        font-size: 30rpx;
        color: #333333;
        font-weight: 500;
        margin-bottom: 8rpx;
      }

      .item-desc {
        font-size: 24rpx;
        color: #999999;
      }
    }
  }
}

.section-title {
  font-size: 30rpx;
  color: #333333;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.faq-section {
  margin: 0 24rpx 24rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .faq-list {
    .faq-item {
      border-bottom: 1rpx solid #F5F5F5;

      &:last-child {
        border-bottom: none;
      }

      .faq-question {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx 0;

        .question-text {
          flex: 1;
          font-size: 28rpx;
          color: #333333;
        }
      }

      .faq-answer {
        padding: 0 0 24rpx;

        text {
          font-size: 26rpx;
          color: #666666;
          line-height: 1.6;
        }
      }
    }
  }
}

.category-section {
  margin: 0 24rpx 24rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .category-grid {
    display: flex;
    flex-wrap: wrap;

    .category-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx 0;

      .category-icon {
        width: 88rpx;
        height: 88rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;
      }

      .category-name {
        font-size: 24rpx;
        color: #666666;
      }
    }
  }
}

.contact-section {
  margin: 0 24rpx 40rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .contact-list {
    .contact-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #F5F5F5;

      &:last-child {
        border-bottom: none;
      }

      .contact-label {
        width: 180rpx;
        font-size: 28rpx;
        color: #666666;
      }

      .contact-value {
        flex: 1;
        font-size: 28rpx;
        color: #333333;
      }

      .copy-text {
        font-size: 26rpx;
        color: #007AFF;
      }
    }
  }
}
</style>
