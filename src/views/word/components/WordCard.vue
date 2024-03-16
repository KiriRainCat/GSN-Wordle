<script setup lang="ts">
import type { Word } from '@/pkg/services/api_types'
import { ref, type PropType } from 'vue'

import { Icon } from '@iconify/vue'
import WordForm from './WordForm.vue'

defineProps({
  word: {
    type: Object as PropType<Word>,
    required: true,
  },
})

const showEditWordDialog = ref(false)
</script>

<template>
  <!-- 编辑对话框 -->
  <var-dialog v-model:show="showEditWordDialog" title="Edit Word" :cancel-button="false" :confirm-button="false" class="w-96">
    <WordForm :id="word.id" :close-func="() => (showEditWordDialog = false)" />
  </var-dialog>

  <!-- 单词卡 -->
  <var-paper :elevation="2" class="max-w-[16rem] translate-x-0 break-inside-avoid p-4">
    <!-- 单词基本信息 -->
    <div class="text-xl font-bold">{{ word.word }}</div>
    <div class="-mt-1.5 text-sm text-gray-400">{{ word.subject }}</div>
    <div class="mb-5 mt-0.5">{{ word.definition }}</div>

    <!-- 单词操作按钮 -->
    <var-button text round @click="() => (showEditWordDialog = true)" class="absolute right-2 top-2">
      <Icon icon="tabler:edit" class="h-6 w-6 text-emerald-500" />
    </var-button>

    <!-- 单词时间信息 -->
    <div class="absolute bottom-2 right-3 text-end text-[0.5rem] text-gray-300">
      <div>Created: {{ new Date(Date.parse(word.created_at)).toLocaleString() }}</div>
      <div>Updated: {{ new Date(Date.parse(word.updated_at)).toLocaleString() }}</div>
    </div>
  </var-paper>
</template>

<style scoped lang="scss"></style>
