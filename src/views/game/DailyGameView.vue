<script setup lang="ts">
import { getWordList, getWordOfTheDay } from '@/pkg/services/api'
import { GameLogic, MAXIMUM_TRIES } from '@/pkg/services/game_logic'
import { Snackbar } from '@varlet/ui'
import { onBeforeMount, ref } from 'vue'
import { useStore } from '@/pkg/stores/app'
import axios from 'axios'

import { Icon } from '@iconify/vue'
import WordCard from '../word/components/WordCard.vue'
import GuessedWordCard from './components/GuessedWordCard.vue'
import PageHeader from './components/PageHeader.vue'

const store = useStore()

const initializing = ref(true)
let logic: GameLogic

const guessInput = ref('')

onBeforeMount(async () => {
  store.word = await getWordOfTheDay()
  store.words = await getWordList()
  logic = new GameLogic(store.word, 'daily')
  initializing.value = false
})

async function guessWord() {
  if (guessInput.value.length < store.word!.word.length - 3) return

  try {
    await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${guessInput.value}`)
  } catch (_) {
    if (!store.words.map((w) => w.word.toLowerCase()).includes(guessInput.value.toLowerCase())) {
      Snackbar({ type: 'error', content: 'No such word! Please try again' })
      return
    }
  }

  if (logic.guess(guessInput.value)) {
    Snackbar({ type: 'success', content: 'Hooray! You got it!' })
  }

  guessInput.value = ''
}
</script>

<template>
  <var-loading type="wave" :loading="initializing" class="h-[92vh] overflow-auto py-6">
    <div class="flex flex-col items-center">
      <!-- 页面顶部栏 -->
      <PageHeader />

      <!-- 今日单词 (在游戏结束时显示) -->
      <div v-if="store.isFinished" class="mx-[36%] mt-6">
        <div class="mb-2 text-center text-lg font-bold text-sky-950">Word of the Day:</div>
        <WordCard :word="store.word!" />
      </div>

      <!-- 单词提示 -->
      <div class="mt-8 text-center">
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
      <div class="my-4 flex flex-col items-center">
        <GuessedWordCard
          v-for="(guess, key) in store.tries.concat(new Array<string>(MAXIMUM_TRIES - store.tries.length).fill(''))"
          :key
          :guess
        />
      </div>

      <!-- 单词输入框 -->
      <div class="mt-4 flex w-64 flex-col justify-center">
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
        >
          <template #append-icon>
            <Icon icon="ph:seal-question-duotone" />
          </template>
        </var-input>

        <var-button type="success" :disabled="store.isFinished" @click="guessWord" class="mt-4 py-6">Guess!</var-button>
      </div>

      <!-- 单词释义 -->
      <div class="mt-6 max-w-96">
        <var-paper elevation v-if="!((store.tries.length ?? 0) >= MAXIMUM_TRIES / 2)" class="p-3 text-xs">
          Definition will be revealed in {{ MAXIMUM_TRIES / 2 - (store.tries.length ?? 0) }} tries
        </var-paper>
        <var-paper elevation v-else class="p-3 text-lg tracking-widest">
          <span v-for="(letter, idx) in store.word?.definition" :key="idx">
            {{
              !'abcdefghijklmnopqrstuvwxyz'.includes(letter.toLowerCase()) ||
              (store.tries.join().includes(letter.toLowerCase()) && !store.getLetterColorClass(letter, 0).includes('gray'))
                ? letter
                : '_'
            }}
          </span>
        </var-paper>
      </div>
    </div>
  </var-loading>
</template>

<style scoped lang="scss"></style>