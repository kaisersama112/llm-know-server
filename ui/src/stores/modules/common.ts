import { defineStore } from 'pinia'
import { DeviceType, ValidType } from '@/enums/common'
import type { Ref } from 'vue'
import userApi from '@/api/system/user-manage'

export interface commonTypes {
  breadcrumb: any
  paginationConfig: any | null
  search: any
  device: string
  mobileMenuOpen: boolean
}

const useCommonStore = defineStore('common',{
  state: (): commonTypes => ({
    breadcrumb: null,
    // 搜索和分页缓存
    paginationConfig: {},
    search: {},
    device: DeviceType.Desktop,
    mobileMenuOpen: false
  }),
  actions: {
    saveBreadcrumb(data: any) {
      this.breadcrumb = data
    },
    savePage(val: string, data: any) {
      this.paginationConfig[val] = data
    },
    saveCondition(val: string, data: any) {
      this.search[val] = data
    },
    toggleDevice(value: DeviceType) {
      this.device = value
    },
    isMobile() {
      return this.device === DeviceType.Mobile || this.device === 'mobile'
    },
    async asyncGetValid(valid_type: ValidType, valid_count: number, loading?: Ref<boolean>) {
      return new Promise((resolve, reject) => {
        userApi
          .getValid(valid_type, valid_count, loading)
          .then((data) => {
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    
    // 切换移动端菜单状态
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    
    // 关闭移动端菜单
    closeMobileMenu() {
      this.mobileMenuOpen = false
    }
  }
})

export default useCommonStore
