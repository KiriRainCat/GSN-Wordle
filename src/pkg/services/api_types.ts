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

export type { Word }
