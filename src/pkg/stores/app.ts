import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Word, Commit } from '../services/api_types'

export const useStore = defineStore('app', () => {
  const words = ref(Array<Word>())
  function setWords(newWords: Word[]) {
    words.value = newWords
    localStorage.setItem('words', JSON.stringify(newWords))
  }

  const commits = ref(Array<Commit>())

  const word = ref<Word | undefined>()
  const tries = ref<string[]>([])
  const isFinished = ref(false)

  const quardleWords = ref<Array<Word> | undefined>()
  const quardleTries = ref<Array<string[]> | undefined>()
  const isQuardleFinished = ref<Array<boolean> | undefined>()

  function getLetterColorClass(letter: string, idx: number, quardleIdx?: number): string {
    if (quardleIdx != undefined) {
      if ((quardleWords.value?.[quardleIdx]?.word[idx] ?? '?').toLowerCase() === letter.toLowerCase()) return 'bg-green-400'
      if (quardleWords.value?.[quardleIdx]?.word.toLowerCase().includes(letter.toLowerCase())) return 'bg-yellow-400'
      return 'bg-gray-300'
    }

    if ((word.value?.word[idx] ?? '?').toLowerCase() === letter.toLowerCase()) return 'bg-green-400'
    if (word.value?.word.toLowerCase().includes(letter.toLowerCase())) return 'bg-yellow-400'
    return 'bg-gray-300'
  }

  return {
    words,
    setWords,
    commits,
    word,
    tries,
    isFinished,
    quardleWords,
    quardleTries,
    isQuardleFinished,
    getLetterColorClass,
  }
})
