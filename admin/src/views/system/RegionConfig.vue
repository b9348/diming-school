<template>
  <div class="page-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <!-- 地区管理标签页 -->
        <el-tab-pane label="地区管理" name="region">
          <div style="margin-bottom: 16px;">
            <el-button type="primary" @click="handleAddRegion">添加地区</el-button>
          </div>
          <el-table :data="regionList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="地区名称" width="150" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getRegionTypeColor(row.type)">{{ getRegionTypeName(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" @change="handleToggleRegion(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEditRegion(row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDeleteRegion(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 校区管理标签页 -->
        <el-tab-pane label="校区管理" name="school">
          <div style="margin-bottom: 16px;">
            <el-button type="primary" @click="handleAddSchool">添加校区</el-button>
          </div>
          <el-table :data="schoolList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="校区名称" width="200" />
            <el-table-column prop="region_name" label="所属地区" width="150" />
            <el-table-column prop="enabled" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" @change="handleToggleSchool(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEditSchool(row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDeleteSchool(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 地区编辑对话框 -->
    <el-dialog v-model="regionDialogVisible" :title="regionDialogTitle" width="500px">
      <el-form :model="regionFormData" label-width="100px">
        <el-form-item label="地区名称">
          <el-input v-model="regionFormData.name" placeholder="如：上海、北京" />
        </el-form-item>
        <el-form-item label="地区类型">
          <el-select v-model="regionFormData.type" placeholder="请选择类型">
            <el-option label="全国" value="all" />
            <el-option label="城市" value="city" />
            <el-option label="片区/大学城" value="zone" />
            <el-option label="区" value="district" />
            <el-option label="省" value="province" />
            <el-option label="大区" value="region" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="regionFormData.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="regionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitRegion" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 校区编辑对话框 -->
    <el-dialog v-model="schoolDialogVisible" :title="schoolDialogTitle" width="500px">
      <el-form :model="schoolFormData" label-width="100px">
        <el-form-item label="校区名称">
          <el-input v-model="schoolFormData.name" placeholder="如：上海交通大学" />
        </el-form-item>
        <el-form-item label="所属地区">
          <el-select v-model="schoolFormData.region_id" placeholder="请选择地区">
            <el-option
              v-for="region in enabledRegions"
              :key="region.id"
              :label="region.name"
              :value="region.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="schoolFormData.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="schoolDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitSchool" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { configApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('region')
const regionList = ref([])
const schoolList = ref([])
const submitting = ref(false)

// 地区相关
const regionDialogVisible = ref(false)
const regionDialogTitle = ref('添加地区')
const regionFormData = reactive({
  id: null,
  name: '',
  type: 'city',
  enabled: true
})

// 校区相关
const schoolDialogVisible = ref(false)
const schoolDialogTitle = ref('添加校区')
const schoolFormData = reactive({
  id: null,
  name: '',
  region_id: null,
  enabled: true
})

// 计算已启用的地区列表（用于校区选择）
const enabledRegions = computed(() => {
  return regionList.value.filter(r => r.enabled && r.type !== 'all')
})

// 地区类型映射
const getRegionTypeName = (type) => {
  const map = {
    all: '全国',
    city: '城市',
    zone: '片区/大学城',
    district: '区',
    province: '省',
    region: '大区'
  }
  return map[type] || type
}

const getRegionTypeColor = (type) => {
  const map = {
    all: 'success',
    city: 'primary',
    zone: 'warning',
    region: 'danger'
  }
  return map[type] || 'info'
}

// 加载地区列表
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

// 加载校区列表
const fetchSchoolList = async () => {
  try {
    const res = await configApi.getSchoolList()
    if (res.code === 200) {
      schoolList.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('加载校区列表失败')
  }
}

// 地区操作
const handleAddRegion = () => {
  regionDialogTitle.value = '添加地区'
  Object.assign(regionFormData, { id: null, name: '', type: 'city', enabled: true })
  regionDialogVisible.value = true
}

const handleEditRegion = (row) => {
  regionDialogTitle.value = '编辑地区'
  Object.assign(regionFormData, row)
  regionDialogVisible.value = true
}

const handleToggleRegion = async (row) => {
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

const handleDeleteRegion = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该地区吗？', '提示', {
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

const handleSubmitRegion = async () => {
  submitting.value = true
  try {
    const res = await configApi.saveRegion(regionFormData)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      regionDialogVisible.value = false
      fetchRegionList()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

// 校区操作
const handleAddSchool = () => {
  schoolDialogTitle.value = '添加校区'
  Object.assign(schoolFormData, { id: null, name: '', region_id: null, enabled: true })
  schoolDialogVisible.value = true
}

const handleEditSchool = (row) => {
  schoolDialogTitle.value = '编辑校区'
  Object.assign(schoolFormData, row)
  schoolDialogVisible.value = true
}

const handleToggleSchool = async (row) => {
  try {
    const res = await configApi.saveSchool(row)
    if (res.code === 200) {
      ElMessage.success('状态更新成功')
    }
  } catch (error) {
    ElMessage.error('状态更新失败')
    row.enabled = !row.enabled
  }
}

const handleDeleteSchool = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该校区吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await configApi.deleteSchool(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchSchoolList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmitSchool = async () => {
  submitting.value = true
  try {
    const res = await configApi.saveSchool(schoolFormData)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      schoolDialogVisible.value = false
      fetchSchoolList()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchRegionList()
  fetchSchoolList()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
