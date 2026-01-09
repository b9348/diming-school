<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>导航分类管理</span>
          <div>
            <el-button type="primary" @click="handleAdd">添加导航</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图标" width="80">
          <template #default="{ row }">
            <el-image :src="row.icon" fit="contain" style="width: 32px; height: 32px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="jumpType" label="跳转类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ jumpTypeText[row.jumpType] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="跳转目标" min-width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleMove(row, -1)">上移</el-button>
            <el-button type="primary" link @click="handleMove(row, 1)">下移</el-button>
            <el-button :type="row.status === 1 ? 'warning' : 'success'" link @click="handleToggleStatus(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="formVisible" :title="isEdit ? '编辑导航' : '添加导航'" width="500px">
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
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="跳转类型" required>
          <el-select v-model="form.jumpType" placeholder="请选择跳转类型">
            <el-option label="帖子列表" value="post" />
            <el-option label="投票" value="vote" />
            <el-option label="跑腿" value="errand" />
            <el-option label="闲置" value="idle" />
            <el-option label="恋爱" value="love" />
            <el-option label="互助" value="help" />
            <el-option label="消息" value="message" />
            <el-option label="个人中心" value="mine" />
            <el-option label="外链" value="url" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.jumpType === 'url'" label="外链URL">
          <el-input v-model="form.target" placeholder="请输入外链地址" />
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
import { navApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const formVisible = ref(false)
const isEdit = ref(false)

const jumpTypeText = {
  post: '帖子列表',
  vote: '投票',
  errand: '跑腿',
  idle: '闲置',
  love: '恋爱',
  help: '互助',
  message: '消息',
  mine: '个人中心',
  url: '外链'
}

const form = reactive({
  id: null,
  icon: '',
  name: '',
  jumpType: 'post',
  target: '',
  sort: 0,
  status: 1
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await navApi.list()
    if (res.code === 200) {
      tableData.value = res.data.list
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    icon: '',
    name: '',
    jumpType: 'post',
    target: '',
    sort: tableData.value.length,
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
  if (!form.name) { ElMessage.warning('请输入名称'); return }

  const res = await navApi.saveOrUpdate(form)
  if (res.code === 200) {
    ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    formVisible.value = false
    fetchData()
  }
}

const handleMove = async (row, direction) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if ((direction === -1 && index === 0) || (direction === 1 && index === tableData.value.length - 1)) {
    return
  }

  const newIndex = index + direction
  const newSort = tableData.value[newIndex].sort
  const oldSort = row.sort

  const res1 = await navApi.saveOrUpdate({ id: row.id, sort: newSort })
  const res2 = await navApi.saveOrUpdate({ id: tableData.value[newIndex].id, sort: oldSort })

  if (res1.code === 200 && res2.code === 200) {
    fetchData()
  }
}

const handleToggleStatus = async (row) => {
  const res = await navApi.saveOrUpdate({ id: row.id, status: row.status === 1 ? 0 : 1 })
  if (res.code === 200) {
    ElMessage.success(row.status === 1 ? '已禁用' : '已启用')
    fetchData()
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该导航？', '提示')
  const res = await navApi.saveOrUpdate({ id: row.id, deleted: true })
  if (res.code === 200) { ElMessage.success('删除成功'); fetchData() }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.pagination { margin-top: 20px; justify-content: flex-end; }

.avatar-uploader { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.avatar-uploader:hover { border-color: #409eff; }
.avatar-uploader-icon { font-size: 24px; color: #8c939d; }
.icon-preview { width: 64px; height: 64px; object-fit: contain; }
</style>
