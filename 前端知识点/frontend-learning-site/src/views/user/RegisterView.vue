<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = '请填写所有必填项'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = '密码长度至少为6位'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  const success = await userStore.register({
    username: username.value,
    email: email.value,
    password: password.value
  })
  
  if (success) {
    router.push('/')
  } else {
    errorMessage.value = '注册失败，请重试'
  }
  
  isLoading.value = false
}
</script>

<template>
  <MainLayout>
    <div class="register-view">
      <div class="register-container">
        <div class="register-box">
          <h1>用户注册</h1>
          <p class="subtitle">创建账号，开启学习之旅</p>
          
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>用户名</label>
              <input
                v-model="username"
                type="text"
                placeholder="请输入用户名"
                required
              />
            </div>
            
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
                placeholder="请输入密码（至少6位）"
                required
              />
            </div>
            
            <div class="form-group">
              <label>确认密码</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
              />
            </div>
            
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
            
            <button type="submit" class="btn-register" :disabled="isLoading">
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </form>
          
          <div class="register-footer">
            <p>已有账号？<router-link to="/login">立即登录</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.register-view {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #f5f5f5;
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.register-box h1 {
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

.btn-register {
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

.btn-register:hover:not(:disabled) {
  background: #369870;
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 25px;
  text-align: center;
}

.register-footer p {
  color: #666;
  font-size: 14px;
}

.register-footer a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
