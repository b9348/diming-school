<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>论坛管理</span>
          <div>
            <el-button type="primary" @click="handleAdd">添加论坛</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="论坛名称">
          <el-input v-model="searchForm.keyword" placeholder="搜索论坛名称" clearable />
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
        <el-table-column label="图标" width="80">
          <template #default="{ row }">
            <el-image :src="row.icon" fit="contain" style="width: 40px; height: 40px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="description" label="简介" min-width="200" show-overflow-tooltip />
        <el-table-column prop="adminCount" label="管理员数" width="100" align="center" />
        <el-table-column prop="postCount" label="帖子数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleManageAdmins(row)">管理员</el-button>
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
    <el-dialog v-model="formVisible" :title="isEdit ? '编辑论坛' : '添加论坛'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="图标" required>
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleIconSuccess"
            :before-upload="beforeIconUpload"
          >
            <img v-if="form.icon" :src="form.icon" class="icon-preview" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="请输入论坛名称" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入论坛简介" />
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

    <!-- 管理员管理弹窗 -->
    <el-dialog v-model="adminVisible" title="管理员设置" width="600px">
      <el-form :inline="true" class="admin-search">
        <el-form-item>
          <el-input v-model="adminSearchForm.keyword" placeholder="搜索用户ID或昵称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">搜索</el-button>
        </el-form-item>
      </el-form>

      <div class="admin-section">
        <h4>当前管理员</h4>
        <el-tag
          v-for="admin in currentAdmins"
          :key="admin.id"
          closable
          @close="removeAdmin(admin)"
          style="margin: 4px"
        >
          {{ admin.nickname || admin.username }} (ID: {{ admin.id }})
        </el-tag>
        <el-empty v-if="currentAdmins.length === 0" description="暂无管理员" :image-size="60" />
      </div>

      <div class="admin-section" v-if="searchResults.length > 0">
        <h4>搜索结果（点击添加）</h4>
        <el-tag
          v-for="user in searchResults"
          :key="user.id"
          type="success"
          @click="addAdmin(user)"
          style="margin: 4px; cursor: pointer"
        >
          {{ user.nickname || user.username }} (ID: {{ user.id }})
        </el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { forumApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const formVisible = ref(false)
const adminVisible = ref(false)
const isEdit = ref(false)
const currentForumId = ref(null)
const currentAdmins = ref([])
const searchResults = ref([])

const searchForm = reactive({ keyword: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const adminSearchForm = reactive({ keyword: '' })
const form = reactive({
  id: null,
  icon: '',
  name: '',
  description: '',
  status: 1
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await forumApi.list({ ...searchForm, ...pagination })
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
    icon: '',
    name: '',
    description: '',
    status: 1
  })
  formVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  formVisible.value = true
}

const handleIconSuccess = (res) => {
  form.icon = res.url || res.data?.url || ''
}

const beforeIconUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('只能上传图片文件')
  if (!isLt2M) ElMessage.error('图片大小不能超过2MB')
  return isImage && isLt2M
}

const confirmSave = async () => {
  if (!form.icon) { ElMessage.warning('请上传图标'); return }
  if (!form.name) { ElMessage.warning('请输入论坛名称'); return }

  const res = await forumApi.saveOrUpdate(form)
  if (res.code === 200) {
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    formVisible.value = false
    fetchData()
  }
}

const handleToggleStatus = async (row) => {
  const res = await forumApi.saveOrUpdate({ id: row.id, status: row.status === 1 ? 0 : 1 })
  if (res.code === 200) {
    ElMessage.success(row.status === 1 ? '已禁用' : '已启用')
    fetchData()
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该论坛？', '提示')
  const res = await forumApi.saveOrUpdate({ id: row.id, deleted: true })
  if (res.code === 200) { ElMessage.success('删除成功'); fetchData() }
}

const handleManageAdmins = async (row) => {
  currentForumId.value = row.id
  adminSearchForm.keyword = ''
  searchResults.value = []
  currentAdmins.value = row.admins || []
  adminVisible.value = true
}

const searchUser = async () => {
  if (!adminSearchForm.keyword.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  // 模拟搜索结果
  searchResults.value = [
    { id: 1, nickname: '用户1' },
    { id: 2, nickname: '用户2' }
  ].filter(u => u.nickname.includes(adminSearchForm.keyword) || u.id.toString().includes(adminSearchForm.keyword))
}

const addAdmin = async (user) => {
  if (currentAdmins.value.some(a => a.id === user.id)) {
    ElMessage.warning('该用户已是管理员')
    return
  }

  const res = await forumApi.addAdmins(currentForumId.value, { userId: user.id })
  if (res.code === 200) {
    ElMessage.success('添加成功')
    currentAdmins.value.push(user)
    // 更新表格数据中的管理员数
    const row = tableData.value.find(t => t.id === currentForumId.value)
    if (row) row.adminCount++
  }
}

const removeAdmin = async (admin) => {
  await ElMessageBox.confirm(`确定移除管理员 ${admin.nickname || admin.username}？`, '提示')
  const res = await forumApi.addAdmins(currentForumId.value, { userId: admin.id, removed: true })
  if (res.code === 200) {
    ElMessage.success('移除成功')
    currentAdmins.value = currentAdmins.value.filter(a => a.id !== admin.id)
    // 更新表格数据中的管理员数
    const row = tableData.value.find(t => t.id === currentForumId.value)
    if (row) row.adminCount--
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }

.avatar-uploader { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.avatar-uploader:hover { border-color: #409eff; }
.avatar-uploader-icon { font-size: 24px; color: #8c939d; }
.icon-preview { width: 64px; height: 64px; object-fit: contain; }

.admin-search { margin-bottom: 20px; }
.admin-section { margin-top: 20px; }
.admin-section h4 { margin-bottom: 10px; color: #606266; }
</style>
