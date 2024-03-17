import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Word, Commit } from '../services/api_types'

export const useStore = defineStore('app', () => {
  const words = ref(Array<Word>())
  const commits = ref(Array<Commit>())

  return {
    words,
    commits,
  }
})
