<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>订单查询</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="跑腿" value="errand" />
            <el-option label="闲置" value="idle" />
            <el-option label="拍卖" value="help" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待支付" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag size="small">{{ typeText[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品/服务" min-width="150" show-overflow-tooltip />
        <el-table-column prop="buyer" label="买家" width="100" />
        <el-table-column prop="seller" label="卖家" width="100" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        :total="pagination.total"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="fetchData"
      />
    </el-card>

    <el-dialog v-model="detailVisible" title="订单详情" width="600px">
      <el-descriptions :column="2" border v-if="currentOrder">
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ typeText[currentOrder.type] }}</el-descriptions-item>
        <el-descriptions-item label="买家">{{ currentOrder.buyer }}</el-descriptions-item>
        <el-descriptions-item label="卖家">{{ currentOrder.seller }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ currentOrder.amount }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusText[currentOrder.status] }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentOrder.createdAt }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tradeApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const currentOrder = ref(null)

const typeText = { errand: '跑腿', idle: '闲置', help: '拍卖' }
const statusText = { pending: '待支付', processing: '进行中', completed: '已完成', cancelled: '已取消' }
const statusType = { pending: 'warning', processing: 'primary', completed: 'success', cancelled: 'info' }

const searchForm = reactive({ orderNo: '', type: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await tradeApi.getOrderList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.type = ''
  searchForm.status = ''
  handleSearch()
}

const handleDetail = async (row) => {
  const res = await tradeApi.getOrderDetail(row.id)
  if (res.code === 200) {
    currentOrder.value = res.data
    detailVisible.value = true
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
