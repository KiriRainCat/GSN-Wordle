import axios from 'axios'
import { Snackbar } from '@varlet/ui'
import type { Word } from './api_types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_API_AUTH,
  },
})

api.interceptors.response.use(
  (res) => {
    return res
  },

  // 处理错误
  (error) => {
    try {
      if (error.code === 'ERR_NETWORK' || error.response.status == 404 || error.response.status == 502) {
        Snackbar({ content: '服务器爆炸啦，也可能是你网炸了 :D', type: 'error' })
        return Promise.reject(error)
      }

      if (error.response.data != undefined && error.response.data['msg'] != undefined) {
        Snackbar({ content: error.response.data['msg'], type: 'error' })
        return Promise.reject(error)
      }
    } catch (_) {
      Snackbar({ content: `发生未知异常: ${error}`, type: 'error' })
      return Promise.reject(error)
    }
  }
)

export default api

async function getWordList(): Promise<Word[]> {
  return (await api.get('/word-bank/words')).data['data']
}

async function getWordById(id: number): Promise<Word> {
  return (await api.get(`/word-bank/word/${id}`)).data['data']
}

async function getRandomWord(): Promise<Word> {
  return (await api.get('/word-bank/random-word')).data['data']
}

async function getWordOfTheDay(): Promise<Word> {
  return (await api.get('/word-bank/word-of-day')).data['data']
}

async function addWord(subject: string, word: string, definition: string, updateFunc?: () => any) {
  if (!subject || subject.length < 3 || !word || word.length < 3 || !definition || definition.length < 3) return

  await api.post('/word-bank/word', { subject: subject, word: word, definition: definition })

  if (updateFunc) {
    updateFunc()
  }
}

async function updateWordInfo(id: number, subject: string, word: string, definition: string, updateFunc?: () => any) {
  if (!word || word.length < 3 || !definition || definition.length < 3) return

  await api.put(`/word-bank/word/${id}`, { subject: subject, word: word, definition: definition })

  if (updateFunc) {
    updateFunc()
  }
}

function deleteWord(id: number) {
  api.delete(`/word-bank/word/${id}`)
}

export { getWordList, getWordById, getRandomWord, getWordOfTheDay, addWord, updateWordInfo, deleteWord }
