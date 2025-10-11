<template>
  <div
    class="chat-mobile layout-bg chat-background"
    :class="classObj"
    :style="{
      '--el-color-primary': applicationDetail?.custom_theme?.theme_color,
      '--el-color-primary-light-9': hexToRgba(
        applicationDetail?.custom_theme?.theme_color || '#3370FF',
        0.1,
      ),
      '--el-color-primary-light-6': hexToRgba(
        applicationDetail?.custom_theme?.theme_color || '#3370FF',
        0.4,
      ),
      '--el-color-primary-light-06': hexToRgba(
        applicationDetail?.custom_theme?.theme_color || '#3370FF',
        0.04,
      ),
      backgroundImage: `url(${applicationDetail?.chat_background})`,
    }"
  >
    <div class="chat-mobile__header" :style="customStyle">
      <div class="flex-between">
        <div class="flex align-center">
          <AppIcon
            iconName="app-mobile-open-history"
            style="font-size: 20px"
            class="ml-16 cursor"
            @click.prevent.stop="show = true"
          />
          <div class="mr-12 ml-16 flex">
            <el-avatar
              v-if="isAppIcon(applicationDetail?.icon)"
              shape="square"
              :size="32"
              style="background: none"
            >
              <img :src="applicationDetail?.icon" alt="" />
            </el-avatar>
            <LogoIcon v-else height="32px" />
          </div>

          <h4 class="ellipsis" style="max-width: 270px" :title="applicationDetail?.name">
            {{ applicationDetail?.name }}
          </h4>
        </div>
        <el-button
          text
          @click="newChat"
          class="mr-16"
          :style="{ color: applicationDetail?.custom_theme?.header_font_color }"
        >
          <AppIcon iconName="app-create-chat" style="font-size: 20px"></AppIcon>
        </el-button>
      </div>
    </div>
    <div>
      <div class="chat-mobile__main">
        <AiChat
          ref="AiChatRef"
          v-model:applicationDetails="applicationDetail"
          :available="applicationAvailable"
          :appId="applicationDetail?.id"
          :record="currentRecordList"
          :chatId="currentChatId"
          type="ai-chat"
          @refresh="refresh"
          @scroll="handleScroll"
          class="AiChat-embed"
        >
        </AiChat>
      </div>
       <!-- 悬浮按钮升级 -->
          <transition @click="toggleCallModal" name="bounce">
            <button
                @click="toggleCallModal"
                class="call-button"
                :class="{ 'ring-pulse': showCallModal }"
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
    <ChatHistoryDrawer
      v-model:show="show"
      :application-detail="applicationDetail"
      :chat-log-data="chatLogData"
      :left-loading="left_loading"
      :currentChatId="currentChatId"
      @new-chat="newChat"
      @clickLog="clickListHandle"
      @delete-log="deleteLog"
      @refreshFieldTitle="refreshFieldTitle"
      @clear-chat="clearChat"
    />
  </div>
    <EditTitleDialog ref="EditTitleDialogRef" @refresh="refreshFieldTitle"/>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, computed } from 'vue'
import { isAppIcon } from '@/utils/common'
import { hexToRgba } from '@/utils/theme'
import useStore from '@/stores'
import { t } from '@/locales'
import ChatHistoryDrawer from './component/ChatHistoryDrawer.vue'
import chatAPI from '@/api/chat/chat'
import EditTitleDialog from '@/views/chat/component/EditTitleDialog.vue'
import AiAudio from '@/views/chat/AiAudio.vue'



// 语音通话
const showCallModal = ref(false);


const toggleCallModal = () => {
  if (!showCallModal.value) {
    showCallModal.value = true
  } else {
    closeCallModal()
  }
};
const closeCallModal = () => {
  showCallModal.value = false;
};


const { common } = useStore()

const AiChatRef = ref()
const loading = ref(false)
const left_loading = ref(false)
const chatLogData = ref<any[]>([])
const show = ref(false)
const props = defineProps<{
  application_profile: any
  applicationAvailable: boolean
}>()
const applicationDetail = computed({
  get: () => {
    return props.application_profile
  },
  set: (v) => {},
})
const paginationConfig = reactive({
  current_page: 1,
  page_size: 20,
  total: 0,
})

const currentRecordList = ref<any>([])
const currentChatId = ref('new') // 当前历史记录Id 默认为'new'

const customStyle = computed(() => {
  return {
    background: applicationDetail.value?.custom_theme?.theme_color,
    color: applicationDetail.value?.custom_theme?.header_font_color,
  }
})

const classObj = computed(() => {
  return {
    mobile: common.isMobile(),
  }
})

function clearChat() {
  chatAPI.clearChat(left_loading).then(() => {
    currentChatId.value = 'new'
    paginationConfig.current_page = 1
    paginationConfig.total = 0
    currentRecordList.value = []
    getChatLog()
  })
}

function deleteLog(row: any) {
  chatAPI.deleteChat(row.id).then(() => {
    if (currentChatId.value === row.id) {
      currentChatId.value = 'new'
      paginationConfig.current_page = 1
      paginationConfig.total = 0
      currentRecordList.value = []
    }
    chatLogData.value = chatLogData.value.filter((item) => item.id !== row.id)
  })
}
function handleScroll(event: any) {
  if (
    currentChatId.value !== 'new' &&
    event.scrollTop === 0 &&
    paginationConfig.total > currentRecordList.value.length
  ) {
    const history_height = event.dialogScrollbar.offsetHeight
    paginationConfig.current_page += 1
    getChatRecord().then(() => {
      event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height)
    })
  }
}

const newObj = {
  id: 'new',
  abstract: t('chat.createChat'),
}
function newChat() {
  paginationConfig.current_page = 1
  currentRecordList.value = []
  if (!chatLogData.value.some((v) => v.id === 'new')) {
    chatLogData.value.unshift(newObj)
  }
  currentChatId.value = 'new'
  show.value = false
}

function getChatLog(refresh?: boolean) {
  const page = {
    current_page: 1,
    page_size: 20,
  }

  chatAPI.pageChat(page.current_page, page.page_size, left_loading).then((res: any) => {
    chatLogData.value = res.data.records
    if (!refresh) {
      paginationConfig.current_page = 1
      paginationConfig.total = 0
      currentRecordList.value = []
      currentChatId.value = 'new'
    }
  })
}

function getChatRecord() {
  return chatAPI
    .pageChatRecord(
      currentChatId.value,
      paginationConfig.current_page,
      paginationConfig.page_size,
      loading,
    )
    .then((res: any) => {
      paginationConfig.total = res.data.total
      const list = res.data.records
      list.map((v: any) => {
        v['write_ed'] = true
        v['record_id'] = v.id
      })
      currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) =>
        a.create_time.localeCompare(b.create_time),
      )
      if (paginationConfig.current_page === 1) {
        nextTick(() => {
          // 将滚动条滚动到最下面
          AiChatRef.value.setScrollBottom()
        })
      }
    })
}

const clickListHandle = (item: any) => {
  if (item.id !== currentChatId.value) {
    paginationConfig.current_page = 1
    currentRecordList.value = []
    currentChatId.value = item.id
    if (currentChatId.value !== 'new') {
      getChatRecord()
    }
    show.value = false
  }
}

function refreshFieldTitle(chatId: string, abstract: string) {
  const find = chatLogData.value.find((item: any) => item.id == chatId)
  if (find) {
    find.abstract = abstract
  }
}

function refresh(id: string) {
  currentChatId.value = id
  getChatLog(true)
}
/**
 *初始化历史对话记录
 */
const init = () => {
  getChatLog()
}

onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
.chat-mobile {
  overflow: hidden;
  &__header {
    background: var(--app-header-bg-color);
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
  &__main {
    padding-top: calc(var(--app-header-height) + 16px);
    height: calc(100vh - var(--app-header-height) - 16px);
    overflow: hidden;
  }
}
</style>
<style lang="scss" scoped>
:deep(.el-overlay) {
  background-color: transparent;
}

.flex {
  background: #FFFFFF;
}

/* 悬浮按钮 */
.call-button {
  position: fixed;
  top: 75%;
  right: 5px;
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
</style>
