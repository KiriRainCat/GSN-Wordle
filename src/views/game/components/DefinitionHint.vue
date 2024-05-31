<script setup lang="ts">
import { MAXIMUM_TRIES } from '@/pkg/services/game_logic'
import { useStore } from '@/pkg/stores/app'

const store = useStore()

function computeLetterToBeDisplayed(letter: string): string {
  if (letter === ' ') return ' '

  if (store.tries.length >= MAXIMUM_TRIES - 1) return letter

  if (store.tries.join().includes(letter)) {
    if (store.tries.length >= MAXIMUM_TRIES - 2) return letter
    if (!store.getLetterColorClass(letter, 0).includes('gray')) return letter
  }

  return '_'
}
</script>

<template>
  <div class="max-w-96 break-words">
    <var-paper elevation v-if="!((store.tries.length ?? 0) >= MAXIMUM_TRIES / 2)" class="p-3 text-xs">
      Definition will be revealed in {{ MAXIMUM_TRIES / 2 - (store.tries.length ?? 0) }} tries
    </var-paper>
    <var-paper elevation v-else class="p-3 text-lg tracking-widest">
      <span v-for="(letter, idx) in store.word?.definition" :key="idx">
        {{ computeLetterToBeDisplayed(letter) }}
      </span>
    </var-paper>
  </div>
</template>

<style scoped lang="scss"></style>
