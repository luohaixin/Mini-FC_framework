import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, KnowledgePoint } from '@/types'
import { knowledgePoints, categories } from '@/data/knowledge'

export const useAdminStore = defineStore('admin', () => {
  // State
  const users = ref<User[]>([])
  const allKnowledge = ref<KnowledgePoint[]>([...knowledgePoints])
  const isLoading = ref(false)

  // Getters
  const totalUsers = computed(() => users.value.length)
  const totalKnowledge = computed(() => allKnowledge.value.length)
  const knowledgeStats = computed(() => {
    const stats = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    }
    allKnowledge.value.forEach(k => {
      stats[k.difficulty]++
    })
    return stats
  })

  // Actions
  const loadUsers = async () => {
    // 模拟加载用户数据
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        bio: '管理员',
        learningGoal: '持续学习',
        createdAt: '2024-01-01',
        isAdmin: true
      },
      {
        id: '2',
        username: 'user1',
        email: 'user1@example.com',
        phone: '13800138001',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        bio: '前端新手',
        learningGoal: '掌握Vue3',
        createdAt: '2024-01-02',
        isAdmin: false
      },
      {
        id: '3',
        username: 'user2',
        email: 'user2@example.com',
        phone: '13800138002',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
        bio: '前端开发者',
        learningGoal: '进阶TypeScript',
        createdAt: '2024-01-03',
        isAdmin: false
      }
    ]
    users.value = mockUsers
  }

  const createUser = async (userData: Partial<User>): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username || '',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      bio: userData.bio || '',
      learningGoal: userData.learningGoal || '',
      createdAt: new Date().toISOString(),
      isAdmin: userData.isAdmin || false
    }
    users.value.push(newUser)
    return true
  }

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      Object.assign(user, userData)
      return true
    }
    return false
  }

  const deleteUser = async (userId: string): Promise<boolean> => {
    const index = users.value.findIndex(u => u.id === userId)
    if (index > -1) {
      users.value.splice(index, 1)
      return true
    }
    return false
  }

  const toggleUserStatus = async (userId: string): Promise<boolean> => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      // 这里可以实现禁用/启用逻辑
      return true
    }
    return false
  }

  const createKnowledge = async (knowledgeData: Partial<KnowledgePoint>): Promise<boolean> => {
    const newKnowledge: KnowledgePoint = {
      id: Date.now().toString(),
      title: knowledgeData.title || '',
      category: knowledgeData.category || '',
      subCategory: knowledgeData.subCategory || '',
      difficulty: knowledgeData.difficulty || 'beginner',
      tags: knowledgeData.tags || [],
      content: knowledgeData.content || '',
      codeExamples: knowledgeData.codeExamples || [],
      notes: knowledgeData.notes || '',
      compatibility: knowledgeData.compatibility || '',
      relatedPoints: knowledgeData.relatedPoints || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    allKnowledge.value.push(newKnowledge)
    return true
  }

  const updateKnowledge = async (knowledgeId: string, knowledgeData: Partial<KnowledgePoint>): Promise<boolean> => {
    const knowledge = allKnowledge.value.find(k => k.id === knowledgeId)
    if (knowledge) {
      Object.assign(knowledge, {
        ...knowledgeData,
        updatedAt: new Date().toISOString()
      })
      return true
    }
    return false
  }

  const deleteKnowledge = async (knowledgeId: string): Promise<boolean> => {
    const index = allKnowledge.value.findIndex(k => k.id === knowledgeId)
    if (index > -1) {
      allKnowledge.value.splice(index, 1)
      return true
    }
    return false
  }

  const getStatistics = () => {
    return {
      totalUsers: users.value.length,
      totalKnowledge: allKnowledge.value.length,
      knowledgeByDifficulty: knowledgeStats.value,
      knowledgeByCategory: getKnowledgeByCategory()
    }
  }

  const getKnowledgeByCategory = () => {
    const stats: Record<string, number> = {}
    allKnowledge.value.forEach(k => {
      stats[k.category] = (stats[k.category] || 0) + 1
    })
    return stats
  }

  return {
    users,
    allKnowledge,
    isLoading,
    totalUsers,
    totalKnowledge,
    knowledgeStats,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    getStatistics,
    getKnowledgeByCategory
  }
})
