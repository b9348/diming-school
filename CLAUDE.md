# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目说明

递明校园（diming-school）是一个校园多社区综合平台，采用前后端分离架构：
- **前端 (diming/)**: UniApp 跨平台应用，支持微信小程序、H5、APP
- **后端 (diming-server/)**: Express.js Node.js API 服务

## 开发命令

```bash
# 后端开发（带热重载）
cd diming-server && pnpm dev

# 后端生产启动
cd diming-server && pnpm start

# 前端依赖安装
cd diming && pnpm install

# 前端开发需使用 HBuilder 编译运行
```

## 代码架构

### 前端结构 (diming/)
```
pages/          # 页面组件（按功能模块划分）
  ├── index/    # 首页动态
  ├── post/     # 帖子/动态
  ├── vote/     # 投票
  ├── errand/   # 跑腿任务
  ├── idle/     # 闲置交易
  ├── love/     # 交友
  ├── help/     # 互助拍卖
  ├── message/  # 消息
  ├── chat/     # 聊天
  └── mine/     # 个人中心
components/     # 可复用组件（dm-* 前缀）
api/index.js    # API 服务层（所有接口定义）
utils/
  ├── request.js  # HTTP 请求封装（自动token注入、错误处理）
  └── admin.js    # 管理员权限系统
store/user.js   # 用户状态管理
pages.json      # 路由配置
```

### 后端结构 (diming-server/)
```
src/
  ├── app.js           # Express 应用入口
  ├── config/index.js  # 配置（端口5102）
  ├── routes/index.js  # 所有路由注册
  ├── controllers/     # 控制器（业务逻辑）
  ├── middlewares/     # 中间件（auth、errorHandler）
  └── utils/response.js # 响应格式化
```

## 关键约定

### API 响应格式
```javascript
{ code: 200, message: "success", data: {...} }
```

### 管理员角色层级
1. SUPER_ADMIN（总管理员）
2. PLATFORM_ADMIN（平台管理员）
3. PLATFORM_SUB_ADMIN（平台分管理员）
4. FORUM_ADMIN（分管理员）
5. SUB_ADMIN（子管理员）
6. NONE（普通用户）

### 前端请求拦截器
- 自动注入 Bearer token（从 localStorage 读取 `access_token`）
- 401 响应自动跳转登录页
- 统一错误提示处理

### 多平台 API 地址
- H5: 使用 `/api` 代理到 `localhost:5102`
- 小程序/APP: 直接使用完整 URL `http://localhost:5102/api`

## 重要文件

| 文件 | 作用 |
|------|------|
| `diming/api/index.js` | 所有前端 API 接口定义 |
| `diming/utils/request.js` | HTTP 请求封装与拦截器 |
| `diming-server/src/routes/index.js` | 所有后端路由注册 |
| `diming/pages.json` | 前端页面路由配置 |

## 注意事项

- 中文对话
- 测试文件测试完后自动删除
- 不要伪造任何简单的过程来代替原本的流程
- 不要使用模拟和伪造的数据来糊弄
