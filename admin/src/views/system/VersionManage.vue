<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>版本管理</span>
          <el-button type="primary" @click="handleAdd">发布新版本</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择" clearable>
            <el-option label="Android" value="android" />
            <el-option label="iOS" value="ios" />
            <el-option label="全部" value="all" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="version" label="版本号" width="120" />
        <el-table-column prop="platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ platformText[row.platform] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="更新说明" min-width="250" show-overflow-tooltip />
        <el-table-column prop="forceUpdate" label="强制更新" width="100">
          <template #default="{ row }">
            <el-tag :type="row.forceUpdate ? 'danger' : 'info'" size="small">
              {{ row.forceUpdate ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="170" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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

    <el-dialog v-model="formVisible" :title="isEdit ? '编辑版本' : '发布新版本'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="版本号" required>
          <el-input v-model="form.version" placeholder="如 1.0.0" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="form.platform">
            <el-option label="Android" value="android" />
            <el-option label="iOS" value="ios" />
            <el-option label="全部" value="all" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新说明">
          <el-input v-model="form.description" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item label="下载地址">
          <el-input v-model="form.downloadUrl" />
        </el-form-item>
        <el-form-item label="强制更新">
          <el-switch v-model="form.forceUpdate" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { systemApi } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const formVisible = ref(false)
const isEdit = ref(false)

const platformText = { android: 'Android', ios: 'iOS', all: '全部' }
const searchForm = reactive({ platform: '', dateRange: null })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({ id: null, version: '', platform: 'all', description: '', downloadUrl: '', forceUpdate: false })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await systemApi.getVersionList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, version: '', platform: 'all', description: '', downloadUrl: '', forceUpdate: false })
  formVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  formVisible.value = true
}

const handleSave = async () => {
  if (!form.version) { ElMessage.warning('请填写版本号'); return }
  const res = await systemApi.saveVersion(form)
  if (res.code === 200) {
    ElMessage.success(isEdit.value ? '更新成功' : '发布成功')
    formVisible.value = false
    fetchData()
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.search-form .el-select { width: 140px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
