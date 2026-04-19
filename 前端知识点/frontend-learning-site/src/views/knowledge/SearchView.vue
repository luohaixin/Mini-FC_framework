<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const keyword = ref('')

const hasSearch = computed(() => keyword.value.trim() !== '')

const performSearch = async () => {
  if (keyword.value.trim()) {
    await searchStore.search(keyword.value)
    router.replace({ query: { q: keyword.value } })
  }
}

const searchFromHistory = (historyKeyword: string) => {
  keyword.value = historyKeyword
  performSearch()
}

const clearHistory = () => {
  searchStore.clearHistory()
}

const removeHistoryItem = (id: string) => {
  searchStore.removeHistoryItem(id)
}

const navigateToKnowledge = (id: string) => {
  router.push({ name: 'knowledge-detail', params: { id } })
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

onMounted(() => {
  const queryKeyword = route.query.q as string
  if (queryKeyword) {
    keyword.value = queryKeyword
    performSearch()
  }
  searchStore.loadHistory()
})

watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== keyword.value) {
    keyword.value = newQuery as string
    performSearch()
  }
})
</script>

<template>
  <MainLayout>
    <div class="search-view">
      <div class="container">
        <!-- 搜索框 -->
        <div class="search-box-large">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索知识点、标签..."
            @keyup.enter="performSearch"
          />
          <button class="search-btn" @click="performSearch">
            🔍 搜索
          </button>
        </div>

        <!-- 搜索历史 -->
        <div v-if="!hasSearch && searchStore.searchHistory.length > 0" class="search-history">
          <div class="history-header">
            <h3>搜索历史</h3>
            <button class="btn-clear" @click="clearHistory">清空历史</button>
          </div>
          <div class="history-list">
            <div
              v-for="item in searchStore.searchHistory"
              :key="item.id"
              class="history-item"
            >
              <span class="history-keyword" @click="searchFromHistory(item.keyword)">
                🕐 {{ item.keyword }}
              </span>
              <button class="btn-remove" @click="removeHistoryItem(item.id)">×</button>
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="hasSearch" class="search-results">
          <div class="results-header">
            <h2>"{{ keyword }}" 的搜索结果</h2>
            <span class="results-count">找到 {{ searchStore.searchResults.length }} 个结果</span>
          </div>

          <div v-if="searchStore.isSearching" class="loading-state">
            <div class="spinner"></div>
            <p>搜索中...</p>
          </div>

          <div v-else-if="searchStore.searchResults.length > 0" class="results-list">
            <div
              v-for="result in searchStore.searchResults"
              :key="result.id"
              class="result-card"
              @click="navigateToKnowledge(result.id)"
            >
              <div class="result-header">
                <span :class="['difficulty-badge', getDifficultyClass(result.difficulty)]">
                  {{ getDifficultyText(result.difficulty) }}
                </span>
                <span class="category-tag">{{ result.category }}</span>
              </div>
              
              <h3 class="result-title">{{ result.title }}</h3>
              
              <p class="result-summary">{{ result.summary }}</p>
              
              <div class="result-tags">
                <span v-for="tag in result.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>未找到相关结果</h3>
            <p>尝试使用其他关键词或检查拼写</p>
          </div>
        </div>

        <!-- 热门搜索建议 -->
        <div v-if="!hasSearch" class="hot-searches">
          <h3>热门搜索</h3>
          <div class="hot-tags">
            <span class="hot-tag" @click="searchFromHistory('Vue')">Vue</span>
            <span class="hot-tag" @click="searchFromHistory('React')">React</span>
            <span class="hot-tag" @click="searchFromHistory('JavaScript')">JavaScript</span>
            <span class="hot-tag" @click="searchFromHistory('TypeScript')">TypeScript</span>
            <span class="hot-tag" @click="searchFromHistory('CSS')">CSS</span>
            <span class="hot-tag" @click="searchFromHistory('HTML')">HTML</span>
            <span class="hot-tag" @click="searchFromHistory('Promise')">Promise</span>
            <span class="hot-tag" @click="searchFromHistory('Flexbox')">Flexbox</span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.search-view {
  padding: 40px 0;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 搜索框 */
.search-box-large {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}

.search-box-large input {
  flex: 1;
  height: 56px;
  padding: 0 25px;
  border: 2px solid #e0e0e0;
  border-radius: 28px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-box-large input:focus {
  border-color: #42b883;
}

.search-btn {
  height: 56px;
  padding: 0 35px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 28px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #369870;
}

/* 搜索历史 */
.search-history {
  margin-bottom: 40px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.history-header h3 {
  font-size: 18px;
  color: #2c3e50;
}

.btn-clear {
  padding: 6px 12px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: #f5f5f5;
  border-color: #999;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: #f5f5f5;
  border-radius: 20px;
  transition: background 0.2s;
}

.history-item:hover {
  background: #e0e0e0;
}

.history-keyword {
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.btn-remove {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.btn-remove:hover {
  color: #e74c3c;
}

/* 搜索结果 */
.search-results {
  margin-top: 30px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.results-header h2 {
  font-size: 20px;
  color: #2c3e50;
}

.results-count {
  font-size: 14px;
  color: #7f8c8d;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #e0e0e0;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #42b883;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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

.result-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.result-summary {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 15px;
}

.result-tags {
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

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
}

/* 热门搜索 */
.hot-searches {
  margin-top: 40px;
}

.hot-searches h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hot-tag {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-tag:hover {
  background: #42b883;
  border-color: #42b883;
  color: white;
}

@media (max-width: 768px) {
  .search-box-large {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
  }
}
</style>
