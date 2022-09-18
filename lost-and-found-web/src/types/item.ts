export interface Item {
  id: number
  type: string
  title: string
  place: string
  time: Date | string
  description: string
  state: string
  photoPath: string
  createTime: Date
}

export interface ItemDeatail extends Item {
  contact: string
  comments: []
  createTime: Date
  updateTime: Date
}
export interface IComment {
  author: string
  content: string
  createTime: Date
  id: number
  updateTime: string
  userId: string
  avatar: string
}