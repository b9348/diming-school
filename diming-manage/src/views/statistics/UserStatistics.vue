<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户增长统计</span>
          <el-radio-group v-model="timeRange" @change="fetchData">
            <el-radio-button value="7">近7天</el-radio-button>
            <el-radio-button value="30">近30天</el-radio-button>
            <el-radio-button value="90">近90天</el-radio-button>
          </el-radio-group>
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

      <div ref="chartRef" class="chart"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { statisticsApi } from '@/api'

const chartRef = ref()
const timeRange = ref('7')
let chart

const stats = reactive([
  { label: '总用户数', value: 0 },
  { label: '新增用户', value: 0 },
  { label: '日均新增', value: 0 },
  { label: '增长率', value: '0%' }
])

const fetchData = async () => {
  const res = await statisticsApi.getUserGrowth({ days: timeRange.value })
  if (res.code === 200) {
    const d = res.data
    stats[0].value = d.total
    stats[1].value = d.newUsers
    stats[2].value = d.avgDaily
    stats[3].value = d.growthRate + '%'
    updateChart(d)
  }
}

const updateChart = (data) => {
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增用户', '累计用户'] },
    xAxis: { type: 'category', data: data.dates },
    yAxis: [{ type: 'value', name: '新增' }, { type: 'value', name: '累计' }],
    series: [
      { name: '新增用户', type: 'bar', data: data.daily },
      { name: '累计用户', type: 'line', yAxisIndex: 1, data: data.cumulative }
    ]
  })
}

onMounted(() => {
  chart = echarts.init(chartRef.value)
  fetchData()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => chart?.dispose())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.stat-row { margin-bottom: 20px; }
.stat-item { text-align: center; padding: 20px; background: #f5f7fa; border-radius: 8px; }
.stat-value { font-size: 28px; font-weight: bold; color: #409eff; }
.stat-label { color: #909399; margin-top: 8px; }
.chart { height: 400px; }
</style>
