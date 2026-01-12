<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>意见反馈</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="反馈类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="功能异常" value="bug" />
            <el-option label="功能建议" value="suggest" />
            <el-option label="投诉举报" value="complaint" />
            <el-option label="其他问题" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="已处理" value="handled" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="反馈内容/联系方式" clearable />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]" size="small">{{ typeText[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="nickname" label="用户" width="100" />
        <el-table-column prop="contact" label="联系方式" width="130">
          <template #default="{ row }">
            {{ row.contact || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="170" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link @click="handleReply(row)">回复</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="反馈详情" width="600px">
      <el-descriptions :column="1" border v-if="currentRow">
        <el-descriptions-item label="反馈类型">
          <el-tag :type="typeTagMap[currentRow.type]" size="small">{{ typeText[currentRow.type] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="反馈内容">{{ currentRow.content }}</el-descriptions-item>
        <el-descriptions-item label="图片" v-if="currentRow.images && currentRow.images.length">
          <div class="image-list">
            <el-image v-for="(img, index) in currentRow.images" :key="index" :src="img" :preview-src-list="currentRow.images" fit="cover" style="width: 80px; height: 80px; margin-right: 8px;" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ currentRow.contact || '-' }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentRow.nickname }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentRow.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentRow.status === 'pending' ? 'warning' : 'success'" size="small">
            {{ currentRow.status === 'pending' ? '待处理' : '已处理' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="回复内容" v-if="currentRow.reply">{{ currentRow.reply }}</el-descriptions-item>
        <el-descriptions-item label="处理人" v-if="currentRow.handledBy">{{ currentRow.handledBy }}</el-descriptions-item>
        <el-descriptions-item label="处理时间" v-if="currentRow.handledAt">{{ currentRow.handledAt }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 回复弹窗 -->
    <el-dialog v-model="replyVisible" title="回复反馈" width="500px">
      <el-form :model="replyForm" label-width="80px">
        <el-form-item label="回复内容">
          <el-input v-model="replyForm.reply" type="textarea" rows="4" placeholder="请输入回复内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReply">确认回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { feedbackApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const replyVisible = ref(false)
const currentRow = ref(null)

const typeText = { bug: '功能异常', suggest: '功能建议', complaint: '投诉举报', other: '其他问题' }
const typeTagMap = { bug: 'danger', suggest: 'primary', complaint: 'warning', other: 'info' }

const searchForm = reactive({ type: '', status: '', keyword: '', dateRange: null })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const replyForm = reactive({ reply: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await feedbackApi.getList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }

const handleDetail = (row) => {
  currentRow.value = row
  detailVisible.value = true
}

const handleReply = (row) => {
  currentRow.value = row
  replyForm.reply = ''
  replyVisible.value = true
}

const confirmReply = async () => {
  if (!replyForm.reply.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  const res = await feedbackApi.handle(currentRow.value.id, replyForm)
  if (res.code === 200) {
    ElMessage.success('回复成功')
    replyVisible.value = false
    fetchData()
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这条反馈吗？', '提示', { type: 'warning' })
    .then(async () => {
      const res = await feedbackApi.delete(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {})
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.search-form .el-select { width: 140px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
.image-list { display: flex; flex-wrap: wrap; }
</style>
