import axios, { type AxiosProgressEvent } from 'axios'
import { type Ref } from 'vue'
import type { Result } from '@/request/Result'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '') || ''

const uploadUrl = `${API_BASE}/upload`
const deleteUrl = `${API_BASE}/delete_file`
const listUrl = `${API_BASE}/list_files`

const TOKEN_STORAGE_KEYS = ['token', 'accessToken', 'authorization']

const resolveStoredToken = (explicitToken?: string): string => {
  if (explicitToken && explicitToken.trim()) {
    return explicitToken.trim()
  }

  for (const key of TOKEN_STORAGE_KEYS) {
    const fromLocal = localStorage.getItem(key)
    if (fromLocal && fromLocal.trim()) {
      return fromLocal.trim()
    }
    const fromSession = sessionStorage.getItem(key)
    if (fromSession && fromSession.trim()) {
      return fromSession.trim()
    }
  }

  return ''
}

const normalizeToken = (token: string): string => {
  if (!token) {
    return ''
  }
  return token.trim()
}

const buildAuthHeaders = (token?: string): Record<string, string> => {
  const storedToken = resolveStoredToken(token)
  if (!storedToken) {
    return {}
  }
  const normalized = normalizeToken(storedToken)
  return normalized ? { authorization: normalized } : {}
}

const handleError = (label: string, error: any) => {
  const status = error?.response?.status
  const detail = error?.response?.data || error?.message || error
  console.error(`${label}:`, status, detail)
  return {
    code: -1,
    message: typeof detail === 'string' ? detail : error?.message || label,
    data: null
  }
}

const uploadTemplate: (
  data: FormData,
  loading?: Ref<boolean>,
  onProgress?: (percent: number) => void,
  token?: string
) => Promise<Result<any>> = async (data, loading, onProgress, token) => {
  if (loading) {
    loading.value = true
  }
  try {
    const headers = {
      ...(typeof (data as any)?.getHeaders === 'function' ? (data as any).getHeaders() : {}),
      'Content-Type': 'multipart/form-data',
      ...buildAuthHeaders(token)
    }
    const response = await axios.post(uploadUrl, data, {
      headers,
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!onProgress) {
          return
        }
        if (!event.total) {
          onProgress(0)
          return
        }
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(Math.min(percent, 100))
      }
    })
    return {
      code: 0,
      message: 'success',
      data: response.data
    }
  } catch (error: any) {
    return handleError('Upload failed', error)
  } finally {
    if (loading) {
      loading.value = false
    }
  }
}

const deleteTemplate: (
  fileName: string,
  loading?: Ref<boolean>,
  token?: string
) => Promise<Result<any>> = async (fileName, loading, token) => {
  if (!fileName || !fileName.trim()) {
    return Promise.resolve({
      code: -1,
      message: 'invalid filename',
      data: null
    })
  }

  if (loading) {
    loading.value = true
  }
  try {
    const headers = buildAuthHeaders(token)
    
    const query = new URLSearchParams({ filename:  `static/${fileName}` }).toString()
    console.log(query);
    const response = await axios.post(`${deleteUrl}?${query}`, undefined, {
      headers
    })
    console.log('Delete response:', response);
    return {
      code: 0,
      message: 'success',
      data: response.data
    }
  } catch (error: any) {
    return handleError('Delete template failed', error)
  } finally {
    if (loading) {
      loading.value = false
    }
  }
}

const listTemplateFiles: (
  token?: string,
  loading?: Ref<boolean>
) => Promise<Result<any>> = async (token, loading) => {
  if (loading) {
    loading.value = true
  }
  try {
    const resolvedToken = resolveStoredToken(token)
    if (!resolvedToken) {
      return {
        code: -1,
        message: 'missing authorization token',
        data: null
      }
    }
    const authorization = normalizeToken(resolvedToken)
    const response = await axios.get(listUrl, {
      headers: {
        authorization
      }
    })
    return {
      code: 0,
      message: 'success',
      data: response.data
    }
  } catch (error: any) {
    return handleError('List template files failed', error)
  } finally {
    if (loading) {
      loading.value = false
    }
  }
}

const getTemplateInfo: (
  loading?: Ref<boolean>,
  token?: string
) => Promise<Result<any>> = async (loading, token) => {
  if (loading) {
    loading.value = true
  }
  try {
    const headers = buildAuthHeaders(token)
    const response = await axios.get(uploadUrl, {
      headers
    })
    return {
      code: 0,
      message: 'success',
      data: response.data
    }
  } catch (error: any) {
    return handleError('Get template info failed', error)
  } finally {
    if (loading) {
      loading.value = false
    }
  }
}

export default {
  getTemplateInfo,
  uploadTemplate,
  deleteTemplate,
  listTemplateFiles
}
