/**
 * UI 管理模块
 * 负责界面渲染和交互处理
 */

const UIManager = {
    // DOM 元素缓存
    elements: {},
    
    // 当前游戏实例
    currentGame: null,
    
    // 当前关卡配置
    currentLevelConfig: null,
    
    // 定时器引用
    uiTimer: null,

    /**
     * 初始化 UI 管理器
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateMainMenu();
    },

    /**
     * 缓存 DOM 元素
     */
    cacheElements() {
        // 屏幕
        this.elements.screens = {
            mainMenu: document.getElementById('mainMenu'),
            levelSelect: document.getElementById('levelSelect'),
            gameScreen: document.getElementById('gameScreen'),
            settings: document.getElementById('settingsScreen'),
            help: document.getElementById('helpScreen')
        };

        // 按钮
        this.elements.buttons = {
            newGame: document.getElementById('newGameBtn'),
            continue: document.getElementById('continueBtn'),
            levelSelect: document.getElementById('levelSelectBtn'),
            settings: document.getElementById('settingsBtn'),
            restart: document.getElementById('restartBtn'),
            hint: document.getElementById('hintBtn'),
            pause: document.getElementById('pauseBtn'),
            soundToggle: document.getElementById('soundToggle'),
            help: document.getElementById('helpBtn'),
            resetProgress: document.getElementById('resetProgressBtn'),
            retry: document.getElementById('retryBtn'),
            nextLevel: document.getElementById('nextLevelBtn'),
            resume: document.getElementById('resumeBtn'),
            cancel: document.getElementById('cancelBtn'),
            confirm: document.getElementById('confirmBtn')
        };

        // 游戏相关元素
        this.elements.game = {
            board: document.getElementById('gameBoard'),
            mineCount: document.getElementById('mineCount'),
            timer: document.getElementById('gameTimer'),
            flagCount: document.getElementById('flagCount'),
            currentLevel: document.getElementById('currentLevel'),
            difficultyBadge: document.getElementById('difficultyBadge')
        };

        // 统计元素
        this.elements.stats = {
            maxLevel: document.getElementById('maxLevelDisplay'),
            totalTime: document.getElementById('totalTimeDisplay'),
            winRate: document.getElementById('winRateDisplay')
        };

        // 关卡选择
        this.elements.levelGrid = document.getElementById('levelGrid');

        // 弹窗
        this.elements.modals = {
            result: document.getElementById('resultModal'),
            pause: document.getElementById('pauseModal'),
            confirm: document.getElementById('confirmModal')
        };

        // 设置选项
        this.elements.settings = {
            sound: document.getElementById('soundSetting'),
            music: document.getElementById('musicSetting'),
            animation: document.getElementById('animationSetting'),
            longPress: document.getElementById('longPressSetting')
        };

        // 返回按钮
        this.elements.backButtons = document.querySelectorAll('.back-btn');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 主菜单按钮
        this.elements.buttons.newGame.addEventListener('click', () => this.startNewGame());
        this.elements.buttons.continue.addEventListener('click', () => this.continueGame());
        this.elements.buttons.levelSelect.addEventListener('click', () => this.showLevelSelect());
        this.elements.buttons.settings.addEventListener('click', () => this.showSettings());

        // 游戏控制按钮
        this.elements.buttons.restart.addEventListener('click', () => this.restartGame());
        this.elements.buttons.hint.addEventListener('click', () => this.showHint());
        this.elements.buttons.pause.addEventListener('click', () => this.pauseGame());

        // 顶部按钮
        this.elements.buttons.soundToggle.addEventListener('click', () => this.toggleSound());
        this.elements.buttons.help.addEventListener('click', () => this.showHelp());

        // 设置页面
        this.elements.buttons.resetProgress.addEventListener('click', () => this.confirmResetProgress());
        this.elements.settings.sound.addEventListener('change', (e) => this.updateSetting('sound', e.target.checked));
        this.elements.settings.music.addEventListener('change', (e) => this.updateSetting('music', e.target.checked));
        this.elements.settings.animation.addEventListener('change', (e) => this.updateSetting('animations', e.target.checked));
        this.elements.settings.longPress.addEventListener('change', (e) => this.updateSetting('longPress', e.target.checked));

        // 弹窗按钮
        this.elements.buttons.retry.addEventListener('click', () => this.retryLevel());
        this.elements.buttons.nextLevel.addEventListener('click', () => this.nextLevel());
        this.elements.buttons.resume.addEventListener('click', () => this.resumeGame());
        this.elements.buttons.cancel.addEventListener('click', () => this.hideModal('confirm'));
        this.elements.buttons.confirm.addEventListener('click', () => this.executeConfirmAction());

        // 返回按钮
        this.elements.backButtons.forEach(btn => {
            btn.addEventListener('click', () => this.goBack());
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },

    /**
     * 切换屏幕
     * @param {string} screenName - 屏幕名称
     */
    switchScreen(screenName) {
        // 隐藏所有屏幕
        Object.values(this.elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // 显示目标屏幕
        if (this.elements.screens[screenName]) {
            this.elements.screens[screenName].classList.add('active');
        }

        AudioManager.playMenu();
    },

    /**
     * 返回上一页
     */
    goBack() {
        if (this.currentGame) {
            this.saveCurrentGame();
        }
        this.switchScreen('mainMenu');
        this.updateMainMenu();
    },

    /**
     * 更新主菜单
     */
    updateMainMenu() {
        const progress = Storage.getProgress();
        const stats = Storage.getStats();

        // 更新统计信息
        this.elements.stats.maxLevel.textContent = progress.maxUnlockedLevel;
        this.elements.stats.totalTime.textContent = Utils.formatTime(progress.totalPlayTime);
        
        const winRate = stats.totalGames > 0 
            ? Math.round((stats.totalWins / stats.totalGames) * 100) 
            : 0;
        this.elements.stats.winRate.textContent = `${winRate}%`;

        // 显示/隐藏继续游戏按钮
        const hasSavedGame = Storage.getCurrentGame() !== null;
        this.elements.buttons.continue.classList.toggle('hidden', !hasSavedGame);
    },

    /**
     * 开始新游戏
     */
    startNewGame() {
        const progress = Storage.getProgress();
        this.loadLevel(progress.currentLevel);
    },

    /**
     * 继续游戏
     */
    continueGame() {
        const savedGame = Storage.getCurrentGame();
        if (savedGame) {
            this.currentGame = Minesweeper.deserialize(savedGame.gameState);
            this.currentLevelConfig = savedGame.levelConfig;
            this.renderGame();
            this.switchScreen('gameScreen');
            this.startUITimer();
        }
    },

    /**
     * 加载关卡
     * @param {number} level - 关卡编号
     */
    loadLevel(level) {
        this.currentLevelConfig = LevelSystem.getLevelConfig(level);
        this.currentGame = new Minesweeper(
            this.currentLevelConfig.rows,
            this.currentLevelConfig.cols,
            this.currentLevelConfig.mineCount
        );

        this.renderGame();
        this.switchScreen('gameScreen');
        this.startUITimer();
        
        AudioManager.playLevelUp();
    },

    /**
     * 渲染游戏界面
     */
    renderGame() {
        if (!this.currentGame || !this.currentLevelConfig) return;

        // 更新关卡信息
        this.elements.game.currentLevel.textContent = `第 ${this.currentLevelConfig.level} 关`;
        this.elements.game.difficultyBadge.textContent = this.currentLevelConfig.difficulty.label;
        this.elements.game.difficultyBadge.className = `badge ${this.currentLevelConfig.difficulty.name}`;

        // 更新统计
        this.updateGameStats();

        // 渲染棋盘
        this.renderBoard();
    },

    /**
     * 渲染棋盘
     */
    renderBoard() {
        const board = this.elements.game.board;
        board.innerHTML = '';

        const { rows, cols } = this.currentGame;
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = this.createCellElement(row, col);
                board.appendChild(cell);
            }
        }
    },

    /**
     * 创建格子元素
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Element} 格子元素
     */
    createCellElement(row, col) {
        const cellData = this.currentGame.getCell(row, col);
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        this.updateCellAppearance(cell, cellData);
        this.bindCellEvents(cell, row, col);

        return cell;
    },

    /**
     * 更新格子外观
     * @param {Element} cell - 格子元素
     * @param {Object} cellData - 格子数据
     */
    updateCellAppearance(cell, cellData) {
        cell.className = 'cell';

        if (cellData.isRevealed) {
            cell.classList.add('revealed');
            
            if (cellData.isMine) {
                cell.classList.add('mine');
                cell.textContent = '💣';
            } else if (cellData.neighborMines > 0) {
                cell.classList.add(`num-${cellData.neighborMines}`);
                cell.textContent = cellData.neighborMines;
            }
        } else {
            if (cellData.isFlagged) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            } else if (cellData.isQuestion) {
                cell.classList.add('question');
                cell.textContent = '?';
            } else {
                cell.textContent = '';
            }
        }
    },

    /**
     * 绑定格子事件
     * @param {Element} cell - 格子元素
     * @param {number} row - 行
     * @param {number} col - 列
     */
    bindCellEvents(cell, row, col) {
        // 左键点击
        cell.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCellClick(row, col);
        });

        // 右键点击（标记）
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleCellRightClick(row, col);
        });

        // 双击（快速揭示）
        cell.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.handleCellDoubleClick(row, col);
        });

        // 触摸设备长按支持
        if (Utils.isTouchDevice()) {
            let pressTimer;
            const settings = Storage.getSettings();
            
            if (settings.longPress) {
                cell.addEventListener('touchstart', (e) => {
                    pressTimer = setTimeout(() => {
                        e.preventDefault();
                        this.handleCellRightClick(row, col);
                    }, 500);
                });

                cell.addEventListener('touchend', () => {
                    clearTimeout(pressTimer);
                });

                cell.addEventListener('touchmove', () => {
                    clearTimeout(pressTimer);
                });
            }
        }
    },

    /**
     * 处理格子点击
     * @param {number} row - 行
     * @param {number} col - 列
     */
    handleCellClick(row, col) {
        if (!this.currentGame) return;

        const result = this.currentGame.reveal(row, col);
        
        if (result.success) {
            // 更新被揭示的格子
            result.revealed.forEach(({ row: r, col: c }) => {
                const cell = this.getCellElement(r, c);
                const cellData = this.currentGame.getCell(r, c);
                this.updateCellAppearance(cell, cellData);
                
                // 添加动画
                if (Storage.getSettings().animations) {
                    cell.classList.add('reveal-animation');
                    setTimeout(() => cell.classList.remove('reveal-animation'), 300);
                }
            });

            // 播放音效
            if (result.exploded) {
                AudioManager.playExplode();
                this.handleGameOver(false);
            } else {
                AudioManager.playReveal();
            }

            // 检查游戏状态
            if (result.gameState === 'won') {
                this.handleGameOver(true);
            }

            this.updateGameStats();
            this.saveCurrentGame();
        }
    },

    /**
     * 处理格子右键点击
     * @param {number} row - 行
     * @param {number} col - 列
     */
    handleCellRightClick(row, col) {
        if (!this.currentGame) return;

        const result = this.currentGame.toggleFlag(row, col);
        
        if (result.success) {
            const cell = this.getCellElement(row, col);
            const cellData = this.currentGame.getCell(row, col);
            this.updateCellAppearance(cell, cellData);

            // 播放音效
            if (result.action === 'flag') {
                AudioManager.playFlag();
                cell.classList.add('flag-animation');
                setTimeout(() => cell.classList.remove('flag-animation'), 300);
            } else if (result.action === 'question') {
                AudioManager.playUnflag();
            }

            this.updateGameStats();
            this.saveCurrentGame();
        }
    },

    /**
     * 处理格子双击
     * @param {number} row - 行
     * @param {number} col - 列
     */
    handleCellDoubleClick(row, col) {
        if (!this.currentGame) return;

        const result = this.currentGame.quickReveal(row, col);
        
        if (result.success) {
            // 更新被揭示的格子
            result.revealed.forEach(({ row: r, col: c }) => {
                const cell = this.getCellElement(r, c);
                const cellData = this.currentGame.getCell(r, c);
                this.updateCellAppearance(cell, cellData);
                
                if (Storage.getSettings().animations) {
                    cell.classList.add('reveal-animation');
                    setTimeout(() => cell.classList.remove('reveal-animation'), 300);
                }
            });

            if (result.exploded) {
                AudioManager.playExplode();
                this.handleGameOver(false);
            } else {
                AudioManager.playReveal();
            }

            if (result.gameState === 'won') {
                this.handleGameOver(true);
            }

            this.updateGameStats();
            this.saveCurrentGame();
        }
    },

    /**
     * 获取格子元素
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Element} 格子元素
     */
    getCellElement(row, col) {
        return this.elements.game.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    },

    /**
     * 更新游戏统计
     */
    updateGameStats() {
        if (!this.currentGame) return;

        this.elements.game.mineCount.textContent = Utils.formatNumber(
            this.currentGame.getRemainingMines()
        );
        this.elements.game.flagCount.textContent = Utils.formatNumber(
            this.currentGame.flaggedCount
        );
    },

    /**
     * 启动 UI 定时器
     */
    startUITimer() {
        this.stopUITimer();
        this.uiTimer = setInterval(() => {
            if (this.currentGame && this.currentGame.gameState === 'playing') {
                this.elements.game.timer.textContent = Utils.formatNumber(
                    this.currentGame.getTime()
                );
            }
        }, 1000);
    },

    /**
     * 停止 UI 定时器
     */
    stopUITimer() {
        if (this.uiTimer) {
            clearInterval(this.uiTimer);
            this.uiTimer = null;
        }
    },

    /**
     * 处理游戏结束
     * @param {boolean} won - 是否获胜
     */
    handleGameOver(won) {
        this.stopUITimer();

        if (won) {
            AudioManager.playWin();
            
            const time = this.currentGame.getTime();
            const stars = LevelSystem.calculateStars(this.currentLevelConfig.level, time);
            
            // 保存进度
            Storage.completeLevel(this.currentLevelConfig.level, {
                time,
                stars
            });

            // 显示胜利弹窗
            this.showResultModal(true, time, stars);
        } else {
            AudioManager.playLose();
            
            // 揭示所有地雷
            this.currentGame.revealAllMines();
            
            // 更新棋盘显示
            for (let row = 0; row < this.currentGame.rows; row++) {
                for (let col = 0; col < this.currentGame.cols; col++) {
                    const cellData = this.currentGame.getCell(row, col);
                    if (cellData.isMine) {
                        const cell = this.getCellElement(row, col);
                        this.updateCellAppearance(cell, cellData);
                    }
                }
            }

            // 显示失败弹窗
            this.showResultModal(false, this.currentGame.getTime(), 0);
        }

        Storage.clearCurrentGame();
    },

    /**
     * 显示结果弹窗
     * @param {boolean} won - 是否获胜
     * @param {number} time - 用时
     * @param {number} stars - 星级
     */
    showResultModal(won, time, stars) {
        const modal = this.elements.modals.result;
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const timeDisplay = document.getElementById('resultTime');
        const starsDisplay = document.getElementById('resultStars');
        const nextBtn = this.elements.buttons.nextLevel;

        if (won) {
            icon.textContent = '🎉';
            title.textContent = '恭喜通关！';
            starsDisplay.textContent = '⭐'.repeat(stars);
            nextBtn.classList.remove('hidden');
            
            // 检查是否还有下一关
            const nextLevel = LevelSystem.getNextLevel(this.currentLevelConfig.level);
            if (!nextLevel) {
                nextBtn.textContent = '🏆 完成所有关卡';
            }
        } else {
            icon.textContent = '💥';
            title.textContent = '游戏结束';
            starsDisplay.textContent = '💣';
            nextBtn.classList.add('hidden');
        }

        timeDisplay.textContent = Utils.formatTime(time);
        modal.classList.remove('hidden');
    },

    /**
     * 隐藏弹窗
     * @param {string} modalName - 弹窗名称
     */
    hideModal(modalName) {
        if (this.elements.modals[modalName]) {
            this.elements.modals[modalName].classList.add('hidden');
        }
    },

    /**
     * 重试关卡
     */
    retryLevel() {
        this.hideModal('result');
        this.loadLevel(this.currentLevelConfig.level);
    },

    /**
     * 下一关
     */
    nextLevel() {
        this.hideModal('result');
        const nextLevel = LevelSystem.getNextLevel(this.currentLevelConfig.level);
        
        if (nextLevel) {
            this.loadLevel(nextLevel);
        } else {
            // 所有关卡已完成
            this.switchScreen('mainMenu');
            this.updateMainMenu();
        }
    },

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.loadLevel(this.currentLevelConfig.level);
    },

    /**
     * 显示提示
     */
    showHint() {
        if (!this.currentGame) return;

        const hint = this.currentGame.getHint();
        if (hint) {
            const cell = this.getCellElement(hint.row, hint.col);
            cell.classList.add('hint');
            AudioManager.playHint();
            
            setTimeout(() => {
                cell.classList.remove('hint');
            }, 2000);
        }
    },

    /**
     * 暂停游戏
     */
    pauseGame() {
        if (this.currentGame) {
            this.currentGame.pauseTimer();
            this.elements.modals.pause.classList.remove('hidden');
        }
    },

    /**
     * 恢复游戏
     */
    resumeGame() {
        this.hideModal('pause');
        if (this.currentGame) {
            this.currentGame.resumeTimer();
        }
    },

    /**
     * 保存当前游戏
     */
    saveCurrentGame() {
        if (this.currentGame && this.currentGame.gameState === 'playing') {
            Storage.saveCurrentGame({
                gameState: this.currentGame.serialize(),
                levelConfig: this.currentLevelConfig,
                savedAt: new Date().toISOString()
            });
        }
    },

    /**
     * 显示关卡选择
     */
    showLevelSelect() {
        this.renderLevelGrid();
        this.switchScreen('levelSelect');
    },

    /**
     * 渲染关卡网格
     */
    renderLevelGrid() {
        const grid = this.elements.levelGrid;
        const progress = Storage.getProgress();
        
        grid.innerHTML = '';

        for (let i = 1; i <= LevelSystem.TOTAL_LEVELS; i++) {
            const card = document.createElement('div');
            card.className = 'level-card';
            
            const isUnlocked = LevelSystem.isLevelUnlocked(i, progress.maxUnlockedLevel);
            const isCompleted = LevelSystem.isLevelCompleted(i, progress.completedLevels);
            const isCurrent = i === progress.currentLevel;

            if (!isUnlocked) {
                card.classList.add('locked');
                card.innerHTML = '<span class="level-lock">🔒</span>';
            } else {
                if (isCompleted) {
                    card.classList.add('completed');
                    const stars = progress.completedLevels[i].stars;
                    card.innerHTML = `
                        <span class="level-number">${i}</span>
                        <span class="level-stars">${'⭐'.repeat(stars)}</span>
                    `;
                } else if (isCurrent) {
                    card.classList.add('current');
                    card.innerHTML = `<span class="level-number">${i}</span>`;
                } else {
                    card.innerHTML = `<span class="level-number">${i}</span>`;
                }

                card.addEventListener('click', () => {
                    this.loadLevel(i);
                });
            }

            grid.appendChild(card);
        }
    },

    /**
     * 显示设置
     */
    showSettings() {
        const settings = Storage.getSettings();
        this.elements.settings.sound.checked = settings.sound !== false;
        this.elements.settings.music.checked = settings.music === true;
        this.elements.settings.animation.checked = settings.animations !== false;
        this.elements.settings.longPress.checked = settings.longPress === true;
        
        this.switchScreen('settings');
    },

    /**
     * 更新设置
     * @param {string} key - 设置项
     * @param {boolean} value - 值
     */
    updateSetting(key, value) {
        const settings = Storage.getSettings();
        settings[key] = value;
        Storage.saveSettings(settings);

        if (key === 'sound') {
            AudioManager.setSound(value);
        } else if (key === 'music') {
            AudioManager.setMusic(value);
        }
    },

    /**
     * 显示帮助
     */
    showHelp() {
        this.switchScreen('help');
    },

    /**
     * 切换音效
     */
    toggleSound() {
        const enabled = AudioManager.toggleMute();
        this.elements.buttons.soundToggle.textContent = enabled ? '🔊' : '🔇';
        
        const settings = Storage.getSettings();
        settings.sound = enabled;
        Storage.saveSettings(settings);
    },

    /**
     * 确认重置进度
     */
    confirmResetProgress() {
        const modal = this.elements.modals.confirm;
        document.getElementById('confirmTitle').textContent = '重置进度';
        document.getElementById('confirmMessage').textContent = '确定要重置所有游戏进度吗？此操作不可撤销。';
        
        this.confirmAction = () => {
            Storage.resetAllProgress();
            this.hideModal('confirm');
            this.updateMainMenu();
            AudioManager.playMenu();
        };
        
        modal.classList.remove('hidden');
    },

    /**
     * 执行确认操作
     */
    executeConfirmAction() {
        if (this.confirmAction) {
            this.confirmAction();
            this.confirmAction = null;
        }
    },

    /**
     * 处理键盘事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeyDown(e) {
        // ESC 键暂停/恢复
        if (e.key === 'Escape') {
            if (!this.elements.modals.pause.classList.contains('hidden')) {
                this.resumeGame();
            } else if (this.currentGame && this.currentGame.gameState === 'playing') {
                this.pauseGame();
            }
        }
    },

    /**
     * 处理页面可见性变化
     */
    handleVisibilityChange() {
        if (document.hidden && this.currentGame && this.currentGame.gameState === 'playing') {
            this.pauseGame();
        }
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
