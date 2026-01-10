# 递明校园 - 后台管理接口文档

> 适用于：后台管理系统 + 中间层（Express）
>
> Token传递：请求头 `Authorization: Bearer {admin_token}`
>
> 响应格式：`{ code: 200, message: "success", data: {...} }`

---

## 1. 管理员认证

### 1.1 管理员登录
```
POST /admin/login
```

**请求体**
```typescript
{
  username: string
  password: string
}
```

**响应**
```typescript
{
  token: string         // admin_token
  admin: {
    id: number
    username: string
    realName: string
    role: string        // SUPER_ADMIN|PLATFORM_ADMIN|PLATFORM_SUB_ADMIN|FORUM_ADMIN|SUB_ADMIN
    permissions: string[]
  }
}
```

### 1.2 获取管理员信息
```
GET /admin/userInfo
```

**响应**
```typescript
{
  id: number
  username: string
  realName: string
  role: string
  permissions: string[]
  forumIds?: number[]   // 论坛管理员管理的论坛ID列表
}
```

### 1.3 退出登录
```
POST /admin/logout
```

---

## 2. 用户管理

### 2.1 获取用户列表
```
GET /admin/user/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  keyword?: string      // 搜索昵称/手机号
  status?: string       // all|normal|banned
  isRealName?: boolean  // 是否实名
  regionId?: number
  schoolId?: number
  startTime?: string    // 注册开始时间
  endTime?: string      // 注册结束时间
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    nickName: string
    avatarUrl: string
    phone?: string
    isRealName: boolean
    realName?: string
    idCard?: string
    region?: string
    school?: string
    status: string      // normal|banned
    banReason?: string
    banEndTime?: string
    registerTime: string
    lastLoginTime: string
  }>
}
```

### 2.2 获取用户详情
```
GET /admin/user/detail/:id
```

**响应**
```typescript
{
  id: number
  nickName: string
  avatarUrl: string
  phone?: string
  isRealName: boolean
  realName?: string
  idCard?: string
  region?: string
  school?: string
  status: string
  banReason?: string
  banEndTime?: string
  registerTime: string
  lastLoginTime: string
  statistics: {
    postCount: number
    orderCount: number
    totalAmount: number // 总交易额（分）
  }
}
```

### 2.3 封禁用户
```
POST /admin/user/ban/:id
```

**请求体**
```typescript
{
  reason: string
  days?: number         // 封禁天数，不传则永久封禁
}
```

### 2.4 解封用户
```
POST /admin/user/unban/:id
```

### 2.5 获取实名审核列表
```
GET /admin/user/verify/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // pending|approved|rejected
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    userId: number
    nickName: string
    realName: string
    idCard: string
    idCardFront: string // 身份证正面照
    idCardBack: string  // 身份证反面照
    status: string
    rejectReason?: string
    submitTime: string
    auditTime?: string
  }>
}
```

### 2.6 通过实名审核
```
POST /admin/user/verify/approve/:id
```

### 2.7 拒绝实名审核
```
POST /admin/user/verify/reject/:id
```

**请求体**
```typescript
{
  reason: string
}
```

---

## 3. 内容管理

### 3.1 获取内容审核列表
```
GET /admin/content/audit/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string         // all|post|vote|errand|idle|love|help
  status?: string       // pending|approved|rejected
  keyword?: string
  startTime?: string
  endTime?: string
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
    status: string
    rejectReason?: string
    aiScore?: number    // AI审核分数 0-100
    aiTags?: string[]   // AI标签
    submitTime: string
    auditTime?: string
  }>
}
```

### 3.2 通过审核
```
POST /admin/content/approve/:id
```

### 3.3 拒绝审核
```
POST /admin/content/reject/:id
```

**请求体**
```typescript
{
  reason: string
}
```

### 3.4 创建/更新内容
```
POST /admin/content/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  type: string
  title: string
  content: string
  images?: string[]
  regionId: number
  schoolId: number
}
```

### 3.5 获取举报列表
```
GET /admin/report/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string         // all|post|vote|errand|idle|love|help|user
  status?: string       // pending|handled|rejected
  startTime?: string
  endTime?: string
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    type: string
    targetId: number
    targetType: string
    reason: string
    description?: string
    images?: string[]
    reporter: {
      id: number
      nickName: string
    }
    status: string
    handleResult?: string
    reportTime: string
    handleTime?: string
  }>
}
```

### 3.6 处理举报
```
POST /admin/report/handle/:id
```

**请求体**
```typescript
{
  action: string        // delete|ban|ignore
  result: string        // 处理结果说明
  banDays?: number      // 封禁天数（action=ban时必填）
}
```

---

## 4. 敏感词管理

### 4.1 获取敏感词列表
```
GET /admin/sensitive/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  keyword?: string
  level?: string        // all|high|medium|low
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    word: string
    level: string       // high|medium|low
    action: string      // block|replace|review
    replacement?: string // 替换词
    createTime: string
  }>
}
```

### 4.2 创建/更新敏感词
```
POST /admin/sensitive/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  word: string
  level: string
  action: string
  replacement?: string
}
```

### 4.3 批量添加敏感词
```
POST /admin/sensitive/batch
```

**请求体**
```typescript
{
  words: Array<{
    word: string
    level: string
    action: string
    replacement?: string
  }>
}
```

---

## 5. AI审核配置

### 5.1 获取AI配置
```
GET /admin/ai-config
```

**响应**
```typescript
{
  enabled: boolean
  provider: string      // openai|baidu|aliyun
  apiKey: string
  model: string
  threshold: number     // 审核阈值 0-100
  autoReject: boolean   // 是否自动拒绝低分内容
  checkText: boolean
  checkImage: boolean
}
```

### 5.2 保存AI配置
```
POST /admin/ai-config
```

**请求体**
```typescript
{
  enabled: boolean
  provider: string
  apiKey: string
  model: string
  threshold: number
  autoReject: boolean
  checkText: boolean
  checkImage: boolean
}
```

### 5.3 测试AI配置
```
POST /admin/ai-config/test
```

**请求体**
```typescript
{
  text?: string
  imageUrl?: string
}
```

**响应**
```typescript
{
  success: boolean
  score: number
  tags: string[]
  message?: string
}
```

---

## 6. 交易管理

### 6.1 获取订单列表
```
GET /admin/order/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string         // all|errand|idle|top
  status?: string       // all|pending|paid|completed|cancelled|refunded
  keyword?: string      // 订单号/用户昵称
  startTime?: string
  endTime?: string
}
```

**响应**
```typescript
{
  total: number
  totalAmount: number   // 总金额（分）
  list: Array<{
    id: number
    orderNo: string
    type: string
    title: string
    amount: number
    status: string
    buyer: {
      id: number
      nickName: string
    }
    seller?: {
      id: number
      nickName: string
    }
    createTime: string
    payTime?: string
    completeTime?: string
  }>
}
```

### 6.2 获取订单详情
```
GET /admin/order/detail/:id
```

**响应**
```typescript
{
  id: number
  orderNo: string
  type: string
  title: string
  description: string
  amount: number
  status: string
  buyer: {
    id: number
    nickName: string
    phone?: string
  }
  seller?: {
    id: number
    nickName: string
    phone?: string
  }
  timeline: Array<{     // 订单时间线
    status: string
    time: string
    note?: string
  }>
  createTime: string
}
```

### 6.3 获取纠纷列表
```
GET /admin/dispute/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // pending|handled
  startTime?: string
  endTime?: string
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    orderId: number
    orderNo: string
    reason: string
    description: string
    images?: string[]
    applicant: {
      id: number
      nickName: string
    }
    status: string
    handleResult?: string
    createTime: string
    handleTime?: string
  }>
}
```

### 6.4 处理纠纷
```
POST /admin/dispute/handle/:id
```

**请求体**
```typescript
{
  action: string        // refund|reject
  result: string        // 处理结果说明
  refundAmount?: number // 退款金额（分，action=refund时必填）
}
```

### 6.5 获取退款列表
```
GET /admin/refund/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // pending|approved|rejected
  startTime?: string
  endTime?: string
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    orderId: number
    orderNo: string
    amount: number
    reason: string
    applicant: {
      id: number
      nickName: string
    }
    status: string
    rejectReason?: string
    createTime: string
    handleTime?: string
  }>
}
```

### 6.6 通过退款
```
POST /admin/refund/approve/:id
```

### 6.7 拒绝退款
```
POST /admin/refund/reject/:id
```

**请求体**
```typescript
{
  reason: string
}
```

### 6.8 获取资金流水
```
GET /admin/fund/flow
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  type?: string         // all|income|refund|withdraw
  userId?: number
  startTime?: string
  endTime?: string
}
```

**响应**
```typescript
{
  total: number
  totalAmount: number
  list: Array<{
    id: number
    type: string
    amount: number
    balance: number     // 余额
    orderId?: number
    orderNo?: string
    user: {
      id: number
      nickName: string
    }
    note: string
    createTime: string
  }>
}
```

---

## 7. 数据统计

### 7.1 获取仪表盘数据
```
GET /admin/statistics/dashboard
```

**响应**
```typescript
{
  overview: {
    totalUsers: number
    todayNewUsers: number
    totalOrders: number
    todayOrders: number
    totalIncome: number // 总收入（分）
    todayIncome: number
    activeUsers: number // 活跃用户数
    todayActiveUsers: number
  }
  userTrend: Array<{    // 用户增长趋势（最近7天）
    date: string
    count: number
  }>
  orderTrend: Array<{   // 订单趋势（最近7天）
    date: string
    count: number
    amount: number
  }>
  contentStats: {       // 内容统计
    totalPosts: number
    pendingAudit: number
    todayPosts: number
  }
}
```

### 7.2 获取用户增长数据
```
GET /admin/statistics/user-growth
```

**查询参数**
```typescript
{
  startTime: string
  endTime: string
  granularity?: string  // day|week|month
}
```

**响应**
```typescript
{
  total: number
  data: Array<{
    date: string
    newUsers: number
    totalUsers: number
  }>
}
```

### 7.3 获取活跃度数据
```
GET /admin/statistics/active
```

**查询参数**
```typescript
{
  startTime: string
  endTime: string
  type?: string         // dau|wau|mau
}
```

**响应**
```typescript
{
  data: Array<{
    date: string
    activeUsers: number
    activeRate: number  // 活跃率（百分比）
  }>
}
```

### 7.4 获取交易数据
```
GET /admin/statistics/trade
```

**查询参数**
```typescript
{
  startTime: string
  endTime: string
  type?: string         // all|errand|idle|top
}
```

**响应**
```typescript
{
  total: number
  totalAmount: number
  data: Array<{
    date: string
    orderCount: number
    amount: number
  }>
  typeDistribution: Array<{ // 类型分布
    type: string
    count: number
    amount: number
    percentage: number
  }>
}
```

### 7.5 获取收入数据
```
GET /admin/statistics/income
```

**查询参数**
```typescript
{
  startTime: string
  endTime: string
}
```

**响应**
```typescript
{
  totalIncome: number
  data: Array<{
    date: string
    income: number
    refund: number
    netIncome: number   // 净收入
  }>
}
```

---

## 8. 系统设置

### 8.1 获取角色列表
```
GET /admin/role/list
```

**响应**
```typescript
Array<{
  id: number
  name: string
  code: string          // SUPER_ADMIN|PLATFORM_ADMIN|...
  level: number         // 角色层级
  description: string
  permissions: string[]
}>
```

### 8.2 获取权限列表
```
GET /admin/permission/list
```

**响应**
```typescript
Array<{
  id: number
  name: string
  code: string
  module: string        // 所属模块
  description: string
}>
```

### 8.3 保存角色
```
POST /admin/role/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  name: string
  code: string
  description: string
  permissions: string[]
}
```

### 8.4 获取系统配置
```
GET /admin/system/config
```

**响应**
```typescript
{
  siteName: string
  logo: string
  icp: string
  contactEmail: string
  contactPhone: string
  maintenanceMode: boolean
  maintenanceMessage?: string
  registerEnabled: boolean
  auditEnabled: boolean // 是否开启内容审核
}
```

### 8.5 保存系统配置
```
POST /admin/system/config
```

**请求体**
```typescript
{
  siteName?: string
  logo?: string
  icp?: string
  contactEmail?: string
  contactPhone?: string
  maintenanceMode?: boolean
  maintenanceMessage?: string
  registerEnabled?: boolean
  auditEnabled?: boolean
}
```

### 8.6 获取公告列表
```
GET /admin/notice/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // all|published|draft
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    title: string
    content: string
    type: string        // system|activity|maintenance
    status: string
    publishTime?: string
    createTime: string
  }>
}
```

### 8.7 保存公告
```
POST /admin/notice/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  title: string
  content: string
  type: string
  status: string
  publishTime?: string
}
```

### 8.8 获取版本列表
```
GET /admin/version/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  platform?: string     // all|ios|android|miniprogram
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    version: string
    platform: string
    downloadUrl: string
    updateContent: string
    forceUpdate: boolean
    publishTime: string
  }>
}
```

### 8.9 保存版本
```
POST /admin/version/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  version: string
  platform: string
  downloadUrl: string
  updateContent: string
  forceUpdate: boolean
  publishTime: string
}
```

---

## 9. 轮播图管理

### 9.1 获取轮播图列表
```
GET /admin/banner/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  position?: string     // home|errand|help
  status?: string       // all|enabled|disabled
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    title: string
    imageUrl: string
    linkUrl?: string
    position: string
    sort: number
    status: string
    startTime?: string
    endTime?: string
    createTime: string
  }>
}
```

### 9.2 创建/更新轮播图
```
POST /admin/banner/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  title: string
  imageUrl: string
  linkUrl?: string
  position: string
  sort: number
  status: string
  startTime?: string
  endTime?: string
}
```

---

## 10. 导航分类管理

### 10.1 获取导航列表
```
GET /admin/nav/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // all|enabled|disabled
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    name: string
    icon: string
    path: string
    sort: number
    status: string
    createTime: string
  }>
}
```

### 10.2 创建/更新导航
```
POST /admin/nav/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  name: string
  icon: string
  path: string
  sort: number
  status: string
}
```

---

## 11. 模块筛选配置

### 11.1 获取模块配置
```
GET /admin/module-config/:module
```

**路径参数**
```typescript
module: string          // post|vote|errand|idle|love|help
```

**响应**
```typescript
{
  module: string
  filters: Array<{
    id: number
    name: string
    type: string        // category|tag|sort
    options: Array<{
      label: string
      value: string
    }>
    defaultValue?: string
    sort: number
  }>
}
```

### 11.2 保存模块配置
```
POST /admin/module-config/saveOrUpdate
```

**请求体**
```typescript
{
  module: string
  filters: Array<{
    id?: number
    name: string
    type: string
    options: Array<{
      label: string
      value: string
    }>
    defaultValue?: string
    sort: number
  }>
}
```

---

## 12. 论坛管理

### 12.1 获取论坛列表
```
GET /admin/forum/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  regionId?: number
  status?: string       // all|enabled|disabled
}
```

**响应**
```typescript
{
  total: number
  list: Array<{
    id: number
    name: string
    description: string
    regionId: number
    regionName: string
    schoolId?: number
    schoolName?: string
    status: string
    adminCount: number  // 管理员数量
    memberCount: number // 成员数量
    postCount: number   // 帖子数量
    createTime: string
  }>
}
```

### 12.2 创建/更新论坛
```
POST /admin/forum/saveOrUpdate
```

**请求体**
```typescript
{
  id?: number
  name: string
  description: string
  regionId: number
  schoolId?: number
  status: string
}
```

### 12.3 添加论坛管理员
```
POST /admin/forum/:id/admins
```

**请求体**
```typescript
{
  userIds: number[]     // 用户ID数组
}
```

---

## 13. 配置管理

### 13.1 获取价格配置列表
```
GET /admin/config/pricing
```

**响应**
```typescript
Array<{
  type: string          // idle_top|errand_top|help_top
  name: string
  pricePerHour: number  // 每小时价格（分）
  minHours: number
  maxHours: number
}>
```

### 13.2 保存价格配置
```
POST /admin/config/pricing
```

**请求体**
```typescript
{
  type: string
  pricePerHour: number
  minHours: number
  maxHours: number
}
```

### 13.3 获取地区配置列表
```
GET /admin/config/region
```

**响应**
```typescript
Array<{
  id: number
  name: string
  code: string
  sort: number
  schools: Array<{
    id: number
    name: string
    sort: number
  }>
}>
```

### 13.4 保存地区配置
```
POST /admin/config/region
```

**请求体**
```typescript
{
  id?: number
  name: string
  code: string
  sort: number
  schools?: Array<{
    id?: number
    name: string
    sort: number
  }>
}
```

### 13.5 删除地区配置
```
POST /admin/config/region/:id/delete
```

---

## 14. 拍卖管理

### 14.1 获取拍卖列表
```
GET /admin/auction/list
```

**查询参数**
```typescript
{
  page: number
  pageSize: number
  status?: string       // all|ongoing|ended
  keyword?: string
  startTime?: string
  endTime?: string
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
    startPrice: number
    currentPrice: number
    bidCount: number
    endTime: string
    status: string
    publisher: {
      id: number
      nickName: string
    }
    topBidder?: {
      id: number
      nickName: string
    }
    createTime: string
  }>
}
```

### 14.2 获取拍卖详情
```
GET /admin/auction/detail/:id
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
    phone?: string
  }
  topBidder?: {
    id: number
    nickName: string
    phone?: string
  }
  createTime: string
}
```

### 14.3 创建/更新拍卖
```
POST /admin/auction/saveOrUpdate
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

### 14.4 删除拍卖
```
POST /admin/auction/delete/:id
```

### 14.5 获取出价记录列表
```
GET /admin/auction/bidList/:id
```

**响应**
```typescript
Array<{
  id: number
  price: number
  bidder: {
    id: number
    nickName: string
    phone?: string
  }
  createTime: string
}>
```

---

## 附录

### 管理员角色层级
```typescript
SUPER_ADMIN          // 超级管理员（最高权限）
PLATFORM_ADMIN       // 平台管理员
PLATFORM_SUB_ADMIN   // 平台子管理员
FORUM_ADMIN          // 论坛管理员
SUB_ADMIN            // 子管理员
NONE                 // 无权限
```

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

### 权限控制
- 所有接口需验证 `admin_token`
- 根据管理员角色层级控制接口访问权限
- 论坛管理员只能管理自己负责的论坛
