<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useStore } from './pkg/stores/app'

onMounted(() => (useStore().words = JSON.parse(localStorage.getItem('words') || '[]')))
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
