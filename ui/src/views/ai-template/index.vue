<template>
  <LayoutContainer :header="$t('views.system.aiTemplate.title')">
    <div class="ai-template-setting main-calc-height">
      <el-scrollbar>
        <div class="p-24" v-loading="loading">
          <el-alert
            type="info"
            :title="$t('views.system.aiTemplate.description')"
            show-icon
            class="mb-16"
          />
          <div class="toolbar">
            <div class="upload-area">
              <el-upload
                ref="uploadRef"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :limit="1"
                :disabled="isUploading"
                accept=".mk"
              >
                <el-button type="primary" :loading="isUploading">
                  {{ $t('views.system.aiTemplate.uploadButton') }}
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    {{ $t('views.system.aiTemplate.uploadTip') }}
                  </div>
                </template>
              </el-upload>
              <el-progress
                v-if="isUploading"
                :percentage="uploadProgress"
                :text-inside="true"
                class="mt-8"
              />
            </div>
            <el-button
              type="default"
              :icon="Refresh"
              :loading="loading"
              @click="handleRefresh"
            >
              {{ $t('common.refresh') }}
            </el-button>
          </div>

          <el-table
            v-if="fileList.length > 0"
            :data="fileList"
            stripe
            border
            class="mt-24"
          >
            <el-table-column
              prop="file_name"
              :label="$t('views.system.aiTemplate.fileName')"
              min-width="200"
            />
            <el-table-column
              prop="relative_path"
              :label="$t('views.system.aiTemplate.filePath')"
              min-width="220"
            >
              <template #default="{ row }">
                {{ row.relative_path || row.path || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="uploaded_at"
              :label="$t('views.system.aiTemplate.uploadedAt')"
              min-width="160"
            >
              <template #default="{ row }">
                {{ row.uploaded_at || row.updated_at || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="uploaded_by"
              :label="$t('views.system.aiTemplate.uploadedBy')"
              min-width="140"
            >
              <template #default="{ row }">
                {{ row.uploaded_by || row.operator || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.operation')"
              width="150"
              align="center"
            >
              <template #default="{ row }">
                <el-popconfirm
                  :title="$t('views.system.aiTemplate.deleteConfirm')"
                  :confirm-button-text="$t('common.confirm')"
                  :cancel-button-text="$t('common.cancel')"
                  @confirm="() => handleDeleteTemplate(row)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      text
                      plain
                      :loading="deletingFile === getFileName(row)"
                      :disabled="isUploading || deletingFile === getFileName(row)"
                    >
                      {{ $t('views.system.aiTemplate.deleteButton') }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-empty
            v-else-if="!loading"
            class="mt-32"
            :description="$t('common.noData')"
          />
        </div>
      </el-scrollbar>
    </div>
  </LayoutContainer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { UploadInstance, UploadProps } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

import uploadApi from '@/api/upload'
import { MsgError, MsgSuccess } from '@/utils/message'
import { t } from '@/locales'

const router = useRouter()
const uploadRef = ref<UploadInstance>()
const loading = ref(false)
const fileList = ref<any[]>([])
const isUploading = ref(false)
const uploadProgress = ref(0)
const deletingFile = ref<string>('')
let unauthorizedHandled = false
let unauthorizedTimer: ReturnType<typeof setTimeout> | null = null

const handleUnauthorized = () => {
  if (unauthorizedHandled) {
    return
  }
  unauthorizedHandled = true
  MsgError('没有权限访问该页面')
  unauthorizedTimer = setTimeout(() => {
    router.replace('/')
    unauthorizedTimer = null
  }, 3000)
}

const fetchTemplateList = () => {
  if (unauthorizedHandled) {
    return
  }
  uploadApi
    .listTemplateFiles(undefined, loading)
    .then((res: any) => {
      if (
        res?.message === '用户未授权' ||
        res?.data === '用户未授权' ||
        res?.code === 401
      ) {
        fileList.value = []
        handleUnauthorized()
        return
      }
      if (res && (res.code === 0 || res.code === 200)) {
        fileList.value = Array.isArray(res.data) ? res.data : res.data?.files || []
      } else {
        fileList.value = []
      }
    })
    .catch((error: any) => {
      if (
        error?.response?.data?.message === '用户未授权' ||
        error?.response?.data === '用户未授权' ||
        error?.message === '用户未授权' ||
        error?.response?.status === 401
      ) {
        handleUnauthorized()
      }
      fileList.value = []
    })
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!rawFile.name.toLowerCase().endsWith('.mk')) {
    MsgError(t('views.system.aiTemplate.invalidFormat'))
    return false
  }

  const formData = new FormData()
  formData.append('file', rawFile)
  isUploading.value = true
  uploadProgress.value = 0
  uploadApi
    .uploadTemplate(
      formData,
      undefined,
      (percent: number) => {
        uploadProgress.value = percent
      }
    )
    .then((res: any) => {
      if (res && (res.code === 0 || res.code === 200)) {
        uploadProgress.value = 100
        MsgSuccess(t('views.system.aiTemplate.uploadSuccess'))
        fetchTemplateList()
      } else {
        MsgError(res?.message || '上传失败，请稍后重试')
      }
    })
    .catch((error: any) => {
      console.error('Upload template failed', error)
      MsgError('上传失败，请稍后重试')
    })
    .finally(() => {
      uploadRef.value?.clearFiles()
      isUploading.value = false
      uploadProgress.value = 0
    })
  return false
}

onMounted(() => {
  fetchTemplateList()
})

onBeforeUnmount(() => {
  if (unauthorizedTimer) {
    clearTimeout(unauthorizedTimer)
    unauthorizedTimer = null
  }
})

const getFileName = (file: any) => {
  return file?.file_name || file?.stored_name || file?.name || file?.filename || ''
}

const handleDeleteTemplate = async (file: any) => {
  const fileName = getFileName(file)
  if (!fileName) {
    MsgError(t('views.system.aiTemplate.deleteFailed'))
    return
  }

  deletingFile.value = fileName

  uploadApi
    .deleteTemplate(fileName)
    .then((res: any) => {
      if (res && (res.code === 0 || res.code === 200)) {
        MsgSuccess(t('views.system.aiTemplate.deleteSuccess'))
        fetchTemplateList()
      } else {
        MsgError(res?.message || t('views.system.aiTemplate.deleteFailed'))
      }
    })
    .catch((error: any) => {
      console.error('Delete template failed', error)
      MsgError(t('views.system.aiTemplate.deleteFailed'))
    })
    .finally(() => {
      deletingFile.value = ''
    })
}

const handleRefresh = () => {
  fetchTemplateList()
}
</script>

<style scoped lang="scss">
.ai-template-setting {
  width: 100%;
  margin: 0 auto;

  :deep(.el-upload__tip) {
    margin-top: 8px;
    color: var(--el-text-color-secondary);
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  .upload-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
