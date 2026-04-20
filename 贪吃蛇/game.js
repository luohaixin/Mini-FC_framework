/**
 * 贪吃蛇大作战游戏
 * 一个多人在线风格的贪吃蛇游戏，包含AI蛇、豆豆系统、碰撞检测等功能
 */

/**
 * 游戏主类 - 管理游戏状态、渲染和逻辑
 */
class SnakeGame {
    constructor() {
        // 获取画布和上下文
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 网格设置 - 每个格子10像素
        this.gridSize = 10;
        this.cols = this.width / this.gridSize;  // 100列
        this.rows = this.height / this.gridSize;  // 70行
        
        // 游戏对象
        this.playerSnake = null;    // 玩家控制的蛇
        this.aiSnakes = [];         // AI蛇数组
        this.foods = [];            // 豆豆数组
        this.particles = [];        // 粒子效果数组
        
        // 游戏状态
        this.isRunning = false;     // 游戏是否运行中
        this.isPaused = false;      // 游戏是否暂停
        this.gameLoop = null;       // 游戏循环定时器
        this.score = 0;             // 玩家得分
        
        // 豆豆颜色配置
        this.foodColors = {
            small: '#4ade80',  // 绿色小豆豆
            big: '#fbbf24'     // 金色大豆豆
        };
        
        // AI蛇可用颜色
        this.snakeColors = [
            '#3b82f6', '#ef4444', '#a855f7', '#f97316', 
            '#ec4899', '#06b6d4', '#84cc16', '#f59e0b'
        ];
        
        this.init();
    }
    
    /**
     * 初始化游戏 - 设置事件监听和重置游戏状态
     */
    init() {
        this.setupEventListeners();
        this.reset();
    }
    
    /**
     * 设置键盘事件监听 - 方向键和WASD控制
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning || this.isPaused) return;
            
            // 键盘映射表
            const keyMap = {
                'ArrowUp': { x: 0, y: -1 },
                'ArrowDown': { x: 0, y: 1 },
                'ArrowLeft': { x: -1, y: 0 },
                'ArrowRight': { x: 1, y: 0 },
                'w': { x: 0, y: -1 },
                's': { x: 0, y: 1 },
                'a': { x: -1, y: 0 },
                'd': { x: 1, y: 0 },
                'W': { x: 0, y: -1 },
                'S': { x: 0, y: 1 },
                'A': { x: -1, y: 0 },
                'D': { x: 1, y: 0 }
            };
            
            if (keyMap[e.key] && this.playerSnake) {
                e.preventDefault();
                this.playerSnake.setDirection(keyMap[e.key]);
            }
        });
    }
    
    /**
     * 重置游戏 - 创建玩家蛇、AI蛇和豆豆
     */
    reset() {
        // 创建玩家蛇，位于地图中央
        this.playerSnake = new Snake(
            Math.floor(this.cols / 2),
            Math.floor(this.rows / 2),
            '#3b82f6',  // 蓝色
            true        // 是玩家
        );
        
        // 创建5条AI蛇
        this.aiSnakes = [];
        for (let i = 0; i < 5; i++) {
            this.spawnAISnake();
        }
        
        // 创建300个豆豆
        this.foods = [];
        for (let i = 0; i < 300; i++) {
            this.spawnFood();
        }
        
        // 清空粒子效果
        this.particles = [];
        this.score = 0;
        this.updateUI();
    }
    
    /**
     * 生成AI蛇 - 在随机位置创建一条AI控制的蛇
     */
    spawnAISnake() {
        let x, y;
        let attempts = 0;
        // 尝试找到不与其他物体重叠的位置
        do {
            x = Math.floor(Math.random() * (this.cols - 20)) + 10;
            y = Math.floor(Math.random() * (this.rows - 20)) + 10;
            attempts++;
        } while (this.isPositionOccupied(x, y, 5) && attempts < 100);
        
        if (attempts < 100) {
            const color = this.snakeColors[Math.floor(Math.random() * this.snakeColors.length)];
            const snake = new Snake(x, y, color, false);  // false表示是AI
            this.aiSnakes.push(snake);
        }
    }
    
    /**
     * 生成豆豆 - 在随机位置创建小豆豆或大豆豆
     */
    spawnFood() {
        let x, y;
        let attempts = 0;
        do {
            x = Math.floor(Math.random() * this.cols);
            y = Math.floor(Math.random() * this.rows);
            attempts++;
        } while (this.isPositionOccupied(x, y, 0) && attempts < 1000);
        
        if (attempts < 1000) {
            // 40%概率生成大豆豆
            const isBig = Math.random() < 0.40;
            this.foods.push({
                x: x,
                y: y,
                type: isBig ? 'big' : 'small',
                value: isBig ? 3 : 1,      // 大豆豆价值3，小豆豆价值1
                size: isBig ? 1.5 : 1
            });
        }
    }
    
    /**
     * 检查位置是否被占用 - 用于生成新物体时避免重叠
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {number} radius - 检测半径
     * @returns {boolean} - 是否被占用
     */
    isPositionOccupied(x, y, radius) {
        // 检查是否与玩家蛇重叠
        if (this.playerSnake && this.playerSnake.contains(x, y, radius)) return true;
        
        // 检查是否与AI蛇重叠
        for (let snake of this.aiSnakes) {
            if (snake.contains(x, y, radius)) return true;
        }
        
        // 检查是否与豆豆重叠
        for (let food of this.foods) {
            const dist = Math.sqrt((x - food.x) ** 2 + (y - food.y) ** 2);
            if (dist < radius + food.size) return true;
        }
        
        return false;
    }
    
    /**
     * 开始游戏 - 启动游戏循环
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;
        // 60 FPS的游戏循环，更流畅
        this.gameLoop = setInterval(() => this.update(), 1000 / 60);
    }
    
    /**
     * 暂停/继续游戏
     */
    pause() {
        this.isPaused = !this.isPaused;
    }
    
    /**
     * 重新开始游戏
     */
    restart() {
        this.stop();
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameWin').style.display = 'none';
        this.reset();
        this.start();
    }
    
    /**
     * 停止游戏 - 清除游戏循环
     */
    stop() {
        this.isRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    /**
     * 游戏更新 - 每帧调用，处理所有游戏逻辑
     */
    update() {
        if (this.isPaused) return;

        // 更新玩家蛇
        this.playerSnake.update();

        // 更新AI蛇
        for (let snake of this.aiSnakes) {
            snake.aiUpdate(this.foods, this.playerSnake, this.aiSnakes, this.cols, this.rows);
        }

        // 检测碰撞
        this.checkCollisions();

        // 检测吃豆豆（吃掉的豆豆会立即在随机位置生成新的）
        this.checkFoodConsumption();

        // 更新粒子效果
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // 更新UI和渲染
        this.updateUI();
        this.draw();
    }
    
    /**
     * 碰撞检测 - 检测蛇与墙壁、蛇与蛇之间的碰撞
     */
    checkCollisions() {
        const allSnakes = [this.playerSnake, ...this.aiSnakes];
        
        for (let i = 0; i < allSnakes.length; i++) {
            const snake1 = allSnakes[i];
            if (!snake1 || snake1.dead) continue;
            
            const head1 = snake1.body[0];
            
            // 检测撞墙
            if (head1.x < 0 || head1.x >= this.cols || head1.y < 0 || head1.y >= this.rows) {
                this.snakeDied(snake1);
                continue;
            }
            
            // 检测蛇与其他蛇之间的碰撞（跳过自己）
            for (let j = 0; j < allSnakes.length; j++) {
                // 跳过自己，允许触碰自己的身体
                if (i === j) continue;
                
                const snake2 = allSnakes[j];
                if (!snake2 || snake2.dead) continue;
                
                for (let k = 0; k < snake2.body.length; k++) {
                    const segment = snake2.body[k];
                    const dist = Math.sqrt((head1.x - segment.x) ** 2 + (head1.y - segment.y) ** 2);
                    // 碰撞检测距离阈值
                    const minDist = (snake1.radius + snake2.radius) * 0.5 / this.gridSize;
                    
                    if (dist < minDist) {
                        this.snakeDied(snake1);
                        break;
                    }
                }
                if (snake1.dead) break;
            }
        }
        
        // 移除死亡的AI蛇（不再补充新AI蛇，每条蛇只有一次机会）
        this.aiSnakes = this.aiSnakes.filter(s => !s.dead);
        
        // 玩家死亡则游戏结束
        if (this.playerSnake.dead) {
            this.gameOver();
            return;
        }
        
        // 检测胜利条件：所有AI蛇都死亡，玩家获胜
        if (this.aiSnakes.length === 0 && this.isRunning) {
            this.gameWin();
        }
    }
    
    /**
     * 吃豆豆检测 - 检测蛇是否吃到豆豆并处理增长逻辑
     */
    checkFoodConsumption() {
        const allSnakes = [this.playerSnake, ...this.aiSnakes];

        for (let snake of allSnakes) {
            if (snake.dead) continue;

            const head = snake.body[0];

            for (let i = this.foods.length - 1; i >= 0; i--) {
                const food = this.foods[i];
                const dist = Math.sqrt((head.x - food.x) ** 2 + (head.y - food.y) ** 2);
                // 吃豆豆的检测距离
                const minDist = (snake.radius / this.gridSize) + food.size * 0.5;

                if (dist < minDist) {
                    // 蛇增长
                    snake.grow(food.value);
                    // 玩家得分
                    if (snake.isPlayer) {
                        this.score += food.value * 10;
                    }
                    // 移除被吃的豆豆
                    this.foods.splice(i, 1);
                    // 立即在随机位置生成新豆豆，保持豆豆总数不变
                    this.spawnFood();
                }
            }
        }
    }
    
    /**
     * 蛇死亡处理 - 生成粒子和豆豆
     * @param {Snake} snake - 死亡的蛇
     */
    snakeDied(snake) {
        snake.dead = true;
        
        // 为每个身体段生成粒子效果
        for (let segment of snake.body) {
            for (let i = 0; i < 3; i++) {
                this.particles.push(new Particle(
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    snake.color
                ));
            }
            
            // 70%概率生成豆豆
            if (Math.random() < 0.7) {
                this.foods.push({
                    x: segment.x + (Math.random() - 0.5) * 2,
                    y: segment.y + (Math.random() - 0.5) * 2,
                    type: 'small',
                    value: 1,
                    size: 0.8
                });
            }
        }
    }
    
    /**
     * 游戏结束处理
     */
    gameOver() {
        this.stop();
        document.getElementById('finalLength').textContent = this.playerSnake.body.length;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    /**
     * 游戏胜利处理
     */
    gameWin() {
        this.stop();
        document.getElementById('winLength').textContent = this.playerSnake.body.length;
        document.getElementById('winScore').textContent = this.score;
        document.getElementById('gameWin').style.display = 'block';
    }

    /**
     * 更新UI显示 - 长度、得分、剩余敌人
     */
    updateUI() {
        document.getElementById('length').textContent = this.playerSnake.body.length;
        document.getElementById('score').textContent = this.score;

        // 显示剩余敌人数量
        document.getElementById('enemies').textContent = this.aiSnakes.length;
    }
    
    /**
     * 渲染游戏画面
     */
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制豆豆
        for (let food of this.foods) {
            this.drawFood(food);
        }
        
        // 绘制AI蛇
        for (let snake of this.aiSnakes) {
            if (!snake.dead) snake.draw(this.ctx, this.gridSize);
        }
        
        // 绘制玩家蛇（带高亮效果）
        if (!this.playerSnake.dead) {
            this.drawPlayerHighlight();
            this.playerSnake.draw(this.ctx, this.gridSize);
        }
        
        // 绘制粒子效果
        for (let particle of this.particles) {
            particle.draw(this.ctx);
        }
    }
    
    /**
     * 绘制玩家蛇的高亮效果 - 光环和指示器
     */
    drawPlayerHighlight() {
        const head = this.playerSnake.body[0];
        const x = head.x * this.gridSize;
        const y = head.y * this.gridSize;
        const radius = this.playerSnake.radius * 2;
        
        // 蓝色渐变光环
        const gradient = this.ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 虚线圆圈指示器
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    /**
     * 绘制背景网格
     */
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x <= this.width; x += this.gridSize * 5) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y <= this.height; y += this.gridSize * 5) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * 绘制豆豆
     * @param {Object} food - 豆豆对象
     */
    drawFood(food) {
        const x = food.x * this.gridSize;
        const y = food.y * this.gridSize;
        const size = food.size * this.gridSize * 0.8;
        
        const color = food.type === 'big' ? this.foodColors.big : this.foodColors.small;
        
        // 发光效果
        this.ctx.fillStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // 高光效果
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.beginPath();
        this.ctx.arc(x - size/4, y - size/4, size/6, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

/**
 * 蛇类 - 表示玩家或AI控制的蛇
 */
class Snake {
    /**
     * @param {number} x - 初始x坐标
     * @param {number} y - 初始y坐标
     * @param {string} color - 蛇的颜色
     * @param {boolean} isPlayer - 是否是玩家控制的蛇
     */
    constructor(x, y, color, isPlayer) {
        this.body = [];           // 蛇身体段数组
        this.radius = 5;          // 蛇的半径
        const segments = 5;       // 初始长度
        
        // 初始化身体，水平排列
        for (let i = 0; i < segments; i++) {
            this.body.push({ x: x - i, y: y });
        }
        
        this.direction = { x: 1, y: 0 };      // 当前移动方向
        this.nextDirection = { x: 1, y: 0 };  // 下一帧移动方向
        this.color = color;
        this.isPlayer = isPlayer;
        this.dead = false;
        this.speed = 1;           // 移动速度
        this.moveCounter = 0;     // 移动计数器，用于控制速度
    }
    
    /**
     * 设置移动方向 - 防止180度转向
     * @param {Object} dir - 方向对象 {x, y}
     */
    setDirection(dir) {
        // 防止反向移动
        if (this.direction.x !== -dir.x || this.direction.y !== -dir.y) {
            this.nextDirection = dir;
        }
    }
    
    /**
     * 更新蛇的位置 - 玩家蛇使用
     */
    update() {
        this.moveCounter++;
        // 根据速度控制移动频率（基于60fps）
        // 速度1 = 每8帧移动一次（约7.5格/秒）
        // 速度2 = 每4帧移动一次（约15格/秒）
        const moveInterval = Math.max(2, Math.floor(8 / this.speed));
        if (this.moveCounter < moveInterval) return;
        this.moveCounter = 0;
        
        this.direction = this.nextDirection;
        
        // 计算新头部位置
        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        // 移动身体
        this.body.unshift(newHead);  // 添加新头部
        this.body.pop();             // 移除尾部
    }
    
    /**
     * AI更新 - AI蛇使用，包含寻路逻辑
     * @param {Array} foods - 豆豆数组
     * @param {Snake} playerSnake - 玩家蛇
     * @param {Array} aiSnakes - AI蛇数组
     * @param {number} cols - 地图列数
     * @param {number} rows - 地图行数
     */
    aiUpdate(foods, playerSnake, aiSnakes, cols, rows) {
        this.moveCounter++;
        // 根据速度控制移动频率（基于60fps）
        const moveInterval = Math.max(2, Math.floor(8 / this.speed));
        if (this.moveCounter < moveInterval) return;
        this.moveCounter = 0;
        
        const head = this.body[0];
        
        // 寻找最近的豆豆作为目标
        let target = this.findNearestFood(foods);
        
        // 如果蛇较长，尝试追击较短的蛇
        if (!target || Math.random() < 0.1) {
            const allSnakes = [playerSnake, ...aiSnakes].filter(s => s !== this && !s.dead);
            if (allSnakes.length > 0 && this.body.length > 10) {
                const nearestSnake = allSnakes.reduce((nearest, snake) => {
                    const dist = Math.sqrt((head.x - snake.body[0].x) ** 2 + (head.y - snake.body[0].y) ** 2);
                    return dist < nearest.dist ? { snake, dist } : nearest;
                }, { snake: null, dist: Infinity }).snake;
                
                if (nearestSnake && nearestSnake.body.length < this.body.length) {
                    target = { x: nearestSnake.body[0].x, y: nearestSnake.body[0].y };
                }
            }
        }
        
        // 默认向地图中心移动
        if (!target) {
            target = { x: cols / 2, y: rows / 2 };
        }
        
        // 寻找最佳移动方向
        const bestDir = this.findBestDirection(target, cols, rows, [...aiSnakes, playerSnake].filter(s => s !== this));
        if (bestDir) {
            this.setDirection(bestDir);
        }
        
        this.direction = this.nextDirection;
        
        // 移动
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        this.body.unshift(newHead);
        this.body.pop();
    }
    
    /**
     * 寻找最近的豆豆
     * @param {Array} foods - 豆豆数组
     * @returns {Object} - 最近的豆豆
     */
    findNearestFood(foods) {
        if (foods.length === 0) return null;
        
        const head = this.body[0];
        let nearest = null;
        let minDist = Infinity;
        
        for (let food of foods) {
            const dist = Math.sqrt((head.x - food.x) ** 2 + (head.y - food.y) ** 2);
            if (dist < minDist) {
                minDist = dist;
                nearest = food;
            }
        }
        
        return nearest;
    }
    
    /**
     * 寻找最佳移动方向 - 避开障碍物并朝向目标
     * @param {Object} target - 目标位置
     * @param {number} cols - 地图列数
     * @param {number} rows - 地图行数
     * @param {Array} otherSnakes - 其他蛇数组
     * @returns {Object} - 最佳方向
     */
    findBestDirection(target, cols, rows, otherSnakes) {
        const head = this.body[0];
        const directions = [
            { x: 0, y: -1 },  // 上
            { x: 0, y: 1 },   // 下
            { x: -1, y: 0 },  // 左
            { x: 1, y: 0 }    // 右
        ];
        
        let bestDir = null;
        let bestScore = -Infinity;
        
        for (let dir of directions) {
            // 不能反向移动
            if (dir.x === -this.direction.x && dir.y === -this.direction.y) continue;
            
            const newX = head.x + dir.x;
            const newY = head.y + dir.y;
            
            // 不能撞墙
            if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) continue;
            
            // 检查是否安全（不撞其他蛇）
            let isSafe = true;
            for (let snake of otherSnakes) {
                if (snake.dead) continue;
                for (let segment of snake.body) {
                    const dist = Math.sqrt((newX - segment.x) ** 2 + (newY - segment.y) ** 2);
                    if (dist < (this.radius + snake.radius) / 10) {
                        isSafe = false;
                        break;
                    }
                }
                if (!isSafe) break;
            }
            
            if (!isSafe) continue;
            
            // 计算得分（距离目标越近越好）
            const distToTarget = Math.sqrt((newX - target.x) ** 2 + (newY - target.y) ** 2);
            const score = 1000 - distToTarget;
            
            if (score > bestScore) {
                bestScore = score;
                bestDir = dir;
            }
        }
        
        return bestDir;
    }
    
    /**
     * 蛇增长 - 吃豆豆后调用
     * @param {number} amount - 增长的长度
     */
    grow(amount) {
        const tail = this.body[this.body.length - 1];
        // 在尾部添加新的身体段
        for (let i = 0; i < amount; i++) {
            this.body.push({ x: tail.x, y: tail.y });
        }
        
        // 更新半径和速度
        this.radius = 5 + Math.sqrt(this.body.length) * 0.8;
        this.speed = Math.min(2, 1 + this.body.length / 50);
    }
    
    /**
     * 检查点是否在蛇身体内
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {number} radius - 检测半径
     * @returns {boolean}
     */
    contains(x, y, radius) {
        for (let segment of this.body) {
            const dist = Math.sqrt((x - segment.x) ** 2 + (y - segment.y) ** 2);
            if (dist < radius + this.radius / 10) return true;
        }
        return false;
    }
    
    /**
     * 绘制蛇
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} gridSize - 网格大小
     */
    draw(ctx, gridSize) {
        for (let i = this.body.length - 1; i >= 0; i--) {
            const segment = this.body[i];
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;
            
            // 计算大小（头部稍大）
            let size = this.radius;
            if (i === 0) {
                size *= 1.3;  // 头部放大1.3倍
            } else if (i < 5) {
                size *= (1 + (5 - i) * 0.05);
            }
            
            // 玩家蛇发光效果
            if (this.isPlayer) {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
            }
            
            // 绘制身体段（径向渐变）
            const gradient = ctx.createRadialGradient(
                x - size/3, y - size/3, 0,
                x, y, size
            );
            gradient.addColorStop(0, this.lightenColor(this.color, 40));
            gradient.addColorStop(1, this.color);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 玩家蛇白色边框
            if (this.isPlayer) {
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // 绘制眼睛（仅头部）
            if (i === 0) {
                ctx.fillStyle = 'white';
                const eyeOffset = this.direction.x * 3 + this.direction.y * 0;
                const eyeOffset2 = this.direction.x * 0 + this.direction.y * 3;
                
                ctx.beginPath();
                ctx.arc(x + eyeOffset - eyeOffset2, y + eyeOffset2 + eyeOffset, 2, 0, Math.PI * 2);
                ctx.arc(x + eyeOffset + eyeOffset2, y - eyeOffset2 + eyeOffset, 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(x + eyeOffset - eyeOffset2, y + eyeOffset2 + eyeOffset, 1, 0, Math.PI * 2);
                ctx.arc(x + eyeOffset + eyeOffset2, y - eyeOffset2 + eyeOffset, 1, 0, Math.PI * 2);
                ctx.fill();
                
                // 玩家标识
                if (this.isPlayer) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('YOU', x, y - size - 5);
                }
            }
            
            // 黑色描边
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    /**
     * 颜色变亮 - 用于创建渐变效果
     * @param {string} color - 十六进制颜色
     * @param {number} percent - 变亮百分比
     * @returns {string} - 变亮后的颜色
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
}

/**
 * 粒子类 - 用于死亡爆炸效果
 */
class Particle {
    /**
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {string} color - 粒子颜色
     */
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;  // x方向速度
        this.vy = (Math.random() - 0.5) * 4;  // y方向速度
        this.life = 1;                        // 生命值（透明度）
        this.decay = 0.02 + Math.random() * 0.03;  // 衰减速度
        this.color = color;
        this.size = 3 + Math.random() * 4;    // 大小
    }
    
    /**
     * 更新粒子状态
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;  // 摩擦力
        this.vy *= 0.98;
        this.life -= this.decay;
        this.size *= 0.97;  // 缩小
    }
    
    /**
     * 绘制粒子
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 创建游戏实例
const game = new SnakeGame();
