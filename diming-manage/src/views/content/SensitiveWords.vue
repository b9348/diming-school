<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>敏感词库管理</span>
          <div>
            <el-button type="primary" @click="handleAdd">添加敏感词</el-button>
            <el-button @click="handleBatchAdd">批量导入</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索敏感词" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择" clearable>
            <el-option label="政治敏感" value="political" />
            <el-option label="色情低俗" value="porn" />
            <el-option label="暴力恐怖" value="violence" />
            <el-option label="广告推广" value="ad" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="word" label="敏感词" min-width="150" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ categoryText[row.category] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="levelType[row.level]" size="small">{{ levelText[row.level] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="replacement" label="替换词" width="120" />
        <el-table-column prop="createdAt" label="添加时间" width="170" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="formVisible" :title="isEdit ? '编辑敏感词' : '添加敏感词'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="敏感词" required>
          <el-input v-model="form.word" placeholder="请输入敏感词" />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="form.category" placeholder="请选择">
            <el-option label="政治敏感" value="political" />
            <el-option label="色情低俗" value="porn" />
            <el-option label="暴力恐怖" value="violence" />
            <el-option label="广告推广" value="ad" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.level">
            <el-option label="低" :value="1" />
            <el-option label="中" :value="2" />
            <el-option label="高" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="替换词">
          <el-input v-model="form.replacement" placeholder="留空则使用*替换" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="batchVisible" title="批量导入敏感词" width="500px">
      <el-form label-width="80px">
        <el-form-item label="分类">
          <el-select v-model="batchForm.category">
            <el-option label="政治敏感" value="political" />
            <el-option label="色情低俗" value="porn" />
            <el-option label="暴力恐怖" value="violence" />
            <el-option label="广告推广" value="ad" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="敏感词">
          <el-input v-model="batchForm.words" type="textarea" rows="6" placeholder="每行一个敏感词" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatch">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { sensitiveApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const formVisible = ref(false)
const batchVisible = ref(false)
const isEdit = ref(false)

const categoryText = { political: '政治敏感', porn: '色情低俗', violence: '暴力恐怖', ad: '广告推广', other: '其他' }
const levelText = { 1: '低', 2: '中', 3: '高' }
const levelType = { 1: 'info', 2: 'warning', 3: 'danger' }

const searchForm = reactive({ keyword: '', category: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({ id: null, word: '', category: 'other', level: 2, replacement: '' })
const batchForm = reactive({ category: 'other', words: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await sensitiveApi.getList({ ...searchForm, ...pagination })
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
  Object.assign(form, { id: null, word: '', category: 'other', level: 2, replacement: '' })
  formVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  formVisible.value = true
}

const confirmSave = async () => {
  if (!form.word) { ElMessage.warning('请输入敏感词'); return }
  const api = isEdit.value ? sensitiveApi.update(form.id, form) : sensitiveApi.add(form)
  const res = await api
  if (res.code === 200) {
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该敏感词？', '提示')
  const res = await sensitiveApi.delete(row.id)
  if (res.code === 200) { ElMessage.success('删除成功'); fetchData() }
}

const handleBatchAdd = () => {
  batchForm.category = 'other'
  batchForm.words = ''
  batchVisible.value = true
}

const confirmBatch = async () => {
  if (!batchForm.words.trim()) { ElMessage.warning('请输入敏感词'); return }
  const words = batchForm.words.split('\n').filter(w => w.trim())
  const res = await sensitiveApi.batchAdd({ category: batchForm.category, words })
  if (res.code === 200) {
    ElMessage.success(`成功导入 ${words.length} 个敏感词`)
    batchVisible.value = false
    fetchData()
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
