<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Tutorial } from '@/pkg/services/tutorials'
</script>

<template>
  <div class="flex justify-center border-0 border-b-[1.6px] border-solid border-b-slate-300">
    <!-- 返回按钮 -->
    <var-tooltip trigger="hover" content="Go Home">
      <var-button text round @click="() => $router.push('/')">
        <Icon icon="mdi:home" class="h-6 w-6 text-cyan-400" />
      </var-button>
    </var-tooltip>

    <!-- 页面标题 -->
    <var-menu :default-style="false" placement="bottom">
      <var-button text class="mx-2 mb-2 mt-0.5 text-2xl font-bold">
        Georgiadle {{ $route.name!.toString().charAt(0).toUpperCase() + $route.name!.toString().substring(1) }} Mode
      </var-button>

      <template #menu>
        <var-paper elevation="1" radius="6" class="mt-3 flex justify-between p-3">
          <var-button text @click="() => $router.push({ name: 'daily' })" class="font-bold text-orange-400">Daily Mode</var-button>
          <var-button text @click="() => $router.push({ name: 'random' })" class="font-bold text-green-400">Random Mode</var-button>
          <var-button text @click="() => $router.push({ name: 'quardle' })" class="font-bold text-cyan-400">Quardle Mode</var-button>
          <var-button text @click="() => $router.push({ name: 'multiplayer' })" class="font-bold text-purple-400">
            Multiplayer Mode
          </var-button>
        </var-paper>
        <div class="h-2 bg-transparent" />
      </template>
    </var-menu>

    <!-- 教程按钮 -->
    <var-tooltip trigger="hover" content="Show Tutorial">
      <var-button
        text
        round
        @click="
          () =>
            Tutorial.showTutorial(
              ['random', 'quardle'].includes($route.name!.toString()) ? true : false,
              $route.name!.toString() === 'quardle'
            )
        "
      >
        <Icon icon="mdi:help-box" class="h-6 w-6 text-pink-400" />
      </var-button>
    </var-tooltip>
  </div>
</template>

<style scoped lang="scss"></style>
