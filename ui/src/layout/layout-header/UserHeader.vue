·
<template>
  <div class="app-top-bar-container border-b flex-center">
    <div class="logo">
      <LogoFull />
    </div>

    <div class="header-content">
      <div class="header-left">
        <div class="workspace-container flex align-center">
          <!-- 企业版: 工作空间下拉框-->
          <el-divider
            class="mr-8"
            direction="vertical"
            v-if="hasPermission(EditionConst.IS_EE, 'OR')"
          />
          <WorkspaceDropdown
            v-if="hasPermission(EditionConst.IS_EE, 'OR')"
            :data="user.workspace_list"
            :currentWorkspace="currentWorkspace"
            @changeWorkspace="changeWorkspace"
          />
        </div>
        <TopMenu class="header-menu"></TopMenu>
      </div>
      <div class="header-right">
        <LanguageDropdown></LanguageDropdown>
        <TopAbout></TopAbout>
      </div>
    </div>
    <Avatar></Avatar>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopMenu from './top-menu/index.vue'
import Avatar from './avatar/index.vue'
import TopAbout from './top-about/index.vue'
import LanguageDropdown from './language-dropdown/index.vue'
import { EditionConst } from '@/utils/permission/data'
import { hasPermission } from '@/utils/permission/index'
import type { WorkspaceItem } from '@/api/type/workspace'
import useStore from '@/stores'
const router = useRouter()
const route = useRoute()

const { user } = useStore()
const currentWorkspace = computed(() => {
  return user.workspace_list.find((w) => w.id == user.workspace_id)
})

function changeWorkspace(item: WorkspaceItem) {
  const {
    meta: { activeMenu },
  } = route as any
  if (item.id === user.workspace_id) return
  user.setWorkspaceId(item.id || 'default')
  if (activeMenu.includes('application') && route.path != '/application') {
    router.push('/application')
  } else if (activeMenu.includes('knowledge') && route.path != '/knowledge') {
    router.push('/knowledge')
  } else {
    window.location.reload()
  }
}
</script>
<style lang="scss" scoped>
.app-top-bar-container {
  height: var(--app-header-height);
  box-sizing: border-box;
  padding: var(--app-header-padding);
}

.header-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 12px;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.workspace-container {
  margin-right: 16px;
}

.header-menu {
  flex: 1;
  min-width: 0;
}

/* 移动端布局优化 */
@media screen and (max-width: 768px) {
  .header-content {
    margin: 0 8px;
  }
  
  .header-right {
    gap: 4px;
  }
  
  .header-right > * {
    margin: 0 !important;
  }
  
  .workspace-container {
    margin-right: 8px;
  }
  
  /* 隐藏工作空间下拉框 */
  .workspace-container {
    display: none;
  }
  
  /* 如果屏幕太窄，可能需要调整菜单显示方式 */
  @media screen and (max-width: 480px) {
    .header-content {
      justify-content: flex-end;
    }
    
    .header-left {
      justify-content: flex-end;
    }
    
    .header-menu {
      margin-right: 8px;
    }
  }
}
</style>
