<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>拍卖管理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.keyword" placeholder="请输入标题关键词" clearable />
        </el-form-item>
        <el-form-item label="发布者">
          <el-input v-model="searchForm.publisher" placeholder="请输入发布者" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待开拍" value="pending" />
            <el-option label="竞拍中" value="bidding" />
            <el-option label="已成交" value="completed" />
            <el-option label="已流拍" value="failed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="publisher" label="发布者" width="100" />
        <el-table-column prop="startPrice" label="起始价" width="100">
          <template #default="{ row }">¥{{ row.startPrice }}</template>
        </el-table-column>
        <el-table-column prop="currentPrice" label="当前价" width="100">
          <template #default="{ row }">¥{{ row.currentPrice || row.startPrice }}</template>
        </el-table-column>
        <el-table-column prop="bidCount" label="出价次数" width="90" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        :total="pagination.total"
        layout="total, prev, pager, next"
        class="pagination"
        @current-change="fetchData"
      />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="拍卖详情" width="700px">
      <el-descriptions :column="2" border v-if="currentItem">
        <el-descriptions-item label="ID">{{ currentItem.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType[currentItem.status]">{{ statusText[currentItem.status] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布者">{{ currentItem.publisher }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ currentItem.contactValue }}</el-descriptions-item>
        <el-descriptions-item label="起始价">¥{{ currentItem.startPrice }}</el-descriptions-item>
        <el-descriptions-item label="加价幅度">¥{{ currentItem.bidIncrement }}</el-descriptions-item>
        <el-descriptions-item label="当前价">¥{{ currentItem.currentPrice || currentItem.startPrice }}</el-descriptions-item>
        <el-descriptions-item label="出价次数">{{ currentItem.bidCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="竞价周期">{{ currentItem.biddingPeriod }}分钟</el-descriptions-item>
        <el-descriptions-item label="延时周期">{{ currentItem.delayPeriod }}分钟</el-descriptions-item>
        <el-descriptions-item label="包邮">{{ currentItem.freeShipping ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="匿名">{{ currentItem.anonymous ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentItem.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentItem.content }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="currentItem?.images?.length" style="margin-top: 16px;">
        <div style="margin-bottom: 8px; font-weight: 500;">商品图片</div>
        <el-image v-for="(img, i) in currentItem.images" :key="i" :src="img" style="width: 100px; height: 100px; margin-right: 8px;" fit="cover" :preview-src-list="currentItem.images" />
      </div>

      <div v-if="bidList.length" style="margin-top: 16px;">
        <div style="margin-bottom: 8px; font-weight: 500;">出价记录</div>
        <el-table :data="bidList" size="small" max-height="200">
          <el-table-column prop="bidder" label="出价人" />
          <el-table-column prop="amount" label="出价金额">
            <template #default="{ row }">¥{{ row.amount }}</template>
          </el-table-column>
          <el-table-column prop="createdAt" label="出价时间" />
        </el-table>
      </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" :title="editForm.id ? '编辑拍卖' : '新增拍卖'" width="600px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.content" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="起始价">
          <el-input-number v-model="editForm.startPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="加价幅度">
          <el-input-number v-model="editForm.bidIncrement" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="竞价周期">
          <el-input-number v-model="editForm.biddingPeriod" :min="1" /> 分钟
        </el-form-item>
        <el-form-item label="延时周期">
          <el-input-number v-model="editForm.delayPeriod" :min="0" /> 分钟
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="待开拍" value="pending" />
            <el-option label="竞拍中" value="bidding" />
            <el-option label="已成交" value="completed" />
            <el-option label="已流拍" value="failed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { auctionApi } from '@/api'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const editVisible = ref(false)
const currentItem = ref(null)
const bidList = ref([])

const statusText = { pending: '待开拍', bidding: '竞拍中', completed: '已成交', failed: '已流拍', cancelled: '已取消' }
const statusType = { pending: 'info', bidding: 'primary', completed: 'success', failed: 'warning', cancelled: 'danger' }

const searchForm = reactive({ keyword: '', publisher: '', status: '', dateRange: null })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const editForm = reactive({ id: null, title: '', content: '', startPrice: 0, bidIncrement: 1, biddingPeriod: 60, delayPeriod: 5, status: 'pending' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await auctionApi.getList({ ...searchForm, ...pagination })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.publisher = ''
  searchForm.status = ''
  searchForm.dateRange = null
  handleSearch()
}

const handleDetail = async (row) => {
  const res = await auctionApi.getDetail(row.id)
  if (res.code === 200) {
    currentItem.value = res.data
    // 获取出价记录
    const bidRes = await auctionApi.getBidList(row.id)
    bidList.value = bidRes.code === 200 ? bidRes.data : []
    detailVisible.value = true
  }
}

const handleEdit = (row) => {
  Object.assign(editForm, {
    id: row.id,
    title: row.title,
    content: row.content,
    startPrice: row.startPrice,
    bidIncrement: row.bidIncrement,
    biddingPeriod: row.biddingPeriod,
    delayPeriod: row.delayPeriod,
    status: row.status
  })
  editVisible.value = true
}

const handleSave = async () => {
  const res = await auctionApi.saveOrUpdate(editForm)
  if (res.code === 200) {
    ElMessage.success('保存成功')
    editVisible.value = false
    fetchData()
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该拍卖吗？', '提示', { type: 'warning' }).then(async () => {
    const res = await auctionApi.delete(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  }).catch(() => {})
}

onMounted(() => fetchData())
</script>

<style scoped>
.search-form { margin-bottom: 20px; }
.search-form .el-select { width: 140px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
