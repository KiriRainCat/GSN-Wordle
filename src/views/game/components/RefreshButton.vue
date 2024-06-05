<script setup lang="ts">
import { Icon } from '@iconify/vue'

const reload = () => location.reload()
</script>

<template>
  <var-tooltip content="Get another word">
    <var-button id="refresh-btn" text round @click="reload" class="mt-1 text-red-400">
      <Icon icon="mdi:refresh" class="h-5 w-5" />
    </var-button>
  </var-tooltip>
</template>
