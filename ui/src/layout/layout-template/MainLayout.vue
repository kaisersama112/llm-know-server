<template>
  <div class="app-layout">
    <div class="app-header" :class="!isDefaultTheme ? 'custom-header' : ''">
      <el-alert
        v-if="user.isExpire()"
        :title="$t('layout.isExpire')"
        type="warning"
        class="border-b"
        show-icon
        :closable="false"
      />
      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" v-if="isMobile">
        <el-icon><Menu /></el-icon>
      </button>
      <SystemHeader v-if="isShared"></SystemHeader>
      <UserHeader v-else />
    </div>
    <div class="app-main" :class="user.isExpire() ? 'isExpire' : ''">
      <layout-container>
        <template #left>
          <Sidebar v-if="!isMobile" />
        </template>
        <AppMain />
      </layout-container>
    </div>
    
    <!-- 移动端菜单抽屉 -->
    <MobileMenuDrawer 
      :is-open="mobileMenuOpen"
      @close="closeMobileMenu"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import UserHeader from '@/layout/layout-header/UserHeader.vue'
import SystemHeader from '@/layout/layout-header/SystemHeader.vue'
import Sidebar from '@/layout/components/sidebar/index.vue'
import AppMain from '@/layout/app-main/index.vue'
import useStore from '@/stores'
import { useRoute } from 'vue-router'
import { Menu } from '@element-plus/icons-vue'
import MobileMenuDrawer from '@/components/mobile-menu/MobileMenuDrawer.vue'
import useResize from '@/layout/hooks/useResize'
const route = useRoute()
const {
  params: { folderId }, // id为knowledgeID
  query: { from },
} = route as any
const isShared = computed(() => {
  return (
    folderId === 'shared' ||
    from === 'systemShare' ||
    from === 'systemManage' ||
    route.path.includes('resource-management')
  )
})
const { theme, user, common } = useStore()
const isDefaultTheme = computed(() => {
  return theme.isDefaultTheme()
})

// 调用设备检测钩子
useResize()

// 判断是否为移动设备
const isMobile = computed(() => {
  return common.isMobile()
})

// 从common store获取移动端菜单状态
const mobileMenuOpen = computed(() => {
  return common.mobileMenuOpen
})

// 使用common store中的方法控制移动端菜单
const toggleMobileMenu = () => {
  common.toggleMobileMenu()
}

const closeMobileMenu = () => {
  common.closeMobileMenu()
}
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>

<style lang="scss" scoped>
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--el-text-color-primary);
  padding: 12px;
  cursor: pointer;
  margin-right: 8px;
  
  &:hover {
    color: var(--el-color-primary);
  }
  
  @media screen and (max-width: 767px) {
    display: flex;
  }
}
</style>
