/**
 * 数独游戏主类
 * 负责游戏逻辑、数独生成、验证和闯关系统
 */
class SudokuGame {
    /**
     * 构造函数 - 初始化游戏状态和配置
     */
    constructor() {
        // 当前关卡等级
        this.currentLevel = 1;
        // 当前游戏棋盘状态（玩家填写的数字）
        this.grid = [];
        // 完整解答（用于验证和提示）
        this.solution = [];
        // 当前选中的格子索引
        this.selectedCell = null;
        
        /**
         * 难度配置映射表
         * 每关对应不同的难度名称和空格数量
         * 空格越多，难度越大
         */
        this.difficultyMap = {
            1: { name: '简单', emptyCells: 35 },   // 第1关：35个空格
            2: { name: '简单', emptyCells: 38 },   // 第2关：38个空格
            3: { name: '中等', emptyCells: 42 },   // 第3关：42个空格
            4: { name: '中等', emptyCells: 45 },   // 第4关：45个空格
            5: { name: '困难', emptyCells: 48 },   // 第5关：48个空格
            6: { name: '困难', emptyCells: 51 },   // 第6关：51个空格
            7: { name: '专家', emptyCells: 54 },   // 第7关：54个空格
            8: { name: '专家', emptyCells: 56 },   // 第8关：56个空格
            9: { name: '大师', emptyCells: 58 },   // 第9关：58个空格
            10: { name: '大师', emptyCells: 60 }   // 第10关：60个空格
        };
        
        // 初始化游戏
        this.init();
    }

    /**
     * 初始化游戏
     * 创建格子、绑定事件、开始新游戏
     */
    init() {
        this.createGrid();      // 创建9x9格子
        this.bindEvents();      // 绑定各种事件监听
        this.startNewGame();    // 开始第一关
    }

    /**
     * 创建数独棋盘格子
     * 生成81个div元素，每个代表一个格子
     */
    createGrid() {
        const gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';

        // 创建81个格子（9x9）
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;  // 存储格子索引，用于定位
            // 点击格子时选中该格子
            cell.addEventListener('click', () => this.selectCell(i));
            gridElement.appendChild(cell);
        }
    }

    /**
     * 绑定所有事件监听器
     * 包括数字按钮、功能按钮、键盘事件
     */
    bindEvents() {
        // 数字按钮（1-9）和擦除按钮（0）
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.dataset.num);
                this.inputNumber(num);
            });
        });

        // 新游戏按钮 - 重新开始当前关卡
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.startNewGame();
        });

        // 检查按钮 - 检查当前填写是否正确
        document.getElementById('check-btn').addEventListener('click', () => {
            this.checkSolution();
        });

        // 提示按钮 - 自动填入一个正确答案
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.giveHint();
        });

        // 下一关按钮 - 通关后进入下一关
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.currentLevel++;
            this.hideVictoryModal();
            this.startNewGame();
        });

        // 重玩按钮 - 通关后重玩本关
        document.getElementById('replay-btn').addEventListener('click', () => {
            this.hideVictoryModal();
            this.startNewGame();
        });

        // 键盘事件监听
        document.addEventListener('keydown', (e) => {
            // 数字键1-9：输入对应数字
            if (e.key >= '1' && e.key <= '9') {
                this.inputNumber(parseInt(e.key));
            } 
            // 退格键、删除键、0：清除格子
            else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                this.inputNumber(0);
            } 
            // 方向键：移动选中的格子
            else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                       e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.moveSelection(e.key);
            }
        });
    }

    /**
     * 生成完整的数独解答
     * 使用回溯算法生成有效的完整数独
     * @returns {Array} 9x9的完整数独数组
     */
    generateCompleteGrid() {
        // 初始化9x9的空数组
        const grid = Array(9).fill(null).map(() => Array(9).fill(0));
        
        /**
         * 回溯填充算法
         * 递归地尝试在每个空格填入有效数字
         * @param {Array} grid - 当前棋盘状态
         * @returns {boolean} 是否成功填充
         */
        const fillGrid = (grid) => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    // 找到空格（值为0）
                    if (grid[row][col] === 0) {
                        // 随机打乱1-9的顺序，增加随机性
                        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                        this.shuffleArray(nums);
                        
                        // 尝试每个数字
                        for (const num of nums) {
                            // 检查数字是否可以放在该位置
                            if (this.isValidPlacement(grid, row, col, num)) {
                                grid[row][col] = num;
                                
                                // 递归填充剩余格子
                                if (fillGrid(grid)) {
                                    return true;
                                }
                                
                                // 回溯：如果后续无法填充，重置该格子
                                grid[row][col] = 0;
                            }
                        }
                        // 所有数字都尝试过，无法填充，返回false进行回溯
                        return false;
                    }
                }
            }
            // 所有格子都已填充
            return true;
        };

        fillGrid(grid);
        return grid;
    }

    /**
     * 随机打乱数组（Fisher-Yates洗牌算法）
     * @param {Array} array - 要打乱的数组
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * 检查数字是否可以放置在指定位置
     * 检查行、列、3x3宫格是否有重复
     * @param {Array} grid - 棋盘状态
     * @param {number} row - 行索引（0-8）
     * @param {number} col - 列索引（0-8）
     * @param {number} num - 要放置的数字
     * @returns {boolean} 是否可以放置
     */
    isValidPlacement(grid, row, col, num) {
        // 检查行是否有重复
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) return false;
            if (grid[i][col] === num) return false;
        }

        // 计算所在3x3宫格的左上角坐标
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        // 检查3x3宫格是否有重复
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        // 没有冲突，可以放置
        return true;
    }

    /**
     * 根据完整解答创建谜题
     * 随机挖空指定数量的格子
     * @param {Array} completeGrid - 完整解答
     * @param {number} emptyCells - 要挖空的数量
     * @returns {Array} 谜题棋盘
     */
    createPuzzle(completeGrid, emptyCells) {
        // 复制完整解答
        const puzzle = completeGrid.map(row => [...row]);
        const positions = [];
        
        // 生成所有位置（0-80）
        for (let i = 0; i < 81; i++) {
            positions.push(i);
        }
        // 随机打乱位置顺序
        this.shuffleArray(positions);

        // 挖空指定数量的格子（设为0）
        for (let i = 0; i < emptyCells; i++) {
            const pos = positions[i];
            const row = Math.floor(pos / 9);
            const col = pos % 9;
            puzzle[row][col] = 0;
        }

        return puzzle;
    }

    /**
     * 开始新游戏
     * 根据当前关卡生成对应难度的谜题
     */
    startNewGame() {
        // 获取当前关卡的难度配置（最高10关）
        const difficulty = this.difficultyMap[Math.min(this.currentLevel, 10)];
        
        // 更新界面显示
        document.getElementById('current-level').textContent = this.currentLevel;
        document.getElementById('difficulty').textContent = difficulty.name;

        // 生成完整解答和谜题
        this.solution = this.generateCompleteGrid();
        this.grid = this.createPuzzle(this.solution, difficulty.emptyCells);
        
        // 保存初始谜题状态，用于判断哪些是预设数字
        this.initialGrid = this.grid.map(row => [...row]);
        
        // 渲染棋盘并重置状态
        this.renderGrid();
        this.showMessage('');
        this.selectedCell = null;
    }

    /**
     * 渲染棋盘到界面
     * 根据当前grid数组更新所有格子的显示
     */
    renderGrid() {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.grid[row][col];

            // 设置格子内容（0显示为空）
            cell.textContent = value === 0 ? '' : value;
            // 重置样式
            cell.className = 'cell';
            
            // 用户输入的数字添加特殊样式 - 使用初始谜题状态判断
            if (value !== 0 && this.initialGrid[row][col] === 0) {
                cell.classList.add('user-input');
            }
        });
    }

    /**
     * 选中格子
     * @param {number} index - 格子索引（0-80）
     */
    selectCell(index) {
        const cells = document.querySelectorAll('.cell');
        // 清除之前的选中和高亮
        cells.forEach(cell => cell.classList.remove('selected', 'highlight'));

        const row = Math.floor(index / 9);
        const col = index % 9;

        // 标记当前格子为选中
        cells[index].classList.add('selected');
        this.selectedCell = index;

        // 高亮显示相同数字的格子
        const currentValue = this.grid[row][col];
        if (currentValue !== 0) {
            cells.forEach((cell, i) => {
                const r = Math.floor(i / 9);
                const c = i % 9;
                if (this.grid[r][c] === currentValue && i !== index) {
                    cell.classList.add('highlight');
                }
            });
        }
    }

    /**
     * 使用方向键移动选中的格子
     * @param {string} key - 方向键名称
     */
    moveSelection(key) {
        // 如果没有选中格子，默认选中第一个
        if (this.selectedCell === null) {
            this.selectCell(0);
            return;
        }

        // 计算当前行列
        let row = Math.floor(this.selectedCell / 9);
        let col = this.selectedCell % 9;

        // 根据方向键更新行列
        switch (key) {
            case 'ArrowUp':
                row = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                row = Math.min(8, row + 1);
                break;
            case 'ArrowLeft':
                col = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                col = Math.min(8, col + 1);
                break;
        }

        // 选中新位置的格子
        this.selectCell(row * 9 + col);
    }

    /**
     * 在选中的格子输入数字
     * @param {number} num - 输入的数字（0表示清除）
     */
    inputNumber(num) {
        // 检查是否选中了格子
        if (this.selectedCell === null) {
            this.showMessage('请先选择一个格子', 'error');
            return;
        }

        const row = Math.floor(this.selectedCell / 9);
        const col = this.selectedCell % 9;

        // 检查是否是预设数字（不能修改）- 使用初始谜题状态判断
        if (this.initialGrid[row][col] !== 0) {
            this.showMessage('不能修改预设数字', 'error');
            return;
        }

        // 更新格子值
        this.grid[row][col] = num;
        this.renderGrid();
        this.selectCell(this.selectedCell);

        // 如果棋盘填满，检查是否胜利
        if (this.isGridFull()) {
            this.checkVictory();
        }
    }

    /**
     * 检查棋盘是否已填满
     * @returns {boolean} 是否填满
     */
    isGridFull() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 检查是否胜利
     * 如果解答正确，显示胜利弹窗
     */
    checkVictory() {
        if (this.isValidSolution()) {
            this.showVictoryModal();
        }
    }

    /**
     * 验证当前解答是否正确
     * 检查每行、每列、每个3x3宫格是否都包含1-9且不重复
     * @returns {boolean} 解答是否正确
     */
    isValidSolution() {
        // 检查每一行
        for (let row = 0; row < 9; row++) {
            const rowSet = new Set();
            for (let col = 0; col < 9; col++) {
                const num = this.grid[row][col];
                if (num === 0 || rowSet.has(num)) return false;
                rowSet.add(num);
            }
        }

        // 检查每一列
        for (let col = 0; col < 9; col++) {
            const colSet = new Set();
            for (let row = 0; row < 9; row++) {
                const num = this.grid[row][col];
                if (num === 0 || colSet.has(num)) return false;
                colSet.add(num);
            }
        }

        // 检查每个3x3宫格
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const boxSet = new Set();
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const num = this.grid[boxRow * 3 + i][boxCol * 3 + j];
                        if (num === 0 || boxSet.has(num)) return false;
                        boxSet.add(num);
                    }
                }
            }
        }

        // 所有检查通过，解答正确
        return true;
    }

    /**
     * 检查当前填写的答案
     * 错误的格子会被标红显示
     */
    checkSolution() {
        const cells = document.querySelectorAll('.cell');
        let hasError = false;

        // 遍历所有格子，检查是否与解答一致
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.grid[row][col];

            // 清除之前的错误标记
            cell.classList.remove('error');

            // 如果填写的数字不为0且与解答不符，标记为错误
            if (value !== 0 && value !== this.solution[row][col]) {
                cell.classList.add('error');
                hasError = true;
            }
        });

        // 显示检查结果
        if (hasError) {
            this.showMessage('发现错误，请检查标红的格子', 'error');
        } else {
            this.showMessage('目前没有错误，继续加油！', 'success');
        }

        // 3秒后清除错误标记
        setTimeout(() => {
            cells.forEach(cell => cell.classList.remove('error'));
        }, 3000);
    }

    /**
     * 提供提示
     * 自动填入一个空格的正确答案
     */
    giveHint() {
        const emptyCells = [];
        
        // 收集所有空格和填写错误的格子
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0 || 
                    this.grid[row][col] !== this.solution[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }

        // 如果没有空格，提示已完成
        if (emptyCells.length === 0) {
            this.showMessage('已经完成啦！', 'success');
            return;
        }

        // 随机选择一个空格填入正确答案
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomCell;
        
        this.grid[row][col] = this.solution[row][col];
        this.renderGrid();
        
        // 选中填入提示的格子
        const index = row * 9 + col;
        this.selectCell(index);
        
        // 显示提示信息
        this.showMessage(`提示: 第${row + 1}行第${col + 1}列是 ${this.solution[row][col]}`, 'info');

        // 如果填满，检查是否胜利
        if (this.isGridFull()) {
            this.checkVictory();
        }
    }

    /**
     * 显示胜利弹窗
     */
    showVictoryModal() {
        document.getElementById('completed-level').textContent = this.currentLevel;
        document.getElementById('victory-modal').classList.remove('hidden');
    }

    /**
     * 隐藏胜利弹窗
     */
    hideVictoryModal() {
        document.getElementById('victory-modal').classList.add('hidden');
    }

    /**
     * 显示消息提示
     * @param {string} text - 消息内容
     * @param {string} type - 消息类型（success/error/info）
     */
    showMessage(text, type = '') {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = 'message';
        if (type) {
            messageEl.classList.add(type);
        }
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
