<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const editingNoteId = ref<string | null>(null)
const editContent = ref('')

const navigateToKnowledge = (id: string) => {
  router.push({ name: 'knowledge-detail', params: { id } })
}

const startEdit = (note: { id: string; content: string }) => {
  editingNoteId.value = note.id
  editContent.value = note.content
}

const saveEdit = () => {
  if (editingNoteId.value && editContent.value.trim()) {
    userStore.updateNote(editingNoteId.value, editContent.value)
    editingNoteId.value = null
    editContent.value = ''
  }
}

const cancelEdit = () => {
  editingNoteId.value = null
  editContent.value = ''
}

const deleteNote = (noteId: string) => {
  if (confirm('确定要删除这条笔记吗？')) {
    userStore.deleteNote(noteId)
  }
}
</script>

<template>
  <MainLayout>
    <div class="notes-view">
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
              <router-link to="/learning" class="nav-item">学习记录</router-link>
              <router-link to="/notes" class="nav-item active">我的笔记</router-link>
            </nav>
          </aside>

          <main class="profile-content">
            <div class="content-header">
              <h1>我的笔记</h1>
              <span class="count">共 {{ userStore.notes.length }} 条</span>
            </div>

            <div v-if="userStore.notes.length > 0" class="notes-list">
              <div
                v-for="note in userStore.notes"
                :key="note.id"
                class="note-card"
              >
                <div class="note-header">
                  <h3 class="note-title" @click="navigateToKnowledge(note.knowledgeId)">
                    {{ note.knowledgeTitle }}
                  </h3>
                  <span class="note-date">{{ note.updatedAt }}</span>
                </div>

                <div v-if="editingNoteId === note.id" class="note-edit">
                  <textarea v-model="editContent" rows="4"></textarea>
                  <div class="edit-actions">
                    <button class="btn-cancel" @click="cancelEdit">取消</button>
                    <button class="btn-save" @click="saveEdit">保存</button>
                  </div>
                </div>

                <p v-else class="note-content">{{ note.content }}</p>

                <div v-if="editingNoteId !== note.id" class="note-actions">
                  <button class="btn-action" @click="startEdit(note)">编辑</button>
                  <button class="btn-action btn-delete" @click="deleteNote(note.id)">删除</button>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">📝</div>
              <p>还没有笔记</p>
              <p class="hint">在知识点详情页可以添加笔记</p>
              <router-link to="/knowledge" class="btn-browse">去浏览知识点</router-link>
            </div>
          </main>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.notes-view {
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

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.note-title {
  font-size: 16px;
  color: #42b883;
  cursor: pointer;
  margin: 0;
}

.note-title:hover {
  text-decoration: underline;
}

.note-date {
  font-size: 12px;
  color: #95a5a6;
}

.note-content {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.note-edit textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  resize: vertical;
  margin-bottom: 10px;
}

.edit-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.btn-cancel {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.btn-save {
  background: #42b883;
  border: none;
  color: white;
}

.note-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #f0f0f0;
}

.btn-delete:hover {
  background: #fee;
  border-color: #fcc;
  color: #c33;
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
  margin-bottom: 10px;
}

.hint {
  font-size: 14px;
  color: #95a5a6;
}

.btn-browse {
  display: inline-block;
  margin-top: 20px;
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
