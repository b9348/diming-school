<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户增长统计</span>
          <div class="filter-group">
            <el-select v-model="searchForm.school" placeholder="选择学校" clearable @change="fetchData">
              <el-option label="全部学校" value="" />
              <el-option label="示例大学" value="示例大学" />
              <el-option label="测试学院" value="测试学院" />
            </el-select>
            <el-radio-group v-model="searchForm.timeRange" @change="handleTimeRangeChange">
              <el-radio-button label="7">近7天</el-radio-button>
              <el-radio-button label="30">近30天</el-radio-button>
              <el-radio-button label="90">近90天</el-radio-button>
              <el-radio-button label="custom">自定义</el-radio-button>
            </el-radio-group>
            <el-date-picker v-if="searchForm.timeRange === 'custom'" v-model="searchForm.dateRange" type="daterange" start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD" @change="fetchData" />
          </div>
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
const searchForm = reactive({ school: '', timeRange: '7', dateRange: null })
let chart

const handleTimeRangeChange = () => {
  if (searchForm.timeRange !== 'custom') fetchData()
}

const stats = reactive([
  { label: '总用户数', value: 0 },
  { label: '新增用户', value: 0 },
  { label: '日均新增', value: 0 },
  { label: '增长率', value: '0%' }
])

const fetchData = async () => {
  const params = { days: searchForm.timeRange, school: searchForm.school }
  if (searchForm.timeRange === 'custom' && searchForm.dateRange) params.dateRange = searchForm.dateRange
  const res = await statisticsApi.getUserGrowth(params)
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
.card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
.filter-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.filter-group .el-select { width: 140px; }
.stat-row { margin-bottom: 20px; }
.stat-item { text-align: center; padding: 20px; background: #f5f7fa; border-radius: 8px; }
.stat-value { font-size: 28px; font-weight: bold; color: #409eff; }
.stat-label { color: #909399; margin-top: 8px; }
.chart { height: 400px; }
</style>
