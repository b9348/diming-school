<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>交易纠纷处理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="reason" label="纠纷原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="respondent" label="被申请人" width="100" />
        <el-table-column prop="amount" label="涉及金额" width="100">
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
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status !== 'resolved'" type="success" link @click="handleProcess(row)">处理</el-button>
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

    <!-- 处理弹窗 -->
    <el-dialog v-model="processVisible" title="处理纠纷" width="500px">
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="处理结果">
          <el-radio-group v-model="processForm.result">
            <el-radio value="buyer">支持买家</el-radio>
            <el-radio value="seller">支持卖家</el-radio>
            <el-radio value="both">双方协商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款金额" v-if="processForm.result === 'buyer'">
          <el-input-number v-model="processForm.refundAmount" :min="0" />
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input v-model="processForm.remark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmProcess">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tradeApi } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const processVisible = ref(false)
const currentRow = ref(null)

const statusText = { pending: '待处理', processing: '处理中', resolved: '已解决' }
const statusType = { pending: 'warning', processing: 'primary', resolved: 'success' }

const searchForm = reactive({ status: 'pending' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const processForm = reactive({ result: 'buyer', refundAmount: 0, remark: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await tradeApi.getDisputeList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleDetail = (row) => { currentRow.value = row }

const handleProcess = (row) => {
  currentRow.value = row
  processForm.result = 'buyer'
  processForm.refundAmount = row.amount
  processForm.remark = ''
  processVisible.value = true
}

const confirmProcess = async () => {
  const res = await tradeApi.handleDispute(currentRow.value.id, processForm)
  if (res.code === 200) {
    ElMessage.success('处理成功')
    processVisible.value = false
    fetchData()
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
