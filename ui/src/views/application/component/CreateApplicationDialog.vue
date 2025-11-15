<template>
  <el-dialog
    :title="$t('views.application.createApplication')"
    v-model="dialogVisible"
    width="650"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="applicationFormRef"
      :model="applicationForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      @submit.prevent
    >
      <el-form-item :label="$t('views.application.applicationForm.form.appName.label')" prop="name">
        <el-input
          v-model="applicationForm.name"
          maxlength="64"
          :placeholder="$t('views.application.applicationForm.form.appName.placeholder')"
          show-word-limit
          @blur="applicationForm.name = applicationForm.name?.trim()"
        />
      </el-form-item>
      <el-form-item :label="$t('views.application.applicationForm.form.appDescription.label')">
        <el-input
          v-model="applicationForm.desc"
          type="textarea"
          :placeholder="$t('views.application.applicationForm.form.appDescription.placeholder')"
          :rows="3"
          maxlength="256"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('views.application.applicationForm.form.appType.label')">
        <el-radio-group v-model="applicationForm.type" class="card__radio">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-card shadow="never" :class="applicationForm.type === 'SIMPLE' ? 'active' : ''">
                <el-radio value="SIMPLE" size="large">
                  <p class="mb-4">{{ $t('views.application.simple') }}</p>
                  <el-text type="info">{{
                    $t('views.application.applicationForm.form.appType.simplePlaceholder')
                  }}</el-text>
                </el-radio>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never" :class="isWorkFlow(applicationForm.type) ? 'active' : ''">
                <el-radio value="WORK_FLOW" size="large">
                  <p class="mb-4">{{ $t('views.application.workflow') }}</p>
                  <el-text type="info">{{
                    $t('views.application.applicationForm.form.appType.workflowPlaceholder')
                  }}</el-text>
                </el-radio>
              </el-card>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('views.document.upload.template')"
        v-if="applicationForm.type === 'WORK_FLOW'"
      >
        <div class="w-full">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-card
                class="radio-card cursor"
                shadow="never"
                @click="selectedType('blank')"
                :class="appTemplate === 'blank' ? 'active' : ''"
              >
                {{ $t('views.application.applicationForm.form.appTemplate.blankApp') }}
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card
                class="radio-card cursor"
                shadow="never"
                :class="appTemplate === 'assistant' ? 'active' : ''"
                @click="selectedType('assistant')"
              >
                {{ $t('views.application.applicationForm.form.appTemplate.assistantApp') }}
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card
                class="radio-card cursor"
                shadow="never"
                :class="appTemplate === 'ecommerce' ? 'active' : ''"
                @click="selectedType('ecommerce')"
              >
                {{ $t('views.application.applicationForm.form.appTemplate.ecommerceApp') }}
              </el-card>
            </el-col>
          </el-row>
        </div>
        <el-alert
          type="info"
          :closable="false"
          style="margin-top: 16px"
        >
          <template #default>
            {{ $t('views.application.applicationForm.form.appTemplate.pcSetupReminder') }}
          </template>
        </el-alert>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.prevent="dialogVisible = false" :loading="loading">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitHandle(applicationFormRef)" :loading="loading">
          {{ $t('common.create') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ApplicationFormType } from '@/api/type/application'
import type { FormInstance, FormRules } from 'element-plus'
import applicationApi from '@/api/application'
import { MsgSuccess, MsgError, MsgConfirm } from '@/utils/message'
import { isWorkFlow } from '@/utils/application'
import { baseNodes } from '@/workflow/common/data'
import { t } from '@/locales'
const router = useRouter()
const emit = defineEmits(['refresh'])

// @ts-ignore
const defaultPrompt = t('views.application.applicationForm.form.prompt.defaultPrompt', {
  data: '{data}',
  question: '{question}'
})

const optimizationPrompt =
  t('views.application.applicationForm.dialog.defaultPrompt1', {
    question: '{question}'
  }) +
  '<data></data>' +
  t('views.application.applicationForm.dialog.defaultPrompt2')

const workflowDefault = ref<any>({
  edges: [],
  nodes: baseNodes
})
const appTemplate = ref('blank')

const applicationFormRef = ref()

const loading = ref(false)
const dialogVisible = ref<boolean>(false)

const applicationForm = ref<ApplicationFormType>({
  name: '',
  desc: '',
  model_id: '',
  dialogue_number: 1,
  prologue: t('views.application.applicationForm.form.defaultPrologue'),
  dataset_id_list: [],
  dataset_setting: {
    top_n: 3,
    similarity: 0.6,
    max_paragraph_char_number: 5000,
    search_mode: 'embedding',
    no_references_setting: {
      status: 'ai_questioning',
      value: '{question}'
    }
  },
  model_setting: {
    prompt: defaultPrompt,
    system: t('views.application.applicationForm.form.roleSettings.placeholder'),
    no_references_prompt: '{question}'
  },
  model_params_setting: {},
  problem_optimization: false,
  problem_optimization_prompt: optimizationPrompt,
  stt_model_id: '',
  tts_model_id: '',
  stt_model_enable: false,
  tts_model_enable: false,
  tts_type: 'BROWSER',
  type: 'SIMPLE'
})

const rules = reactive<FormRules<ApplicationFormType>>({
  name: [
    {
      required: true,
      message: t('views.application.applicationForm.form.appName.placeholder'),
      trigger: 'blur'
    }
  ],
  model_id: [
    {
      required: false,
      message: t('views.application.applicationForm.form.aiModel.placeholder'),
      trigger: 'change'
    }
  ]
})

watch(dialogVisible, (bool) => {
  if (!bool) {
    applicationForm.value = {
      name: '',
      desc: '',
      model_id: '',
      dialogue_number: 1,
      prologue: t('views.application.applicationForm.form.defaultPrologue'),
      dataset_id_list: [],
      dataset_setting: {
        top_n: 3,
        similarity: 0.6,
        max_paragraph_char_number: 5000,
        search_mode: 'embedding',
        no_references_setting: {
          status: 'ai_questioning',
          value: '{question}'
        }
      },
      model_setting: {
        prompt: defaultPrompt,
        system: t('views.application.applicationForm.form.roleSettings.placeholder'),
        no_references_prompt: '{question}'
      },
      model_params_setting: {},
      problem_optimization: false,
      problem_optimization_prompt: optimizationPrompt,
      stt_model_id: '',
      tts_model_id: '',
      stt_model_enable: false,
      tts_model_enable: false,
      tts_type: 'BROWSER',
      type: 'SIMPLE'
    }
    appTemplate.value = 'blank'
    applicationFormRef.value?.clearValidate()
  }
})

const open = () => {
  dialogVisible.value = true
}

const createApplicationFromTemplate = async () => {
  loading.value = true
  try {
    const templateUrl = '/static/ai_template.mk'
    const response = await fetch(templateUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`)
    }
    const blob = await response.blob()
    if (!blob || blob.size === 0) {
      throw new Error('Template file is empty')
    }
    const fileName = 'ai_template.mk'
    const templateFile = new File([blob], fileName, { type: blob.type || 'application/octet-stream' })
    const formData = new FormData()
    formData.append('file', templateFile, templateFile.name)
    const importRes = await applicationApi.importApplication(formData)
    const appInfo = importRes?.data || importRes
    const applicationMeta =
      appInfo?.application || appInfo?.data || appInfo?.result || appInfo?.value || appInfo
    const applicationId =
      applicationMeta?.id ||
      applicationMeta?.application_id ||
      applicationMeta?.applicationId ||
      applicationMeta?.application?.id
    if (!applicationId) {
      console.warn('AI template imported but application id missing in response', importRes)
      MsgSuccess(t('common.createSuccess'))
      emit('refresh')
      dialogVisible.value = false
      return
    }

    if (applicationForm.value.name || applicationForm.value.desc) {
      try {
        const detailRes: any = await applicationApi.getApplicationDetail(applicationId)
        if (detailRes?.data) {
          const detail = detailRes.data
          const workFlow = detail.work_flow ? JSON.parse(JSON.stringify(detail.work_flow)) : undefined
          if (workFlow?.nodes?.length) {
            const baseNode = workFlow.nodes.find((node: any) => node.id === 'base-node')
            if (baseNode?.properties?.node_data) {
              baseNode.properties.node_data.name = applicationForm.value.name
              baseNode.properties.node_data.desc = applicationForm.value.desc
            }
          }
          const updatePayload: Record<string, any> = {
            name: applicationForm.value.name,
            desc: applicationForm.value.desc,
            dialogue_number: detail.dialogue_number,
            prologue: detail.prologue,
            model_id: detail.model_id,
            dataset_setting: detail.dataset_setting,
            model_setting: detail.model_setting,
            problem_optimization: detail.problem_optimization,
            problem_optimization_prompt: detail.problem_optimization_prompt,
            model_params_setting: detail.model_params_setting,
            tts_model_params_setting: detail.tts_model_params_setting,
            stt_model_id: detail.stt_model_id,
            tts_model_id: detail.tts_model_id,
            stt_model_enable: detail.stt_model_enable,
            tts_model_enable: detail.tts_model_enable,
            tts_type: detail.tts_type,
            work_flow: workFlow,
            file_upload_enable: detail.file_upload_enable,
            file_upload_setting: detail.file_upload_setting,
            dataset_id_list: detail.dataset_id_list
          }
          await applicationApi.putApplication(applicationId, updatePayload)
        }
      } catch (error) {
        console.error('Failed to update imported application', error)
      }
    }
    MsgSuccess(t('common.createSuccess'))
    emit('refresh')
    router.push({ path: `/application/${applicationId}/workflow` })
    dialogVisible.value = false
  } catch (error: any) {
    if (error?.code === 400) {
      MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
        cancelButtonText: t('common.confirm'),
        confirmButtonText: t('common.professional')
      }).then(() => {
        window.open('https://LLM-Know.cn/pricing.html', '_blank')
      })
    } else if (error?.message) {
      MsgError(error.message)
    } else {
      MsgError(t('views.application.applicationForm.form.appTemplate.importFailed'))
    }
  } finally {
    loading.value = false
  }
}

const submitHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
  } catch (error) {
    return
  }
  if (isWorkFlow(applicationForm.value.type) && appTemplate.value === 'ecommerce') {
    await createApplicationFromTemplate()
    return
  }
  if (isWorkFlow(applicationForm.value.type) && appTemplate.value === 'blank') {
    workflowDefault.value.nodes[0].properties.node_data.desc = applicationForm.value.desc
    workflowDefault.value.nodes[0].properties.node_data.name = applicationForm.value.name
    applicationForm.value['work_flow'] = workflowDefault.value
  }
  applicationApi.postApplication(applicationForm.value, loading).then((res) => {
    MsgSuccess(t('common.createSuccess'))
    if (isWorkFlow(applicationForm.value.type)) {
      router.push({ path: `/application/${res.data.id}/workflow` })
    } else {
      router.push({ path: `/application/${res.data.id}/${res.data.type}/setting` })
    }
    dialogVisible.value = false
  })
}

function selectedType(type: string) {
  appTemplate.value = type
}

defineExpose({ open })
</script>
<style lang="scss" scope>
.radio-card {
  line-height: 22px;
  &.active {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
.el-dialog {
  // 移动端适配
  @media screen and (max-width: 768px) {
    width: 100% !important;
    max-width: 100vw;
    margin: 4vh auto !important;
  }
}
// 在现有样式中添加
@media screen and (max-width: 768px) {

  .card__radio {
    .el-text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; // 限制两行
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4; // 优化行高
    }

    // 单选卡片标题适配
    p.mb-4 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90%;
    }
  }
}
</style>
