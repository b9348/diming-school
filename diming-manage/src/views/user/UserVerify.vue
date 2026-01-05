<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>实名认证审核</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="school" label="学校" min-width="150" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column label="证件照片" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="previewImages(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="170" />
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
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible" title="证件照片" width="600px">
      <div class="image-preview">
        <el-image v-for="(img, i) in previewImages" :key="i" :src="img" fit="contain" :preview-src-list="previewImages" />
      </div>
    </el-dialog>

    <!-- 拒绝原因 -->
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
import { userApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const previewVisible = ref(false)
const rejectVisible = ref(false)
const currentRow = ref(null)
const rejectReason = ref('')
const previewImageList = ref([])

const statusType = { pending: 'warning', approved: 'success', rejected: 'danger' }
const statusText = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }

const searchForm = reactive({ status: 'pending' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await userApi.getVerifyList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const previewImages = (row) => {
  previewImageList.value = row.images || []
  previewVisible.value = true
}

const handleApprove = async (row) => {
  await ElMessageBox.confirm('确定通过该认证申请？', '提示')
  const res = await userApi.approveVerify(row.id)
  if (res.code === 200) {
    ElMessage.success('审核通过')
    fetchData()
  }
}

const handleReject = (row) => {
  currentRow.value = row
  rejectReason.value = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  if (!rejectReason.value) {
    ElMessage.warning('请输入拒绝原因')
    return
  }
  const res = await userApi.rejectVerify(currentRow.value.id, { reason: rejectReason.value })
  if (res.code === 200) {
    ElMessage.success('已拒绝')
    rejectVisible.value = false
    fetchData()
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
.image-preview { display: flex; gap: 10px; flex-wrap: wrap; }
.image-preview .el-image { width: 200px; height: 150px; }
.text-gray { color: #999; }
</style>
