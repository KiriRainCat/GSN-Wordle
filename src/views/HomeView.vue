<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const rainbowTextClasses = [
  'text-red-400',
  'text-orange-400',
  'text-yellow-400',
  'text-green-400',
  'text-cyan-400',
  'text-blue-400',
  'text-purple-400',
  'text-pink-400',
]

const selectedGameMode = ref('daily')
</script>

<template>
  <div class="mt-[6%] flex flex-col items-center">
    <div class="mb-8 text-3xl">Welcome to...</div>

    <!-- Rainbow colored 'Georgiadle' -->
    <div class="mb-12 flex select-none font-[Georgia] text-5xl font-bold">
      <div v-for="(letter, idx) in 'Georgiadle!'" :key="idx" :class="rainbowTextClasses[idx % rainbowTextClasses.length]">
        {{ letter }}
      </div>
    </div>

    <!-- Logo -->
    <img
      src="@/assets/logo.png"
      alt="logo"
      @click="() => $router.push({ name: 'word-bank' })"
      class="mb-12 h-48 cursor-pointer select-none"
    />

    <!-- Description -->
    <div class="mb-2 text-lg">A game similar to "Wordle", but with some interesting twists and features.</div>

    <!-- Link for about page -->
    <var-button text @click="() => $router.push({ name: 'about' })" class="about-text mb-6">
      Read more about Georgiadle & its contributors
    </var-button>

    <!-- Button to start game -->
    <var-tooltip trigger="hover" content="Have fun !!!">
      <var-button @click="() => $router.push({ name: selectedGameMode })" type="success" class="px-10 py-5">
        <Icon icon="majesticons:rocket-3-start-line" class="h-6 w-6" />
      </var-button>
    </var-tooltip>

    <!-- 游戏模式选择 -->
    <var-select v-model="selectedGameMode" placeholder="Game Mode" class="mt-3 w-32">
      <var-option label="Daily" value="daily"></var-option>
      <var-option label="Random" value="random"></var-option>
      <var-option label="Quardle" value="quardle"></var-option>
      <var-option label="Multiplayer" value="multiplayer"></var-option>
    </var-select>
  </div>
</template>

<style lang="scss" scoped>
.about-text {
  @apply text-[1.05rem] text-blue-400;
  @apply italic underline opacity-85;
}
</style>
