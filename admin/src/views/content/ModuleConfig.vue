<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>模块筛选配置</span>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="帖子" name="post">
          <el-form label-width="120px">
            <el-form-item label="排序选项">
              <el-checkbox-group v-model="postConfig.sortOptions">
                <el-checkbox label="最新" value="latest" />
                <el-checkbox label="最热" value="hot" />
                <el-checkbox label="推荐" value="recommend" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分类选项">
              <el-checkbox-group v-model="postConfig.categoryOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="最新发布" value="newest" />
                <el-checkbox label="最新回复" value="recent" />
                <el-checkbox label="精华" value="essence" />
                <el-checkbox label="我的关注" value="follow" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时间范围选项">
              <el-checkbox-group v-model="postConfig.timeOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="今天" value="today" />
                <el-checkbox label="本周" value="week" />
                <el-checkbox label="本月" value="month" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="投票" name="vote">
          <el-form label-width="120px">
            <el-form-item label="排序选项">
              <el-checkbox-group v-model="voteConfig.sortOptions">
                <el-checkbox label="最新" value="latest" />
                <el-checkbox label="最热" value="hot" />
                <el-checkbox label="即将结束" value="ending" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分类选项">
              <el-checkbox-group v-model="voteConfig.categoryOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="进行中" value="ongoing" />
                <el-checkbox label="已结束" value="ended" />
                <el-checkbox label="我参与的" value="joined" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时间范围选项">
              <el-checkbox-group v-model="voteConfig.timeOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="今天" value="today" />
                <el-checkbox label="本周" value="week" />
                <el-checkbox label="本月" value="month" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="跑腿" name="errand">
          <el-form label-width="120px">
            <el-form-item label="排序选项">
              <el-checkbox-group v-model="errandConfig.sortOptions">
                <el-checkbox label="最新" value="latest" />
                <el-checkbox label="距离最近" value="distance" />
                <el-checkbox label="价格最高" value="price" />
                <el-checkbox label="最紧急" value="urgent" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分类选项">
              <el-checkbox-group v-model="errandConfig.categoryOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="帮我送" value="delivery" />
                <el-checkbox label="帮我买" value="purchase" />
                <el-checkbox label="帮我取" value="pickup" />
                <el-checkbox label="其他" value="other" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时间范围选项">
              <el-checkbox-group v-model="errandConfig.timeOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="今天" value="today" />
                <el-checkbox label="明天" value="tomorrow" />
                <el-checkbox label="本周" value="week" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="闲置" name="idle">
          <el-form label-width="120px">
            <el-form-item label="排序选项">
              <el-checkbox-group v-model="idleConfig.sortOptions">
                <el-checkbox label="最新" value="latest" />
                <el-checkbox label="价格最低" value="price_asc" />
                <el-checkbox label="价格最高" value="price_desc" />
                <el-checkbox label="最热门" value="hot" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分类选项">
              <el-checkbox-group v-model="idleConfig.categoryOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="数码电子" value="electronics" />
                <el-checkbox label="服装鞋包" value="clothing" />
                <el-checkbox label="书籍文具" value="books" />
                <el-checkbox label="生活用品" value="life" />
                <el-checkbox label="其他" value="other" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时间范围选项">
              <el-checkbox-group v-model="idleConfig.timeOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="今天" value="today" />
                <el-checkbox label="本周" value="week" />
                <el-checkbox label="本月" value="month" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="恋爱" name="love">
          <el-form label-width="120px">
            <el-form-item label="排序选项">
              <el-checkbox-group v-model="loveConfig.sortOptions">
                <el-checkbox label="最新" value="latest" />
                <el-checkbox label="最活跃" value="active" />
                <el-checkbox label="最近活跃" value="recent" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分类选项">
              <el-checkbox-group v-model="loveConfig.categoryOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="男生" value="male" />
                <el-checkbox label="女生" value="female" />
                <el-checkbox label="不限" value="any" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时间范围选项">
              <el-checkbox-group v-model="loveConfig.timeOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="今天" value="today" />
                <el-checkbox label="本周" value="week" />
                <el-checkbox label="本月" value="month" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="互助" name="help">
          <el-form label-width="120px">
            <el-form-item label="排序选项">
              <el-checkbox-group v-model="helpConfig.sortOptions">
                <el-checkbox label="最新" value="latest" />
                <el-checkbox label="价格最高" value="price" />
                <el-checkbox label="进行中" value="ongoing" />
                <el-checkbox label="即将结束" value="ending" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="分类选项">
              <el-checkbox-group v-model="helpConfig.categoryOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="拍卖中" value="auctioning" />
                <el-checkbox label="已结束" value="ended" />
                <el-checkbox label="我参与的" value="joined" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时间范围选项">
              <el-checkbox-group v-model="helpConfig.timeOptions">
                <el-checkbox label="全部" value="all" />
                <el-checkbox label="今天" value="today" />
                <el-checkbox label="本周" value="week" />
                <el-checkbox label="本月" value="month" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { moduleConfigApi } from '@/api'
import { ElMessage } from 'element-plus'

const activeTab = ref('post')

const defaultConfig = {
  sortOptions: ['latest', 'hot'],
  categoryOptions: ['all', 'newest', 'recent'],
  timeOptions: ['all', 'today', 'week']
}

const postConfig = reactive({ ...defaultConfig })
const voteConfig = reactive({ ...defaultConfig })
const errandConfig = reactive({ ...defaultConfig })
const idleConfig = reactive({ ...defaultConfig })
const loveConfig = reactive({ ...defaultConfig })
const helpConfig = reactive({ ...defaultConfig })

const fetchData = async () => {
  const modules = ['post', 'vote', 'errand', 'idle', 'love', 'help']
  const configs = [postConfig, voteConfig, errandConfig, idleConfig, loveConfig, helpConfig]

  for (let i = 0; i < modules.length; i++) {
    try {
      const res = await moduleConfigApi.getConfig(modules[i])
      if (res.code === 200 && res.data) {
        Object.assign(configs[i], res.data)
      }
    } catch (e) {
      console.error(`获取${modules[i]}配置失败`, e)
    }
  }
}

const handleSave = async () => {
  const modules = ['post', 'vote', 'errand', 'idle', 'love', 'help']
  const configs = [postConfig, voteConfig, errandConfig, idleConfig, loveConfig, helpConfig]

  let success = true
  for (let i = 0; i < modules.length; i++) {
    const res = await moduleConfigApi.saveOrUpdate({ module: modules[i], config: configs[i] })
    if (res.code !== 200) success = false
  }

  if (success) {
    ElMessage.success('保存成功')
  } else {
    ElMessage.error('保存失败')
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
