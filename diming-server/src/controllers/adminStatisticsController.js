const { successResponse, errorResponse } = require('../utils/response')

// 生成日期数组
const generateDates = (days) => {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
}

// 获取仪表盘数据
exports.getDashboard = async (req, res) => {
  try {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return `${d.getMonth() + 1}/${d.getDate()}`
    })

    successResponse(res, {
      totalUsers: 12580,
      todayNewUsers: 86,
      pendingAudit: 23,
      todayTrade: '3,580.00',
      userGrowth: {
        dates,
        values: [120, 132, 101, 134, 90, 230, 210]
      },
      contentDist: [
        { name: '帖子', value: 1048 },
        { name: '投票', value: 735 },
        { name: '跑腿', value: 580 },
        { name: '闲置', value: 484 },
        { name: '交友', value: 300 }
      ],
      tradeTrend: {
        dates,
        values: [320, 332, 301, 334, 390, 330, 320]
      },
      pendingItems: [
        { type: '待审核内容', count: 23, path: '/content/audit' },
        { type: '待处理举报', count: 8, path: '/content/report' },
        { type: '待处理退款', count: 5, path: '/trade/refund' }
      ]
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 用户增长统计
exports.getUserGrowth = async (req, res) => {
  try {
    const { days = 7 } = req.query
    const dates = generateDates(Number(days))
    const daily = dates.map(() => Math.floor(Math.random() * 100 + 50))
    let sum = 10000
    const cumulative = daily.map(v => { sum += v; return sum })

    successResponse(res, {
      total: sum,
      newUsers: daily.reduce((a, b) => a + b, 0),
      avgDaily: Math.floor(daily.reduce((a, b) => a + b, 0) / days),
      growthRate: 12.5,
      dates, daily, cumulative
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 活跃度统计
exports.getActiveData = async (req, res) => {
  try {
    const dates = generateDates(7)
    successResponse(res, {
      dau: 3580, wau: 8920, mau: 12580, retention: 45.2,
      dates,
      dauTrend: dates.map(() => Math.floor(Math.random() * 1000 + 2500)),
      retentionRates: [45, 32, 25, 18, 12]
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 交易统计
exports.getTradeData = async (req, res) => {
  try {
    const { days = 7 } = req.query
    const dates = generateDates(Number(days))
    successResponse(res, {
      totalAmount: '35,800.00', orderCount: 580, avgPrice: '61.72', completeRate: 92.5,
      dates,
      amounts: dates.map(() => (Math.random() * 5000 + 3000).toFixed(2)),
      orders: dates.map(() => Math.floor(Math.random() * 100 + 50)),
      typeDistribution: [
        { name: '跑腿', value: 280 },
        { name: '闲置', value: 200 },
        { name: '拍卖', value: 100 }
      ]
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}

// 收入统计
exports.getIncomeData = async (req, res) => {
  try {
    const { days = 7 } = req.query
    const dates = generateDates(Number(days))
    successResponse(res, {
      total: '8,580.00', commission: '5,800.00', ad: '2,000.00', other: '780.00',
      dates,
      commissionTrend: dates.map(() => (Math.random() * 800 + 500).toFixed(2)),
      adTrend: dates.map(() => (Math.random() * 300 + 200).toFixed(2)),
      otherTrend: dates.map(() => (Math.random() * 100 + 50).toFixed(2))
    })
  } catch (error) {
    errorResponse(res, error.message)
  }
}
