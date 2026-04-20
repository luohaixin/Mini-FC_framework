<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.loadUsers()
})
</script>

<template>
  <div class="dashboard-view">
    <h1>数据概览</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <span class="stat-number">{{ adminStore.totalUsers }}</span>
          <span class="stat-label">总用户数</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-info">
          <span class="stat-number">{{ adminStore.totalKnowledge }}</span>
          <span class="stat-label">知识点总数</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🟢</div>
        <div class="stat-info">
          <span class="stat-number">{{ adminStore.knowledgeStats.beginner }}</span>
          <span class="stat-label">入门知识点</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🟡</div>
        <div class="stat-info">
          <span class="stat-number">{{ adminStore.knowledgeStats.intermediate }}</span>
          <span class="stat-label">中级知识点</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔴</div>
        <div class="stat-info">
          <span class="stat-number">{{ adminStore.knowledgeStats.advanced }}</span>
          <span class="stat-label">高级知识点</span>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <h2>系统状态</h2>
      <div class="status-cards">
        <div class="status-card success">
          <span class="status-dot"></span>
          <span>系统运行正常</span>
        </div>
        <div class="status-card">
          <span>Vue 3 + TypeScript + Vite</span>
        </div>
        <div class="status-card">
          <span>Pinia 状态管理</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  max-width: 1400px;
}

h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

.recent-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.recent-section h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.status-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
}

.status-card.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
