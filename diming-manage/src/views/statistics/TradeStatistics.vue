<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>交易数据统计</span>
          <div class="filter-group">
            <el-select v-model="searchForm.type" placeholder="交易类型" clearable @change="fetchData">
              <el-option label="全部类型" value="" />
              <el-option label="跑腿" value="errand" />
              <el-option label="闲置" value="idle" />
              <el-option label="拍卖" value="help" />
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

      <el-row :gutter="20">
        <el-col :span="16">
          <div ref="trendChartRef" class="chart"></div>
        </el-col>
        <el-col :span="8">
          <div ref="typeChartRef" class="chart"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { statisticsApi } from '@/api'

const trendChartRef = ref()
const typeChartRef = ref()
const searchForm = reactive({ type: '', timeRange: '7', dateRange: null })
let trendChart, typeChart

const handleTimeRangeChange = () => {
  if (searchForm.timeRange !== 'custom') fetchData()
}

const stats = reactive([
  { label: '总交易额', value: '¥0' },
  { label: '订单数', value: 0 },
  { label: '客单价', value: '¥0' },
  { label: '完成率', value: '0%' }
])

const fetchData = async () => {
  const params = { days: searchForm.timeRange, type: searchForm.type }
  if (searchForm.timeRange === 'custom' && searchForm.dateRange) params.dateRange = searchForm.dateRange
  const res = await statisticsApi.getTradeData(params)
  if (res.code === 200) {
    const d = res.data
    stats[0].value = '¥' + d.totalAmount
    stats[1].value = d.orderCount
    stats[2].value = '¥' + d.avgPrice
    stats[3].value = d.completeRate + '%'
    updateCharts(d)
  }
}

const updateCharts = (data) => {
  trendChart.setOption({
    title: { text: '交易趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['交易额', '订单数'], bottom: 0 },
    xAxis: { type: 'category', data: data.dates },
    yAxis: [{ type: 'value', name: '金额' }, { type: 'value', name: '订单' }],
    series: [
      { name: '交易额', type: 'line', data: data.amounts },
      { name: '订单数', type: 'bar', yAxisIndex: 1, data: data.orders }
    ]
  })

  typeChart.setOption({
    title: { text: '交易类型分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '60%', data: data.typeDistribution }]
  })
}

onMounted(() => {
  trendChart = echarts.init(trendChartRef.value)
  typeChart = echarts.init(typeChartRef.value)
  fetchData()
  window.addEventListener('resize', () => { trendChart?.resize(); typeChart?.resize() })
})

onUnmounted(() => { trendChart?.dispose(); typeChart?.dispose() })
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
.filter-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.filter-group .el-select { width: 140px; }
.stat-row { margin-bottom: 20px; }
.stat-item { text-align: center; padding: 20px; background: #f5f7fa; border-radius: 8px; }
.stat-value { font-size: 28px; font-weight: bold; color: #e6a23c; }
.stat-label { color: #909399; margin-top: 8px; }
.chart { height: 350px; }
</style>
