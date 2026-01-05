import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/statistics/Dashboard.vue'),
        meta: { title: '数据概览', icon: 'DataAnalysis' }
      },
      // 用户管理
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户列表', icon: 'User' }
      },
      {
        path: 'user/verify',
        name: 'UserVerify',
        component: () => import('@/views/user/UserVerify.vue'),
        meta: { title: '实名认证审核', icon: 'Checked' }
      },
      // 内容管理
      {
        path: 'content/audit',
        name: 'ContentAudit',
        component: () => import('@/views/content/ContentAudit.vue'),
        meta: { title: '内容审核', icon: 'Document' }
      },
      {
        path: 'content/report',
        name: 'ReportList',
        component: () => import('@/views/content/ReportList.vue'),
        meta: { title: '举报处理', icon: 'Warning' }
      },
      {
        path: 'content/sensitive',
        name: 'SensitiveWords',
        component: () => import('@/views/content/SensitiveWords.vue'),
        meta: { title: '敏感词库', icon: 'EditPen' }
      },
      {
        path: 'content/ai-config',
        name: 'AIConfig',
        component: () => import('@/views/content/AIConfig.vue'),
        meta: { title: 'AI审核配置', icon: 'MagicStick' }
      },
      // 交易管理
      {
        path: 'trade/order',
        name: 'OrderList',
        component: () => import('@/views/trade/OrderList.vue'),
        meta: { title: '订单查询', icon: 'List' }
      },
      {
        path: 'trade/dispute',
        name: 'DisputeList',
        component: () => import('@/views/trade/DisputeList.vue'),
        meta: { title: '交易纠纷', icon: 'ChatDotSquare' }
      },
      {
        path: 'trade/refund',
        name: 'RefundList',
        component: () => import('@/views/trade/RefundList.vue'),
        meta: { title: '退款管理', icon: 'RefreshLeft' }
      },
      {
        path: 'trade/flow',
        name: 'FundFlow',
        component: () => import('@/views/trade/FundFlow.vue'),
        meta: { title: '资金流水', icon: 'Money' }
      },
      // 数据统计
      {
        path: 'statistics/user',
        name: 'UserStatistics',
        component: () => import('@/views/statistics/UserStatistics.vue'),
        meta: { title: '用户增长', icon: 'TrendCharts' }
      },
      {
        path: 'statistics/active',
        name: 'ActiveStatistics',
        component: () => import('@/views/statistics/ActiveStatistics.vue'),
        meta: { title: '活跃度分析', icon: 'DataLine' }
      },
      {
        path: 'statistics/trade',
        name: 'TradeStatistics',
        component: () => import('@/views/statistics/TradeStatistics.vue'),
        meta: { title: '交易数据', icon: 'Goods' }
      },
      {
        path: 'statistics/income',
        name: 'IncomeStatistics',
        component: () => import('@/views/statistics/IncomeStatistics.vue'),
        meta: { title: '收入统计', icon: 'Wallet' }
      },
      // 系统设置
      {
        path: 'system/permission',
        name: 'Permission',
        component: () => import('@/views/system/Permission.vue'),
        meta: { title: '权限管理', icon: 'Lock' }
      },
      {
        path: 'system/config',
        name: 'SystemConfig',
        component: () => import('@/views/system/SystemConfig.vue'),
        meta: { title: '参数配置', icon: 'Setting' }
      },
      {
        path: 'system/notice',
        name: 'NoticeManage',
        component: () => import('@/views/system/NoticeManage.vue'),
        meta: { title: '公告发布', icon: 'Bell' }
      },
      {
        path: 'system/version',
        name: 'VersionManage',
        component: () => import('@/views/system/VersionManage.vue'),
        meta: { title: '版本管理', icon: 'Upload' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '后台管理'} - 递明校园`

  if (to.meta.noAuth) {
    next()
    return
  }

  const token = localStorage.getItem('admin_token')
  if (!token) {
    next('/login')
    return
  }

  next()
})

export default router
