import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SearchResult, SearchHistory, KnowledgePoint } from '@/types'
import { knowledgePoints } from '@/data/knowledge'

export const useSearchStore = defineStore('search', () => {
  // State
  const searchKeyword = ref('')
  const searchResults = ref<SearchResult[]>([])
  const searchHistory = ref<SearchHistory[]>([])
  const isSearching = ref(false)
  const selectedCategory = ref<string>('')
  const selectedDifficulty = ref<string>('')
  const selectedTags = ref<string[]>([])

  // Getters
  const hasResults = computed(() => searchResults.value.length > 0)
  const historyCount = computed(() => searchHistory.value.length)
  const allTags = computed(() => {
    const tags = new Set<string>()
    knowledgePoints.forEach(k => k.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags)
  })

  // Actions
  const search = async (keyword: string): Promise<SearchResult[]> => {
    if (!keyword.trim()) {
      searchResults.value = []
      return []
    }

    isSearching.value = true
    searchKeyword.value = keyword

    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    let results = knowledgePoints.filter(item => {
      const matchKeyword = 
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.content.toLowerCase().includes(keyword.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))

      const matchCategory = !selectedCategory.value || item.category === selectedCategory.value
      const matchDifficulty = !selectedDifficulty.value || item.difficulty === selectedDifficulty.value
      const matchTags = selectedTags.value.length === 0 || 
        selectedTags.value.some(tag => item.tags.includes(tag))

      return matchKeyword && matchCategory && matchDifficulty && matchTags
    })

    searchResults.value = results.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      difficulty: item.difficulty,
      summary: item.content.slice(0, 100) + '...',
      tags: item.tags
    }))

    // 添加到搜索历史
    addToHistory(keyword)

    isSearching.value = false
    return searchResults.value
  }

  const addToHistory = (keyword: string) => {
    if (!keyword.trim()) return

    // 移除重复项
    searchHistory.value = searchHistory.value.filter(h => h.keyword !== keyword)

    // 添加到开头
    searchHistory.value.unshift({
      id: Date.now().toString(),
      keyword,
      searchedAt: new Date().toISOString()
    })

    // 最多保留30条
    if (searchHistory.value.length > 30) {
      searchHistory.value = searchHistory.value.slice(0, 30)
    }

    // 保存到localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }

  const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }

  const removeHistoryItem = (id: string) => {
    searchHistory.value = searchHistory.value.filter(h => h.id !== id)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }

  const loadHistory = () => {
    const stored = localStorage.getItem('searchHistory')
    if (stored) {
      searchHistory.value = JSON.parse(stored)
    }
  }

  const setCategoryFilter = (category: string) => {
    selectedCategory.value = category
  }

  const setDifficultyFilter = (difficulty: string) => {
    selectedDifficulty.value = difficulty
  }

  const toggleTagFilter = (tag: string) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    } else {
      selectedTags.value.push(tag)
    }
  }

  const clearFilters = () => {
    selectedCategory.value = ''
    selectedDifficulty.value = ''
    selectedTags.value = []
  }

  const getSuggestions = (keyword: string): string[] => {
    if (!keyword.trim()) return []

    const suggestions = new Set<string>()
    const lowerKeyword = keyword.toLowerCase()

    // 从标题中搜索
    knowledgePoints.forEach(item => {
      if (item.title.toLowerCase().includes(lowerKeyword)) {
        suggestions.add(item.title)
      }
    })

    // 从标签中搜索
    knowledgePoints.forEach(item => {
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerKeyword)) {
          suggestions.add(tag)
        }
      })
    })

    return Array.from(suggestions).slice(0, 8)
  }

  return {
    searchKeyword,
    searchResults,
    searchHistory,
    isSearching,
    selectedCategory,
    selectedDifficulty,
    selectedTags,
    hasResults,
    historyCount,
    allTags,
    search,
    addToHistory,
    clearHistory,
    removeHistoryItem,
    loadHistory,
    setCategoryFilter,
    setDifficultyFilter,
    toggleTagFilter,
    clearFilters,
    getSuggestions
  }
})
