<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isEditing = ref(false)
const profileForm = ref({
  nickname: userStore.userInfo?.username || '',
  avatar: userStore.userInfo?.avatar || '',
  bio: userStore.userInfo?.bio || '',
  learningGoal: userStore.userInfo?.learningGoal || ''
})

const handleSave = async () => {
  const success = await userStore.updateProfile(profileForm.value)
  if (success) {
    isEditing.value = false
  }
}

const handleCancel = () => {
  profileForm.value = {
    nickname: userStore.userInfo?.username || '',
    avatar: userStore.userInfo?.avatar || '',
    bio: userStore.userInfo?.bio || '',
    learningGoal: userStore.userInfo?.learningGoal || ''
  }
  isEditing.value = false
}
</script>

<template>
  <MainLayout>
    <div class="profile-view">
      <div class="container">
        <div class="profile-layout">
          <!-- 侧边栏 -->
          <aside class="profile-sidebar">
            <div class="user-card">
              <img :src="userStore.userInfo?.avatar" alt="avatar" class="user-avatar" />
              <h3 class="user-name">{{ userStore.userInfo?.username }}</h3>
              <p class="user-email">{{ userStore.userInfo?.email }}</p>
            </div>
            
            <nav class="profile-nav">
              <router-link to="/profile" class="nav-item active">个人资料</router-link>
              <router-link to="/favorites" class="nav-item">我的收藏</router-link>
              <router-link to="/learning" class="nav-item">学习记录</router-link>
              <router-link to="/notes" class="nav-item">我的笔记</router-link>
            </nav>
          </aside>

          <!-- 主内容区 -->
          <main class="profile-content">
            <div class="content-header">
              <h1>个人资料</h1>
              <button v-if="!isEditing" class="btn-edit" @click="isEditing = true">
                编辑资料
              </button>
            </div>

            <div class="profile-form">
              <div class="form-group">
                <label>头像</label>
                <div class="avatar-section">
                  <img :src="profileForm.avatar || userStore.userInfo?.avatar" alt="avatar" class="preview-avatar" />
                  <input v-if="isEditing" v-model="profileForm.avatar" type="text" placeholder="头像URL" class="avatar-input" />
                </div>
              </div>

              <div class="form-group">
                <label>昵称</label>
                <input v-if="isEditing" v-model="profileForm.nickname" type="text" class="form-input" />
                <span v-else class="form-value">{{ userStore.userInfo?.username }}</span>
              </div>

              <div class="form-group">
                <label>邮箱</label>
                <span class="form-value">{{ userStore.userInfo?.email }}</span>
              </div>

              <div class="form-group">
                <label>个人简介</label>
                <textarea v-if="isEditing" v-model="profileForm.bio" rows="3" class="form-textarea"></textarea>
                <span v-else class="form-value">{{ userStore.userInfo?.bio || '暂无简介' }}</span>
              </div>

              <div class="form-group">
                <label>学习目标</label>
                <input v-if="isEditing" v-model="profileForm.learningGoal" type="text" class="form-input" />
                <span v-else class="form-value">{{ userStore.userInfo?.learningGoal || '暂无目标' }}</span>
              </div>

              <div v-if="isEditing" class="form-actions">
                <button class="btn-cancel" @click="handleCancel">取消</button>
                <button class="btn-save" @click="handleSave">保存</button>
              </div>
            </div>

            <!-- 学习统计 -->
            <div class="stats-section">
              <h2>学习统计</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <span class="stat-number">{{ userStore.learnedCount }}</span>
                  <span class="stat-label">已学习</span>
                </div>
                <div class="stat-card">
                  <span class="stat-number">{{ userStore.favoritesCount }}</span>
                  <span class="stat-label">收藏</span>
                </div>
                <div class="stat-card">
                  <span class="stat-number">{{ userStore.notesCount }}</span>
                  <span class="stat-label">笔记</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.profile-view {
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

/* 侧边栏 */
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
  word-break: break-word;
}

.user-email {
  font-size: 14px;
  color: #7f8c8d;
  word-break: break-all;
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

/* 主内容区 */
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
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 15px;
}

.content-header h1 {
  font-size: 24px;
  color: #2c3e50;
}

.btn-edit {
  padding: 8px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-edit:hover {
  background: #369870;
}

.profile-form {
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #42b883;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-value {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  word-break: break-word;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.preview-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar-input {
  flex: 1;
  min-width: 200px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn-cancel,
.btn-save {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  background: #42b883;
  border: none;
  color: white;
}

.btn-save:hover {
  background: #369870;
}

/* 统计区域 */
.stats-section h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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

/* 响应式样式 */
@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 240px 1fr;
    gap: 25px;
  }
  
  .user-card {
    padding: 25px 20px;
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
  }
  
  .nav-item {
    padding: 12px 20px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .profile-view {
    padding: 30px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .profile-sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .user-card {
    margin-bottom: 0;
    padding: 20px;
  }
  
  .user-avatar {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
  
  .user-name {
    font-size: 18px;
  }
  
  .profile-nav {
    display: flex;
    flex-direction: column;
  }
  
  .profile-content {
    padding: 25px;
  }
  
  .content-header {
    margin-bottom: 25px;
    padding-bottom: 15px;
  }
  
  .content-header h1 {
    font-size: 22px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .avatar-section {
    gap: 15px;
  }
  
  .preview-avatar {
    width: 60px;
    height: 60px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  
  .stat-card {
    padding: 20px 15px;
  }
  
  .stat-number {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .profile-sidebar {
    grid-template-columns: 1fr;
  }
  
  .profile-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .nav-item {
    flex: 1;
    min-width: calc(50% - 1px);
    text-align: center;
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 12px 10px;
  }
  
  .nav-item:hover,
  .nav-item.active {
    border-left-color: transparent;
    border-bottom-color: #42b883;
  }
}

@media (max-width: 480px) {
  .profile-view {
    padding: 20px 0;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .profile-content {
    padding: 20px;
  }
  
  .content-header h1 {
    font-size: 20px;
  }
  
  .btn-edit {
    padding: 6px 16px;
    font-size: 13px;
  }
  
  .form-group label {
    font-size: 13px;
  }
  
  .form-input,
  .form-textarea {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .form-value {
    font-size: 14px;
  }
  
  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .avatar-input {
    width: 100%;
    min-width: auto;
  }
  
  .form-actions {
    justify-content: stretch;
  }
  
  .btn-cancel,
  .btn-save {
    flex: 1;
    padding: 10px 20px;
    text-align: center;
  }
  
  .stats-section h2 {
    font-size: 18px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-card {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-number {
    font-size: 24px;
    margin-bottom: 0;
  }
  
  .stat-label {
    font-size: 14px;
  }
}
</style>
