/**
 * 本地存储管理模块
 * 负责游戏数据的持久化存储
 */

const Storage = {
    // 存储键名
    KEYS: {
        GAME_PROGRESS: 'minesweeper_progress',
        GAME_SETTINGS: 'minesweeper_settings',
        GAME_STATS: 'minesweeper_stats',
        CURRENT_GAME: 'minesweeper_current_game',
        LEVEL_DATA: 'minesweeper_level_data'
    },

    /**
     * 获取存储项
     * @param {string} key - 存储键名
     * @param {*} defaultValue - 默认值
     * @returns {*} 存储的值
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return Utils.safeJSONParse(item, defaultValue);
        } catch (e) {
            console.warn('Storage get error:', e);
            return defaultValue;
        }
    },

    /**
     * 设置存储项
     * @param {string} key - 存储键名
     * @param {*} value - 要存储的值
     * @returns {boolean} 是否成功
     */
    set(key, value) {
        try {
            localStorage.setItem(key, Utils.safeJSONStringify(value));
            return true;
        } catch (e) {
            console.warn('Storage set error:', e);
            // 存储空间不足时尝试清理旧数据
            if (e.name === 'QuotaExceededError') {
                this.cleanup();
                try {
                    localStorage.setItem(key, Utils.safeJSONStringify(value));
                    return true;
                } catch (e2) {
                    console.error('Storage failed after cleanup:', e2);
                }
            }
            return false;
        }
    },

    /**
     * 移除存储项
     * @param {string} key - 存储键名
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Storage remove error:', e);
        }
    },

    /**
     * 清空所有存储
     */
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('Storage clear error:', e);
        }
    },

    /**
     * 清理旧数据以释放空间
     */
    cleanup() {
        // 保留进度和设置，删除当前游戏和统计数据的历史记录
        this.remove(this.KEYS.CURRENT_GAME);
        
        // 清理统计数据中的旧记录
        const stats = this.getStats();
        if (stats && stats.history) {
            stats.history = stats.history.slice(-50); // 只保留最近50条记录
            this.set(this.KEYS.GAME_STATS, stats);
        }
    },

    /**
     * 获取游戏进度
     * @returns {Object} 游戏进度数据
     */
    getProgress() {
        return this.get(this.KEYS.GAME_PROGRESS, {
            currentLevel: 1,
            maxUnlockedLevel: 1,
            completedLevels: {},
            totalPlayTime: 0,
            gamesPlayed: 0,
            gamesWon: 0
        });
    },

    /**
     * 保存游戏进度
     * @param {Object} progress - 游戏进度数据
     * @returns {boolean} 是否成功
     */
    saveProgress(progress) {
        return this.set(this.KEYS.GAME_PROGRESS, progress);
    },

    /**
     * 获取游戏设置
     * @returns {Object} 游戏设置
     */
    getSettings() {
        return this.get(this.KEYS.GAME_SETTINGS, {
            sound: true,
            music: false,
            animations: true,
            longPress: false,
            vibration: true
        });
    },

    /**
     * 保存游戏设置
     * @param {Object} settings - 游戏设置
     * @returns {boolean} 是否成功
     */
    saveSettings(settings) {
        return this.set(this.KEYS.GAME_SETTINGS, settings);
    },

    /**
     * 获取游戏统计
     * @returns {Object} 游戏统计数据
     */
    getStats() {
        return this.get(this.KEYS.GAME_STATS, {
            totalGames: 0,
            totalWins: 0,
            totalLosses: 0,
            totalTime: 0,
            bestTimes: {},
            history: []
        });
    },

    /**
     * 保存游戏统计
     * @param {Object} stats - 游戏统计数据
     * @returns {boolean} 是否成功
     */
    saveStats(stats) {
        return this.set(this.KEYS.GAME_STATS, stats);
    },

    /**
     * 更新游戏统计
     * @param {Object} gameResult - 游戏结果
     */
    updateStats(gameResult) {
        const stats = this.getStats();
        
        stats.totalGames++;
        
        if (gameResult.won) {
            stats.totalWins++;
            
            // 更新最佳时间
            const level = gameResult.level;
            if (!stats.bestTimes[level] || gameResult.time < stats.bestTimes[level]) {
                stats.bestTimes[level] = gameResult.time;
            }
        } else {
            stats.totalLosses++;
        }
        
        stats.totalTime += gameResult.time;
        
        // 添加历史记录
        stats.history.push({
            level: gameResult.level,
            won: gameResult.won,
            time: gameResult.time,
            date: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (stats.history.length > 100) {
            stats.history = stats.history.slice(-100);
        }
        
        this.saveStats(stats);
    },

    /**
     * 获取当前游戏状态
     * @returns {Object|null} 当前游戏状态
     */
    getCurrentGame() {
        return this.get(this.KEYS.CURRENT_GAME, null);
    },

    /**
     * 保存当前游戏状态
     * @param {Object} gameState - 游戏状态
     * @returns {boolean} 是否成功
     */
    saveCurrentGame(gameState) {
        return this.set(this.KEYS.CURRENT_GAME, gameState);
    },

    /**
     * 清除当前游戏状态
     */
    clearCurrentGame() {
        this.remove(this.KEYS.CURRENT_GAME);
    },

    /**
     * 获取关卡数据
     * @returns {Object} 关卡数据
     */
    getLevelData() {
        return this.get(this.KEYS.LEVEL_DATA, {});
    },

    /**
     * 保存关卡数据
     * @param {number} level - 关卡编号
     * @param {Object} data - 关卡数据
     * @returns {boolean} 是否成功
     */
    saveLevelData(level, data) {
        const levelData = this.getLevelData();
        levelData[level] = {
            ...data,
            updatedAt: new Date().toISOString()
        };
        return this.set(this.KEYS.LEVEL_DATA, levelData);
    },

    /**
     * 获取特定关卡的数据
     * @param {number} level - 关卡编号
     * @returns {Object|null} 关卡数据
     */
    getLevelDataById(level) {
        const levelData = this.getLevelData();
        return levelData[level] || null;
    },

    /**
     * 完成关卡
     * @param {number} level - 关卡编号
     * @param {Object} result - 完成结果
     * @returns {boolean} 是否成功
     */
    completeLevel(level, result) {
        const progress = this.getProgress();
        
        // 记录完成信息
        if (!progress.completedLevels[level]) {
            progress.completedLevels[level] = {
                completedAt: new Date().toISOString(),
                bestTime: result.time,
                stars: result.stars,
                attempts: 1
            };
        } else {
            const levelProgress = progress.completedLevels[level];
            levelProgress.attempts++;
            
            // 更新最佳时间
            if (result.time < levelProgress.bestTime) {
                levelProgress.bestTime = result.time;
            }
            
            // 更新星级（取最高）
            if (result.stars > levelProgress.stars) {
                levelProgress.stars = result.stars;
            }
        }
        
        // 解锁下一关
        const nextLevel = level + 1;
        if (nextLevel > progress.maxUnlockedLevel) {
            progress.maxUnlockedLevel = nextLevel;
        }
        
        // 更新当前关卡
        progress.currentLevel = nextLevel;
        
        // 更新游戏统计
        progress.gamesPlayed++;
        progress.gamesWon++;
        progress.totalPlayTime += result.time;
        
        return this.saveProgress(progress);
    },

    /**
     * 重置所有进度
     * @returns {boolean} 是否成功
     */
    resetAllProgress() {
        this.remove(this.KEYS.GAME_PROGRESS);
        this.remove(this.KEYS.GAME_STATS);
        this.remove(this.KEYS.CURRENT_GAME);
        this.remove(this.KEYS.LEVEL_DATA);
        return true;
    },

    /**
     * 导出所有数据
     * @returns {string} JSON字符串
     */
    exportData() {
        const data = {
            progress: this.getProgress(),
            settings: this.getSettings(),
            stats: this.getStats(),
            levelData: this.getLevelData(),
            exportedAt: new Date().toISOString()
        };
        return Utils.safeJSONStringify(data);
    },

    /**
     * 导入数据
     * @param {string} jsonData - JSON字符串
     * @returns {boolean} 是否成功
     */
    importData(jsonData) {
        try {
            const data = Utils.safeJSONParse(jsonData);
            if (!data) return false;
            
            if (data.progress) this.saveProgress(data.progress);
            if (data.settings) this.saveSettings(data.settings);
            if (data.stats) this.saveStats(data.stats);
            if (data.levelData) this.set(this.KEYS.LEVEL_DATA, data.levelData);
            
            return true;
        } catch (e) {
            console.error('Import data error:', e);
            return false;
        }
    },

    /**
     * 检查存储是否可用
     * @returns {boolean} 存储是否可用
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * 获取存储使用情况
     * @returns {Object} 存储使用情况
     */
    getUsage() {
        let total = 0;
        const items = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = (key.length + value.length) * 2; // UTF-16编码
            total += size;
            items[key] = size;
        }
        
        return {
            total,
            totalKB: (total / 1024).toFixed(2),
            items,
            itemCount: localStorage.length
        };
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
