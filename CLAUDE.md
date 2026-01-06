# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目说明

递明校园（diming-school）是一个校园多社区综合平台，采用前后端分离架构，包含三个子项目：

| 子项目 | 技术栈 | 说明 |
|--------|--------|------|
| **diming/** | UniApp (Vue 3) | 前端小程序/H5/APP |
| **diming-server/** | Express.js | 后端 API 服务 (端口 5102) |
| **diming-manage/** | Vue 3 + Element Plus + Vite | 后台管理系统 (端口 5173) |

## 开发命令

```bash
# 后端服务（带热重载）
cd diming-server && pnpm dev

# 后台管理系统
cd diming-manage && pnpm dev

# 后台管理系统构建
cd diming-manage && pnpm build

# 前端小程序需使用 HBuilder 编译运行
```

## 代码架构

### 前端小程序 (diming/)
```
pages/           # 页面（index/post/vote/errand/idle/love/help/message/chat/mine）
components/      # 可复用组件（dm-* 前缀）
api/index.js     # API 接口定义
utils/request.js # 请求封装（token: access_token）
store/user.js    # 用户状态管理
pages.json       # 路由配置
```

### 后端服务 (diming-server/)
```
src/
├── app.js              # 应用入口
├── config/index.js     # 配置
├── routes/index.js     # 路由注册
├── controllers/        # 控制器（含 admin* 后台管理接口）
├── middlewares/        # auth、errorHandler
└── utils/response.js   # 响应格式化
```

### 后台管理系统 (diming-manage/)
```
src/
├── api/index.js        # API 接口（所有 /admin/* 路由）
├── utils/request.js    # 请求封装（token: admin_token）
├── router/index.js     # 路由配置（含路由守卫）
├── store/user.js       # 管理员状态
├── layouts/            # 布局组件
└── views/              # 页面视图
    ├── user/           # 用户管理（列表、实名审核）
    ├── content/        # 内容管理（审核、举报、敏感词、AI配置）
    ├── trade/          # 交易管理（订单、纠纷、退款、资金流水）
    ├── statistics/     # 数据统计（Dashboard、用户增长、活跃度、交易、收入）
    └── system/         # 系统设置（权限、配置、公告、版本）
```

## 关键约定

### API 响应格式
```javascript
{ code: 200, message: "success", data: {...} }
```

### Token 存储差异
- 小程序端：`localStorage.access_token`
- 后台管理：`localStorage.admin_token`

### 管理员角色层级
SUPER_ADMIN > PLATFORM_ADMIN > PLATFORM_SUB_ADMIN > FORUM_ADMIN > SUB_ADMIN > NONE

### API 代理配置
- 后台管理 (Vite): `/api` → `localhost:5102`
- 小程序 H5: `/api` → `localhost:5102`
- 小程序/APP: 直接使用完整 URL

## 重要文件

| 文件 | 作用 |
|------|------|
| `diming/api/index.js` | 小程序 API 接口 |
| `diming-manage/src/api/index.js` | 后台管理 API 接口 |
| `diming-server/src/routes/index.js` | 后端路由注册 |
| `diming-server/src/controllers/admin*.js` | 后台管理控制器 |

## 注意事项

- 中文对话
- 测试文件测试完后自动删除
- 不要伪造任何简单的过程来代替原本的流程
- 不要使用模拟和伪造的数据
