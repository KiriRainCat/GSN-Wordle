<script setup lang="ts">
import { GameLogic, MAXIMUM_TRIES } from '@/pkg/services/game_logic'
import { onBeforeMount, ref } from 'vue'
import { useStore } from '@/pkg/stores/app'

import { Icon } from '@iconify/vue'
import WordCard from '../word/components/WordCard.vue'
import GuessedWordCard from './components/GuessedWordCard.vue'
import PageHeader from './components/PageHeader.vue'
import DefinitionHint from './components/DefinitionHint.vue'

const store = useStore()

const initializing = ref(true)
let logic: GameLogic

const guessInput = ref('')

onBeforeMount(async () => {
  logic = new GameLogic('daily')
  await logic.init()
  initializing.value = false
})

async function guessWord() {
  if ((await logic.guess(guessInput.value)) != null) {
    guessInput.value = ''
  }
}
</script>

<template>
  <var-loading type="wave" :loading="initializing" class="h-full overflow-auto py-6">
    <div class="flex flex-col items-center">
      <!-- 页面顶部栏 -->
      <PageHeader />

      <!-- 答案单词 (在游戏结束时显示) -->
      <div v-if="store.isFinished" class="mx-[36%] mt-3">
        <WordCard :word="store.word!" />
      </div>

      <!-- 单词释义 -->
      <DefinitionHint v-else class="mt-3" />

      <!-- 单词提示 -->
      <div class="mt-5 text-center">
        <!-- 单词长度 -->
        <div class="mb-1 font-bold underline">{{ store.word?.word.length }} letters in total</div>

        <!-- 单词所属类别 -->
        <div>
          <div v-if="!((store.tries.length ?? 0) >= MAXIMUM_TRIES / 2 - 1)">
            Word category will be revealed in {{ MAXIMUM_TRIES / 2 - 1 - (store.tries.length ?? 0) }} tries
          </div>
          <div v-else>Category: {{ store.word?.subject }}</div>
        </div>
      </div>

      <!-- 已经猜过的单词列表 -->
      <div class="my-1 flex flex-col items-center">
        <GuessedWordCard
          v-for="(guess, i) in store.tries.concat(new Array<string>(MAXIMUM_TRIES - store.tries.length).fill(''))"
          :key="i"
          :guess
        />
      </div>

      <!-- 单词输入框 -->
      <div class="mt-6 flex w-64 flex-col justify-center">
        <var-input
          v-model="guessInput"
          :disabled="store.isFinished"
          :maxlength="(store.word?.word.length ?? 0) + 3"
          variant="outlined"
          :rules="[
            (val) =>
              val.length >= (store.word?.word.length ?? 0) - 3 || `Length must be greater than ${(store.word?.word.length ?? 0) - 4}`,
          ]"
          placeholder="Take a guess"
          @keyup.enter="guessWord"
        >
          <template #append-icon>
            <Icon icon="ph:seal-question-duotone" />
          </template>
        </var-input>
      </div>
    </div>
  </var-loading>
</template>
<style scoped lang="scss"></style>
