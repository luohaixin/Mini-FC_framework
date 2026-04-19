<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { categories, getKnowledgeByCategory } from '@/data/knowledge'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()

const selectedCategory = ref(route.params.categoryId as string)
const expandedCategories = ref<string[]>([])

const currentCategory = computed(() => {
  return findCategory(categories, selectedCategory.value)
})

const knowledgeList = computed(() => {
  return getKnowledgeByCategory(selectedCategory.value)
})

// 判断当前分类是否有子分类
const hasChildren = computed(() => {
  return currentCategory.value?.children && currentCategory.value.children.length > 0
})

// 获取当前分类的子分类列表
const childrenCategories = computed(() => {
  return currentCategory.value?.children || []
})

const findCategory = (cats: Category[], id: string): Category | null => {
  for (const cat of cats) {
    if (cat.id === id) return cat
    if (cat.children) {
      const found = findCategory(cat.children, id)
      if (found) return found
    }
  }
  return null
}

const isExpanded = (id: string): boolean => {
  return expandedCategories.value.includes(id)
}

const toggleExpand = (id: string) => {
  const index = expandedCategories.value.indexOf(id)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(id)
  }
}

const selectCategory = (id: string) => {
  selectedCategory.value = id
  router.push({ name: 'category', params: { categoryId: id } })
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

const navigateToKnowledge = (id: string) => {
  router.push({ name: 'knowledge-detail', params: { id } })
}

watch(() => route.params.categoryId, (newId) => {
  selectedCategory.value = newId as string
})
</script>

<template>
  <MainLayout>
    <div class="category-view">
      <div class="container">
        <!-- 侧边栏 -->
        <aside class="category-sidebar">
          <h3 class="sidebar-title">知识分类</h3>
          <div class="category-tree">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
            >
              <div
                class="category-header"
                :class="{ active: selectedCategory === category.id }"
                @click="selectCategory(category.id)"
              >
                <span 
                  v-if="category.children"
                  class="expand-icon"
                  :class="{ expanded: isExpanded(category.id) }"
                  @click.stop="toggleExpand(category.id)"
                >
                  ▶
                </span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">({{ category.knowledgeCount }})</span>
              </div>
              
              <div
                v-if="category.children && isExpanded(category.id)"
                class="subcategory-list"
              >
                <div
                  v-for="sub in category.children"
                  :key="sub.id"
                  class="subcategory-item"
                >
                  <div
                    class="subcategory-header"
                    :class="{ active: selectedCategory === sub.id }"
                    @click="selectCategory(sub.id)"
                  >
                    <span 
                      v-if="sub.children"
                      class="expand-icon"
                      :class="{ expanded: isExpanded(sub.id) }"
                      @click.stop="toggleExpand(sub.id)"
                    >
                      ▶
                    </span>
                    <span class="category-name">{{ sub.name }}</span>
                    <span class="category-count">({{ sub.knowledgeCount }})</span>
                  </div>
                  
                  <div
                    v-if="sub.children && isExpanded(sub.id)"
                    class="sub-subcategory-list"
                  >
                    <div
                      v-for="subSub in sub.children"
                      :key="subSub.id"
                      class="sub-subcategory-item"
                      :class="{ active: selectedCategory === subSub.id }"
                      @click="selectCategory(subSub.id)"
                    >
                      <span class="category-name">{{ subSub.name }}</span>
                      <span class="category-count">({{ subSub.knowledgeCount }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- 内容区域 -->
        <main class="category-content">
          <div class="content-header">
            <h1>{{ currentCategory?.name || '知识点列表' }}</h1>
            <p v-if="currentCategory?.description">{{ currentCategory.description }}</p>
          </div>

          <!-- 有子分类时显示子分类卡片 -->
          <template v-if="hasChildren">
            <div class="results-info">
              共 <strong>{{ childrenCategories.length }}</strong> 个子分类
            </div>
            <div class="category-grid">
              <div
                v-for="child in childrenCategories"
                :key="child.id"
                class="category-card"
                @click="selectCategory(child.id)"
              >
                <div class="category-card-header">
                  <h3 class="category-card-title">{{ child.name }}</h3>
                  <span class="category-card-count">{{ child.knowledgeCount }} 个知识点</span>
                </div>
                <p class="category-card-description">{{ child.description }}</p>
                <div class="category-card-arrow">→</div>
              </div>
            </div>
          </template>

          <!-- 没有子分类时显示知识点列表 -->
          <template v-else>
            <div class="results-info">
              共找到 <strong>{{ knowledgeList.length }}</strong> 个知识点
            </div>

            <div class="knowledge-grid">
              <div
                v-for="item in knowledgeList"
                :key="item.id"
                class="knowledge-card"
                @click="navigateToKnowledge(item.id)"
              >
                <div class="knowledge-header">
                  <span :class="['difficulty-badge', getDifficultyClass(item.difficulty)]">
                    {{ getDifficultyText(item.difficulty) }}
                  </span>
                  <span class="category-tag">{{ item.subCategory || item.category }}</span>
                </div>
                
                <h3 class="knowledge-title">{{ item.title }}</h3>
                
                <p class="knowledge-summary">{{ item.content.slice(0, 100) }}...</p>
                
                <div class="knowledge-tags">
                  <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="knowledgeList.length === 0" class="empty-state">
              <div class="empty-icon">📚</div>
              <p>该分类下暂无知识点</p>
            </div>
          </template>
        </main>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.category-view {
  padding: 40px 0;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

/* 侧边栏 */
.category-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.sidebar-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.category-tree {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.category-header,
.subcategory-header,
.sub-subcategory-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.category-header:hover,
.subcategory-header:hover,
.sub-subcategory-item:hover {
  background: #f5f5f5;
}

.category-header.active,
.subcategory-header.active,
.sub-subcategory-item.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.expand-icon {
  font-size: 10px;
  transition: transform 0.2s;
  color: #999;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.category-name {
  flex: 1;
  font-size: 14px;
}

.category-count {
  font-size: 12px;
  color: #999;
}

.subcategory-list {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sub-subcategory-list {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.subcategory-item,
.sub-subcategory-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* 内容区域 */
.category-content {
  min-width: 0;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.content-header p {
  color: #7f8c8d;
  font-size: 15px;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

/* 子分类卡片样式 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
  position: relative;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #42b883;
}

.category-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.category-card-title {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.category-card-count {
  font-size: 13px;
  color: #42b883;
  background: #e8f5e9;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.category-card-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.category-card-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 20px;
  color: #42b883;
  opacity: 0;
  transition: opacity 0.3s;
}

.category-card:hover .category-card-arrow {
  opacity: 1;
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
}

@media (max-width: 968px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .category-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .knowledge-grid {
    grid-template-columns: 1fr;
  }
}
</style>
