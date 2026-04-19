import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '../search'

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty state', () => {
    const store = useSearchStore()
    expect(store.searchKeyword).toBe('')
    expect(store.searchResults).toEqual([])
    expect(store.searchHistory).toEqual([])
  })

  it('should search knowledge points', async () => {
    const store = useSearchStore()
    const results = await store.search('Vue')
    expect(results.length).toBeGreaterThan(0)
    expect(store.hasResults).toBe(true)
  })

  it('should return empty results for non-matching keyword', async () => {
    const store = useSearchStore()
    const results = await store.search('xyznonexistent')
    expect(results.length).toBe(0)
    expect(store.hasResults).toBe(false)
  })

  it('should add search to history', () => {
    const store = useSearchStore()
    store.addToHistory('JavaScript')
    expect(store.searchHistory.length).toBe(1)
    const historyItem = store.searchHistory[0]
    expect(historyItem).toBeDefined()
    expect(historyItem!.keyword).toBe('JavaScript')
  })

  it('should not add duplicate history items', () => {
    const store = useSearchStore()
    store.addToHistory('Vue')
    store.addToHistory('Vue')
    expect(store.searchHistory.length).toBe(1)
  })

  it('should clear history', () => {
    const store = useSearchStore()
    store.addToHistory('Vue')
    store.addToHistory('React')
    store.clearHistory()
    expect(store.searchHistory.length).toBe(0)
  })

  it('should remove specific history item', async () => {
    const store = useSearchStore()
    store.addToHistory('Vue')
    await new Promise(resolve => setTimeout(resolve, 10))
    store.addToHistory('React')
    // React is added first (index 0), Vue is at index 1 because addToHistory adds to beginning
    const historyItem = store.searchHistory[1]
    expect(historyItem).toBeDefined()
    const id = historyItem!.id
    store.removeHistoryItem(id)
    expect(store.searchHistory.length).toBe(1)
    const remainingItem = store.searchHistory[0]
    expect(remainingItem).toBeDefined()
    expect(remainingItem!.keyword).toBe('React')
  })

  it('should provide search suggestions', () => {
    const store = useSearchStore()
    const suggestions = store.getSuggestions('Vue')
    expect(suggestions.length).toBeGreaterThan(0)
  })

  it('should apply category filter', async () => {
    const store = useSearchStore()
    store.setCategoryFilter('vue')
    const results = await store.search('组件')
    expect(store.selectedCategory).toBe('vue')
  })

  it('should apply difficulty filter', async () => {
    const store = useSearchStore()
    store.setDifficultyFilter('beginner')
    expect(store.selectedDifficulty).toBe('beginner')
  })

  it('should clear all filters', () => {
    const store = useSearchStore()
    store.setCategoryFilter('vue')
    store.setDifficultyFilter('beginner')
    store.toggleTagFilter('JavaScript')
    store.clearFilters()
    expect(store.selectedCategory).toBe('')
    expect(store.selectedDifficulty).toBe('')
    expect(store.selectedTags.length).toBe(0)
  })
})
