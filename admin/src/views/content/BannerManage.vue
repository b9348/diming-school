<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>轮播图管理</span>
          <div>
            <el-button type="primary" @click="handleAdd">添加轮播图</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="位置">
          <el-select v-model="searchForm.position" placeholder="全部" clearable>
            <el-option label="首页" value="index" />
            <el-option label="跑腿" value="errand" />
            <el-option label="闲置" value="idle" />
            <el-option label="投票" value="vote" />
            <el-option label="恋爱" value="love" />
            <el-option label="互助" value="help" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="120">
          <template #default="{ row }">
            <el-image :src="row.image" fit="cover" style="width: 100px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="120" />
        <el-table-column prop="position" label="位置" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ positionText[row.position] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" width="170">
          <template #default="{ row }">
            {{ row.startTime }} ~ {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button :type="row.status === 1 ? 'warning' : 'success'" link @click="handleToggleStatus(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
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
    <el-dialog v-model="formVisible" :title="isEdit ? '编辑轮播图' : '添加轮播图'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="图片" required>
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="form.image" :src="form.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="位置" required>
          <el-select v-model="form.position" placeholder="请选择位置">
            <el-option label="首页" value="index" />
            <el-option label="跑腿" value="errand" />
            <el-option label="闲置" value="idle" />
            <el-option label="投票" value="vote" />
            <el-option label="恋爱" value="love" />
            <el-option label="互助" value="help" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型" required>
          <el-select v-model="form.jumpType" placeholder="请选择跳转类型">
            <el-option label="无跳转" value="none" />
            <el-option label="帖子详情" value="post" />
            <el-option label="投票详情" value="vote" />
            <el-option label="跑腿详情" value="errand" />
            <el-option label="闲置详情" value="idle" />
            <el-option label="恋爱详情" value="love" />
            <el-option label="互助详情" value="help" />
            <el-option label="外链" value="url" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.jumpType === 'post' || form.jumpType === 'vote' || form.jumpType === 'errand' || form.jumpType === 'idle' || form.jumpType === 'love' || form.jumpType === 'help'" label="跳转目标">
          <el-input v-model="form.targetId" placeholder="请输入目标ID" />
        </el-form-item>
        <el-form-item v-if="form.jumpType === 'url'" label="外链URL">
          <el-input v-model="form.url" placeholder="请输入外链地址" />
        </el-form-item>
        <el-form-item label="生效时间" required>
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { bannerApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const formVisible = ref(false)
const isEdit = ref(false)

const positionText = {
  index: '首页',
  errand: '跑腿',
  idle: '闲置',
  vote: '投票',
  love: '恋爱',
  help: '互助'
}

const searchForm = reactive({ position: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const form = reactive({
  id: null,
  image: '',
  title: '',
  position: 'index',
  jumpType: 'none',
  targetId: '',
  url: '',
  dateRange: [],
  startTime: '',
  endTime: '',
  sort: 0,
  status: 1
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await bannerApi.list({ ...searchForm, ...pagination })
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
  Object.assign(form, {
    id: null,
    image: '',
    title: '',
    position: 'index',
    jumpType: 'none',
    targetId: '',
    url: '',
    dateRange: [],
    startTime: '',
    endTime: '',
    sort: 0,
    status: 1
  })
  formVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    ...row,
    dateRange: [row.startTime, row.endTime]
  })
  formVisible.value = true
}

const handleImageSuccess = (res) => {
  form.image = res.url || res.data?.url || ''
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('只能上传图片文件')
  if (!isLt2M) ElMessage.error('图片大小不能超过2MB')
  return isImage && isLt2M
}

const confirmSave = async () => {
  if (!form.image) { ElMessage.warning('请上传图片'); return }
  if (!form.title) { ElMessage.warning('请输入标题'); return }
  if (!form.dateRange || form.dateRange.length !== 2) { ElMessage.warning('请选择生效时间'); return }

  const data = { ...form, startTime: form.dateRange[0], endTime: form.dateRange[1] }
  delete data.dateRange

  const res = await bannerApi.saveOrUpdate(data)
  if (res.code === 200) {
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    formVisible.value = false
    fetchData()
  }
}

const handleToggleStatus = async (row) => {
  const res = await bannerApi.saveOrUpdate({ id: row.id, status: row.status === 1 ? 0 : 1 })
  if (res.code === 200) {
    ElMessage.success(row.status === 1 ? '已禁用' : '已启用')
    fetchData()
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该轮播图？', '提示')
  const res = await bannerApi.saveOrUpdate({ id: row.id, deleted: true })
  if (res.code === 200) { ElMessage.success('删除成功'); fetchData() }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.search-form .el-select { width: 120px; }
.pagination { margin-top: 20px; justify-content: flex-end; }

.avatar-uploader { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; width: 120px; height: 80px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.avatar-uploader:hover { border-color: #409eff; }
.avatar-uploader-icon { font-size: 28px; color: #8c939d; }
.avatar { width: 120px; height: 80px; object-fit: cover; }
</style>
