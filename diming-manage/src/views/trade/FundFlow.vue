<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>资金流水</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="流水类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
            <el-option label="退款" value="refund" />
            <el-option label="提现" value="withdraw" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe show-summary :summary-method="getSummary">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="关联订单" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeStyle[row.type]" size="small">{{ typeText[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span :class="row.type === 'income' ? 'text-success' : 'text-danger'">
              {{ row.type === 'income' ? '+' : '-' }}¥{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="{ row }">¥{{ row.balance }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="时间" width="170" />
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        :total="pagination.total"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="fetchData"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tradeApi } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])

const typeText = { income: '收入', expense: '支出', refund: '退款', withdraw: '提现' }
const typeStyle = { income: 'success', expense: 'danger', refund: 'warning', withdraw: 'info' }

const searchForm = reactive({ type: '', dateRange: null })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await tradeApi.getFundFlow({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }

const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

const getSummary = ({ columns, data }) => {
  const sums = []
  columns.forEach((col, index) => {
    if (index === 0) { sums[index] = '合计'; return }
    if (col.property === 'amount') {
      const total = data.reduce((sum, row) => {
        const val = row.type === 'income' ? row.amount : -row.amount
        return sum + val
      }, 0)
      sums[index] = `¥${total.toFixed(2)}`
    } else {
      sums[index] = ''
    }
  })
  return sums
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
.text-success { color: #67c23a; }
.text-danger { color: #f56c6c; }
</style>
