<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { categories, knowledgePoints } from '@/data/knowledge'
import type { KnowledgePoint } from '@/types'

const router = useRouter()

const hotKnowledge = computed(() => {
  return knowledgePoints.slice(0, 6)
})

const latestKnowledge = computed(() => {
  return [...knowledgePoints].reverse().slice(0, 4)
})

const getCategoryIcon = (id: string): string => {
  const icons: Record<string, string> = {
    basic: '📚',
    framework: '⚛️',
    engineering: '🛠️',
    advanced: '🚀'
  }
  return icons[id] || '📖'
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

const navigateToCategory = (categoryId: string) => {
  router.push({ name: 'category', params: { categoryId } })
}

const navigateToKnowledge = (knowledgeId: string) => {
  router.push({ name: 'knowledge-detail', params: { id: knowledgeId } })
}
</script>

<template>
  <MainLayout>
    <div class="home-view">
      <!-- Banner区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>系统学习前端技术</h1>
          <p>从基础到进阶，全面掌握前端开发技能</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">100+</span>
              <span class="stat-label">知识点</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">10+</span>
              <span class="stat-label">技术分类</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">1000+</span>
              <span class="stat-label">学习用户</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 分类入口 -->
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">知识分类</h2>
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-card"
              @click="navigateToCategory(category.id)"
            >
              <div class="category-icon">{{ getCategoryIcon(category.id) }}</div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <span class="knowledge-count">{{ category.knowledgeCount }} 个知识点</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门知识点 -->
      <section class="hot-knowledge-section">
        <div class="container">
          <h2 class="section-title">热门知识点</h2>
          <div class="knowledge-grid">
            <div
              v-for="item in hotKnowledge"
              :key="item.id"
              class="knowledge-card"
              @click="navigateToKnowledge(item.id)"
            >
              <div class="knowledge-header">
                <span :class="['difficulty-badge', getDifficultyClass(item.difficulty)]">
                  {{ getDifficultyText(item.difficulty) }}
                </span>
                <span class="category-tag">{{ item.category }}</span>
              </div>
              <h3 class="knowledge-title">{{ item.title }}</h3>
              <p class="knowledge-summary">{{ item.content.slice(0, 80) }}...</p>
              <div class="knowledge-tags">
                <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 最新更新 -->
      <section class="latest-section">
        <div class="container">
          <h2 class="section-title">最新更新</h2>
          <div class="latest-list">
            <div
              v-for="item in latestKnowledge"
              :key="item.id"
              class="latest-item"
              @click="navigateToKnowledge(item.id)"
            >
              <div class="latest-icon">📝</div>
              <div class="latest-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content.slice(0, 60) }}...</p>
              </div>
              <span class="latest-date">{{ item.updatedAt }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 学习路径 -->
      <section class="learning-path-section">
        <div class="container">
          <h2 class="section-title">推荐学习路径</h2>
          <div class="path-timeline">
            <div class="path-item">
              <div class="path-number">1</div>
              <div class="path-content">
                <h4>基础阶段</h4>
                <p>HTML、CSS、JavaScript基础</p>
              </div>
            </div>
            <div class="path-item">
              <div class="path-number">2</div>
              <div class="path-content">
                <h4>进阶阶段</h4>
                <p>框架学习、工程化工具</p>
              </div>
            </div>
            <div class="path-item">
              <div class="path-number">3</div>
              <div class="path-content">
                <h4>高级阶段</h4>
                <p>性能优化、源码阅读</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style scoped>
.home-view {
  padding-bottom: 40px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #42b883 0%, #347474 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.9;
}

/* Categories Section */
.categories-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.category-card h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.category-card p {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.5;
}

.knowledge-count {
  display: inline-block;
  padding: 6px 12px;
  background: #e8f5e9;
  color: #42b883;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* Hot Knowledge Section */
.hot-knowledge-section {
  padding: 60px 0;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.knowledge-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.knowledge-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #42b883;
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.difficulty-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
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

.category-tag {
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
}

.knowledge-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.knowledge-summary {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 15px;
}

.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  background: #f0f0f0;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
}

/* Latest Section */
.latest-section {
  padding: 60px 0;
  background: #f8f9fa;
}

.latest-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.latest-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.latest-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.latest-icon {
  font-size: 24px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f5e9;
  border-radius: 8px;
  flex-shrink: 0;
}

.latest-content {
  flex: 1;
  min-width: 0;
}

.latest-content h4 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-content p {
  font-size: 14px;
  color: #7f8c8d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-date {
  font-size: 13px;
  color: #95a5a6;
  flex-shrink: 0;
}

/* Learning Path Section */
.learning-path-section {
  padding: 60px 0;
}

.path-timeline {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.path-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  max-width: 300px;
  flex: 1;
  min-width: 250px;
}

.path-number {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #42b883;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 50%;
  flex-shrink: 0;
}

.path-content h4 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.path-content p {
  font-size: 14px;
  color: #7f8c8d;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 40px;
  }
  
  .hero-stats {
    gap: 50px;
  }
  
  .knowledge-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .section-title {
    font-size: 24px;
    margin-bottom: 25px;
  }
  
  .hero-section {
    padding: 60px 16px;
  }
  
  .hero-content h1 {
    font-size: 32px;
  }
  
  .hero-content p {
    font-size: 18px;
  }
  
  .hero-stats {
    gap: 30px;
  }
  
  .stat-number {
    font-size: 28px;
  }
  
  .stat-label {
    font-size: 14px;
  }
  
  .categories-section,
  .hot-knowledge-section,
  .latest-section,
  .learning-path-section {
    padding: 40px 0;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }
  
  .category-card {
    padding: 25px 20px;
  }
  
  .category-icon {
    font-size: 40px;
  }
  
  .category-card h3 {
    font-size: 18px;
  }
  
  .knowledge-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .knowledge-card {
    padding: 20px;
  }
  
  .latest-item {
    padding: 15px;
    gap: 15px;
  }
  
  .latest-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .latest-date {
    font-size: 12px;
  }
  
  .path-timeline {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  
  .path-item {
    max-width: 100%;
    width: 100%;
    min-width: auto;
  }
  
  .path-number {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .section-title {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  .hero-section {
    padding: 50px 12px;
  }
  
  .hero-content h1 {
    font-size: 26px;
  }
  
  .hero-content p {
    font-size: 16px;
    margin-bottom: 30px;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .categories-section,
  .hot-knowledge-section,
  .latest-section,
  .learning-path-section {
    padding: 30px 0;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .category-card {
    padding: 20px 15px;
  }
  
  .category-icon {
    font-size: 36px;
    margin-bottom: 10px;
  }
  
  .category-card h3 {
    font-size: 16px;
  }
  
  .category-card p {
    font-size: 13px;
  }
  
  .knowledge-card {
    padding: 18px 15px;
  }
  
  .knowledge-title {
    font-size: 16px;
  }
  
  .knowledge-summary {
    font-size: 13px;
  }
  
  .latest-item {
    flex-wrap: wrap;
    padding: 15px;
  }
  
  .latest-content {
    flex: 1;
    min-width: calc(100% - 65px);
  }
  
  .latest-date {
    width: 100%;
    margin-top: 8px;
    padding-left: 60px;
  }
  
  .path-item {
    gap: 12px;
  }
  
  .path-number {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .path-content h4 {
    font-size: 16px;
  }
  
  .path-content p {
    font-size: 13px;
  }
}
</style>
