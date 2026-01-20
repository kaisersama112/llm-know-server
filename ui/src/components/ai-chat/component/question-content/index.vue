<template>
  <!-- 问题内容 -->
  <div class="question-content item-content mb-16 lighter">
    <div
      class="content mr-12 p-12-16 border-r-8"
      :class="document_list.length >= 2 ? 'media_2' : `media_${document_list.length}`"
    >
      <div class="text break-all pre-wrap">
        <div class="mb-8" v-if="document_list.length">
          <el-space wrap class="w-full media-file-width">
            <template v-for="(item, index) in document_list" :key="index">
              <el-card shadow="never" style="--el-card-padding: 8px" class="download-file cursor">
                <div class="download-button flex align-center" @click="downloadFile(item)">
                  <el-icon class="mr-4">
                    <Download />
                  </el-icon>
                  {{ $t('chat.download') }}
                </div>
                <div class="show flex align-center">
                  <img :src="getImgUrl(item && item?.name)" alt="" width="24" />
                  <div class="ml-4 ellipsis-1" :title="item && item?.name">
                    {{ item && item?.name }}
                  </div>
                </div>
              </el-card>
            </template>
          </el-space>
        </div>
        <div class="mb-8" v-if="image_list.length">
          <el-space wrap>
            <template v-for="(item, index) in image_list" :key="index">
              <div class="file cursor border-r-4" v-if="item.url">
                <el-image
                  :src="item.url"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="getAttrsArray(image_list, 'url')"
                  :initial-index="index"
                  alt=""
                  fit="cover"
                  style="width: 170px; height: 170px; display: block"
                  class="border-r-4"
                />
              </div>
            </template>
          </el-space>
        </div>
        <div class="mb-8" v-if="audio_list.length">
          <el-space wrap>
            <template v-for="(item, index) in audio_list" :key="index">
              <div
                v-if="getAudioUrl(item)"
                class="voice-message border-r-4"
                :class="{ playing: playingIndex === index }"
                :style="{ width: getVoiceWidth(item, index) }"
                role="button"
                tabindex="0"
                @click="toggleVoice(index)"
                @keydown.enter.prevent="toggleVoice(index)"
                @keydown.space.prevent="toggleVoice(index)"
              >
                <div class="voice-icon">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </div>
                <div class="voice-duration">{{ formatDuration(getAudioDuration(item, index)) }}</div>
                <audio
                  :ref="(el) => setAudioRef(el, index)"
                  :src="getAudioUrl(item)"
                  class="voice-audio"
                  preload="metadata"
                  playsinline
                  @loadedmetadata="handleLoadedMetadata(index, $event)"
                  @ended="handleAudioEnded(index)"
                  @pause="handleAudioPause(index)"
                />
              </div>
            </template>
          </el-space>
        </div>
        <span v-if="showProblemText"> {{ problemText }}</span>
      </div>
    </div>
    <div class="avatar">
      <el-image
        v-if="application.user_avatar"
        :src="application.user_avatar"
        alt=""
        fit="cover"
        style="width: 32px; height: 32px; display: block"
      />
      <AppAvatar v-else>
        <img src="@/assets/user-icon.svg" style="width: 50%" alt="" />
      </AppAvatar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type chatType } from '@/api/type/application'
import { getImgUrl, getAttrsArray, downloadByURL } from '@/utils/utils'
import { onMounted, computed, ref, onBeforeUnmount, type ComponentPublicInstance } from 'vue'

const props = defineProps<{
  application: any
  chatRecord: chatType
  type: 'log' | 'ai-chat' | 'debug-ai-chat'
}>()
const document_list = computed(() => {
  if (props.chatRecord?.upload_meta) {
    return props.chatRecord.upload_meta?.document_list || []
  }
  const startNode = props.chatRecord.execution_details?.find(
    (detail) => detail.type === 'start-node'
  )
  return startNode?.document_list || []
})
const image_list = computed(() => {
  if (props.chatRecord?.upload_meta) {
    return props.chatRecord.upload_meta?.image_list || []
  }
  const startNode = props.chatRecord.execution_details?.find(
    (detail) => detail.type === 'start-node'
  )
  return startNode?.image_list || []
})
const audio_list = computed(() => {
  if (props.chatRecord?.upload_meta) {
    return props.chatRecord.upload_meta?.audio_list || []
  }
  const startNode = props.chatRecord.execution_details?.find(
    (detail) => detail.type === 'start-node'
  )
  return startNode?.audio_list || []
})
const problemText = computed(() => {
  const value = props.chatRecord?.problem_text ?? ''
  return value.toString()
})
const showProblemText = computed(
  () => problemText.value.trim().length > 0 && !props.chatRecord.hide_problem_text
)
const audioRefs = ref<Array<HTMLAudioElement | null>>([])
const audioDurations = ref<Record<number, number>>({})
const playingIndex = ref<number | null>(null)

const getAudioUrl = (item: any) => {
  if (typeof item === 'string') {
    return item
  }
  return item?.url || ''
}

const setAudioRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (!el) return
  const resolved = (el as ComponentPublicInstance).$el
    ? ((el as ComponentPublicInstance).$el as Element)
    : el
  if (resolved instanceof HTMLAudioElement) {
    audioRefs.value[index] = resolved
  }
}

const handleLoadedMetadata = (index: number, event: Event) => {
  const audio = event.target as HTMLAudioElement
  if (Number.isFinite(audio.duration)) {
    audioDurations.value[index] = audio.duration
  }
}

const getAudioDuration = (item: any, index: number) => {
  const itemDuration = typeof item?.duration === 'number' ? item.duration : 0
  if (itemDuration > 0) {
    return itemDuration > 1000 ? Math.round(itemDuration / 1000) : Math.round(itemDuration)
  }
  const metaDuration = audioDurations.value[index]
  return metaDuration ? Math.round(metaDuration) : 0
}

const getVoiceWidth = (item: any, index: number) => {
  const duration = getAudioDuration(item, index)
  const minWidth = 120
  const maxWidth = 240
  if (!duration) {
    return `${minWidth}px`
  }
  const width = Math.min(maxWidth, minWidth + duration * 4)
  return `${width}px`
}

const formatDuration = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
  const mins = Math.floor(safeSeconds / 60)
  const secs = Math.floor(safeSeconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const stopOtherAudio = (index: number) => {
  if (playingIndex.value === null || playingIndex.value === index) return
  const previous = audioRefs.value[playingIndex.value]
  if (previous) {
    previous.pause()
    previous.currentTime = 0
  }
}

const toggleVoice = (index: number) => {
  const audio = audioRefs.value[index]
  if (!audio) return
  if (playingIndex.value === index && !audio.paused) {
    audio.pause()
    return
  }
  stopOtherAudio(index)
  if (audio.ended) {
    audio.currentTime = 0
  }
  audio.play()
  playingIndex.value = index
}

const handleAudioEnded = (index: number) => {
  const audio = audioRefs.value[index]
  if (audio) {
    audio.currentTime = 0
  }
  if (playingIndex.value === index) {
    playingIndex.value = null
  }
}

const handleAudioPause = (index: number) => {
  if (playingIndex.value === index) {
    playingIndex.value = null
  }
}

function downloadFile(item: any) {
  downloadByURL(item.url, item.name)
}

onMounted(() => {})

onBeforeUnmount(() => {
  audioRefs.value.forEach((audio) => {
    if (audio) {
      audio.pause()
    }
  })
})
</script>
<style lang="scss" scoped>
.question-content {
  display: flex;
  justify-content: flex-end;
  padding-left: var(--padding-left);
  width: 100%;
  box-sizing: border-box;

  .content {
    background: #d6e2ff;
    padding-left: 16px;
    padding-right: 16px;

  }

  .download-file {
    height: 43px;

    &:hover {
      color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);

      .download-button {
        display: block;
        text-align: center;
        line-height: 26px;
      }

      .show {
        display: none;
      }
    }

    .download-button {
      display: none;
    }
  }
  .media-file-width {
    :deep(.el-space__item) {
      min-width: 40% !important;
      flex-grow: 1;
    }
  }
  .media_2 {
    flex: 1;
  }
  .media_0 {
    flex: inherit;
  }
  .media_1 {
    width: 50%;
  }

  .voice-message {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.7);
    color: #2b3a67;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .voice-message:hover {
    background: #ffffff;
  }

  .voice-message.playing {
    border-color: #a9bfff;
    background: #ffffff;
  }

  .voice-icon {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 16px;

    .bar {
      width: 3px;
      height: 6px;
      background: #5a7bff;
      border-radius: 2px;
      transform-origin: bottom;
      opacity: 0.85;
    }

    .bar:nth-child(2) {
      height: 9px;
      animation-delay: 0.1s;
    }

    .bar:nth-child(3) {
      height: 13px;
      animation-delay: 0.2s;
    }

    .bar:nth-child(4) {
      height: 8px;
      animation-delay: 0.3s;
    }
  }

  .voice-message.playing .bar {
    animation: voice-wave 0.9s infinite ease-in-out;
  }

  .voice-duration {
    font-size: 12px;
    color: #2b3a67;
    min-width: 44px;
    text-align: right;
  }

  .voice-audio {
    display: none;
  }
}

@keyframes voice-wave {
  0%,
  100% {
    transform: scaleY(0.7);
    opacity: 0.6;
  }
  50% {
    transform: scaleY(1.4);
    opacity: 1;
  }
}
@media only screen and (max-width: 768px) {
  .question-content {
    .media-file-width {
      :deep(.el-space__item) {
        min-width: 100% !important;
      }
    }
    .media_1 {
      width: 100%;
    }
  }
}
.debug-ai-chat {
  .question-content {
    .media-file-width {
      :deep(.el-space__item) {
        min-width: 100% !important;
      }
    }
    .media_1 {
      width: 100%;
    }
  }
}
</style>
