<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding-top: 60px;
  min-height: calc(100vh - 60px);
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding-top: 60px;
    min-height: calc(100vh - 60px);
  }
}
</style>
