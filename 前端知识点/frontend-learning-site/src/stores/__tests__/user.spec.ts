import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with null user', () => {
    const store = useUserStore()
    expect(store.currentUser).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('should login successfully with correct credentials', async () => {
    const store = useUserStore()
    const result = await store.login({
      email: 'admin@example.com',
      password: '123456'
    })
    expect(result).toBe(true)
    expect(store.isLoggedIn).toBe(true)
    expect(store.userInfo?.email).toBe('admin@example.com')
  })

  it('should fail login with incorrect credentials', async () => {
    const store = useUserStore()
    const result = await store.login({
      email: 'admin@example.com',
      password: 'wrongpassword'
    })
    expect(result).toBe(false)
    expect(store.isLoggedIn).toBe(false)
  })

  it('should register a new user', async () => {
    const store = useUserStore()
    const result = await store.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result).toBe(true)
    expect(store.isLoggedIn).toBe(true)
    expect(store.userInfo?.username).toBe('testuser')
  })

  it('should add and remove favorites', async () => {
    const store = useUserStore()
    await store.login({
      email: 'admin@example.com',
      password: '123456'
    })
    
    store.addFavorite('test-id', 'Test Knowledge', 'html', 'beginner')
    expect(store.favorites.length).toBe(1)
    expect(store.isFavorite('test-id')).toBe(true)
    
    store.removeFavorite('test-id')
    expect(store.favorites.length).toBe(0)
    expect(store.isFavorite('test-id')).toBe(false)
  })

  it('should add and delete notes', async () => {
    const store = useUserStore()
    await store.login({
      email: 'admin@example.com',
      password: '123456'
    })

    store.addNote('test-id', 'Test Knowledge', 'This is a test note')
    expect(store.notes.length).toBe(1)

    const noteItem = store.notes[0]
    expect(noteItem).toBeDefined()
    const noteId = noteItem!.id
    store.deleteNote(noteId)
    expect(store.notes.length).toBe(0)
  })

  it('should update learning status', async () => {
    const store = useUserStore()
    await store.login({
      email: 'admin@example.com',
      password: '123456'
    })

    store.addLearningRecord('test-id', 'Test Knowledge', 'html')
    expect(store.learningRecords.length).toBe(1)

    store.updateLearningStatus('test-id', 'mastered')
    const record = store.learningRecords[0]
    expect(record).toBeDefined()
    expect(record!.status).toBe('mastered')
  })

  it('should logout correctly', async () => {
    const store = useUserStore()
    await store.login({
      email: 'admin@example.com',
      password: '123456'
    })
    
    store.logout()
    expect(store.isLoggedIn).toBe(false)
    expect(store.currentUser).toBeNull()
    expect(store.favorites.length).toBe(0)
  })
})
