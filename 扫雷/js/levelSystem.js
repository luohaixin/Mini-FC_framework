/**
 * 关卡系统模块
 * 管理游戏难度递增和关卡配置
 */

const LevelSystem = {
    // 总关卡数
    TOTAL_LEVELS: 30,

    // 难度等级
    DIFFICULTIES: {
        EASY: { name: 'easy', label: '简单', color: '#5cb85c' },
        MEDIUM: { name: 'medium', label: '中等', color: '#f0ad4e' },
        HARD: { name: 'hard', label: '困难', color: '#d9534f' },
        EXPERT: { name: 'expert', label: '专家', color: '#9b59b6' }
    },

    /**
     * 获取关卡配置
     * @param {number} level - 关卡编号（1-30）
     * @returns {Object} 关卡配置
     */
    getLevelConfig(level) {
        // 确保关卡编号在有效范围内
        level = Math.max(1, Math.min(level, this.TOTAL_LEVELS));
        
        // 基础配置
        const baseConfig = this.calculateBaseConfig(level);
        
        // 根据关卡调整难度
        const adjustedConfig = this.adjustDifficulty(baseConfig, level);
        
        // 计算标准时间（用于星级评价）
        adjustedConfig.parTime = this.calculateParTime(adjustedConfig);
        
        return adjustedConfig;
    },

    /**
     * 计算基础配置
     * @param {number} level - 关卡编号
     * @returns {Object} 基础配置
     */
    calculateBaseConfig(level) {
        // 难度阶段划分
        if (level <= 5) {
            // 第1-5关：简单（9x9，地雷密度约12%）
            return {
                level,
                difficulty: this.DIFFICULTIES.EASY,
                rows: 9,
                cols: 9,
                mineCount: 10,
                description: '入门关卡，熟悉基本操作'
            };
        } else if (level <= 10) {
            // 第6-10关：简单到中等过渡（12x12，地雷密度约15%）
            return {
                level,
                difficulty: this.DIFFICULTIES.EASY,
                rows: 12,
                cols: 12,
                mineCount: 22,
                description: '进阶练习，提升推理能力'
            };
        } else if (level <= 15) {
            // 第11-15关：中等（16x16，地雷密度约16%）
            return {
                level,
                difficulty: this.DIFFICULTIES.MEDIUM,
                rows: 16,
                cols: 16,
                mineCount: 40,
                description: '标准难度，挑战逻辑思维'
            };
        } else if (level <= 20) {
            // 第16-20关：中等到困难过渡（18x18，地雷密度约18%）
            return {
                level,
                difficulty: this.DIFFICULTIES.MEDIUM,
                rows: 18,
                cols: 18,
                mineCount: 58,
                description: '高难度挑战，需要更多技巧'
            };
        } else if (level <= 25) {
            // 第21-25关：困难（20x20，地雷密度约20%）
            return {
                level,
                difficulty: this.DIFFICULTIES.HARD,
                rows: 20,
                cols: 20,
                mineCount: 80,
                description: '专家级别，极限挑战'
            };
        } else {
            // 第26-30关：专家（24x24，地雷密度约22%）
            return {
                level,
                difficulty: this.DIFFICULTIES.EXPERT,
                rows: 24,
                cols: 24,
                mineCount: 127,
                description: '大师级别，只有真正的扫雷高手才能通关'
            };
        }
    },

    /**
     * 根据关卡微调难度
     * @param {Object} config - 基础配置
     * @param {number} level - 关卡编号
     * @returns {Object} 调整后的配置
     */
    adjustDifficulty(config, level) {
        const adjusted = { ...config };
        
        // 在同一难度等级内逐步增加挑战
        const phase = (level - 1) % 5; // 0-4，表示当前阶段的进度
        
        // 根据阶段微调地雷数量
        if (phase >= 3) {
            // 阶段后期增加少量地雷
            adjusted.mineCount = Math.min(
                adjusted.mineCount + Math.floor(phase / 2),
                Math.floor(adjusted.rows * adjusted.cols * 0.25) // 最高25%地雷密度
            );
        }
        
        // 计算实际地雷密度
        adjusted.density = (adjusted.mineCount / (adjusted.rows * adjusted.cols) * 100).toFixed(1);
        
        return adjusted;
    },

    /**
     * 计算标准时间（用于星级评价）
     * @param {Object} config - 关卡配置
     * @returns {number} 标准时间（秒）
     */
    calculateParTime(config) {
        // 基于棋盘大小和地雷数量计算标准时间
        const baseTime = config.rows * config.cols * 0.5; // 基础时间
        const mineTime = config.mineCount * 2; // 地雷额外时间
        const difficultyMultiplier = config.difficulty.name === 'easy' ? 1 :
                                      config.difficulty.name === 'medium' ? 1.2 :
                                      config.difficulty.name === 'hard' ? 1.5 : 2;
        
        return Math.floor((baseTime + mineTime) * difficultyMultiplier);
    },

    /**
     * 获取所有关卡配置
     * @returns {Array} 所有关卡配置
     */
    getAllLevelConfigs() {
        const configs = [];
        for (let i = 1; i <= this.TOTAL_LEVELS; i++) {
            configs.push(this.getLevelConfig(i));
        }
        return configs;
    },

    /**
     * 获取关卡难度名称
     * @param {number} level - 关卡编号
     * @returns {string} 难度名称
     */
    getDifficultyLabel(level) {
        const config = this.getLevelConfig(level);
        return config.difficulty.label;
    },

    /**
     * 获取关卡难度徽章类名
     * @param {number} level - 关卡编号
     * @returns {string} 徽章类名
     */
    getDifficultyBadgeClass(level) {
        const config = this.getLevelConfig(level);
        return config.difficulty.name;
    },

    /**
     * 计算星级评价
     * @param {number} level - 关卡编号
     * @param {number} time - 用时（秒）
     * @returns {number} 星级（1-3）
     */
    calculateStars(level, time) {
        const config = this.getLevelConfig(level);
        return Utils.calculateStars(time, config.parTime);
    },

    /**
     * 获取星级评价描述
     * @param {number} stars - 星级
     * @returns {string} 描述
     */
    getStarsDescription(stars) {
        switch (stars) {
            case 3: return '完美！';
            case 2: return '优秀！';
            case 1: return '通关！';
            default: return '未完成';
        }
    },

    /**
     * 检查关卡是否已解锁
     * @param {number} level - 关卡编号
     * @param {number} maxUnlockedLevel - 最大解锁关卡
     * @returns {boolean} 是否已解锁
     */
    isLevelUnlocked(level, maxUnlockedLevel) {
        return level <= maxUnlockedLevel;
    },

    /**
     * 检查关卡是否已完成
     * @param {number} level - 关卡编号
     * @param {Object} completedLevels - 已完成关卡记录
     * @returns {boolean} 是否已完成
     */
    isLevelCompleted(level, completedLevels) {
        return !!completedLevels[level];
    },

    /**
     * 获取下一关
     * @param {number} currentLevel - 当前关卡
     * @returns {number|null} 下一关编号，如果没有则返回null
     */
    getNextLevel(currentLevel) {
        if (currentLevel < this.TOTAL_LEVELS) {
            return currentLevel + 1;
        }
        return null;
    },

    /**
     * 获取上一关
     * @param {number} currentLevel - 当前关卡
     * @returns {number|null} 上一关编号，如果没有则返回null
     */
    getPreviousLevel(currentLevel) {
        if (currentLevel > 1) {
            return currentLevel - 1;
        }
        return null;
    },

    /**
     * 获取关卡进度信息
     * @param {number} currentLevel - 当前关卡
     * @param {Object} progress - 游戏进度
     * @returns {Object} 进度信息
     */
    getLevelProgress(currentLevel, progress) {
        const config = this.getLevelConfig(currentLevel);
        const completedData = progress.completedLevels[currentLevel];
        
        return {
            level: currentLevel,
            totalLevels: this.TOTAL_LEVELS,
            difficulty: config.difficulty,
            isCompleted: !!completedData,
            bestTime: completedData ? completedData.bestTime : null,
            stars: completedData ? completedData.stars : 0,
            attempts: completedData ? completedData.attempts : 0,
            percentComplete: (currentLevel / this.TOTAL_LEVELS * 100).toFixed(1)
        };
    },

    /**
     * 获取总体进度统计
     * @param {Object} progress - 游戏进度
     * @returns {Object} 统计信息
     */
    getOverallProgress(progress) {
        const completedCount = Object.keys(progress.completedLevels).length;
        const totalStars = Object.values(progress.completedLevels).reduce(
            (sum, level) => sum + (level.stars || 0), 0
        );
        const maxStars = this.TOTAL_LEVELS * 3;
        
        return {
            completedLevels: completedCount,
            totalLevels: this.TOTAL_LEVELS,
            currentLevel: progress.currentLevel,
            maxUnlockedLevel: progress.maxUnlockedLevel,
            totalStars,
            maxStars,
            completionRate: (completedCount / this.TOTAL_LEVELS * 100).toFixed(1),
            starRate: (totalStars / maxStars * 100).toFixed(1)
        };
    },

    /**
     * 获取关卡提示
     * @param {number} level - 关卡编号
     * @returns {string} 提示信息
     */
    getLevelHint(level) {
        const hints = [
            // 简单关卡提示
            "从角落开始，逐步扩展安全区域",
            "观察数字，标记明显的地雷",
            "利用1-1和1-2等经典模式",
            "当数字周围已标记足够地雷时，其他格子是安全的",
            "空白区域会自动展开，善加利用",
            
            // 中等关卡提示
            "学会识别常见的地雷布局模式",
            "使用假设法排除不可能的情况",
            "注意边缘格子的特殊性质",
            "标记可疑位置，避免误触",
            "合理分配注意力，不要只关注一处",
            
            // 困难关卡提示
            "高级技巧：1-1-1 模式分析",
            "学会计算概率，选择最安全的格子",
            "双点击技巧可以快速展开安全区域",
            "保持冷静，复杂局面需要耐心分析",
            "有时候需要冒险，选择概率最低的格子",
            
            // 专家关卡提示
            "大师级别：需要综合运用所有技巧",
            "极限挑战：每一个决策都至关重要",
            "完美通关：追求速度和准确率的平衡",
            "终极考验：只有真正的扫雷大师才能通关",
            "传奇挑战：创造属于你的扫雷传奇"
        ];
        
        const index = Math.min(level - 1, hints.length - 1);
        return hints[index];
    },

    /**
     * 获取关卡奖励描述
     * @param {number} level - 关卡编号
     * @returns {string} 奖励描述
     */
    getLevelReward(level) {
        if (level === this.TOTAL_LEVELS) {
            return '通关所有关卡，成为扫雷大师！';
        }
        
        if (level % 5 === 0) {
            const nextDifficulty = this.getLevelConfig(level + 1).difficulty.label;
            return `解锁${nextDifficulty}难度关卡！`;
        }
        
        return '继续挑战下一关！';
    },

    /**
     * 验证游戏配置是否有效
     * @param {Object} config - 游戏配置
     * @returns {boolean} 是否有效
     */
    validateConfig(config) {
        if (!config || typeof config !== 'object') return false;
        
        const { rows, cols, mineCount } = config;
        
        // 检查基本参数
        if (!Number.isInteger(rows) || rows < 5 || rows > 50) return false;
        if (!Number.isInteger(cols) || cols < 5 || cols > 50) return false;
        if (!Number.isInteger(mineCount) || mineCount < 1) return false;
        
        // 检查地雷数量是否合理
        const totalCells = rows * cols;
        if (mineCount >= totalCells - 9) return false; // 至少留出3x3的安全区域
        
        // 检查地雷密度
        const density = mineCount / totalCells;
        if (density > 0.35) return false; // 最高35%地雷密度
        
        return true;
    },

    /**
     * 创建自定义关卡配置
     * @param {number} rows - 行数
     * @param {number} cols - 列数
     * @param {number} mineCount - 地雷数量
     * @returns {Object|null} 配置对象，无效则返回null
     */
    createCustomConfig(rows, cols, mineCount) {
        const config = {
            level: 0, // 自定义关卡
            difficulty: { name: 'custom', label: '自定义', color: '#888' },
            rows,
            cols,
            mineCount,
            description: '自定义游戏'
        };
        
        config.parTime = this.calculateParTime(config);
        
        return this.validateConfig(config) ? config : null;
    },

    /**
     * 获取推荐配置
     * @param {string} difficulty - 难度名称
     * @returns {Object} 推荐配置
     */
    getRecommendedConfig(difficulty) {
        const configs = {
            beginner: { rows: 9, cols: 9, mineCount: 10 },
            intermediate: { rows: 16, cols: 16, mineCount: 40 },
            expert: { rows: 16, cols: 30, mineCount: 99 }
        };
        
        return configs[difficulty] || configs.beginner;
    },

    /**
     * 导出关卡配置
     * @returns {string} JSON字符串
     */
    exportConfigs() {
        return Utils.safeJSONStringify(this.getAllLevelConfigs());
    },

    /**
     * 获取成就信息
     * @param {Object} progress - 游戏进度
     * @returns {Array} 成就列表
     */
    getAchievements(progress) {
        const achievements = [];
        const overall = this.getOverallProgress(progress);
        
        // 首次通关
        if (overall.completedLevels >= 1) {
            achievements.push({
                id: 'first_win',
                name: '初出茅庐',
                description: '完成第一关',
                icon: '🎯',
                unlocked: true
            });
        }
        
        // 简单难度通关
        if (progress.maxUnlockedLevel > 5) {
            achievements.push({
                id: 'easy_master',
                name: '简单大师',
                description: '完成所有简单难度关卡',
                icon: '🥉',
                unlocked: true
            });
        }
        
        // 中等难度通关
        if (progress.maxUnlockedLevel > 10) {
            achievements.push({
                id: 'medium_master',
                name: '进阶高手',
                description: '完成所有中等难度关卡',
                icon: '🥈',
                unlocked: true
            });
        }
        
        // 困难难度通关
        if (progress.maxUnlockedLevel > 20) {
            achievements.push({
                id: 'hard_master',
                name: '困难专家',
                description: '完成所有困难难度关卡',
                icon: '🥇',
                unlocked: true
            });
        }
        
        // 通关所有关卡
        if (overall.completedLevels >= this.TOTAL_LEVELS) {
            achievements.push({
                id: 'grand_master',
                name: '扫雷大师',
                description: '完成所有30个关卡',
                icon: '👑',
                unlocked: true
            });
        }
        
        // 完美通关（所有关卡3星）
        if (overall.totalStars >= this.TOTAL_LEVELS * 3) {
            achievements.push({
                id: 'perfectionist',
                name: '完美主义者',
                description: '所有关卡获得3星评价',
                icon: '⭐',
                unlocked: true
            });
        }
        
        return achievements;
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelSystem;
}
