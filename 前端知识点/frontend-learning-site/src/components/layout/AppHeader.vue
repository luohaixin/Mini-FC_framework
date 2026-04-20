<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSearchStore } from '@/stores/search'

const router = useRouter()
const userStore = useUserStore()
const searchStore = useSearchStore()

const searchKeyword = ref('')
const showSuggestions = ref(false)
const suggestions = ref<string[]>([])
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchKeyword.value }
    })
    showSuggestions.value = false
    mobileMenuOpen.value = false
  }
}

const handleInput = () => {
  if (searchKeyword.value.trim()) {
    suggestions.value = searchStore.getSuggestions(searchKeyword.value)
    showSuggestions.value = suggestions.value.length > 0
  } else {
    showSuggestions.value = false
  }
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const selectSuggestion = (suggestion: string) => {
  searchKeyword.value = suggestion
  handleSearch()
}

const handleLogout = () => {
  userStore.logout()
  router.push({ name: 'home' })
  mobileMenuOpen.value = false
  userMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  userStore.initFromStorage()
  searchStore.loadHistory()
})
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo" @click="router.push({ name: 'home' })">
        <span class="logo-icon">📚</span>
        <span class="logo-text">前端学习</span>
      </div>

      <!-- 桌面端导航 -->
      <nav class="main-nav hide-mobile">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/knowledge" class="nav-link">知识点</router-link>
        <router-link to="/category/basic" class="nav-link">基础</router-link>
        <router-link to="/category/framework" class="nav-link">框架</router-link>
      </nav>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索知识点..."
          @keyup.enter="handleSearch"
          @input="handleInput"
          @blur="handleBlur"
        />
        <button class="search-btn" @click="handleSearch">🔍</button>
        <div v-if="showSuggestions" class="suggestions">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </div>
        </div>
      </div>

      <!-- 桌面端用户操作 -->
      <div class="user-actions hide-mobile">
        <template v-if="userStore.isLoggedIn">
          <div class="user-menu" @mouseenter="userMenuOpen = true" @mouseleave="userMenuOpen = false">
            <img
              :src="userStore.userInfo?.avatar || '/default-avatar.png'"
              alt="avatar"
              class="avatar"
              @click="router.push({ name: 'profile' })"
            />
            <div class="dropdown" :class="{ show: userMenuOpen }">
              <router-link to="/profile">个人中心</router-link>
              <router-link to="/favorites">我的收藏</router-link>
              <router-link to="/learning">学习记录</router-link>
              <router-link v-if="userStore.isAdmin" to="/admin">管理后台</router-link>
              <a href="#" @click.prevent="handleLogout">退出登录</a>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-login">登录</router-link>
          <router-link to="/register" class="btn-register">注册</router-link>
        </template>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn show-mobile" @click="toggleMobileMenu">
        <span class="menu-icon">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <nav class="mobile-nav">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
        <router-link to="/knowledge" class="mobile-nav-link" @click="closeMobileMenu">知识点</router-link>
        <router-link to="/category/basic" class="mobile-nav-link" @click="closeMobileMenu">基础</router-link>
        <router-link to="/category/framework" class="mobile-nav-link" @click="closeMobileMenu">框架</router-link>
      </nav>

      <div class="mobile-user-actions">
        <template v-if="userStore.isLoggedIn">
          <div class="mobile-user-info">
            <img
              :src="userStore.userInfo?.avatar || '/default-avatar.png'"
              alt="avatar"
              class="mobile-avatar"
            />
            <span class="mobile-username">{{ userStore.userInfo?.username }}</span>
          </div>
          <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">个人中心</router-link>
          <router-link to="/favorites" class="mobile-nav-link" @click="closeMobileMenu">我的收藏</router-link>
          <router-link to="/learning" class="mobile-nav-link" @click="closeMobileMenu">学习记录</router-link>
          <router-link v-if="userStore.isAdmin" to="/admin" class="mobile-nav-link" @click="closeMobileMenu">管理后台</router-link>
          <a href="#" class="mobile-nav-link logout" @click.prevent="handleLogout">退出登录</a>
        </template>
        <template v-else>
          <router-link to="/login" class="mobile-nav-link" @click="closeMobileMenu">登录</router-link>
          <router-link to="/register" class="mobile-nav-link" @click="closeMobileMenu">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: #42b883;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  white-space: nowrap;
}

.main-nav {
  display: flex;
  gap: 25px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #42b883;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-box input {
  width: 100%;
  height: 38px;
  padding: 0 40px 0 15px;
  border: 1px solid #ddd;
  border-radius: 19px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: #42b883;
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.btn-login,
.btn-register {
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-login {
  color: #42b883;
  border: 1px solid #42b883;
}

.btn-login:hover {
  background: #42b883;
  color: #fff;
}

.btn-register {
  background: #42b883;
  color: #fff;
}

.btn-register:hover {
  background: #369870;
}

.user-menu {
  position: relative;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
  min-width: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s;
}

.dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown a {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: background 0.2s;
}

.dropdown a:hover {
  background: #f5f5f5;
  color: #42b883;
}

.dropdown a:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown a:last-child {
  border-radius: 0 0 8px 8px;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: #333;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 999;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-nav {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.mobile-nav-link {
  display: block;
  padding: 15px 0;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.3s;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #42b883;
}

.mobile-nav-link.logout {
  color: #e74c3c;
}

.mobile-user-actions {
  padding: 20px;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.mobile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.mobile-username {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .header-container {
    gap: 20px;
  }
  
  .main-nav {
    gap: 18px;
  }
  
  .search-box {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    gap: 15px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .search-box {
    max-width: 200px;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .hide-mobile {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
    gap: 10px;
  }
  
  .logo-icon {
    font-size: 24px;
  }
  
  .logo-text {
    font-size: 16px;
  }
  
  .search-box {
    max-width: 150px;
  }
  
  .search-box input {
    height: 34px;
    font-size: 13px;
    padding: 0 32px 0 12px;
  }
  
  .search-btn {
    font-size: 14px;
    padding: 4px 8px;
  }
}

@media (max-width: 360px) {
  .search-box {
    max-width: 120px;
  }
}
</style>
