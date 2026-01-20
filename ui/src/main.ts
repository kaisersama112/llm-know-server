import '@/styles/index.scss'
import ElementPlus from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import enUs from 'element-plus/dist/locale/en.mjs'
import zhTW from 'element-plus/dist/locale/zh-tw.mjs'
import { createApp } from 'vue'
import { store } from '@/stores'
import directives from '@/directives'
import App from './App.vue'
import router from '@/router'
import Components from '@/components'
import i18n from './locales'
import { config } from 'md-editor-v3'
import screenfull from 'screenfull'

import katex from 'katex'
import 'katex/dist/katex.min.css'

import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

import mermaid from 'mermaid'

import highlight from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

config({
  editorExtensions: {
    highlight: {
      instance: highlight
    },
    screenfull: {
      instance: screenfull
    },
    katex: {
      instance: katex
    },
    cropper: {
      instance: Cropper
    },
    mermaid: {
      instance: mermaid
    }
  }
})

const DEBUG_VIEWPORT = false
let viewportRafId = 0

const applyViewportVars = () => {
  if (typeof window === 'undefined') return
  const viewport = window.visualViewport
  const rawHeight = viewport ? viewport.height : window.innerHeight
  const offsetTop = viewport ? viewport.offsetTop : 0
  const height = rawHeight + Math.max(0, offsetTop)
  document.documentElement.style.setProperty('--app-viewport-height', `${height}px`)
  document.documentElement.style.setProperty('--app-viewport-offset-top', `${offsetTop}px`)
  if (DEBUG_VIEWPORT) {
    console.info('[viewport]', {height, offsetTop})
  }
}

const scheduleViewportUpdate = () => {
  if (typeof window === 'undefined') return
  if (viewportRafId) return
  viewportRafId = window.requestAnimationFrame(() => {
    viewportRafId = 0
    applyViewportVars()
  })
}

if (typeof window !== 'undefined') {
  applyViewportVars()
  window.addEventListener('resize', scheduleViewportUpdate)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleViewportUpdate)
    window.visualViewport.addEventListener('scroll', scheduleViewportUpdate)
  }
}

const app = createApp(App)
app.use(store)
app.use(directives)

for (const [key, component] of Object.entries(ElementPlusIcons)) {
  app.component(key, component)
}
const locale_map: any = {
  'zh-CN': zhCn,
  'zh-Hant': zhTW,
  'en-US': enUs
}
app.use(ElementPlus, {
  locale: locale_map[localStorage.getItem('LLM-Know-locale') || navigator.language || 'en-US']
})

app.use(router)
app.use(i18n)
app.use(Components)
app.mount('#app')
export { app }
