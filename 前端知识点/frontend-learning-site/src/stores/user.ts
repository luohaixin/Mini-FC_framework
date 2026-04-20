import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserProfile, Favorite, Note, LearningRecord, LoginCredentials, RegisterData } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const token = ref<string | null>(localStorage.getItem('token'))
  const favorites = ref<Favorite[]>([])
  const notes = ref<Note[]>([])
  const learningRecords = ref<LearningRecord[]>([])

  // Getters
  const userInfo = computed(() => currentUser.value)
  const isAdmin = computed(() => currentUser.value?.isAdmin || false)
  const favoriteIds = computed(() => favorites.value.map(f => f.knowledgeId))
  const favoritesCount = computed(() => favorites.value.length)
  const notesCount = computed(() => notes.value.length)
  const learnedCount = computed(() => learningRecords.value.length)

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // 模拟登录
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        bio: '前端学习网站管理员',
        learningGoal: '持续学习新技术',
        createdAt: '2024-01-01',
        isAdmin: true
      },
      {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        phone: '13800138001',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        bio: '前端学习者',
        learningGoal: '成为全栈工程师',
        createdAt: '2024-01-01',
        isAdmin: false
      }
    ]

    const user = mockUsers.find(u => 
      (credentials.email && u.email === credentials.email) ||
      (credentials.phone && u.phone === credentials.phone)
    )

    if (user && credentials.password === '123456') {
      currentUser.value = user
      isLoggedIn.value = true
      token.value = 'mock_token_' + user.id
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user))
      
      // 加载用户数据
      loadUserData()
      return true
    }
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    // 模拟注册
    const newUser: User = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email || '',
      phone: data.phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      createdAt: new Date().toISOString(),
      isAdmin: false
    }
    
    currentUser.value = newUser
    isLoggedIn.value = true
    token.value = 'mock_token_' + newUser.id
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
    token.value = null
    favorites.value = []
    notes.value = []
    learningRecords.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      currentUser.value = JSON.parse(storedUser)
      isLoggedIn.value = true
      token.value = storedToken
      loadUserData()
    }
  }

  const loadUserData = () => {
    // 从localStorage加载用户数据
    const storedFavorites = localStorage.getItem(`favorites_${currentUser.value?.id}`)
    const storedNotes = localStorage.getItem(`notes_${currentUser.value?.id}`)
    const storedRecords = localStorage.getItem(`records_${currentUser.value?.id}`)
    
    if (storedFavorites) favorites.value = JSON.parse(storedFavorites)
    if (storedNotes) notes.value = JSON.parse(storedNotes)
    if (storedRecords) learningRecords.value = JSON.parse(storedRecords)
  }

  const updateProfile = async (profile: UserProfile): Promise<boolean> => {
    if (currentUser.value) {
      currentUser.value = {
        ...currentUser.value,
        username: profile.nickname,
        avatar: profile.avatar,
        bio: profile.bio,
        learningGoal: profile.learningGoal
      }
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }

  const addFavorite = (knowledgeId: string, knowledgeTitle: string, category: string, difficulty: string) => {
    if (!isLoggedIn.value) return false
    
    const exists = favorites.value.some(f => f.knowledgeId === knowledgeId)
    if (exists) return false

    const favorite: Favorite = {
      id: Date.now().toString(),
      knowledgeId,
      knowledgeTitle,
      category,
      difficulty,
      createdAt: new Date().toISOString()
    }
    
    favorites.value.push(favorite)
    localStorage.setItem(`favorites_${currentUser.value?.id}`, JSON.stringify(favorites.value))
    return true
  }

  const removeFavorite = (knowledgeId: string) => {
    if (!isLoggedIn.value) return false
    
    favorites.value = favorites.value.filter(f => f.knowledgeId !== knowledgeId)
    localStorage.setItem(`favorites_${currentUser.value?.id}`, JSON.stringify(favorites.value))
    return true
  }

  const isFavorite = (knowledgeId: string) => {
    return favorites.value.some(f => f.knowledgeId === knowledgeId)
  }

  const addNote = (knowledgeId: string, knowledgeTitle: string, content: string) => {
    if (!isLoggedIn.value) return false

    const note: Note = {
      id: Date.now().toString(),
      knowledgeId,
      knowledgeTitle,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    notes.value.push(note)
    localStorage.setItem(`notes_${currentUser.value?.id}`, JSON.stringify(notes.value))
    return true
  }

  const updateNote = (noteId: string, content: string) => {
    if (!isLoggedIn.value) return false

    const note = notes.value.find(n => n.id === noteId)
    if (note) {
      note.content = content
      note.updatedAt = new Date().toISOString()
      localStorage.setItem(`notes_${currentUser.value?.id}`, JSON.stringify(notes.value))
      return true
    }
    return false
  }

  const deleteNote = (noteId: string) => {
    if (!isLoggedIn.value) return false
    
    notes.value = notes.value.filter(n => n.id !== noteId)
    localStorage.setItem(`notes_${currentUser.value?.id}`, JSON.stringify(notes.value))
    return true
  }

  const addLearningRecord = (knowledgeId: string, knowledgeTitle: string, category: string) => {
    if (!isLoggedIn.value) return

    const exists = learningRecords.value.find(r => r.knowledgeId === knowledgeId)
    if (exists) {
      exists.viewedAt = new Date().toISOString()
    } else {
      const record: LearningRecord = {
        knowledgeId,
        knowledgeTitle,
        category,
        viewedAt: new Date().toISOString(),
        duration: 0,
        status: 'learning'
      }
      learningRecords.value.push(record)
    }
    localStorage.setItem(`records_${currentUser.value?.id}`, JSON.stringify(learningRecords.value))
  }

  const updateLearningStatus = (knowledgeId: string, status: 'not_started' | 'learning' | 'mastered') => {
    if (!isLoggedIn.value) return false

    const record = learningRecords.value.find(r => r.knowledgeId === knowledgeId)
    if (record) {
      record.status = status
      localStorage.setItem(`records_${currentUser.value?.id}`, JSON.stringify(learningRecords.value))
      return true
    }
    return false
  }

  return {
    currentUser,
    isLoggedIn,
    token,
    favorites,
    notes,
    learningRecords,
    userInfo,
    isAdmin,
    favoriteIds,
    favoritesCount,
    notesCount,
    learnedCount,
    login,
    register,
    logout,
    initFromStorage,
    updateProfile,
    addFavorite,
    removeFavorite,
    isFavorite,
    addNote,
    updateNote,
    deleteNote,
    addLearningRecord,
    updateLearningStatus
  }
})
