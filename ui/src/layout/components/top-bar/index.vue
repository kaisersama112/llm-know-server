·
<template>
  <div class="top-bar-container border-b flex-between">
    <div class="flex-center h-full">
      <div class="app-title-container cursor app-container-none" @click="router.push('/')">
        <div class="logo flex-center">
          <LogoFull/>
        </div>
      </div>
      <TopMenu></TopMenu>
    </div>
    <div class="flex-center avatar app-container-none">
      <Avatar></Avatar>
    </div>
  </div>
</template>
<script setup lang="ts">
import TopMenu from './top-menu/index.vue'
import Avatar from './avatar/index.vue'
import {useRouter} from 'vue-router'

import useStore from '@/stores'

const {user} = useStore()
const router = useRouter()

function toUrl(url: string) {
  window.open(url, '_blank')
}
</script>
<style lang="scss">

  .app-container-none {
    @media screen and (max-width: 768px) {
    display: none;
    margin-right: 0; // 清除原有右边距
  }

  }

.top-bar-container {
  height: var(--app-header-height);
  box-sizing: border-box;
  padding: var(--app-header-padding);
  @media screen and (max-width: 768px) {
    padding: 0;
  }

  .app-title-container {
    margin-right: 45px;
    // 移动端隐藏

  }

  .line {
    height: 2em;
  }
}
</style>
