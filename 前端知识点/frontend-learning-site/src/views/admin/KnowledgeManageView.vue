<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import type { KnowledgePoint } from '@/types'

const router = useRouter()
const adminStore = useAdminStore()

const showAddModal = ref(false)
const editingKnowledge = ref<KnowledgePoint | null>(null)

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

const knowledgeForm = ref({
  title: '',
  category: '',
  subCategory: '',
  difficulty: 'beginner' as Difficulty,
  tags: '',
  content: '',
  compatibility: ''
})

onMounted(() => {
  adminStore.loadUsers()
})

const openAddModal = () => {
  editingKnowledge.value = null
  knowledgeForm.value = {
    title: '',
    category: '',
    subCategory: '',
    difficulty: 'beginner',
    tags: '',
    content: '',
    compatibility: ''
  }
  showAddModal.value = true
}

const openEditModal = (knowledge: KnowledgePoint) => {
  editingKnowledge.value = knowledge
  knowledgeForm.value = {
    title: knowledge.title,
    category: knowledge.category,
    subCategory: knowledge.subCategory,
    difficulty: knowledge.difficulty,
    tags: knowledge.tags.join(', '),
    content: knowledge.content,
    compatibility: knowledge.compatibility || ''
  }
  showAddModal.value = true
}

const saveKnowledge = async () => {
  const formData = {
    ...knowledgeForm.value,
    tags: knowledgeForm.value.tags.split(',').map(t => t.trim()).filter(Boolean)
  }
  
  if (editingKnowledge.value) {
    await adminStore.updateKnowledge(editingKnowledge.value.id, formData)
  } else {
    await adminStore.createKnowledge(formData)
  }
  showAddModal.value = false
}

const deleteKnowledge = async (knowledgeId: string) => {
  if (confirm('确定要删除该知识点吗？')) {
    await adminStore.deleteKnowledge(knowledgeId)
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingKnowledge.value = null
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
  <div class="knowledge-manage-view">
    <div class="page-header">
      <h1>知识点管理</h1>
      <button class="btn-add" @click="openAddModal">+ 添加知识点</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>分类</th>
            <th>难度</th>
            <th>标签</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in adminStore.allKnowledge" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.category }}</td>
            <td>
              <span :class="['difficulty-badge', getDifficultyClass(item.difficulty)]">
                {{ getDifficultyText(item.difficulty) }}
              </span>
            </td>
            <td>
              <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </td>
            <td>
              <button class="btn-edit" @click="openEditModal(item)">编辑</button>
              <button class="btn-delete" @click="deleteKnowledge(item.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加/编辑知识点弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingKnowledge ? '编辑知识点' : '添加知识点' }}</h2>
        <form @submit.prevent="saveKnowledge">
          <div class="form-group">
            <label>标题</label>
            <input v-model="knowledgeForm.title" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>分类</label>
              <select v-model="knowledgeForm.category" required>
                <option value="">请选择</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="vue">Vue</option>
                <option value="react">React</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            <div class="form-group">
              <label>难度</label>
              <select v-model="knowledgeForm.difficulty" required>
                <option value="beginner">入门</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>标签（用逗号分隔）</label>
            <input v-model="knowledgeForm.tags" type="text" placeholder="例如: Vue, 组件, 前端" />
          </div>
          <div class="form-group">
            <label>内容</label>
            <textarea v-model="knowledgeForm.content" rows="6" required></textarea>
          </div>
          <div class="form-group">
            <label>兼容性说明</label>
            <input v-model="knowledgeForm.compatibility" type="text" placeholder="例如: IE9+ 及所有现代浏览器" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">取消</button>
            <button type="submit" class="btn-save">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-manage-view {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  color: #2c3e50;
}

.btn-add {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #369870;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.data-table tr:hover {
  background: #f8f9fa;
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

.tag {
  display: inline-block;
  padding: 3px 8px;
  background: #f0f0f0;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.3s;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #ffcdd2;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #42b883;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 25px;
}

.btn-cancel,
.btn-save {
  padding: 10px 24px;
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

.btn-save {
  background: #42b883;
  border: none;
  color: white;
}

.btn-save:hover {
  background: #369870;
}
</style>
