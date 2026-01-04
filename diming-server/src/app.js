require('dotenv').config()

const express = require('express')
const cors = require('cors')
const config = require('./config')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use('/api', routes)

// 错误处理
app.use(errorHandler)

// 启动服务
app.listen(config.port, () => {
  console.log(`递明校园中间层服务已启动: http://localhost:${config.port}`)
})
