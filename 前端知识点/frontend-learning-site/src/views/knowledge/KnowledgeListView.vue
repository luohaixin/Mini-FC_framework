<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { knowledgePoints, categories } from '@/data/knowledge'
import type { KnowledgePoint } from '@/types'

const router = useRouter()

const selectedCategory = ref('')
const selectedDifficulty = ref('')
const sortBy = ref('newest')

const filteredKnowledge = computed(() => {
  let result = [...knowledgePoints]
  
  if (selectedCategory.value) {
    result = result.filter(k => 
      k.category === selectedCategory.value || 
      k.subCategory === selectedCategory.value
    )
  }
  
  if (selectedDifficulty.value) {
    result = result.filter(k => k.difficulty === selectedDifficulty.value)
  }
  
  // 排序
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  
  return result
})

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

const navigateToKnowledge = (id: string) => {
  router.push({ name: 'knowledge-detail', params: { id } })
}

const clearFilters = () => {
  selectedCategory.value = ''
  selectedDifficulty.value = ''
}
</script>

<template>
  <MainLayout>
    <div class="knowledge-list-view">
      <div class="container">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>知识点列表</h1>
          <p>浏览所有前端知识点，按分类和难度筛选</p>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-bar">
          <div class="filter-group">
            <label>分类：</label>
            <select v-model="selectedCategory">
              <option value="">全部分类</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="vue">Vue</option>
              <option value="react">React</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>难度：</label>
            <select v-model="selectedDifficulty">
              <option value="">全部难度</option>
              <option value="beginner">入门</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>排序：</label>
            <select v-model="sortBy">
              <option value="newest">最新发布</option>
              <option value="oldest">最早发布</option>
            </select>
          </div>
          
          <button v-if="selectedCategory || selectedDifficulty" 
                  class="btn-clear" 
                  @click="clearFilters">
            清除筛选
          </button>
        </div>

        <!-- 结果统计 -->
        <div class="results-info">
          共找到 <strong>{{ filteredKnowledge.length }}</strong> 个知识点
        </div>

        <!-- 知识点列表 -->
        <div class="knowledge-grid">
          <div
            v-for="item in filteredKnowledge"
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
            
            <p class="knowledge-summary">{{ item.content.slice(0, 100) }}...</p>
            
            <div class="knowledge-meta">
              <div class="knowledge-tags">
                <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <span class="update-time">{{ item.updatedAt }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredKnowledge.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <p>没有找到符合条件的知识点</p>
          <button class="btn-clear" @click="clearFilters">清除筛选条件</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.knowledge-list-view {
  padding: 40px 0;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
  white-space: nowrap;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
  min-width: 120px;
}

.filter-group select:focus {
  border-color: #42b883;
}

.btn-clear {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-clear:hover {
  background: #c0392b;
}

.results-info {
  margin-bottom: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.results-info strong {
  color: #42b883;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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

.knowledge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
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

.update-time {
  font-size: 12px;
  color: #95a5a6;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .knowledge-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .knowledge-list-view {
    padding: 30px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .page-header {
    margin-bottom: 30px;
  }
  
  .page-header h1 {
    font-size: 26px;
  }
  
  .page-header p {
    font-size: 14px;
  }
  
  .filter-bar {
    padding: 15px;
    gap: 15px;
  }
  
  .filter-group {
    flex: 1;
    min-width: calc(50% - 10px);
  }
  
  .filter-group label {
    font-size: 13px;
  }
  
  .filter-group select {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    padding: 8px 10px;
  }
  
  .knowledge-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .knowledge-card {
    padding: 20px;
  }
  
  .knowledge-title {
    font-size: 16px;
  }
  
  .knowledge-summary {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .knowledge-list-view {
    padding: 20px 0;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .page-header {
    margin-bottom: 25px;
  }
  
  .page-header h1 {
    font-size: 22px;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
    gap: 12px;
  }
  
  .filter-group {
    width: 100%;
    min-width: auto;
  }
  
  .filter-group label {
    width: 60px;
    flex-shrink: 0;
  }
  
  .btn-clear {
    width: 100%;
    margin-top: 5px;
  }
  
  .results-info {
    font-size: 13px;
  }
  
  .knowledge-card {
    padding: 18px 15px;
  }
  
  .knowledge-header {
    margin-bottom: 12px;
  }
  
  .difficulty-badge {
    font-size: 11px;
    padding: 3px 8px;
  }
  
  .knowledge-title {
    font-size: 15px;
    margin-bottom: 8px;
  }
  
  .knowledge-summary {
    font-size: 13px;
    margin-bottom: 12px;
  }
  
  .knowledge-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .empty-icon {
    font-size: 48px;
  }
  
  .empty-state {
    padding: 40px 20px;
  }
}
</style>
