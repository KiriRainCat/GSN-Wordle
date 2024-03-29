import { useStore } from '../stores/app'
import type { Word } from './api_types'

export const MAXIMUM_TRIES = 6

export class GameLogic {
  private store = useStore()

  private mode: 'daily' | 'random' | 'quardle' | 'multiplayer'

  constructor(word: Word, mode: 'daily' | 'random' | 'quardle' | 'multiplayer') {
    this.mode = mode
    this.store.word = word

    const storedData = localStorage.getItem(`${mode}-storedTries`)?.split('|')
    if (
      storedData &&
      new Date(Number.parseInt(storedData[0])).getDate() === new Date(Date.now()).getDate() &&
      storedData[1] &&
      storedData[2] === this.store.word.word.toLowerCase()
    ) {
      this.store.tries = JSON.parse(storedData[1])
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
    localStorage.setItem(
      `${this.mode}-storedTries`,
      `${Date.now()}|${JSON.stringify(this.store.tries)}|${this.store.word?.word.toLowerCase()}`
    )

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
