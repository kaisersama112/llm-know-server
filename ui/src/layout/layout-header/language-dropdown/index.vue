<template>
  <el-dropdown trigger="click" type="primary">
    <div class="flex-center cursor" style="white-space: nowrap;">
      <span class="mr-8 color-text-primary" style="display: inline-block; white-space: nowrap;">{{ currentLanguage?.label }}</span>
      <el-icon class="el-icon--right">
        <CaretBottom/>
      </el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu class="language-dropdown">
        <el-dropdown-item
          v-for="language in languages"
          :key="language.value"
          :class="{ active: currentLanguage?.value === language.value }"
          @click="changeLanguage(language.value)"
        >
          <div class="flex-between w-full" style="white-space: nowrap;">
            {{ language.label }}
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CaretBottom } from '@element-plus/icons-vue'
import { i18n, localeConfigKey } from '@/locales'

// 直接定义语言列表，避免依赖可能有问题的langList
const languages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
  { value: 'zh-Hant', label: '繁體中文' },
  { value: 'fr', label: 'Français' },
  { value: 'japanese', label: '日本語' },
  { value: 'hindi', label: 'हिन्दी' },
  { value: 'Urdu', label: 'اردو' },
  { value: 'Farsi', label: 'فارسی' },
  { value: 'Bangla', label: 'বাংলা' },
  { value: 'brazil', label: 'Português' },
  { value: 'vietnamese', label: 'Tiếng Việt' }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.value === i18n.global.locale.value) || languages[0]
})

const changeLanguage = (code: string) => {
  i18n.global.locale.value = code
  localStorage.setItem(localeConfigKey, code)
  ElMessage.success('语言已切换')
}
</script>

<style scoped lang="scss">
.language-dropdown {
  width: 160px;
  .el-dropdown-item {
    padding: 8px 16px;
    white-space: nowrap;
    &.active {
      color: var(--el-color-primary);
      font-weight: 500;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.cursor {
  cursor: pointer;
}

.mr-8 {
  margin-right: 8px;
}

.color-text-primary {
  color: var(--el-text-color-primary);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.w-full {
  width: 100%;
}
</style>