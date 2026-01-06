<template>
  <view class="page-container">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content" :style="{ height: navBarHeight + 'px', paddingRight: rightSafeArea + 'px' }">
        <view class="nav-back" @click="goBack">
          <uni-icons type="left" size="18" color="#333333"></uni-icons>
        </view>
        <view class="nav-center">
          <text class="nav-nickname">{{ targetUser.nickname }}</text>
          <text class="nav-location">{{ targetUser.location }}</text>
        </view>
        <view class="nav-more" @click="showMore">
          <uni-icons type="more" size="20" color="#333333"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 商品卡片 - 根据入口类型显示 -->
    <view class="goods-card" v-if="chatType === 'idle' && goodsInfo.id">
      <image class="goods-image" :src="goodsInfo.image" mode="aspectFill"></image>
      <view class="goods-info">
        <text class="goods-title">{{ goodsInfo.title }}</text>
        <view class="goods-price">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ goodsInfo.price }}</text>
          <text class="delivery-tag">{{ goodsInfo.deliveryType }}</text>
        </view>
      </view>
      <view class="goods-buy-btn" @click="handleBuy">立即购买</view>
    </view>

    <scroll-view class="chat-scroll" scroll-y :scroll-into-view="scrollToView" :style="{ height: scrollHeight + 'px' }">
      <view v-for="(msg, i) in messageList" :key="i" :id="'msg-' + i"
        class="message-item" :class="{ mine: msg.isMine }">
        <image v-if="!msg.isMine" class="msg-avatar" :src="msg.avatar" mode="aspectFill"></image>
        <view class="msg-bubble">
          <text class="msg-text">{{ msg.content }}</text>
        </view>
        <image v-if="msg.isMine" class="msg-avatar" :src="msg.avatar" mode="aspectFill"></image>
      </view>
      <view class="msg-time" v-if="messageList.length">{{ lastMsgTime }}</view>
    </scroll-view>

    <view class="input-bar">
      <input class="msg-input" v-model="inputText" placeholder="输入消息..." @confirm="sendMessage" />
      <view class="image-btn" @click="chooseImage">
        <uni-icons type="image" size="24" color="#999999"></uni-icons>
      </view>
      <view class="send-btn" @click="sendMessage">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script>
import userStore from '@/store/user.js'
import { chatApi } from '@/api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      safeAreaBottom: 0,
      navBarHeight: 44,
      rightSafeArea: 12,
      inputText: '',
      scrollToView: '',
      chatType: '',
      targetId: '',
      targetUser: {
        id: '',
        nickname: '',
        avatar: '',
        location: ''
      },
      goodsInfo: {
        id: '',
        title: '',
        price: '',
        image: '',
        deliveryType: ''
      },
      messageList: [],
      myAvatar: 'https://iph.href.lu/100x100?text=我'
    }
  },
  computed: {
    lastMsgTime() {
      const now = new Date()
      return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    }
  },
  onLoad(options) {
    const sys = uni.getSystemInfoSync()
    this.statusBarHeight = sys.statusBarHeight
    this.safeAreaBottom = sys.screenHeight - sys.safeArea.bottom

    // #ifdef MP-WEIXIN
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - sys.statusBarHeight) * 2
    this.rightSafeArea = sys.windowWidth - menuButtonInfo.left + 10
    // #endif

    this.chatType = options.type || ''
    this.targetId = options.id || ''

    if (options.targetUser) {
      this.targetUser = JSON.parse(decodeURIComponent(options.targetUser))
    }

    if (options.goodsInfo) {
      this.goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo))
    }

    this.calcScrollHeight()

    const currentUser = userStore.getUserInfo()
    if (currentUser && currentUser.avatar) {
      this.myAvatar = currentUser.avatar
    }

    this.loadChatHistory()
  },
  methods: {
    async loadChatHistory() {
      if (this.targetId) {
        const data = await chatApi.getList(this.targetId)
        this.messageList = data.list || []
        this.$nextTick(() => {
          if (this.messageList.length > 0) {
            this.scrollToView = 'msg-' + (this.messageList.length - 1)
          }
        })
      }
    },
    calcScrollHeight() {
      const sys = uni.getSystemInfoSync()
      let height = sys.windowHeight - this.statusBarHeight - uni.upx2px(88) - uni.upx2px(100) - this.safeAreaBottom
      if (this.chatType === 'idle' && this.goodsInfo.id) {
        height -= uni.upx2px(160)
      }
      this.scrollHeight = height
    },
    goBack() { uni.navigateBack() },
    showMore() {
      uni.showActionSheet({
        itemList: ['举报', '清空聊天记录'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.showToast({ title: '举报成功', icon: 'none' })
          } else if (res.tapIndex === 1) {
            this.messageList = []
            uni.showToast({ title: '已清空', icon: 'none' })
          }
        }
      })
    },
    handleBuy() {
      uni.showToast({ title: '立即购买', icon: 'none' })
    },
    async sendMessage() {
      if (!this.inputText.trim()) return

      const content = this.inputText
      this.inputText = ''

      this.messageList.push({
        avatar: this.myAvatar,
        content: content,
        isMine: true
      })

      this.$nextTick(() => {
        this.scrollToView = 'msg-' + (this.messageList.length - 1)
      })

      await chatApi.send({
        targetId: this.targetId || this.targetUser.id,
        content: content
      })
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          uni.showToast({ title: '图片发送功能开发中', icon: 'none' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container { min-height: 100vh; background: #F5F5F5; }
.nav-bar { background: #FFF;
  .nav-content { display: flex; align-items: center; justify-content: space-between; padding: 0 24rpx; box-sizing: border-box;
    .nav-back { padding: 10rpx; }
    .nav-center { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 20rpx;
      .nav-nickname { font-size: 28rpx; color: #333; }
      .nav-location { font-size: 24rpx; color: #999; }
    }
    .nav-more { padding: 10rpx; }
  }
}
.goods-card {
  display: flex; align-items: center; padding: 20rpx 24rpx; background: #FFF; margin-bottom: 2rpx;
  .goods-image { width: 120rpx; height: 120rpx; border-radius: 8rpx; border: 1rpx solid #E5E5E5; }
  .goods-info { flex: 1; margin-left: 20rpx;
    .goods-title { font-size: 28rpx; color: #333; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    .goods-price { display: flex; align-items: baseline; margin-top: 8rpx;
      .price-symbol { font-size: 24rpx; color: #333; }
      .price-value { font-size: 32rpx; color: #333; font-weight: 600; }
      .delivery-tag { margin-left: 12rpx; font-size: 22rpx; color: #999; }
    }
  }
  .goods-buy-btn { padding: 12rpx 24rpx; border: 1rpx solid #333; border-radius: 8rpx; font-size: 26rpx; color: #333; }
}
.chat-scroll { padding: 24rpx; box-sizing: border-box; }
.message-item { display: flex; align-items: flex-start; margin-bottom: 24rpx;
  &.mine { justify-content: flex-end; .msg-bubble { background: #007AFF; .msg-text { color: #FFF; } } }
  .msg-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; }
  .msg-bubble { max-width: 500rpx; margin: 0 16rpx; padding: 20rpx; background: #FFF; border-radius: 16rpx;
    .msg-text { font-size: 28rpx; color: #333; line-height: 1.5; }
  }
}
.msg-time { text-align: center; font-size: 24rpx; color: #999; margin: 16rpx 0; }
.input-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; align-items: center; padding: 16rpx 24rpx; padding-bottom: calc(16rpx + constant(safe-area-inset-bottom)); padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); background: #FFF; box-sizing: content-box;
  .msg-input { flex: 1; height: 72rpx; padding: 0 24rpx; background: #F5F5F5; border-radius: 36rpx; font-size: 28rpx; border: 1rpx solid #E5E5E5; }
  .image-btn { margin-left: 16rpx; padding: 10rpx; }
  .send-btn { margin-left: 16rpx; padding: 16rpx 32rpx; background: #007AFF; border-radius: 36rpx;
    text { font-size: 28rpx; color: #FFF; }
  }
}
</style>
