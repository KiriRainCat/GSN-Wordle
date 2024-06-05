import axios from 'axios'
import { useStore } from '../stores/app'
import { getRandomWord, getWordList, getWordOfTheDay } from './api'
import { Snackbar } from '@varlet/ui'
import type { Word } from './api_types'

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
    if (this.store.tries.length >= MAXIMUM_TRIES + 2) {
      return
    }

    // 检查输入是否合法
    if (this.mode === 'quardle') {
      if (word.length < this.store.quardleWords![0].word.length - 3) return
    } else {
      if (word.length < this.store.word!.word.length - 3) return
    }

    // 检查是否重复
    if (this.mode == 'quardle') {
      if (this.store.quardleTries?.some((arr) => arr.join().toLowerCase().includes(word))) {
        Snackbar({ type: 'error', content: 'You have already tried this word' })
        return
      }
    } else {
      if (this.store.tries.includes(word.toLowerCase())) {
        Snackbar({ type: 'error', content: 'You have already tried this word' })
        return
      }
    }

    // 检查输入是否在词库中
    if (!this.store.words.map((w) => w.word.toLowerCase()).includes(word.toLowerCase())) {
      try {
        await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      } catch (_) {
        Snackbar({ type: 'error', content: 'No such word! Please try again' })
        return
      }
    }

    // 记录尝试
    if (this.mode === 'quardle') {
      for (let i = 0; i < 4; i++) {
        if (this.store.isQuardleFinished![i]) continue
        this.store.quardleTries![i].push(word.toLowerCase())
      }
    } else {
      this.store.tries.push(word.toLowerCase())
    }

    // 只在日常模式下存储尝试列表到 localStorage
    if (this.mode === 'daily') {
      localStorage.setItem('daily-storedTries', `${Date.now()}|${JSON.stringify(this.store.tries)}|${this.store.word?.word.toLowerCase()}`)
    }

    // 判断是否猜对
    if (this.mode == 'quardle') {
      if (this.store.quardleWords?.map((w) => w.word.toLowerCase()).includes(word.toLowerCase())) {
        this.store.isQuardleFinished![this.store.quardleWords.findIndex((w) => w.word.toLowerCase() === word.toLowerCase())] = true
        Snackbar({ type: 'success', content: 'Hooray! You got it!' })
        return true
      }
    } else {
      if (word.toLowerCase() === this.store.word!.word.toLowerCase()) {
        this.store.isFinished = true
        Snackbar({ type: 'success', content: 'Hooray! You got it!' })
        return true
      }
    }

    // 判断游戏结束
    if (this.mode === 'quardle') {
      if (this.store.quardleTries!.some((t) => t.length >= MAXIMUM_TRIES + 2)) this.store.isQuardleFinished = [true, true, true, true]
    } else {
      if (this.store.tries.length == MAXIMUM_TRIES) this.store.isFinished = true
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

  private async initQuardle() {
    this.store.isQuardleFinished = [false, false, false, false]
    this.store.quardleTries = [[], [], [], []]

    // 如果词库为空，则先从 API 获取
    if (this.store.words.length == 0) {
      this.store.setWords(await getWordList())
    }

    // 对词库按照长度为组的分组
    let groupedWords: Array<Array<Word>> = []
    for (const word of this.store.words) {
      const wordLen = word.word.length
      const currentWords = groupedWords[wordLen] || []
      groupedWords[wordLen] = [...currentWords, word]
    }

    // 剔除长度不足 4 的组
    groupedWords = groupedWords.filter((arr) => arr.length >= 4)

    // 随机选择一个长度组
    const randomGroup = groupedWords[Math.floor(Math.random() * groupedWords.length)]

    // 随机选择 4 个词
    this.store.quardleWords = []
    for (let i = 0; i < 4; i++) {
      this.store.quardleWords.push(randomGroup.pop()!)
      randomGroup.sort(() => Math.random() - 0.5)
    }
  }

  private async initMultiplayer() {}
}
