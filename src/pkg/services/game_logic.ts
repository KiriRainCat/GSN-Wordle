import { useStore } from '../stores/app'
import type { Word } from './api_types'

export const MAXIMUM_TRIES = 6

export class GameLogic {
  private store = useStore()

  constructor(word: Word) {
    this.store.word = word

    const storedTries = localStorage.getItem('storedTries')
    if (storedTries && new Date(Number.parseInt(storedTries.split('|')[0])).getDate() === new Date(Date.now()).getDate()) {
      this.store.tries = JSON.parse(storedTries.split('|')[1])
      this.store.isFinished = this.store.tries.length >= MAXIMUM_TRIES || this.store.tries.includes(this.store.word.word.toLowerCase())
    } else {
      this.store.tries = []
    }
  }

  public guess(word: string): boolean | undefined {
    if (this.store.tries.length >= MAXIMUM_TRIES) {
      return
    }

    this.store.tries.push(word.toLowerCase())
    localStorage.setItem('storedTries', `${Date.now()}|${JSON.stringify(this.store.tries)}`)

    if (word.toLowerCase() === this.store.word!.word.toLowerCase()) {
      this.store.isFinished = true
      return true
    }

    if (this.store.tries.length == MAXIMUM_TRIES) {
      this.store.isFinished = true
    }

    return false
  }
}
