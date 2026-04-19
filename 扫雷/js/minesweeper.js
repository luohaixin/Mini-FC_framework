/**
 * 扫雷游戏核心逻辑模块
 * 包含游戏状态管理、雷区生成、格子操作等核心功能
 */

class Minesweeper {
    /**
     * 创建扫雷游戏实例
     * @param {number} rows - 行数
     * @param {number} cols - 列数
     * @param {number} mineCount - 地雷数量
     */
    constructor(rows, cols, mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        
        // 游戏状态
        this.board = [];
        this.gameState = 'ready'; // ready, playing, won, lost
        this.firstClick = true;
        this.revealedCount = 0;
        this.flaggedCount = 0;
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.elapsedTime = 0;
        
        // 历史记录（用于撤销功能）
        this.history = [];
        
        // 初始化棋盘
        this.initBoard();
    }

    /**
     * 初始化游戏棋盘
     */
    initBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = {
                    row,
                    col,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    isQuestion: false,
                    neighborMines: 0
                };
            }
        }
    }

    /**
     * 生成地雷（确保第一次点击安全）
     * @param {number} safeRow - 安全行
     * @param {number} safeCol - 安全列
     */
    generateMines(safeRow, safeCol) {
        const positions = [];
        
        // 收集所有可能的位置
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // 排除第一次点击的格子及其周围
                if (Math.abs(row - safeRow) > 1 || Math.abs(col - safeCol) > 1) {
                    positions.push({ row, col });
                }
            }
        }
        
        // 随机选择地雷位置
        const shuffled = Utils.shuffle(positions);
        const minePositions = shuffled.slice(0, this.mineCount);
        
        // 放置地雷
        minePositions.forEach(pos => {
            this.board[pos.row][pos.col].isMine = true;
        });
        
        // 计算每个格子的周围地雷数
        this.calculateNeighborMines();
    }

    /**
     * 计算每个格子周围的地雷数量
     */
    calculateNeighborMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].isMine) {
                    this.board[row][col].neighborMines = this.countNeighborMines(row, col);
                }
            }
        }
    }

    /**
     * 计算指定格子周围的地雷数量
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {number} 周围地雷数量
     */
    countNeighborMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r === row && c === col) continue;
                if (this.isValidPosition(r, c) && this.board[r][c].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * 检查位置是否有效
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {boolean} 是否有效
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    /**
     * 获取指定格子
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Object|null} 格子对象
     */
    getCell(row, col) {
        if (this.isValidPosition(row, col)) {
            return this.board[row][col];
        }
        return null;
    }

    /**
     * 揭示格子
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Object} 操作结果
     */
    reveal(row, col) {
        const cell = this.getCell(row, col);
        
        if (!cell || cell.isRevealed || cell.isFlagged || this.gameState === 'lost' || this.gameState === 'won') {
            return { success: false, reason: 'invalid_operation' };
        }
        
        // 保存历史记录
        this.saveHistory();
        
        // 第一次点击时生成地雷
        if (this.firstClick) {
            this.generateMines(row, col);
            this.firstClick = false;
            this.gameState = 'playing';
            this.startTimer();
        }
        
        // 揭示当前格子
        const revealed = this.revealCell(row, col);
        
        // 检查游戏状态
        this.checkGameState();
        
        return {
            success: true,
            revealed,
            gameState: this.gameState,
            exploded: cell.isMine
        };
    }

    /**
     * 揭示单个格子（递归揭示空白区域）
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Array} 被揭示的格子列表
     */
    revealCell(row, col) {
        const cell = this.getCell(row, col);
        if (!cell || cell.isRevealed || cell.isFlagged) {
            return [];
        }
        
        const revealed = [];
        const queue = [{ row, col }];
        
        while (queue.length > 0) {
            const { row: r, col: c } = queue.shift();
            const currentCell = this.getCell(r, c);
            
            if (!currentCell || currentCell.isRevealed || currentCell.isFlagged) {
                continue;
            }
            
            // 揭示格子
            currentCell.isRevealed = true;
            currentCell.isQuestion = false;
            this.revealedCount++;
            revealed.push({ row: r, col: c, cell: currentCell });
            
            // 如果是地雷，游戏结束
            if (currentCell.isMine) {
                this.gameState = 'lost';
                this.stopTimer();
                return revealed;
            }
            
            // 如果周围没有地雷，递归揭示周围格子
            if (currentCell.neighborMines === 0) {
                for (let nr = r - 1; nr <= r + 1; nr++) {
                    for (let nc = c - 1; nc <= c + 1; nc++) {
                        if (nr === r && nc === c) continue;
                        const neighbor = this.getCell(nr, nc);
                        if (neighbor && !neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                            queue.push({ row: nr, col: nc });
                        }
                    }
                }
            }
        }
        
        return revealed;
    }

    /**
     * 标记/取消标记格子
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Object} 操作结果
     */
    toggleFlag(row, col) {
        const cell = this.getCell(row, col);
        
        if (!cell || cell.isRevealed || this.gameState === 'lost' || this.gameState === 'won') {
            return { success: false, reason: 'invalid_operation' };
        }
        
        this.saveHistory();
        
        let action = '';
        
        if (cell.isFlagged) {
            // 取消标记
            cell.isFlagged = false;
            cell.isQuestion = true;
            this.flaggedCount--;
            action = 'question';
        } else if (cell.isQuestion) {
            // 取消疑问标记
            cell.isQuestion = false;
            action = 'unmark';
        } else {
            // 标记为旗子
            cell.isFlagged = true;
            this.flaggedCount++;
            action = 'flag';
        }
        
        return {
            success: true,
            action,
            flaggedCount: this.flaggedCount
        };
    }

    /**
     * 快速揭示（双击数字格子）
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {Object} 操作结果
     */
    quickReveal(row, col) {
        const cell = this.getCell(row, col);
        
        if (!cell || !cell.isRevealed || cell.neighborMines === 0 || 
            this.gameState === 'lost' || this.gameState === 'won') {
            return { success: false, reason: 'invalid_operation' };
        }
        
        // 计算周围已标记的旗子数量
        let flaggedAround = 0;
        const neighbors = [];
        
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r === row && c === col) continue;
                const neighbor = this.getCell(r, c);
                if (neighbor) {
                    neighbors.push(neighbor);
                    if (neighbor.isFlagged) {
                        flaggedAround++;
                    }
                }
            }
        }
        
        // 如果标记数量等于数字，揭示周围未标记的格子
        if (flaggedAround === cell.neighborMines) {
            this.saveHistory();
            
            const revealed = [];
            let exploded = false;
            
            for (const neighbor of neighbors) {
                if (!neighbor.isRevealed && !neighbor.isFlagged) {
                    const result = this.revealCell(neighbor.row, neighbor.col);
                    revealed.push(...result);
                    
                    if (neighbor.isMine) {
                        exploded = true;
                    }
                }
            }
            
            this.checkGameState();
            
            return {
                success: true,
                revealed,
                exploded,
                gameState: this.gameState
            };
        }
        
        return { success: false, reason: 'flag_mismatch' };
    }

    /**
     * 检查游戏状态
     */
    checkGameState() {
        if (this.gameState === 'lost') {
            return;
        }
        
        const totalCells = this.rows * this.cols;
        const safeCells = totalCells - this.mineCount;
        
        // 如果所有安全格子都被揭示，游戏胜利
        if (this.revealedCount === safeCells) {
            this.gameState = 'won';
            this.stopTimer();
            
            // 自动标记剩余的地雷
            this.autoFlagMines();
        }
    }

    /**
     * 自动标记剩余的地雷
     */
    autoFlagMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.board[row][col];
                if (cell.isMine && !cell.isFlagged) {
                    cell.isFlagged = true;
                    this.flaggedCount++;
                }
            }
        }
    }

    /**
     * 揭示所有地雷
     */
    revealAllMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.board[row][col];
                if (cell.isMine) {
                    cell.isRevealed = true;
                }
            }
        }
    }

    /**
     * 获取提示
     * @returns {Object|null} 提示信息
     */
    getHint() {
        // 找到一个安全的格子作为提示
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.board[row][col];
                if (!cell.isRevealed && !cell.isMine && !cell.isFlagged) {
                    return { row, col, cell };
                }
            }
        }
        return null;
    }

    /**
     * 开始计时
     */
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        }, 1000);
    }

    /**
     * 停止计时
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.startTime) {
            this.endTime = Date.now();
        }
    }

    /**
     * 暂停计时
     */
    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * 恢复计时
     */
    resumeTimer() {
        if (this.gameState === 'playing' && !this.timerInterval) {
            this.startTime = Date.now() - this.elapsedTime * 1000;
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            }, 1000);
        }
    }

    /**
     * 获取当前时间
     * @returns {number} 经过的秒数
     */
    getTime() {
        return this.elapsedTime;
    }

    /**
     * 保存历史记录
     */
    saveHistory() {
        // 限制历史记录数量
        if (this.history.length >= 10) {
            this.history.shift();
        }
        
        // 深拷贝当前状态
        this.history.push({
            board: Utils.deepClone(this.board),
            gameState: this.gameState,
            revealedCount: this.revealedCount,
            flaggedCount: this.flaggedCount,
            elapsedTime: this.elapsedTime
        });
    }

    /**
     * 撤销上一步
     * @returns {boolean} 是否成功
     */
    undo() {
        if (this.history.length === 0) {
            return false;
        }
        
        const state = this.history.pop();
        this.board = state.board;
        this.gameState = state.gameState;
        this.revealedCount = state.revealedCount;
        this.flaggedCount = state.flaggedCount;
        this.elapsedTime = state.elapsedTime;
        
        return true;
    }

    /**
     * 重置游戏
     */
    reset() {
        this.stopTimer();
        this.gameState = 'ready';
        this.firstClick = true;
        this.revealedCount = 0;
        this.flaggedCount = 0;
        this.startTime = null;
        this.endTime = null;
        this.elapsedTime = 0;
        this.history = [];
        this.initBoard();
    }

    /**
     * 获取游戏状态快照
     * @returns {Object} 游戏状态
     */
    getSnapshot() {
        return {
            rows: this.rows,
            cols: this.cols,
            mineCount: this.mineCount,
            board: Utils.deepClone(this.board),
            gameState: this.gameState,
            firstClick: this.firstClick,
            revealedCount: this.revealedCount,
            flaggedCount: this.flaggedCount,
            elapsedTime: this.elapsedTime
        };
    }

    /**
     * 从快照恢复游戏
     * @param {Object} snapshot - 游戏状态快照
     */
    restoreFromSnapshot(snapshot) {
        this.rows = snapshot.rows;
        this.cols = snapshot.cols;
        this.mineCount = snapshot.mineCount;
        this.board = Utils.deepClone(snapshot.board);
        this.gameState = snapshot.gameState;
        this.firstClick = snapshot.firstClick;
        this.revealedCount = snapshot.revealedCount;
        this.flaggedCount = snapshot.flaggedCount;
        this.elapsedTime = snapshot.elapsedTime;
        
        if (this.gameState === 'playing') {
            this.resumeTimer();
        }
    }

    /**
     * 获取剩余地雷数
     * @returns {number} 剩余地雷数
     */
    getRemainingMines() {
        return this.mineCount - this.flaggedCount;
    }

    /**
     * 获取游戏结果
     * @returns {Object|null} 游戏结果
     */
    getResult() {
        if (this.gameState !== 'won' && this.gameState !== 'lost') {
            return null;
        }
        
        return {
            won: this.gameState === 'won',
            time: this.elapsedTime,
            rows: this.rows,
            cols: this.cols,
            mineCount: this.mineCount
        };
    }

    /**
     * 序列化游戏状态
     * @returns {string} JSON字符串
     */
    serialize() {
        return Utils.safeJSONStringify(this.getSnapshot());
    }

    /**
     * 反序列化游戏状态
     * @param {string} data - JSON字符串
     * @returns {Minesweeper} 游戏实例
     */
    static deserialize(data) {
        const snapshot = Utils.safeJSONParse(data);
        if (!snapshot) return null;
        
        const game = new Minesweeper(snapshot.rows, snapshot.cols, snapshot.mineCount);
        game.restoreFromSnapshot(snapshot);
        return game;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Minesweeper;
}
