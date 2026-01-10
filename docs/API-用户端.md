# 递明校园 - 用户端接口文档

> 适用于：UniApp前端 + 中间层（Express）
>
> Token传递：请求头 `Authorization: Bearer {access_token}`
>
> 响应格式：`{ code: 200, message: "success", data: {...} }`

---

## 1. 认证模块

### 1.1 登录
```
POST /auth/login
```

**请求体**
```typescript
{
  code: string          // 微信登录code
  userInfo?: {          // 可选用户信息
    nickName: string
    avatarUrl: string
  }
}
```

**响应**
```typescript
{
  token: string         // access_token
  user: {
    id: number
    nickName: string
    avatarUrl: string
    phone?: string
    isRealName: boolean // 是否实名认证
  }
}
```

### 1.2 获取用户信息
```
GET /auth/userInfo
```

**响应**
```typescript
{
  id: number
  nickName: string
  avatarUrl: string
  phone?: string
  isRealName: boolean
  regionId?: number     // 所属地区
  schoolId?: number     // 所属校区
}
```

### 1.3 获取测试账号列表
```
GET /auth/testAccounts
```

**响应**
```typescript
Array<{
  id: number
  nickName: string
  phone: string
}>
```

---

## 2. 首页模块

### 2.1 获取首页数据
```
GET /home/data
```

**查询参数**
```typescript
{
  regionId?: number     // 地区ID
  schoolId?: number     // 校区ID
}
```

**响应**
```typescript
{
  banners: Array<{      // 轮播图
    id: number
    imageUrl: string
    linkUrl?: string
    sort: number
  }>
  hotPosts: Array<{     // 热门帖子
    id: number
    title: string
    content: string
    images?: string[]
    likeCount: number
    commentCount: number
    createTime: string
  }>
  notices: Array<{      // 公告
    id: number
    title: string
    content: string
    createTime: string
  }>
  navs: Array<{         // 导航菜单
    id: number
    name: string
    icon: string
    path: string
    sort: number
  }>
}
```

---

## 3. 帖子模块

### 3.1 获取帖子列表
```
GET /post/list
```

**查询参数**
```typescript
{
  page: number          // 页码，从1开始
  pageSize: number      // 每页数量
  type?: string         // 帖子类型：all|post|vote|errand|idle|love|help
  regionId?: number
  schoolId?: number
  keyword?: string      // 搜索关键词
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    type: string        // post|vote|errand|idle|love|help
    title: string
    content: string
    images?: string[]
    author: {
      id: number
      nickName: string
      avatarUrl: string
    }
    likeCount: number
    commentCount: number
    collectCount: number
    isLiked: boolean    // 当前用户是否点赞
    isCollected: boolean
    createTime: string
  }>
}
```

### 3.2 获取帖子详情
```
GET /post/detail/:id
```

**响应**
```typescript
{
  id: number
  type: string
  title: string
  content: string
  images?: string[]
  author: {
    id: number
    nickName: string
    avatarUrl: string
  }
  likeCount: number
  commentCount: number
  collectCount: number
  isLiked: boolean
  isCollected: boolean
  comments: Array<{
    id: number
    content: string
    author: {
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
  createTime: string
}
```

### 3.3 创建/更新帖子
```
POST /post/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number           // 有则更新，无则创建
  title: string
  content: string
  images?: string[]
  regionId: number
  schoolId: number
  visibleRange?: string // 可见范围：all|school|region
}
```

**响应**
```typescript
{
  id: number
}
```

### 3.4 点赞帖子
```
POST /post/like/:id
```

**响应**
```typescript
{
  isLiked: boolean      // 点赞后的状态
  likeCount: number
}
```

### 3.5 收藏帖子
```
POST /post/collect/:id
```

**响应**
```typescript
{
  isCollected: boolean
  collectCount: number
}
```

### 3.6 评论帖子
```
POST /post/comment/:id
```

**请求体**
```typescript
{
  content: string
  replyTo?: number      // 回复的评论ID
}
```

**响应**
```typescript
{
  id: number
  content: string
  createTime: string
}
```

---

## 4. 投票模块

### 4.1 获取投票列表
```
GET /vote/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  regionId?: number
  schoolId?: number
  status?: string       // all|ongoing|ended
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    title: string
    description: string
    options: Array<{
      id: number
      content: string
      voteCount: number
    }>
    totalVotes: number
    endTime: string
    isVoted: boolean
    createTime: string
  }>
}
```

### 4.2 获取投票详情
```
GET /vote/detail/:id
```

**响应**
```typescript
{
  id: number
  title: string
  description: string
  options: Array<{
    id: number
    content: string
    voteCount: number
    percentage: number  // 百分比
  }>
  totalVotes: number
  endTime: string
  isVoted: boolean
  myVote?: number[]     // 用户投票的选项ID
  isMultiple: boolean   // 是否多选
  createTime: string
}
```

### 4.3 创建/更新投票
```
POST /vote/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  title: string
  description: string
  options: Array<{
    id?: number
    content: string
  }>
  isMultiple: boolean
  endTime: string
  regionId: number
  schoolId: number
}
```

### 4.4 提交投票
```
POST /vote/submit
```

**请求体**
```typescript
{
  voteId: number
  optionIds: number[]   // 选中的选项ID数组
}
```

### 4.5 评论投票
```
POST /vote/comment/:id
```

**请求体**
```typescript
{
  content: string
}
```

---

## 5. 跑腿模块

### 5.1 获取跑腿数据
```
GET /errand/data
```

**响应**
```typescript
{
  banners: Array<{
    id: number
    imageUrl: string
    linkUrl?: string
  }>
  notices: Array<{
    id: number
    title: string
    content: string
  }>
}
```

### 5.2 获取跑腿列表
```
GET /errand/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // all|pending|accepted|completed|cancelled
  regionId?: number
  schoolId?: number
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    title: string
    description: string
    reward: number      // 赏金（分）
    address: string
    deadline: string
    status: string      // pending|accepted|completed|cancelled
    publisher: {
      id: number
      nickName: string
      avatarUrl: string
    }
    accepter?: {        // 接单人
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
}
```

### 5.3 获取跑腿详情
```
GET /errand/detail/:id
```

**响应**
```typescript
{
  id: number
  title: string
  description: string
  reward: number
  address: string
  deadline: string
  status: string
  images?: string[]
  publisher: {
    id: number
    nickName: string
    avatarUrl: string
    phone?: string      // 仅接单人可见
  }
  accepter?: {
    id: number
    nickName: string
    avatarUrl: string
    phone?: string      // 仅发布人可见
  }
  createTime: string
}
```

### 5.4 创建/更新跑腿任务
```
POST /errand/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  title: string
  description: string
  reward: number
  address: string
  deadline: string
  images?: string[]
  regionId: number
  schoolId: number
}
```

### 5.5 接单
```
POST /errand/accept/:id
```

### 5.6 完成订单
```
POST /errand/complete/:id
```

---

## 6. 闲置模块

### 6.1 获取闲置列表
```
GET /idle/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  category?: string     // 分类
  priceMin?: number
  priceMax?: number
  regionId?: number
  schoolId?: number
  sort?: string         // latest|price_asc|price_desc
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    title: string
    description: string
    price: number       // 价格（分）
    originalPrice?: number
    images: string[]
    category: string
    condition: string   // 成色：全新|99新|95新|9成新|其他
    isTop: boolean      // 是否置顶
    wantCount: number   // 想要人数
    seller: {
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
}
```

### 6.2 获取闲置详情
```
GET /idle/detail/:id
```

**响应**
```typescript
{
  id: number
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  condition: string
  isTop: boolean
  wantCount: number
  isWanted: boolean     // 当前用户是否想要
  seller: {
    id: number
    nickName: string
    avatarUrl: string
  }
  createTime: string
}
```

### 6.3 创建/更新闲置商品
```
POST /idle/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  title: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  condition: string
  regionId: number
  schoolId: number
}
```

### 6.4 想要商品
```
POST /idle/want/:id
```

**响应**
```typescript
{
  isWanted: boolean
  wantCount: number
}
```

### 6.5 置顶商品
```
POST /idle/setTop/:id
```

**请求体**
```typescript
{
  hours: number         // 置顶时长（小时）
}
```

**响应**
```typescript
{
  orderId: string       // 支付订单ID
  amount: number        // 支付金额（分）
}
```

---

## 7. 交友模块

### 7.1 获取交友列表
```
GET /love/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  gender?: string       // male|female|other
  regionId?: number
  schoolId?: number
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    content: string
    images?: string[]
    author: {
      id: number
      nickName: string
      avatarUrl: string
      gender: string
      age?: number
    }
    likeCount: number
    commentCount: number
    isLiked: boolean
    createTime: string
  }>
}
```

### 7.2 获取交友详情
```
GET /love/detail/:id
```

**响应**
```typescript
{
  id: number
  content: string
  images?: string[]
  author: {
    id: number
    nickName: string
    avatarUrl: string
    gender: string
    age?: number
  }
  likeCount: number
  commentCount: number
  isLiked: boolean
  comments: Array<{
    id: number
    content: string
    author: {
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
  createTime: string
}
```

### 7.3 创建/更新交友信息
```
POST /love/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  content: string
  images?: string[]
  regionId: number
  schoolId: number
}
```

### 7.4 喜欢/取消喜欢
```
POST /love/like/:id
```

**响应**
```typescript
{
  isLiked: boolean
  likeCount: number
}
```

### 7.5 评论交友
```
POST /love/comment/:id
```

**请求体**
```typescript
{
  content: string
}
```

---

## 8. 互助拍卖模块

### 8.1 获取互助拍卖数据
```
GET /help/data
```

**响应**
```typescript
{
  banners: Array<{
    id: number
    imageUrl: string
    linkUrl?: string
  }>
  notices: Array<{
    id: number
    title: string
    content: string
  }>
}
```

### 8.2 获取互助拍卖列表
```
GET /help/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // all|ongoing|ended
  regionId?: number
  schoolId?: number
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    title: string
    description: string
    images: string[]
    startPrice: number  // 起拍价（分）
    currentPrice: number // 当前价
    bidCount: number    // 出价次数
    endTime: string
    status: string      // ongoing|ended
    publisher: {
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
}
```

### 8.3 获取互助拍卖详情
```
GET /help/detail/:id
```

**响应**
```typescript
{
  id: number
  title: string
  description: string
  images: string[]
  startPrice: number
  currentPrice: number
  bidCount: number
  endTime: string
  status: string
  publisher: {
    id: number
    nickName: string
    avatarUrl: string
  }
  topBidder?: {         // 当前最高出价者
    id: number
    nickName: string
    avatarUrl: string
  }
  createTime: string
}
```

### 8.4 创建/更新互助拍卖
```
POST /help/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  title: string
  description: string
  images: string[]
  startPrice: number
  endTime: string
  regionId: number
  schoolId: number
}
```

### 8.5 出价
```
POST /help/bid
```

**请求体**
```typescript
{
  auctionId: number
  price: number         // 出价金额（分）
}
```

**响应**
```typescript
{
  currentPrice: number
  bidCount: number
  isTopBidder: boolean  // 是否成为最高出价者
}
```

### 8.6 获取出价记录列表
```
GET /help/bidList/:id
```

**响应**
```typescript
Array<{
  id: number
  price: number
  bidder: {
    id: number
    nickName: string
    avatarUrl: string
  }
  createTime: string
}>
```

---

## 9. 消息模块

### 9.1 获取消息列表
```
GET /message/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string         // all|system|like|comment|reply
  isRead?: boolean
}
```

**响应**
```typescript
{
  total: number
  unreadCount: number
  list: Array<{
    id: number
    type: string        // system|like|comment|reply
    title: string
    content: string
    relatedId?: number  // 关联内容ID
    relatedType?: string // 关联内容类型
    sender?: {
      id: number
      nickName: string
      avatarUrl: string
    }
    isRead: boolean
    createTime: string
  }>
}
```

### 9.2 标记已读
```
POST /message/markRead
```

**请求体**
```typescript
{
  ids?: number[]        // 消息ID数组，不传则全部标记已读
}
```

---

## 10. 聊天模块

### 10.1 获取聊天记录
```
GET /chat/list/:targetId
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  lastMessageId?: number // 最后一条消息ID，用于加载更多
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    content: string
    type: string        // text|image|voice
    senderId: number
    receiverId: number
    isRead: boolean
    createTime: string
  }>
}
```

### 10.2 发送消息
```
POST /chat/send
```

**请求体**
```typescript
{
  receiverId: number
  content: string
  type: string          // text|image|voice
}
```

**响应**
```typescript
{
  id: number
  createTime: string
}
```

---

## 11. 群组模块

### 11.1 获取群消息
```
GET /group/messages
```

**查询参数**
```typescript
{
  groupId: number
  page: number
  pageSize: number
  lastMessageId?: number
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    content: string
    type: string        // text|image
    sender: {
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
}
```

### 11.2 发送群消息
```
POST /group/message/send
```

**请求体**
```typescript
{
  groupId: number
  content: string
  type: string          // text|image
}
```

---

## 12. 搜索模块

### 12.1 搜索内容
```
GET /search
```

**查询参数**
```typescript
{
  keyword: string
  type?: string         // all|post|vote|errand|idle|love|help
  page: number
  pageSize: number
  regionId?: number
  schoolId?: number
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    type: string
    title: string
    content: string
    images?: string[]
    author: {
      id: number
      nickName: string
      avatarUrl: string
    }
    createTime: string
  }>
}
```

---

## 13. 地区模块

### 13.1 获取地区列表
```
GET /region/list
```

**响应**
```typescript
Array<{
  id: number
  name: string
  code: string
  sort: number
}>
```

### 13.2 获取校区列表
```
GET /region/schools
```

**查询参数**
```typescript
{
  regionId: number
}
```

**响应**
```typescript
Array<{
  id: number
  name: string
  regionId: number
  sort: number
}>
```

### 13.3 获取可见范围选项
```
GET /region/visible-options
```

**响应**
```typescript
Array<{
  value: string         // all|region|school
  label: string
}>
```

---

## 14. 配置模块

### 14.1 获取置顶价格配置
```
GET /config/top-pricing
```

**查询参数**
```typescript
{
  type: string          // idle|errand|help
}
```

**响应**
```typescript
{
  pricePerHour: number  // 每小时价格（分）
  minHours: number      // 最少小时数
  maxHours: number      // 最多小时数
}
```

### 14.2 获取默认时间配置
```
GET /config/default-hours
```

**查询参数**
```typescript
{
  type: string          // vote|errand|help
}
```

**响应**
```typescript
{
  defaultHours: number  // 默认小时数
}
```

---

## 15. 用户中心模块

### 15.1 我的帖子
```
GET /user/posts
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string         // all|post|vote|errand|idle|love|help
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    type: string
    title: string
    content: string
    images?: string[]
    likeCount: number
    commentCount: number
    status: string      // normal|deleted|banned
    createTime: string
  }>
}
```

### 15.2 删除帖子
```
POST /user/posts/:id/delete
```

### 15.3 我的收藏
```
GET /user/collects
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    type: string
    title: string
    content: string
    images?: string[]
    author: {
      id: number
      nickName: string
      avatarUrl: string
    }
    collectTime: string
  }>
}
```

### 15.4 取消收藏
```
POST /user/collects/cancel
```

**请求体**
```typescript
{
  ids: number[]         // 收藏ID数组
}
```

### 15.5 浏览历史
```
GET /user/history
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    contentId: number
    contentType: string
    title: string
    content: string
    images?: string[]
    viewTime: string
  }>
}
```

### 15.6 删除历史记录
```
POST /user/history/:id/delete
```

### 15.7 清空历史记录
```
POST /user/history/clear
```

### 15.8 我的订单
```
GET /user/orders
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // all|pending|paid|completed|cancelled|refunded
  type?: string         // errand|idle|top
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    orderNo: string
    type: string
    title: string
    amount: number      // 金额（分）
    status: string
    createTime: string
  }>
}
```

### 15.9 取消订单
```
POST /user/orders/:id/cancel
```

### 15.10 确认订单
```
POST /user/orders/:id/confirm
```

### 15.11 删除订单
```
POST /user/orders/:id/delete
```

### 15.12 消息通知
```
GET /user/notifications
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string
}
```

**响应**
```typescript
{
  total: number
  unreadCount: number
  list: Array<{
    id: number
    type: string
    title: string
    content: string
    isRead: boolean
    createTime: string
  }>
}
```

### 15.13 标记通知已读
```
POST /user/notifications/:id/read
```

### 15.14 标记全部通知已读
```
POST /user/notifications/read-all
```

### 15.15 获取设置
```
GET /user/settings
```

**响应**
```typescript
{
  notificationEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
}
```

### 15.16 更新设置
```
POST /user/settings/update
```

**请求体**
```typescript
{
  notificationEnabled?: boolean
  soundEnabled?: boolean
  vibrationEnabled?: boolean
}
```

### 15.17 获取隐私设置
```
GET /user/privacy
```

**响应**
```typescript
{
  showPhone: boolean
  showRealName: boolean
  allowStrangerMessage: boolean
}
```

### 15.18 更新隐私设置
```
POST /user/privacy/update
```

**请求体**
```typescript
{
  showPhone?: boolean
  showRealName?: boolean
  allowStrangerMessage?: boolean
}
```

### 15.19 请求数据下载
```
POST /user/data/download
```

**响应**
```typescript
{
  taskId: string        // 下载任务ID
  estimatedTime: number // 预计完成时间（秒）
}
```

---

## 附录

### 错误码说明
```typescript
200  // 成功
400  // 请求参数错误
401  // 未授权（token无效或过期）
403  // 无权限
404  // 资源不存在
500  // 服务器错误
```

### 金额单位
所有金额字段单位为**分**，前端需要除以100显示为元。

### 时间格式
所有时间字段格式为 ISO 8601：`YYYY-MM-DDTHH:mm:ss.sssZ`

### 分页说明
- `page` 从 1 开始
- `pageSize` 默认 10，最大 100
