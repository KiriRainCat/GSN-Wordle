<script setup lang="ts">
import { getWordList } from '@/pkg/services/api'
import type { Word } from '@/pkg/services/api_types'
import { onBeforeMount, ref } from 'vue'

import { Icon } from '@iconify/vue'
import WordCard from './components/WordCard.vue'
import WordForm from './components/WordForm.vue'

const isLoading = ref(true)
const wordList = ref(Array<Word>())
onBeforeMount(fetchWordList)

async function fetchWordList() {
  isLoading.value = true
  wordList.value = await getWordList()
  isLoading.value = false
}

const showAddWordDialog = ref(false)
</script>

<template>
  <div id="word-bank" class="flex h-screen flex-col items-center px-6">
    <!-- 添加单词的对话框 -->
    <var-dialog v-model:show="showAddWordDialog" title="Add a Word" :confirm-button="false" :cancel-button="false" class="w-96">
      <WordForm :close-func="() => (showAddWordDialog = false)" />
    </var-dialog>

    <!-- 页面顶部栏 -->
    <div class="my-6 flex justify-center border-0 border-b-[1.6px] border-solid border-b-slate-300">
      <!-- 返回按钮 -->
      <var-tooltip trigger="hover" content="Go home">
        <var-button text round @click="() => $router.push('/')">
          <Icon icon="mdi:home" class="h-6 w-6 text-cyan-400" />
        </var-button>
      </var-tooltip>

      <!-- 页面标题 -->
      <var-tooltip trigger="hover" content="Click to refresh">
        <var-button text @click="fetchWordList" class="mx-2 mb-2 mt-0.5 text-2xl font-bold">Word Bank</var-button>
      </var-tooltip>

      <!-- 添加单词按钮 -->
      <var-tooltip trigger="hover" content="Add a new word">
        <var-button text round @click="() => (showAddWordDialog = true)">
          <Icon icon="mdi:book-add" class="h-6 w-6 text-pink-400" />
        </var-button>
      </var-tooltip>
    </div>

    <!-- 单词卡片列表 -->
    <var-loading type="wave" :loading="isLoading" class="w-full">
      <div class="grid max-h-[83vh] grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-x-3 gap-y-5 !overflow-auto py-1">
        <WordCard v-for="word in wordList" :key="word.id" :word="word" />
      </div>
    </var-loading>
  </div>
</template>

<style scoped lang="scss"></style>
./components/WordForm.vue
