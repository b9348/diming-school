<template>
  <view class="admin-menu-container" v-if="visible">
    <!-- 遮罩层 -->
    <view class="admin-menu-mask" @click="close"></view>

    <!-- 菜单内容 -->
    <view class="admin-menu-content" :class="{ show: showContent }">
      <view class="menu-header">
        <text class="menu-title">管理操作</text>
        <view class="close-btn" @click="close">
          <text class="tn-icon-close" style="font-size: 18px; color: #999999;"></text>
        </view>
      </view>

      <!-- 操作按钮网格 -->
      <view class="menu-grid">
        <view
          class="menu-item"
          v-for="(item, index) in actions"
          :key="index"
          @click="handleAction(item)"
        >
          <text class="menu-item-text">{{ item.label }}</text>
        </view>
      </view>

      <!-- 取消按钮 -->
      <view class="cancel-btn" @click="close">
        <text class="cancel-text">取消</text>
      </view>
    </view>

    <!-- 自定义头衔弹窗 -->
    <view class="title-dialog" v-if="showTitleDialog">
      <view class="dialog-mask" @click="closeTitleDialog"></view>
      <view class="dialog-content">
        <text class="dialog-title">自定义头衔</text>
        <input
          class="dialog-input"
          v-model="customTitle"
          placeholder="请输入头衔名称"
          maxlength="10"
        />
        <view class="dialog-buttons">
          <view class="dialog-btn cancel" @click="closeTitleDialog">取消</view>
          <view class="dialog-btn confirm" @click="confirmTitle">确定</view>
        </view>
      </view>
    </view>

    <!-- 用户ID弹窗 -->
    <view class="id-dialog" v-if="showIdDialog">
      <view class="dialog-mask" @click="closeIdDialog"></view>
      <view class="dialog-content">
        <text class="dialog-title">用户ID</text>
        <text class="dialog-id">{{ targetUserId }}</text>
        <view class="dialog-buttons">
          <view class="dialog-btn copy" @click="copyUserId">复制</view>
          <view class="dialog-btn confirm" @click="closeIdDialog">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { AdminAction } from '@/utils/admin.js'
import userStore from '@/store/user.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    target: {
      type: Object,
      default: () => ({})
    },
    targetUser: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:show', 'close', 'action'],
  data() {
    return {
      visible: false,
      showContent: false,
      showTitleDialog: false,
      showIdDialog: false,
      customTitle: '',
      targetUserId: ''
    }
  },
  computed: {
    actions() {
      const context = {
        isPinned: this.target.isPinned || false,
        isRemoved: this.target.isRemoved || false,
        isAnnouncement: this.target.isAnnouncement || false,
        isBanned: this.targetUser.isBanned || false,
        hasTitle: !!this.targetUser.title,
        isAdmin: this.targetUser.isAdmin || false
      }
      return userStore.getAvailableActions(context)
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.open()
        } else {
          this.close()
        }
      }
    }
  },
  methods: {
    open() {
      this.visible = true
      setTimeout(() => {
        this.showContent = true
      }, 50)
    },
    close() {
      this.showContent = false
      setTimeout(() => {
        this.visible = false
        this.$emit('update:show', false)
        this.$emit('close')
      }, 300)
    },
    handleAction(item) {
      const action = item.action

      switch (action) {
        case AdminAction.SET_TITLE:
          this.showTitleDialog = true
          this.customTitle = ''
          return
        case AdminAction.VIEW_USER_ID:
          this.targetUserId = this.targetUser.id || '未知'
          this.showIdDialog = true
          return
        case AdminAction.DELETE_POST:
        case AdminAction.BAN_USER:
        case AdminAction.CANCEL_ADMIN:
          this.confirmDangerAction(action, item.label)
          return
        default:
          this.executeAction(action)
      }
    },
    confirmDangerAction(action, label) {
      uni.showModal({
        title: '确认操作',
        content: `确定要"${label}"吗？此操作不可撤销`,
        confirmColor: '#FF4D4F',
        success: (res) => {
          if (res.confirm) {
            this.executeAction(action)
          }
        }
      })
    },
    executeAction(action) {
      this.$emit('action', {
        action,
        target: this.target,
        targetUser: this.targetUser
      })
      this.close()
    },
    closeTitleDialog() {
      this.showTitleDialog = false
      this.customTitle = ''
    },
    confirmTitle() {
      if (!this.customTitle.trim()) {
        uni.showToast({ title: '请输入头衔名称', icon: 'none' })
        return
      }
      this.$emit('action', {
        action: AdminAction.SET_TITLE,
        target: this.target,
        targetUser: this.targetUser,
        data: { title: this.customTitle.trim() }
      })
      this.closeTitleDialog()
      this.close()
    },
    closeIdDialog() {
      this.showIdDialog = false
    },
    copyUserId() {
      uni.setClipboardData({
        data: this.targetUserId,
        success: () => {
          uni.showToast({ title: '已复制', icon: 'success' })
        }
      })
      this.closeIdDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.admin-menu-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.admin-menu-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F8F8F8;
  border-radius: 24rpx 24rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &.show {
    transform: translateY(0);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx 24rpx;
  position: relative;
  border-bottom: 1rpx solid #EEEEEE;
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;

  .menu-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
  }

  .close-btn {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    padding: 10rpx;
  }
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 24rpx;
  background-color: #FFFFFF;

  .menu-item {
    width: 33.33%;
    padding: 20rpx 10rpx;
    display: flex;
    justify-content: center;

    .menu-item-text {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180rpx;
      height: 72rpx;
      background-color: #F5F5F5;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #333333;
      border: 1rpx solid #E8E8E8;

      &:active {
        background-color: #EEEEEE;
      }
    }
  }
}

.cancel-btn {
  margin: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 28rpx 0;
  display: flex;
  justify-content: center;

  .cancel-text {
    font-size: 32rpx;
    color: #666666;
  }
}

.title-dialog,
.id-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  width: 560rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 32rpx;
}

.dialog-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #DDDDDD;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-bottom: 32rpx;
}

.dialog-id {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 32rpx;
  padding: 20rpx 40rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.dialog-buttons {
  display: flex;
  width: 100%;
  gap: 24rpx;

  .dialog-btn {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
    font-size: 30rpx;

    &.cancel {
      background-color: #F5F5F5;
      color: #666666;
    }

    &.confirm {
      background-color: #007AFF;
      color: #FFFFFF;
    }

    &.copy {
      background-color: #4CAF50;
      color: #FFFFFF;
    }
  }
}
</style>
