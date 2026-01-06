<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>收入统计</span>
          <div class="filter-group">
            <el-select v-model="searchForm.incomeType" placeholder="收入类型" clearable @change="fetchData">
              <el-option label="全部类型" value="" />
              <el-option label="平台佣金" value="commission" />
              <el-option label="广告收入" value="ad" />
              <el-option label="其他收入" value="other" />
            </el-select>
            <el-radio-group v-model="searchForm.timeRange" @change="handleTimeRangeChange">
              <el-radio-button label="7">近7天</el-radio-button>
              <el-radio-button label="30">近30天</el-radio-button>
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
const searchForm = reactive({ incomeType: '', timeRange: '7', dateRange: null })
let chart

const handleTimeRangeChange = () => {
  if (searchForm.timeRange !== 'custom') fetchData()
}

const stats = reactive([
  { label: '总收入', value: '¥0' },
  { label: '平台佣金', value: '¥0' },
  { label: '广告收入', value: '¥0' },
  { label: '其他收入', value: '¥0' }
])

const fetchData = async () => {
  const params = { days: searchForm.timeRange, incomeType: searchForm.incomeType }
  if (searchForm.timeRange === 'custom' && searchForm.dateRange) params.dateRange = searchForm.dateRange
  const res = await statisticsApi.getIncomeData(params)
  if (res.code === 200) {
    const d = res.data
    stats[0].value = '¥' + d.total
    stats[1].value = '¥' + d.commission
    stats[2].value = '¥' + d.ad
    stats[3].value = '¥' + d.other
    updateChart(d)
  }
}

const updateChart = (data) => {
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['平台佣金', '广告收入', '其他'], bottom: 0 },
    xAxis: { type: 'category', data: data.dates },
    yAxis: { type: 'value' },
    series: [
      { name: '平台佣金', type: 'bar', stack: 'total', data: data.commissionTrend },
      { name: '广告收入', type: 'bar', stack: 'total', data: data.adTrend },
      { name: '其他', type: 'bar', stack: 'total', data: data.otherTrend }
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
.stat-value { font-size: 28px; font-weight: bold; color: #f56c6c; }
.stat-label { color: #909399; margin-top: 8px; }
.chart { height: 400px; }
</style>
