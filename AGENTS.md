# AGENTS.md

## 构建命令

### 后端服务 (layer/)
```bash
cd layer && pnpm dev      # 开发模式（热重载，使用 nodemon）
cd layer && pnpm start    # 生产模式
```

### 管理后台前端 (admin/)
```bash
cd admin && pnpm dev      # 开发服务器（Vite，端口 5173）
cd admin && pnpm build    # 生产构建
cd admin && pnpm preview  # 预览生产构建
```

### 前端小程序 (front-end/)
无需构建命令 - 需要 HBuilderX 进行 UniApp 编译。

### 测试
未配置测试框架。需要手动测试。

---

## 代码规范指南

### 前端 (admin/ - Vue 3)

#### 导入与组件
- 使用 ES6 语法，配合 `@/` 别名：`import { ref } from 'vue'`
- 先导入第三方库，再导入本地文件
- 使用 `<script setup>` 语法，无需导出
- 基本类型使用 ref，对象使用 reactive()

#### Pinia 状态管理
- 导出约定：`use[Name]Store`
- state: 对象，getters: 函数，actions: 异步方法
- token 持久化到 localStorage: `admin_token`

#### API 接口层
- 按领域分组：`userApi`、`contentApi`、`tradeApi`
- 从 `@/utils/request` 导出方法：`get`、`post`、`put`、`del`
- 响应格式：`{ code: 200, message: 'success', data: {...} }`

#### 样式与路由
- 使用 `<style scoped>` 作用域样式，Element Plus 组件类
- 路由懒加载：`() => import('@/views/...')`
- 路由元信息：`{ title, icon, noAuth? }`
- 认证守卫：检查 `localStorage.admin_token`，未认证则重定向到 `/login`

#### 错误处理
- 401 错误：清除 token，重定向到登录页，显示 ElMessage 提示
- 其他错误：显示 response.data.message 或 '请求失败'

---

### 后端 (layer/ - Express.js)

#### 导入与路由
- 使用 CommonJS：`require()` 和 `module.exports`
- 路由按功能分组，使用分区注释
- RESTful 风格：GET（列表/详情），POST（保存/创建/更新），DELETE（删除）

#### 控制器
- 异步函数，使用 try-catch
- 使用 `successResponse(res, data, message)` 或 `errorResponse(res, message, code)`
- 路由参数：`req.params.id`

#### 响应格式
- 成功：`{ code: 200, message: string, data: any }`
- 失败：`{ code: number, message: string, data: null }`

---

## 命名约定

### 文件命名
- Vue 组件：PascalCase（Dashboard.vue）
- 控制器：camelCase 并带前缀（adminUserController.js）
- API 模块：小写（userApi）
- 状态管理：camelCase（user.js）

### 变量与路由
- 变量和函数使用 camelCase
- URL 使用 kebab-case（`/user/list`）
- RESTful 风格：`/resource`、`/resource/:id`

---

## 项目结构

```
diming-school/
├── admin/       # 管理后台 (Vue 3 + Vite)
├── layer/       # 后端服务 (Express.js)
└── front-end/   # 小程序 (UniApp)
```

---

## Token 管理

- 管理后台：`localStorage.admin_token`，小程序：`localStorage.access_token`
- Authorization 请求头：`Bearer {token}`
- 401 响应：清除 token，重定向到登录页

---

## 开发流程

1. 启动后端：`cd layer && pnpm dev`（端口 5102）
2. 启动管理后台：`cd admin && pnpm dev`（端口 5173）
3. API 代理：`/api` → `http://localhost:5102`
4. 小程序需要使用 HBuilderX

---

## 代码示例

### 前端 Vue 组件
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { userApi } from '@/api'

const userList = ref([])

const fetchData = async () => {
  const res = await userApi.getList({ page: 1 })
  if (res.code === 200) userList.value = res.data
}

onMounted(fetchData)
</script>

<template>
  <el-table :data="userList">
    <el-table-column prop="name" label="姓名" />
  </el-table>
</template>
```

### 后端控制器
```javascript
exports.getList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    const data = await User.findAll({ limit: pageSize, offset: (page - 1) * pageSize })
    successResponse(res, data, '查询成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}
```

---

## 重要约束

- **不要启动开发服务器**
