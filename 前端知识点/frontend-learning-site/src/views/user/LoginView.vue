<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '请填写邮箱和密码'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  const success = await userStore.login({
    email: email.value,
    password: password.value
  })
  
  if (success) {
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } else {
    errorMessage.value = '邮箱或密码错误'
  }
  
  isLoading.value = false
}
</script>

<template>
  <MainLayout>
    <div class="login-view">
      <div class="login-container">
        <div class="login-box">
          <h1>用户登录</h1>
          <p class="subtitle">欢迎回来，请登录您的账号</p>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>邮箱</label>
              <input
                v-model="email"
                type="email"
                placeholder="请输入邮箱"
                required
              />
            </div>
            
            <div class="form-group">
              <label>密码</label>
              <input
                v-model="password"
                type="password"
                placeholder="请输入密码"
                required
              />
            </div>
            
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
            
            <button type="submit" class="btn-login" :disabled="isLoading">
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </form>
          
          <div class="login-footer">
            <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
            <p class="hint">测试账号：admin@example.com / 123456 或 user@example.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.login-view {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #f5f5f5;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-box h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #42b883;
}

.error-message {
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover:not(:disabled) {
  background: #369870;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
}

.login-footer p {
  color: #666;
  font-size: 14px;
}

.login-footer a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

.hint {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 12px;
}
</style>
