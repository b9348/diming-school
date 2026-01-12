<template>
  <view class="dm-nav" :class="{ 'dark-mode': darkMode }">
    <view class="nav-wrapper" :class="{ expanded: isExpanded }">
      <!-- 第一行前5个导航项 -->
      <view
        v-for="(item, index) in firstRowList"
        :key="item._key"
        class="nav-item"
        @click="handleClick(item, index)"
      >
        <view class="nav-icon-box">
          <image v-if="item.icon" class="nav-icon" :src="item.icon" mode="aspectFit"></image>
          <text v-else class="nav-icon-text">{{ (item.name || '').substring(0, 2) }}</text>
        </view>
        <text class="nav-text">{{ item.name || item }}</text>
      </view>

      <!-- 展开/收起按钮（固定在第一行第6个位置） -->
      <view class="nav-item nav-toggle" @click="toggleExpand">
        <view class="nav-icon-box">
          <text :class="isExpanded ? 'tn-icon-up' : 'tn-icon-down'" :style="{ fontSize: '24px', color: darkMode ? '#b0b0b0' : '#666666' }"></text>
        </view>
        <text class="nav-text">{{ isExpanded ? '收起' : '更多' }}</text>
      </view>

      <!-- 展开后显示的剩余导航项（始终渲染，通过CSS控制显示） -->
      <view
        v-for="(item, index) in remainingList"
        :key="item._key"
        class="nav-item nav-item-expandable"
        :class="{
          'nav-item-empty': item.isEmpty,
          'is-visible': isExpanded && !item.isEmpty
        }"
        @click="item.isEmpty ? null : handleClick(item, index + 5)"
      >
        <template v-if="!item.isEmpty">
          <view class="nav-icon-box">
            <image v-if="item.icon" class="nav-icon" :src="item.icon" mode="aspectFit"></image>
            <text v-else class="nav-icon-text">{{ (item.name || '').substring(0, 2) }}</text>
          </view>
          <text class="nav-text">{{ item.name || item }}</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import componentBaseMixin from '@/mixins/component-base.js'

export default {
  mixins: [componentBaseMixin],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    showArrow: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click'],
  data() {
    return {
      isExpanded: false
    }
  },
  computed: {
    firstRowList() {
      return this.list.slice(0, 5).map((item, index) => ({
        ...item,
        _key: item.id || item.name || `first-${index}`
      }))
    },
    remainingList() {
      const remaining = this.list.slice(5, 17).map((item, index) => ({
        ...item,
        _key: item.id || item.name || `remain-${index}`
      }))
      const placeholderCount = 12 - remaining.length
      const placeholders = Array(placeholderCount).fill(null).map((_, i) => ({
        isEmpty: true,
        _key: `empty-${i}`
      }))
      return [...remaining, ...placeholders]
    }
  },
  methods: {
    handleClick(item, index) {
      this.$emit('click', { item, index })
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
.dm-nav {
  padding: 20rpx 0;
  background-color: #FFFFFF;
  overflow: hidden;
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: #2a2a2a;
  }

  .nav-wrapper {
    display: flex;
    flex-wrap: wrap;
    padding: 0 12rpx;
    max-height: 160rpx;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.expanded {
      max-height: 480rpx;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(100% / 6);
      padding: 0 8rpx;
      margin-bottom: 20rpx;
      box-sizing: border-box;

      &.nav-item-expandable {
        opacity: 0;
        transform: translateY(-10rpx);
        pointer-events: none;
        transition: opacity 0.25s ease-in, transform 0.25s ease-in;

        &.is-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          transition: opacity 0.3s ease-out 0.05s, transform 0.3s ease-out 0.05s;
        }

        &.nav-item-empty {
          visibility: hidden;
        }
      }

      .nav-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 88rpx;
        height: 88rpx;
        margin-bottom: 8rpx;
        background-color: #F5F5F5;
        border-radius: 16rpx;
        transition: background-color 0.3s ease;

        .nav-icon {
          width: 48rpx;
          height: 48rpx;
        }

        .nav-icon-text {
          font-size: 24rpx;
          color: #666666;
          transition: color 0.3s ease;
        }
      }

      .nav-text {
        width: 100%;
        font-size: 20rpx;
        color: #333333;
        text-align: center;
        line-height: 1.4;
        word-break: break-all;
        transition: color 0.3s ease;
      }

      &.nav-toggle {
        opacity: 1 !important;
        transform: translateY(0) !important;
        pointer-events: auto !important;

        .nav-icon-box {
          background-color: #F0F0F0;
        }
      }
    }
  }

  &.dark-mode {
    .nav-item {
      .nav-icon-box {
        background-color: #3a3a3a;

        .nav-icon-text {
          color: #b0b0b0;
        }
      }

      .nav-text {
        color: #e0e0e0;
      }

      &.nav-toggle .nav-icon-box {
        background-color: #3a3a3a;
      }
    }
  }
}
</style>
