<template>
  <div class="layout-container flex h-full">
    <!-- 移动端显示抽屉 -->
    <el-drawer
      v-if="isMobile"
      v-model="drawerVisible"
      direction="ltr"
      :with-header="false"
      size="70%"
      class="layout-drawer"
    >
      <slot name="left"></slot>
    </el-drawer>

    <!-- PC端左侧栏 -->
    <div
      v-else
      :class="`layout-container__left border-r ${isCollapse ? 'hidden' : ''}`"
    >
      <div class="layout-container__left_content">
        <slot name="left"></slot>
      </div>
      <el-tooltip
        :content="isCollapse ? $t('common.expand') : $t('common.collapse')"
        placement="right"
      >
        <el-button
          v-if="props.showCollapse"
          class="collapse"
          size="small"
          circle
          @click="isCollapse = !isCollapse"
          :icon="isCollapse ? 'ArrowRightBold' : 'ArrowLeftBold'"
        />
      </el-tooltip>
    </div>

    <!-- 右侧主内容 -->
    <div class="layout-container__right">
      <!-- 移动端显示菜单按钮 -->
      <el-button
        v-if="isMobile"
        class="menu-btn"
        circle
        icon="Menu"
        @click="drawerVisible = true"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots, ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'LayoutContainer' })
const slots = useSlots()
const props = defineProps({
  header: String || null,
  backTo: String,
  showCollapse: Boolean,
})

// PC端控制折叠
const isCollapse = ref(false)
// 移动端抽屉开关
const drawerVisible = ref(false)
const isMobile = ref(false)

// 响应式检测
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})

const showBack = computed(() => props.backTo)
</script>

<style lang="scss" scoped>
.layout-container {
  &__left {
    position: relative;
    transition: width 0.28s;
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    box-sizing: border-box;

    .collapse {
      position: absolute;
      top: 36px;
      right: -12px;
      box-shadow: 0px 5px 10px rgba(31, 35, 41, 0.1);
      z-index: 1;
    }

    &.hidden {
      width: 0;
      min-width: 0;
      .layout-container__left_content {
        visibility: hidden;
      }
      .collapse {
        right: -18px;
      }
    }
  }

  &__right {
    flex: 1;
    overflow: hidden;
    position: relative;

    .menu-btn {
      position: absolute;
      top: 10px;
      left: 16px;
      z-index: 10;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 移动端专属样式 */
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;

    &__left {
      display: none;
    }

    .layout-drawer {
      .el-drawer__body {
        padding: 0;
      }
    }
  }
}
</style>
