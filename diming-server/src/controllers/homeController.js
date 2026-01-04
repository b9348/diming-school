const { successResponse } = require('../utils/response')

// 获取首页数据
const getData = (req, res) => {
  const data = {
    // 轮播图
    bannerList: [
      { id: 1, image: 'https://iph.href.lu/750x300?text=轮播图1', url: '' },
      { id: 2, image: 'https://iph.href.lu/750x300?text=轮播图2', url: '' },
      { id: 3, image: 'https://iph.href.lu/750x300?text=轮播图3', url: '' }
    ],
    // 导航分类
    navList: [
      { id: 1, name: '秘密校园', icon: '', url: '' },
      { id: 2, name: '官方外卖代码', icon: '', url: '' },
      { id: 3, name: '表白墙', icon: '', url: '' },
      { id: 4, name: '失物招领', icon: '', url: '' },
      { id: 5, name: '互助群', icon: '', url: '' },
      { id: 6, name: '投票', icon: '', url: '/pages/vote/index' }
    ],
    // 热榜
    hotList: [
      { id: 1, title: '今天的食堂新出了什么菜品，大家快来看看' },
      { id: 2, title: '期末考试复习资料分享，需要的同学来领取' },
      { id: 3, title: '校园歌手大赛报名开始了，有才艺的同学别错过' },
      { id: 4, title: '图书馆自习室预约攻略，期末必看' },
      { id: 5, title: '校园跑步打卡活动开始啦，一起运动吧' }
    ],
    // 公告
    noticeList: [
      { id: 1, tag: '公告', content: '欢迎使用递明校园，这是一个专属于大学生的社交生活服务平台' },
      { id: 2, tag: '活动', content: '校园歌手大赛正在火热报名中，快来展示你的才艺吧' },
      { id: 3, tag: '推荐', content: '新用户专享：首次发布帖子可获得积分奖励' }
    ],
    // 内容分类
    tabList: ['最新', '树洞', '失物招领', '投票', '恋爱', '互助群']
  }

  successResponse(res, data)
}

module.exports = {
  getData
}
