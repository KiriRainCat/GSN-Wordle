import axios from 'axios'
import { useStore } from '../stores/app'
import { getRandomWord, getWordList, getWordOfTheDay } from './api'
import { Snackbar } from '@varlet/ui'

export const MAXIMUM_TRIES = 6

export class GameLogic {
  private store = useStore()

  private mode: 'daily' | 'random' | 'quardle' | 'multiplayer'

  constructor(mode: 'daily' | 'random' | 'quardle' | 'multiplayer') {
    this.store.isFinished = false
    this.mode = mode
  }

  public async guess(word: string): Promise<boolean | undefined> {
    // 检查次数是否已用完
    if (this.store.tries.length >= MAXIMUM_TRIES) {
      return
    }

    // 检查输入是否合法
    if (word.length < this.store.word!.word.length - 3) return

    // 检查输入是否在词库中
    if (!this.store.words.map((w) => w.word.toLowerCase()).includes(word.toLowerCase())) {
      try {
        await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      } catch (_) {
        Snackbar({ type: 'error', content: 'No such word! Please try again' })
        return
      }
    }

    this.store.tries.push(word.toLowerCase())

    // 只在日常模式下存储尝试
    if (this.mode === 'daily') {
      localStorage.setItem('daily-storedTries', `${Date.now()}|${JSON.stringify(this.store.tries)}|${this.store.word?.word.toLowerCase()}`)
    }

    // 判断是否猜对
    if (word.toLowerCase() === this.store.word!.word.toLowerCase()) {
      this.store.isFinished = true
      Snackbar({ type: 'success', content: 'Hooray! You got it!' })
      return true
    }

    // 判断游戏结束
    if (this.store.tries.length == MAXIMUM_TRIES) {
      this.store.isFinished = true
    }

    return false
  }

  public async init() {
    this.store.tries = []
    getWordList().then((words) => this.store.setWords(words))

    switch (this.mode) {
      case 'daily':
        await this.initDaily()
        break
      case 'random':
        this.store.word = await getRandomWord()
        break
      case 'quardle':
        await this.initQuardle()
        break
      case 'multiplayer':
        await this.initMultiplayer()
        break
    }
  }

  private async initDaily() {
    this.store.word = await getWordOfTheDay()

    const storedData = localStorage.getItem('daily-storedTries')?.split('|')
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

  private async initQuardle() {}

  private async initMultiplayer() {}
}
