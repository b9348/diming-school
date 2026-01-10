<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>地区配置管理</span>
          <el-button type="primary" @click="handleAdd">添加地区</el-button>
        </div>
      </template>

      <el-table :data="regionList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="完整名称" width="150" />
        <el-table-column prop="label" label="显示标签" width="120" />
        <el-table-column prop="value" label="值" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="handleToggle(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="完整名称">
          <el-input v-model="formData.name" placeholder="如：全国可见" />
        </el-form-item>
        <el-form-item label="显示标签">
          <el-input v-model="formData.label" placeholder="如：全国" />
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="formData.value" placeholder="如：all" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="全部" value="all" />
            <el-option label="城市" value="city" />
            <el-option label="校区" value="school" />
            <el-option label="其他" value="other" />
            <el-option label="区域" value="zone" />
            <el-option label="指定" value="specify" />
            <el-option label="区" value="district" />
            <el-option label="省" value="province" />
            <el-option label="大区" value="region" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { configApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const regionList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加地区')
const submitting = ref(false)

const formData = reactive({
  id: null,
  name: '',
  label: '',
  value: '',
  type: 'all',
  enabled: true
})

const getTypeName = (type) => {
  const map = {
    all: '全部',
    city: '城市',
    school: '校区',
    other: '其他',
    zone: '区域',
    specify: '指定',
    district: '区',
    province: '省',
    region: '大区'
  }
  return map[type] || type
}

const getTypeColor = (type) => {
  const map = {
    all: 'success',
    city: 'primary',
    school: 'warning',
    region: 'danger'
  }
  return map[type] || 'info'
}

const fetchRegionList = async () => {
  try {
    const res = await configApi.getRegionList()
    if (res.code === 200) {
      regionList.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('加载地区列表失败')
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加地区'
  Object.assign(formData, { id: null, name: '', label: '', value: '', type: 'all', enabled: true })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑地区'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleToggle = async (row) => {
  try {
    const res = await configApi.saveRegion(row)
    if (res.code === 200) {
      ElMessage.success('状态更新成功')
    }
  } catch (error) {
    ElMessage.error('状态更新失败')
    row.enabled = !row.enabled
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该地区配置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await configApi.deleteRegion(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchRegionList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const res = await configApi.saveRegion(formData)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchRegionList()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => fetchRegionList())
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
