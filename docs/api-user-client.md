# UniApp 用户端接口文档

> 后端开发参考文档 - 递明校园用户端 API

## 通用约定

### 基础信息
- 基础路径: `/api`
- 认证方式: Header `Authorization: Bearer <access_token>`
- 内容类型: `application/json`

### 响应格式
```typescript
interface ApiResponse<T> {
  code: number        // 200=成功, 400=参数错误, 401=未授权, 403=禁止, 500=服务器错误
  message: string
  data: T | null
}
```

### 分页参数
```typescript
interface PaginationParams {
  page?: number       // 页码，默认1
  pageSize?: number   // 每页数量，默认10
}

interface PaginationResponse<T> {
  list: T[]
  total: number
}
```

---

## 1. 认证模块 `/auth`

### 1.1 登录
```
POST /auth/login
```

**请求体:**
```typescript
interface LoginRequest {
  code: string              // 微信登录code
  userInfo?: {              // 可选，用户授权信息
    nickName: string
    avatarUrl: string
    gender: number
  }
}
```

**响应:**
```typescript
interface LoginResponse {
  token: string             // JWT token
  userInfo: UserInfo
  isNewUser: boolean        // 是否新用户
}

interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone?: string
  school?: string
  schoolId?: string
  isVerified: boolean       // 是否实名认证
  gender: 0 | 1 | 2         // 0未知 1男 2女
}
```

### 1.2 获取用户信息
```
GET /auth/userInfo
```

**响应:** `UserInfo`

### 1.3 获取测试账号列表
```
GET /auth/testAccounts
```

**响应:**
```typescript
interface TestAccount {
  id: string
  nickname: string
  avatar: string
  description: string
}[]
```

---

## 2. 首页模块 `/home`

### 2.1 获取首页数据
```
GET /home/data
```

**请求参数:**
```typescript
interface HomeDataParams {
  tab?: string              // 当前tab名称
}
```

**响应:**
```typescript
interface HomeDataResponse {
  bannerList: Banner[]
  navList: NavItem[]
  hotList: HotItem[]
  noticeInfo: InfoItem | null
  activityInfo: InfoItem | null
  recommendInfo: InfoItem | null
  tabList: string[]
}

interface Banner {
  id: string
  image: string
  url: string               // 跳转链接
  title?: string
}

interface NavItem {
  id: string
  name: string
  icon: string
  url: string
  badge?: string            // 角标文字
}

interface HotItem {
  id: number
  postId: number
  postType: 'post' | 'vote' | 'idle' | 'errand' | 'love' | 'help'
  title: string
  url: string
}

interface InfoItem {
  postId: number
  postType: string
  type: 'notice' | 'activity' | 'recommend'
  content: string
  tag?: string
  url: string
}
```

---

## 3. 帖子模块 `/post`

### 3.1 获取帖子列表
```
GET /post/list
```

**请求参数:**
```typescript
interface PostListParams extends PaginationParams {
  tab?: string                                          // tab分类
  sort?: 'latest' | 'hot' | 'most_likes' | 'most_comments'
  contentType?: '' | 'image_text' | 'text' | 'image'    // 内容类型
  timeRange?: '' | '1d' | '3d' | '1w' | '15d' | '1m' | '3m' | '6m'
}
```

**响应:**
```typescript
interface PostListResponse extends PaginationResponse<PostItem> {}

interface PostItem {
  id: number
  avatar: string
  nickname: string
  title: string             // 用户头衔
  time: string              // 相对时间
  isTop: boolean
  content: string           // 内容预览(前200字)
  images: string[]
  comments: CommentPreview[]
  viewCount: number
  location: string
  likeCount: number
  commentCount: number
  isLiked: boolean
}

interface CommentPreview {
  avatar: string
  content: string           // 评论预览(前20字)
}
```

### 3.2 获取帖子详情
```
GET /post/detail/:id
```

**响应:**
```typescript
interface PostDetail {
  id: number
  avatar: string
  nickname: string
  title: string
  time: string
  isTop: boolean
  content: string
  images: string[]
  viewCount: number
  location: string
  likeCount: number
  commentCount: number
  shareCount: number
  isFollowed: boolean
  isLiked: boolean
  isPinned: boolean
  isRemoved: boolean
  isAnnouncement: boolean
  userInfo: PostUserInfo
  comments: Comment[]
}

interface PostUserInfo {
  id: string
  nickname: string
  isBanned: boolean
  title: string
  isAdmin: boolean
}

interface Comment {
  id: string
  avatar: string
  nickname: string
  content: string
  time: string
  likeCount: number
  isPinned: boolean
  isRemoved: boolean
  isAuthor: boolean
  userInfo: PostUserInfo
}
```

### 3.3 创建/更新帖子
```
POST /post/saveOrUpdate
```

**请求体:**
```typescript
interface PostSaveRequest {
  id?: number               // 有则更新，无则创建
  content: string           // 必填
  images?: string[]
  location?: string
  visibleScope?: string     // 可见范围
}
```

**响应:**
```typescript
interface PostSaveResponse {
  id: number
}
```

### 3.4 点赞帖子
```
POST /post/like/:id
```

**响应:** `null` (切换点赞状态)

### 3.5 收藏帖子
```
POST /post/collect/:id
```

**响应:** `null` (切换收藏状态)

### 3.6 评论帖子
```
POST /post/comment/:id
```

**请求体:**
```typescript
interface CommentRequest {
  content: string           // 必填
  replyTo?: string          // 回复的评论ID
}
```

---

## 4. 投票模块 `/vote`

### 4.1 获取投票列表
```
GET /vote/list
```

**请求参数:** `PaginationParams`

**响应:**
```typescript
interface VoteListResponse extends PaginationResponse<VoteItem> {}

interface VoteItem {
  id: number
  title: string
  description: string
  cover?: string
  options: VoteOption[]
  totalVotes: number
  endTime: string           // ISO时间
  isEnded: boolean
  isVoted: boolean
  creatorInfo: {
    id: string
    nickname: string
    avatar: string
  }
  time: string
}

interface VoteOption {
  id: string
  text: string
  count: number
  percentage: number
}
```

### 4.2 获取投票详情
```
GET /vote/detail/:id
```

**响应:** `VoteItem` (完整版，含更多字段)

### 4.3 创建/更新投票
```
POST /vote/saveOrUpdate
```

**请求体:**
```typescript
interface VoteSaveRequest {
  id?: number
  title: string
  description?: string
  options: string[]         // 选项文本数组
  isMultiple?: boolean      // 是否多选
  isAnonymous?: boolean     // 是否匿名
  endTime?: string          // 截止时间
}
```

### 4.4 提交投票
```
POST /vote/submit
```

**请求体:**
```typescript
interface VoteSubmitRequest {
  voteId: number
  optionIds: string[]       // 选中的选项ID
}
```

### 4.5 评论投票
```
POST /vote/comment/:id
```

**请求体:** `CommentRequest`

---

## 5. 跑腿模块 `/errand`

### 5.1 获取跑腿数据
```
GET /errand/data
```

**响应:**
```typescript
interface ErrandDataResponse {
  bannerList: Banner[]
  noticeInfo: InfoItem | null
  stats: {
    todayOrders: number
    totalOrders: number
    onlineRunners: number
  }
}
```

### 5.2 获取跑腿列表
```
GET /errand/list
```

**请求参数:**
```typescript
interface ErrandListParams extends PaginationParams {
  type?: 'all' | 'delivery' | 'purchase' | 'other'
  status?: 'all' | 'pending' | 'accepted' | 'completed'
}
```

**响应:**
```typescript
interface ErrandListResponse extends PaginationResponse<ErrandItem> {}

interface ErrandItem {
  id: number
  type: 'delivery' | 'purchase' | 'other'
  title: string
  description: string
  from: string              // 起点
  to: string                // 终点
  price: number             // 悬赏金额
  tip?: number              // 小费
  status: 'pending' | 'accepted' | 'processing' | 'completed' | 'cancelled'
  deadline?: string         // 截止时间
  creatorInfo: {
    id: string
    nickname: string
    avatar: string
  }
  runnerInfo?: {            // 接单人信息
    id: string
    nickname: string
    avatar: string
  }
  time: string
}
```

### 5.3 获取跑腿详情
```
GET /errand/detail/:id
```

**响应:** `ErrandItem` (完整版)

### 5.4 创建/更新跑腿任务
```
POST /errand/saveOrUpdate
```

**请求体:**
```typescript
interface ErrandSaveRequest {
  id?: number
  type: 'delivery' | 'purchase' | 'other'
  title: string
  description: string
  from: string
  to: string
  price: number
  tip?: number
  deadline?: string
  images?: string[]
  contactPhone?: string
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

## 6. 闲置模块 `/idle`

### 6.1 获取闲置列表
```
GET /idle/list
```

**请求参数:**
```typescript
interface IdleListParams extends PaginationParams {
  category?: string         // 分类
  priceMin?: number
  priceMax?: number
  sort?: 'latest' | 'price_asc' | 'price_desc'
}
```

**响应:**
```typescript
interface IdleListResponse extends PaginationResponse<IdleItem> {}

interface IdleItem {
  id: number
  title: string
  description: string
  images: string[]
  price: number
  originalPrice?: number
  condition: 'new' | 'like_new' | 'good' | 'fair'  // 成色
  category: string
  location: string
  isTop: boolean
  topExpireTime?: string
  wantCount: number         // 想要人数
  viewCount: number
  status: 'selling' | 'reserved' | 'sold' | 'off_shelf'
  sellerInfo: {
    id: string
    nickname: string
    avatar: string
  }
  time: string
}
```

### 6.2 获取闲置详情
```
GET /idle/detail/:id
```

**响应:** `IdleItem` (完整版)

### 6.3 创建/更新闲置商品
```
POST /idle/saveOrUpdate
```

**请求体:**
```typescript
interface IdleSaveRequest {
  id?: number
  title: string
  description: string
  images: string[]          // 至少1张
  price: number
  originalPrice?: number
  condition: 'new' | 'like_new' | 'good' | 'fair'
  category: string
  location?: string
  contactPhone?: string
}
```

### 6.4 想要商品
```
POST /idle/want/:id
```

### 6.5 置顶商品
```
POST /idle/setTop/:id
```

**请求体:**
```typescript
interface SetTopRequest {
  hours: number             // 置顶时长(小时)
}
```

---

## 7. 交友模块 `/love`

### 7.1 获取交友列表
```
GET /love/list
```

**请求参数:**
```typescript
interface LoveListParams extends PaginationParams {
  gender?: 0 | 1 | 2        // 筛选性别
  ageMin?: number
  ageMax?: number
}
```

**响应:**
```typescript
interface LoveListResponse extends PaginationResponse<LoveItem> {}

interface LoveItem {
  id: number
  nickname: string
  avatar: string
  gender: 1 | 2
  age?: number
  school?: string
  introduction: string
  images: string[]
  tags: string[]
  likeCount: number
  isLiked: boolean
  time: string
}
```

### 7.2 获取交友详情
```
GET /love/detail/:id
```

### 7.3 创建/更新交友信息
```
POST /love/saveOrUpdate
```

**请求体:**
```typescript
interface LoveSaveRequest {
  id?: number
  introduction: string
  images?: string[]
  tags?: string[]
  expectation?: string      // 期望
  contact?: string          // 联系方式(加密存储)
}
```

### 7.4 喜欢/取消喜欢
```
POST /love/like/:id
```

### 7.5 评论交友
```
POST /love/comment/:id
```

**请求体:** `CommentRequest`

---

## 8. 互助拍卖模块 `/help`

### 8.1 获取互助拍卖数据
```
GET /help/data
```

**响应:**
```typescript
interface HelpDataResponse {
  bannerList: Banner[]
  noticeInfo: InfoItem | null
  stats: {
    activeAuctions: number
    totalDeals: number
  }
}
```

### 8.2 获取互助拍卖列表
```
GET /help/list
```

**请求参数:**
```typescript
interface HelpListParams extends PaginationParams {
  type?: 'all' | 'task' | 'service'
  status?: 'all' | 'bidding' | 'ended'
}
```

**响应:**
```typescript
interface HelpListResponse extends PaginationResponse<HelpItem> {}

interface HelpItem {
  id: number
  title: string
  description: string
  images: string[]
  type: 'task' | 'service'
  startPrice: number        // 起拍价
  currentPrice: number      // 当前价
  bidCount: number          // 出价次数
  endTime: string
  isEnded: boolean
  creatorInfo: {
    id: string
    nickname: string
    avatar: string
  }
  winnerInfo?: {            // 中标人
    id: string
    nickname: string
    avatar: string
  }
  time: string
}
```

### 8.3 获取互助拍卖详情
```
GET /help/detail/:id
```

### 8.4 创建/更新互助拍卖
```
POST /help/saveOrUpdate
```

**请求体:**
```typescript
interface HelpSaveRequest {
  id?: number
  title: string
  description: string
  images?: string[]
  type: 'task' | 'service'
  startPrice: number
  stepPrice?: number        // 加价幅度
  endTime: string
}
```

### 8.5 出价
```
POST /help/bid
```

**请求体:**
```typescript
interface BidRequest {
  helpId: number
  price: number
}
```

### 8.6 获取出价记录
```
GET /help/bidList/:id
```

**响应:**
```typescript
interface BidRecord {
  id: string
  userId: string
  nickname: string
  avatar: string
  price: number
  time: string
  isWinner: boolean
}[]
```

---

## 9. 消息模块 `/message`

### 9.1 获取消息列表
```
GET /message/list
```

**请求参数:**
```typescript
interface MessageListParams extends PaginationParams {
  type?: 'all' | 'chat' | 'system' | 'interact'
}
```

**响应:**
```typescript
interface MessageListResponse extends PaginationResponse<MessageItem> {}

interface MessageItem {
  id: string
  type: 'chat' | 'system' | 'interact'
  title: string
  content: string           // 最新消息预览
  avatar?: string
  targetId?: string         // 聊天对象ID
  unreadCount: number
  time: string
}
```

### 9.2 标记已读
```
POST /message/markRead
```

**请求体:**
```typescript
interface MarkReadRequest {
  messageIds?: string[]     // 指定消息ID
  type?: string             // 或按类型全部标记
}
```

---

## 10. 聊天模块 `/chat`

### 10.1 获取聊天记录
```
GET /chat/list/:targetId
```

**请求参数:** `PaginationParams`

**响应:**
```typescript
interface ChatListResponse extends PaginationResponse<ChatMessage> {}

interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'voice' | 'location'
  extra?: Record<string, any>  // 附加信息
  time: string
  isSelf: boolean
  status: 'sending' | 'sent' | 'read' | 'failed'
}
```

### 10.2 发送消息
```
POST /chat/send
```

**请求体:**
```typescript
interface SendMessageRequest {
  targetId: string
  content: string
  type: 'text' | 'image' | 'voice' | 'location'
  extra?: Record<string, any>
}
```

---

## 11. 互助群模块 `/group`

### 11.1 获取群消息
```
GET /group/messages
```

**请求参数:**
```typescript
interface GroupMessageParams extends PaginationParams {
  groupId?: string
}
```

**响应:**
```typescript
interface GroupMessageResponse extends PaginationResponse<GroupMessage> {}

interface GroupMessage {
  id: string
  senderId: string
  senderNickname: string
  senderAvatar: string
  content: string
  type: 'text' | 'image' | 'system'
  time: string
  isSelf: boolean
}
```

### 11.2 发送群消息
```
POST /group/message/send
```

**请求体:**
```typescript
interface SendGroupMessageRequest {
  groupId?: string
  content: string
  type: 'text' | 'image'
}
```

---

## 12. 搜索模块 `/search`

### 12.1 搜索
```
GET /search
```

**请求参数:**
```typescript
interface SearchParams extends PaginationParams {
  keyword: string
  type?: 'all' | 'post' | 'vote' | 'idle' | 'errand' | 'help' | 'love' | 'user'
}
```

**响应:**
```typescript
interface SearchResponse extends PaginationResponse<SearchResultItem> {}

interface SearchResultItem {
  id: number | string
  type: 'post' | 'vote' | 'idle' | 'errand' | 'help' | 'love' | 'user'
  title: string
  content?: string
  cover?: string
  url: string
  extra?: Record<string, any>
}
```

---

## 13. 地区模块 `/region`

### 13.1 获取地区列表
```
GET /region/list
```

**响应:**
```typescript
interface Region {
  id: string
  name: string
  code: string
}[]
```

### 13.2 获取校区列表
```
GET /region/schools
```

**请求参数:**
```typescript
interface SchoolsParams {
  regionId: string
}
```

**响应:**
```typescript
interface School {
  id: string
  name: string
  address?: string
}[]
```

### 13.3 获取可见范围选项
```
GET /region/visible-options
```

**响应:**
```typescript
interface VisibleOption {
  value: string
  label: string
}[]
```

---

## 14. 配置模块 `/config`

### 14.1 获取置顶价格配置
```
GET /config/top-pricing
```

**请求参数:**
```typescript
interface TopPricingParams {
  type: 'idle' | 'post'     // 业务类型
}
```

**响应:**
```typescript
interface TopPricing {
  hours: number
  price: number
  originalPrice?: number
  discount?: string
}[]
```

### 14.2 获取默认时间配置
```
GET /config/default-hours
```

**请求参数:**
```typescript
interface DefaultHoursParams {
  type: string
}
```

**响应:**
```typescript
interface DefaultHours {
  value: number
  unit: 'hour' | 'day'
}
```

---

## 15. 用户中心模块 `/user`

### 15.1 我的帖子

#### 获取列表
```
GET /user/posts
```

**请求参数:**
```typescript
interface MyPostsParams extends PaginationParams {
  type?: '' | 'post' | 'vote' | 'errand' | 'idle' | 'help' | 'love'
}
```

**响应:**
```typescript
interface MyPostsResponse extends PaginationResponse<MyPostItem> {}

interface MyPostItem {
  id: number
  type: 'post' | 'vote' | 'errand' | 'idle' | 'help' | 'love'
  title: string
  content: string
  images: string[]
  time: string
  viewCount: number
  likeCount: number
  commentCount: number
  status: 'published' | 'reviewing' | 'rejected' | 'deleted'
}
```

#### 删除帖子
```
POST /user/posts/:id/delete
```

### 15.2 我的收藏

#### 获取列表
```
GET /user/collects
```

**请求参数:** 同 `MyPostsParams`

**响应:**
```typescript
interface CollectsResponse {
  list: CollectItem[]
  total: number
  counts: Record<string, number>  // 各类型数量
}

interface CollectItem {
  id: number
  type: string
  title: string
  content: string
  cover?: string
  images: string[]
  collectTime: string
  time: string
}
```

#### 取消收藏
```
POST /user/collects/cancel
```

**请求体:**
```typescript
interface CancelCollectsRequest {
  ids: number[]
}
```

### 15.3 浏览历史

#### 获取列表
```
GET /user/history
```

**请求参数:** `PaginationParams`

**响应:**
```typescript
interface HistoryResponse extends PaginationResponse<HistoryItem> {}

interface HistoryItem {
  id: number
  type: string
  title: string
  content: string
  cover?: string
  images: string[]
  nickname: string
  viewTime: string
  viewDate: string          // YYYY-MM-DD
}
```

#### 删除单条
```
POST /user/history/:id/delete
```

#### 清空历史
```
POST /user/history/clear
```

### 15.4 我的订单

#### 获取列表
```
GET /user/orders
```

**请求参数:**
```typescript
interface OrdersParams extends PaginationParams {
  status?: 'all' | 'pending' | 'processing' | 'completed' | 'cancelled'
}
```

**响应:**
```typescript
interface OrdersResponse {
  list: OrderItem[]
  total: number
  counts: Record<string, number>
}

interface OrderItem {
  id: string
  type: 'errand' | 'idle' | 'help'
  title: string
  desc: string
  cover?: string
  price: number
  status: 'pending' | 'accepted' | 'processing' | 'delivering' | 'completed' | 'cancelled'
  time: string
  targetUserId: string
  rated: boolean
}
```

#### 取消订单
```
POST /user/orders/:id/cancel
```

#### 确认订单
```
POST /user/orders/:id/confirm
```

#### 删除订单
```
POST /user/orders/:id/delete
```

### 15.5 消息通知

#### 获取列表
```
GET /user/notifications
```

**请求参数:**
```typescript
interface NotificationsParams extends PaginationParams {
  type?: 'all' | 'system' | 'interact' | 'trade'
}
```

**响应:**
```typescript
interface NotificationsResponse {
  list: NotificationItem[]
  total: number
  unreadCounts: Record<string, number>
}

interface NotificationItem {
  id: number
  type: 'system' | 'interact' | 'trade'
  title: string
  content: string
  time: string
  isRead: boolean
  targetType?: 'post' | 'order' | null
  targetId?: string | null
  extra?: {
    image?: string
    text?: string
  } | null
}
```

#### 标记已读
```
POST /user/notifications/:id/read
```

#### 全部标记已读
```
POST /user/notifications/read-all
```

### 15.6 设置

#### 获取设置
```
GET /user/settings
```

**响应:**
```typescript
interface UserSettings {
  pushNotification: boolean
  systemNotification: boolean
  interactNotification: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  darkMode: boolean
  fontSize: 'small' | 'normal' | 'large'
  autoPlayVideo: boolean
  wifiOnlyImage: boolean
}
```

#### 更新设置
```
POST /user/settings/update
```

**请求体:**
```typescript
interface UpdateSettingRequest {
  key: keyof UserSettings
  value: boolean | string
}
```

### 15.7 隐私设置

#### 获取隐私设置
```
GET /user/privacy
```

**响应:**
```typescript
interface PrivacyResponse {
  settings: PrivacySettings
  blacklistCount: number
}

interface PrivacySettings {
  showOnlineStatus: boolean
  showLastActive: boolean
  searchByPhone: boolean
  showSchool: boolean
  whoCanMessage: 'all' | 'friends' | 'none'
  whoCanComment: 'all' | 'friends' | 'none'
  whoCanSeeCollects: 'all' | 'friends' | 'none'
}
```

#### 更新隐私设置
```
POST /user/privacy/update
```

**请求体:**
```typescript
interface UpdatePrivacyRequest {
  key: keyof PrivacySettings
  value: boolean | string
}
```

#### 请求下载数据
```
POST /user/data/download
```

---

## 附录: 枚举值说明

### 内容类型 (type)
| 值 | 说明 |
|---|---|
| post | 帖子 |
| vote | 投票 |
| errand | 跑腿 |
| idle | 闲置 |
| help | 互助拍卖 |
| love | 交友 |

### 订单状态 (status)
| 值 | 说明 |
|---|---|
| pending | 待处理 |
| accepted | 已接单 |
| processing | 进行中 |
| delivering | 配送中 |
| completed | 已完成 |
| cancelled | 已取消 |

### 商品成色 (condition)
| 值 | 说明 |
|---|---|
| new | 全新 |
| like_new | 几乎全新 |
| good | 成色较好 |
| fair | 有使用痕迹 |
