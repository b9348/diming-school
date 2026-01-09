const { successResponse } = require('../utils/response')

/**
 * 模拟数据库中被管理员标记的帖子
 * 实际项目中应从数据库查询 isNotice/isActivity/isRecommend/isHot 等标记的帖子
 *
 * postType 说明：
 * - post: 普通帖子 -> /pages/post/detail
 * - vote: 投票 -> /pages/vote/detail
 * - idle: 闲置 -> /pages/idle/detail
 * - errand: 跑腿 -> /pages/errand/detail
 * - love: 恋爱 -> /pages/love/detail
 * - help: 互助拍卖 -> /pages/help/detail
 */

// 帖子类型对应的详情页路径
const POST_TYPE_DETAIL_MAP = {
  post: '/pages/post/detail',
  vote: '/pages/vote/detail',
  idle: '/pages/idle/detail',
  errand: '/pages/errand/detail',
  love: '/pages/love/detail',
  help: '/pages/help/detail'
}

// 根据帖子类型和ID生成跳转URL
const getPostDetailUrl = (postType, postId) => {
  const basePath = POST_TYPE_DETAIL_MAP[postType] || '/pages/post/detail'
  return `${basePath}?id=${postId}`
}

// 模拟被管理员标记的公告/活动/推荐帖子（按tab分类）
const MARKED_POSTS_BY_TAB = {
  '最新': {
    notice: { postId: 101, postType: 'post', content: '欢迎使用递明校园，这是一个专属于大学生的社交生活服务平台' },
    activity: { postId: 102, postType: 'post', content: '校园歌手大赛正在火热报名中，快来展示你的才艺吧' },
    recommend: { postId: 103, postType: 'post', tag: '推荐', content: '新用户专享：首次发布帖子可获得积分奖励' }
  },
  '树洞': {
    notice: { postId: 201, postType: 'post', content: '树洞功能升级啦，现在可以匿名分享你的心声和秘密' },
    activity: { postId: 202, postType: 'post', content: '树洞征文活动火热进行中，分享你的故事，赢取丰厚奖品' },
    recommend: { postId: 203, postType: 'post', tag: '精选', content: '树洞精选：本周热门话题汇总' }
  },
  '失物招领': {
    notice: { postId: 301, postType: 'idle', content: '失物招领平台上线啦，再也不用担心丢失物品找不到主人了' },
    activity: { postId: 302, postType: 'idle', content: '寻物成功奖励活动，帮助他人找到失物可获得积分奖励' },
    recommend: { postId: 303, postType: 'idle', tag: '热门', content: '近期失物高频地点：图书馆、食堂、教学楼' }
  },
  '投票': {
    notice: { postId: 401, postType: 'vote', content: '投票功能全面升级，支持多种投票类型' },
    activity: { postId: 402, postType: 'vote', content: '热门投票活动：年度最受欢迎社团评选火热进行中' },
    recommend: { postId: 403, postType: 'vote', tag: '参与', content: '参与投票赢积分，每天参与三次投票可获得额外奖励' }
  },
  '恋爱': {
    notice: { postId: 501, postType: 'love', content: '表白墙全新上线，勇敢表达你的心意' },
    activity: { postId: 502, postType: 'love', content: '520心动季活动火热进行中，表白成功可享情侣专属福利' },
    recommend: { postId: 503, postType: 'love', tag: '热门', content: '本月最佳情侣展示，快来学习表白技巧' }
  },
  '互助群': {
    notice: { postId: 601, postType: 'help', content: '互助群功能上线，同学之间互相帮助，共同进步' },
    activity: { postId: 602, postType: 'help', content: '互助之星评选活动，帮助他人最多的同学将获得荣誉证书' },
    recommend: { postId: 603, postType: 'help', tag: '推荐', content: '学霸互助群已成立，学习问题随时提问' }
  }
}

// 模拟热榜帖子（按热度排序的帖子）
const HOT_POSTS = [
  { postId: 1001, postType: 'post', title: '今天的食堂新出了什么菜品，大家快来看看' },
  { postId: 1002, postType: 'post', title: '期末考试复习资料分享，需要的同学来领取' },
  { postId: 1003, postType: 'vote', title: '校园歌手大赛报名开始了，有才艺的同学别错过' },
  { postId: 1004, postType: 'post', title: '图书馆自习室预约攻略，期末必看' },
  { postId: 1005, postType: 'post', title: '校园跑步打卡活动开始啦，一起运动吧' }
]

// 构建公告/活动/推荐信息（包含帖子来源）
const buildInfoByTab = (tab) => {
  const markedPosts = MARKED_POSTS_BY_TAB[tab] || MARKED_POSTS_BY_TAB['最新']

  return {
    noticeInfo: markedPosts.notice ? {
      postId: markedPosts.notice.postId,
      postType: markedPosts.notice.postType,
      type: 'notice',
      content: markedPosts.notice.content,
      url: getPostDetailUrl(markedPosts.notice.postType, markedPosts.notice.postId)
    } : null,
    activityInfo: markedPosts.activity ? {
      postId: markedPosts.activity.postId,
      postType: markedPosts.activity.postType,
      type: 'activity',
      content: markedPosts.activity.content,
      url: getPostDetailUrl(markedPosts.activity.postType, markedPosts.activity.postId)
    } : null,
    recommendInfo: markedPosts.recommend ? {
      postId: markedPosts.recommend.postId,
      postType: markedPosts.recommend.postType,
      type: 'recommend',
      tag: markedPosts.recommend.tag || '推荐',
      content: markedPosts.recommend.content,
      url: getPostDetailUrl(markedPosts.recommend.postType, markedPosts.recommend.postId)
    } : null
  }
}

// 构建热榜列表（包含帖子来源）
const buildHotList = () => {
  return HOT_POSTS.map(post => ({
    id: post.postId,
    postId: post.postId,
    postType: post.postType,
    title: post.title,
    url: getPostDetailUrl(post.postType, post.postId)
  }))
}

const getData = (req, res) => {
  const { tab } = req.query
  const info = buildInfoByTab(tab || '最新')

  const data = {
    bannerList: [
      { id: 1, image: 'https://iph.href.lu/750x300?text=轮播图1', url: '' },
      { id: 2, image: 'https://iph.href.lu/750x300?text=轮播图2', url: '' },
      { id: 3, image: 'https://iph.href.lu/750x300?text=轮播图3', url: '' }
    ],
    navList: [
      { id: 1, name: '秘密树洞的一个', icon: '', url: '/pages/post/index' },
      { id: 2, name: '官方的大大外卖', icon: '', url: '/pages/errand/index' },
      { id: 3, name: '表白墙哦哦哦哦', icon: '', url: '/pages/love/index' },
      { id: 4, name: '失物招领阿萨德', icon: '', url: '/pages/idle/index' },
      { id: 5, name: '互助群', icon: '', url: '/pages/help/index' },
      { id: 6, name: '投票', icon: '', url: '/pages/vote/index' },
      { id: 7, name: '校园跑腿', icon: '', url: '/pages/errand/index' },
      { id: 8, name: '闲置习交流市场', icon: '', url: '/pages/idle/index' },
      { id: 9, name: '社团活动', icon: '', url: '' },
      { id: 10, name: '学习交流习交流', icon: '', url: '' },
      { id: 11, name: '兼职信息习交流', icon: '', url: '' },
      { id: 12, name: '校园资讯', icon: '', url: '' },
      { id: 13, name: '运动打卡', icon: '', url: '' },
      { id: 14, name: '美食推荐习交流', icon: '', url: '' },
      { id: 15, name: '租房信息', icon: '', url: '' },
      { id: 16, name: '考研考习交流公', icon: '', url: '' },
      { id: 17, name: '技能分享', icon: '', url: '' }
    ],
    hotList: buildHotList(),
    noticeInfo: info.noticeInfo,
    activityInfo: info.activityInfo,
    recommendInfo: info.recommendInfo,
    tabList: ['最新', '树洞', '失物招领', '投票', '恋爱', '互助群']
  }

  successResponse(res, data)
}

module.exports = {
  getData
}
