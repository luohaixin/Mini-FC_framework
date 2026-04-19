<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { getKnowledgeById, knowledgePoints } from '@/data/knowledge'
import { useUserStore } from '@/stores/user'
import type { KnowledgePoint, Note, LearningRecord } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const knowledge = ref<KnowledgePoint | null>(null)
const showNoteForm = ref(false)
const noteContent = ref('')
const copiedCode = ref<string | null>(null)
const sidebarOpen = ref(false)

const isFavorite = computed(() => {
  return knowledge.value ? userStore.isFavorite(knowledge.value.id) : false
})

const knowledgeId = computed(() => knowledge.value?.id ?? '')

const relatedKnowledge = computed(() => {
  if (!knowledge.value) return []
  return knowledgePoints.filter(k =>
    knowledge.value!.relatedPoints.includes(k.id)
  )
})

const loadKnowledge = () => {
  const id = route.params.id as string
  knowledge.value = getKnowledgeById(id) || null
  
  if (knowledge.value && userStore.isLoggedIn) {
    userStore.addLearningRecord(
      knowledge.value.id,
      knowledge.value.title,
      knowledge.value.category
    )
  }
}

const toggleFavorite = () => {
  if (!knowledge.value || !userStore.isLoggedIn) {
    if (!userStore.isLoggedIn) {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
    }
    return
  }
  
  if (isFavorite.value) {
    userStore.removeFavorite(knowledge.value.id)
  } else {
    userStore.addFavorite(
      knowledge.value.id,
      knowledge.value.title,
      knowledge.value.category,
      knowledge.value.difficulty
    )
  }
}

const copyCode = async (code: string, exampleId: string) => {
  try {
    await navigator.clipboard.writeText(code)
    copiedCode.value = exampleId
    setTimeout(() => {
      copiedCode.value = null
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const submitNote = () => {
  if (!knowledge.value || !noteContent.value.trim()) return
  
  userStore.addNote(
    knowledge.value.id,
    knowledge.value.title,
    noteContent.value
  )
  
  noteContent.value = ''
  showNoteForm.value = false
}

const shareKnowledge = () => {
  if (navigator.share) {
    navigator.share({
      title: knowledge.value?.title,
      text: `来看看这个前端知识点：${knowledge.value?.title}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const getDifficultyClass = (difficulty: string): string => {
  const classes: Record<string, string> = {
    beginner: 'difficulty-beginner',
    intermediate: 'difficulty-intermediate',
    advanced: 'difficulty-advanced'
  }
  return classes[difficulty] || ''
}

const getDifficultyText = (difficulty: string): string => {
  const texts: Record<string, string> = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级'
  }
  return texts[difficulty] || difficulty
}

// 转义HTML特殊字符，防止标签被解析
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 格式化内容：转义HTML并保留换行
const formatContent = (content: string): string => {
  // 先转义HTML特殊字符
  let formatted = escapeHtml(content)
  // 将换行符转换为<br>标签
  formatted = formatted.replace(/\n/g, '<br>')
  return formatted
}

onMounted(() => {
  loadKnowledge()
})
</script>

<template>
  <MainLayout>
    <div v-if="knowledge" class="knowledge-detail-view">
      <div class="container">
        <!-- 面包屑导航 -->
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link :to="`/category/${knowledge.category}`">{{ knowledge.category }}</router-link>
          <span class="separator">/</span>
          <span class="current">{{ knowledge.title }}</span>
        </nav>

        <!-- 知识点头部 -->
        <header class="knowledge-header">
          <div class="header-main">
            <span :class="['difficulty-badge', getDifficultyClass(knowledge.difficulty)]">
              {{ getDifficultyText(knowledge.difficulty) }}
            </span>
            <h1 class="knowledge-title">{{ knowledge.title }}</h1>
            <div class="knowledge-meta">
              <span class="category">{{ knowledge.category }}</span>
              <span class="separator">·</span>
              <span class="date">更新于 {{ knowledge.updatedAt }}</span>
            </div>
          </div>
          
          <div class="header-actions">
            <button 
              class="action-btn"
              :class="{ active: isFavorite }"
              @click="toggleFavorite"
            >
              <span class="icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
              <span class="btn-text">{{ isFavorite ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="action-btn" @click="shareKnowledge">
              <span class="icon">📤</span>
              <span class="btn-text">分享</span>
            </button>
            <button class="action-btn sidebar-toggle" @click="toggleSidebar">
              <span class="icon">📋</span>
              <span class="btn-text">侧边栏</span>
            </button>
          </div>
        </header>

        <!-- 知识点内容 -->
        <div class="knowledge-content">
          <main class="content-main">
            <!-- 核心概念 -->
            <section class="content-section">
              <h2>核心概念</h2>
              <div class="content-text" v-html="formatContent(knowledge.content)"></div>
            </section>

            <!-- 代码示例 -->
            <section v-if="knowledge.codeExamples.length > 0" class="content-section">
              <h2>代码示例</h2>
              <div 
                v-for="example in knowledge.codeExamples" 
                :key="example.id"
                class="code-example"
              >
                <div class="code-header">
                  <span class="code-language">{{ example.language }}</span>
                  <button 
                    class="copy-btn"
                    @click="copyCode(example.code, example.id)"
                  >
                    {{ copiedCode === example.id ? '✓ 已复制' : '📋 复制' }}
                  </button>
                </div>
                <pre class="code-block"><code>{{ example.code }}</code></pre>
                <p v-if="example.description" class="code-description">
                  {{ example.description }}
                </p>
              </div>
            </section>

            <!-- 注意事项 -->
            <section v-if="knowledge.notes" class="content-section">
              <h2>注意事项</h2>
              <div class="notes-box">
                <p>⚠️ {{ knowledge.notes }}</p>
              </div>
            </section>

            <!-- 兼容性说明 -->
            <section v-if="knowledge.compatibility" class="content-section">
              <h2>兼容性</h2>
              <div class="compatibility-box">
                <p>🌐 {{ knowledge.compatibility }}</p>
              </div>
            </section>

            <!-- 相关知识点 -->
            <section v-if="relatedKnowledge.length > 0" class="content-section">
              <h2>相关知识点</h2>
              <div class="related-list">
                <router-link
                  v-for="item in relatedKnowledge"
                  :key="item.id"
                  :to="`/knowledge/${item.id}`"
                  class="related-item"
                >
                  <span class="related-title">{{ item.title }}</span>
                  <span :class="['related-difficulty', getDifficultyClass(item.difficulty)]">
                    {{ getDifficultyText(item.difficulty) }}
                  </span>
                </router-link>
              </div>
            </section>

            <!-- 笔记功能 -->
            <section class="content-section">
              <div class="notes-header">
                <h2>我的笔记</h2>
                <button 
                  v-if="!showNoteForm"
                  class="btn-add-note"
                  @click="showNoteForm = true"
                >
                  + 添加笔记
                </button>
              </div>
              
              <div v-if="showNoteForm" class="note-form">
                <textarea
                  v-model="noteContent"
                  placeholder="记录你的学习心得..."
                  rows="4"
                ></textarea>
                <div class="form-actions">
                  <button class="btn-cancel" @click="showNoteForm = false">取消</button>
                  <button class="btn-submit" @click="submitNote">保存笔记</button>
                </div>
              </div>

              <div v-if="userStore.notes.filter((n: Note) => n.knowledgeId === knowledgeId).length > 0"
                   class="notes-list">
                <div
                  v-for="note in userStore.notes.filter((n: Note) => n.knowledgeId === knowledgeId)"
                  :key="note.id"
                  class="note-item"
                >
                  <p class="note-content">{{ note.content }}</p>
                  <span class="note-date">{{ note.createdAt }}</span>
                </div>
              </div>
              <div v-else-if="!showNoteForm" class="empty-notes">
                还没有笔记，点击上方按钮添加
              </div>
            </section>
          </main>

          <!-- 侧边栏 -->
          <aside class="content-sidebar" :class="{ open: sidebarOpen }">
            <div class="sidebar-section">
              <h3>标签</h3>
              <div class="tags-list">
                <span v-for="tag in knowledge.tags" :key="tag" class="sidebar-tag">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="sidebar-section">
              <h3>学习状态</h3>
              <div class="learning-status">
                <button
                  class="status-btn"
                  :class="{ active: userStore.learningRecords.find((r: LearningRecord) => r.knowledgeId === knowledgeId)?.status === 'not_started' }"
                  @click="userStore.updateLearningStatus(knowledgeId, 'not_started')"
                >
                  未学习
                </button>
                <button
                  class="status-btn"
                  :class="{ active: userStore.learningRecords.find((r: LearningRecord) => r.knowledgeId === knowledgeId)?.status === 'learning' }"
                  @click="userStore.updateLearningStatus(knowledgeId, 'learning')"
                >
                  学习中
                </button>
                <button
                  class="status-btn"
                  :class="{ active: userStore.learningRecords.find((r: LearningRecord) => r.knowledgeId === knowledgeId)?.status === 'mastered' }"
                  @click="userStore.updateLearningStatus(knowledgeId, 'mastered')"
                >
                  已掌握
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- 404 状态 -->
    <div v-else class="not-found">
      <div class="container">
        <div class="not-found-content">
          <div class="not-found-icon">📚</div>
          <h2>知识点未找到</h2>
          <p>抱歉，您访问的知识点不存在或已被删除</p>
          <router-link to="/knowledge" class="btn-back">
            返回知识点列表
          </router-link>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.knowledge-detail-view {
  padding: 40px 0;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #7f8c8d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.breadcrumb a {
  color: #42b883;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .separator {
  margin: 0 8px;
}

.breadcrumb .current {
  color: #2c3e50;
}

/* 知识点头部 */
.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 20px;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.difficulty-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;
}

.difficulty-beginner {
  background: #e8f5e9;
  color: #2e7d32;
}

.difficulty-intermediate {
  background: #fff3e0;
  color: #ef6c00;
}

.difficulty-advanced {
  background: #fce4ec;
  color: #c2185b;
}

.knowledge-title {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.3;
}

.knowledge-meta {
  font-size: 14px;
  color: #7f8c8d;
}

.knowledge-meta .separator {
  margin: 0 8px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
}

.action-btn:hover {
  background: #f5f5f5;
}

.action-btn.active {
  background: #fce4ec;
  border-color: #f48fb1;
  color: #c2185b;
}

.action-btn .icon {
  font-size: 16px;
}

.sidebar-toggle {
  display: none;
}

/* 知识点内容 */
.knowledge-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.content-main {
  min-width: 0;
}

.content-section {
  margin-bottom: 40px;
}

.content-section h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

/* 代码示例 */
.code-example {
  margin-bottom: 25px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 10px;
}

.code-language {
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
}

.copy-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover {
  background: #f0f0f0;
}

.code-block {
  margin: 0;
  padding: 20px;
  background: #f8f9fa;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
  -webkit-overflow-scrolling: touch;
}

.code-description {
  padding: 15px;
  margin: 0;
  font-size: 14px;
  color: #666;
  background: white;
}

/* 注意事项和兼容性 */
.notes-box,
.compatibility-box {
  padding: 20px;
  background: #fff8e1;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.compatibility-box {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.notes-box p,
.compatibility-box p {
  margin: 0;
  font-size: 15px;
  color: #555;
}

/* 相关知识点 */
.related-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  flex-wrap: wrap;
  gap: 10px;
}

.related-item:hover {
  background: #e8f5e9;
}

.related-title {
  color: #2c3e50;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-difficulty {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  flex-shrink: 0;
}

/* 笔记功能 */
.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.btn-add-note {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add-note:hover {
  background: #369870;
}

.note-form {
  margin-bottom: 20px;
}

.note-form textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  outline: none;
}

.note-form textarea:focus {
  border-color: #42b883;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.btn-cancel,
.btn-submit {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.btn-submit {
  background: #42b883;
  border: none;
  color: white;
}

.btn-submit:hover {
  background: #369870;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.note-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.note-content {
  margin: 0 0 10px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

.note-date {
  font-size: 12px;
  color: #95a5a6;
}

.empty-notes {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
  font-size: 14px;
}

/* 侧边栏 */
.content-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.sidebar-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.sidebar-section h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sidebar-tag {
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}

.learning-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-btn {
  padding: 10px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.status-btn:hover {
  background: #f0f0f0;
}

.status-btn.active {
  background: #42b883;
  border-color: #42b883;
  color: white;
}

/* 404 状态 */
.not-found {
  padding: 80px 0;
  min-height: calc(100vh - 60px);
}

.not-found-content {
  text-align: center;
}

.not-found-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.not-found-content h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.not-found-content p {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.btn-back {
  display: inline-block;
  padding: 12px 30px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #369870;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .knowledge-content {
    gap: 30px;
  }
  
  .content-sidebar {
    width: 260px;
  }
}

@media (max-width: 900px) {
  .knowledge-content {
    grid-template-columns: 1fr;
  }
  
  .content-sidebar {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 280px;
    background: white;
    z-index: 998;
    padding: 20px;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .content-sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar-section {
    background: #f8f9fa;
  }
  
  .sidebar-toggle {
    display: flex;
  }
}

@media (max-width: 768px) {
  .knowledge-detail-view {
    padding: 30px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .breadcrumb {
    font-size: 13px;
    margin-bottom: 15px;
  }
  
  .knowledge-header {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 15px;
  }
  
  .knowledge-title {
    font-size: 24px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .action-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .btn-text {
    display: none;
  }
  
  .action-btn .icon {
    font-size: 18px;
  }
  
  .content-section {
    margin-bottom: 30px;
  }
  
  .content-section h2 {
    font-size: 20px;
    margin-bottom: 15px;
    padding-bottom: 8px;
  }
  
  .content-text {
    font-size: 15px;
  }
  
  .code-block {
    padding: 15px;
    font-size: 13px;
  }
  
  .code-description {
    padding: 12px;
    font-size: 13px;
  }
  
  .related-item {
    padding: 12px 15px;
  }
  
  .note-form textarea {
    padding: 12px;
    font-size: 14px;
  }
  
  .not-found {
    padding: 60px 0;
  }
  
  .not-found-icon {
    font-size: 60px;
  }
  
  .not-found-content h2 {
    font-size: 24px;
  }
  
  .btn-back {
    padding: 10px 24px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .knowledge-detail-view {
    padding: 20px 0;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .breadcrumb {
    font-size: 12px;
  }
  
  .knowledge-header {
    margin-bottom: 20px;
  }
  
  .knowledge-title {
    font-size: 20px;
  }
  
  .knowledge-meta {
    font-size: 13px;
  }
  
  .action-btn {
    padding: 8px 12px;
  }
  
  .action-btn .icon {
    font-size: 16px;
  }
  
  .content-section h2 {
    font-size: 18px;
  }
  
  .content-text {
    font-size: 14px;
    line-height: 1.7;
  }
  
  .code-header {
    padding: 8px 12px;
  }
  
  .code-language {
    font-size: 12px;
  }
  
  .copy-btn {
    padding: 5px 10px;
    font-size: 12px;
  }
  
  .code-block {
    padding: 12px;
    font-size: 12px;
  }
  
  .notes-box,
  .compatibility-box {
    padding: 15px;
  }
  
  .notes-box p,
  .compatibility-box p {
    font-size: 14px;
  }
  
  .related-item {
    padding: 10px 12px;
  }
  
  .related-title {
    font-size: 14px;
  }
  
  .btn-add-note {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .note-form textarea {
    padding: 10px;
    font-size: 14px;
  }
  
  .btn-cancel,
  .btn-submit {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .note-content {
    font-size: 14px;
  }
  
  .content-sidebar {
    width: 100%;
    top: 60px;
  }
  
  .not-found-icon {
    font-size: 48px;
  }
  
  .not-found-content h2 {
    font-size: 20px;
  }
  
  .not-found-content p {
    font-size: 14px;
  }
  
  .btn-back {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
