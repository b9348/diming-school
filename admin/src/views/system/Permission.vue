<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>权限管理</span>
      </template>

      <el-table :data="roleList" v-loading="loading" stripe>
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色标识" width="180" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="userCount" label="用户数" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editVisible" title="编辑角色权限" width="600px">
      <el-form :model="currentRole" label-width="100px" v-if="currentRole">
        <el-form-item label="角色名称">
          <el-input v-model="currentRole.name" disabled />
        </el-form-item>
        <el-form-item label="权限配置">
          <el-tree
            ref="treeRef"
            :data="permissionTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="currentRole.permissions"
            :props="{ label: 'name', children: 'children' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { systemApi } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const editVisible = ref(false)
const roleList = ref([])
const permissionTree = ref([])
const currentRole = ref(null)
const treeRef = ref()

const fetchData = async () => {
  loading.value = true
  try {
    const [rolesRes, permsRes] = await Promise.all([
      systemApi.getRoleList(),
      systemApi.getPermissions()
    ])
    if (rolesRes.code === 200) roleList.value = rolesRes.data
    if (permsRes.code === 200) permissionTree.value = permsRes.data
  } finally {
    loading.value = false
  }
}

const handleEdit = (row) => {
  currentRole.value = { ...row }
  editVisible.value = true
}

const handleSave = async () => {
  const checkedKeys = treeRef.value.getCheckedKeys()
  const res = await systemApi.updateRole(currentRole.value.id, { permissions: checkedKeys })
  if (res.code === 200) {
    ElMessage.success('保存成功')
    editVisible.value = false
    fetchData()
  }
}

onMounted(() => fetchData())
</script>
