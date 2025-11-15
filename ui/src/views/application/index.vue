<template>
  <div class="application-list-container p-24" style="padding-top: 16px">
    <div class="flex-between mb-16">
      <h4 style="white-space: nowrap;padding-right: 10px;">{{ $t('views.application.title') }}</h4>
      <div class="flex-between">
        <el-select
            v-model="selectUserId"
            class="mr-12"
            @change="searchHandle"
            style="max-width: 240px; width: 150px"
        >
          <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-input
            v-model="searchValue"
            @change="searchHandle"
            :placeholder="$t('views.application.searchBar.placeholder')"
            prefix-icon="Search"
            class="w-240"
            style="min-width: 240px"
            clearable
        />
      </div>
    </div>
    <div v-loading.fullscreen.lock="paginationConfig.current_page === 1 && loading">
      <InfiniteScroll
          :size="applicationList.length"
          :total="paginationConfig.total"
          :page_size="paginationConfig.page_size"
          v-model:current_page="paginationConfig.current_page"
          @load="getList"
          :loading="loading"
      >
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="mb-16">
            <el-card shadow="hover" class="application-card-add" style="--el-card-padding: 8px">
              <div class="card-add-button flex align-center cursor p-8" @click="createApplicationViaAiChat">
                <AppIcon iconName="ChatLineRound" class="mr-8"></AppIcon>
                {{ $t('views.application.aiCreate.chatButton') }}
              </div>
              <el-divider style="margin: 8px 0"/>
              <div class="card-add-button flex align-center cursor p-8" @click="openCreateDialog">
                <AppIcon iconName="app-add-application" class="mr-8"></AppIcon>
                {{ $t('views.application.createApplication') }}
              </div>
              <el-divider style="margin: 8px 0"/>
              <el-upload
                  ref="elUploadRef"
                  :file-list="[]"
                  action="#"
                  multiple
                  :auto-upload="false"
                  :show-file-list="false"
                  :limit="1"
                  :on-change="(file: any, fileList: any) => importApplication(file)"
                  class="card-add-button"
              >
                <div class="flex align-center cursor p-8">
                  <AppIcon iconName="app-import" class="mr-8"></AppIcon>
                  {{ $t('views.application.importApplication') }}
                </div>
              </el-upload>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="mb-16">
            <!--创建AI的教程视频-->
            <!-- 在原有CardBox结构中添加以下内容 -->
            <CardBox
                title="Demo create my AI"
                description="Read the user manual to create your application"
                class="application-card tutorial-card"
                @click="showTutorialDialog"
            >
            </CardBox>
          </el-col>
          <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="6"
              v-for="(item, index) in applicationList"
              :key="index"
              class="mb-16"
          >

            <!--应用-->
            <CardBox
                :title="item.name"
                :description="item.desc"
                class="application-card cursor"
                @click="router.push({ path: `/application/${item.id}/${item.type}/overview` })"
            >
              <template #icon>
                <AppAvatar
                    v-if="isAppIcon(item?.icon)"
                    shape="square"
                    :size="32"
                    style="background: none"
                    class="mr-8"
                >
                  <img :src="item?.icon" alt=""/>
                </AppAvatar>
                <AppAvatar
                    v-else-if="item?.name"
                    :name="item?.name"
                    pinyinColor
                    shape="square"
                    :size="32"
                    class="mr-8"
                />
              </template>
              <template #subTitle>
                <el-text class="color-secondary" size="small">
                  <auto-tooltip :content="item.username">
                    {{ $t('common.creator') }}: {{ item.username }}
                  </auto-tooltip>
                </el-text>
              </template>
              <div class="status-tag">
                <el-tag type="warning" v-if="isWorkFlow(item.type)" style="height: 22px">
                  {{ $t('views.application.workflow') }}
                </el-tag>
                <el-tag class="blue-tag" v-else style="height: 22px">
                  {{ $t('views.application.simple') }}
                </el-tag>
              </div>

              <template #footer>
                <div class="footer-content">
                  <el-tooltip
                      effect="dark"
                      :content="$t('views.application.setting.demo')"
                      placement="top"
                  >
                    <el-button text @click.stop @click="getAccessToken(item.id)">
                      <AppIcon iconName="app-view"></AppIcon>
                    </el-button>
                  </el-tooltip>
                  <el-divider direction="vertical"/>
                  <el-tooltip effect="dark" :content="$t('common.setting')" placement="top">
                    <el-button text @click.stop="settingApplication(item)">
                      <AppIcon iconName="Setting"></AppIcon>
                    </el-button>
                  </el-tooltip>
                  <el-divider direction="vertical"/>
                  <span @click.stop>
                    <el-dropdown trigger="click">
                      <el-button text @click.stop>
                        <el-icon><MoreFilled/></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                              v-if="is_show_copy_button(item)"
                              @click="copyApplication(item)"
                          >
                            <AppIcon iconName="app-copy"></AppIcon>
                            {{ $t('common.copy') }}
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop="exportApplication(item)">
                            <AppIcon iconName="app-export"></AppIcon>

                            {{ $t('common.export') }}
                          </el-dropdown-item>
                          <el-dropdown-item icon="Delete" @click.stop="deleteApplication(item)">{{
                              $t('common.delete')
                            }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </span>
                </div>
              </template>
            </CardBox>

          </el-col>

        </el-row>
      </InfiniteScroll>
    </div>
    <!-- 教程弹窗 -->
    <el-dialog
        v-model="showTutorial"
        title="AI Creation Tutorial"
        width="90%"
        top="5vh"
        class="tutorial-dialog"
    >
      <!-- 视频播放区 -->
      <div class="video-section">
        <video
            ref="videoPlayer"
            class="video-js"
            controls
            preload="auto"
            :poster="assetsVideoImage"
            playsinline
        >
          <source :src="assetsVideoSrc" type="video/mp4"/>
        </video>
      </div>
      <div class="tutorial-content">
        <!-- 步骤手册 -->
        <div class="manual-section">
          <el-steps direction="vertical" :active="currentStep" class="custom-steps">
            <el-step
                v-for="(step,index) in tutorialSteps"
                :key="index"
                :class="['step-item', { 'active-step': currentStep >= index }]"
            >
              <template #icon>
                <div class="step-icon-wrapper">
                  <el-icon :class="['step-icon', `step-${index + 1}`]">
                    <component :is="step.icon"/>
                  </el-icon>
                  <div class="step-number">{{ index + 1 }}</div>
                </div>
              </template>
              <template #title>
                <div class="step-title">{{ t(step.title) }}</div>
              </template>
              <template #description>
                <div class="step-description">
                  <p>
                    {{ t(step.description) }}
                  </p>
                  <!-- 添加示例图片 -->
                  <el-image
                      v-if="step.image"
                      :src="step.image"
                      class="step-image"
                      :preview-src-list="[step.image]"
                      :initial-index="0"
                      fit="contain"
                      hide-on-click-modal
                  >
                    <template #error>
                      <div class="image-error">加载失败</div>
                    </template>
                  </el-image>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>


      </div>
    </el-dialog>
    <el-dialog
        v-model="createAiChatDialogVisible"
        destroy-on-close
        class="create-ai-chat-dialog"
        :show-close="true"
        width="80%"
    >
      <template #header>
        <div class="create-ai-chat-dialog__header">
          <h3>{{ $t('views.application.aiCreate.chatDialogTitle') }}</h3>
        </div>
      </template>
      <div class="create-ai-chat-dialog__body">
        <OpenAiChatPanel @import-success="onAiChatImportSuccess" />
      </div>
    </el-dialog>
    <el-dialog
        v-model="aiCreateDialogVisible"
        fullscreen
        append-to-body
        destroy-on-close
        class="ai-create-dialog"
        :close-on-click-modal="false"
        :show-close="false"
        @closed="resetAiCreateDialogState"
    >
      <template #header>
        <div class="ai-create-dialog__header">
          <h3>{{ $t('views.application.aiCreate.dialogTitle') }}</h3>
          <el-button text circle @click="closeAiCreateDialog">
            <el-icon><Close/></el-icon>
          </el-button>
        </div>
      </template>
      <div class="ai-create-dialog__body">
        <div class="ai-create-dialog__messages" ref="aiCreateMessagesRef">
          <div
              v-if="!aiSelectedTemplate"
              class="ai-create-dialog__template-panel"
              v-loading="aiTemplateProcessing"
              :element-loading-text="$t('views.application.aiCreate.templateLoading')"
          >
            <div class="ai-create-dialog__template-header">
              <div class="ai-create-dialog__template-title">
                <AppIcon iconName="MagicStick"/>
                <span>{{ $t('views.application.aiCreate.templateListTitle') }}</span>
              </div>
              <el-button
                  text
                  size="small"
                  :icon="Refresh"
                  :loading="aiTemplatesLoading"
                  @click="fetchAiTemplates"
              >
                {{ $t('common.refresh') }}
              </el-button>
            </div>
            <el-alert
                v-if="aiTemplateError"
                type="error"
                :title="aiTemplateError"
                :closable="false"
                show-icon
                class="mb-12"
            />
            <el-skeleton
                v-else-if="aiTemplatesLoading"
                animated
                :count="1"
                :rows="4"
                class="ai-create-dialog__template-skeleton"
            />
            <el-empty
                v-else-if="aiTemplates.length === 0"
                :description="$t('views.application.aiCreate.templateEmpty')"
                class="ai-create-dialog__template-empty"
            />
            <div v-else class="ai-create-dialog__template-grid">
              <div
                  v-for="(template, index) in aiTemplates"
                  :key="getTemplateName(template) + index"
                  class="ai-create-dialog__template-card"
                  @click="handleTemplateSelect(template)"
              >
                <div class="card-title">
                  {{ getTemplateName(template) }}
                </div>
                <div class="card-desc">
                  {{ template.relative_path || template.path || template.desc || $t('views.application.aiCreate.templateDefaultDesc') }}
                </div>
                <div class="card-meta">
                  <el-tag size="small" type="info" v-if="template.uploaded_at || template.updated_at">
                    {{ template.uploaded_at || template.updated_at }}
                  </el-tag>
                  <span v-else>{{ template.operator || template.uploaded_by || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <Transition name="slide-horizontal" mode="out-in">
            <div
                v-if="aiDatasetStep === 'form'"
                key="dataset-form"
                class="ai-create-dialog__dataset-panel"
            >
              <div class="dataset-panel-header">
                <div class="dataset-panel-title">
                  <AppIcon iconName="Collection"/>
                  <span>{{ $t('views.application.aiCreate.datasetForm.title') }}</span>
                </div>
                <el-button text size="small" :loading="aiDatasetSubmitting" @click="submitDatasetForm">
                  {{ $t('views.application.aiCreate.datasetForm.createButton') }}
                </el-button>
              </div>
              <p class="dataset-panel-tip">{{ $t('views.application.aiCreate.datasetForm.tip') }}</p>
              <el-form label-position="top" class="dataset-form">
                <el-form-item :label="$t('views.application.aiCreate.datasetForm.nameLabel')">
                  <el-input
                      v-model="aiDatasetForm.name"
                      :placeholder="$t('views.application.aiCreate.datasetForm.namePlaceholder')"
                      maxlength="64"
                  />
                </el-form-item>
                <el-form-item :label="$t('views.application.aiCreate.datasetForm.descLabel')">
                  <el-input
                      v-model="aiDatasetForm.desc"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      :placeholder="$t('views.application.aiCreate.datasetForm.descPlaceholder')"
                      maxlength="200"
                  />
                </el-form-item>
                <el-form-item :label="$t('views.application.aiCreate.datasetForm.typeLabel')">
                  <el-select v-model="aiDatasetForm.type" style="width: 100%">
                    <el-option
                        v-for="item in aiDatasetTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('views.application.aiCreate.datasetForm.embeddingLabel')">
                  <el-select
                      v-model="aiDatasetForm.embedding_mode_id"
                      filterable
                      style="width: 100%"
                      :loading="aiEmbeddingModelsLoading"
                      :placeholder="$t('views.application.aiCreate.datasetForm.embeddingPlaceholder')"
                  >
                    <el-option
                        v-for="item in aiEmbeddingModels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                  <el-button
                      text
                      size="small"
                      @click="fetchEmbeddingModels"
                      :loading="aiEmbeddingModelsLoading"
                  >
                    {{ $t('views.application.aiCreate.datasetForm.refreshEmbedding') }}
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                      type="primary"
                      :loading="aiDatasetSubmitting"
                      @click="submitDatasetForm"
                      style="width: 100%"
                  >
                    {{ $t('views.application.aiCreate.datasetForm.submit') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div
                v-else-if="aiDatasetStep === 'upload'"
                key="dataset-upload"
                class="ai-create-dialog__dataset-panel dataset-upload-panel"
            >
              <div class="dataset-panel-header">
                <div class="dataset-panel-title">
                  <el-icon><UploadFilled/></el-icon>
                  <span>{{ $t('views.application.aiCreate.datasetUpload.title') }}</span>
                </div>
                <el-tag type="success" effect="light">
                  {{ aiDatasetUploadDataset?.name || '-' }}
                </el-tag>
              </div>
              <p class="dataset-panel-tip">
                {{ $t('views.application.aiCreate.datasetUpload.tip', { name: aiDatasetUploadDataset?.name || '-' }) }}
              </p>
              <el-upload
                  ref="aiDatasetUploadRef"
                  class="dataset-upload-dragger"
                  drag
                  multiple
                  action="#"
                  :auto-upload="false"
                  :file-list="aiDatasetUploadFiles"
                  :disabled="aiDatasetUploadLoading"
                  :on-change="handleDatasetUploadChange"
                  :on-remove="handleDatasetUploadRemove"
              >
                <el-icon class="dataset-upload-icon"><UploadFilled/></el-icon>
                <div class="dataset-upload-text">
                  {{ $t('views.application.aiCreate.datasetUpload.placeholder') }}
                </div>
                <template #tip>
                  <div class="dataset-upload-tip">
                    {{ $t('views.application.aiCreate.datasetUpload.limit') }}
                  </div>
                </template>
              </el-upload>
              <div class="dataset-upload-actions">
                <el-button
                    type="primary"
                    :loading="aiDatasetUploadLoading"
                    @click="submitDatasetUpload"
                >
                  {{ $t('views.application.aiCreate.datasetUpload.submit') }}
                </el-button>
              </div>
            </div>
            <div
                v-else-if="aiDatasetStep === 'done'"
                key="dataset-done"
                class="ai-create-dialog__dataset-panel dataset-upload-finished"
            >
              <div class="dataset-upload-finished__icon">
                <el-icon><CircleCheckFilled/></el-icon>
              </div>
              <div>
                <h4>
                  {{ $t('views.application.aiCreate.datasetUpload.doneTitle', { name: aiDatasetUploadDataset?.name || '-' }) }}
                </h4>
                <p class="dataset-panel-tip">
                  {{ $t('views.application.aiCreate.datasetUpload.doneDescription') }}
                </p>
              </div>
            </div>
          </Transition>
          <Transition name="slide-horizontal" mode="out-in">
            <div
                v-if="aiShowApplicationList"
                key="app-list"
                class="ai-create-dialog__app-list"
                v-loading="loading"
                :element-loading-text="$t('common.loading')"
            >
              <div class="ai-create-dialog__app-list-header">
                <AppIcon iconName="app-view"/>
                <span>{{ $t('views.application.aiCreate.applicationListTitle') }}</span>
              </div>
              <div v-if="!loading && applicationList.length === 0" class="ai-create-dialog__app-empty">
                <el-empty :description="$t('views.application.aiCreate.applicationListEmpty')"/>
              </div>
              <div v-else class="ai-create-dialog__app-grid">
                <div
                    v-for="app in applicationList.slice(0, 6)"
                    :key="app.id"
                    class="ai-create-dialog__app-card"
                    @click="openAppNameSetting(app)"
                >
                  <div class="app-card-header">
                    <AppAvatar
                        v-if="isAppIcon(app?.icon)"
                        shape="square"
                        :size="36"
                        class="mr-8"
                    >
                      <img :src="app?.icon" alt=""/>
                    </AppAvatar>
                    <AppAvatar
                        v-else
                        :name="app?.name"
                        pinyinColor
                        shape="square"
                        :size="36"
                        class="mr-8"
                    />
                    <div>
                      <div class="app-name">{{ app.name }}</div>
                      <div class="app-author">{{ $t('common.creator') }}: {{ app.username }}</div>
                    </div>
                  </div>
                  <div class="app-desc">{{ app.desc || $t('views.application.aiCreate.applicationListNoDesc') }}</div>
                  <div class="app-meta">
                    <el-tag size="small" type="success" v-if="isWorkFlow(app.type)">
                      {{ $t('views.application.workflow') }}
                    </el-tag>
                    <el-tag size="small" type="info" v-else>
                      {{ $t('views.application.simple') }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="slide-horizontal" mode="out-in">
            <div
                v-if="aiSelectedAppForName"
                key="base-node-panel"
                class="ai-create-dialog__name-panel"
                v-loading="aiAppDetailLoading"
            >
              <div class="base-node-form" v-if="aiAppDetail">
                <h5>{{ $t('views.application.aiCreate.baseNodeTitle') }}</h5>
                <el-form label-position="top">
                <el-form-item label-width="0">
                  <template #label>
                    <span class="required-label">{{ $t('views.application.aiCreate.baseNodeNameLabel') }}</span>
                  </template>
                  <el-input v-model="aiBaseNodeForm.name" :placeholder="$t('views.application.aiCreate.baseNodeNamePlaceholder')" maxlength="50"/>
                </el-form-item>
                <el-form-item label-width="0">
                  <template #label>
                    <span class="required-label">{{ $t('views.application.aiCreate.baseNodeEmailLabel') }}</span>
                  </template>
                  <el-input
                      v-model="aiBaseNodeForm.email"
                      :placeholder="$t('views.application.aiCreate.baseNodeEmailPlaceholder')"
                      maxlength="100"
                  />
                  </el-form-item>
                <el-form-item :label="$t('views.application.aiCreate.baseNodePrologueLabel')">
                    <el-input
                        v-model="aiBaseNodeForm.prologue"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                        :placeholder="$t('views.application.aiCreate.baseNodeProloguePlaceholder')"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" :loading="aiBaseNodeSaving" @click="confirmBaseNodeSetting">
                      {{ $t('views.application.aiCreate.baseNodeSubmit') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </Transition>

        </div>
      </div>
    </el-dialog>
    <CreateApplicationDialog ref="CreateApplicationDialogRef" @refresh="searchHandle"/>
    <CopyApplicationDialog ref="CopyApplicationDialogRef"/>
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted, reactive, nextTick} from 'vue'
import axios from 'axios'
import type {UploadInstance, UploadFile, UploadFiles} from 'element-plus'
import applicationApi from '@/api/application'
import CreateApplicationDialog from './component/CreateApplicationDialog.vue'
import CopyApplicationDialog from './component/CopyApplicationDialog.vue'
import OpenAiChatPanel from './component/OpenAiChatPanel.vue'
import {MsgSuccess, MsgConfirm, MsgAlert, MsgError} from '@/utils/message'
import {isAppIcon} from '@/utils/application'
import {useRouter} from 'vue-router'
import {isWorkFlow} from '@/utils/application'
import {ValidType, ValidCount} from '@/enums/common'
import {t} from '@/locales'
import useStore from '@/stores'
import uploadApi from '@/api/upload'
import assetsVideoSrc from '@/assets/demo-vedio.mp4'
import assetsVideoImage from '@/assets/demo-vedio-image.png'
import step1Image from '@/assets/step1-create.png'
import step2Image from '@/assets/step2-upload.png'
import step3Image from '@/assets/step3-newapp.png'
import step4Image from '@/assets/step4-config.png'
import step5Image from '@/assets/step5-use.png'
import {Refresh, UploadFilled, CircleCheckFilled} from '@element-plus/icons-vue'
// const step1Image = new URL('@/assets/step1-create.png', import.meta.url).href
// const step2Image = new URL('@/assets/step2-upload.png', import.meta.url).href
// const step3Image = new URL('@/assets/step3-newapp.png', import.meta.url).href
// const step4Image = new URL('@/assets/step4-config.png', import.meta.url).href
// const step5Image = new URL('@/assets/step5-use.png', import.meta.url).href
const elUploadRef = ref<any>()
const {application, user, common} = useStore()
const router = useRouter()

const CopyApplicationDialogRef = ref()
const CreateApplicationDialogRef = ref()
const loading = ref(false)

const applicationList = ref<any[]>([])

const paginationConfig = reactive({
  current_page: 1,
  page_size: 30,
  total: 0
})

interface UserOption {
  label: string
  value: string
}

interface AiCreateMessage {
  role: 'user' | 'assistant'
  content: string
}

const userOptions = ref<UserOption[]>([])

const selectUserId = ref('all')

const searchValue = ref('')

const apiInputParams = ref([])
const TEMPLATE_BASE_URL = 'http://localhost:3000/'

const showTutorial = ref(false)
const aiCreateDialogVisible = ref(false)
const createAiChatDialogVisible = ref(false)
const aiCreatePrompt = ref('')
const aiCreateMessages = ref<AiCreateMessage[]>([])
const aiCreateMessagesRef = ref<HTMLDivElement | null>(null)
const aiTemplates = ref<any[]>([])
const aiTemplatesLoading = ref(false)
const aiTemplateError = ref('')
const aiSelectedTemplate = ref<any | null>(null)
const aiTemplateProcessing = ref(false)
const aiTemplatePayload = ref<any | null>(null)
const aiShowApplicationList = ref(false)
const aiSelectedAppForName = ref<any | null>(null)
const aiAppNameInput = ref('')
const aiAppNameLoading = ref(false)
const aiDialogInitialized = ref(false)
const aiAppDetail = ref<any | null>(null)
const aiAppDetailLoading = ref(false)
const aiBaseNodeForm = reactive({
  name: '',
  email: '',
  prologue: ''
})
const aiBaseNodeSaving = ref(false)
const aiActiveDatasetId = ref('')
const EMAIL_NODE_ID = 'f72a2a79-a269-4887-8dd1-62abf49443b7'
const aiDatasetTypeOptions = [
  { label: t('views.application.aiCreate.datasetForm.typeGeneral'), value: '0' },
  { label: t('views.application.aiCreate.datasetForm.typeWeb'), value: '1' }
]
const aiEmbeddingModels = ref<Array<{ label: string; value: string }>>([])
const aiEmbeddingModelsLoading = ref(false)
const aiDatasetForm = reactive({
  name: '',
  desc: '',
  type: '0',
  embedding_mode_id: ''
})
const aiDatasetSubmitting = ref(false)
const aiDatasetList = ref<any[]>([])
const aiDatasetListLoading = ref(false)
const aiDatasetStep = ref<'form' | 'upload' | 'done'>('form')
const aiDatasetUploadDataset = ref<any | null>(null)
const aiDatasetUploadFiles = ref<UploadFile[]>([])
const aiDatasetUploadRef = ref<UploadInstance>()
const aiDatasetUploadLoading = ref(false)
const currentStep = ref(0)

const tutorialSteps = [
  {
    title: 'Create Knowledge Base',
    description: 'Start by creating a new knowledge base to store your data and documents.',
    icon: 'MagicStick',
    image: step1Image
  },
  {
    title: 'Upload Documents',
    description: 'Upload relevant files and documents to populate your knowledge base.',
    icon: 'UploadFilled',
    image: step2Image
  },
  {
    title: 'Create New Application',
    description: 'Build a new application that will utilize the knowledge base you created.',
    icon: 'CirclePlusFilled',
    image: step3Image
  },
  {
    title: 'Configure Application',
    description: 'Set up the application by configuring its settings and parameters.',
    icon: 'Setting',
    image: step4Image
  },
  {
    title: 'Start Using',
    description: 'Launch the application and start using it to achieve your goals.',
    icon: 'VideoPlay',
    image: step5Image
  }
];

const showTutorialDialog = async () => {
  showTutorial.value = true
}

const scrollAiCreateMessages = () => {
  if (aiCreateMessagesRef.value) {
    aiCreateMessagesRef.value.scrollTop = aiCreateMessagesRef.value.scrollHeight
  }
}

const appendAiCreateMessage = (role: 'user' | 'assistant', content: string) => {
  aiCreateMessages.value.push({role, content})
  nextTick(() => {
    scrollAiCreateMessages()
  })
}

const ensureScrollLatest = () => {
  nextTick(() => {
    scrollAiCreateMessages()
  })
}

const getTemplateName = (template: any) => {
  return (
      template?.file_name ||
      template?.stored_name ||
      template?.name ||
      template?.filename ||
      t('views.application.aiCreate.unnamedTemplate')
  )
}

const buildTemplateDownloadUrl = (template: any) => {
  const rawPath = template?.path || template?.relative_path || template?.file_path
  if (!rawPath) {
    return ''
  }
  if (/^https?:\/\//i.test(rawPath)) {
    return rawPath
  }
  const cleaned = rawPath.replace(/^\/+/, '')
  return `${TEMPLATE_BASE_URL}${cleaned}`
}

const initAiCreateMessages = () => {
  aiCreateMessages.value = [
    {
      role: 'assistant',
      content: t('views.application.aiCreate.description')
    },
    {
      role: 'assistant',
      content: t('views.application.aiCreate.templateIntro')
    }
  ]
  nextTick(() => {
    scrollAiCreateMessages()
  })
}

const fetchAiTemplates = () => {
  aiTemplateError.value = ''
  aiTemplates.value = []
  uploadApi
      .listTemplateFiles(undefined, aiTemplatesLoading)
      .then((res: any) => {
        if (res && (res.code === 0 || res.code === 200)) {
          const list = Array.isArray(res.data) ? res.data : res.data?.files || []
          aiTemplates.value = list || []
        } else {
          aiTemplateError.value =
              res?.message || t('views.application.aiCreate.templateLoadFailed')
        }
      })
      .catch((error: any) => {
        aiTemplateError.value =
            error?.response?.data?.message ||
            error?.message ||
            t('views.application.aiCreate.templateLoadFailed')
      })
}

const resetDatasetForm = () => {
  aiDatasetForm.name = ''
  aiDatasetForm.desc = ''
  aiDatasetForm.type = '0'
  aiDatasetForm.embedding_mode_id = ''
}

const resetDatasetUploadState = () => {
  aiDatasetUploadFiles.value = []
  aiDatasetUploadRef.value?.clearFiles?.()
}

const startDatasetUploadFlow = (datasetData: any) => {
  aiDatasetUploadDataset.value = datasetData
  if (datasetData?.id) {
    aiActiveDatasetId.value = datasetData.id
  }
  aiDatasetStep.value = 'upload'
  aiDatasetUploadLoading.value = false
  resetDatasetUploadState()
}

const buildDatasetDocuments = (splitList: any[]) => {
  if (!Array.isArray(splitList)) {
    return []
  }
  return splitList.map((item, index) => {
    const fallbackName = t('views.application.aiCreate.datasetUpload.documentName', {index: index + 1})
    const name = typeof item?.name === 'string' && item.name.trim() ? item.name : fallbackName
    const paragraphs = Array.isArray(item?.content)
        ? item.content
        : Array.isArray(item?.paragraphs)
            ? item.paragraphs
            : []
    return {
      name,
      paragraphs
    }
  })
}

const handleDatasetUploadChange = (_uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  aiDatasetUploadFiles.value = uploadFiles
}

const handleDatasetUploadRemove = (_uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  aiDatasetUploadFiles.value = uploadFiles
}

const askForAdditionalFiles = async () => {
  resetDatasetUploadState()
  const datasetName = aiDatasetUploadDataset.value?.name || '-'
  try {
    await MsgConfirm(
        t('views.application.aiCreate.datasetUpload.moreTitle'),
        t('views.application.aiCreate.datasetUpload.moreMessage', {name: datasetName}),
        {
          confirmButtonText: t('views.application.aiCreate.datasetUpload.moreConfirm'),
          cancelButtonText: t('views.application.aiCreate.datasetUpload.moreCancel'),
          distinguishCancelAndClose: true
        }
    )
    aiDatasetStep.value = 'upload'
  } catch {
    aiDatasetStep.value = 'done'
    appendAiCreateMessage(
        'assistant',
        t('views.application.aiCreate.datasetUpload.continueMessage', {name: datasetName})
    )
  } finally {
    ensureScrollLatest()
  }
}

const submitDatasetUpload = async () => {
  if (!aiDatasetUploadDataset.value?.id) {
    MsgError(t('views.application.aiCreate.datasetUpload.missingDataset'))
    return
  }
  if (aiDatasetUploadFiles.value.length === 0) {
    MsgError(t('views.application.aiCreate.datasetUpload.fileRequired'))
    return
  }
  const formData = new FormData()
  aiDatasetUploadFiles.value.forEach((file) => {
    if (file?.raw) {
      formData.append('file', file.raw)
    }
  })
  formData.append('dataset_id', aiDatasetUploadDataset.value.id)
  aiDatasetUploadLoading.value = true
  const token = user.getToken ? user.getToken() : localStorage.getItem('token')
  let splitSucceeded = false
  try {
    const splitResponse = await axios.post('/api/dataset/document/split', formData, {
      headers: {
        ...(token ? {authorization: token} : {}),
        'Content-Type': 'multipart/form-data'
      }
    })
    const splitList = splitResponse?.data?.data || []
    const documentsPayload = buildDatasetDocuments(splitList)
    if (documentsPayload.length === 0) {
      MsgError(t('views.application.aiCreate.datasetUpload.empty'))
      return
    }
    splitSucceeded = true
    await axios.post(
        `/api/dataset/${aiDatasetUploadDataset.value.id}/document/_bach`,
        documentsPayload,
        token ? {headers: {authorization: token}} : undefined
    )
    const datasetName = aiDatasetUploadDataset.value?.name || '-'
    MsgSuccess(t('views.application.aiCreate.datasetUpload.success', {name: datasetName}))
    appendAiCreateMessage(
        'assistant',
        t('views.application.aiCreate.datasetUpload.successMessage', {name: datasetName})
    )
    await askForAdditionalFiles()
  } catch (error: any) {
    const fallbackMessage = splitSucceeded
        ? t('views.application.aiCreate.datasetUpload.saveFailed')
        : t('views.application.aiCreate.datasetUpload.failed')
    MsgError(error?.response?.data?.message || error?.message || fallbackMessage)
  } finally {
    aiDatasetUploadLoading.value = false
  }
}

const fetchEmbeddingModels = () => {
  aiEmbeddingModelsLoading.value = true
  const token = user.getToken ? user.getToken() : localStorage.getItem('token')
  axios
      .get('/api/model', {
        params: {model_type: 'EMBEDDING'},
        headers: token ? {authorization: token} : undefined
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || []
        aiEmbeddingModels.value = data.map((item: any) => ({
          label: item.model_name || item.name,
          value: item.id
        }))
      })
      .catch((error) => {
        MsgError(error?.response?.data?.message || error?.message || t('views.application.aiCreate.datasetForm.modelLoadFailed'))
      })
      .finally(() => {
        aiEmbeddingModelsLoading.value = false
      })
}

const fetchDatasetList = () => {
  const token = user.getToken ? user.getToken() : localStorage.getItem('token')
  if (!token) {
    return
  }
  aiDatasetListLoading.value = true
  axios
      .get('/api/dataset/1/30', {
        headers: {
          authorization: token
        }
      })
      .then((res) => {
        const records = res.data?.data?.records || res.data?.records || res.data?.data || []
        aiDatasetList.value = Array.isArray(records) ? records : []
      })
      .catch((error) => {
        MsgError(error?.response?.data?.message || error?.message || t('views.application.aiCreate.datasetListFailed'))
      })
      .finally(() => {
        aiDatasetListLoading.value = false
      })
}

const submitDatasetForm = async () => {
  const name = aiDatasetForm.name.trim()
  const desc = aiDatasetForm.desc.trim()
  if (!name) {
    MsgError(t('views.application.aiCreate.datasetForm.nameRequired'))
    return
  }
  if (!desc) {
    MsgError(t('views.application.aiCreate.datasetForm.descRequired'))
    return
  }
  if (!aiDatasetForm.embedding_mode_id) {
    MsgError(t('views.application.aiCreate.datasetForm.embeddingRequired'))
    return
  }
  aiDatasetSubmitting.value = true
  const token = user.getToken ? user.getToken() : localStorage.getItem('token')
  const payload = {
    name,
    desc,
    type: aiDatasetForm.type,
    embedding_mode_id: aiDatasetForm.embedding_mode_id
  }
  try {
    const response = await axios.post('/api/dataset', payload, token ? {headers: {authorization: token}} : undefined)
    const datasetData = response?.data?.data || null
    if (datasetData?.id) {
      aiActiveDatasetId.value = datasetData.id
    }
    MsgSuccess(t('views.application.aiCreate.datasetForm.success'))
    appendAiCreateMessage('assistant', t('views.application.aiCreate.datasetForm.successMessage', {name}))
    resetDatasetForm()
    fetchDatasetList()
    if (datasetData) {
      startDatasetUploadFlow(datasetData)
      appendAiCreateMessage(
          'assistant',
          t('views.application.aiCreate.datasetUpload.startMessage', {name: datasetData?.name || name})
      )
    }
    ensureScrollLatest()
    return datasetData || response.data
  } catch (error: any) {
    MsgError(error?.response?.data?.message || error?.message || t('views.application.aiCreate.datasetForm.failed'))
  } finally {
    aiDatasetSubmitting.value = false
  }
  return null
}

const updateBaseNodeForm = (detailData: any) => {
  const baseNode = detailData?.work_flow?.nodes?.find((node: any) => node.id === 'base-node')
  aiBaseNodeForm.name = baseNode?.properties?.name || baseNode?.name || ''
  aiBaseNodeForm.email =
      baseNode?.properties?.email ||
      baseNode?.node_data?.email ||
      baseNode?.properties?.node_data?.email ||
      ''
  aiBaseNodeForm.prologue = baseNode?.properties?.prologue || ''
}

const loadSelectedAppDetail = async (app: any) => {
  if (!app) {
    return null
  }
  aiAppDetailLoading.value = true
  try {
    const detail: any = await application.asyncGetApplicationDetail(app.id)
    if (!detail?.data) {
      throw new Error(t('views.application.aiCreate.appDetailFailed'))
    }
    aiAppDetail.value = detail.data
    aiAppNameInput.value = detail.data.name || app.name || ''
    updateBaseNodeForm(detail.data)
    ensureScrollLatest()
    return detail.data
  } catch (error: any) {
    MsgError(
        error?.response?.data?.message ||
        error?.message ||
        t('views.application.aiCreate.appDetailFailed')
    )
    return null
  } finally {
    aiAppDetailLoading.value = false
  }
}

const getSelectedAppDetail = async () => {
  if (!aiSelectedAppForName.value) {
    return null
  }
  if (!aiAppDetail.value || aiAppDetail.value.id !== aiSelectedAppForName.value.id) {
    return await loadSelectedAppDetail(aiSelectedAppForName.value)
  }
  return aiAppDetail.value
}

const openAppNameSetting = (app: any) => {
  aiSelectedAppForName.value = app
  aiAppNameInput.value = app?.name || ''
  aiShowApplicationList.value = false
  appendAiCreateMessage('assistant', t('views.application.aiCreate.appNamePrompt', {name: app.name || t('views.application.aiCreate.unnamedTemplate')}))
  loadSelectedAppDetail(app)
  ensureScrollLatest()
}

const confirmAppNameSetting = async () => {
  if (!aiSelectedAppForName.value) {
    return
  }
  const name = aiAppNameInput.value.trim()
  if (!name) {
    MsgError(t('views.application.aiCreate.appNameRequired'))
    return
  }
  aiAppNameLoading.value = true
  try {
    const detailData = await getSelectedAppDetail()
    if (!detailData) {
      throw new Error(t('views.application.aiCreate.appNameFetchFailed'))
    }
    const payload = JSON.parse(JSON.stringify(detailData))
    payload.name = name
    await applicationApi.putApplication(aiSelectedAppForName.value.id, payload)
    MsgSuccess(t('views.application.aiCreate.appNameSuccess', {name}))
    appendAiCreateMessage('assistant', t('views.application.aiCreate.appNameSetMessage', {name}))
    aiSelectedAppForName.value.name = name
    aiAppNameInput.value = name
    aiAppDetail.value = payload
    const appIndex = applicationList.value.findIndex((item: any) => item.id === aiSelectedAppForName.value?.id)
    if (appIndex > -1) {
      applicationList.value[appIndex].name = name
    }
  } catch (error: any) {
    MsgError(
        error?.response?.data?.message ||
        error?.message ||
        t('views.application.aiCreate.appNameFailed')
    )
  } finally {
    aiAppNameLoading.value = false
  }
}

const confirmBaseNodeSetting = async () => {
  if (!aiSelectedAppForName.value) {
    return
  }
  const baseName = aiBaseNodeForm.name.trim()
  const baseEmail = aiBaseNodeForm.email.trim()
  const appName = aiAppNameInput.value.trim()
  if (!aiDatasetUploadDataset.value?.id && !aiActiveDatasetId.value) {
    MsgError(t('views.application.aiCreate.datasetUpload.datasetRequired'))
    return
  }
  if (!baseName) {
    MsgError(t('views.application.aiCreate.baseNodeNameRequired'))
    return
  }
  if (!appName) {
    MsgError(t('views.application.aiCreate.baseNodeAppNameRequired'))
    return
  }
  if (!baseEmail) {
    MsgError(t('views.application.aiCreate.baseNodeEmailRequired'))
    return
  }
  aiBaseNodeSaving.value = true
  try {
    const detailData = await getSelectedAppDetail()
    if (!detailData) {
      throw new Error(t('views.application.aiCreate.baseNodeFetchFailed'))
    }
    const payload = JSON.parse(JSON.stringify(detailData))
    if (!payload?.work_flow?.nodes) {
      throw new Error(t('views.application.aiCreate.baseNodeMissing'))
    }
    const nodes = payload.work_flow.nodes
    const baseIndex = nodes.findIndex((node: any) => node.id === 'base-node')
    if (baseIndex === -1) {
      throw new Error(t('views.application.aiCreate.baseNodeMissing'))
    }
    nodes[baseIndex].name = baseName
    const nodeData = nodes[baseIndex].properties?.node_data || nodes[baseIndex].node_data || {}
    const updatedNodeData = {
      ...nodeData,
      name: baseName,
      prologue: aiBaseNodeForm.prologue || nodeData.prologue,
      email: baseEmail || nodeData.email
    }
    nodes[baseIndex].properties = {
      ...(nodes[baseIndex].properties || {}),
      name: baseName,
      prologue: aiBaseNodeForm.prologue,
      email: baseEmail,
      node_data: updatedNodeData
    }
    nodes[baseIndex].node_data = updatedNodeData

    const datasetId = aiActiveDatasetId.value || aiDatasetUploadDataset.value?.id || ''
    const searchNodes = nodes.filter((node: any) => node.type === 'search-dataset-node')
    if (searchNodes.length > 0 && !datasetId) {
      throw new Error(t('views.application.aiCreate.datasetUpload.datasetRequired'))
    }
    if (datasetId) {
      searchNodes.forEach((node: any) => {
        const searchNodeData = node.properties?.node_data || node.node_data || {}
        const mergedNodeData = {
          ...searchNodeData,
          dataset_id_list: [datasetId],
          source_dataset_id_list: [datasetId]
        }
        node.properties = {
          ...(node.properties || {}),
          node_data: mergedNodeData
        }
        node.node_data = mergedNodeData
      })
    }

    const emailNode = nodes.find((node: any) => node.id === EMAIL_NODE_ID)
    if (emailNode) {
      const emailNodeData = emailNode.properties?.node_data || emailNode.node_data || {}
      const updateRecipientInput = (list: any[]) => {
        if (!Array.isArray(list)) {
          return list
        }
        let hasRecipientField = false
        const mapped = list.map((item: any) => {
          if (item?.name === 'recipient') {
            hasRecipientField = true
            return {
              ...item,
              value: baseEmail
            }
          }
          return item
        })
        if (!hasRecipientField) {
          mapped.push({
            name: 'recipient',
            type: 'string',
            value: baseEmail,
            source: 'custom',
            is_required: true
          })
        }
        return mapped
      }
      if (Array.isArray(emailNodeData.recipient)) {
        if (emailNodeData.recipient.length === 0) {
          emailNodeData.recipient.push({label: '', value: baseEmail})
        } else {
          emailNodeData.recipient = emailNodeData.recipient.map((item: any, index: number) => {
            if (index === 0) {
              if (item && typeof item === 'object') {
                return {
                  ...item,
                  value: baseEmail
                }
              }
              return {label: '', value: baseEmail}
            }
            return item
          })
        }
      } else if (emailNodeData.recipient && typeof emailNodeData.recipient === 'object') {
        emailNodeData.recipient = {
          ...emailNodeData.recipient,
          value: baseEmail
        }
      } else {
        emailNodeData.recipient = baseEmail
      }
      emailNodeData.input_field_list = updateRecipientInput(emailNodeData.input_field_list || [])
      emailNode.properties = {
        ...(emailNode.properties || {}),
        node_data: emailNodeData,
        input_field_list: updateRecipientInput(emailNode.properties?.input_field_list || [])
      }
      emailNode.node_data = emailNodeData
    }

    payload.work_flow.nodes = nodes
    const trimmedWorkFlow = {
      nodes,
      edges: payload.work_flow?.edges || []
    }
    const applicationId = aiSelectedAppForName.value.id
    const payloadData = {
      work_flow: trimmedWorkFlow
    }
    await applicationApi.putApplication(applicationId, payloadData)
    const token = user.getToken ? user.getToken() : localStorage.getItem('token')
    await axios.put(
        `/api/application/${applicationId}/publish`,
        payloadData,
        token ? {headers: {authorization: `${token}`}} : {}
    )

    MsgSuccess(t('views.application.aiCreate.baseNodeSuccess'))
    appendAiCreateMessage('assistant', t('views.application.aiCreate.baseNodeSetMessage', {name: baseName}))
    aiAppDetail.value = {
      ...detailData,
      work_flow: trimmedWorkFlow
    }
    window.location.reload()
  } catch (error: any) {
    MsgError(
        error?.response?.data?.message ||
        error?.message ||
        t('views.application.aiCreate.baseNodeFailed')
    )
  } finally {
    aiBaseNodeSaving.value = false
  }
}

const handleTemplateSelect = async (template: any) => {
  if (!template || aiTemplateProcessing.value) {
    return
  }
  const name = getTemplateName(template)
  const url = buildTemplateDownloadUrl(template)
  if (!url) {
    MsgError(t('views.application.aiCreate.templateMissingPath'))
    return
  }
  aiTemplateProcessing.value = true
  aiTemplateError.value = ''
  aiTemplatePayload.value = null
  appendAiCreateMessage('user', t('views.application.aiCreate.templateSelected', {name}))
  try {
    const downloadResp = await axios.get(url, {responseType: 'blob'})
    const fileName = getTemplateName(template)
    const formData = new FormData()
    formData.append('file', downloadResp.data, fileName)
    const importResp = await applicationApi.importApplication(formData)
    if (importResp && (importResp.code === 0 || importResp.code === 200)) {
      aiSelectedTemplate.value = template
      aiTemplatePayload.value = importResp.data || true
      appendAiCreateMessage('assistant', t('views.application.aiCreate.templateConfirm', {name}))
      MsgSuccess(t('views.application.aiCreate.templateImportSuccess', {name}))
      MsgAlert(t('views.application.aiCreate.datasetReminderTitle'), t('views.application.aiCreate.datasetReminder'), {
        confirmButtonText: t('common.confirm')
      })
      aiShowApplicationList.value = true
      aiSelectedAppForName.value = importResp.data || template
      aiAppNameInput.value = aiSelectedAppForName.value?.name || ''
      if (aiSelectedAppForName.value?.id) {
        loadSelectedAppDetail(aiSelectedAppForName.value)
      }
      ensureScrollLatest()
      searchHandle()
    } else {
      throw new Error(importResp?.message || t('views.application.aiCreate.templateImportFailed'))
    }
  } catch (error: any) {
    aiSelectedTemplate.value = null
    aiTemplatePayload.value = null
    const message =
        error?.response?.data?.message ||
        error?.message ||
        t('views.application.aiCreate.templateFetchFailed')
    MsgError(message)
    appendAiCreateMessage(
        'assistant',
        t('views.application.aiCreate.templateFetchFailedMessage', {name})
    )
  } finally {
    aiTemplateProcessing.value = false
  }
}

const resetAiCreateDialogState = () => {
  aiCreatePrompt.value = ''
  aiCreateMessages.value = []
  aiTemplates.value = []
  aiTemplateError.value = ''
  aiSelectedTemplate.value = null
  aiTemplatesLoading.value = false
  aiTemplateProcessing.value = false
  aiTemplatePayload.value = null
  aiShowApplicationList.value = false
  aiSelectedAppForName.value = null
  aiAppNameInput.value = ''
  aiAppNameLoading.value = false
  aiAppDetail.value = null
  aiAppDetailLoading.value = false
  aiBaseNodeForm.name = ''
  aiBaseNodeForm.email = ''
  aiBaseNodeForm.prologue = ''
  aiBaseNodeSaving.value = false
  aiActiveDatasetId.value = ''
  aiDatasetStep.value = 'form'
  aiDatasetUploadDataset.value = null
  resetDatasetUploadState()
  aiDatasetUploadLoading.value = false
  resetDatasetForm()
}

const openAiCreateDialog = () => {
  aiCreateDialogVisible.value = true
  if (!aiDialogInitialized.value) {
    resetAiCreateDialogState()
    initAiCreateMessages()
    fetchAiTemplates()
    fetchEmbeddingModels()
    fetchDatasetList()
    aiDialogInitialized.value = true
  }
}

const closeAiCreateDialog = () => {
  aiCreateDialogVisible.value = false
}

const createApplicationViaAiChat = () => {
  createAiChatDialogVisible.value = true
}

const handleAiCreateSubmit = () => {
  const content = aiCreatePrompt.value.trim()
  if (!content) {
    return
  }
  if (!aiSelectedTemplate.value) {
    MsgError(t('views.application.aiCreate.templateRequired'))
    return
  }
  if (!aiTemplatePayload.value) {
    MsgError(t('views.application.aiCreate.templateNotReady'))
    return
  }
  appendAiCreateMessage('user', content)
  aiCreatePrompt.value = ''
  appendAiCreateMessage('assistant', t('views.application.aiCreate.comingSoon'))
}


function copyApplication(row: any) {
  application.asyncGetApplicationDetail(row.id, loading).then((res: any) => {
    if (res?.data) {
      CopyApplicationDialogRef.value.open({...res.data, model_id: res.data.model})
    }
  })
}

const is_show_copy_button = (row: any) => {
  return user.userInfo ? user.userInfo.id == row.user_id : false
}

function settingApplication(row: any) {
  if (isWorkFlow(row.type)) {
    router.push({path: `/application/${row.id}/workflow`})
  } else {
    router.push({path: `/application/${row.id}/${row.type}/setting`})
  }
}

const exportApplication = (application: any) => {
  applicationApi.exportApplication(application.id, application.name, loading).catch((e) => {
    if (e.response.status !== 403) {
      e.response.data.text().then((res: string) => {
        MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`)
      })
    }
  })
}
const importApplication = (file: any) => {
  const formData = new FormData()
  formData.append('file', file.raw, file.name)
  elUploadRef.value.clearFiles()
  applicationApi
      .importApplication(formData, loading)
      .then(async () => {
        searchHandle()
      })
      .catch((e) => {
        if (e.code === 400) {
          MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
            cancelButtonText: t('common.confirm'),
            confirmButtonText: t('common.professional')
          }).then(() => {
            window.open('https://LLM-Know.cn/pricing.html', '_blank')
          })
        }
      })
}

function openCreateDialog() {
  common
      .asyncGetValid(ValidType.Application, ValidCount.Application, loading)
      .then(async (res: any) => {
        if (res?.data) {
          CreateApplicationDialogRef.value.open()
        } else if (res?.code === 400) {
          MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
            cancelButtonText: t('common.confirm'),
            confirmButtonText: t('common.professional')
          }).then(() => {
            window.open('https://LLM-Know.cn/pricing.html', '_blank')
          })
        }
      })
}

function searchHandle() {
  if (user.userInfo) {
    localStorage.setItem(user.userInfo.id + 'application', selectUserId.value)
  }
  applicationList.value = []
  paginationConfig.current_page = 1
  paginationConfig.total = 0
  getList()
}

const onAiChatImportSuccess = () => {
  searchHandle()
}

function mapToUrlParams(map: any[]) {
  const params = new URLSearchParams()

  map.forEach((item: any) => {
    params.append(encodeURIComponent(item.name), encodeURIComponent(item.value))
  })

  return params.toString() // 返回 URL 查询字符串
}

function getAccessToken(id: string) {
  applicationList.value
      .filter((app) => app.id === id)[0]
      ?.work_flow?.nodes?.filter((v: any) => v.id === 'base-node')
      .map((v: any) => {
        apiInputParams.value = v.properties.api_input_field_list
            ? v.properties.api_input_field_list.map((v: any) => {
              return {
                name: v.variable,
                value: v.default_value
              }
            })
            : v.properties.input_field_list
                ? v.properties.input_field_list
                    .filter((v: any) => v.assignment_method === 'api_input')
                    .map((v: any) => {
                      return {
                        name: v.variable,
                        value: v.default_value
                      }
                    })
                : []
      })

  const apiParams = mapToUrlParams(apiInputParams.value)
      ? '?' + mapToUrlParams(apiInputParams.value)
      : ''
  application.asyncGetAccessToken(id, loading).then((res: any) => {
    window.open(application.location + res?.data?.access_token + apiParams)
  })
}

function deleteApplication(row: any) {
  MsgConfirm(
      // @ts-ignore
      `${t('views.application.delete.confirmTitle')}${row.name} ?`,
      t('views.application.delete.confirmMessage'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        confirmButtonClass: 'danger'
      }
  )
      .then(() => {
        applicationApi.delApplication(row.id, loading).then(() => {
          const index = applicationList.value.findIndex((v) => v.id === row.id)
          applicationList.value.splice(index, 1)
          MsgSuccess(t('common.deleteSuccess'))
        })
      })
      .catch(() => {
      })
}

function getList() {
  const params = {
    ...(searchValue.value && {name: searchValue.value}),
    ...(selectUserId.value &&
        selectUserId.value !== 'all' && {select_user_id: selectUserId.value})
  }
  applicationApi.getApplication(paginationConfig, params, loading).then((res) => {
    res.data.records.forEach((item: any) => {
      if (user.userInfo && item.user_id === user.userInfo.id) {
        item.username = user.userInfo.username
      } else {
        item.username = userOptions.value.find((v) => v.value === item.user_id)?.label
      }
    })
    applicationList.value = [...applicationList.value, ...res.data.records]
    paginationConfig.total = res.data.total
  })
}

function getUserList() {
  applicationApi.getUserList('APPLICATION', loading).then((res) => {
    if (res.data) {
      userOptions.value = res.data.map((item: any) => {
        return {
          label: item.username,
          value: item.id
        }
      })
      if (user.userInfo) {
        const selectUserIdValue = localStorage.getItem(user.userInfo.id + 'application')
        if (selectUserIdValue && userOptions.value.find((v) => v.value === selectUserIdValue)) {
          selectUserId.value = selectUserIdValue
        }
      }
      getList()
    }
  })
}

onMounted(() => {
  getUserList()
})
</script>
<style lang="scss" scoped>
.application-card-add {
  width: 100%;
  font-size: 14px;
  min-height: var(--card-min-height);
  border: 1px dashed var(--el-border-color);
  background: var(--el-disabled-bg-color);
  border-radius: 8px;
  box-sizing: border-box;

  &:hover {
    border: 1px solid var(--el-card-bg-color);
    background-color: var(--el-card-bg-color);
  }

  .card-add-button {
    &:hover {
      border-radius: 4px;
      background: var(--app-text-color-light-1);
    }

    :deep(.el-upload) {
      display: block;
      width: 100%;
      color: var(--el-text-color-regular);
    }
  }
}

.application-card {
  .status-tag {
    position: absolute;
    right: 16px;
    top: 15px;
  }
}

.dropdown-custom-switch {
  padding: 5px 11px;
  font-size: 14px;
  font-weight: 400;

  span {
    margin-right: 26px;
  }
}

// 样式优化
.tutorial-card {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    .play-overlay {
      opacity: 1;
    }
  }

  .tutorial-cover {
    position: relative;
    border-radius: 8px;
    overflow: hidden;

    .cover-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
  }

  .step-preview {

    padding: 0;
    margin-top: 10px;

    .step-item {
      flex: 1;

      flex-direction: column;
      padding: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .step-text {
        margin-left: 8px;
        text-align: center;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.video-section {
  flex: 2;
  min-width: 60%;

  video {
    width: 100%;
    border-radius: 8px;
  }
}

.tutorial-content {
  gap: 24px;

  .manual-section {
    flex: 1;
    padding: 20px 0px;
    background: var(--el-fill-color-light);
    border-radius: 8px;

    .el-steps {
      padding: 12px;
    }
  }
}


.tutorial-dialog {
  .tutorial-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .manual-section {
      order: 1; // 移动端优先显示步骤
    }

    .video-section {
      order: 2;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .custom-steps {
      --el-step-line-color: #e4e7ed;
      padding: 0 1rem;

      :deep(.el-step__head):last-child {
        display: none;
      }

      :deep(.el-step__head) {
        width: auto;
        padding-bottom: 70px;


        &.is-process {
          color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }
      }

      :deep(.el-step__main) {
        padding-left: 35px;
      }

      .step-item {
        margin-bottom: 2rem;
        transition: all 0.3s ease;

        &:last-child {
          margin-bottom: 0;
        }

        .step-icon-wrapper {
          position: relative;
          width: 40px;
          height: 40px;

          .step-icon {
            width: 100%;
            height: 100%;
            font-size: 25px;
            color: #fff;
            padding: 8px;
            border-radius: 50%;
            background: var(--el-color-primary-light-5);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .step-number {
            position: relative;
            bottom: -25px;
            right: -18px;
            background: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: var(--el-color-primary);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .step-number {
            display: none;
          }
        }

        .step-title {
          font-weight: 600;
          margin: 8px 0;
          color: #303133;
          font-size: 15px;
        }

        .step-description {
          color: #606266;
          font-size: 13px;
          line-height: 1.6;
          padding-right: 15px;

          .step-image {
            margin-top: 12px;
            width: 100%;
            max-width: 280px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }

        &.active-step {
          .step-icon {
            background: var(--el-color-primary);
            transform: scale(1.05);
          }
        }
      }

      :deep(.el-step__line) {
        left: 19px;
        top: 40px;
        bottom: -22px;
      }
    }
  }
}

.ai-create-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px;
  }

  :deep(.el-dialog__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
  }
}

.ai-create-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.ai-create-dialog__body {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  background: #f5f7fa;
  padding: 16px;
  overflow: hidden;
}

.ai-create-dialog__messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 4px;
}

.ai-create-dialog__template-panel {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.ai-create-dialog__template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}

.ai-create-dialog__template-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.ai-create-dialog__template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.ai-create-dialog__template-card {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  background: #fdfdfd;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-create-dialog__template-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.ai-create-dialog__template-card .card-title {
  font-weight: 600;
  color: #303133;
}

.ai-create-dialog__template-card .card-desc {
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
}

.ai-create-dialog__template-card .card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.ai-create-dialog__name-panel {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-create-dialog__name-panel .name-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.ai-create-dialog__name-panel .name-panel-tip {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.ai-create-dialog__name-panel .name-panel-form {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-create-dialog__dataset-panel {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
}

.dataset-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dataset-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.dataset-panel-tip {
  margin: 8px 0 16px;
  color: #606266;
  font-size: 13px;
}

.dataset-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.dataset-upload-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dataset-upload-dragger {
  width: 100%;
}

.dataset-upload-dragger :deep(.el-upload-dragger) {
  padding: 24px;
  border-radius: 12px;
  border-style: dashed;
}

.dataset-upload-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.dataset-upload-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 6px;
}

.dataset-upload-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.dataset-upload-actions {
  display: flex;
  justify-content: flex-end;
}

.dataset-upload-finished {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dataset-upload-finished__icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(103, 194, 58, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dataset-upload-finished__icon .el-icon {
  font-size: 22px;
  color: var(--el-color-success);
}

.ai-create-dialog__app-list {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-create-dialog__app-list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}

.ai-create-dialog__app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.ai-create-dialog__app-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 14px;
  background: #fdfdfd;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
}

.ai-create-dialog__app-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  transition: all 0.3s ease;
}

.slide-horizontal-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-horizontal-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.ai-create-dialog__app-card .app-card-header {
  display: flex;
  align-items: center;
}

.ai-create-dialog__app-card .app-name {
  font-weight: 600;
  color: #303133;
}

.ai-create-dialog__app-card .app-author {
  font-size: 12px;
  color: #909399;
}

.ai-create-dialog__app-card .app-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
  min-height: 36px;
}

.ai-create-dialog__app-card .app-meta {
  display: flex;
  justify-content: flex-end;
}

.required-label {
  color: #f56c6c;
  font-size: 14px;
}

.create-ai-chat-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.create-ai-chat-dialog__body {
  width: 100%;
  height: 80vh;
}

.create-ai-chat-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
}

.base-node-form {
  margin-top: 12px;
  padding-top: 12px;
}

@media screen and (max-width: 768px) {
  .ai-create-dialog__body {
    padding: 12px 10px;
  }

  .ai-create-dialog__footer {
    padding: 12px;
  }

  .ai-create-dialog__submit {
    min-width: 90px;
  }

  .ai-create-dialog__bubble {
    max-width: 100%;
  }

  .ai-create-dialog__template-grid {
    grid-template-columns: 1fr;
  }

  .ai-create-dialog__app-grid {
    grid-template-columns: 1fr;
  }

  .ai-create-dialog__name-panel .name-panel-form {
    flex-direction: column;
    align-items: stretch;
  }
}

</style>
