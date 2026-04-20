<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const learningStats = computed(() => {
  const records = userStore.learningRecords
  return {
    notStarted: records.filter(r => r.status === 'not_started').length,
    learning: records.filter(r => r.status === 'learning').length,
    mastered: records.filter(r => r.status === 'mastered').length
  }
})

const navigateToKnowledge = (id: string) => {
  router.push({ name: 'knowledge-detail', params: { id } })
}

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    not_started: '未学习',
    learning: '学习中',
    mastered: '已掌握'
  }
  return texts[status] || status
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    not_started: 'status-not-started',
    learning: 'status-learning',
    mastered: 'status-mastered'
  }
  return classes[status] || ''
}
</script>

<template>
  <MainLayout>
    <div class="learning-view">
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
              <router-link to="/favorites" class="nav-item">我的收藏</router-link>
              <router-link to="/learning" class="nav-item active">学习记录</router-link>
              <router-link to="/notes" class="nav-item">我的笔记</router-link>
            </nav>
          </aside>

          <main class="profile-content">
            <div class="content-header">
              <h1>学习记录</h1>
            </div>

            <!-- 学习统计 -->
            <div class="stats-cards">
              <div class="stat-card">
                <span class="stat-number">{{ learningStats.notStarted }}</span>
                <span class="stat-label">未学习</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ learningStats.learning }}</span>
                <span class="stat-label">学习中</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">{{ learningStats.mastered }}</span>
                <span class="stat-label">已掌握</span>
              </div>
            </div>

            <!-- 学习列表 -->
            <div v-if="userStore.learningRecords.length > 0" class="learning-list">
              <div
                v-for="record in userStore.learningRecords"
                :key="record.knowledgeId"
                class="learning-card"
                @click="navigateToKnowledge(record.knowledgeId)"
              >
                <div class="record-info">
                  <h3 class="title">{{ record.knowledgeTitle }}</h3>
                  <span class="category">{{ record.category }}</span>
                </div>
                <span :class="['status-badge', getStatusClass(record.status)]">
                  {{ getStatusText(record.status) }}
                </span>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">📚</div>
              <p>还没有学习记录</p>
              <router-link to="/knowledge" class="btn-browse">开始学习</router-link>
            </div>
          </main>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.learning-view {
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
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.content-header h1 {
  font-size: 24px;
  color: #2c3e50;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

.learning-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.learning-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.learning-card:hover {
  background: #e8f5e9;
}

.record-info {
  flex: 1;
}

.title {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.category {
  font-size: 13px;
  color: #7f8c8d;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-not-started {
  background: #e0e0e0;
  color: #666;
}

.status-learning {
  background: #fff3e0;
  color: #ef6c00;
}

.status-mastered {
  background: #e8f5e9;
  color: #2e7d32;
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
  
  .stats-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
