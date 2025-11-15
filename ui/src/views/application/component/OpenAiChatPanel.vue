<template>
  <div class="openai-chat-panel">
    <div class="messages" ref="messagesRef">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['msg', message.role, message.kind ? `msg-${message.kind}` : '']"
      >
        <strong>{{ message.role === 'user' ? 'You' : 'AI' }}:</strong>
        <template v-if="message.kind === 'templates' && message.templates">
          <div class="template-card">
            <h4>{{ message.templates.title }}</h4>
            <ul v-if="message.templates.items.length" class="template-list">
              <li v-for="(item, templateIndex) in message.templates.items" :key="templateIndex">
                <button
                  type="button"
                  class="template-link"
                  :disabled="templateImporting"
                  @click="handleTemplateClick(item)"
                >
                  <span>{{ item.label }}</span>
                </button>
              </li>
            </ul>
            <p v-else class="template-empty">{{ message.templates.emptyText }}</p>
          </div>
        </template>
        <template v-else-if="message.kind === 'dataset'">
          <div class="dataset-card">
            <h4>{{ t('views.application.aiCreate.datasetForm.title') }}</h4>
            <p class="dataset-tip">
              {{ t('views.application.aiCreate.datasetForm.tip') }}
            </p>
            <form class="dataset-form" @submit.prevent="handleDatasetFormSubmit">
              <label>
                {{ t('views.application.aiCreate.datasetForm.nameLabel') }}
                <input
                  v-model="datasetForm.name"
                  type="text"
                  :placeholder="t('views.application.aiCreate.datasetForm.namePlaceholder')"
                />
              </label>
              <label>
                {{ t('views.application.aiCreate.datasetForm.descLabel') }}
                <textarea
                  v-model="datasetForm.desc"
                  rows="3"
                  :placeholder="t('views.application.aiCreate.datasetForm.descPlaceholder')"
                ></textarea>
              </label>
              <label>
                {{ t('views.application.aiCreate.datasetForm.typeLabel') }}
                <select v-model="datasetForm.type">
                  <option
                    v-for="option in datasetTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </label>
              <label>
                {{ t('views.application.aiCreate.datasetForm.embeddingLabel') }}
                <select
                  v-model="datasetForm.embedding_mode_id"
                  :disabled="datasetEmbeddingLoading"
                >
                  <option value="" disabled>
                    {{ t('views.application.aiCreate.datasetForm.embeddingPlaceholder') }}
                  </option>
                  <option
                    v-for="option in datasetEmbeddingOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </label>
              <p v-if="datasetFormError" class="dataset-error">{{ datasetFormError }}</p>
              <button type="submit" :disabled="datasetFormSubmitting">
                {{ datasetFormSubmitting ? '...' : t('views.application.aiCreate.datasetForm.submit') }}
              </button>
            </form>
          </div>
        </template>
        <template v-else-if="message.kind === 'dataset-upload'">
          <div class="dataset-upload-card">
            <h4>{{ t('views.application.aiCreate.datasetUpload.title') }}</h4>
            <p class="dataset-upload-target">{{ datasetUploadState.datasetName }}</p>
            <p class="dataset-tip">
              {{ t('views.application.aiCreate.datasetUpload.tip', { name: datasetUploadState.datasetName || '-' }) }}
            </p>
            <label class="dataset-upload-drop">
              <span>{{ t('views.application.aiCreate.datasetUpload.placeholder') }}</span>
              <input
                ref="datasetUploadInputRef"
                type="file"
                multiple
                @change="handleDatasetUploadFileChange"
              />
            </label>
            <p class="dataset-limit">
              {{ t('views.application.aiCreate.datasetUpload.limit') }}
            </p>
            <ul v-if="datasetUploadState.files.length" class="dataset-file-list">
              <li v-for="(file, fileIndex) in datasetUploadState.files" :key="`${file.name}-${fileIndex}`">
                {{ file.name }}
              </li>
            </ul>
            <p v-if="datasetUploadState.error" class="dataset-error">
              {{ datasetUploadState.error }}
            </p>
            <button type="button" @click="handleDatasetUploadSubmit" :disabled="datasetUploadState.loading">
              {{ datasetUploadState.loading ? '...' : t('views.application.aiCreate.datasetUpload.submit') }}
            </button>
          </div>
        </template>
        <template v-else-if="message.kind === 'dataset-url'">
          <div class="dataset-url-card">
            <h4>{{ t('views.application.aiCreate.datasetUpload.title') }}</h4>
            <p class="dataset-tip">
              {{ t('views.application.aiCreate.datasetUpload.tip', { name: datasetUrlState.datasetName || '-' }) }}
            </p>
            <label class="dataset-url-input">
              <span>URL</span>
              <input
                type="text"
                v-model="datasetUrlState.url"
                placeholder="https://example.com/file.pdf"
                :disabled="datasetUrlState.loading"
              />
            </label>
            <p class="dataset-limit">PDF, Word, PPT, TXT, Markdown</p>
            <p v-if="datasetUrlState.error" class="dataset-error">{{ datasetUrlState.error }}</p>
            <button type="button" @click="handleDatasetUrlSubmit" :disabled="datasetUrlState.loading">
              {{ datasetUrlState.loading ? '...' : t('views.application.aiCreate.datasetUpload.submit') }}
            </button>
          </div>
        </template>
        <template v-else-if="message.kind === 'application'">
          <div class="application-card">
            <div class="application-card__header">
              <h4>{{ t('views.application.aiCreate.applicationCard.title') }}</h4>
              <button
                type="button"
                class="text-button"
                @click="loadApplicationList"
                :disabled="applicationState.listLoading"
              >
                {{ applicationState.listLoading ? '...' : t('views.application.aiCreate.applicationCard.refresh') }}
              </button>
            </div>
            <p class="application-card__tip">
              {{ t('views.application.aiCreate.applicationCard.tip') }}
            </p>
            <p v-if="applicationState.error" class="dataset-error">
              {{ applicationState.error }}
            </p>
            <ul class="application-list" v-if="applicationState.items.length">
              <li v-for="app in applicationState.items" :key="app.id">
                <button
                  type="button"
                  class="application-link"
                  :class="{ active: app.id === applicationState.selectedId }"
                  @click="handleApplicationSelect(app.id)"
                  :disabled="applicationState.detailLoading && app.id === applicationState.selectedId"
                >
                  <span>{{ app.name }}</span>
                  <small v-if="app.desc">{{ app.desc }}</small>
                </button>
              </li>
            </ul>
            <p v-else-if="!applicationState.listLoading" class="application-empty">
              {{ t('views.application.aiCreate.applicationCard.empty') }}
            </p>
            <div
              v-if="applicationState.selectedId && applicationState.formVisible"
              class="application-form"
              :class="{ loading: applicationState.detailLoading }"
            >
              <label>
                <span class="field-label">
                  <span class="required-label">*</span>
                  {{ t('views.application.aiCreate.applicationCard.fields.baseName') }}
                </span>
                <input
                  type="text"
                  v-model="applicationState.baseName"
                  :placeholder="t('views.application.aiCreate.applicationCard.fields.baseName')"
                />
              </label>
              <label>
                <span class="field-label">
                  {{ t('views.application.aiCreate.applicationCard.fields.basePrologue') }}
                </span>
                <textarea
                  rows="3"
                  v-model="applicationState.basePrologue"
                  :placeholder="t('views.application.aiCreate.applicationCard.fields.basePrologue')"
                ></textarea>
              </label>
              <label>
                <span class="field-label">
                  <span class="required-label">*</span>
                  {{ t('views.application.aiCreate.applicationCard.fields.recipient') }}
                </span>
                <input
                  type="text"
                  v-model="applicationState.recipient"
                  :placeholder="t('views.application.aiCreate.applicationCard.fields.recipient')"
                />
                <p class="field-hint">
                  {{ t('views.application.aiCreate.applicationCard.recipientHint') }}
                </p>
              </label>
              <div class="application-actions">
                <button
                  type="button"
                  class="application-primary"
                  @click="handleApplicationSave"
                  :disabled="applicationState.submitting || applicationState.publishing"
                >
                  {{
                    applicationState.submitting || applicationState.publishing
                      ? '...'
                      : t('views.application.aiCreate.applicationCard.submit')
                  }}
                </button>
              </div>
              <p v-if="applicationState.statusMessage" class="application-status success">
                {{ applicationState.statusMessage }}
              </p>
              <p v-if="applicationState.publishMessage" class="application-status">
                {{ applicationState.publishMessage }}
              </p>
            </div>
          </div>
        </template>
        <template v-else-if="message.kind === 'application-confirm' && message.confirm">
          <div class="application-confirm-card">
            <h4>{{ t('views.application.aiCreate.baseNodeTitle') }}</h4>
            <p class="application-confirm-tip">
              {{
                t('views.application.aiCreate.baseNodeSetMessage', {
                  name: message.confirm.name || 'APP'
                })
              }}
            </p>
            <ul class="application-confirm-list">
              <li>
                <span class="label">{{ t('views.application.aiCreate.baseNodeNameLabel') }}</span>
                <span class="value">{{ message.confirm.name || '-' }}</span>
              </li>
              <li>
                <span class="label">{{ t('views.application.aiCreate.baseNodePrologueLabel') }}</span>
                <span class="value">{{ message.confirm.prologue || '-' }}</span>
              </li>
              <li>
                <span class="label">{{ t('views.application.aiCreate.baseNodeEmailLabel') }}</span>
                <span class="value">{{ message.confirm.email || '-' }}</span>
              </li>
            </ul>
            <div class="application-confirm-actions">
              <button
                type="button"
                class="application-primary"
                :disabled="applicationState.publishing"
                @click="confirmApplicationCreation"
              >
                {{ applicationState.publishing ? '...' : t('common.confirm') }}
              </button>
              <button type="button" class="application-secondary" @click="editApplicationInfo">
                {{ t('common.modify') }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <span v-html="escapeHtml(message.content)"></span>
        </template>
      </div>
      <div v-if="loading" class="msg assistant msg-loading-indicator">
        <strong>AI:</strong>
        <div class="typing-indicator" role="status" aria-live="polite">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-hint">{{ t('views.application.aiCreate.chatLoading') }}</span>
      </div>
    </div>
    <form class="composer" @submit.prevent="send">
      <textarea
        v-model="input"
        :placeholder="t('views.application.aiCreate.chatPlaceholder')"
        rows="3"
        :disabled="loading"
        @keydown.enter.exact.prevent="handleComposerEnter"
      />
      <div class="row">
        <label>
          {{ t('views.application.aiCreate.chatEffortLabel') }}:
          <select v-model="effort" :disabled="loading">
            <option value="low">
              {{ t('views.application.aiCreate.chatEffortOptions.low') }}
            </option>
            <option value="medium">
              {{ t('views.application.aiCreate.chatEffortOptions.medium') }}
            </option>
            <option value="high">
              {{ t('views.application.aiCreate.chatEffortOptions.high') }}
            </option>
          </select>
        </label>
        <button :disabled="!input.trim() || loading">
          {{ loading ? '...' : t('views.application.aiCreate.chatSend') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, reactive, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import applicationApi from '@/api/application'
import useStore from '@/stores'

type ChatRole = 'user' | 'assistant'

type ChatMessageKind =
  | 'text'
  | 'templates'
  | 'dataset'
  | 'dataset-upload'
  | 'dataset-url'
  | 'application'
  | 'application-confirm'

interface TemplateListItem {
  label: string
  path?: string
  size?: number
}

interface TemplateListContent {
  title: string
  items: TemplateListItem[]
  emptyText: string
}

interface ApplicationConfirmPayload {
  id: string
  name: string
  prologue: string
  email: string
}

interface ChatMessage {
  role: ChatRole
  content: string
  kind?: ChatMessageKind
  templates?: TemplateListContent
  confirm?: ApplicationConfirmPayload
}

const emit = defineEmits(['import-success'])

const API_URL = import.meta.env.VITE_OPENAI_CHAT_URL || '/api/OpenAIchat'
const TEMPLATE_LIST_URL = import.meta.env.VITE_TEMPLATE_LIST_URL || '/list_files'
const TEMPLATE_DOWNLOAD_BASE =
  (import.meta.env.VITE_TEMPLATE_DOWNLOAD_BASE as string | undefined) || '/'
const DATASET_API_BASE =
  (import.meta.env.VITE_DATASET_API_BASE as string | undefined) || 'http://localhost:8080/api'
const APPLICATION_API_BASE =
  (import.meta.env.VITE_APPLICATION_API_BASE as string | undefined) || 'http://localhost:8080/api'
const EMAIL_NODE_ID = 'f72a2a79-a269-4887-8dd1-62abf49443b7'
const CREATE_AI_PROMPT_CN = '我们聊了一会儿了，请问您想创建AI吗？'
const { t } = useI18n()

const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: t('views.application.aiCreate.chatWelcome'), kind: 'text' }
])
const input = ref('')
const effort = ref<'low' | 'medium' | 'high'>('medium')
const loading = ref(false)
const messagesRef = ref<HTMLDivElement>()
const controller = ref<AbortController | null>(null)
const decoder = new TextDecoder('utf-8')
const templateImporting = ref(false)
const { user } = useStore()
const datasetFormVisible = ref(false)
const datasetFormMessageIndex = ref<number | null>(null)
const datasetFormError = ref('')
const datasetFormSubmitting = ref(false)
const datasetEmbeddingOptions = ref<Array<{ label: string; value: string }>>([])
const datasetEmbeddingLoading = ref(false)
const datasetTypeOptions = [
  { label: t('views.application.aiCreate.datasetForm.typeGeneral'), value: '0' },
  { label: t('views.application.aiCreate.datasetForm.typeWeb'), value: '1' }
]
const datasetForm = reactive({
  name: '',
  desc: '',
  type: '0',
  embedding_mode_id: ''
})
const datasetUploadMessageIndex = ref<number | null>(null)
const datasetUploadInputRef = ref<HTMLInputElement | null>(null)
const datasetUploadState = reactive({
  datasetId: '',
  datasetName: '',
  files: [] as File[],
  loading: false,
  error: ''
})
const datasetUrlMessageIndex = ref<number | null>(null)
const datasetUrlState = reactive({
  datasetId: '',
  datasetName: '',
  url: '',
  loading: false,
  error: ''
})
const latestDatasetId = ref('')
const applicationMessageIndex = ref<number | null>(null)
const applicationConfirmMessageIndex = ref<number | null>(null)
const applicationState = reactive({
  visible: false,
  listLoading: false,
  detailLoading: false,
  error: '',
  items: [] as Array<{ id: string; name: string; desc?: string }>,
  selectedId: '',
  detail: null as any,
  baseName: '',
  basePrologue: '',
  recipient: '',
  submitting: false,
  publishing: false,
  statusMessage: '',
  publishMessage: '',
  formVisible: true
})
const getAuthToken = (): string => {
  const token = user?.getToken ? user.getToken() : localStorage.getItem('token');
  return token ? String(token) : '';
};


const resetDatasetForm = () => {
  datasetForm.name = ''
  datasetForm.desc = ''
  datasetForm.type = '0'
  datasetForm.embedding_mode_id = ''
  datasetFormError.value = ''
}

const loadEmbeddingModels = async () => {
  datasetEmbeddingLoading.value = true
  datasetFormError.value = ''
  const token = getAuthToken()
  if (!token) {
    datasetFormError.value = t('views.application.aiCreate.chatAccessTokenMissing')
    datasetEmbeddingLoading.value = false
    return
  }
  try {
    const resp = await fetch('/api/model?model_type=EMBEDDING', {
      headers: {
        Authorization: token
      }
    })
    const data = await resp.json().catch(() => [])
    if (!resp.ok) {
      throw new Error(data?.message || resp.statusText)
    }
    const list = Array.isArray(data) ? data : data?.data || []
    const mapped = list
      .map((item: any) => ({
        label: item?.model_name || item?.name || item?.id,
        value: item?.id || item?.model_id || item?.value || item?.model_name || item?.name
      }))
      .filter((item: { value: any }) => Boolean(item.value))
    datasetEmbeddingOptions.value = mapped
  } catch (error: any) {
    datasetFormError.value =
      error?.message || t('views.application.aiCreate.datasetForm.modelLoadFailed')
  } finally {
    datasetEmbeddingLoading.value = false
  }
}

const showDatasetFormMessage = () => {
  if (datasetFormVisible.value) {
    nextTick(() => scrollToBottom())
    return
  }
  resetDatasetForm()
  datasetFormVisible.value = true
  const idx =
    messages.value.push({
      role: 'assistant',
      content: '',
      kind: 'dataset'
    }) - 1
  datasetFormMessageIndex.value = idx
  loadEmbeddingModels()
  nextTick(() => scrollToBottom())
}

const handleDatasetFormSubmit = async () => {
  datasetFormError.value = ''
  const name = datasetForm.name.trim()
  const desc = datasetForm.desc.trim()
  if (!name) {
    datasetFormError.value = t('views.application.aiCreate.datasetForm.nameRequired')
    return
  }
  if (!desc) {
    datasetFormError.value = t('views.application.aiCreate.datasetForm.descRequired')
    return
  }
  if (!datasetForm.embedding_mode_id) {
    datasetFormError.value = t('views.application.aiCreate.datasetForm.embeddingRequired')
    return
  }
  const token = getAuthToken()
  if (!token) {
    datasetFormError.value = t('views.application.aiCreate.chatAccessTokenMissing')
    return
  }
  datasetFormSubmitting.value = true
  try {
    const payload = {
      name,
      desc,
      type: datasetForm.type,
      embedding_mode_id: datasetForm.embedding_mode_id
    }
    const resp = await fetch('/api/dataset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(payload)
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      throw new Error(body?.message || resp.statusText)
    }
    const datasetName = body?.data?.name || payload.name
    const datasetId = body?.data?.id || ''
    const datasetType = datasetForm.type
    datasetFormVisible.value = false
    resetDatasetForm()
    const successContent = t('views.application.aiCreate.datasetForm.successMessage', {
      name: datasetName
    })
    if (
      datasetFormMessageIndex.value !== null &&
      messages.value[datasetFormMessageIndex.value]
    ) {
      messages.value[datasetFormMessageIndex.value] = {
        role: 'assistant',
        content: successContent,
        kind: 'text'
      }
    } else {
      messages.value.push({ role: 'assistant', content: successContent, kind: 'text' })
    }
    datasetFormMessageIndex.value = null
    messages.value.push({
      role: 'assistant',
      content: t('views.application.aiCreate.datasetUpload.startMessage', { name: datasetName }),
      kind: 'text'
    })
    if (datasetId) {
      if (datasetType === '1') {
        showDatasetUrlCard(datasetId, datasetName)
      } else {
        showDatasetUploadCard(datasetId, datasetName)
      }
    }
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    datasetFormError.value =
      error?.message || t('views.application.aiCreate.datasetForm.failed')
  } finally {
    datasetFormSubmitting.value = false
  }
}

const showDatasetUploadCard = (datasetId: string, datasetName: string) => {
  if (!datasetId) {
    return
  }
  latestDatasetId.value = datasetId
  datasetUploadState.datasetId = datasetId
  datasetUploadState.datasetName = datasetName
  datasetUploadState.files = []
  datasetUploadState.error = ''
  datasetUploadState.loading = false
  if (datasetUploadInputRef.value) {
    datasetUploadInputRef.value.value = ''
  }
  let idx = datasetUploadMessageIndex.value
  if (idx !== null && messages.value[idx]) {
    messages.value[idx] = {
      role: 'assistant',
      content: '',
      kind: 'dataset-upload'
    }
  } else {
    idx =
      messages.value.push({
        role: 'assistant',
        content: '',
        kind: 'dataset-upload'
      }) - 1
  }
  datasetUploadMessageIndex.value = idx
  nextTick(() => scrollToBottom())
}

const showDatasetUrlCard = (datasetId: string, datasetName: string) => {
  if (!datasetId) {
    return
  }
  latestDatasetId.value = datasetId
  datasetUrlState.datasetId = datasetId
  datasetUrlState.datasetName = datasetName
  datasetUrlState.url = ''
  datasetUrlState.error = ''
  datasetUrlState.loading = false
  let idx = datasetUrlMessageIndex.value
  if (idx !== null && messages.value[idx]) {
    messages.value[idx] = {
      role: 'assistant',
      content: '',
      kind: 'dataset-url'
    }
  } else {
    idx =
      messages.value.push({
        role: 'assistant',
        content: '',
        kind: 'dataset-url'
      }) - 1
  }
  datasetUrlMessageIndex.value = idx
  nextTick(() => scrollToBottom())
}

const handleDatasetUploadFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  datasetUploadState.files = target?.files ? Array.from(target.files) : []
  datasetUploadState.error = ''
}

const extractDocumentPayload = (payload: any) => {
  if (Array.isArray(payload)) {
    return payload
  }
  if (Array.isArray(payload?.data)) {
    return payload.data
  }
  if (Array.isArray(payload?.documents)) {
    return payload.documents
  }
  return []
}

const ingestDocumentsFromFiles = async (
  files: File[],
  datasetId: string,
  state: { loading: boolean; error: string },
  options?: { skipLoading?: boolean }
) => {
  const token = getAuthToken()
  if (!token) {
    state.error = t('views.application.aiCreate.chatAccessTokenMissing')
    return false
  }
  state.error = ''
  if (!options?.skipLoading) {
    state.loading = true
  }
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })
    formData.append('dataset_id', datasetId)
    const splitResp = await fetch(datasetApiUrl('dataset/document/split'), {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: formData
    })
    const splitBody = await splitResp.json().catch(() => ({}))
    if (!splitResp.ok) {
      throw new Error(splitBody?.message || splitResp.statusText)
    }
    const documentsPayload = extractDocumentPayload(splitBody)
    if (!Array.isArray(documentsPayload) || documentsPayload.length === 0) {
      throw new Error(t('views.application.aiCreate.datasetUpload.empty'))
    }
    const batchResp = await fetch(
      datasetApiUrl(`dataset/${datasetId}/document/_bach`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(documentsPayload)
      }
    )
    const batchBody = await batchResp.json().catch(() => ({}))
    if (!batchResp.ok) {
      throw new Error(batchBody?.message || batchResp.statusText)
    }
    return true
  } catch (error: any) {
    state.error = error?.message || t('views.application.aiCreate.datasetUpload.failed')
    return false
  } finally {
    if (!options?.skipLoading) {
      state.loading = false
    }
  }
}

const notifyDatasetIngestSuccess = (
  datasetName: string,
  messageIndexRef: Ref<number | null>
) => {
  const successText = t('views.application.aiCreate.datasetUpload.success', { name: datasetName })
  if (messageIndexRef.value !== null && messages.value[messageIndexRef.value]) {
    messages.value[messageIndexRef.value] = {
      role: 'assistant',
      content: successText,
      kind: 'text'
    }
    messageIndexRef.value = null
  } else {
    messages.value.push({ role: 'assistant', content: successText, kind: 'text' })
  }
  messages.value.push({
    role: 'assistant',
    content: t('views.application.aiCreate.datasetUpload.successMessage', { name: datasetName }),
    kind: 'text'
  })
  showApplicationSelectionCard()
}

const handleDatasetUploadSubmit = async () => {
  datasetUploadState.error = ''
  if (!datasetUploadState.datasetId) {
    datasetUploadState.error = t('views.application.aiCreate.datasetUpload.missingDataset')
    return
  }
  if (datasetUploadState.files.length === 0) {
    datasetUploadState.error = t('views.application.aiCreate.datasetUpload.fileRequired')
    return
  }
  const success = await ingestDocumentsFromFiles(
    datasetUploadState.files,
    datasetUploadState.datasetId,
    datasetUploadState
  )
  if (success) {
    const datasetName = datasetUploadState.datasetName || '-'
    notifyDatasetIngestSuccess(datasetName, datasetUploadMessageIndex)
    datasetUploadState.files = []
    if (datasetUploadInputRef.value) {
      datasetUploadInputRef.value.value = ''
    }
  }
  if (datasetUploadState.datasetId) {
    latestDatasetId.value = datasetUploadState.datasetId
  }
  await nextTick()
  scrollToBottom()
}

const ensureHttpUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  return `https://${value}`
}

const downloadFileFromUrl = async (rawUrl: string) => {
  const normalizedUrl = ensureHttpUrl(rawUrl)
  const response = await fetch(normalizedUrl)
  if (!response.ok) {
    throw new Error(response.statusText || 'URL download failed')
  }
  const blob = await response.blob()
  const pathName = normalizedUrl.split('?')[0]
  const rawName = pathName.split('/').filter(Boolean).pop() || 'dataset-url-file'
  let fileName = rawName
  try {
    fileName = decodeURIComponent(rawName)
  } catch {
    fileName = rawName
  }
  return new File([blob], fileName, { type: blob.type || 'application/octet-stream' })
}

const handleDatasetUrlSubmit = async () => {
  datasetUrlState.error = ''
  if (!datasetUrlState.datasetId) {
    datasetUrlState.error = t('views.application.aiCreate.datasetUpload.missingDataset')
    return
  }
  const targetUrl = datasetUrlState.url.trim()
  if (!targetUrl) {
    datasetUrlState.error = t('views.application.aiCreate.datasetUpload.fileRequired')
    return
  }
  datasetUrlState.loading = true
  try {
    const file = await downloadFileFromUrl(targetUrl)
    const success = await ingestDocumentsFromFiles(
      [file],
      datasetUrlState.datasetId,
      datasetUrlState,
      { skipLoading: true }
    )
    if (success) {
      const datasetName = datasetUrlState.datasetName || '-'
      notifyDatasetIngestSuccess(datasetName, datasetUrlMessageIndex)
      datasetUrlState.url = ''
      latestDatasetId.value = datasetUrlState.datasetId
    }
  } catch (error: any) {
    datasetUrlState.error =
      error?.message || t('views.application.aiCreate.datasetUpload.failed')
  } finally {
    datasetUrlState.loading = false
    await nextTick()
    scrollToBottom()
  }
}

const ensureApplicationMessage = () => {
  let idx = applicationMessageIndex.value
  if (idx !== null && messages.value[idx]) {
    messages.value[idx] = {
      role: 'assistant',
      content: '',
      kind: 'application'
    }
  } else {
    idx =
      messages.value.push({
        role: 'assistant',
        content: '',
        kind: 'application'
      }) - 1
  }
  applicationMessageIndex.value = idx
}

const normalizeApplicationRecords = (records: any[]) => {
  return records
    .map((item) => ({
      id: item?.id || item?.application_id || item?.app_id || '',
      name: item?.name || item?.app_name || item?.title || '',
      desc: item?.desc || item?.description || ''
    }))
    .filter((item) => item.id)
}

const loadApplicationList = async () => {
  const token = getAuthToken()
  if (!token) {
    applicationState.error = t('views.application.aiCreate.chatAccessTokenMissing')
    return
  }
  applicationState.listLoading = true
  applicationState.error = ''
  try {
    const resp = await fetch(appApiUrl('application/1/30'), {
      headers: {
        Authorization: token
      }
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      throw new Error(body?.message || resp.statusText)
    }
    const records = body?.data?.records || body?.records || body?.data || []
    applicationState.items = Array.isArray(records)
      ? normalizeApplicationRecords(records)
      : []
    if (!applicationState.items.length) {
      applicationState.error = t('views.application.aiCreate.applicationCard.empty')
    }
  } catch (error: any) {
    applicationState.error =
      error?.message || t('views.application.aiCreate.applicationCard.listFailed')
  } finally {
    applicationState.listLoading = false
  }
}

const applyApplicationDetail = (detail: any) => {
  applicationState.detail = detail
  const nodes = detail?.work_flow?.nodes || []
  const baseNode = nodes.find((node: any) => node?.id === 'base-node')
  applicationState.baseName =
    baseNode?.node_data?.name ||
    baseNode?.properties?.name ||
    baseNode?.node_data?.assistant_name ||
    ''
  applicationState.basePrologue =
    baseNode?.node_data?.prologue ||
    baseNode?.properties?.prologue ||
    ''
  const emailNode = nodes.find((node: any) => node?.id === EMAIL_NODE_ID)
  const field =
    emailNode?.node_data?.input_field_list?.find((item: any) => item?.name === 'recipient') ||
    emailNode?.properties?.node_data?.input_field_list?.find?.(
      (item: any) => item?.name === 'recipient'
    )
  applicationState.recipient = field?.value || ''
}

const fetchApplicationDetail = async (appId: string) => {
  const token = getAuthToken()
  if (!token) {
    applicationState.error = t('views.application.aiCreate.chatAccessTokenMissing')
    return
  }
  applicationState.detailLoading = true
  applicationState.error = ''
  applicationState.statusMessage = ''
  applicationState.publishMessage = ''
  try {
    const resp = await fetch(appApiUrl(`application/${appId}`), {
      headers: {
        Authorization: token
      }
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      throw new Error(body?.message || resp.statusText)
    }
    applyApplicationDetail(body?.data || body)
  } catch (error: any) {
    applicationState.error =
      error?.message || t('views.application.aiCreate.applicationCard.detailFailed')
  } finally {
    applicationState.detailLoading = false
    nextTick(() => scrollToBottom())
  }
}

const handleApplicationSelect = (appId: string) => {
  if (!appId) return
  clearApplicationConfirmation()
  applicationState.selectedId = appId
  applicationState.formVisible = true
  nextTick(() => scrollToBottom())
  fetchApplicationDetail(appId)
}

const showApplicationSelectionCard = () => {
  applicationState.visible = true
  applicationState.selectedId = ''
  applicationState.detail = null
  applicationState.baseName = ''
  applicationState.basePrologue = ''
  applicationState.recipient = ''
  applicationState.statusMessage = ''
  applicationState.publishMessage = ''
  applicationState.error = ''
  applicationState.formVisible = true
  clearApplicationConfirmation()
  ensureApplicationMessage()
  loadApplicationList()
  nextTick(() => scrollToBottom())
}

const ensureBaseNodeInfo = (nodes: any[]) => {
  const baseNode = nodes.find((node: any) => node?.id === 'base-node')
  if (!baseNode) {
    return
  }
  const prologueValue = (applicationState.basePrologue || '').trim()
  const updatedNodeData = {
    ...(baseNode.node_data || {}),
    name: applicationState.baseName
  }
  if (prologueValue) {
    updatedNodeData.prologue = prologueValue
  }
  baseNode.node_data = updatedNodeData
  const propsNodeData = {
    ...(baseNode.properties?.node_data || {}),
    name: applicationState.baseName
  }
  if (prologueValue) {
    propsNodeData.prologue = prologueValue
  }
  baseNode.properties = {
    ...(baseNode.properties || {}),
    name: applicationState.baseName,
    node_data: propsNodeData,
    ...(prologueValue ? { prologue: prologueValue } : {})
  }
}

const ensureDatasetBindings = (nodes: any[]) => {
  const datasetId = latestDatasetId.value || datasetUploadState.datasetId
  if (!datasetId) {
    return
  }
  const datasetList = [datasetId]
  nodes
    .filter((node: any) => node?.type === 'search-dataset-node')
    .forEach((node: any) => {
      const updatedNodeData = {
        ...(node.node_data || {}),
        dataset_id_list: datasetList,
        source_dataset_id_list: datasetList
      }
      node.node_data = updatedNodeData
      const propsNodeData = {
        ...(node.properties?.node_data || {}),
        dataset_id_list: datasetList,
        source_dataset_id_list: datasetList
      }
      node.properties = {
        ...(node.properties || {}),
        node_data: propsNodeData
      }
    })
}

const updateRecipientList = (list: any[]) => {
  const recipient = applicationState.recipient
  if (!Array.isArray(list)) {
    return []
  }
  let hasRecipientField = false
  const mapped = list.map((item: any) => {
    if (item?.name === 'recipient') {
      hasRecipientField = true
      return {
        ...item,
        value: recipient
      }
    }
    return item
  })
  if (!hasRecipientField) {
    mapped.push({
      name: 'recipient',
      type: 'string',
      value: recipient,
      source: 'custom',
      is_required: true
    })
  }
  return mapped
}

const ensureEmailNodeRecipient = (nodes: any[]) => {
  const emailNode = nodes.find((node: any) => node?.id === EMAIL_NODE_ID)
  if (!emailNode) {
    return
  }
  const nodeData = emailNode.node_data || {}
  const inputList = Array.isArray(nodeData.input_field_list) ? nodeData.input_field_list : []
  nodeData.input_field_list = updateRecipientList(inputList)
  emailNode.node_data = nodeData
  const propsNodeData = emailNode.properties?.node_data || {}
  const propsInputList = Array.isArray(propsNodeData.input_field_list)
    ? propsNodeData.input_field_list
    : []
  propsNodeData.input_field_list = updateRecipientList(propsInputList)
  emailNode.properties = {
    ...(emailNode.properties || {}),
    node_data: propsNodeData
  }
}

const buildUpdatedWorkflow = () => {
  const originalWorkflow = JSON.parse(
    JSON.stringify(applicationState.detail?.work_flow || { nodes: [] })
  )
  const nodes = Array.isArray(originalWorkflow?.nodes) ? originalWorkflow.nodes : []
  ensureBaseNodeInfo(nodes)
  ensureDatasetBindings(nodes)
  ensureEmailNodeRecipient(nodes)
  originalWorkflow.nodes = nodes
  return originalWorkflow
}

const clearApplicationConfirmation = () => {
  if (applicationConfirmMessageIndex.value !== null) {
    messages.value.splice(applicationConfirmMessageIndex.value, 1)
    applicationConfirmMessageIndex.value = null
  }
}

const showApplicationConfirmation = () => {
  clearApplicationConfirmation()
  const confirmPayload: ApplicationConfirmPayload = {
    id: applicationState.selectedId,
    name: applicationState.baseName || (applicationState.detail?.name ?? ''),
    prologue: applicationState.basePrologue || applicationState.detail?.desc || '',
    email: applicationState.recipient
  }
  applicationConfirmMessageIndex.value =
    messages.value.push({
      role: 'assistant',
      content: '',
      kind: 'application-confirm',
      confirm: confirmPayload
    }) - 1
  nextTick(() => scrollToBottom())
}

const handleApplicationSubmit = async (): Promise<boolean> => {
  if (!applicationState.selectedId || !applicationState.detail) {
    return false
  }
  if (!applicationState.baseName.trim()) {
    applicationState.error = t('views.application.aiCreate.applicationCard.baseNameRequired')
    return false
  }
  if (!applicationState.recipient.trim()) {
    applicationState.error = t('views.application.aiCreate.applicationCard.recipientRequired')
    return false
  }
  const token = getAuthToken()
  if (!token) {
    applicationState.error = t('views.application.aiCreate.chatAccessTokenMissing')
    return false
  }
  applicationState.submitting = true
  applicationState.error = ''
  applicationState.statusMessage = ''
  let success = false
  try {
    const payload = {
      work_flow: buildUpdatedWorkflow()
    }
    const resp = await fetch(appApiUrl(`application/${applicationState.selectedId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(payload)
    })
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      throw new Error(body?.message || resp.statusText)
    }
    applyApplicationDetail(body?.data || payload)
    const targetName = applicationState.detail?.name || ''
    applicationState.statusMessage = t('views.application.aiCreate.applicationCard.saveSuccess', {
      name: targetName || 'APP'
    })
    success = true
  } catch (error: any) {
    applicationState.error = t('views.application.aiCreate.applicationCard.saveFailed', {
      message: error?.message || ''
    })
  } finally {
    applicationState.submitting = false
  }
  return success
}

const handleApplicationSave = async () => {
  const saved = await handleApplicationSubmit()
  if (!saved) {
    return
  }
  applicationState.formVisible = false
  showApplicationConfirmation()
}

const handleApplicationPublish = async (): Promise<boolean> => {
  if (!applicationState.selectedId || !applicationState.detail) {
    return false
  }
  const token = getAuthToken()
  if (!token) {
    applicationState.publishMessage = t('views.application.aiCreate.chatAccessTokenMissing')
    return false
  }
  applicationState.publishing = true
  applicationState.publishMessage = ''
  let success = false
  try {
    const payload = {
      work_flow: buildUpdatedWorkflow()
    }
    const resp = await fetch(
      appApiUrl(`application/${applicationState.selectedId}/publish`),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(payload)
      }
    )
    const body = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      throw new Error(body?.message || resp.statusText)
    }
    const targetName = applicationState.detail?.name || ''
    applicationState.publishMessage = t(
      'views.application.aiCreate.applicationCard.publishSuccess',
      { name: targetName || 'APP' }
    )
    success = true
  } catch (error: any) {
    applicationState.publishMessage = t(
      'views.application.aiCreate.applicationCard.publishFailed',
      { message: error?.message || '' }
    )
  } finally {
    applicationState.publishing = false
  }
  return success
}

const confirmApplicationCreation = async () => {
  if (applicationState.publishing) {
    return
  }
  const published = await handleApplicationPublish()
  if (!published || applicationConfirmMessageIndex.value === null) {
    return
  }
  const confirmMessage = messages.value[applicationConfirmMessageIndex.value]
  if (!confirmMessage) {
    applicationConfirmMessageIndex.value = null
    return
  }
  const targetName =
    confirmMessage?.confirm?.name || applicationState.baseName || applicationState.detail?.name || 'APP'
  messages.value[applicationConfirmMessageIndex.value] = {
    role: 'assistant',
    content: t('views.application.aiCreate.applicationCard.publishSuccess', { name: targetName }),
    kind: 'text'
  }
  applicationConfirmMessageIndex.value = null
}

const editApplicationInfo = () => {
  applicationState.formVisible = true
  applicationState.publishMessage = ''
  applicationState.statusMessage = ''
  clearApplicationConfirmation()
  nextTick(() => scrollToBottom())
}

const normalizeTemplateArray = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  if (Array.isArray(payload?.files)) {
    return payload.files
  }
  if (Array.isArray(payload?.data)) {
    return payload.data
  }
  if (Array.isArray(payload?.list)) {
    return payload.list
  }
  return []
}

const buildTemplateDownloadUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  const normalizedPath = path.replace(/^\/+/, '')
  const base = TEMPLATE_DOWNLOAD_BASE.endsWith('/')
    ? TEMPLATE_DOWNLOAD_BASE
    : `${TEMPLATE_DOWNLOAD_BASE}/`
  return `${base}${normalizedPath}`
}

const datasetApiUrl = (path: string) => {
  const normalizedBase = DATASET_API_BASE.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

const appApiUrl = (path: string) => {
  const normalizedBase = APPLICATION_API_BASE.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

const escapeHtml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br/>')
}

const scrollToBottom = () => {
  const el = messagesRef.value
  if (!el) return
  el.scrollTo({
    top: el.scrollHeight,
    behavior: 'smooth'
  })
}

const cleanupStream = () => {
  if (controller.value) {
    controller.value.abort()
    controller.value = null
  }
}

const formatApiError = (message: string) =>
  t('views.application.aiCreate.chatApiError', { message })

const formatNetworkError = (message: string) =>
  t('views.application.aiCreate.chatNetworkError', { message })

const exposeError = (text: string) => {
  messages.value.push({ role: 'assistant', content: text, kind: 'text' })
}

const buildTemplateListMessage = (templates: TemplateListItem[]): ChatMessage => ({
  role: 'assistant',
  content: '',
  kind: 'templates',
  templates: {
    title: t('views.application.aiCreate.chatTemplateListTitle'),
    items: templates,
    emptyText: t('views.application.aiCreate.chatTemplateListEmpty')
  }
})

interface TemplateListResult {
  items: TemplateListItem[] | null
  error?: string
}

const requestTemplateList = async (): Promise<TemplateListResult> => {
  try {
    const resp = await fetch(TEMPLATE_LIST_URL)
    if (!resp.ok) {
      throw new Error(resp.statusText)
    }
    const data = await resp.json().catch(() => [])
    const normalized = normalizeTemplateArray(data)
    const mapped: TemplateListItem[] = normalized.map((item: any, index: number) => {
      if (typeof item === 'string') {
        return {
          label: item,
          path: item,
          size: undefined
        }
      }
      const label =
        item?.name ||
        item?.file_name ||
        item?.stored_name ||
        item?.filename ||
        item?.title ||
        t('views.application.aiCreate.chatTemplateListUntitled', { index: index + 1 })
      return {
        label,
        path: item?.path || item?.relative_path || item?.file_path || '',
        size: typeof item?.size === 'number' ? item.size : undefined
      }
    })
    return { items: mapped }
  } catch (error: any) {
    return { items: null, error: error?.message || 'Template list request failed' }
  }
}

const showTemplateList = async (targetIndex: number) => {
  messages.value[targetIndex] = {
    role: 'assistant',
    content: t('views.application.aiCreate.chatTemplateListLoading'),
    kind: 'text'
  }
  const { items, error } = await requestTemplateList()
  if (items === null) {
    messages.value[targetIndex] = {
      role: 'assistant',
      content: t('views.application.aiCreate.chatTemplateListError', {
        message: error || ''
      }),
      kind: 'text'
    }
  } else {
    messages.value[targetIndex] = buildTemplateListMessage(items)
  }
  await nextTick()
  scrollToBottom()
}

const downloadTemplateFile = async (item: TemplateListItem) => {
  if (!item.path) {
    throw new Error(t('views.application.aiCreate.chatTemplateMissingPath', { name: item.label }))
  }
  const url = buildTemplateDownloadUrl(item.path)
  const resp = await fetch(url)
  if (!resp.ok) {
    throw new Error(resp.statusText || 'Download failed')
  }
  const blob = await resp.blob()
  const fileName =
    item.path.split('/').pop() ||
    (item.label.endsWith('.mk') ? item.label : `${item.label}.mk`)
  return new File([blob], fileName, { type: 'application/octet-stream' })
}

const importTemplateFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file, file.name)
  const resp = await applicationApi.importApplication(formData)
  if (resp?.code !== 200 && resp?.code !== 0) {
    throw new Error(resp?.message || 'Import failed')
  }
}

const handleTemplateClick = async (item: TemplateListItem) => {
  if (templateImporting.value) {
    return
  }
  templateImporting.value = true
  const statusIndex =
    messages.value.push({
      role: 'assistant',
      content: t('views.application.aiCreate.chatTemplateDownloadStart', { name: item.label }),
      kind: 'text'
    }) - 1
  await nextTick()
  scrollToBottom()
  try {
    const file = await downloadTemplateFile(item)
    messages.value[statusIndex].content = t(
      'views.application.aiCreate.chatTemplateImporting',
      { name: item.label }
    )
    await nextTick()
    scrollToBottom()
    await importTemplateFile(file)
    messages.value[statusIndex].content = t(
      'views.application.aiCreate.chatTemplateImportSuccess',
      { name: item.label }
    )
    emit('import-success')
    showDatasetFormMessage()
  } catch (error: any) {
    messages.value[statusIndex].content = t(
      'views.application.aiCreate.chatTemplateImportFailed',
      { message: error?.message || '' }
    )
  } finally {
    templateImporting.value = false
    await nextTick()
    scrollToBottom()
  }
}

const send = async () => {
  const text = input.value.trim()
  if (!text || loading.value) {
    return
  }

  messages.value.push({ role: 'user', content: text, kind: 'text' })
  input.value = ''
  await nextTick()
  scrollToBottom()

  loading.value = true
  cleanupStream()
  const history = messages.value.slice(-20).map((item) => ({
    role: item.role,
    content: item.content
  }))

  controller.value = new AbortController()

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        prompt: text,
        effort: effort.value
      }),
      signal: controller.value.signal
    })

    if (!response.ok || !response.body) {
      const fallback = await response.text()
      exposeError(formatApiError(fallback || response.statusText))
      return
    }

    const idx = messages.value.push({ role: 'assistant', content: '', kind: 'text' }) - 1
    const reader = response.body.getReader()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      let separatorIndex = buffer.indexOf('\n\n')

      while (separatorIndex !== -1) {
        const chunk = buffer.slice(0, separatorIndex)
        buffer = buffer.slice(separatorIndex + 2)
        separatorIndex = buffer.indexOf('\n\n')

        const lines = chunk
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)

        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (!payload || payload === '[DONE]') continue

          if (payload.startsWith('[error]')) {
            messages.value[idx].content = formatApiError(payload.slice(7).trim())
            continue
          }

          try {
            const parsed = JSON.parse(payload)
            const delta =
              parsed?.delta?.content ??
              parsed?.delta ??
              parsed?.text ??
              (parsed?.type?.includes?.('output_text.delta') ? parsed?.delta : '')

            if (typeof delta === 'string' && delta) {
              const trimmed = delta.trim()
            if (trimmed === 'create_ai') {
              await showTemplateList(idx)
              continue
            }
            if (trimmed === CREATE_AI_PROMPT_CN) {
              messages.value[idx].content = t('views.application.aiCreate.chatCreatePrompt')
              await nextTick()
              scrollToBottom()
              continue
            }
            messages.value[idx].content += delta
            await nextTick()
            scrollToBottom()
            }
          } catch {
            continue
          }
        }
      }
    }
  } catch (error: any) {
    if (error?.name !== 'AbortError') {
      exposeError(formatNetworkError(error?.message || ''))
    }
  } finally {
    cleanupStream()
    loading.value = false
  }
}

const handleComposerEnter = (event: KeyboardEvent) => {
  if (event.isComposing || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return
  }
  event.preventDefault()
  send()
}

onUnmounted(() => {
  cleanupStream()
})
</script>

<style scoped>
.openai-chat-panel {
  display: flex;
  flex-direction: column;
  height: 98%;
  padding: 24px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  background: #fff;
}

.messages {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 16px;
  background: #fafafa;
  overflow-y: auto;
  margin-bottom: 16px;
}

.msg {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  line-height: 1.5;
  background: #fff;
  color: #303133;
  word-break: break-word;
}

.msg.user {
  background: #e9f2ff;
}

.msg.assistant {
  background: #f5f5f5;
}

.msg-loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.typing-indicator {
  display: inline-flex;
  gap: 6px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #909399;
  animation: typingBlink 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

.typing-hint {
  font-size: 13px;
  color: #606266;
}

@keyframes typingBlink {
  0%,
  80%,
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.msg-templates {
  background: #f0f9eb;
}

.msg-dataset {
  background: #fff7eb;
}

.template-card {
  margin-top: 6px;
  border: 1px solid #cfe6d2;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.template-list {
  margin: 8px 0 0 18px;
  padding: 0;
  color: #303133;
}

.template-list li {
  margin-bottom: 4px;
  line-height: 1.4;
}

.template-link {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
  font-size: 15px;
  color: #000;
  font-weight: 600;
}

.template-link span {
  color: inherit;
}

.template-link:hover:not(:disabled) {
  border-color: var(--el-color-primary);
  background: #f0f5ff;
}

.template-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.template-empty {
  margin: 6px 0 0;
  color: #909399;
  font-size: 13px;
}

.dataset-card {
  margin-top: 6px;
  border: 1px solid #40a0ff73;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.dataset-tip {
  margin: 4px 0 12px;
  font-size: 13px;
  color: #909399;
}

.dataset-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dataset-form label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #303133;
  gap: 6px;
}

.dataset-form input,
.dataset-form textarea,
.dataset-form select {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  font-family: inherit;
  background: #fff;
}

.dataset-form textarea {
  resize: vertical;
}

.dataset-form button {
  align-self: flex-end;
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid #409eff;
  background: #409eff;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.dataset-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dataset-error {
  margin: 0;
  color: #f56c6c;
  font-size: 13px;
}

.dataset-upload-card {
  margin-top: 6px;
  border: 1px solid #d9e8ff;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.dataset-upload-target {
  margin: 0 0 6px;
  font-size: 14px;
  color: #409eff;
  font-weight: 600;
}

.dataset-upload-drop {
  border: 1px dashed #a0c4ff;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  margin-bottom: 12px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.dataset-upload-drop input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.dataset-limit {
  margin: 0 0 10px;
  color: #909399;
  font-size: 13px;
}

.dataset-file-list {
  margin: 0 0 16px 18px;
  padding: 0;
  color: #303133;
  font-size: 14px;
  max-height: 180px;
  overflow-y: auto;
}

.dataset-file-list li {
  list-style: disc;
  margin-bottom: 6px;
}

.dataset-upload-card button {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid #409eff;
  background: #409eff;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.dataset-upload-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dataset-url-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dataset-url-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #303133;
}

.dataset-url-input input {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
}

.dataset-url-card button {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #409eff;
  background: #409eff;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.dataset-url-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.application-card {
  margin-top: 6px;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.application-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.application-card__tip {
  margin: 6px 0 12px;
  color: #909399;
  font-size: 13px;
}

.text-button {
  border: none;
  background: none;
  color: #409eff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.text-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.application-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: grid;
  gap: 8px;
}

.application-list li {
  margin: 0;
}

.application-link {
  width: 100%;
  text-align: left;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 8px 10px;
  background: #f9fafc;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.application-link.active {
  border-color: #409eff;
  background: #eef5ff;
}

.application-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.application-link span {
  font-weight: 600;
  color: #303133;
}

.application-link small {
  color: #909399;
}

.application-empty {
  margin: 0 0 12px;
  color: #909399;
  font-size: 13px;
}

.application-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.application-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #303133;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.required-label {
  color: #f56c6c;
  font-size: 14px;
  line-height: 1;
}

.field-hint {
  margin: -2px 0 0;
  font-size: 12px;
  color: #909399;
}

.application-form input,
.application-form textarea {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  font-family: inherit;
}

.application-form textarea {
  resize: vertical;
}

.application-confirm-card {
  margin-top: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.application-confirm-tip {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.application-confirm-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.application-confirm-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
}

.application-confirm-list .label {
  color: #909399;
}

.application-confirm-list .value {
  color: #303133;
  font-weight: 600;
}

.application-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.application-primary,
.application-secondary {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  min-width: 120px;
}

.application-primary {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.application-secondary {
  background: #fff;
  border-color: #dcdfe6;
  color: #303133;
}

.application-confirm-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.application-primary:disabled,
.application-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.application-status {
  margin: 0;
  font-size: 13px;
  color: #303133;
}

.application-status.success {
  color: #67c23a;
}

.composer {
  display: grid;
  gap: 10px;
}

.composer textarea {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 10px;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.row label {
  font-size: 14px;
  color: #606266;
}

select {
  margin-left: 6px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background: #fff;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #409eff;
  background: #409eff;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .openai-chat-panel {
    padding: 16px;
  }

  .row {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    width: 100%;
  }
}
</style>
