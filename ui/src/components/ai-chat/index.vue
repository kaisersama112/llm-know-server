<template>
  <div
    ref="aiChatRef"
    class="ai-chat"
    :class="type"
  >
    <UserForm
        v-model:api_form_data="api_form_data"
        v-model:form_data="form_data"
        :application="applicationDetails"
        :type="type"
        ref="userFormRef"
    ></UserForm>

    <el-scrollbar ref="scrollDiv" @scroll="handleScrollTop">
      <div ref="dialogScrollbar" class="ai-chat__content p-24" :style="contentStyle">
        <PrologueContent
            :type="type"
            :application="applicationDetails"
            :available="available"
            :send-message="sendMessage"
        ></PrologueContent>


        <template v-for="(item, index) in chatList" :key="index">
          <!-- 问题 -->
          <QuestionContent
              :type="type"
              :application="applicationDetails"
              :chat-record="item"
          ></QuestionContent>
          <!-- 回答 -->
          <AnswerContent
              :application="applicationDetails"
              :loading="loading"
              v-model:chat-record="chatList[index]"
              :type="type"
              :send-message="sendMessage"
              :chat-management="ChatManagement"
          ></AnswerContent>
        </template>
      </div>

    </el-scrollbar>

    <ChatInputOperate
        :app-id="appId"
        :application-details="applicationDetails"
        :is-mobile="isMobile"
        :type="type"
        :send-message="sendMessage"
        :open-chat-id="openChatId"
        :chat-management="ChatManagement"
        v-model:chat-id="chartOpenId"
        v-model:loading="loading"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        ref="composerRef"
        :style="composerStyle"
        v-if="type !== 'log'"
    >
      <template #operateBefore>
        <slot name="operateBefore"/>
      </template>
    </ChatInputOperate>
    <Control></Control>


  </div>
</template>
<script setup lang="ts">
import {ref, nextTick, computed, watch, reactive, onMounted, onBeforeUnmount} from 'vue'
import {useRoute} from 'vue-router'
import applicationApi from '@/api/application'
import logApi from '@/api/log'
import {ChatManagement, type chatType} from '@/api/type/application'
import {randomId} from '@/utils/utils'
import useStore from '@/stores'
import {isWorkFlow} from '@/utils/application'
import {debounce} from 'lodash'
import AnswerContent from '@/components/ai-chat/component/answer-content/index.vue'
import QuestionContent from '@/components/ai-chat/component/question-content/index.vue'
import ChatInputOperate from '@/components/ai-chat/component/chat-input-operate/index.vue'
import PrologueContent from '@/components/ai-chat/component/prologue-content/index.vue'
import UserForm from '@/components/ai-chat/component/user-form/index.vue'
import Control from '@/components/ai-chat/component/control/index.vue'
import {t} from '@/locales'


defineOptions({name: 'AiChat'})
const route = useRoute()
const {
  params: {accessToken, id},
  query: {mode}
} = route as any
const props = withDefaults(
    defineProps<{
      applicationDetails: any
      type?: 'log' | 'ai-chat' | 'debug-ai-chat'
      appId?: string
      record?: Array<chatType>
      available?: boolean
      chatId?: string
    }>(),
    {
      applicationDetails: () => ({}),
      available: true,
      type: 'ai-chat'
    }
)
const emit = defineEmits(['refresh', 'scroll'])
const {application, common} = useStore()
const isMobile = computed(() => {
  return common.isMobile() || mode === 'embed'
})
const aiChatRef = ref()
const scrollDiv = ref()
const dialogScrollbar = ref()
const loading = ref(false)
const inputValue = ref<string>('')
const chartOpenId = ref<string>('')
const chatList = ref<any[]>([])
const form_data = ref<any>({})
const api_form_data = ref<any>({})
const userFormRef = ref<InstanceType<typeof UserForm>>()
const composerRef = ref()
const composerHeight = ref(0)
const keyboardTargetPx = ref(0)
const keyboardOffsetPx = ref(0)
const navBarPx = ref(0)
const hasNavBar = ref(false)
const isNativeIos = ref(false)
const baseInnerHeight = ref(0)
const isIosSafari = (() => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const isIOS =
      /iP(hone|od|ad)/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari =
      /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
  return isIOS && isSafari
})()
const IME_BAR_HEIGHT = 60
const EXTRA_KEYBOARD_OFFSET = 150
let keyboardRafId = 0
let keyboardAnimationEnabled = true
let androidKeyboardDriven = false
let composerResizeObserver: ResizeObserver | null = null
let lastKeyboardShift = 0

const getComposerElement = () => {
  return (composerRef.value?.$el || composerRef.value) as HTMLElement | undefined
}
const updateComposerHeight = () => {
  const el = getComposerElement()
  if (!el) return
  composerHeight.value = el.offsetHeight
}

const keyboardShiftPx = computed(() => {
  if (isNativeIos.value || isIosSafari) {
    return 0
  }
  const base = keyboardOffsetPx.value
  // Only add the nav bar when present so gesture-only devices stay at the base shift.
  return hasNavBar.value ? base - (navBarPx.value) : base
})

const contentStyle = computed(() => {
  const offset = Math.max(0, composerHeight.value + keyboardShiftPx.value)
  return {
    paddingBottom: `${offset}px`
  }
})

const composerStyle = computed(() => {
  return {
    transform: `translateY(-${keyboardShiftPx.value}px)`
  }
})

const setKeyboardTarget = (heightPx: number) => {
  const next = Number(heightPx)
  if (!Number.isFinite(next)) return
  keyboardTargetPx.value = Math.max(0, next)
  if (!keyboardAnimationEnabled) return
  startKeyboardAnimation()
}

const startKeyboardAnimation = () => {
  if (typeof window === 'undefined') {
    keyboardOffsetPx.value = keyboardTargetPx.value
    return
  }
  if (keyboardRafId) return
  const step = () => {
    const current = keyboardOffsetPx.value
    const target = keyboardTargetPx.value
    const delta = target - current
    if (Math.abs(delta) < 1) {
      keyboardOffsetPx.value = target
      lastKeyboardShift = keyboardShiftPx.value
      keyboardRafId = 0
      return
    }
    keyboardOffsetPx.value = current + delta * 0.2
    const nextShift = keyboardShiftPx.value
    const shiftDelta = nextShift - lastKeyboardShift
    lastKeyboardShift = nextShift
    if (shiftDelta !== 0 && scrollDiv.value?.wrapRef) {
      // Keep the viewport aligned with keyboard shifts even when not at bottom.
      const nextTop = Math.max(0, scrollDiv.value.wrapRef.scrollTop + shiftDelta)
      scrollDiv.value.wrapRef.scrollTop = nextTop
    }
    keyboardRafId = requestAnimationFrame(step)
  }
  keyboardRafId = requestAnimationFrame(step)
}

const updateKeyboardOffset = () => {
  if (typeof window === 'undefined') return
  if (isNativeIos.value || isIosSafari) return
  if (androidKeyboardDriven) return
  const viewport = window.visualViewport
  let offset = 0
  if (viewport) {
    offset = Math.max(0, window.innerHeight - (viewport.height + viewport.offsetTop))
  }
  if (!offset && baseInnerHeight.value) {
    offset = Math.max(0, baseInnerHeight.value - window.innerHeight)
  }
  const adjustedOffset = Math.max(0, offset - IME_BAR_HEIGHT - EXTRA_KEYBOARD_OFFSET)
  setKeyboardTarget(adjustedOffset)
}

const handleAndroidKeyboardHeight = (heightPx: number) => {
  if (isNativeIos.value || isIosSafari) return
  androidKeyboardDriven = true
  setKeyboardTarget(heightPx)
}

type NativeInsetsPayload = {
  platform?: 'android' | 'ios'
  ime: number
  visibleIme: boolean
  navBar?: number
  hasNavBar?: boolean
  statusBar?: number
}

const handleNativeInsets = (payload: NativeInsetsPayload) => {
  if (!payload) return
  if (payload.platform === 'ios') {
    isNativeIos.value = true
    androidKeyboardDriven = false
    navBarPx.value = 0
    hasNavBar.value = false
    setKeyboardTarget(0)
    keyboardOffsetPx.value = 0
    return
  }
  if (isNativeIos.value) {
    return
  }
  isNativeIos.value = false
  navBarPx.value = payload.navBar || 0
  hasNavBar.value = !!payload.hasNavBar
  androidKeyboardDriven = true
  const imeHeight = payload.visibleIme ? payload.ime || 0 : 0
  setKeyboardTarget(imeHeight)
}
watch(
    () => props.chatId,
    (val) => {
      if (val && val !== 'new') {
        chartOpenId.value = val
      } else {
        chartOpenId.value = ''
      }
    },
    {deep: true}
)

watch(
    () => props.applicationDetails,
    () => {
      chartOpenId.value = ''
    },
    {deep: true}
)

watch(
    () => props.record,
    (value) => {
      chatList.value = value ? value : []
    },
    {
      immediate: true
    }
)

function sendMessage(val: string, other_params_data?: any, chat?: chatType) {
  if (!userFormRef.value?.checkInputParam()) {
    return
  }
  if (!loading.value && props.applicationDetails?.name) {
    handleDebounceClick(val, other_params_data, chat)
  }
}

const handleDebounceClick = debounce((val, other_params_data?: any, chat?: chatType) => {
  chatMessage(chat, val, false, other_params_data)
}, 200)

/**
 * 打开对话id
 */
const openChatId: () => Promise<string> = () => {
  const obj = props.applicationDetails
  if (props.appId) {
    return applicationApi
        .getChatOpen(props.appId)
        .then((res) => {
          chartOpenId.value = res.data
          return res.data
        })
        .catch((res) => {
          if (res.response.status === 403) {
            return application.asyncAppAuthentication(accessToken).then(() => {
              return openChatId()
            })
          }
          return Promise.reject(res)
        })
  } else {
    if (isWorkFlow(obj.type)) {
      const submitObj = {
        work_flow: obj.work_flow
      }
      return applicationApi.postWorkflowChatOpen(submitObj).then((res) => {
        chartOpenId.value = res.data
        return res.data
      })
    } else {
      return applicationApi.postChatOpen(obj).then((res) => {
        chartOpenId.value = res.data
        return res.data
      })
    }
  }
}

/**
 * 对话
 */
function getChartOpenId(chat?: any, problem?: string, re_chat?: boolean, other_params_data?: any) {
  return openChatId().then(() => {
    chatMessage(chat, problem, re_chat, other_params_data)
  })
}

/**
 * 获取一个递归函数,处理流式数据
 * @param chat    每一条对话记录
 * @param reader  流数据
 * @param stream  是否是流式数据
 */
const getWrite = (chat: any, reader: any, stream: boolean) => {
  let tempResult = ''
  /**
   *
   * @param done  是否结束
   * @param value 值
   */
  const write_stream = ({done, value}: { done: boolean; value: any }) => {
    try {
      if (done) {
        ChatManagement.close(chat.id)
        return
      }
      const decoder = new TextDecoder('utf-8')
      let str = decoder.decode(value, {stream: true})
      // 这里解释一下 start 因为数据流返回流并不是按照后端chunk返回 我们希望得到的chunk是data:{xxx}\n\n 但是它获取到的可能是 data:{ -> xxx}\n\n 总而言之就是 fetch不能保证每个chunk都说以data:开始 \n\n结束
      tempResult += str
      const split = tempResult.match(/data:.*}\n\n/g)
      if (split) {
        str = split.join('')
        tempResult = tempResult.replace(str, '')
      } else {
        return reader.read().then(write_stream)
      }
      // 这里解释一下 end
      if (str && str.startsWith('data:')) {
        if (split) {
          for (const index in split) {
            const chunk = JSON?.parse(split[index].replace('data:', ''))
            chat.chat_id = chunk.chat_id
            chat.record_id = chunk.chat_record_id
            if (!chunk.is_end) {
              ChatManagement.appendChunk(chat.id, chunk)
            }
            if (chunk.is_end) {
              // 流处理成功 返回成功回调
              return Promise.resolve()
            }
          }
        }
      }
    } catch (e) {
      return Promise.reject(e)
    }
    return reader.read().then(write_stream)
  }
  /**
   * 处理 json 响应
   * @param param0
   */
  const write_json = ({done, value}: { done: boolean; value: any }) => {
    if (done) {
      const result_block = JSON.parse(tempResult)
      if (result_block.code === 500) {
        return Promise.reject(result_block.message)
      } else {
        if (result_block.content) {
          ChatManagement.append(chat.id, result_block.content)
        }
      }
      ChatManagement.close(chat.id)
      return
    }
    if (value) {
      const decoder = new TextDecoder('utf-8')
      tempResult += decoder.decode(value)
    }
    return reader.read().then(write_json)
  }
  return stream ? write_stream : write_json
}
const errorWrite = (chat: any, message?: string) => {
  ChatManagement.addChatRecord(chat, 50, loading)
  ChatManagement.write(chat.id)
  ChatManagement.append(chat.id, message || t('chat.tip.error500Message'))
  ChatManagement.updateStatus(chat.id, 500)
  ChatManagement.close(chat.id)
}

// 保存上传文件列表

function chatMessage(chat?: any, problem?: string, re_chat?: boolean, other_params_data?: any) {
  loading.value = true
  const hideProblemText = !!other_params_data?.hide_problem_text
  if (!chat) {
    chat = reactive({
      id: randomId(),
      problem_text: problem ? problem : inputValue.value.trim(),
      answer_text: '',
      answer_text_list: [[]],
      buffer: [],
      reasoning_content: '',
      reasoning_content_buffer: [],
      write_ed: false,
      is_stop: false,
      record_id: '',
      chat_id: '',
      vote_status: '-1',
      status: undefined,
      hide_problem_text: hideProblemText,
      upload_meta: {
        image_list:
            other_params_data && other_params_data.image_list ? other_params_data.image_list : [],
        document_list:
            other_params_data && other_params_data.document_list
                ? other_params_data.document_list
                : [],
        audio_list:
            other_params_data && other_params_data.audio_list ? other_params_data.audio_list : []
      }
    })
    chatList.value.push(chat)
    ChatManagement.addChatRecord(chat, 50, loading)
    ChatManagement.write(chat.id)
    inputValue.value = ''
    nextTick(() => {
      // 将滚动条滚动到最下面
      scrollDiv.value.setScrollTop(getMaxHeight())
    })
  }
  if (chat.run_time) {
    ChatManagement.addChatRecord(chat, 50, loading)
    ChatManagement.write(chat.id)
  }
  if (!chartOpenId.value) {
    getChartOpenId(chat, problem, re_chat, other_params_data).catch(() => {
      errorWrite(chat)
    })
  } else {
    const {hide_problem_text: _hide_problem_text, ...payload} = other_params_data || {}
    const obj = {
      message: chat.problem_text,
      re_chat: re_chat || false,
      ...payload,
      form_data: {
        ...form_data.value,
        ...api_form_data.value
      }
    }
    // 对话
    applicationApi
        .postChatMessage(chartOpenId.value, obj)
        .then((response) => {
          if (response.status === 401) {
            application
                .asyncAppAuthentication(accessToken)
                .then(() => {
                  chatMessage(chat, problem)
                })
                .catch(() => {
                  errorWrite(chat)
                })
          } else if (response.status === 460) {
            return Promise.reject(t('chat.tip.errorIdentifyMessage'))
          } else if (response.status === 461) {
            return Promise.reject(t('chat.tip.errorLimitMessage'))
          } else {
            nextTick(() => {
              // 将滚动条滚动到最下面
              scrollDiv.value.setScrollTop(getMaxHeight())
            })
            const reader = response.body.getReader()
            // 处理流数据
            const write = getWrite(
                chat,
                reader,
                response.headers.get('Content-Type') !== 'application/json'
            )
            return reader.read().then(write)
          }
        })
        .then(() => {
          if (props.chatId === 'new') {
            emit('refresh', chartOpenId.value)
          }
          return (id || props.applicationDetails?.show_source) && getSourceDetail(chat)
        })
        .finally(() => {
          ChatManagement.close(chat.id)
        })
        .catch((e: any) => {
          errorWrite(chat, e + '')
        })
  }
}

/**
 * 获取对话详情
 * @param row
 */
function getSourceDetail(row: any) {
  logApi.getRecordDetail(id || props.appId, row.chat_id, row.record_id, loading).then((res) => {
    const exclude_keys = ['answer_text', 'id', 'answer_text_list']
    Object.keys(res.data).forEach((key) => {
      if (!exclude_keys.includes(key)) {
        row[key] = res.data[key]
      }
    })
  })
  return true
}

/**
 * 滚动条距离最上面的高度
 */
const scrollTop = ref(0)

const scorll = ref(true)

const getMaxHeight = () => {
  return dialogScrollbar.value!.scrollHeight
}
/**
 * 滚动滚动条到最上面
 * @param $event
 */
const handleScrollTop = ($event: any) => {
  scrollTop.value = $event.scrollTop
  if (
      dialogScrollbar.value.scrollHeight - (scrollTop.value + scrollDiv.value.wrapRef.offsetHeight) <=
      30
  ) {
    scorll.value = true
  } else {
    scorll.value = false
  }
  emit('scroll', {...$event, dialogScrollbar: dialogScrollbar.value, scrollDiv: scrollDiv.value})
}
/**
 * 处理跟随滚动条
 */
const handleScroll = () => {
  if (props.type !== 'log' && scrollDiv.value) {
    // 内部高度小于外部高度 就需要出滚动条
    if (scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value.scrollHeight) {
      // 如果当前滚动条距离最下面的距离在 规定距离 滚动条就跟随
      if (scorll.value) {
        scrollDiv.value.setScrollTop(getMaxHeight())
      }
    }
  }
}

onMounted(() => {
  window.sendMessage = sendMessage
  if (typeof window !== 'undefined') {
    baseInnerHeight.value = window.innerHeight
    ;(window as any).__onAndroidKeyboardHeight = handleAndroidKeyboardHeight
    ;(window as any).__onNativeInsets = handleNativeInsets
  }
  nextTick(() => {
    updateComposerHeight()
    if (typeof ResizeObserver !== 'undefined') {
      const el = getComposerElement()
      if (el) {
        composerResizeObserver = new ResizeObserver(() => {
          updateComposerHeight()
        })
        composerResizeObserver.observe(el)
      }
    }
  })
  updateKeyboardOffset()
  if (typeof window !== 'undefined') {
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateKeyboardOffset)
      window.visualViewport.addEventListener('scroll', updateKeyboardOffset)
    }
    window.addEventListener('resize', updateKeyboardOffset)
  }
})

onBeforeUnmount(() => {
  window.sendMessage = null
  if (typeof window !== 'undefined') {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', updateKeyboardOffset)
      window.visualViewport.removeEventListener('scroll', updateKeyboardOffset)
    }
    window.removeEventListener('resize', updateKeyboardOffset)
    if (keyboardRafId) {
      cancelAnimationFrame(keyboardRafId)
      keyboardRafId = 0
    }
    const win = window as any
    if (win.__onAndroidKeyboardHeight === handleAndroidKeyboardHeight) {
      delete win.__onAndroidKeyboardHeight
    }
    if (win.__onNativeInsets === handleNativeInsets) {
      delete win.__onNativeInsets
    }
  }
  if (composerResizeObserver) {
    composerResizeObserver.disconnect()
    composerResizeObserver = null
  }
})

function setScrollBottom() {
  // 将滚动条滚动到最下面
  scrollDiv.value.setScrollTop(getMaxHeight())
}

const handleInputFocus = () => {
  if (isNativeIos.value || isIosSafari) {
    nextTick(() => {
      if (scrollDiv.value) {
        setScrollBottom()
      }
    })
    return
  }
  keyboardAnimationEnabled = false
  if (keyboardRafId) {
    cancelAnimationFrame(keyboardRafId)
    keyboardRafId = 0
  }
  nextTick(() => {
    if (scrollDiv.value) {
      setScrollBottom()
    }
    lastKeyboardShift = keyboardShiftPx.value
    keyboardAnimationEnabled = true
    startKeyboardAnimation()
  })
}
const handleInputBlur = () => {
  if (isNativeIos.value || isIosSafari) {
    return
  }
}

watch(
    chatList,
    () => {
      handleScroll()
    },
    {deep: true, immediate: true}
)

defineExpose({
  setScrollBottom
})
</script>
<style lang="scss" scoped>
@import './index.scss';

.ai-chat__content {
  background: #FFFFFF;
}

</style>
