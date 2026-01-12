<template>
  <view class="dm-filter-bar" :class="{ 'dark-mode': darkMode }" v-if="filters.length > 0">
    <view class="filter-bar-wrapper">
      <view
        v-for="(filter, index) in filters"
        :key="filter.key"
        class="filter-item"
        :class="{ active: activeIndex === index }"
        @click="toggleDropdown(index)"
      >
        <text class="filter-label">{{ getFilterLabel(filter) }}</text>
        <text class="filter-arrow" :class="{ up: activeIndex === index }">▼</text>
      </view>
    </view>

    <!-- 下拉菜单 -->
    <view v-if="activeIndex !== -1" class="dropdown-mask" @click="closeDropdown"></view>
    <view v-if="activeIndex !== -1" class="dropdown-content">
      <view class="dropdown-items">
        <view
          v-for="item in filters[activeIndex].items"
          :key="item.value"
          class="dropdown-item"
          :class="{ active: isSelected(filters[activeIndex].key, item.value) }"
          @click="handleSelect(filters[activeIndex].key, item.value)"
        >
          <text>{{ item.label }}</text>
          <text v-if="isSelected(filters[activeIndex].key, item.value)" class="check-icon">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import componentBaseMixin from '@/mixins/component-base.js'

export default {
  mixins: [componentBaseMixin],
  props: {
    filters: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['input', 'change'],
  data() {
    return {
      activeIndex: -1,
      selected: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selected = { ...val }
      },
      immediate: true
    },
    filters: {
      handler() {
        this.initDefaultValues()
      },
      immediate: true
    }
  },
  methods: {
    initDefaultValues() {
      const newSelected = {}
      this.filters.forEach(filter => {
        if (this.value[filter.key] !== undefined) {
          newSelected[filter.key] = this.value[filter.key]
        } else if (filter.items && filter.items.length > 0) {
          newSelected[filter.key] = filter.items[0].value
        }
      })
      this.selected = newSelected
    },
    getFilterLabel(filter) {
      const selectedValue = this.selected[filter.key]
      const selectedItem = filter.items.find(item => item.value === selectedValue)
      return selectedItem ? selectedItem.label : filter.title
    },
    isSelected(key, value) {
      return this.selected[key] === value
    },
    toggleDropdown(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index
    },
    closeDropdown() {
      this.activeIndex = -1
    },
    handleSelect(key, value) {
      this.selected[key] = value
      this.selected = { ...this.selected }
      this.$emit('input', this.selected)
      this.$emit('change', this.selected)
      this.closeDropdown()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/dark-mode.scss';

.dm-filter-bar {
  position: relative;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;
  transition: background-color 0.3s ease;

  .filter-bar-wrapper {
    display: flex;
    padding: 0 24rpx;

    .filter-item {
      display: flex;
      align-items: center;
      padding: 20rpx 24rpx;
      margin-right: 16rpx;

      .filter-label {
        font-size: 26rpx;
        color: #666666;
        transition: color 0.3s ease;
      }

      .filter-arrow {
        font-size: 18rpx;
        color: #999999;
        margin-left: 8rpx;
        transition: transform 0.3s, color 0.3s ease;
      }

      &.active {
        .filter-label {
          color: #007AFF;
        }
        .filter-arrow {
          color: #007AFF;
        }
      }
    }
  }

  .dropdown-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }

  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    z-index: 100;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
  }

  .dropdown-items {
    padding: 16rpx 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 32rpx;
    font-size: 28rpx;
    color: #333333;
    transition: all 0.3s ease;

    &.active {
      color: #007AFF;
      background-color: rgba(0, 122, 255, 0.05);
    }
  }

  .check-icon {
    color: #007AFF;
    font-size: 28rpx;
  }
}

// 夜间模式样式
.dm-filter-bar.dark-mode {
  background-color: $dark-bg-secondary;
  border-color: $dark-border;

  .filter-item {
    .filter-label {
      color: $dark-text-primary;
    }
    .filter-arrow {
      color: $dark-text-tertiary;
    }
    &.active {
      .filter-label {
        color: $dark-link;
      }
      .filter-arrow {
        color: $dark-link;
      }
    }
  }

  .dropdown-content {
    background-color: $dark-bg-secondary;
  }

  .dropdown-item {
    color: $dark-text-primary;
    &.active {
      background-color: rgba(90, 159, 255, 0.15);
    }
  }

  .check-icon {
    color: $dark-link;
  }
}
</style>
