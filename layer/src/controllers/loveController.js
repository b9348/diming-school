const { successResponse, errorResponse } = require('../utils/response')

// 生成交友列表数据
const generateLoveList = (page, pageSize) => {
  const startId = (page - 1) * pageSize
  return Array(pageSize).fill(null).map((_, i) => ({
    id: startId + i + 1,
    photo: 'https://iph.href.lu/400x400?text=用户照片',
    birth: i % 2 === 0 ? '2004.12' : '2003.08',
    height: i % 2 === 0 ? '1.78m' : '1.65m',
    gender: i % 2 === 0 ? '男' : '女',
    education: ['本科', '硕士', '博士'][i % 3],
    status: ['在读', '已毕业', '工作中'][i % 3],
    major: ['计算机科学', '金融学', '法学', '医学', '艺术设计'][i % 5],
    location: ['徐汇校区', '闵行校区', '海定校区', '杨浦校区'][i % 4],
    likeCount: Math.floor(Math.random() * 100) + 20,
    isLiked: false
  }))
}

// 获取交友列表
const getList = (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    gender = '',
    birthYear_min = '',
    birthYear_max = '',
    height_min = '',
    height_max = '',
    weight_min = '',
    weight_max = '',
    education = '',
    studyType = '',
    occupation = '',
    location = '',
    hometown = '',
    noSmoke = '',
    noDrink = '',
    noSnore = '',
    timeRange = ''
  } = req.query
  const pageNum = parseInt(page)
  const size = parseInt(pageSize)

  const total = 36
  const maxPage = Math.ceil(total / size)

  if (pageNum > maxPage) {
    return successResponse(res, { list: [], total })
  }

  let list = generateLoveList(pageNum, size)

  // 根据性别筛选
  if (gender) {
    const genderMap = { 'male': '男', 'female': '女' }
    if (genderMap[gender]) {
      list = list.filter(item => item.gender === genderMap[gender])
    }
  }

  // 根据学历筛选
  if (education) {
    const eduMap = { 'college': '大专', 'bachelor': '本科', 'master': '硕士', 'doctor': '博士' }
    if (eduMap[education]) {
      list = list.filter(item => item.education === eduMap[education])
    }
  }

  // 根据出生年月筛选（模拟）
  // birthYear_min, birthYear_max

  // 根据身高筛选（模拟）
  // height_min, height_max

  // 根据体重筛选（模拟）
  // weight_min, weight_max

  // 根据学制筛选（模拟）
  // studyType: fulltime, parttime

  // 根据职业筛选（模拟）
  // occupation

  // 根据现居地筛选（模拟）
  // location

  // 根据籍贯筛选（模拟）
  // hometown

  // 根据生活习惯筛选（模拟）
  // noSmoke, noDrink, noSnore

  // 根据发布时间筛选（模拟）
  // timeRange: 1d, 3d, 1w, 15d

  successResponse(res, { list, total })
}

// 获取交友详情
const getDetail = (req, res) => {
  const { id } = req.params

  const detail = {
    id: parseInt(id),
    photos: [
      'https://iph.href.lu/400x400?text=照片1',
      'https://iph.href.lu/400x400?text=照片2',
      'https://iph.href.lu/400x400?text=照片3'
    ],
    nickname: '小明',
    birth: '2004.12',
    height: '1.78m',
    weight: '70kg',
    gender: '男',
    education: '本科',
    status: '在读',
    major: '计算机科学与技术',
    school: '某某大学',
    hometown: '浙江杭州',
    location: '徐汇校区',
    constellation: '天蝎座',
    mbti: 'INTJ',
    hobbies: ['篮球', '游戏', '音乐', '摄影'],
    introduction: '一个热爱生活的理工男，喜欢运动和音乐，希望能找到志同道合的朋友。平时喜欢打篮球，周末会去咖啡馆看书。性格比较内向但是很好相处，希望能认识更多有趣的人。',
    idealType: '希望对方开朗活泼，喜欢运动，三观正。',
    likeCount: 67,
    viewCount: 328,
    isLiked: false,
    userInfo: {
      id: 'love_user_1',
      nickname: '小明',
      isBanned: false,
      title: '',
      isAdmin: false
    }
  }

  successResponse(res, detail)
}

// 创建或更新交友信息
const saveOrUpdate = (req, res) => {
  const { id, photos, introduction, idealType, hobbies } = req.body

  if (!photos || photos.length === 0) {
    return errorResponse(res, '请至少上传一张照片', 400)
  }

  if (!introduction) {
    return errorResponse(res, '请填写自我介绍', 400)
  }

  if (id) {
    successResponse(res, { id }, '信息更新成功')
  } else {
    const newId = Date.now()
    successResponse(res, { id: newId }, '发布成功')
  }
}

// 喜欢/取消喜欢
const like = (req, res) => {
  const { id } = req.params
  successResponse(res, null, '操作成功')
}

module.exports = {
  getList,
  getDetail,
  saveOrUpdate,
  like
}
