export interface KnowledgePoint {
  id: string
  title: string
  category: string
  subCategory: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  content: string
  codeExamples: CodeExample[]
  notes: string
  compatibility?: string
  relatedPoints: string[]
  createdAt: string
  updatedAt: string
}

export interface CodeExample {
  id: string
  language: string
  code: string
  description: string
}

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  learningGoal?: string
  createdAt: string
  isAdmin: boolean
}

export interface UserProfile {
  nickname: string
  avatar: string
  bio: string
  learningGoal: string
}

export interface LearningRecord {
  knowledgeId: string
  knowledgeTitle: string
  category: string
  viewedAt: string
  duration: number
  status: 'not_started' | 'learning' | 'mastered'
}

export interface Favorite {
  id: string
  knowledgeId: string
  knowledgeTitle: string
  category: string
  difficulty: string
  createdAt: string
}

export interface Note {
  id: string
  knowledgeId: string
  knowledgeTitle: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface SearchResult {
  id: string
  title: string
  category: string
  difficulty: string
  summary: string
  tags: string[]
}

export interface SearchHistory {
  id: string
  keyword: string
  searchedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  children?: Category[]
  knowledgeCount: number
}

export interface LoginCredentials {
  email?: string
  phone?: string
  password: string
}

export interface RegisterData {
  username: string
  email?: string
  phone?: string
  password: string
}

export interface Comment {
  id: string
  knowledgeId: string
  userId: string
  username: string
  avatar?: string
  content: string
  likes: number
  replies: Comment[]
  createdAt: string
}

export interface Question {
  id: string
  title: string
  content: string
  tags: string[]
  userId: string
  username: string
  answers: Answer[]
  bestAnswerId?: string
  createdAt: string
  viewCount: number
}

export interface Answer {
  id: string
  questionId: string
  userId: string
  username: string
  content: string
  likes: number
  isBest: boolean
  createdAt: string
}
