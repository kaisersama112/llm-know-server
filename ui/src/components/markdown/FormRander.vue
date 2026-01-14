<template>
  <div class="chat-form">
    <DynamicsForm
      class="chat-form__form"
      :disabled="is_submit || disabled"
      label-position="top"
      require-asterisk-position="right"
      ref="dynamicsFormRef"
      :render_data="form_field_list"
      label-suffix=""
      v-model="form_data"
      :model="form_data"
    ></DynamicsForm>
    <el-button
      class="chat-form__submit"
      :type="is_submit ? 'info' : 'primary'"
      :disabled="is_submit || disabled"
      @click="submit"
    >
      {{ $t('common.submit') }}
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import DynamicsForm from '@/components/dynamics-form/index.vue'
const props = withDefaults(
  defineProps<{
    form_setting: string
    disabled?: boolean
    sendMessage?: (question: string, type: 'old' | 'new', other_params_data?: any) => void
    child_node?: any
    chat_record_id?: string
    runtime_node_id?: string
  }>(),
  {
    disabled: false
  }
)
const form_setting_data = computed(() => {
  if (props.form_setting) {
    return JSON.parse(props.form_setting)
  } else {
    return {}
  }
})
const _submit = ref<boolean>(false)
/**
 * 表单字段列表
 */
const form_field_list = computed(() => {
  if (form_setting_data.value.form_field_list) {
    return form_setting_data.value.form_field_list
  }
  return []
})
const is_submit = computed(() => {
  if (_submit.value) {
    return true
  }
  if (form_setting_data.value.is_submit) {
    return form_setting_data.value.is_submit
  } else {
    return false
  }
})
const _form_data = ref<any>({})
const form_data = computed({
  get: () => {
    if (form_setting_data.value.is_submit) {
      return form_setting_data.value.form_data
    } else {
      return _form_data.value
    }
  },
  set: (v) => {
    _form_data.value = v
  }
})
const dynamicsFormRef = ref<InstanceType<typeof DynamicsForm>>()
const submit = () => {
  dynamicsFormRef.value?.validate().then(() => {
    _submit.value = true
    if (props.sendMessage) {
      props.sendMessage('', 'old', {
        child_node: props.child_node,
        runtime_node_id: props.runtime_node_id,
        chat_record_id: props.chat_record_id,
        node_data: form_data.value
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.chat-form {
  background: #ffffff;
  border: 1px solid #eef0f3;
  border-radius: 12px;
  padding: 16px;
}

.chat-form__form {
  --el-input-bg-color: #ffffff;
  --el-input-border-color: #e5e7eb;
  --el-input-hover-border-color: #d1d5db;
  --el-input-focus-border-color: #3b82f6;
  --el-input-text-color: #111827;
  --el-text-color-regular: #111827;
}

.chat-form__form :deep(.el-form-item) {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f2f4;
}

.chat-form__form :deep(.el-form-item:last-child) {
  margin-bottom: 12px;
  padding-bottom: 0;
  border-bottom: none;
}

.chat-form__form :deep(.el-form-item__label) {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  padding-bottom: 6px;
  color: #111827;
}

.chat-form__form :deep(.el-form-item.is-required .el-form-item__label::after) {
  color: #ef4444;
  margin-left: 4px;
}

.chat-form__form :deep(.el-input__wrapper),
.chat-form__form :deep(.el-select .el-input__wrapper),
.chat-form__form :deep(.el-input-number .el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
  background: #ffffff;
}

.chat-form__form :deep(.el-textarea__inner) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
  background: #ffffff;
}

.chat-form__form :deep(.el-input__inner::placeholder),
.chat-form__form :deep(.el-textarea__inner::placeholder) {
  color: #9ca3af;
}

.chat-form__form :deep(.el-input-number) {
  width: 120px;
}

.chat-form__submit {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
}

.chat-form__submit.is-disabled {
  opacity: 0.6;
}
</style>
