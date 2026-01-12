<template>
  <view class="dm-filter" :class="{ 'is-visible': visible, 'dark-mode': darkMode }">
    <view class="filter-mask" @click="close"></view>
    <view class="filter-content">
      <!-- 状态栏占位 -->
      <view class="filter-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 胶囊按钮区域占位（小程序） -->
      <view class="filter-capsule-bar" :style="{ height: capsuleHeight + 'px' }"></view>
      <view class="filter-header">
        <text class="filter-title">筛选</text>
        <text class="filter-reset" @click="handleReset">重置</text>
      </view>

      <scroll-view class="filter-body" scroll-y>
        <view v-for="(group, gIdx) in options" :key="gIdx" class="filter-group">
          <text class="group-title">{{ group.title }}</text>
          <!-- 范围选择器(滑块) -->
          <view v-if="group.type === 'range'" class="range-wrapper">
            <view class="range-values">
              <text class="range-val">{{ getRangeValue(group.key, 'min', group.min) }}{{ group.unit }}</text>
              <text class="range-sep">-</text>
              <text class="range-val">{{ getRangeValue(group.key, 'max', group.max) }}{{ group.unit }}</text>
            </view>
            <view class="range-row">
              <text class="range-label">最小</text>
              <slider
                class="range-slider"
                :min="group.min"
                :max="group.max"
                :value="getRangeValue(group.key, 'min', group.min)"
                :step="group.step || 1"
                activeColor="#007AFF"
                block-size="20"
                @change="(e) => handleRangeChange(group.key, 'min', e.detail.value, group)"
              />
            </view>
            <view class="range-row">
              <text class="range-label">最大</text>
              <slider
                class="range-slider"
                :min="group.min"
                :max="group.max"
                :value="getRangeValue(group.key, 'max', group.max)"
                :step="group.step || 1"
                activeColor="#007AFF"
                block-size="20"
                @change="(e) => handleRangeChange(group.key, 'max', e.detail.value, group)"
              />
            </view>
          </view>
          <!-- 范围选择器(输入框) -->
          <view v-else-if="group.type === 'input-range'" class="input-range-wrapper">
            <view class="input-box">
              <input
                class="range-input"
                type="number"
                :placeholder="group.minPlaceholder || '最低价'"
                :value="getInputRangeValue(group.key, 'min')"
                @input="(e) => handleInputRangeChange(group.key, 'min', e.detail.value)"
              />
            </view>
            <text class="input-sep">—</text>
            <view class="input-box">
              <input
                class="range-input"
                type="number"
                :placeholder="group.maxPlaceholder || '最高价'"
                :value="getInputRangeValue(group.key, 'max')"
                @input="(e) => handleInputRangeChange(group.key, 'max', e.detail.value)"
              />
            </view>
          </view>
          <!-- Picker选择器 -->
          <view v-else-if="group.type === 'picker'" class="picker-wrapper" @click="showPicker(group)">
            <text class="picker-value">{{ getPickerLabel(group) || '请选择' }}</text>
            <text class="picker-arrow">›</text>
          </view>
          <!-- 开关选择器 -->
          <view v-else-if="group.type === 'switch'" class="switch-wrapper">
            <switch
              :checked="!!selected[group.key]"
              color="#007AFF"
              @change="(e) => handleSwitchChange(group.key, e.detail.value)"
            />
          </view>
          <!-- 按钮选择 -->
          <view v-else class="group-items">
            <view
              v-for="(item, iIdx) in group.items"
              :key="iIdx"
              class="filter-item"
              :class="{ active: isSelected(group.key, item.value) }"
              @click="handleSelect(group.key, item.value)"
            >
              {{ item.label }}
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="filter-footer">
        <view class="btn-cancel" @click="close">取消</view>
        <view class="btn-confirm" @click="handleConfirm">确定</view>
      </view>
    </view>

    <!-- Picker弹窗 -->
    <view v-if="pickerVisible" class="picker-modal">
      <view class="picker-mask" @click="pickerVisible = false"></view>
      <view class="picker-panel">
        <view class="picker-header">
          <text class="picker-cancel" @click="pickerVisible = false">取消</text>
          <text class="picker-title">{{ currentPicker.title }}</text>
          <text class="picker-confirm" @click="confirmPicker">确定</text>
        </view>
        <picker-view class="picker-view" :value="pickerIndex" @change="onPickerChange">
          <picker-view-column>
            <view v-for="(item, idx) in currentPicker.items" :key="idx" class="picker-item">
              {{ item.label }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </view>
</template>

<script>
import componentBaseMixin from '@/mixins/component-base.js'

export default {
  mixins: [componentBaseMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:visible', 'close', 'confirm'],
  data() {
    return {
      selected: {},
      statusBarHeight: 0,
      capsuleHeight: 0,
      pickerVisible: false,
      currentPicker: { title: '', key: '', items: [] },
      pickerIndex: [0]
    }
  },
  mounted() {
    this.getSystemInfo()
  },
  watch: {
    visible(val) {
      if (val) {
        this.selected = { ...this.value }
      }
    }
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getWindowInfo()
      this.statusBarHeight = systemInfo.statusBarHeight || 0

      // #ifdef MP-WEIXIN
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.capsuleHeight = menuButtonInfo.bottom - systemInfo.statusBarHeight + 8
      // #endif
    },
    isSelected(key, value) {
      return this.selected[key] === value
    },
    getRangeValue(key, type, defaultVal) {
      const rangeKey = `${key}_${type}`
      return this.selected[rangeKey] !== undefined ? this.selected[rangeKey] : defaultVal
    },
    handleSelect(key, value) {
      if (this.selected[key] === value) {
        delete this.selected[key]
      } else {
        this.selected[key] = value
      }
      this.selected = { ...this.selected }
    },
    handleRangeChange(key, type, value, group) {
      const minKey = `${key}_min`
      const maxKey = `${key}_max`
      if (type === 'min') {
        const maxVal = this.selected[maxKey] !== undefined ? this.selected[maxKey] : group.max
        this.selected[minKey] = Math.min(value, maxVal)
      } else {
        const minVal = this.selected[minKey] !== undefined ? this.selected[minKey] : group.min
        this.selected[maxKey] = Math.max(value, minVal)
      }
      this.selected = { ...this.selected }
    },
    getInputRangeValue(key, type) {
      const rangeKey = `${key}_${type}`
      return this.selected[rangeKey] !== undefined ? this.selected[rangeKey] : ''
    },
    handleInputRangeChange(key, type, value) {
      const rangeKey = `${key}_${type}`
      if (value === '' || value === null) {
        delete this.selected[rangeKey]
      } else {
        this.selected[rangeKey] = Number(value)
      }
      this.selected = { ...this.selected }
    },
    handleSwitchChange(key, value) {
      if (value) {
        this.selected[key] = true
      } else {
        delete this.selected[key]
      }
      this.selected = { ...this.selected }
    },
    handleReset() {
      this.selected = {}
    },
    getPickerLabel(group) {
      const val = this.selected[group.key]
      if (!val) return ''
      const item = group.items.find(i => i.value === val)
      return item ? item.label : ''
    },
    showPicker(group) {
      this.currentPicker = group
      const val = this.selected[group.key]
      const idx = val ? group.items.findIndex(i => i.value === val) : 0
      this.pickerIndex = [Math.max(0, idx)]
      this.pickerVisible = true
    },
    onPickerChange(e) {
      this.pickerIndex = e.detail.value
    },
    confirmPicker() {
      const idx = this.pickerIndex[0]
      const item = this.currentPicker.items[idx]
      if (item) {
        this.selected[this.currentPicker.key] = item.value
        this.selected = { ...this.selected }
      }
      this.pickerVisible = false
    },
    handleConfirm() {
      this.$emit('confirm', this.selected)
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/dark-mode.scss';

.dm-filter {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;

  &.is-visible {
    pointer-events: auto;

    .filter-mask {
      opacity: 1;
    }

    .filter-content {
      transform: translateX(0);
    }
  }

  .filter-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .filter-content {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 600rpx;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .filter-status-bar,
  .filter-capsule-bar {
    background-color: #FFFFFF;
    flex-shrink: 0;
  }

  .filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx;
    border-bottom: 1rpx solid #EEEEEE;
    transition: border-color 0.3s ease;

    .filter-title {
      font-size: 32rpx;
      color: #333333;
      font-weight: 600;
    }

    .filter-reset {
      font-size: 28rpx;
      color: #007AFF;
    }
  }

  .filter-body {
    flex: 1;
    padding: 24rpx;
    padding-bottom: 48rpx;
    box-sizing: border-box;
    overflow-y: scroll;

    .filter-group {
      margin-bottom: 32rpx;

      .group-title {
        display: block;
        font-size: 28rpx;
        color: #333333;
        font-weight: 500;
        margin-bottom: 20rpx;
        transition: color 0.3s ease;
      }

      .range-wrapper {
        padding-right: 12rpx;
        .range-values {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20rpx;
          .range-val {
            font-size: 32rpx;
            color: #007AFF;
            font-weight: 600;
          }
          .range-sep {
            margin: 0 16rpx;
            color: #999;
          }
        }
        .range-row {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;
          .range-label {
            width: 60rpx;
            font-size: 24rpx;
            color: #999;
            flex-shrink: 0;
          }
          .range-slider {
            flex: 1;
            margin: 0;
          }
        }
      }

      .input-range-wrapper {
        display: flex;
        align-items: center;
        .input-box {
          flex: 1;
          background-color: #F5F5F5;
          border-radius: 8rpx;
          padding: 16rpx 20rpx;
          transition: background-color 0.3s ease;
          .range-input {
            width: 100%;
            font-size: 28rpx;
            color: #333;
            text-align: center;
          }
        }
        .input-sep {
          margin: 0 16rpx;
          color: #999;
          font-size: 28rpx;
        }
      }

      .picker-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 24rpx;
        background-color: #F5F5F5;
        border-radius: 8rpx;
        transition: background-color 0.3s ease;
        .picker-value {
          font-size: 28rpx;
          color: #333;
        }
        .picker-arrow {
          font-size: 32rpx;
          color: #999;
        }
      }

      .switch-wrapper {
        display: flex;
        align-items: center;
      }

      .group-items {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .filter-item {
          padding: 16rpx 28rpx;
          font-size: 26rpx;
          color: #666666;
          background-color: #F5F5F5;
          border-radius: 8rpx;
          transition: all 0.3s ease;

          &.active {
            color: #007AFF;
            background-color: rgba(0, 122, 255, 0.1);
          }
        }
      }
    }
  }

  .filter-footer {
    display: flex;
    padding: 24rpx;
    border-top: 1rpx solid #EEEEEE;
    transition: border-color 0.3s ease;

    .btn-cancel,
    .btn-confirm {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      border-radius: 44rpx;
    }

    .btn-cancel {
      color: #666666;
      background-color: #F5F5F5;
      margin-right: 24rpx;
      transition: all 0.3s ease;
    }

    .btn-confirm {
      color: #FFFFFF;
      background-color: #007AFF;
    }
  }

  .picker-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;

    .picker-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .picker-panel {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      border-radius: 24rpx 24rpx 0 0;
      transition: background-color 0.3s ease;
    }

    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 32rpx;
      border-bottom: 1rpx solid #eee;
      transition: border-color 0.3s ease;

      .picker-cancel {
        font-size: 28rpx;
        color: #999;
      }
      .picker-title {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
      }
      .picker-confirm {
        font-size: 28rpx;
        color: #007AFF;
      }
    }

    .picker-view {
      height: 400rpx;
    }

    .picker-item {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #333;
    }
  }
}

// 夜间模式样式（不使用 :global，因为 WXSS 不支持）
.dm-filter.dark-mode {
  .filter-content,
  .filter-status-bar,
  .filter-capsule-bar,
  .picker-panel {
    background-color: $dark-bg-secondary;
  }
}

.dm-filter.dark-mode {
  .filter-header,
  .filter-footer,
  .picker-header {
    border-color: $dark-border;
  }
}

.dm-filter.dark-mode {
  .filter-title,
  .picker-value,
  .picker-title,
  .picker-item,
  .range-input {
    color: $dark-text-primary;
  }
}

.dm-filter.dark-mode .group-title {
  color: #b0b0b0 !important;
}

.dm-filter.dark-mode {
  .filter-reset,
  .check-icon,
  .range-val,
  .filter-item.active {
    color: $dark-link;
  }
}

.dm-filter.dark-mode {
  .range-sep,
  .range-label,
  .input-sep,
  .picker-arrow,
  .picker-cancel {
    color: $dark-text-tertiary;
  }
}

.dm-filter.dark-mode {
  .input-box,
  .picker-wrapper,
  .filter-item,
  .btn-cancel {
    background-color: $dark-bg-tertiary;
  }
}

.dm-filter.dark-mode .filter-item {
  color: $dark-text-primary;
}

.dm-filter.dark-mode .filter-item.active {
  background-color: rgba(0, 122, 255, 0.15);
}
</style>
