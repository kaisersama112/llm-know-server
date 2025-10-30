import { Result } from '@/request/Result'
import { type Ref } from 'vue'
import axios, { type AxiosProgressEvent } from 'axios'

/**
 * 上传 AI 模板到 http://47.85.38.66:7005/upload
 */
const uploadTemplate: (
  data: FormData,
  loading?: Ref<boolean>,
  onProgress?: (percent: number) => void
) => Promise<Result<any>> = async (data, loading, onProgress) => {
  if (loading) loading.value = true
  try {
    const response = await axios.post('/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(Math.min(percent, 100))
        }
      },
    })
    return {
      code: 0,
      message: 'success',
      data: response.data,
    }
  } catch (error: any) {
    console.error('Upload failed:', error)
    return {
      code: -1,
      message: error.message || 'Upload error',
      data: null,
    }
  } finally {
    if (loading) loading.value = false
  }
}

/**
 * 获取 AI 模板信息
 * （根据后端接口定义，如果仅 upload 接口存在，可以移除这个函数）
 */
const getTemplateInfo: (loading?: Ref<boolean>) => Promise<Result<any>> = async (loading) => {
  if (loading) loading.value = true
  try {
    const res = await axios.get('http://47.85.38.66:7005/upload')
    return {
      code: 0,
      message: 'success',
      data: res.data,
    }
  } catch (error: any) {
    console.error('Get info failed:', error)
    return {
      code: -1,
      message: error.message || 'Request error',
      data: null,
    }
  } finally {
    if (loading) loading.value = false
  }
}

export default {
  getTemplateInfo,
  uploadTemplate,
}
