// 游戏常量
const CELL_TYPES = {
    EMPTY: 0,
    WALL: 1,
    BOX: 2,
    TARGET: 3,
    PLAYER: 4,
    BOX_ON_TARGET: 5,
    PLAYER_ON_TARGET: 6
};

// 方向常量
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// 关卡设计 - 难度递增
const LEVELS = [
    // 关卡 1 - 简单入门
    {
        name: "入门",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 4, 0, 2, 0, 3, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 2 - 基础
    {
        name: "基础",
        map: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 4, 2, 0, 3, 1],
            [1, 0, 0, 2, 0, 3, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 3 - 进阶
    {
        name: "进阶",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 4, 0, 0, 2, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 3, 1],
            [1, 0, 0, 0, 3, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 4 - 挑战
    {
        name: "挑战",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 4, 0, 2, 0, 0, 3, 1],
            [1, 0, 0, 1, 1, 1, 2, 3, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 5 - 困难
    {
        name: "困难",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 4, 0, 0, 0, 0, 2, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 0, 0, 3, 1],
            [1, 0, 0, 0, 2, 0, 0, 3, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 3, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 6 - 大师
    {
        name: "大师",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 4, 0, 0, 0, 0, 2, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 0, 0, 2, 3, 1],
            [1, 0, 0, 0, 2, 0, 0, 3, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 7 - 专家
    {
        name: "专家",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 0, 0, 0, 2, 3, 1],
            [1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 0, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    // 关卡 8 - 终极挑战
    {
        name: "终极挑战",
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 3, 1],
            [1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 3, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 0, 3, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    }
];

// 游戏状态
class GameState {
    constructor() {
        this.currentLevel = 0;
        this.steps = 0;
        this.score = 0;
        this.totalScore = 0;
        this.history = [];
        this.map = [];
        this.playerPos = { x: 0, y: 0 };
        this.targets = [];
        this.boxCount = 0;
        this.completedBoxes = 0;
        this.isGameOver = false;
    }
}

// 游戏主类
class SokobanGame {
    constructor() {
        this.state = new GameState();
        this.init();
    }

    init() {
        this.loadLevel(this.state.currentLevel);
        this.bindEvents();
        this.render();
    }

    // 加载关卡
    loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= LEVELS.length) {
            return false;
        }

        this.state.currentLevel = levelIndex;
        this.state.steps = 0;
        this.state.score = 0;
        this.state.history = [];
        this.state.isGameOver = false;
        this.state.targets = [];
        this.state.boxCount = 0;
        this.state.completedBoxes = 0;

        const level = LEVELS[levelIndex];
        // 深拷贝地图
        this.state.map = level.map.map(row => [...row]);

        // 找到玩家位置和目标位置
        for (let y = 0; y < this.state.map.length; y++) {
            for (let x = 0; x < this.state.map[y].length; x++) {
                const cell = this.state.map[y][x];
                if (cell === CELL_TYPES.PLAYER || cell === CELL_TYPES.PLAYER_ON_TARGET) {
                    this.state.playerPos = { x, y };
                }
                if (cell === CELL_TYPES.TARGET || cell === CELL_TYPES.BOX_ON_TARGET || cell === CELL_TYPES.PLAYER_ON_TARGET) {
                    this.state.targets.push({ x, y });
                }
                if (cell === CELL_TYPES.BOX || cell === CELL_TYPES.BOX_ON_TARGET) {
                    this.state.boxCount++;
                }
            }
        }

        this.updateUI();
        return true;
    }

    // 绑定事件
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (this.state.isGameOver) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.move(DIRECTIONS.UP);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.move(DIRECTIONS.DOWN);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.move(DIRECTIONS.LEFT);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.move(DIRECTIONS.RIGHT);
                    break;
            }
        });

        // 按钮控制
        document.getElementById('btn-restart').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('btn-undo').addEventListener('click', () => {
            this.undo();
        });

        document.getElementById('btn-prev').addEventListener('click', () => {
            this.prevLevel();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            this.nextLevel();
        });

        document.getElementById('btn-modal-restart').addEventListener('click', () => {
            this.hideModal();
            this.restart();
        });

        document.getElementById('btn-modal-next').addEventListener('click', () => {
            this.hideModal();
            this.nextLevel();
        });
    }

    // 移动逻辑
    move(direction) {
        const { x, y } = this.state.playerPos;
        const newX = x + direction.x;
        const newY = y + direction.y;

        // 检查边界
        if (!this.isValidPosition(newX, newY)) {
            return false;
        }

        const targetCell = this.state.map[newY][newX];

        // 保存当前状态用于撤销
        this.saveState();

        // 检查是否可以移动
        if (targetCell === CELL_TYPES.EMPTY || targetCell === CELL_TYPES.TARGET) {
            // 普通移动
            this.movePlayer(x, y, newX, newY);
            this.state.steps++;
        } else if (targetCell === CELL_TYPES.BOX || targetCell === CELL_TYPES.BOX_ON_TARGET) {
            // 尝试推箱子
            const boxNewX = newX + direction.x;
            const boxNewY = newY + direction.y;

            // 检查箱子能否移动
            if (!this.isValidPosition(boxNewX, boxNewY)) {
                this.state.history.pop(); // 移除保存的状态
                return false;
            }

            const boxTargetCell = this.state.map[boxNewY][boxNewX];
            if (boxTargetCell === CELL_TYPES.EMPTY || boxTargetCell === CELL_TYPES.TARGET) {
                // 可以推箱子
                this.moveBox(newX, newY, boxNewX, boxNewY);
                this.movePlayer(x, y, newX, newY);
                this.state.steps++;
            } else {
                this.state.history.pop(); // 移除保存的状态
                return false;
            }
        } else {
            this.state.history.pop(); // 移除保存的状态
            return false;
        }

        this.calculateScore();
        this.checkWin();
        this.render();
        this.updateUI();
        return true;
    }

    // 检查位置是否有效
    isValidPosition(x, y) {
        return y >= 0 && y < this.state.map.length && 
               x >= 0 && x < this.state.map[0].length;
    }

    // 移动玩家
    movePlayer(fromX, fromY, toX, toY) {
        const fromCell = this.state.map[fromY][fromX];
        const toCell = this.state.map[toY][toX];

        // 更新原位置
        this.state.map[fromY][fromX] = (fromCell === CELL_TYPES.PLAYER_ON_TARGET) ? 
            CELL_TYPES.TARGET : CELL_TYPES.EMPTY;

        // 更新新位置
        this.state.map[toY][toX] = (toCell === CELL_TYPES.TARGET) ? 
            CELL_TYPES.PLAYER_ON_TARGET : CELL_TYPES.PLAYER;

        this.state.playerPos = { x: toX, y: toY };
    }

    // 移动箱子
    moveBox(fromX, fromY, toX, toY) {
        const fromCell = this.state.map[fromY][fromX];
        const toCell = this.state.map[toY][toX];

        // 更新原位置
        this.state.map[fromY][fromX] = (fromCell === CELL_TYPES.BOX_ON_TARGET) ? 
            CELL_TYPES.TARGET : CELL_TYPES.EMPTY;

        // 更新新位置
        this.state.map[toY][toX] = (toCell === CELL_TYPES.TARGET) ? 
            CELL_TYPES.BOX_ON_TARGET : CELL_TYPES.BOX;
    }

    // 保存状态用于撤销
    saveState() {
        const stateCopy = {
            map: this.state.map.map(row => [...row]),
            playerPos: { ...this.state.playerPos },
            steps: this.state.steps,
            completedBoxes: this.state.completedBoxes
        };
        this.state.history.push(stateCopy);

        // 限制历史记录长度
        if (this.state.history.length > 100) {
            this.state.history.shift();
        }
    }

    // 撤销操作
    undo() {
        if (this.state.history.length === 0 || this.state.isGameOver) {
            return false;
        }

        const previousState = this.state.history.pop();
        this.state.map = previousState.map;
        this.state.playerPos = previousState.playerPos;
        this.state.steps = previousState.steps;
        this.state.completedBoxes = previousState.completedBoxes;

        this.calculateScore();
        this.render();
        this.updateUI();
        return true;
    }

    // 计算分数
    calculateScore() {
        // 计算已完成的箱子数
        this.state.completedBoxes = 0;
        for (const target of this.state.targets) {
            if (this.state.map[target.y][target.x] === CELL_TYPES.BOX_ON_TARGET) {
                this.state.completedBoxes++;
            }
        }

        // 基础分数
        let baseScore = 1000;
        
        // 根据步数扣分（步数越少，分数越高）
        const stepPenalty = this.state.steps * 5;
        
        // 根据完成度加分
        const completionBonus = this.state.completedBoxes * 100;
        
        this.state.score = Math.max(0, baseScore - stepPenalty + completionBonus);
    }

    // 检查是否获胜
    checkWin() {
        const allBoxesOnTarget = this.state.targets.every(target => 
            this.state.map[target.y][target.x] === CELL_TYPES.BOX_ON_TARGET
        );

        if (allBoxesOnTarget) {
            this.state.isGameOver = true;
            this.state.totalScore += this.state.score;
            this.showWinModal();
        }
    }

    // 显示胜利弹窗
    showWinModal() {
        const modal = document.getElementById('modal');
        const title = document.getElementById('modal-title');
        const message = document.getElementById('modal-message');
        const stepsSpan = document.getElementById('modal-steps');
        const scoreSpan = document.getElementById('modal-score');
        const nextBtn = document.getElementById('btn-modal-next');

        if (this.state.currentLevel === LEVELS.length - 1) {
            title.textContent = '🎉 恭喜通关所有关卡!';
            message.textContent = `你完成了所有 ${LEVELS.length} 个关卡！`;
            nextBtn.style.display = 'none';
        } else {
            title.textContent = '🎉 恭喜通关!';
            message.textContent = `你完成了第 ${this.state.currentLevel + 1} 关: ${LEVELS[this.state.currentLevel].name}`;
            nextBtn.style.display = 'inline-block';
        }

        stepsSpan.textContent = this.state.steps;
        scoreSpan.textContent = this.state.score;

        modal.classList.remove('hidden');
    }

    // 隐藏弹窗
    hideModal() {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
    }

    // 重新开始当前关卡
    restart() {
        this.loadLevel(this.state.currentLevel);
        this.render();
    }

    // 上一关
    prevLevel() {
        if (this.state.currentLevel > 0) {
            this.loadLevel(this.state.currentLevel - 1);
            this.render();
        }
    }

    // 下一关
    nextLevel() {
        if (this.state.currentLevel < LEVELS.length - 1) {
            this.loadLevel(this.state.currentLevel + 1);
            this.render();
        }
    }

    // 渲染游戏画面
    render() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';

        // 设置网格大小
        const rows = this.state.map.length;
        const cols = this.state.map[0].length;
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';

                const cellType = this.state.map[y][x];

                switch (cellType) {
                    case CELL_TYPES.WALL:
                        cell.classList.add('cell-wall');
                        cell.textContent = '🧱';
                        break;
                    case CELL_TYPES.EMPTY:
                        cell.classList.add('cell-floor');
                        break;
                    case CELL_TYPES.BOX:
                        cell.classList.add('cell-box');
                        cell.textContent = '📦';
                        break;
                    case CELL_TYPES.TARGET:
                        cell.classList.add('cell-target');
                        break;
                    case CELL_TYPES.PLAYER:
                        cell.classList.add('cell-player');
                        cell.textContent = '😊';
                        break;
                    case CELL_TYPES.BOX_ON_TARGET:
                        cell.classList.add('cell-box-on-target');
                        cell.textContent = '✅';
                        break;
                    case CELL_TYPES.PLAYER_ON_TARGET:
                        cell.classList.add('cell-player');
                        cell.textContent = '😊';
                        break;
                }

                board.appendChild(cell);
            }
        }
    }

    // 更新UI显示
    updateUI() {
        document.getElementById('level').textContent = `${this.state.currentLevel + 1} / ${LEVELS.length}`;
        document.getElementById('steps').textContent = this.state.steps;
        document.getElementById('score').textContent = this.state.score;
        document.getElementById('boxes').textContent = `${this.state.completedBoxes} / ${this.state.boxCount}`;

        // 更新按钮状态
        document.getElementById('btn-prev').disabled = this.state.currentLevel === 0;
        document.getElementById('btn-next').disabled = this.state.currentLevel === LEVELS.length - 1;
        document.getElementById('btn-undo').disabled = this.state.history.length === 0;
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new SokobanGame();
});
