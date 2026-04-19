/**
 * 游戏主入口
 * 初始化所有模块并启动游戏
 */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化音频管理器
    AudioManager.init();
    
    // 初始化 UI 管理器
    UIManager.init();
    
    // 检查并恢复之前的游戏
    checkAndRestoreGame();
    
    // 注册 Service Worker（如果支持）
    registerServiceWorker();
    
    console.log('🎮 扫雷大冒险已启动！');
});

/**
 * 检查并恢复之前的游戏
 */
function checkAndRestoreGame() {
    const savedGame = Storage.getCurrentGame();
    if (savedGame) {
        // 有保存的游戏，显示继续游戏按钮
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.classList.remove('hidden');
        }
        
        console.log('💾 发现保存的游戏进度');
    }
}

/**
 * 注册 Service Worker
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✅ Service Worker 注册成功:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker 注册失败:', error);
            });
    }
}

/**
 * 全局错误处理
 */
window.addEventListener('error', (e) => {
    console.error('🐛 全局错误:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🐛 未处理的 Promise 拒绝:', e.reason);
});

/**
 * 防止页面意外关闭时丢失进度
 */
window.addEventListener('beforeunload', (e) => {
    // 如果有正在进行的游戏，尝试保存
    if (UIManager.currentGame && UIManager.currentGame.gameState === 'playing') {
        UIManager.saveCurrentGame();
    }
});

/**
 * 处理游戏可见性变化
 * 当用户切换标签页时自动暂停游戏
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && UIManager.currentGame) {
        // 页面隐藏时保存游戏
        UIManager.saveCurrentGame();
    }
});
