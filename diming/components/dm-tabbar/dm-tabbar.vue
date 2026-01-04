<template>
  <view class="dm-tabbar">
    <!-- 左侧三个tab -->
    <view
      v-for="(item, index) in leftList"
      :key="item.pagePath"
      class="tabbar-item"
      @click="switchTab(index)"
    >
      <uni-icons
        :type="current === index ? item.selectedIcon : item.icon"
        :size="24"
        :color="current === index ? selectedColor : color"
      ></uni-icons>
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
        <uni-icons type="plusempty" size="28" color="#FFFFFF"></uni-icons>
      </view>
    </view>

    <!-- 右侧三个tab -->
    <view
      v-for="(item, index) in rightList"
      :key="item.pagePath"
      class="tabbar-item"
      @click="switchTab(index + 3)"
    >
      <uni-icons
        :type="current === (index + 3) ? item.selectedIcon : item.icon"
        :size="24"
        :color="current === (index + 3) ? selectedColor : color"
      ></uni-icons>
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
  name: 'DmTabbar',
  data() {
    return {
      current: 0,
      color: '#999999',
      selectedColor: '#007AFF',
      list: [
        {
          pagePath: '/pages/index/index',
          icon: 'home',
          selectedIcon: 'home-filled',
          text: '主页'
        },
        {
          pagePath: '/pages/help/index',
          icon: 'hand-up',
          selectedIcon: 'hand-up-filled',
          text: '互助'
        },
        {
          pagePath: '/pages/errand/index',
          icon: 'location',
          selectedIcon: 'location-filled',
          text: '跑腿'
        },
        {
          pagePath: '/pages/idle/index',
          icon: 'shop',
          selectedIcon: 'shop-filled',
          text: '闲置'
        },
        {
          pagePath: '/pages/message/index',
          icon: 'chat',
          selectedIcon: 'chat-filled',
          text: '消息'
        },
        {
          pagePath: '/pages/mine/index',
          icon: 'contact',
          selectedIcon: 'contact-filled',
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
      // 根据当前页面决定跳转到哪个发布页
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = '/' + currentPage.route

      // 如果在主页，检查当前选中的tab
      if (route === '/pages/index/index') {
        const globalData = getApp().globalData || {}
        const currentTab = globalData.currentIndexTab || '最新'

        // 根据主页当前tab决定发布类型
        const tabPublishMap = {
          '投票': '/pages/publish/vote',
          '恋爱': '/pages/publish/love'
        }

        const publishUrl = tabPublishMap[currentTab] || '/pages/publish/post'
        uni.navigateTo({ url: publishUrl })
        return
      }

      // 页面路径到发布页面的映射
      const publishMap = {
        '/pages/help/index': '/pages/publish/help',       // 互助(拍卖) -> 发布拍卖
        '/pages/errand/index': '/pages/publish/errand',   // 跑腿 -> 发布跑腿
        '/pages/idle/index': '/pages/publish/idle'        // 闲置 -> 发布闲置
      }

      const publishUrl = publishMap[route]

      if (publishUrl) {
        uni.navigateTo({ url: publishUrl })
      } else {
        // 消息页和我的页面，显示发布类型选择
        this.showPublishMenu()
      }
    },
    showPublishMenu() {
      uni.showActionSheet({
        itemList: ['发布帖子', '发布跑腿', '发布拍卖', '发布闲置', '发布投票', '发布交友'],
        success: (res) => {
          const urls = [
            '/pages/publish/post',
            '/pages/publish/errand',
            '/pages/publish/help',
            '/pages/publish/idle',
            '/pages/publish/vote',
            '/pages/publish/love'
          ]
          uni.navigateTo({ url: urls[res.tapIndex] })
        }
      })
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
}
</style>
