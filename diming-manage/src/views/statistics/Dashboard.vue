<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="item in statCards" :key="item.title">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" :style="{ background: item.color }">
              <el-icon :size="28"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card>
          <template #header>用户增长趋势</template>
          <div ref="userChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>内容分布</template>
          <div ref="contentChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>交易数据</template>
          <div ref="tradeChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>待处理事项</template>
          <el-table :data="pendingItems" size="small">
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="count" label="数量" width="80" />
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" link @click="goTo(row.path)">去处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { statisticsApi } from '@/api'

const router = useRouter()
const userChartRef = ref()
const contentChartRef = ref()
const tradeChartRef = ref()

let userChart, contentChart, tradeChart

const statCards = reactive([
  { title: '总用户数', value: 0, icon: 'User', color: '#409eff' },
  { title: '今日新增', value: 0, icon: 'Plus', color: '#67c23a' },
  { title: '待审核内容', value: 0, icon: 'Document', color: '#e6a23c' },
  { title: '今日交易额', value: '¥0', icon: 'Money', color: '#f56c6c' }
])

const pendingItems = ref([])

const fetchData = async () => {
  const res = await statisticsApi.getDashboard()
  if (res.code === 200) {
    const d = res.data
    statCards[0].value = d.totalUsers
    statCards[1].value = d.todayNewUsers
    statCards[2].value = d.pendingAudit
    statCards[3].value = `¥${d.todayTrade}`
    pendingItems.value = d.pendingItems || []
    initCharts(d)
  }
}

const initCharts = (data) => {
  // 用户增长图表
  userChart = echarts.init(userChartRef.value)
  userChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.userGrowth?.dates || [] },
    yAxis: { type: 'value' },
    series: [{ data: data.userGrowth?.values || [], type: 'line', smooth: true, areaStyle: {} }]
  })

  // 内容分布图表
  contentChart = echarts.init(contentChartRef.value)
  contentChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: data.contentDist || []
    }]
  })

  // 交易数据图表
  tradeChart = echarts.init(tradeChartRef.value)
  tradeChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.tradeTrend?.dates || [] },
    yAxis: { type: 'value' },
    series: [{ data: data.tradeTrend?.values || [], type: 'bar' }]
  })
}

const goTo = (path) => router.push(path)

onMounted(() => {
  fetchData()
  window.addEventListener('resize', () => {
    userChart?.resize()
    contentChart?.resize()
    tradeChart?.resize()
  })
})

onUnmounted(() => {
  userChart?.dispose()
  contentChart?.dispose()
  tradeChart?.dispose()
})
</script>

<style scoped>
.stat-cards { margin-bottom: 20px; }
.stat-card { display: flex; align-items: center; }
.stat-icon { width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; }
.stat-info { margin-left: 15px; }
.stat-value { font-size: 24px; font-weight: bold; }
.stat-title { color: #909399; font-size: 14px; }
.chart-row { margin-bottom: 20px; }
.chart { height: 300px; }
</style>
