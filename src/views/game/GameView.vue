<script setup lang="ts">
import { getWordOfTheDay } from '@/pkg/services/api'
import type { Word } from '@/pkg/services/api_types'
import { onBeforeMount, ref } from 'vue'

const word = ref<Word>()
onBeforeMount(async () => {
  word.value = await getWordOfTheDay()
})
</script>

<template>
  <div class="mt-[20%] flex flex-col items-center">
    <div>The game page, still...</div>

    <div class="text-xl font-bold">W.I.P</div>

    <ul>
      <li>UI</li>
      <li>Logic</li>
    </ul>

    <div class="text-lg font-bold">Word of the day: {{ word?.word }}</div>

    <var-button @click="() => $router.back()">Go Back</var-button>
  </div>
</template>

<style scoped lang="scss"></style>
