<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>内容审核</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="内容类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="帖子" value="post" />
            <el-option label="投票" value="vote" />
            <el-option label="跑腿" value="errand" />
            <el-option label="闲置" value="idle" />
            <el-option label="交友" value="love" />
            <el-option label="拍卖" value="help" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
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
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag size="small">{{ typeText[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="username" label="发布者" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="aiResult" label="AI审核" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.aiResult" :type="row.aiResult === 'pass' ? 'success' : 'danger'" size="small">
              {{ row.aiResult === 'pass' ? '通过' : '风险' }}
            </el-tag>
            <span v-else class="text-gray">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button type="success" link @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
            </template>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="内容详情" width="700px">
      <div v-if="currentItem" class="content-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="类型">{{ typeText[currentItem.type] }}</el-descriptions-item>
          <el-descriptions-item label="发布者">{{ currentItem.username }}</el-descriptions-item>
          <el-descriptions-item label="标题" :span="2">{{ currentItem.title }}</el-descriptions-item>
          <el-descriptions-item label="内容" :span="2">{{ currentItem.content }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="currentItem.images?.length" class="images-preview">
          <p>图片：</p>
          <el-image v-for="(img, i) in currentItem.images" :key="i" :src="img" fit="cover"
            :preview-src-list="currentItem.images" style="width: 100px; height: 100px; margin-right: 10px;" />
        </div>
        <div v-if="currentItem.aiReason" class="ai-reason">
          <el-alert :title="'AI审核结果：' + currentItem.aiReason" :type="currentItem.aiResult === 'pass' ? 'success' : 'warning'" />
        </div>
      </div>
    </el-dialog>

    <!-- 拒绝弹窗 -->
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
import { contentApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentItem = ref(null)
const rejectReason = ref('')

const typeText = { post: '帖子', vote: '投票', errand: '跑腿', idle: '闲置', love: '交友', help: '拍卖' }
const statusType = { pending: 'warning', approved: 'success', rejected: 'danger' }
const statusText = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }

const searchForm = reactive({ type: '', status: 'pending' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await contentApi.getAuditList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleDetail = (row) => { currentItem.value = row; detailVisible.value = true }

const handleApprove = async (row) => {
  await ElMessageBox.confirm('确定通过该内容？', '提示')
  const res = await contentApi.approve(row.id)
  if (res.code === 200) { ElMessage.success('已通过'); fetchData() }
}

const handleReject = (row) => { currentItem.value = row; rejectReason.value = ''; rejectVisible.value = true }

const confirmReject = async () => {
  if (!rejectReason.value) { ElMessage.warning('请输入拒绝原因'); return }
  const res = await contentApi.reject(currentItem.value.id, { reason: rejectReason.value })
  if (res.code === 200) { ElMessage.success('已拒绝'); rejectVisible.value = false; fetchData() }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该内容？此操作不可恢复', '警告', { type: 'warning' })
  const res = await contentApi.delete(row.id)
  if (res.code === 200) { ElMessage.success('已删除'); fetchData() }
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
.text-gray { color: #999; }
.images-preview { margin-top: 15px; }
.ai-reason { margin-top: 15px; }
</style>
