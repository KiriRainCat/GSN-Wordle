/** 单词数据模型 */
interface Word {
  id: number
  active: boolean

  subject: string
  word: string
  definition: string

  created_at: string
  updated_at: string
}

/** 单词数据模型 */
interface Commit {
  id: number
  wid: number

  subject: string
  word: string
  definition: string

  created_at: string
}

export type { Word, Commit }
