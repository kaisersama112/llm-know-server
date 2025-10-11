<template>
  <div>
    <!-- 移动端菜单抽屉 -->
    <div class="mobile-sidebar-drawer" :class="{ open: isOpen }">
      <div class="drawer-header">
        <h3 class="drawer-title">菜单</h3>
        <button class="close-button" @click="closeDrawer">
          <el-icon><Close /></el-icon>
        </button>
      </div>
      <div class="drawer-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu :default-active="activeMenu" router>
            <sidebar-item
              v-hasPermission="menu.meta?.permission"
              v-for="(menu, index) in subMenuList"
              :key="index"
              :menu="menu"
              :activeMenu="activeMenu"
            >
            </sidebar-item>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
    
    <!-- 遮罩层 -->
    <div 
      class="mobile-overlay" 
      :class="{ show: isOpen }" 
      @click="closeDrawer"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getChildRouteListByPathAndName } from '@/router/index'
import SidebarItem from '@/layout/components/sidebar/SidebarItem.vue'
import { Close } from '@element-plus/icons-vue'
import useStore from '@/stores'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const { common } = useStore()

// 监听设备类型变化，如果切换到桌面端，自动关闭抽屉
watch(() => common.isMobile(), (isMobile) => {
  if (!isMobile) {
    closeDrawer()
  }
})

// 计算当前激活的菜单
const activeMenu = computed(() => {
  const { path, meta } = route
  return meta.active || path
})

// 获取子菜单列表
const subMenuList = computed(() => {
  const { meta } = route
  return getChildRouteListByPathAndName(meta.parentPath, meta.parentName)
})

// 关闭抽屉
const closeDrawer = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
// 侧边栏抽屉样式
.mobile-sidebar-drawer {
  position: fixed;
  top: 0;
  left: -280px;
  height: 100vh;
  width: 280px;
  background-color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 200;
  transition: left 0.3s ease;
  overflow-y: auto;
  
  &.open {
    left: 0;
  }
}

// 抽屉头部样式
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  
  .drawer-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--el-text-color-secondary);
    padding: 4px;
    border-radius: 4px;
    
    &:hover {
      background-color: var(--el-bg-color-hover);
    }
  }
}

// 抽屉内容区域样式
.drawer-content {
  height: calc(100% - 56px);
  padding: 16px;
}

// 滚动条容器样式
.scrollbar-wrapper {
  height: 100%;
}

// 菜单样式调整
.el-menu {
  border-right: none !important;
  background: none !important;
  width: 100%;
}

// 遮罩层样式
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  
  &.show {
    opacity: 1;
    visibility: visible;
  }
}

// 移动端优化
@media screen and (max-width: 767px) {
  .mobile-sidebar-drawer {
    width: 85% !important;
    max-width: 280px;
  }
  
  .drawer-header {
    padding: 12px 16px;
  }
  
  .drawer-content {
    padding: 12px;
  }
}
</style>