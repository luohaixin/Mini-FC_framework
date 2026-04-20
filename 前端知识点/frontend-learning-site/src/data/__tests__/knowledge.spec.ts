import { describe, it, expect } from 'vitest'
import { 
  knowledgePoints, 
  categories, 
  getKnowledgeById, 
  getKnowledgeByCategory,
  searchKnowledge 
} from '../knowledge'

describe('Knowledge Data', () => {
  it('should have knowledge points', () => {
    expect(knowledgePoints.length).toBeGreaterThan(0)
  })

  it('should have categories', () => {
    expect(categories.length).toBeGreaterThan(0)
  })

  it('should find knowledge by id', () => {
    const knowledgeItem = knowledgePoints[0]
    expect(knowledgeItem).toBeDefined()
    const id = knowledgeItem!.id
    const knowledge = getKnowledgeById(id)
    expect(knowledge).toBeDefined()
    expect(knowledge?.id).toBe(id)
  })

  it('should return undefined for non-existent id', () => {
    const knowledge = getKnowledgeById('non-existent-id')
    expect(knowledge).toBeUndefined()
  })

  it('should get knowledge by category', () => {
    const categoryKnowledge = getKnowledgeByCategory('vue')
    expect(categoryKnowledge.length).toBeGreaterThan(0)
    categoryKnowledge.forEach(k => {
      expect(k.category === 'vue' || k.subCategory === 'vue').toBe(true)
    })
  })

  it('should search knowledge by keyword', () => {
    const results = searchKnowledge('Vue')
    expect(results.length).toBeGreaterThan(0)
  })

  it('should search knowledge by tag', () => {
    const results = searchKnowledge('HTML5')
    expect(results.length).toBeGreaterThan(0)
  })

  it('should return empty array for non-matching search', () => {
    const results = searchKnowledge('xyznonexistent12345')
    expect(results).toEqual([])
  })

  it('should have valid knowledge point structure', () => {
    const knowledge = knowledgePoints[0]
    expect(knowledge).toBeDefined()
    expect(knowledge!.id).toBeDefined()
    expect(knowledge!.title).toBeDefined()
    expect(knowledge!.category).toBeDefined()
    expect(knowledge!.difficulty).toBeDefined()
    expect(knowledge!.tags).toBeInstanceOf(Array)
    expect(knowledge!.content).toBeDefined()
  })

  it('should have valid category structure', () => {
    const category = categories[0]
    expect(category).toBeDefined()
    expect(category!.id).toBeDefined()
    expect(category!.name).toBeDefined()
    expect(category!.description).toBeDefined()
    expect(category!.knowledgeCount).toBeDefined()
  })
})
