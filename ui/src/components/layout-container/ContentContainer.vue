<template>
  <div class="content-container">
    <div class="content-container__header flex align-center w-full" v-if="slots.header || header">
      <slot name="backButton">
        <back-button :to="backTo" v-if="showBack"></back-button>
      </slot>
      <div class="flex-1 min-w-0">
        <slot name="header">
          <h4 class="truncate">{{ header }}</h4>
        </slot>
      </div>
      <div class="flex-shrink-0">
        <slot name="search"> </slot>
      </div>
    </div>

    <div class="content-container__main">
      <el-scrollbar class="p-16" style="padding-right: 0;">
        
        <slot></slot>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
defineOptions({ name: 'ContentContainer' })
const slots = useSlots()
const props = defineProps({
  header: String || null,
  backTo: String,
})
const showBack = computed(() => {
  const { backTo } = props
  return backTo
})
</script>

<style lang="scss" scoped>
.content-container {
  transition: 0.3s;
  .content-container__header {
    box-sizing: border-box;
    padding: calc(var(--app-base-px) * 2) calc(var(--app-base-px) * 2) 0;
    flex-wrap: nowrap;
    align-items: center;
  }
  .content-container__main {
    box-sizing: border-box;
    width: 100%;
    overflow-x: auto;
  }
  
  // 针对移动设备的响应式样式
  @media screen and (max-width: 767px) {
    .content-container__header {
      flex-direction: column;
      align-items: stretch;
      padding: calc(var(--app-base-px) * 1) calc(var(--app-base-px) * 1) 0;
    }
    
    .content-container__main {
      min-width: auto;
    }
  }
}
</style>
