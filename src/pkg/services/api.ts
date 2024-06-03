import axios from 'axios'
import { Snackbar } from '@varlet/ui'
import type { Commit, Word } from './api_types'
import { useStore } from '../stores/app'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_API_AUTH,
    'Admin-Auth': localStorage.getItem('adminPassword'),
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
  // 先尝试使用本地词库
  const { words } = useStore()
  if (words.length > 0) {
    return words[Math.floor(Math.random() * words.length)]
  }

  // 不行的话就去服务器获取
  return (await api.get('/word-bank/random-word')).data['data']
}

async function getWordOfTheDay(): Promise<Word> {
  return (await api.get('/word-bank/word-of-day')).data['data']
}

async function addWord(subject: string, word: string, definition: string) {
  if (!subject || subject.length < 3 || !word || word.length < 3 || !definition || definition.length < 3) return

  await api.post('/word-bank/word', { subject: subject, word: word, definition: definition })
}

async function updateWordInfo(id: number, subject: string, word: string, definition: string) {
  if (!word || word.length < 3 || !definition || definition.length < 3) return

  await api.put(`/word-bank/word/${id}`, { subject: subject, word: word, definition: definition })
}

function deleteWord(id: number) {
  api.delete(`/word-bank/word/${id}`)
}

async function setActiveState(id: number, active: boolean) {
  await api.put(`/word-bank/word/${id}/${active}`)
}

async function getCommits(): Promise<Commit[]> {
  return (await api.get('/word-bank/commits')).data['data']
}

async function approveCommit(id: number) {
  await api.post(`/word-bank/commit/approve/${id}`)
}

async function deleteCommit(id: number) {
  await api.delete(`/word-bank/commit/${id}`)
}

async function authAdmin(password: string): Promise<boolean> {
  api.defaults.headers['Admin-Auth'] = password
  try {
    await api.get('/admin')
  } catch (_) {
    return false
  }

  localStorage.setItem('adminPassword', password)
  return true
}

export {
  getWordList,
  getWordById,
  getRandomWord,
  getWordOfTheDay,
  addWord,
  updateWordInfo,
  deleteWord,
  setActiveState,
  getCommits,
  approveCommit,
  deleteCommit,
  authAdmin,
}
