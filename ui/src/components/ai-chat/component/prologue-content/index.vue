<template>
  <!-- 开场白组件 -->

  <div class="item-content mb-16">
    <div class="avatar" v-if="prologue">
      <AppAvatar
        v-if="isAppIcon(application?.icon)"
        shape="square"
        :size="32"
        style="background: none"
      >
        <img :src="application?.icon" alt="" />
      </AppAvatar>
      <AppAvatar
        v-else-if="application?.name"
        :name="application?.name"
        pinyinColor
        shape="square"
        :size="32"
      />
    </div>

    <div class="content" v-if="prologue">

      <el-card shadow="always" class="border-r-8 card-update" style="--el-card-padding: 10px 16px 12px">
        <MdRenderer
            :source="prologue"
            :send-message="sendMessage"
            reasoning_content=""
        ></MdRenderer>
      </el-card>
    </div>

  </div>

</template>
<script setup lang="ts">
import {type chatType} from '@/api/type/application'
import {computed} from 'vue'
import MdRenderer from '@/components/markdown/MdRenderer.vue'
import {t} from '@/locales'
import {isAppIcon} from '@/utils/application'

const props = defineProps<{
  application: any
  available: boolean
  type: 'log' | 'ai-chat' | 'debug-ai-chat'
  sendMessage: (question: string, other_params_data?: any, chat?: chatType) => void
}>()
const toQuickQuestion = (match: string, offset: number, input: string) => {
  return `<quick_question>${match.replace('- ', '')}</quick_question>`
}
const prologue = computed(() => {
  const temp = props.available ? props.application?.prologue : t('chat.tip.prologueMessage')
  if (temp) {
    const tag_list = [
      /<html_rander>[\d\D]*?<\/html_rander>/g,
      /<echarts_rander>[\d\D]*?<\/echarts_rander>/g,
      /<quick_question>[\d\D]*?<\/quick_question>/g,
      /<form_rander>[\d\D]*?<\/form_rander>/g
    ]
    let _temp = temp
    for (const index in tag_list) {
      _temp = _temp.replaceAll(tag_list[index], '')
    }
    const quick_question_list = _temp.match(/-\s.+/g)
    let result = temp
    for (const index in quick_question_list) {
      const quick_question = quick_question_list[index]
      result = result.replace(quick_question, toQuickQuestion)
    }
    return result
  }
  return ''
})
</script>
<style lang="scss" scoped>
.item-content {
  .content {
    .el-card{
      box-shadow:none;
      border: none;
      background: #FFFFFF;
    }
  }
}
</style>
