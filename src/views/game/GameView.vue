<script setup lang="ts">
import { getWordList, getWordOfTheDay } from '@/pkg/services/api'
import { GameLogic, MAXIMUM_TRIES } from '@/pkg/services/game_logic'
import { Snackbar } from '@varlet/ui'
import { onBeforeMount, ref } from 'vue'

import { Icon } from '@iconify/vue'
import WordCard from '../word/components/WordCard.vue'
import { useStore } from '@/pkg/stores/app'
import axios from 'axios'

const store = useStore()

const initializing = ref(true)
let logic: GameLogic

const guessInput = ref('')

onBeforeMount(async () => {
  store.word = await getWordOfTheDay()
  store.words = await getWordList()
  logic = new GameLogic(store.word)
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

function getLetterColorClass(letter: string, idx: number): string {
  if ((store.word!.word[idx] ?? '?').toLowerCase() === letter.toLowerCase()) return 'text-green-400'
  if (store.word!.word.toLowerCase().includes(letter.toLowerCase())) return 'text-yellow-400'
  return 'text-red-400'
}
</script>

<template>
  <var-loading type="wave" :loading="initializing" class="h-[92vh] overflow-auto py-6">
    <div class="flex flex-col items-center">
      <!-- 页面顶部栏 -->
      <div class="flex justify-center border-0 border-b-[1.6px] border-solid border-b-slate-300">
        <!-- 返回按钮 -->
        <var-tooltip trigger="hover" content="Go home">
          <var-button text round @click="() => $router.push('/')">
            <Icon icon="mdi:home" class="h-6 w-6 text-cyan-400" />
          </var-button>
        </var-tooltip>

        <!-- 页面标题 -->
        <div class="mx-2 mb-2 mt-0.5 text-2xl font-bold">
          Demo Game Page (WIP, UI need to be designed, game features and logics need to be improved)
        </div>

        <!-- 排行榜按钮 -->
        <var-tooltip trigger="hover" content="Leaderboard">
          <var-button text round @click="() => Snackbar('Coming soon...')" class="-ml-0.5">
            <Icon icon="ic:round-leaderboard" class="h-6 w-6 text-indigo-400" />
          </var-button>
        </var-tooltip>
      </div>

      <!-- 今日单词 (在游戏结束时显示) -->
      <div v-if="store.isFinished" class="mt-6">
        <div class="mb-2 text-center text-lg font-bold text-sky-950">Word of the Day:</div>
        <WordCard :word="store.word!" />
      </div>

      <!-- 单词字母个数 -->
      <div class="mt-8">
        {{ store.word?.word.length }} characters in total
        {{ store.word?.word.includes(' ') ? `(${store.word?.word.split(' ').length - 1} spaces included)` : '(no spaces included)' }}
      </div>

      <!-- 剩余次数显示 -->
      <div class="mt-1">({{ store.tries.length }} / {{ MAXIMUM_TRIES }} tries)</div>

      <!-- 已经猜过的单词列表 -->
      <div class="my-4 flex flex-col items-center">
        <var-paper elevation v-for="(guess, idx) in store.tries" :key="idx" class="mt-4 px-5 py-3">
          <span v-for="(letter, idx) in guess" :key="idx" :class="`${getLetterColorClass(letter, idx)}`">{{ letter }}</span>
        </var-paper>
      </div>

      <!-- 单词输入框 -->
      <div class="flex flex-col justify-center">
        <var-input
          v-model="guessInput"
          :disabled="store.isFinished"
          :maxlength="(store.word?.word.length ?? 0) + 3"
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
        <var-button type="success" :disabled="store.isFinished" @click="guessWord" class="mt-4">Guess!</var-button>
      </div>

      <!-- 单词释义 -->
      <div class="mt-6 max-w-96">
        <var-paper elevation v-if="!((store.tries.length ?? 0) > MAXIMUM_TRIES / 2 - 1)" class="p-3 text-xs">
          Definition will be revealed in {{ MAXIMUM_TRIES / 2 - 1 - (store.tries.length ?? 0) }} tries
        </var-paper>
        <var-paper elevation v-else class="p-3 text-lg tracking-widest">
          <span v-for="(letter, idx) in store.word?.definition" :key="idx">
            {{
              !'abcdefghijklmnopqrstuvwxyz'.includes(letter.toLowerCase()) ||
              (store.tries.join().includes(letter.toLowerCase()) && getLetterColorClass(letter, 0) !== 'text-red-400')
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
