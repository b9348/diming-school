<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>AI审核配置</span>
      </template>

      <el-alert
        title="AI内容审核说明"
        type="info"
        description="配置LLM模型用于自动审核用户发布的内容，支持多种模型提供商。审核结果将作为人工审核的参考。"
        show-icon
        :closable="false"
        class="mb-20"
      />

      <el-form :model="config" label-width="120px" class="config-form">
        <el-divider content-position="left">基础配置</el-divider>

        <el-form-item label="启用AI审核">
          <el-switch v-model="config.enabled" />
        </el-form-item>

        <el-form-item label="模型提供商">
          <el-select v-model="config.provider" placeholder="请选择" style="width: 300px;">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Anthropic (Claude)" value="anthropic" />
            <el-option label="通义千问" value="qwen" />
            <el-option label="文心一言" value="wenxin" />
            <el-option label="智谱AI" value="zhipu" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>

        <el-form-item label="模型名称">
          <el-input v-model="config.model" placeholder="如 gpt-4, claude-3-opus" style="width: 300px;" />
        </el-form-item>

        <el-divider content-position="left">API配置</el-divider>

        <el-form-item label="API URL">
          <el-input v-model="config.apiUrl" placeholder="API接口地址" style="width: 400px;">
            <template #append>
              <el-button @click="fillDefaultUrl">填充默认</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="API Key">
          <el-input v-model="config.apiKey" type="password" show-password placeholder="API密钥" style="width: 400px;" />
        </el-form-item>

        <el-divider content-position="left">审核Prompt配置</el-divider>

        <el-form-item label="系统提示词">
          <el-input
            v-model="config.systemPrompt"
            type="textarea"
            :rows="4"
            placeholder="设置AI的角色和审核标准"
            style="width: 500px;"
          />
        </el-form-item>

        <el-form-item label="审核提示词">
          <el-input
            v-model="config.auditPrompt"
            type="textarea"
            :rows="6"
            placeholder="审核内容的具体指令，使用 {content} 作为内容占位符"
            style="width: 500px;"
          />
        </el-form-item>

        <el-divider content-position="left">高级配置</el-divider>

        <el-form-item label="温度参数">
          <el-slider v-model="config.temperature" :min="0" :max="1" :step="0.1" style="width: 300px;" show-input />
        </el-form-item>

        <el-form-item label="最大Token">
          <el-input-number v-model="config.maxTokens" :min="100" :max="4000" :step="100" />
        </el-form-item>

        <el-form-item label="超时时间(秒)">
          <el-input-number v-model="config.timeout" :min="10" :max="120" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">保存配置</el-button>
          <el-button @click="handleTest" :loading="testing">测试连接</el-button>
          <el-button @click="handleReset">重置默认</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 测试弹窗 -->
    <el-dialog v-model="testVisible" title="测试AI审核" width="600px">
      <el-form label-width="80px">
        <el-form-item label="测试内容">
          <el-input v-model="testContent" type="textarea" :rows="4" placeholder="输入要测试审核的内容" />
        </el-form-item>
      </el-form>
      <div v-if="testResult" class="test-result">
        <el-divider>审核结果</el-divider>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="审核结论">
            <el-tag :type="testResult.pass ? 'success' : 'danger'">
              {{ testResult.pass ? '通过' : '不通过' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">{{ testResult.riskLevel }}</el-descriptions-item>
          <el-descriptions-item label="审核原因">{{ testResult.reason }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ testResult.duration }}ms</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="testVisible = false">关闭</el-button>
        <el-button type="primary" @click="runTest" :loading="testing">执行测试</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { aiConfigApi } from '@/api'
import { ElMessage } from 'element-plus'

const saving = ref(false)
const testing = ref(false)
const testVisible = ref(false)
const testContent = ref('')
const testResult = ref(null)

const defaultPrompts = {
  systemPrompt: `你是一个内容审核助手，负责审核校园社交平台的用户发布内容。
你需要判断内容是否违规，包括但不限于：
1. 政治敏感内容
2. 色情低俗内容
3. 暴力恐怖内容
4. 广告推广内容
5. 人身攻击、辱骂
6. 虚假信息`,
  auditPrompt: `请审核以下用户发布的内容，并以JSON格式返回审核结果：

内容：{content}

请返回格式：
{
  "pass": true/false,
  "riskLevel": "low/medium/high",
  "reason": "审核原因说明",
  "categories": ["违规类别"]
}`
}

const config = reactive({
  enabled: false,
  provider: 'openai',
  model: 'gpt-4',
  apiUrl: '',
  apiKey: '',
  systemPrompt: defaultPrompts.systemPrompt,
  auditPrompt: defaultPrompts.auditPrompt,
  temperature: 0.3,
  maxTokens: 1000,
  timeout: 30
})

const providerUrls = {
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  qwen: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  wenxin: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  custom: ''
}

const fillDefaultUrl = () => {
  config.apiUrl = providerUrls[config.provider] || ''
}

const fetchConfig = async () => {
  const res = await aiConfigApi.getConfig()
  if (res.code === 200 && res.data) {
    Object.assign(config, res.data)
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const res = await aiConfigApi.saveConfig(config)
    if (res.code === 200) {
      ElMessage.success('配置保存成功')
    }
  } finally {
    saving.value = false
  }
}

const handleTest = () => {
  testContent.value = ''
  testResult.value = null
  testVisible.value = true
}

const runTest = async () => {
  if (!testContent.value.trim()) {
    ElMessage.warning('请输入测试内容')
    return
  }
  testing.value = true
  try {
    const res = await aiConfigApi.testConfig({ content: testContent.value, config })
    if (res.code === 200) {
      testResult.value = res.data
    }
  } finally {
    testing.value = false
  }
}

const handleReset = () => {
  config.systemPrompt = defaultPrompts.systemPrompt
  config.auditPrompt = defaultPrompts.auditPrompt
  config.temperature = 0.3
  config.maxTokens = 1000
  config.timeout = 30
}

onMounted(() => fetchConfig())
</script>

<style scoped>
.mb-20 { margin-bottom: 20px; }
.config-form { max-width: 700px; }
.test-result { margin-top: 20px; }
</style>
