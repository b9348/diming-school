<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>活跃度分析</span>
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始" end-placeholder="结束" @change="fetchData" />
        </div>
      </template>

      <el-row :gutter="20" class="stat-row">
        <el-col :span="6" v-for="item in stats" :key="item.label">
          <div class="stat-item">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <div ref="dauChartRef" class="chart"></div>
        </el-col>
        <el-col :span="12">
          <div ref="retentionChartRef" class="chart"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { statisticsApi } from '@/api'

const dauChartRef = ref()
const retentionChartRef = ref()
const dateRange = ref(null)
let dauChart, retentionChart

const stats = reactive([
  { label: 'DAU', value: 0 },
  { label: 'WAU', value: 0 },
  { label: 'MAU', value: 0 },
  { label: '次日留存', value: '0%' }
])

const fetchData = async () => {
  const res = await statisticsApi.getActiveData({ dateRange: dateRange.value })
  if (res.code === 200) {
    const d = res.data
    stats[0].value = d.dau
    stats[1].value = d.wau
    stats[2].value = d.mau
    stats[3].value = d.retention + '%'
    updateCharts(d)
  }
}

const updateCharts = (data) => {
  dauChart.setOption({
    title: { text: 'DAU趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.dates },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: data.dauTrend, smooth: true, areaStyle: {} }]
  })

  retentionChart.setOption({
    title: { text: '留存率', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['次日', '3日', '7日', '14日', '30日'] },
    yAxis: { type: 'value', max: 100 },
    series: [{ type: 'bar', data: data.retentionRates }]
  })
}

onMounted(() => {
  dauChart = echarts.init(dauChartRef.value)
  retentionChart = echarts.init(retentionChartRef.value)
  fetchData()
  window.addEventListener('resize', () => { dauChart?.resize(); retentionChart?.resize() })
})

onUnmounted(() => { dauChart?.dispose(); retentionChart?.dispose() })
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.stat-row { margin-bottom: 20px; }
.stat-item { text-align: center; padding: 20px; background: #f5f7fa; border-radius: 8px; }
.stat-value { font-size: 28px; font-weight: bold; color: #67c23a; }
.stat-label { color: #909399; margin-top: 8px; }
.chart { height: 350px; }
</style>
