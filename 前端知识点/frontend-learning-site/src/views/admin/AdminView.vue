<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const sidebarOpen = ref(false)

onMounted(() => {
  if (!userStore.isAdmin) {
    router.push('/')
  }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="admin-view">
    <!-- 移动端菜单按钮 -->
    <button class="mobile-menu-btn" @click="toggleSidebar">
      <span class="menu-icon">{{ sidebarOpen ? '✕' : '☰' }}</span>
    </button>
    
    <!-- 遮罩层 -->
    <div class="sidebar-overlay" :class="{ show: sidebarOpen }" @click="closeSidebar"></div>
    
    <aside class="admin-sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2>管理后台</h2>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }" @click="closeSidebar">
          📊 数据概览
        </router-link>
        <router-link to="/admin/users" class="nav-item" :class="{ active: route.path === '/admin/users' }" @click="closeSidebar">
          👥 用户管理
        </router-link>
        <router-link to="/admin/knowledge" class="nav-item" :class="{ active: route.path === '/admin/knowledge' }" @click="closeSidebar">
          📚 知识点管理
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="back-link">← 返回前台</router-link>
      </div>
    </aside>
    
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-view {
  display: flex;
  min-height: 100vh;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 70px;
  left: 10px;
  z-index: 1001;
  background: #2c3e50;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  align-items: center;
  justify-content: center;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

.admin-sidebar {
  width: 260px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 999;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 20px;
  margin: 0;
}

.admin-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: block;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: #42b883;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.back-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.back-link:hover {
  color: white;
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  padding: 30px;
  background: #f5f5f5;
  min-height: 100vh;
  width: calc(100% - 260px);
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 220px;
  }
  
  .admin-main {
    margin-left: 220px;
    width: calc(100% - 220px);
    padding: 25px;
  }
  
  .nav-item {
    padding: 12px 20px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .admin-sidebar {
    transform: translateX(-100%);
    width: 260px;
  }
  
  .admin-sidebar.open {
    transform: translateX(0);
  }
  
  .admin-main {
    margin-left: 0;
    width: 100%;
    padding: 70px 20px 20px;
  }
  
  .nav-item {
    padding: 15px 25px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .mobile-menu-btn {
    top: 65px;
    left: 8px;
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .admin-sidebar {
    width: 240px;
  }
  
  .sidebar-header {
    padding: 20px;
  }
  
  .sidebar-header h2 {
    font-size: 18px;
  }
  
  .nav-item {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .admin-main {
    padding: 60px 15px 15px;
  }
  
  .sidebar-footer {
    padding: 15px;
  }
}
</style>
