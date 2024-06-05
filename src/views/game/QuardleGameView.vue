<script setup lang="ts">
import { GameLogic, MAXIMUM_TRIES as TRIES } from '@/pkg/services/game_logic'
import { computed, onBeforeMount, ref } from 'vue'
import { useStore } from '@/pkg/stores/app'

import { Icon } from '@iconify/vue'
import WordCard from '../word/components/WordCard.vue'
import GuessedWordCard from './components/GuessedWordCard.vue'
import PageHeader from './components/PageHeader.vue'
import DefinitionHint from './components/DefinitionHint.vue'
import RefreshButton from './components/RefreshButton.vue'

const MAXIMUM_TRIES = TRIES + 2
const store = useStore()

const initializing = ref(true)
let logic: GameLogic

const guessInput = ref('')

onBeforeMount(async () => {
  logic = new GameLogic('quardle')
  await logic.init()
  initializing.value = false
})

async function guessWord() {
  if ((await logic.guess(guessInput.value)) != null) {
    guessInput.value = ''
  }
}

const currentTryLength = computed(() => store.quardleTries!.concat([]).sort((a, b) => b.length - a.length)[0].length)
</script>

<template>
  <var-loading type="wave" :loading="initializing" class="h-full overflow-auto py-6">
    <div class="flex flex-col items-center">
      <!-- 页面顶部栏 -->
      <PageHeader />

      <!-- 刷新按钮 -->
      <RefreshButton />

      <!-- 答案单词 (在游戏结束时显示) -->
      <div v-if="store.isQuardleFinished?.every((v) => v)" class="mx-[36%] mt-1 flex flex-col gap-3">
        <WordCard :word="store.quardleWords![0]" />
        <WordCard :word="store.quardleWords![1]" />
        <WordCard :word="store.quardleWords![2]" />
        <WordCard :word="store.quardleWords![3]" />
      </div>

      <!-- 单词释义 -->
      <DefinitionHint v-else isQuardleMode class="mt-1" />

      <!-- 单词提示 -->
      <div class="mt-5 text-center">
        <!-- 单词长度 -->
        <div id="word-length" class="mb-1 font-bold underline">{{ store.quardleWords?.[0].word.length }} letters in total</div>

        <!-- 单词所属类别 -->
        <div id="word-category">
          <div v-if="!(currentTryLength >= MAXIMUM_TRIES / 2 - 1)">
            Word categories will be revealed in {{ MAXIMUM_TRIES / 2 - 1 - currentTryLength }} tries
          </div>
          <div v-else>
            Categories:
            {{ store.quardleWords?.[0].subject }} | {{ store.quardleWords?.[1].subject }} | {{ store.quardleWords?.[2].subject }} |
            {{ store.quardleWords?.[3].subject }}
          </div>
        </div>
      </div>

      <!-- 已经猜过的单词列表 - Quardle 四联模式 -->
      <div class="my-1 flex gap-8">
        <div>
          <div class="mb-8">
            <GuessedWordCard
              v-for="(guess, i) in store.quardleTries![0].concat(new Array<string>(MAXIMUM_TRIES - store.quardleTries![0].length).fill(''))"
              :key="i"
              :guess
              mini
              :quardle-idx="0"
              :id="i == 0 && 'first-guess-box'"
            />
          </div>
          <GuessedWordCard
            v-for="(guess, i) in store.quardleTries![1].concat(new Array<string>(MAXIMUM_TRIES - store.quardleTries![1].length).fill(''))"
            :key="i"
            :guess
            mini
            :quardle-idx="1"
          />
        </div>
        <div>
          <div class="mb-8">
            <GuessedWordCard
              v-for="(guess, i) in store.quardleTries![2].concat(new Array<string>(MAXIMUM_TRIES - store.quardleTries![2].length).fill(''))"
              :key="i"
              :guess
              mini
              :quardle-idx="2"
            />
          </div>
          <GuessedWordCard
            v-for="(guess, i) in store.quardleTries![3].concat(new Array<string>(MAXIMUM_TRIES - store.quardleTries![3].length).fill(''))"
            :key="i"
            :guess
            mini
            :quardle-idx="3"
          />
        </div>
      </div>

      <!-- 单词输入框 -->
      <div id="input" class="mt-6 flex w-64 flex-col justify-center">
        <var-input
          v-model="guessInput"
          :disabled="store.isQuardleFinished?.every((v) => v)"
          :maxlength="(store.quardleWords?.[0].word.length ?? 0) + 3"
          variant="outlined"
          :rules="[
            (val) =>
              val.length >= (store.quardleWords?.[0].word.length ?? 0) - 3 ||
              `Length must be greater than ${(store.quardleWords?.[0].word.length ?? 0) - 4}`,
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
