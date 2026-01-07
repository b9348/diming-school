<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>退款管理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="searchForm.applicant" placeholder="请输入申请人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="reason" label="退款原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="amount" label="退款金额" width="100">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="170" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button type="success" link @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
            </template>
            <span v-else class="text-gray">已处理</span>
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

    <el-dialog v-model="rejectVisible" title="拒绝原因" width="400px">
      <el-input v-model="rejectReason" type="textarea" rows="3" placeholder="请输入拒绝原因" />
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tradeApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const rejectVisible = ref(false)
const currentRow = ref(null)
const rejectReason = ref('')

const statusText = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
const statusType = { pending: 'warning', approved: 'success', rejected: 'danger' }

const searchForm = reactive({ orderNo: '', applicant: '', status: 'pending', dateRange: null })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await tradeApi.getRefundList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }

const handleApprove = async (row) => {
  await ElMessageBox.confirm('确定通过该退款申请？', '提示')
  const res = await tradeApi.approveRefund(row.id)
  if (res.code === 200) { ElMessage.success('已通过'); fetchData() }
}

const handleReject = (row) => {
  currentRow.value = row
  rejectReason.value = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  if (!rejectReason.value) { ElMessage.warning('请输入拒绝原因'); return }
  const res = await tradeApi.rejectRefund(currentRow.value.id, { reason: rejectReason.value })
  if (res.code === 200) { ElMessage.success('已拒绝'); rejectVisible.value = false; fetchData() }
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.search-form .el-select { width: 140px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
.text-gray { color: #999; }
</style>
