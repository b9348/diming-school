<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>举报处理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="已处理" value="handled" />
          </el-select>
        </el-form-item>
        <el-form-item label="举报类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="违规内容" value="content" />
            <el-option label="用户行为" value="user" />
            <el-option label="交易纠纷" value="trade" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ typeText[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="举报原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="reporter" label="举报人" width="100" />
        <el-table-column prop="reported" label="被举报人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="举报时间" width="170" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link @click="handleProcess(row)">处理</el-button>
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
    <el-dialog v-model="processVisible" title="处理举报" width="500px">
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="处理结果">
          <el-radio-group v-model="processForm.result">
            <el-radio value="valid">举报有效</el-radio>
            <el-radio value="invalid">举报无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理措施" v-if="processForm.result === 'valid'">
          <el-checkbox-group v-model="processForm.actions">
            <el-checkbox value="delete">删除内容</el-checkbox>
            <el-checkbox value="warn">警告用户</el-checkbox>
            <el-checkbox value="ban">封禁用户</el-checkbox>
          </el-checkbox-group>
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
import { contentApi } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const processVisible = ref(false)
const currentRow = ref(null)

const typeText = { content: '违规内容', user: '用户行为', trade: '交易纠纷' }
const searchForm = reactive({ status: 'pending', type: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const processForm = reactive({ result: 'valid', actions: [], remark: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await contentApi.getReportList({ ...searchForm, ...pagination })
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
  processForm.result = 'valid'
  processForm.actions = []
  processForm.remark = ''
  processVisible.value = true
}

const confirmProcess = async () => {
  const res = await contentApi.handleReport(currentRow.value.id, processForm)
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
