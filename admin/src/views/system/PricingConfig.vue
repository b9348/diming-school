<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>价格配置管理</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="帖子置顶" name="post">
          <el-table :data="pricingData.post" border style="width: 100%">
            <el-table-column prop="label" label="选项名称" width="150">
              <template #default="{ row }">
                <el-input v-model="row.label" placeholder="如：置顶1天" />
              </template>
            </el-table-column>
            <el-table-column prop="days" label="天数" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.days" :min="0" :max="365" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格(元)" width="150">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="removeItem('post', $index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addItem('post')" style="margin-top: 10px;">添加选项</el-button>
        </el-tab-pane>

        <el-tab-pane label="闲置置顶" name="idle">
          <el-table :data="pricingData.idle" border style="width: 100%">
            <el-table-column prop="hours" label="小时数" width="150">
              <template #default="{ row }">
                <el-input-number v-model="row.hours" :min="1" :max="72" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格(元)" width="150">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="removeItem('idle', $index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addItem('idle')" style="margin-top: 10px;">添加选项</el-button>
        </el-tab-pane>

        <el-tab-pane label="互助置顶" name="help">
          <el-table :data="pricingData.help" border style="width: 100%">
            <el-table-column prop="hours" label="小时数" width="150">
              <template #default="{ row }">
                <el-input-number v-model="row.hours" :min="1" :max="72" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格(元)" width="150">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="removeItem('help', $index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addItem('help')" style="margin-top: 10px;">添加选项</el-button>
        </el-tab-pane>
      </el-tabs>

      <el-button type="primary" @click="handleSave" :loading="saving" style="margin-top: 20px;">保存配置</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { configApi } from '@/api'
import { ElMessage } from 'element-plus'

const activeTab = ref('post')
const saving = ref(false)

const pricingData = reactive({
  post: [],
  idle: [],
  help: []
})

const fetchPricing = async () => {
  try {
    const res = await configApi.getPricingList()
    if (res.code === 200) {
      pricingData.post = res.data.post || []
      pricingData.idle = res.data.idle || []
      pricingData.help = res.data.help || []
    }
  } catch (error) {
    ElMessage.error('加载配置失败')
  }
}

const addItem = (type) => {
  if (type === 'post') {
    pricingData.post.push({ label: '', days: 1, price: 0 })
  } else {
    pricingData[type].push({ hours: 1, price: 0 })
  }
}

const removeItem = (type, index) => {
  pricingData[type].splice(index, 1)
}

const handleSave = async () => {
  saving.value = true
  try {
    // 保存每个类型的配置
    for (const type of ['post', 'idle', 'help']) {
      const res = await configApi.savePricing({ type, items: pricingData[type] })
      if (res.code !== 200) {
        ElMessage.error(`保存${type}配置失败`)
        return
      }
    }
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchPricing())
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
