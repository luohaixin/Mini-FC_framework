<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const navigateToKnowledge = (id: string) => {
  router.push({ name: 'knowledge-detail', params: { id } })
}

const removeFavorite = (knowledgeId: string) => {
  userStore.removeFavorite(knowledgeId)
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
</script>

<template>
  <MainLayout>
    <div class="favorites-view">
      <div class="container">
        <div class="profile-layout">
          <aside class="profile-sidebar">
            <div class="user-card">
              <img :src="userStore.userInfo?.avatar" alt="avatar" class="user-avatar" />
              <h3 class="user-name">{{ userStore.userInfo?.username }}</h3>
              <p class="user-email">{{ userStore.userInfo?.email }}</p>
            </div>
            <nav class="profile-nav">
              <router-link to="/profile" class="nav-item">个人资料</router-link>
              <router-link to="/favorites" class="nav-item active">我的收藏</router-link>
              <router-link to="/learning" class="nav-item">学习记录</router-link>
              <router-link to="/notes" class="nav-item">我的笔记</router-link>
            </nav>
          </aside>

          <main class="profile-content">
            <div class="content-header">
              <h1>我的收藏</h1>
              <span class="count">共 {{ userStore.favorites.length }} 个</span>
            </div>

            <div v-if="userStore.favorites.length > 0" class="favorites-list">
              <div
                v-for="item in userStore.favorites"
                :key="item.id"
                class="favorite-card"
              >
                <div class="card-content" @click="navigateToKnowledge(item.knowledgeId)">
                  <div class="card-header">
                    <span :class="['difficulty-badge', getDifficultyClass(item.difficulty)]">
                      {{ getDifficultyText(item.difficulty) }}
                    </span>
                    <span class="category">{{ item.category }}</span>
                  </div>
                  <h3 class="title">{{ item.knowledgeTitle }}</h3>
                  <span class="date">收藏于 {{ item.createdAt }}</span>
                </div>
                <button class="btn-remove" @click.stop="removeFavorite(item.knowledgeId)">
                  🗑️
                </button>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">🤍</div>
              <p>还没有收藏任何知识点</p>
              <router-link to="/knowledge" class="btn-browse">去浏览知识点</router-link>
            </div>
          </main>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.favorites-view {
  padding: 40px 0;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

.profile-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.user-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
  object-fit: cover;
}

.user-name {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.user-email {
  font-size: 14px;
  color: #7f8c8d;
}

.profile-nav {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.nav-item {
  display: block;
  padding: 15px 25px;
  color: #555;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  background: #e8f5e9;
  color: #42b883;
  border-left-color: #42b883;
}

.profile-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.content-header h1 {
  font-size: 24px;
  color: #2c3e50;
}

.count {
  color: #7f8c8d;
  font-size: 14px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.favorite-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s;
}

.favorite-card:hover {
  background: #e8f5e9;
}

.card-content {
  flex: 1;
  cursor: pointer;
}

.card-header {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.difficulty-badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
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

.category {
  font-size: 12px;
  color: #7f8c8d;
}

.title {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.date {
  font-size: 12px;
  color: #95a5a6;
}

.btn-remove {
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.btn-remove:hover {
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
  margin-bottom: 20px;
}

.btn-browse {
  display: inline-block;
  padding: 12px 30px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s;
}

.btn-browse:hover {
  background: #369870;
}

@media (max-width: 968px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}
</style>
