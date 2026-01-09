<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <span v-if="!isCollapse">递明校园</span>
        <span v-else>递</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>

        <el-sub-menu index="user">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user/list">用户列表</el-menu-item>
          <el-menu-item index="/user/verify">实名认证审核</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="content">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/content/audit">内容审核</el-menu-item>
          <el-menu-item index="/content/report">举报处理</el-menu-item>
          <el-menu-item index="/content/sensitive">敏感词库</el-menu-item>
          <el-menu-item index="/content/ai-config">AI审核配置</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="trade">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>交易管理</span>
          </template>
          <el-menu-item index="/trade/order">订单查询</el-menu-item>
          <el-menu-item index="/trade/dispute">交易纠纷</el-menu-item>
          <el-menu-item index="/trade/refund">退款管理</el-menu-item>
          <el-menu-item index="/trade/flow">资金流水</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="statistics">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>数据统计</span>
          </template>
          <el-menu-item index="/statistics/user">用户增长</el-menu-item>
          <el-menu-item index="/statistics/active">活跃度分析</el-menu-item>
          <el-menu-item index="/statistics/trade">交易数据</el-menu-item>
          <el-menu-item index="/statistics/income">收入统计</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/system/permission">权限管理</el-menu-item>
          <el-menu-item index="/system/config">参数配置</el-menu-item>
          <el-menu-item index="/system/notice">公告发布</el-menu-item>
          <el-menu-item index="/system/version">版本管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ userStore.username || '管理员' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  background-color: #263445;
}

.el-menu {
  border-right: none;
}

.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
}

.main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
