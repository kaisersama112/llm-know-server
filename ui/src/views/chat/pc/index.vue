<template>
  <div
      class="chat-pc layout-bg"
      :class="classObj"
      v-loading="loading"
      :style="{
      '--el-color-primary': applicationDetail?.custom_theme?.theme_color,
      '--el-color-primary-light-9': hexToRgba(applicationDetail?.custom_theme?.theme_color, 0.1)
    }"
  >

    <div class="chat-pc__header" :style="customStyle">
      <div class="flex align-center flex-black">
        <!-- Avatar removed; restore by uncommenting the block below. -->
        <!--
        <div class="mr-12 ml-24 flex">
          <AppAvatar
              v-if="isAppIcon(applicationDetail?.icon)"
              shape="square"
              :size="32"
              style="background: none"
          >
            <img :src="applicationDetail?.icon" alt=""/>
          </AppAvatar>
          <AppAvatar
              v-else-if="applicationDetail?.name"
              :name="applicationDetail?.name"
              pinyinColor
              shape="square"
              :size="32"
          />
        </div>
        -->
        <h4 style="padding-left: 62px">{{ applicationDetail?.name }}</h4>
      </div>
    </div>
    <div>
      <div class="flex flex-black">
        <div class="chat-pc__left border-r">
          <div class="p-24 pb-0">
            <el-button class="add-button w-full primary" @click="newChat">
              <el-icon>
                <Plus/>
              </el-icon>
              <span class="ml-4">{{ $t('chat.createChat') }}</span>
            </el-button>
            <p class="mt-20 mb-8">{{ $t('chat.history') }}</p>
          </div>
          <div class="left-height pt-0">
            <el-scrollbar>
              <div class="p-8 pt-0">
                <common-list
                    :style="{
                    '--el-color-primary': applicationDetail?.custom_theme?.theme_color,
                    '--el-color-primary-light-9': hexToRgba(
                      applicationDetail?.custom_theme?.theme_color,
                      0.1
                    )
                  }"
                    :data="chatLogData"
                    class="mt-8"
                    v-loading="left_loading"
                    :defaultActive="currentChatId"
                    @click="clickListHandle"
                    @mouseenter="mouseenter"
                    @mouseleave="mouseId = ''"
                >
                  <template #default="{ row }">
                    <div class="flex-between">
                      <auto-tooltip :content="row.abstract">
                        {{ row.abstract }}
                      </auto-tooltip>
                      <div @click.stop v-show="mouseId === row.id && row.id !== 'new'">
                        <el-dropdown trigger="click" :teleported="false">
                          <el-icon class="rotate-90 mt-4">
                            <MoreFilled/>
                          </el-icon>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item @click.stop="editLogTitle(row)">
                                <el-icon>
                                  <EditPen/>
                                </el-icon>
                                {{ $t('common.edit') }}
                              </el-dropdown-item>
                              <el-dropdown-item @click.stop="deleteLog(row)">
                                <el-icon>
                                  <Delete/>
                                </el-icon>
                                {{ $t('common.delete') }}
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                    </div>
                  </template>

                  <template #empty>
                    <div class="text-center">
                      <el-text type="info">{{ $t('chat.noHistory') }}</el-text>
                    </div>
                  </template>
                </common-list>
              </div>
              <div v-if="chatLogData?.length" class="gradient-divider lighter mt-8">
                <span>{{ $t('chat.only20history') }}</span>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="chat-pc__right">
          <div class="right-header mb-24 flex-between">
            <!-- <h4 v-if="showChatTitle" class="ellipsis-1" style="width: 66%">
              {{ currentChatName }}
            </h4> -->

            <!-- <span class="flex align-center flex-black" v-if="currentRecordList.length">
              <AppIcon
                  v-if="paginationConfig.total"
                  iconName="app-chat-record"
                  class="info mr-8"
                  style="font-size: 16px"
              ></AppIcon>
              <span v-if="paginationConfig.total" class="lighter">
                {{ paginationConfig.total }} {{ $t('chat.question_count') }}
              </span>
              <el-dropdown class="ml-8">
                <AppIcon
                    iconName="app-export"
                    class="cursor"
                    :title="$t('chat.exportRecords')"
                ></AppIcon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="exportMarkdown"
                    >{{ $t('common.export') }} Markdown</el-dropdown-item
                    >
                    <el-dropdown-item @click="exportHTML"
                    >{{ $t('common.export') }} HTML</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span> -->
          </div>

          <div class="right-height chat-width">
            <AiChat
                v-show="!showCallModal"
                ref="AiChatRef"
                v-model:applicationDetails="applicationDetail"
                :available="applicationAvailable"
                type="ai-chat"
                :appId="applicationDetail?.id"
                :record="currentRecordList"
                :chatId="currentChatId"
                @refresh="refresh"
                @scroll="handleScroll"
            >
            </AiChat>
          </div>
          <!-- 悬浮按钮升级 -->
          <transition @click="toggleCallModal" name="bounce">
            <button
                ref="callButtonRef"
                @click="toggleCallModal"
                @pointerdown="handleCallButtonPointerDown"
                class="call-button"
                :class="{ 'ring-pulse': showCallModal }"
                :style="callButtonStyle"
            >
              📞
<!--              <span class="phone-icon">📞</span>-->
            </button>
          </transition>
          <!-- 通话弹窗 -->
          <transition name="fade">
            <div v-if="showCallModal" class="call-modal-overlay" @click.self="closeCallModal">
              <AiAudio @close="closeCallModal"></AiAudio>
            </div>
          </transition>
        </div>
      </div>
      <div class="collapse">

        <el-button class="collapse-button" @click="isCollapse = !isCollapse">
          <svg
            t="1768359358707"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4874"
            width="20"
            height="20"
          >
            <path
              d="M170.666667 213.333333h682.666666v85.333334H170.666667V213.333333z m0 512h682.666666v85.333334H170.666667v-85.333334z m0-256h682.666666v85.333334H170.666667v-85.333334z"
              fill="#ffffff"
              p-id="4875"
            ></path>
          </svg>
        </el-button>
      </div>
    </div>

  </div>
  <EditTitleDialog ref="EditTitleDialogRef" @refresh="refreshFieldTitle"/>

</template>

<script setup lang="ts">
import {ref, onMounted, nextTick, computed, onUnmounted, reactive} from 'vue'
import {marked} from 'marked'
import {saveAs} from 'file-saver'
import {isAppIcon} from '@/utils/application'
import useStore from '@/stores'
import useResize from '@/layout/hooks/useResize'
import {hexToRgba} from '@/utils/theme'
import EditTitleDialog from './EditTitleDialog.vue'
import AiAudio from "./AiAudio.vue";
import {t, i18n} from '@/locales'

useResize()

const {user, log, common} = useStore()
const previousLocale = ref(i18n.global.locale.value)
const shouldRestoreLocale = ref(false)
// 语音通话
const showCallModal = ref(false);
const callButtonRef = ref<HTMLButtonElement | null>(null)

const CALL_BUTTON_SIZE = 45
const CALL_BUTTON_MARGIN = 16
const LONG_PRESS_DELAY = 350

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const resolveInitialButtonPosition = () => {
  if (typeof window === 'undefined') {
    return {top: 0, left: 0}
  }
  const top = clamp(
      window.innerHeight * 0.75,
      CALL_BUTTON_MARGIN,
      Math.max(CALL_BUTTON_MARGIN, window.innerHeight - CALL_BUTTON_SIZE - CALL_BUTTON_MARGIN)
  )
  const left = clamp(
      window.innerWidth - CALL_BUTTON_SIZE - CALL_BUTTON_MARGIN,
      CALL_BUTTON_MARGIN,
      Math.max(CALL_BUTTON_MARGIN, window.innerWidth - CALL_BUTTON_SIZE - CALL_BUTTON_MARGIN)
  )
  return {top, left}
}

const initialButtonPosition = resolveInitialButtonPosition()

const callButtonPosition = reactive({
  top: initialButtonPosition.top,
  left: initialButtonPosition.left
})

const callButtonStyle = computed(() => ({
  top: `${callButtonPosition.top}px`,
  left: `${callButtonPosition.left}px`,
  right: 'auto'
}))

const dragState = reactive({
  dragging: false,
  pressTimer: null as number | null,
  offsetX: 0,
  offsetY: 0,
  lastEvent: null as PointerEvent | null,
  blockClick: false,
  moved: false
})


const toggleCallModal = () => {
  if (dragState.dragging || dragState.blockClick) {
    return
  }
  if (!showCallModal.value) {
    showCallModal.value = true
  } else {
    closeCallModal()
  }
};
const closeCallModal = () => {
  showCallModal.value = false;
};

const setButtonPosition = (left: number, top: number) => {
  if (typeof window === 'undefined') {
    callButtonPosition.left = left
    callButtonPosition.top = top
    return
  }
  const maxLeft = Math.max(CALL_BUTTON_MARGIN, window.innerWidth - CALL_BUTTON_SIZE - CALL_BUTTON_MARGIN)
  const maxTop = Math.max(CALL_BUTTON_MARGIN, window.innerHeight - CALL_BUTTON_SIZE - CALL_BUTTON_MARGIN)
  callButtonPosition.left = clamp(left, CALL_BUTTON_MARGIN, maxLeft)
  callButtonPosition.top = clamp(top, CALL_BUTTON_MARGIN, maxTop)
}

const clearPressTimer = () => {
  if (dragState.pressTimer !== null) {
    clearTimeout(dragState.pressTimer)
    dragState.pressTimer = null
  }
}

const stopDragging = (shouldBlockClick: boolean) => {
  if (dragState.dragging) {
    dragState.dragging = false
    if (typeof document !== 'undefined') {
      document.body.style.userSelect = ''
    }
    if (dragState.moved && shouldBlockClick) {
      dragState.blockClick = true
      setTimeout(() => {
        dragState.blockClick = false
      }, 120)
    }
  }
  dragState.moved = false
}

const startDragging = () => {
  if (!dragState.lastEvent) return
  dragState.dragging = true
  dragState.moved = false
  dragState.offsetX = dragState.lastEvent.clientX - callButtonPosition.left
  dragState.offsetY = dragState.lastEvent.clientY - callButtonPosition.top
  if (typeof document !== 'undefined') {
    document.body.style.userSelect = 'none'
  }
}

const handlePointerMove = (event: PointerEvent) => {
  dragState.lastEvent = event
  if (!dragState.dragging) {
    return
  }
  event.preventDefault()
  const nextLeft = event.clientX - dragState.offsetX
  const nextTop = event.clientY - dragState.offsetY
  setButtonPosition(nextLeft, nextTop)
  dragState.moved = true
}

const handlePointerUp = () => {
  const shouldBlock = dragState.dragging && dragState.moved
  stopDragging(shouldBlock)
  clearPressTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerCancel)
  }
}

const handlePointerCancel = () => {
  stopDragging(false)
  clearPressTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerCancel)
  }
}

const addPointerListeners = () => {
  if (typeof window === 'undefined') return
  window.addEventListener('pointermove', handlePointerMove, {passive: false})
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointercancel', handlePointerCancel)
}

const handleCallButtonPointerDown = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return
  }
  event.preventDefault()
  event.stopPropagation()
  if (typeof window === 'undefined') {
    return
  }
  dragState.lastEvent = event
  clearPressTimer()
  dragState.pressTimer = window.setTimeout(() => {
    startDragging()
  }, LONG_PRESS_DELAY)
  addPointerListeners()
}

const handleWindowResize = () => {
  if (typeof window === 'undefined') {
    return
  }
  setButtonPosition(callButtonPosition.left, callButtonPosition.top)
}
const EditTitleDialogRef = ref()

const isCollapse = ref(false)

const customStyle = computed(() => {
  return {
    background: applicationDetail.value?.custom_theme?.theme_color,
    color: applicationDetail.value?.custom_theme?.header_font_color
  }
})

const classObj = computed(() => {
  return {
    mobile: common.isMobile(),
    hideLeft: !isCollapse.value,
    openLeft: isCollapse.value
  }
})

const newObj = {
  id: 'new',
  abstract: t('chat.createChat')
}
const props = defineProps<{
  application_profile: any
  applicationAvailable: boolean
}>()
const AiChatRef = ref()
const loading = ref(false)
const left_loading = ref(false)

const applicationDetail = computed({
  get: () => {
    return props.application_profile
  },
  set: (v) => {
  }
})

const chatLogData = ref<any[]>([])

const paginationConfig = ref({
  current_page: 1,
  page_size: 20,
  total: 0
})

const currentRecordList = ref<any>([])
const currentChatId = ref('new') // 当前历史记录Id 默认为'new'
const currentChatName = ref(t('chat.createChat'))
const showChatTitle = computed(() => currentChatName.value !== t('chat.createChat'))
const mouseId = ref('')

function mouseenter(row: any) {
  mouseId.value = row.id
}

function editLogTitle(row: any) {
  EditTitleDialogRef.value.open(row, applicationDetail.value.id)
}

function refreshFieldTitle() {
  getChatLog(applicationDetail.value.id)
}

function deleteLog(row: any) {
  log.asyncDelChatClientLog(applicationDetail.value.id, row.id, left_loading).then(() => {
    if (currentChatId.value === row.id) {
      currentChatId.value = 'new'
      currentChatName.value = t('chat.createChat')
      paginationConfig.value.current_page = 1
      paginationConfig.value.total = 0
      currentRecordList.value = []
    }
    getChatLog(applicationDetail.value.id)
  })
}

function handleScroll(event: any) {
  if (
      currentChatId.value !== 'new' &&
      event.scrollTop === 0 &&
      paginationConfig.value.total > currentRecordList.value.length
  ) {
    const history_height = event.dialogScrollbar.offsetHeight
    paginationConfig.value.current_page += 1
    getChatRecord().then(() => {
      event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height)
    })
  }
}

function newChat() {
  if (!chatLogData.value.some((v) => v.id === 'new')) {
    paginationConfig.value.current_page = 1
    paginationConfig.value.total = 0
    currentRecordList.value = []
    chatLogData.value.unshift(newObj)
  } else {
    paginationConfig.value.current_page = 1
    paginationConfig.value.total = 0
    currentRecordList.value = []
  }
  currentChatId.value = 'new'
  currentChatName.value = t('chat.createChat')
  if (common.isMobile()) {
    isCollapse.value = false
  }
}

function getChatLog(id: string, refresh?: boolean) {
  const page = {
    current_page: 1,
    page_size: 20
  }

  log.asyncGetChatLogClient(id, page, left_loading).then((res: any) => {
    chatLogData.value = res.data.records
    if (refresh) {
      currentChatName.value = chatLogData.value?.[0]?.abstract
    } else {
      paginationConfig.value.current_page = 1
      paginationConfig.value.total = 0
      currentRecordList.value = []
      currentChatId.value = chatLogData.value?.[0]?.id || 'new'
      currentChatName.value = chatLogData.value?.[0]?.abstract || t('chat.createChat')
      if (currentChatId.value !== 'new') {
        getChatRecord()
      }
    }
  })
}

function getChatRecord() {
  return log
      .asyncChatRecordLog(
          applicationDetail.value.id,
          currentChatId.value,
          paginationConfig.value,
          loading,
          false
      )
      .then((res: any) => {
        paginationConfig.value.total = res.data.total
        const list = res.data.records
        list.map((v: any) => {
          v['write_ed'] = true
          v['record_id'] = v.id
        })
        currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) =>
            a.create_time.localeCompare(b.create_time)
        )
        if (paginationConfig.value.current_page === 1) {
          nextTick(() => {
            // 将滚动条滚动到最下面
            AiChatRef.value.setScrollBottom()
          })
        }
      })
}

const clickListHandle = (item: any) => {
  if (item.id !== currentChatId.value) {
    paginationConfig.value.current_page = 1
    paginationConfig.value.total = 0
    currentRecordList.value = []
    currentChatId.value = item.id
    currentChatName.value = item.abstract
    if (currentChatId.value !== 'new') {
      getChatRecord()

      // 切换对话后，取消暂停的浏览器播放
      if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume()
        nextTick(() => {
          window.speechSynthesis.cancel()
        })
      }
    }
  }
  if (common.isMobile()) {
    isCollapse.value = false
  }
}

function refresh(id: string) {
  getChatLog(applicationDetail.value.id, true)
  currentChatId.value = id
}

async function exportMarkdown(): Promise<void> {
  const suggestedName: string = `${currentChatId.value}.md`
  const markdownContent: string = currentRecordList.value
      .map((record: any) => `# ${record.problem_text}\n\n${record.answer_text}\n\n`)
      .join('\n')

  const blob: Blob = new Blob([markdownContent], {type: 'text/markdown;charset=utf-8'})
  saveAs(blob, suggestedName)
}

async function exportHTML(): Promise<void> {
  const suggestedName: string = `${currentChatId.value}.html`
  const markdownContent: string = currentRecordList.value
      .map((record: any) => `# ${record.problem_text}\n\n${record.answer_text}\n\n`)
      .join('\n')
  const htmlContent: any = marked(markdownContent)

  const blob: Blob = new Blob([htmlContent], {type: 'text/html;charset=utf-8'})
  saveAs(blob, suggestedName)
}

/**
 *初始化历史对话记录
 */
const init = () => {
  if (
      (applicationDetail.value.show_history || !user.isEnterprise()) &&
      props.applicationAvailable
  ) {
    getChatLog(applicationDetail.value.id)
  }
}
onMounted(() => {
  if (i18n.global.locale.value !== 'en-US') {
    previousLocale.value = i18n.global.locale.value
    i18n.global.locale.value = 'en-US'
    shouldRestoreLocale.value = true
    newObj.abstract = t('chat.createChat')
    if (currentChatId.value === 'new') {
      currentChatName.value = t('chat.createChat')
    }
  }
  init()
  if (typeof window !== 'undefined') {
    const {top, left} = resolveInitialButtonPosition()
    callButtonPosition.top = top
    callButtonPosition.left = left
    window.addEventListener('resize', handleWindowResize)
  }
})

onUnmounted(() => {
  if (shouldRestoreLocale.value) {
    i18n.global.locale.value = previousLocale.value
  }
  clearPressTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerCancel)
    window.removeEventListener('resize', handleWindowResize)
  }
  if (typeof document !== 'undefined') {
    document.body.style.userSelect = ''
  }
})
</script>
<style lang="scss">
.chat-pc {
  overflow: hidden;
  height: var(--app-viewport-height, 100vh);
  min-height: var(--app-viewport-height, 100vh);

  &__header {
    background: #232F3E !important;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    height: var(--app-header-height);
    line-height: var(--app-header-height);
    box-sizing: border-box;
    border-bottom: 1px solid var(--el-border-color);
  }

  &__left {
    padding-top: calc(var(--app-header-height) - 8px);
    background: #ffffff;
    width: 280px;

    .add-button {
      border: 1px solid var(--el-color-primary);
    }

    .left-height {
      height: calc(
        var(--chat-viewport-height, var(--app-viewport-height, 100vh)) -
          var(--app-header-height) - 135px
      );
    }
  }

  &__right {
    width: calc(100% - 280px);
    padding-top: calc(var(--app-header-height));
    overflow: hidden;
    position: relative;
    box-sizing: border-box;

    .right-header {
      background: #232F3E;
      box-sizing: border-box;
    }

    .right-height {
      height: calc(
        var(--chat-viewport-height, var(--app-viewport-height, 100vh)) -
          var(--app-header-height) * 2 - 24px
      );
    }
  }

  .gradient-divider {
    position: relative;
    text-align: center;
    color: var(--el-color-info);

    ::before {
      content: '';
      width: 17%;
      height: 1px;
      background: linear-gradient(90deg, rgba(222, 224, 227, 0) 0%, #dee0e3 100%);
      position: absolute;
      left: 16px;
      top: 50%;
    }

    ::after {
      content: '';
      width: 17%;
      height: 1px;
      background: linear-gradient(90deg, #dee0e3 0%, rgba(222, 224, 227, 0) 100%);
      position: absolute;
      right: 16px;
      top: 50%;
    }
  }

.collapse {
  display: none;
}
}

.collapse .collapse-button {
  position: relative;
  width: 38px;
  height: 38px;
  min-width: 38px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(64, 138, 255, 0.18);
  box-shadow: none;
  overflow: hidden;
  transition: transform 0.15s ease;
}

.collapse .collapse-button svg {
  width: 20px;
  height: 20px;
}

.collapse .collapse-button:active {
  transform: scale(1.05);
}

.collapse .collapse-button::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.collapse .collapse-button:active::after {
  animation: collapse-ripple 0.45s ease-out;
}

@keyframes collapse-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.4;
  }
  100% {
    width: 120%;
    height: 120%;
    opacity: 0;
  }
}

// 适配移动端
.mobile {
  .chat-pc {
    &__right {
      width: 100%;
    }

    &__left {
      display: none;
      width: 0;
    }
  }

  .collapse {
    display: block;
    position: fixed;
    bottom: 90px;
    z-index: 99;
  }

  &.openLeft {
    .chat-pc {
      &__left {
        display: block;
        position: fixed;
        width: 100%;
        z-index: 99;
        height: calc(
          var(--chat-viewport-height, var(--app-viewport-height, 100vh)) -
            var(--app-header-height) + 6px
        );
      }
    }

    .collapse {
      display: block;
      position: absolute;
      bottom: 90px;
      right: 0;
      z-index: 99;
    }
  }
}

.chat-width {
  max-width: 80%;
  margin: 0 auto;
}

@media only screen and (max-width: 1000px) {
  .chat-width {
    max-width: 100% !important;
    margin: 0 auto;
  }
}

.flex {
  background: #FFFFFF;
  // background: #232F3E;
}
.flex-black{
    background: #232F3E !important;
}

/* 悬浮按钮 */
.call-button {
  position: fixed;
  z-index: 100;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #00c3ff);
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
  transition: transform 0.3s ease,
  box-shadow 0.3s ease,
  background 0.3s ease;
  touch-action: none;

  /* 按钮悬浮态 */
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.4);

  }

  /* 按钮激活态 */
  &:active {
    transform: scale(0.95);

  }

  /* 通话时的呼吸效果 */
  &.ring-pulse {
    animation: ringPulse 1.5s ease-in-out infinite;
  }

}

/* 弹窗动画升级 */
.call-modal-overlay {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.call-modal-content {
  position: relative;
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* 定制过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
  transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.bounce-enter-active {
  animation: bounceIn 0.6s;
}

.bounce-leave-active {
  animation: bounceOut 0.6s;
}

@keyframes ringPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.3),
    0 0 0 16px rgba(0, 123, 255, 0);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0),
    0 0 0 20px rgba(0, 123, 255, 0.15);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0);
  }
}
.chat-pc__header h4{
  color: #ddd;
}
.ellipsis-1{
  color: #ddd;
}
#preview-only-preview{
  color: #0f1111;
}
.ai-chat__content{
  background-color: #232F3E !important;
}
.chat-pc__left{
  background-color: #232F3E;
}
.ai-chat__operate{
  background-color: #232F3E !important;
}
.ai-chat__operate::before{
  background-color: none;
}
.operate{
  background-color: #ffffff;
}
.operate .flex{
  background-color: #ffffff;
}
.chat-pc__left p{
  color: #ddd;
}
.el-button.is-text{
  color: #000;
}
</style>
