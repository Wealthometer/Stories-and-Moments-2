export interface BlogPost {
  _id?: string
  title: string
  description: string
  imageUrl: string
  videoUrl?: string
  story: string
  category: string
  createdAt: Date | string
  updatedAt: Date
  views: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}


