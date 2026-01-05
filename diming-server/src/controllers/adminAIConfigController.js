const { successResponse, errorResponse } = require('../utils/response')

// AI配置存储（实际应存数据库）
let aiConfig = {
  enabled: false,
  provider: 'openai',
  model: 'gpt-4',
  apiUrl: '',
  apiKey: '',
  systemPrompt: '',
  auditPrompt: '',
  temperature: 0.3,
  maxTokens: 1000,
  timeout: 30
}

// 获取AI配置
exports.getConfig = async (req, res) => {
  try {
    successResponse(res, aiConfig)
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 保存AI配置
exports.saveConfig = async (req, res) => {
  try {
    aiConfig = { ...aiConfig, ...req.body }
    successResponse(res, null, '保存成功')
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 测试AI配置
exports.testConfig = async (req, res) => {
  try {
    const { content } = req.body
    // 模拟AI审核结果
    successResponse(res, {
      pass: content.length < 50,
      riskLevel: content.length > 100 ? 'high' : 'low',
      reason: '测试审核结果',
      duration: 500
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}
