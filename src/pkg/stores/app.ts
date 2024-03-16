import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('app', () => {
  const guesses = ref(Array<string>())

  return { guesses }
})
