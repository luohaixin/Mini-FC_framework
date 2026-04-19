<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-section about">
        <h4>关于我们</h4>
        <p>前端学习网站致力于为前端开发者提供系统、全面的学习资源，帮助不同层次的学习者高效掌握前端技术。</p>
      </div>
      
      <div class="footer-section links">
        <h4>快速链接</h4>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/knowledge">知识点</router-link></li>
          <li><router-link to="/category/basic">基础学习</router-link></li>
          <li><router-link to="/category/framework">框架学习</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section help">
        <h4>帮助中心</h4>
        <ul>
          <li><a href="#">使用指南</a></li>
          <li><a href="#">常见问题</a></li>
          <li><a href="#">反馈建议</a></li>
          <li><a href="#">联系我们</a></li>
        </ul>
      </div>
      
      <div class="footer-section social">
        <h4>关注我们</h4>
        <div class="social-links">
          <a href="#" class="social-link">微信</a>
          <a href="#" class="social-link">微博</a>
          <a href="#" class="social-link">GitHub</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} 前端学习网站. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 50px 0 20px;
  margin-top: 60px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
}

.footer-section h4 {
  color: #42b883;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.footer-section.about p {
  font-size: 14px;
  line-height: 1.8;
  color: #bdc3c7;
  max-width: 300px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #42b883;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.social-link {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
}

.social-link:hover {
  background: #42b883;
  color: #fff;
}

.footer-bottom {
  max-width: 1400px;
  margin: 40px auto 0;
  padding: 20px 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  color: #95a5a6;
  font-size: 14px;
  margin: 0;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .footer-section.about {
    grid-column: span 2;
  }
  
  .footer-section.about p {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .app-footer {
    padding: 40px 0 20px;
    margin-top: 40px;
  }
  
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    padding: 0 16px;
  }
  
  .footer-section.about {
    grid-column: span 2;
  }
  
  .footer-section h4 {
    font-size: 15px;
    margin-bottom: 15px;
  }
  
  .footer-section.about p {
    font-size: 13px;
  }
  
  .footer-section a {
    font-size: 13px;
  }
  
  .social-link {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .footer-bottom {
    margin-top: 30px;
    padding: 15px 16px 0;
  }
  
  .footer-bottom p {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 30px 0 15px;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 12px;
  }
  
  .footer-section.about {
    grid-column: span 1;
  }
  
  .footer-section h4 {
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .footer-section li {
    margin-bottom: 8px;
  }
  
  .social-links {
    gap: 8px;
  }
  
  .footer-bottom {
    margin-top: 25px;
  }
}
</style>
