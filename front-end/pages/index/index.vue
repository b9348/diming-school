<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 搜索栏 -->
    <dm-search
      placeholder="请输入搜索关键词"
      :disabled="true"
      :show-filter="true"
      :show-switch="true"
      @click="goSearch"
      @filter="showFilter = true"
      @switch="switchCommunity"
    />

    <!-- 滚动区域 -->
    <scroll-view
      class="scroll-container"
      scroll-y
      :scroll-into-view="scrollIntoView"
      :style="{ height: actualScrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <!-- 轮播图 -->
      <dm-swiper :list="bannerList" @click="handleBannerClick" />

      <!-- 导航分类 -->
      <dm-nav v-if="currentTabName === '最新'" :list="navList" @click="handleNavClick" @more="goNavMore" />

      <!-- 今日热榜 -->
      <view class="hot-section">
        <text class="hot-title">今日热榜</text>
        <swiper class="hot-swiper" vertical :autoplay="true" :interval="3000" circular>
          <swiper-item v-for="(item, index) in hotList" :key="index" @click="goHotDetail(item)">
            <view class="hot-item">
              <text class="hot-rank">{{ index + 1 }}</text>
              <text class="hot-text ellipsis">{{ item.title }}</text>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 公告/活动/推荐 -->
      <view class="info-section" v-if="noticeInfo || activityInfo || recommendInfo">
        <view class="info-item notice-item" v-if="noticeInfo" @click="handleInfoClick(noticeInfo)">
          <text class="info-tag notice-tag">公告</text>
          <text class="info-divider">|</text>
          <text class="info-text ellipsis">{{ noticeInfo.content }}</text>
        </view>
        <view class="info-item activity-item" v-if="activityInfo" @click="handleInfoClick(activityInfo)">
          <text class="info-tag activity-tag">活动</text>
          <text class="info-divider">|</text>
          <text class="info-text ellipsis">{{ activityInfo.content }}</text>
        </view>
        <view class="info-item recommend-item" v-if="recommendInfo" @click="handleInfoClick(recommendInfo)">
          <text class="info-tag recommend-tag">{{ recommendInfo.tag || '推荐' }}</text>
          <text class="info-divider">|</text>
          <text class="info-text ellipsis">{{ recommendInfo.content }}</text>
        </view>
      </view>

      <!-- 内容分类Tabs -->
      <dm-tabs :list="tabList" :current="currentTab" @change="handleTabChange" />

      <!-- 互助群消息列表 -->
      <view v-if="currentTabName === '互助群'" class="group-message-list">
        <view
          v-for="(item, index) in groupMessages"
          :key="index"
          class="message-item"
          :class="{ mine: item.isMine }"
        >
          <!-- 顶部：头像、头衔、昵称（水平排列） -->
          <!-- 收到的消息：头像 头衔 昵称 -->
          <!-- 我的消息：头衔 昵称 头像 -->
          <view class="msg-header">
            <image v-if="!item.isMine" class="msg-avatar" :src="item.avatar" mode="aspectFill" />
            <view class="msg-badge" v-if="item.badge">{{ item.badge }}</view>
            <text class="msg-nickname">{{ item.nickname }}</text>
            <image v-if="item.isMine" class="msg-avatar" :src="item.avatar" mode="aspectFill" />
          </view>

          <!-- 消息内容（带序号） -->
          <view class="msg-bubble">
            <view class="msg-content">
              <text class="msg-number">{{ index + 1 }}、</text>
              <text class="msg-text" v-if="item.content">{{ item.content }}</text>
            </view>

            <!-- 图片列表 -->
            <view class="msg-images" v-if="item.images && item.images.length > 0">
              <image
                v-for="(img, imgIndex) in item.images"
                :key="imgIndex"
                class="msg-image"
                :src="img"
                mode="aspectFill"
                @click="previewImage(item.images, imgIndex)"
              />
            </view>
          </view>

          <!-- 时间（居中） -->
          <text class="msg-time">{{ item.time }}</text>
        </view>
        <!-- 底部留白 -->
        <view id="msg-bottom" class="message-list-bottom"></view>
      </view>

      <!-- 投票列表 -->
      <view v-else-if="currentTabName === '投票'" class="vote-list">
        <view
          v-for="(item, index) in postList"
          :key="index"
          class="vote-card"
          @click="goPostDetail(item)"
        >
          <text class="vote-title">{{ truncateText(item.title || item.content, 200) }}</text>

          <!-- 文字投票 -->
          <view v-if="item.voteType === 'text' && item.options" class="vote-options">
            <view
              v-for="(opt, optIdx) in item.options"
              :key="optIdx"
              class="vote-option"
            >
              <view class="option-content">
                <text class="option-text">{{ opt.text }}</text>
                <text class="option-count">{{ opt.count || 0 }}</text>
              </view>
              <view class="option-progress" :style="{ width: (opt.percent || 0) + '%' }"></view>
              <text class="option-percent">{{ (opt.percent || 0).toFixed(2) }}%</text>
            </view>
          </view>

          <!-- 图片投票 -->
          <view v-else-if="item.voteType === 'image' && item.options" class="vote-images">
            <view
              v-for="(opt, optIdx) in item.options.slice(0, 2)"
              :key="optIdx"
              class="vote-image-item"
            >
              <image class="vote-image" :src="opt.image" mode="aspectFill"></image>
              <text class="image-count">{{ opt.count || 0 }}</text>
              <view class="image-progress" :style="{ width: (opt.percent || 0) + '%' }"></view>
              <text class="image-desc">{{ opt.text }}</text>
            </view>
          </view>

          <view class="vote-footer">
            <view class="vote-info">
              <text class="vote-deadline">{{ item.deadline || item.time }}</text>
              <text class="vote-count">{{ item.viewCount || item.totalVotes || 0 }}人吃瓜</text>
            </view>
            <view class="vote-meta">
              <text v-if="item.forumName" class="vote-forum">{{ item.forumName }}</text>
              <view class="vote-user">
                <image class="user-avatar" :src="item.avatar || 'https://iph.href.lu/100x100?text=头像'" mode="aspectFill"></image>
                <text class="user-name">昵称：{{ item.nickname || '匿名' }}</text>
                <text class="vote-time">{{ item.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 帖子列表 -->
      <view v-else-if="currentTabName === '恋爱'" class="love-grid">
        <view
          v-for="(item, index) in postList"
          :key="index"
          class="love-item"
          @click="goPostDetail(item)"
        >
          <image class="love-image" :src="item.photo || '/static/default-avatar.png'" mode="aspectFill" />
          <view class="love-like">
            <text class="love-like-icon">♥</text>
            <text class="love-like-count">{{ item.likeCount || 0 }}</text>
          </view>
          <view class="love-info">
            <view class="love-row">
              <text class="info-birth">{{ item.birth || '未填写' }}</text>
              <text class="info-height">{{ item.height || '未填写' }}</text>
              <text class="info-gender" :class="item.gender === '男' ? 'gender-male' : 'gender-female'">{{ item.gender || '未填写' }}</text>
            </view>
            <view class="love-row">
              <text class="info-secondary">{{ item.education || '未填写' }}</text>
              <text class="info-secondary">{{ item.status || '未填写' }}</text>
              <text class="info-secondary">{{ item.location || '未填写' }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="post-list">
        <dm-card
          v-for="(item, index) in postList"
          :key="index"
          :data="item"
          @click="goPostDetail(item)"
          @like="handleLike(item)"
          @comment="handleComment(item)"
        />
      </view>

      <!-- 加载更多 -->
      <view v-if="currentTabName !== '互助群'" class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>

    <!-- 互助群输入框 -->
    <view v-if="currentTabName === '互助群'" class="group-input-bar">
      <view class="input-wrapper">
        <input
          v-model="groupInputText"
          type="text"
          placeholder="请输入消息"
          confirm-type="send"
          @confirm="sendGroupMessage"
        />
      </view>
      <view class="image-btn" @click="chooseImage">
        <uni-icons type="image" size="24" color="#999999"></uni-icons>
      </view>
      <view class="send-btn" @click="sendGroupMessage">
        <text>发送</text>
      </view>
    </view>

    <!-- 评论输入框 -->
    <dm-comment-input
      :visible="showCommentInput"
      placeholder="写评论..."
      @send="handleSendComment"
      @update:visible="showCommentInput = $event"
    />

    <!-- 筛选弹窗 -->
    <dm-filter
      :visible.sync="showFilter"
      :options="filterOptions || []"
      :value="filterValue"
      @confirm="handleFilterConfirm"
    />

    <!-- 自定义 TabBar -->
    <dm-tabbar />
  </view>
</template>

<script>
import { homeApi, postApi, voteApi, idleApi, errandApi, loveApi, helpApi, groupApi } from '@/api/index.js'

// 各tab的筛选配置
const COMMON_FILTER = [
  { key: 'sort', title: '排序方式', items: [{ label: '最新', value: 'latest' }, { label: '最热', value: 'hot' }, { label: '点赞最多', value: 'most_likes' }, { label: '评论最多', value: 'most_comments' }] },
  { key: 'contentType', title: '内容类型', items: [{ label: '不限', value: '' }, { label: '图文', value: 'image_text' }, { label: '文字', value: 'text' }, { label: '图片', value: 'image' }] },
  { key: 'timeRange', title: '发布时间', items: [{ label: '不限', value: '' }, { label: '一天内', value: '1d' }, { label: '三天内', value: '3d' }, { label: '一周内', value: '1w' }, { label: '半个月内', value: '15d' }, { label: '一个月内', value: '1m' }, { label: '三个月内', value: '3m' }, { label: '六个月内', value: '6m' }] }
]

const FILTER_CONFIG = {
  '最新': COMMON_FILTER,
  '树洞': COMMON_FILTER,
  '失物招领': COMMON_FILTER,
  '帖子': [
    { key: 'sort', title: '排序', items: [{ label: '最新', value: 'latest' }, { label: '最热', value: 'hot' }] },
    { key: 'category', title: '分类', items: [{ label: '全部', value: '' }, { label: '吐槽', value: 'tucao' }, { label: '提问', value: 'question' }, { label: '分享', value: 'share' }, { label: '日常', value: 'daily' }, { label: '其他', value: 'other' }] }
  ],
  '投票': [
    { key: 'sort', title: '排序方式', items: [{ label: '最新', value: 'latest' }, { label: '最热', value: 'hot' }, { label: '评论最多', value: 'most_comments' }, { label: '点赞最多', value: 'most_likes' }, { label: '参与数多', value: 'most_participants' }, { label: '票数多', value: 'most_votes' }] },
    { key: 'status', title: '投票状态', items: [{ label: '进行中', value: 'ongoing' }, { label: '待开始', value: 'pending' }, { label: '已结束', value: 'ended' }] },
    { key: 'remainTime', title: '剩余时间', type: 'input-range', minPlaceholder: '最少', maxPlaceholder: '最多' },
    { key: 'voteType', title: '投票类型', items: [{ label: '不限', value: '' }, { label: '文字', value: 'text' }, { label: '图文', value: 'image_text' }] },
    { key: 'timeRange', title: '发布时间', items: [{ label: '不限', value: '' }, { label: '一天内', value: '1d' }, { label: '三天内', value: '3d' }, { label: '一周内', value: '1w' }, { label: '半个月内', value: '15d' }, { label: '一个月内', value: '1m' }, { label: '三个月内', value: '3m' }, { label: '六个月内', value: '6m' }] }
  ],
  '闲置': [
    { key: 'sort', title: '排序', items: [{ label: '最新', value: 'latest' }, { label: '最热', value: 'hot' }, { label: '价格从低到高', value: 'price_asc' }, { label: '价格从高到低', value: 'price_desc' }] },
    { key: 'category', title: '分类', items: [{ label: '全部', value: '' }, { label: '数码', value: 'digital' }, { label: '服饰', value: 'clothing' }, { label: '书籍', value: 'book' }, { label: '生活', value: 'life' }, { label: '其他', value: 'other' }] },
    { key: 'condition', title: '成色', items: [{ label: '全部', value: '' }, { label: '全新', value: 'new' }, { label: '几乎全新', value: 'like_new' }, { label: '轻微使用', value: 'light_use' }, { label: '明显使用', value: 'heavy_use' }] }
  ],
  '跑腿': [
    { key: 'sort', title: '排序', items: [{ label: '最新', value: 'latest' }, { label: '最热', value: 'hot' }, { label: '赏金从低到高', value: 'reward_asc' }, { label: '赏金从高到低', value: 'reward_desc' }] },
    { key: 'status', title: '状态', items: [{ label: '全部', value: '' }, { label: '待接单', value: 'pending' }, { label: '进行中', value: 'ongoing' }, { label: '已完成', value: 'completed' }] },
    { key: 'type', title: '类型', items: [{ label: '全部', value: '' }, { label: '代取快递', value: 'express' }, { label: '代买东西', value: 'buy' }, { label: '代送物品', value: 'deliver' }, { label: '其他', value: 'other' }] }
  ],
  '恋爱': [
    { key: 'gender', title: '性别', items: [{ label: '女', value: 'female' }, { label: '男', value: 'male' }] },
    { key: 'birthYear', title: '出生年月', type: 'input-range', minPlaceholder: '最小', maxPlaceholder: '最大' },
    { key: 'height', title: '身高范围', type: 'input-range', minPlaceholder: '最低', maxPlaceholder: '最高' },
    { key: 'weight', title: '体重范围', type: 'input-range', minPlaceholder: '最低', maxPlaceholder: '最高' },
    { key: 'education', title: '学历', items: [{ label: '本科', value: 'bachelor' }, { label: '大专', value: 'college' }, { label: '硕士', value: 'master' }, { label: '博士', value: 'doctor' }] },
    { key: 'studyType', title: '', items: [{ label: '全日制', value: 'fulltime' }, { label: '非全日制', value: 'parttime' }] },
    { key: 'occupation', title: '职业', type: 'picker', items: [{ label: '不限', value: '' }, { label: '学生', value: 'student' }, { label: '上班族', value: 'employee' }, { label: '自由职业', value: 'freelance' }, { label: '其他', value: 'other' }] },
    { key: 'location', title: '现居地', type: 'picker', items: [{ label: '不限', value: '' }, { label: '北京', value: 'beijing' }, { label: '上海', value: 'shanghai' }, { label: '广州', value: 'guangzhou' }, { label: '深圳', value: 'shenzhen' }, { label: '其他', value: 'other' }] },
    { key: 'hometown', title: '籍贯', type: 'picker', items: [{ label: '不限', value: '' }, { label: '北京', value: 'beijing' }, { label: '上海', value: 'shanghai' }, { label: '广东', value: 'guangdong' }, { label: '江苏', value: 'jiangsu' }, { label: '浙江', value: 'zhejiang' }, { label: '其他', value: 'other' }] },
    { key: 'noSmoke', title: '不抽烟', type: 'switch' },
    { key: 'noDrink', title: '不喝酒', type: 'switch' },
    { key: 'noSnore', title: '不打呼噜', type: 'switch' },
    { key: 'timeRange', title: '发布时间', items: [{ label: '一天内', value: '1d' }, { label: '三天内', value: '3d' }, { label: '一周内', value: '1w' }, { label: '半个月内', value: '15d' }] }
  ],
  '拍卖': [
    { key: 'sort', title: '排序', items: [{ label: '最新', value: 'latest' }, { label: '最热', value: 'hot' }, { label: '当前价从低到高', value: 'price_asc' }, { label: '当前价从高到低', value: 'price_desc' }] },
    { key: 'status', title: '状态', items: [{ label: '全部', value: '' }, { label: '进行中', value: 'ongoing' }, { label: '已结束', value: 'ended' }] },
    { key: 'category', title: '分类', items: [{ label: '全部', value: '' }, { label: '数码', value: 'digital' }, { label: '服饰', value: 'clothing' }, { label: '书籍', value: 'book' }, { label: '生活', value: 'life' }, { label: '其他', value: 'other' }] }
  ],
  '互助群': []
}

// tabBar 页面路径列表
const TAB_BAR_PAGES = [
  '/pages/index/index',
  '/pages/help/index',
  '/pages/errand/index',
  '/pages/idle/index',
  '/pages/message/index',
  '/pages/mine/index'
]

export default {
  data() {
    return {
      statusBarHeight: 0,
      scrollHeight: 0,
      currentTab: 0,
      loading: false,
      noMore: false,
      page: 1,
      bannerList: [],
      navList: [],
      hotList: [],
      noticeInfo: null,
      activityInfo: null,
      recommendInfo: null,
      tabList: ['最新'],
      postList: [],
      groupMessages: [],
      groupInputText: '',
      filterValue: {},
      showFilter: false,
      scrollIntoView: '',
      showCommentInput: false,
      currentCommentTarget: null
    }
  },
  computed: {
    currentTabName() {
      return this.tabList[this.currentTab] || '最新'
    },
    currentFilters() {
      return FILTER_CONFIG[this.currentTabName] || []
    },
    filterOptions() {
      const filters = this.currentFilters
      if (!filters || !Array.isArray(filters) || filters.length === 0) return []
      return filters.map(f => ({
        title: f.title,
        key: f.key,
        items: f.items || [],
        type: f.type,
        min: f.min,
        max: f.max,
        unit: f.unit,
        step: f.step,
        minPlaceholder: f.minPlaceholder,
        maxPlaceholder: f.maxPlaceholder
      }))
    },
    actualScrollHeight() {
      // 如果是互助群tab，需要减去输入框的高度
      if (this.currentTabName === '互助群') {
        const inputBarHeight = uni.upx2px(100) // 输入框高度约100rpx
        return this.scrollHeight - inputBarHeight
      }
      return this.scrollHeight
    }
  },
  onLoad() {
    this.getSystemInfo()
    this.loadHomeData()
    this.loadPostList()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight
      const searchBarHeight = uni.upx2px(104)
      const tabBarHeight = uni.upx2px(100)
      this.scrollHeight = systemInfo.windowHeight - this.statusBarHeight - searchBarHeight - tabBarHeight
    },
    async loadHomeData() {
      const data = await homeApi.getData()
      this.bannerList = data.bannerList || []
      this.navList = data.navList || []
      this.hotList = data.hotList || []
      this.noticeInfo = data.noticeInfo || null
      this.activityInfo = data.activityInfo || null
      this.recommendInfo = data.recommendInfo || null
      this.tabList = data.tabList || ['最新']

      getApp().globalData = getApp().globalData || {}
      getApp().globalData.currentIndexTab = this.tabList[this.currentTab]
    },
    async loadNoticeInfo() {
      const tabName = this.currentTabName
      const data = await homeApi.getData({ tab: tabName })
      this.noticeInfo = data.noticeInfo || null
      this.activityInfo = data.activityInfo || null
      this.recommendInfo = data.recommendInfo || null
    },
    async loadPostList() {
      if (this.loading || this.noMore) return
      this.loading = true

      const tabName = this.currentTabName
      const params = {
        page: this.page,
        pageSize: 10,
        ...this.filterValue
      }

      let data
      try {
        // 根据tab调用不同的API
        switch (tabName) {
          case '投票':
            data = await voteApi.getList(params)
            break
          case '闲置':
            data = await idleApi.getList(params)
            break
          case '跑腿':
            data = await errandApi.getList(params)
            break
          case '恋爱':
            data = await loveApi.getList(params)
            break
          case '拍卖':
            data = await helpApi.getList(params)
            break
          default:
            params.tab = tabName
            data = await postApi.getList(params)
        }

        if (data.list.length === 0) {
          this.noMore = true
        } else {
          this.postList = [...this.postList, ...data.list]
          this.page++
        }
      } catch (e) {
        console.error('加载列表失败', e)
      }
      this.loading = false
    },
    // 通用页面跳转方法，自动判断是否为 tabBar 页面
    navigateTo(url) {
      if (!url) return
      // 提取路径部分（去除查询参数）
      const path = url.split('?')[0]
      // 确保路径以 / 开头
      const normalizedPath = path.startsWith('/') ? path : '/' + path

      if (TAB_BAR_PAGES.includes(normalizedPath)) {
        // tabBar 页面使用 switchTab（注意：switchTab 不支持带参数）
        uni.switchTab({ url: normalizedPath })
      } else {
        // 普通页面使用 navigateTo
        uni.navigateTo({ url })
      }
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    switchCommunity() {
      uni.navigateTo({ url: '/pages/region/index' })
    },
    handleBannerClick({ item, index }) {
      if (item.url) {
        this.navigateTo(item.url)
      }
    },
    handleNavClick({ item, index }) {
      if (item.url) {
        this.navigateTo(item.url)
      } else {
        uni.showToast({ title: item.name, icon: 'none' })
      }
    },
    goNavMore() {
      uni.showToast({ title: '更多分类', icon: 'none' })
    },
    handleInfoClick(item) {
      // 优先使用 url 跳转，否则根据 postType 跳转
      if (item.url) {
        this.navigateTo(item.url)
      } else if (item.postId && item.postType) {
        const detailPageMap = {
          'post': '/pages/post/detail',
          'vote': '/pages/vote/detail',
          'idle': '/pages/idle/detail',
          'errand': '/pages/errand/detail',
          'love': '/pages/love/detail',
          'help': '/pages/help/detail'
        }
        const detailUrl = detailPageMap[item.postType] || '/pages/post/detail'
        uni.navigateTo({ url: detailUrl + '?id=' + item.postId })
      } else {
        uni.showToast({ title: item.content, icon: 'none' })
      }
    },
    handleTabChange(index) {
      this.currentTab = index
      this.page = 1
      this.postList = []
      this.noMore = false
      this.filterValue = {}

      const tabName = this.tabList[index]

      // 如果是互助群tab，加载群消息
      if (tabName === '互助群') {
        this.loadGroupMessages()
      } else {
        this.loadPostList()
      }

      this.loadNoticeInfo()

      getApp().globalData = getApp().globalData || {}
      getApp().globalData.currentIndexTab = tabName
    },
    handleFilterConfirm(value) {
      this.filterValue = value
      this.page = 1
      this.postList = []
      this.noMore = false
      this.loadPostList()
    },
    loadMore() {
      this.loadPostList()
    },
    goHotDetail(item) {
      // 根据 postType 跳转到对应的详情页
      if (item.url) {
        this.navigateTo(item.url)
      } else {
        const detailPageMap = {
          'post': '/pages/post/detail',
          'vote': '/pages/vote/detail',
          'idle': '/pages/idle/detail',
          'errand': '/pages/errand/detail',
          'love': '/pages/love/detail',
          'help': '/pages/help/detail'
        }
        const detailUrl = detailPageMap[item.postType] || '/pages/post/detail'
        uni.navigateTo({ url: detailUrl + '?id=' + (item.postId || item.id) })
      }
    },
    goPostDetail(item) {
      const detailPageMap = {
        '投票': '/pages/vote/detail',
        '恋爱': '/pages/love/detail',
        '闲置': '/pages/idle/detail',
        '跑腿': '/pages/errand/detail',
        '拍卖': '/pages/help/detail'
      }
      const detailUrl = detailPageMap[this.currentTabName] || '/pages/post/detail'
      uni.navigateTo({ url: detailUrl + '?id=' + item.id })
    },
    async handleLike(item) {
      if (item.isLiked) return
      try {
        const tabName = this.currentTabName
        let api
        switch (tabName) {
          case '投票':
            api = voteApi
            break
          case '恋爱':
            api = loveApi
            break
          default:
            api = postApi
        }
        await api.like(item.id)
        item.likeCount++
        item.isLiked = true
      } catch (e) {
        console.error('点赞失败', e)
      }
    },
    handleComment(item) {
      this.currentCommentTarget = item
      this.showCommentInput = true
    },
    async handleSendComment(content) {
      if (!this.currentCommentTarget) return
      try {
        const tabName = this.currentTabName
        let api
        switch (tabName) {
          case '投票':
            api = voteApi
            break
          case '恋爱':
            api = loveApi
            break
          default:
            api = postApi
        }
        await api.comment(this.currentCommentTarget.id, content)
        this.currentCommentTarget.commentCount++
        uni.showToast({ title: '评论成功', icon: 'success' })
      } catch (e) {
        console.error('评论失败', e)
        uni.showToast({ title: '评论失败', icon: 'none' })
      }
      this.currentCommentTarget = null
    },
    async loadGroupMessages() {
      try {
        const data = await groupApi.getMessages()
        this.groupMessages = data.list || []
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (e) {
        console.error('加载群消息失败', e)
      }
    },
    async sendGroupMessage() {
      if (!this.groupInputText.trim()) {
        return
      }

      const content = this.groupInputText
      this.groupInputText = ''

      // 立即添加到消息列表
      const newMessage = {
        id: Date.now(),
        nickname: '我',
        avatar: 'https://iph.href.lu/100x100?text=我',
        badge: '头衔', // 实际应从用户信息获取
        content: content,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isMine: true
      }
      this.groupMessages.push(newMessage)

      this.$nextTick(() => {
        this.scrollToBottom()
      })

      try {
        await groupApi.sendMessage({ content: content })
      } catch (e) {
        console.error('发送消息失败', e)
        uni.showToast({ title: '发送失败', icon: 'none' })
        // 发送失败，移除刚添加的消息
        const index = this.groupMessages.findIndex(msg => msg.id === newMessage.id)
        if (index > -1) {
          this.groupMessages.splice(index, 1)
        }
      }
    },
    scrollToBottom() {
      this.scrollIntoView = ''
      this.$nextTick(() => {
        this.scrollIntoView = 'msg-bottom'
      })
    },
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          // 这里可以上传图片并发送
          uni.showToast({ title: '图片功能开发中', icon: 'none' })
        }
      })
    },
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
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

.status-bar {
  background-color: #FFFFFF;
}

.scroll-container {
  background-color: #F8F8F8;
}

.hot-section {
  margin: 20rpx 24rpx;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  display: flex;
  align-items: center;

  .hot-title {
    flex-shrink: 0;
    font-size: 28rpx;
    color: #333333;
    font-weight: 600;
    margin-right: 20rpx;
  }

  .hot-swiper {
    flex: 1;
    height: 40rpx;

    .hot-item {
      display: flex;
      align-items: center;
      height: 40rpx;

      .hot-rank {
        width: 36rpx;
        font-size: 26rpx;
        color: #FF9500;
        font-weight: 600;
      }

      .hot-text {
        flex: 1;
        font-size: 26rpx;
        color: #333333;
      }
    }
  }
}

.info-section {
  margin: 0 24rpx 20rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;

  .info-item {
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx;
    position: relative;

    &.notice-item {
      border-bottom: 2rpx solid #007AFF;
    }

    &.activity-item {
      border-bottom: 1rpx solid #F5F5F5;
    }

    &.recommend-item {
      // 最后一项无边框
    }

    .info-tag {
      flex-shrink: 0;
      font-size: 26rpx;
      font-weight: 500;

      &.notice-tag {
        color: #FF9500;
        background-color: #FFF3E0;
        padding: 4rpx 12rpx;
        border-radius: 0;
      }

      &.activity-tag {
        color: #333333;
        background-color: #E8F4F8;
        padding: 4rpx 12rpx;
        border-radius: 0;
      }

      &.recommend-tag {
        color: #333333;
        background-color: #E8F8E8;
        padding: 4rpx 12rpx;
        border-radius: 0;
      }
    }

    .info-divider {
      margin: 0 16rpx;
      color: #CCCCCC;
      font-size: 26rpx;
    }

    .info-text {
      flex: 1;
      font-size: 26rpx;
      color: #666666;
    }
  }
}

.post-list {
  padding-bottom: 20rpx;
}

.love-grid {
  padding: 20rpx 24rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .love-item {
    width: 340rpx;
    background-color: #FFFFFF;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    position: relative;

    .love-image {
      width: 100%;
      height: 400rpx;
      background-color: #F5F5F5;
    }

    .love-like {
      position: absolute;
      bottom: 140rpx;
      right: 20rpx;
      display: flex;
      align-items: center;
      padding: 8rpx 20rpx;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 24rpx;

      .love-like-icon {
        font-size: 28rpx;
        color: #FFFFFF;
        margin-right: 8rpx;
      }

      .love-like-count {
        font-size: 24rpx;
        color: #FFFFFF;
      }
    }

    .love-info {
      padding: 24rpx 20rpx;

      .love-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .info-birth {
          font-size: 26rpx;
          color: #333333;
          font-weight: 600;
          flex: 1;
          text-align: left;
        }

        .info-height {
          font-size: 24rpx;
          color: #FF6B6B;
          font-weight: 500;
          flex: 1;
          text-align: center;
        }

        .info-gender {
          font-size: 24rpx;
          font-weight: 500;
          flex: 1;
          text-align: right;

          &.gender-male {
            color: #4A90E2;
          }

          &.gender-female {
            color: #FF6B9D;
          }
        }

        .info-secondary {
          font-size: 22rpx;
          color: #999999;
          flex: 1;
          text-align: center;

          &:first-child {
            text-align: left;
          }

          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }
}

.vote-list {
  padding: 0 24rpx;

  .vote-card {
    margin-bottom: 20rpx;
    padding: 24rpx;
    background-color: #FFFFFF;
    border-radius: 16rpx;

    .vote-title {
      display: block;
      font-size: 28rpx;
      color: #333333;
      line-height: 1.6;
      margin-bottom: 24rpx;
      word-break: break-all;
    }

    .vote-options {
      .vote-option {
        position: relative;
        padding: 20rpx;
        margin-bottom: 16rpx;
        background-color: #F8F8F8;
        border-radius: 12rpx;
        overflow: hidden;

        .option-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8rpx;

          .option-text {
            font-size: 28rpx;
            color: #333333;
            flex: 1;
          }
          .option-count {
            font-size: 32rpx;
            color: #333333;
            font-weight: 600;
            margin-left: 16rpx;
          }
        }

        .option-progress {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          background: linear-gradient(90deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.05) 100%);
          border-radius: 12rpx;
          transition: width 0.3s ease;
        }

        .option-percent {
          position: relative;
          z-index: 1;
          font-size: 24rpx;
          color: #666666;
          display: block;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .vote-images {
      display: flex;
      gap: 16rpx;
      margin-bottom: 16rpx;

      .vote-image-item {
        flex: 1;
        position: relative;

        .vote-image {
          width: 100%;
          height: 340rpx;
          border-radius: 12rpx;
          display: block;
        }

        .image-count {
          position: absolute;
          right: 16rpx;
          bottom: 80rpx;
          font-size: 48rpx;
          color: #FFFFFF;
          font-weight: 700;
          text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
          z-index: 2;
        }

        .image-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 60rpx;
          height: 8rpx;
          background-color: #007AFF;
          border-radius: 4rpx;
          z-index: 2;
        }

        .image-desc {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12rpx 16rpx;
          font-size: 24rpx;
          color: #FFFFFF;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
          border-radius: 0 0 12rpx 12rpx;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .vote-footer {
      margin-top: 24rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #F0F0F0;

      .vote-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .vote-deadline {
          font-size: 24rpx;
          color: #FF6B00;
          font-weight: 500;
        }
        .vote-count {
          font-size: 24rpx;
          color: #BBBBBB;
        }
      }

      .vote-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .vote-forum {
          font-size: 24rpx;
          color: #007AFF;
          padding: 4rpx 16rpx;
          background-color: rgba(0, 122, 255, 0.1);
          border-radius: 4rpx;
          margin-right: 16rpx;
        }

        .vote-user {
          flex: 1;
          display: flex;
          align-items: center;

          .user-avatar {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            margin-right: 12rpx;
          }
          .user-name {
            font-size: 24rpx;
            color: #666666;
            margin-right: 16rpx;
          }
          .vote-time {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
    }
  }
}

.group-message-list {
  padding: 20rpx 24rpx;

  .message-item {
    margin-bottom: 32rpx;

    // 我的消息：右对齐
    &.mine {
      .msg-header {
        justify-content: flex-end;
      }

      .msg-badge {
        margin-right: 0;
        margin-left: 12rpx;
      }

      .msg-bubble {
        margin-left: auto;
      }
    }

    // 顶部：头像、头衔、昵称（水平排列）
    .msg-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .msg-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        flex-shrink: 0;

        // 收到的消息：头像在左侧，右边距
        &:first-child {
          margin-right: 12rpx;
        }

        // 我的消息：头像在右侧，左边距
        &:last-child {
          margin-left: 12rpx;
        }
      }

      .msg-badge {
        padding: 4rpx 12rpx;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border-radius: 8rpx;
        font-size: 20rpx;
        color: #FFFFFF;
        margin-right: 12rpx;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .msg-nickname {
        font-size: 24rpx;
        color: #666666;
      }
    }

    // 消息内容（带序号）
    .msg-bubble {
      padding: 24rpx;
      background: #FFFFFF;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      margin-bottom: 8rpx;

      .msg-content {
        display: flex;
        align-items: flex-start;

        .msg-number {
          font-size: 28rpx;
          color: #333333;
          font-weight: 600;
          flex-shrink: 0;
        }

        .msg-text {
          flex: 1;
          font-size: 28rpx;
          color: #333333;
          line-height: 1.6;
          word-break: break-all;
        }
      }

      // 图片列表
      .msg-images {
        margin-top: 16rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .msg-image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 12rpx;
          background-color: #F5F5F5;
          margin-right: 12rpx;
          margin-bottom: 12rpx;

          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }

      // 一张图片时的特殊样式
      &.has-one-image .msg-images .msg-image {
        width: 100%;
        height: 400rpx;
        margin-right: 0;
      }

      // 两张图片时的特殊样式
      &.has-two-images .msg-images .msg-image {
        width: calc((100% - 12rpx) / 2);
        height: 260rpx;

        &:nth-child(2) {
          margin-right: 0;
        }
      }
    }

    // 时间（居中）
    .msg-time {
      display: block;
      text-align: center;
      font-size: 22rpx;
      color: #999999;
    }
  }

  .message-list-bottom {
    height: 80rpx;
  }
}

.group-input-bar {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  border-top: 1rpx solid #F5F5F5;
  z-index: 998;
  box-sizing: content-box;

  .input-wrapper {
    flex: 1;
    height: 72rpx;
    padding: 0 24rpx;
    background: #F5F5F5;
    border-radius: 36rpx;
    border: 1rpx solid #E5E5E5;

    input {
      height: 100%;
      font-size: 28rpx;
      color: #333333;

      &::placeholder {
        color: #999999;
      }
    }
  }

  .image-btn {
    margin-left: 16rpx;
    padding: 10rpx;
  }

  .send-btn {
    margin-left: 16rpx;
    padding: 16rpx 32rpx;
    background: #007AFF;
    border-radius: 36rpx;

    text {
      font-size: 28rpx;
      color: #FFFFFF;
    }
  }
}

.load-more {
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
}
</style>
