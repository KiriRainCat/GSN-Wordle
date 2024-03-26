<script setup lang="ts">
import { useStore } from '@/pkg/stores/app'

const store = useStore()

defineProps({
  guess: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div elevation class="mt-3.5 flex gap-1 font-mono text-lg font-bold">
    <div
      v-for="(_, idx) in store.word?.word + '???'"
      :key="idx"
      :class="
        `${store.getLetterColorClass(guess[idx] ?? '!', idx)}` +
        (guess[idx] ? '' : ' bg-gray-50 !px-[1.3rem] !py-6') +
        ((store.word?.word + '???')[idx] === '?' ? ' opacity-25' : '')
      "
      class="rounded-md border-solid border-zinc-600 border-opacity-40 bg-opacity-75 px-4 py-2.5"
    >
      {{ (guess[idx] ?? '').toUpperCase() }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
