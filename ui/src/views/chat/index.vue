<template>
  <component
    v-if="chat_show && init_data_end"
    :applicationAvailable="applicationAvailable"
    :is="currentTemplate"
    :application_profile="application_profile"
    :key="route.fullPath"
    v-loading="loading"
  />
  <Auth
    v-else
    :application_profile="application_profile"
    :auth_type="application_profile.authentication_type"
    v-model="is_auth"
    :style="{
      '--el-color-primary': application_profile?.custom_theme?.theme_color,
      '--el-color-primary-light-9': hexToRgba(application_profile?.custom_theme?.theme_color, 0.1)
    }"
  ></Auth>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import useStore from '@/stores'
import Auth from '@/views/chat/auth/index.vue'
import { hexToRgba } from '@/utils/theme'
import { useI18n } from 'vue-i18n'
import { getBrowserLang } from '@/locales/index'
const { locale } = useI18n({ useScope: 'global' })
const route = useRoute()
const { application, user } = useStore()

const components: any = import.meta.glob('@/views/chat/**/index.vue', {
  eager: true
})

const {
  query: { mode },
  params: { accessToken }
} = route as any
const is_auth = ref<boolean>(false)
const currentTemplate = computed(() => {
  let modeName = ''
  if (mode && mode === 'embed') {
    modeName = 'embed'
  } else {
    modeName = show_history.value || !user.isEnterprise() ? 'pc' : 'base'
  }
  const name = `/src/views/chat/${modeName}/index.vue`
  return components[name].default
})
/**
 * 是否显示对话
 */
const chat_show = computed(() => {
  if (init_data_end.value) {
    if (!applicationAvailable.value) {
      return true
    }
    if (application_profile.value) {
      if (application_profile.value.authentication && is_auth.value) {
        return true
      } else if (!application_profile.value.authentication) {
        return true
      }
    }
  }
  return false
})
const loading = ref(false)

const show_history = ref(false)

const application_profile = ref<any>({})
/**

 * 初始化结束
 */
const init_data_end = ref<boolean>(false)

const applicationAvailable = ref<boolean>(true)
const CHAT_VIEWPORT_CLASS = 'chat-page-lock'
const CHAT_VIEWPORT_VAR = '--chat-viewport-height'

const isIOSSafari = (() => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return /iP(hone|ad|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
})()

let chatViewportRafId = 0

const applyChatViewportHeight = () => {
  if (!isIOSSafari || typeof window === 'undefined') return
  document.documentElement.style.setProperty(CHAT_VIEWPORT_VAR, `${window.innerHeight}px`)
}

const scheduleChatViewportHeight = () => {
  if (!isIOSSafari || typeof window === 'undefined') return
  if (chatViewportRafId) return
  chatViewportRafId = window.requestAnimationFrame(() => {
    chatViewportRafId = 0
    applyChatViewportHeight()
  })
}

const applyChatViewportLock = () => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.add(CHAT_VIEWPORT_CLASS)
  document.body.classList.add(CHAT_VIEWPORT_CLASS)
}

const removeChatViewportLock = () => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove(CHAT_VIEWPORT_CLASS)
  document.body.classList.remove(CHAT_VIEWPORT_CLASS)
}

const clearChatViewportHeight = () => {
  if (typeof document === 'undefined') return
  document.documentElement.style.removeProperty(CHAT_VIEWPORT_VAR)
}
function getAppProfile() {
  return application.asyncGetAppProfile(loading).then((res: any) => {
    locale.value = res.data?.language || getBrowserLang()
    show_history.value = res.data?.show_history
    application_profile.value = res.data
  })
}
function getAccessToken(token: string) {
  return application.asyncAppAuthentication(token, loading).then(() => {
    return getAppProfile()
  })
}
onBeforeMount(() => {
  user.changeUserType(2)
  Promise.all([user.asyncGetProfile(), getAccessToken(accessToken)])
    .catch(() => {
      applicationAvailable.value = false
    })
    .finally(() => (init_data_end.value = true))
})

onMounted(() => {
  applyChatViewportLock()
  if (isIOSSafari) {
    applyChatViewportHeight()
    window.addEventListener('resize', scheduleChatViewportHeight)
  }
})

onBeforeUnmount(() => {
  removeChatViewportLock()
  if (isIOSSafari) {
    window.removeEventListener('resize', scheduleChatViewportHeight)
    clearChatViewportHeight()
  }
  if (chatViewportRafId) {
    window.cancelAnimationFrame(chatViewportRafId)
    chatViewportRafId = 0
  }
})
</script>
<style lang="scss"></style>
