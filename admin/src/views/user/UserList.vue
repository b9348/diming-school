<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="已封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="school" label="学校" min-width="150" />
        <el-table-column prop="verified" label="实名认证" width="100">
          <template #default="{ row }">
            <el-tag :type="row.verified ? 'success' : 'info'" size="small">
              {{ row.verified ? '已认证' : '未认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'" size="small">
              {{ row.status === 'normal' ? '正常' : '已封禁' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="170" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'normal'" type="danger" link @click="handleBan(row)">封禁</el-button>
            <el-button v-else type="success" link @click="handleUnban(row)">解封</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="detailVisible" title="用户详情" width="600px">
      <el-descriptions :column="2" border v-if="currentUser">
        <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{ currentUser.school }}</el-descriptions-item>
        <el-descriptions-item label="院系">{{ currentUser.department }}</el-descriptions-item>
        <el-descriptions-item label="实名认证">{{ currentUser.verified ? '已认证' : '未认证' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ currentUser.status === 'normal' ? '正常' : '已封禁' }}</el-descriptions-item>
        <el-descriptions-item label="注册时间" :span="2">{{ currentUser.createdAt }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 封禁弹窗 -->
    <el-dialog v-model="banVisible" title="封禁用户" width="500px">
      <el-form :model="banForm" label-width="80px">
        <el-form-item label="封禁原因">
          <el-input v-model="banForm.reason" type="textarea" rows="3" placeholder="请输入封禁原因" />
        </el-form-item>
        <el-form-item label="封禁时长">
          <el-select v-model="banForm.duration">
            <el-option label="1天" :value="1" />
            <el-option label="7天" :value="7" />
            <el-option label="30天" :value="30" />
            <el-option label="永久" :value="-1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="banVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBan">确认封禁</el-button>
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
const detailVisible = ref(false)
const banVisible = ref(false)
const currentUser = ref(null)

const searchForm = reactive({
  username: '',
  phone: '',
  status: '',
  dateRange: null
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const banForm = reactive({
  reason: '',
  duration: 1
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await userApi.getList({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
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

const handleReset = () => {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = ''
  searchForm.dateRange = null
  handleSearch()
}

const handleDetail = async (row) => {
  const res = await userApi.getDetail(row.id)
  if (res.code === 200) {
    currentUser.value = res.data
    detailVisible.value = true
  }
}

const handleBan = (row) => {
  currentUser.value = row
  banForm.reason = ''
  banForm.duration = 1
  banVisible.value = true
}

const confirmBan = async () => {
  const res = await userApi.ban(currentUser.value.id, banForm)
  if (res.code === 200) {
    ElMessage.success('封禁成功')
    banVisible.value = false
    fetchData()
  }
}

const handleUnban = async (row) => {
  await ElMessageBox.confirm('确定要解封该用户吗？', '提示')
  const res = await userApi.unban(row.id)
  if (res.code === 200) {
    ElMessage.success('解封成功')
    fetchData()
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.page-container {
  padding: 0;
}
.search-form {
  margin-bottom: 20px;
}
.search-form .el-select {
  width: 140px;
}
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
