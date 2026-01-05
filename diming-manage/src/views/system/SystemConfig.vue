<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>参数配置</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="basicConfig" label-width="150px" class="config-form">
            <el-form-item label="平台名称">
              <el-input v-model="basicConfig.platformName" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="平台Logo">
              <el-input v-model="basicConfig.logo" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="basicConfig.servicePhone" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="客服邮箱">
              <el-input v-model="basicConfig.serviceEmail" style="width: 300px;" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="交易配置" name="trade">
          <el-form :model="tradeConfig" label-width="150px" class="config-form">
            <el-form-item label="平台佣金比例(%)">
              <el-input-number v-model="tradeConfig.commissionRate" :min="0" :max="100" />
            </el-form-item>
            <el-form-item label="最低提现金额">
              <el-input-number v-model="tradeConfig.minWithdraw" :min="1" />
            </el-form-item>
            <el-form-item label="订单超时时间(分钟)">
              <el-input-number v-model="tradeConfig.orderTimeout" :min="10" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="内容配置" name="content">
          <el-form :model="contentConfig" label-width="150px" class="config-form">
            <el-form-item label="图片最大数量">
              <el-input-number v-model="contentConfig.maxImages" :min="1" :max="20" />
            </el-form-item>
            <el-form-item label="内容最大长度">
              <el-input-number v-model="contentConfig.maxContentLength" :min="100" />
            </el-form-item>
            <el-form-item label="开启内容审核">
              <el-switch v-model="contentConfig.auditEnabled" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-button type="primary" @click="handleSave" :loading="saving">保存配置</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { systemApi } from '@/api'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')
const saving = ref(false)

const basicConfig = reactive({ platformName: '', logo: '', servicePhone: '', serviceEmail: '' })
const tradeConfig = reactive({ commissionRate: 5, minWithdraw: 10, orderTimeout: 30 })
const contentConfig = reactive({ maxImages: 9, maxContentLength: 2000, auditEnabled: true })

const fetchConfig = async () => {
  const res = await systemApi.getConfig()
  if (res.code === 200) {
    Object.assign(basicConfig, res.data.basic || {})
    Object.assign(tradeConfig, res.data.trade || {})
    Object.assign(contentConfig, res.data.content || {})
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const res = await systemApi.saveConfig({ basic: basicConfig, trade: tradeConfig, content: contentConfig })
    if (res.code === 200) ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchConfig())
</script>

<style scoped>
.config-form { max-width: 500px; margin: 20px 0; }
</style>
