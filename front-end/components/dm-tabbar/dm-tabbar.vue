<template>
  <view class="dm-tabbar">
    <!-- 左侧三个tab -->
    <view
      v-for="(item, index) in leftList"
      :key="item.pagePath"
      class="tabbar-item"
      @click="switchTab(index)"
    >
      <text
        :class="'tn-icon-' + (current === index ? item.selectedIcon : item.icon)"
        class="tabbar-icon"
        :style="{ color: current === index ? selectedColor : color }"
      ></text>
      <text
        class="tabbar-text"
        :style="{ color: current === index ? selectedColor : color }"
      >
        {{ item.text }}
      </text>
    </view>

    <!-- 中间发布按钮 -->
    <view class="tabbar-item publish-item" @click="goPublish">
      <view class="publish-btn">
        <text class="tn-icon-add publish-icon"></text>
      </view>
    </view>

    <!-- 右侧三个tab -->
    <view
      v-for="(item, index) in rightList"
      :key="item.pagePath"
      class="tabbar-item"
      @click="switchTab(index + 3)"
    >
      <text
        :class="'tn-icon-' + (current === (index + 3) ? item.selectedIcon : item.icon)"
        class="tabbar-icon"
        :style="{ color: current === (index + 3) ? selectedColor : color }"
      ></text>
      <text
        class="tabbar-text"
        :style="{ color: current === (index + 3) ? selectedColor : color }"
      >
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      color: '#999999',
      selectedColor: '#007AFF',
      list: [
        {
          pagePath: '/pages/index/index',
          icon: 'home',
          selectedIcon: 'home-fill',
          text: '主页'
        },
        {
          pagePath: '/pages/help/index',
          icon: 'caring',
          selectedIcon: 'caring-fill',
          text: '互助'
        },
        {
          pagePath: '/pages/errand/index',
          icon: 'errands',
          selectedIcon: 'errands-fill',
          text: '跑腿'
        },
        {
          pagePath: '/pages/idle/index',
          icon: 'shop',
          selectedIcon: 'shop-fill',
          text: '闲置'
        },
        {
          pagePath: '/pages/message/index',
          icon: 'message',
          selectedIcon: 'message-fill',
          text: '消息'
        },
        {
          pagePath: '/pages/mine/index',
          icon: 'my',
          selectedIcon: 'my-fill',
          text: '我'
        }
      ]
    }
  },
  computed: {
    leftList() {
      return this.list.slice(0, 3)
    },
    rightList() {
      return this.list.slice(3, 6)
    }
  },
  mounted() {
    this.updateCurrent()
  },
  methods: {
    updateCurrent() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = '/' + currentPage.route

      const index = this.list.findIndex(item => item.pagePath === route)
      if (index !== -1) {
        this.current = index
      }
    },
    switchTab(index) {
      if (this.current === index) return

      const item = this.list[index]
      uni.switchTab({
        url: item.pagePath
      })
    },
    goPublish() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = '/' + currentPage.route

      if (route === '/pages/index/index') {
        const currentTab = getApp().globalData?.currentIndexTab || '最新'
        const tabPublishMap = {
          '最新': '/pages/publish/post',
          '帖子': '/pages/publish/post',
          '投票': '/pages/publish/vote',
          '闲置': '/pages/publish/idle',
          '跑腿': '/pages/publish/errand',
          '恋爱': '/pages/publish/love',
          '拍卖': '/pages/publish/help',
          '互助群': '/pages/publish/post'
        }
        const publishUrl = tabPublishMap[currentTab] || '/pages/publish/post'
        uni.navigateTo({ url: publishUrl })
        return
      }

      const publishMap = {
        '/pages/help/index': '/pages/publish/help',
        '/pages/errand/index': '/pages/publish/errand',
        '/pages/idle/index': '/pages/publish/idle'
      }

      const publishUrl = publishMap[route] || '/pages/publish/post'
      uni.navigateTo({ url: publishUrl })
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border-top: 1px solid #E5E5E5;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  box-sizing: content-box;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  height: 50px;
  box-sizing: border-box;
}

.tabbar-icon {
  font-size: 24px;
}

.tabbar-text {
  font-size: 10px;
  margin-top: 2px;
}

.publish-item {
  position: relative;
  height: 50px;

  .publish-btn {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 56px;
    background-color: #333333;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .publish-icon {
    font-size: 28px;
    color: #FFFFFF;
  }
}
</style>
