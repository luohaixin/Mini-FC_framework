// 游戏配置
const GAME_CONFIG = {
    width: 800,
    height: 600,
    playerSpeed: 0.15,
    playerFireRate: 150,
    enemySpawnRate: 1500,
    powerUpSpawnRate: 8000,
    healthPackSpawnRate: 12000,
    maxWeaponLevel: 5,
    monstersToBoss: 30,
    maxLevels: 5
};

// 武器类型
const WEAPON_TYPES = {
    NORMAL: 'normal',
    LASER: 'laser'
};

// 道具类型
const POWERUP_TYPES = {
    MULTI_SHOT: 'multiShot',
    LASER: 'laser',
    HEALTH_PACK: 'healthPack'
};

// 游戏状态
const GAME_STATE = {
    MENU: 'menu',
    LEVEL_SELECT: 'levelSelect',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    LEVEL_COMPLETE: 'levelComplete'
};

// 基础精灵类
class Sprite {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.active = true;
    }

    update(deltaTime) {
        // deltaTime 是毫秒，转换为秒
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }

    getBounds() {
        return {
            left: this.x - this.width/2,
            right: this.x + this.width/2,
            top: this.y - this.height/2,
            bottom: this.y + this.height/2
        };
    }

    collidesWith(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        return bounds1.left < bounds2.right &&
               bounds1.right > bounds2.left &&
               bounds1.top < bounds2.bottom &&
               bounds1.bottom > bounds2.top;
    }

    isOffScreen() {
        return this.x < -50 || this.x > GAME_CONFIG.width + 50 ||
               this.y < -50 || this.y > GAME_CONFIG.height + 50;
    }
}

// 粒子效果类
class Particle extends Sprite {
    constructor(x, y, color, speed, life) {
        super(x, y, 3, 3, color);
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = life;
        this.maxLife = life;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.life -= deltaTime;
        if (this.life <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 子弹类
class Bullet extends Sprite {
    constructor(x, y, vx, vy, isPlayer, damage = 1) {
        super(x, y, 6, 12, isPlayer ? '#00ff00' : '#ff4444');
        this.vx = vx;
        this.vy = vy;
        this.isPlayer = isPlayer;
        this.damage = damage;
    }

    update(deltaTime) {
        // 子弹使用像素/秒的速度
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// 激光类
class Laser extends Sprite {
    constructor(x, y, width, isPlayer, damage = 1) {
        super(x, y, width, GAME_CONFIG.height, isPlayer ? '#00ff88' : '#ff0088');
        this.isPlayer = isPlayer;
        this.damage = damage;
        this.duration = 100;
        this.timer = 0;
    }

    update(deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= this.duration) {
            this.active = false;
        }
    }

    draw(ctx) {
        const alpha = 1 - (this.timer / this.duration);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        // 激光从飞机前端(y位置)向上发射
        if (this.isPlayer) {
            ctx.fillRect(this.x - this.width/2, 0, this.width, this.y);
        } else {
            ctx.fillRect(this.x - this.width/2, this.y, this.width, GAME_CONFIG.height - this.y);
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// 玩家类
class Player extends Sprite {
    constructor() {
        super(GAME_CONFIG.width/2, GAME_CONFIG.height - 80, 40, 50, '#00d4ff');
        this.targetX = this.x;
        this.targetY = this.y;
        this.speed = GAME_CONFIG.playerSpeed;
        this.fireTimer = 0;
        this.fireRate = GAME_CONFIG.playerFireRate;
        this.weaponType = WEAPON_TYPES.NORMAL;
        this.weaponLevel = 1;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.invincible = false;
        this.invincibleTime = 0;
    }

    update(deltaTime, mouseX, mouseY) {
        // 平滑跟随鼠标
        this.targetX = mouseX;
        this.targetY = mouseY;
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // 限制在屏幕内
        this.x = Math.max(20, Math.min(GAME_CONFIG.width - 20, this.x));
        this.y = Math.max(20, Math.min(GAME_CONFIG.height - 20, this.y));

        // 发射计时器
        this.fireTimer += deltaTime;

        // 无敌时间
        if (this.invincible) {
            this.invincibleTime -= deltaTime;
            if (this.invincibleTime <= 0) {
                this.invincible = false;
            }
        }
    }

    canFire() {
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            return true;
        }
        return false;
    }

    getBullets() {
        const bullets = [];
        const bulletSpeed = 600;

        if (this.weaponType === WEAPON_TYPES.NORMAL) {
            // 普通子弹，根据等级增加弹道
            const shotCount = this.weaponLevel;
            const spreadAngle = Math.PI / 8;
            
            for (let i = 0; i < shotCount; i++) {
                let angle = -Math.PI / 2;
                if (shotCount > 1) {
                    angle += spreadAngle * (i - (shotCount - 1) / 2);
                }
                const vx = Math.cos(angle) * bulletSpeed * 0.3;
                const vy = Math.sin(angle) * bulletSpeed;
                bullets.push(new Bullet(this.x, this.y - 20, vx, vy, true, this.weaponLevel));
            }
        } else if (this.weaponType === WEAPON_TYPES.LASER) {
            // 激光武器 - 从飞机前端发射
            const laserWidth = 20 + (this.weaponLevel - 1) * 15;
            bullets.push(new Laser(this.x, this.y - this.height/2, laserWidth, true, this.weaponLevel * 2));
        }

        return bullets;
    }

    upgradeWeapon(type) {
        if (type === POWERUP_TYPES.MULTI_SHOT) {
            if (this.weaponType === WEAPON_TYPES.NORMAL) {
                if (this.weaponLevel < GAME_CONFIG.maxWeaponLevel) {
                    this.weaponLevel++;
                }
            } else {
                this.weaponType = WEAPON_TYPES.NORMAL;
                this.weaponLevel = 2;
            }
        } else if (type === POWERUP_TYPES.LASER) {
            if (this.weaponType === WEAPON_TYPES.LASER) {
                if (this.weaponLevel < GAME_CONFIG.maxWeaponLevel) {
                    this.weaponLevel++;
                }
            } else {
                this.weaponType = WEAPON_TYPES.LASER;
                this.weaponLevel = 1;
            }
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    takeDamage(damage) {
        if (!this.invincible) {
            this.health -= damage;
            this.invincible = true;
            this.invincibleTime = 1000;
            return this.health <= 0;
        }
        return false;
    }

    getHealthPercent() {
        return this.health / this.maxHealth;
    }

    draw(ctx) {
        // 无敌时闪烁
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        ctx.save();
        
        // 绘制玩家血条
        const healthBarWidth = 50;
        const healthBarHeight = 6;
        const healthPercent = this.getHealthPercent();
        
        // 血条背景
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.height/2 - 15, healthBarWidth, healthBarHeight);
        
        // 血条前景
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.height/2 - 15, healthBarWidth * healthPercent, healthBarHeight);
        
        // 血条边框
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - healthBarWidth/2, this.y - this.height/2 - 15, healthBarWidth, healthBarHeight);
        
        // 飞机主体
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        // 机身
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.height/2);
        ctx.lineTo(this.x - this.width/2, this.y + this.height/2);
        ctx.lineTo(this.x, this.y + this.height/4);
        ctx.lineTo(this.x + this.width/2, this.y + this.height/2);
        ctx.closePath();
        ctx.fill();

        // 机翼
        ctx.fillStyle = '#0088aa';
        ctx.beginPath();
        ctx.moveTo(this.x - this.width/3, this.y);
        ctx.lineTo(this.x - this.width/2 - 10, this.y + this.height/3);
        ctx.lineTo(this.x - this.width/3, this.y + this.height/4);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + this.width/3, this.y);
        ctx.lineTo(this.x + this.width/2 + 10, this.y + this.height/3);
        ctx.lineTo(this.x + this.width/3, this.y + this.height/4);
        ctx.closePath();
        ctx.fill();

        // 引擎火焰
        const flameHeight = 15 + Math.random() * 10;
        ctx.fillStyle = '#ff6600';
        ctx.shadowColor = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + this.height/4);
        ctx.lineTo(this.x, this.y + this.height/4 + flameHeight);
        ctx.lineTo(this.x + 8, this.y + this.height/4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// 小怪物类
class Enemy extends Sprite {
    constructor(level) {
        const x = Math.random() * (GAME_CONFIG.width - 60) + 30;
        super(x, -30, 35, 35, '#ff4444');
        // 确保level是有效数字，默认为1
        const safeLevel = (typeof level === 'number' && !isNaN(level)) ? level : 1;
        // 速度改为像素/秒
        this.vy = 60 + safeLevel * 15;
        this.vx = (Math.random() - 0.5) * 30;
        this.health = 2 + Math.floor(safeLevel / 2);
        this.maxHealth = this.health;
        this.fireRate = 2000 - safeLevel * 100;
        this.fireTimer = Math.random() * this.fireRate;
        this.score = 10 + safeLevel * 5;
        this.level = safeLevel;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.fireTimer += deltaTime;

        // 左右摆动
        if (this.x < 30 || this.x > GAME_CONFIG.width - 30) {
            this.vx = -this.vx;
        }
    }

    canFire() {
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            return true;
        }
        return false;
    }

    getBullet() {
        return new Bullet(this.x, this.y + 20, 0, 200, false, 1);
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // 敌人身体
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height/2);
        ctx.lineTo(this.x - this.width/2, this.y - this.height/2);
        ctx.lineTo(this.x, this.y - this.height/4);
        ctx.lineTo(this.x + this.width/2, this.y - this.height/2);
        ctx.closePath();
        ctx.fill();

        // 眼睛
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(this.x - 8, this.y - 5, 4, 0, Math.PI * 2);
        ctx.arc(this.x + 8, this.y - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// BOSS类
class Boss extends Sprite {
    constructor(level) {
        super(GAME_CONFIG.width/2, 100, 120, 100, '#aa00ff');
        this.level = level;
        this.maxHealth = 200 + level * 100;
        this.health = this.maxHealth;
        this.vx = 60 + level * 10;
        this.phase = 0;
        this.phaseTimer = 0;
        this.attackTimer = 0;
        this.score = 500 + level * 200;
        this.name = this.getBossName();
    }

    getBossName() {
        const names = ['毁灭者', '暗影领主', '虚空吞噬者', '末日使者', '混沌之王'];
        return names[(this.level - 1) % names.length];
    }

    update(deltaTime) {
        // BOSS左右移动
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        if (this.x < 80 || this.x > GAME_CONFIG.width - 80) {
            this.vx = -this.vx;
        }

        this.phaseTimer += deltaTime;
        this.attackTimer += deltaTime;

        // 切换攻击模式
        if (this.phaseTimer > 5000) {
            this.phase = (this.phase + 1) % 3;
            this.phaseTimer = 0;
        }
    }

    getBullets() {
        const bullets = [];
        const baseSpeed = 200 + this.level * 20;

        if (this.phase === 0) {
            // 散射模式
            if (this.attackTimer > 800) {
                this.attackTimer = 0;
                const bulletCount = 8 + this.level;
                for (let i = 0; i < bulletCount; i++) {
                    const angle = (Math.PI / (bulletCount - 1)) * i;
                    const vx = Math.cos(angle) * baseSpeed * 0.5;
                    const vy = Math.sin(angle) * baseSpeed;
                    bullets.push(new Bullet(this.x, this.y + 40, vx, vy, false, 2));
                }
            }
        } else if (this.phase === 1) {
            // 追踪模式
            if (this.attackTimer > 600) {
                this.attackTimer = 0;
                bullets.push(new Bullet(this.x - 30, this.y + 40, 0, baseSpeed, false, 1));
                bullets.push(new Bullet(this.x + 30, this.y + 40, 0, baseSpeed, false, 1));
                bullets.push(new Bullet(this.x, this.y + 50, 0, baseSpeed * 1.2, false, 2));
            }
        } else {
            // 激光模式
            if (this.attackTimer > 2000) {
                this.attackTimer = 0;
                const laserWidth = 30 + this.level * 5;
                bullets.push(new Laser(this.x, this.y + 40, laserWidth, false, 3));
            }
        }

        return bullets;
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    getHealthPercent() {
        return this.health / this.maxHealth;
    }

    draw(ctx) {
        ctx.save();
        
        // BOSS身体
        const gradient = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.width/2);
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(0.5, '#aa00ff');
        gradient.addColorStop(1, '#440088');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff00ff';

        // 主体
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 装饰环
        ctx.strokeStyle = '#ff88ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width/3, this.height/3, Date.now() / 1000, 0, Math.PI * 2);
        ctx.stroke();

        // 核心
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // 武器
        ctx.fillStyle = '#ff4444';
        ctx.shadowColor = '#ff4444';
        ctx.fillRect(this.x - 40, this.y + 20, 20, 30);
        ctx.fillRect(this.x + 20, this.y + 20, 20, 30);

        ctx.restore();
    }
}

// 道具类
class PowerUp extends Sprite {
    constructor(type = null) {
        const x = Math.random() * (GAME_CONFIG.width - 60) + 30;
        super(x, -30, 30, 30, '#ffff00');
        this.vy = 80;
        
        // 随机选择道具类型
        if (type) {
            this.type = type;
        } else {
            const rand = Math.random();
            if (rand < 0.4) {
                this.type = POWERUP_TYPES.MULTI_SHOT;
            } else if (rand < 0.7) {
                this.type = POWERUP_TYPES.LASER;
            } else {
                this.type = POWERUP_TYPES.HEALTH_PACK;
            }
        }
        
        this.rotation = 0;
        
        // 根据类型设置颜色
        if (this.type === POWERUP_TYPES.MULTI_SHOT) {
            this.color = '#00ff00';
        } else if (this.type === POWERUP_TYPES.LASER) {
            this.color = '#ff00ff';
        } else if (this.type === POWERUP_TYPES.HEALTH_PACK) {
            this.color = '#ff4444';
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.rotation += deltaTime / 500;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === POWERUP_TYPES.MULTI_SHOT) {
            // 多弹道道具 - 星形
            ctx.fillStyle = '#00ff00';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff00';
            
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const x = Math.cos(angle) * 15;
                const y = Math.sin(angle) * 15;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                
                const innerAngle = (Math.PI * 2 / 5) * (i + 0.5) - Math.PI / 2;
                const innerX = Math.cos(innerAngle) * 7;
                const innerY = Math.sin(innerAngle) * 7;
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();

            // 标识
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('M', 0, 4);
        } else if (this.type === POWERUP_TYPES.LASER) {
            // 激光道具 - 菱形
            ctx.fillStyle = '#ff00ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff00ff';
            
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(15, 0);
            ctx.lineTo(0, 15);
            ctx.lineTo(-15, 0);
            ctx.closePath();
            ctx.fill();

            // 标识
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('L', 0, 4);
        } else if (this.type === POWERUP_TYPES.HEALTH_PACK) {
            // 血包 - 十字形
            ctx.fillStyle = '#ff4444';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff4444';
            
            // 外圈
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // 白色十字
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-3, -10, 6, 20);
            ctx.fillRect(-10, -3, 20, 6);
            
            // 标识
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
        }

        ctx.restore();
    }
}

// 游戏主类
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GAME_CONFIG.width;
        this.canvas.height = GAME_CONFIG.height;

        this.state = GAME_STATE.MENU;
        this.selectedLevel = 1;
        this.level = 1;
        this.score = 0;
        this.monstersKilled = 0;
        this.inBossFight = false;

        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.boss = null;

        this.mouseX = GAME_CONFIG.width / 2;
        this.mouseY = GAME_CONFIG.height - 100;

        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.healthPackSpawnTimer = 0;

        this.setupEventListeners();
        this.gameLoop = this.gameLoop.bind(this);
    }

    setupEventListeners() {
        // 鼠标移动
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // 开始按钮 - 显示关卡选择
        document.getElementById('startBtn').addEventListener('click', () => {
            this.showLevelSelect();
        });

        // 重新开始按钮
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.resetGame();
            this.showLevelSelect();
        });

        // 返回主菜单按钮
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.returnToMenu();
        });

        // 继续游戏按钮
        document.getElementById('resumeBtn').addEventListener('click', () => {
            this.resumeGame();
        });

        // 键盘事件 - ESC键暂停
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state === GAME_STATE.PLAYING) {
                    this.pauseGame();
                } else if (this.state === GAME_STATE.PAUSED) {
                    this.resumeGame();
                }
            }
        });

        // 关卡选择按钮
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 使用currentTarget确保获取的是按钮元素，而不是内部的span
                const button = e.currentTarget;
                const level = parseInt(button.dataset.level);
                this.selectedLevel = level;
                this.startGame(level);
            });
        });
    }

    showLevelSelect() {
        this.state = GAME_STATE.LEVEL_SELECT;
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('levelSelectScreen').classList.remove('hidden');
    }

    startGame(startLevel = 1) {
        this.state = GAME_STATE.PLAYING;
        this.level = startLevel;
        this.player = new Player();
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.boss = null;
        this.monstersKilled = 0;
        this.inBossFight = false;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.healthPackSpawnTimer = 0;

        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('levelSelectScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('bossHealthBar').classList.add('hidden');

        this.updateUI();
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    pauseGame() {
        this.state = GAME_STATE.PAUSED;
        document.getElementById('pauseScreen').classList.remove('hidden');
    }

    resumeGame() {
        this.state = GAME_STATE.PLAYING;
        document.getElementById('pauseScreen').classList.add('hidden');
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    returnToMenu() {
        this.state = GAME_STATE.MENU;
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('levelSelectScreen').classList.add('hidden');
        document.getElementById('bossHealthBar').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
    }

    resetGame() {
        this.level = 1;
        this.score = 0;
        this.monstersKilled = 0;
        this.inBossFight = false;
    }

    gameLoop(currentTime) {
        if (this.state !== GAME_STATE.PLAYING) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        // 更新玩家
        if (this.player && this.player.active) {
            this.player.update(deltaTime, this.mouseX, this.mouseY);

            // 玩家发射
            if (this.player.canFire()) {
                const bullets = this.player.getBullets();
                this.bullets.push(...bullets);
            }
        }

        // 更新子弹
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.active && !bullet.isOffScreen();
        });

        // 生成敌人
        if (!this.inBossFight) {
            this.enemySpawnTimer += deltaTime;
            if (this.enemySpawnTimer >= GAME_CONFIG.enemySpawnRate) {
                this.enemySpawnTimer = 0;
                this.enemies.push(new Enemy(this.level));
            }
        }

        // 更新敌人
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime);

            // 敌人发射
            if (enemy.canFire()) {
                this.bullets.push(enemy.getBullet());
            }

            // 检查是否被击中
            for (let bullet of this.bullets) {
                if (bullet.isPlayer && enemy.collidesWith(bullet)) {
                    bullet.active = false;
                    this.createExplosion(enemy.x, enemy.y, enemy.color, 5);
                    
                    if (enemy.takeDamage(bullet.damage)) {
                        this.score += enemy.score;
                        this.monstersKilled++;
                        this.createExplosion(enemy.x, enemy.y, enemy.color, 15);
                        
                        // 检查是否生成BOSS
                        if (this.monstersKilled >= GAME_CONFIG.monstersToBoss) {
                            this.spawnBoss();
                        }
                        
                        this.updateUI();
                        return false;
                    }
                }
            }

            // 检查是否撞到玩家
            if (this.player && this.player.active && enemy.collidesWith(this.player)) {
                if (this.player.takeDamage(20)) {
                    this.gameOver();
                }
                this.createExplosion(enemy.x, enemy.y, enemy.color, 10);
                this.updateUI();
                return false;
            }

            return !enemy.isOffScreen() && enemy.health > 0;
        });

        // 更新BOSS
        if (this.boss && this.boss.active) {
            this.boss.update(deltaTime);

            // BOSS发射
            const bossBullets = this.boss.getBullets();
            this.bullets.push(...bossBullets);

            // 检查BOSS是否被击中
            for (let bullet of this.bullets) {
                if (bullet.isPlayer && this.boss.collidesWith(bullet)) {
                    if (!(bullet instanceof Laser)) {
                        bullet.active = false;
                    }
                    
                    if (this.boss.takeDamage(bullet.damage)) {
                        this.score += this.boss.score;
                        this.createExplosion(this.boss.x, this.boss.y, this.boss.color, 50);
                        this.levelComplete();
                        return;
                    }
                    this.updateBossHealth();
                }
            }

            // 检查BOSS是否撞到玩家
            if (this.player && this.player.active && this.boss.collidesWith(this.player)) {
                if (this.player.takeDamage(30)) {
                    this.gameOver();
                }
                this.updateUI();
            }
        }

        // 生成道具（武器升级）
        this.powerUpSpawnTimer += deltaTime;
        if (this.powerUpSpawnTimer >= GAME_CONFIG.powerUpSpawnRate) {
            this.powerUpSpawnTimer = 0;
            // 随机生成武器道具（不包括血包）
            const rand = Math.random();
            if (rand < 0.5) {
                this.powerUps.push(new PowerUp(POWERUP_TYPES.MULTI_SHOT));
            } else {
                this.powerUps.push(new PowerUp(POWERUP_TYPES.LASER));
            }
        }

        // 生成血包
        this.healthPackSpawnTimer += deltaTime;
        if (this.healthPackSpawnTimer >= GAME_CONFIG.healthPackSpawnRate) {
            this.healthPackSpawnTimer = 0;
            this.powerUps.push(new PowerUp(POWERUP_TYPES.HEALTH_PACK));
        }

        // 更新道具
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.update(deltaTime);

            // 检查是否被玩家收集
            if (this.player && this.player.active && powerUp.collidesWith(this.player)) {
                if (powerUp.type === POWERUP_TYPES.HEALTH_PACK) {
                    // 血包恢复30点生命值
                    this.player.heal(30);
                    this.createExplosion(powerUp.x, powerUp.y, '#ff4444', 8);
                } else {
                    this.player.upgradeWeapon(powerUp.type);
                    this.score += 50;
                    this.createExplosion(powerUp.x, powerUp.y, '#ffff00', 8);
                }
                this.updateUI();
                return false;
            }

            return !powerUp.isOffScreen();
        });

        // 更新粒子
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.active;
        });

        // 检查玩家被敌人子弹击中
        for (let bullet of this.bullets) {
            if (!bullet.isPlayer && this.player && this.player.active) {
                if (this.player.collidesWith(bullet)) {
                    if (!(bullet instanceof Laser)) {
                        bullet.active = false;
                    }
                    if (this.player.takeDamage(bullet.damage * 10)) {
                        this.gameOver();
                    }
                    this.createExplosion(this.player.x, this.player.y, '#00d4ff', 10);
                    this.updateUI();
                }
            }
        }
    }

    spawnBoss() {
        this.inBossFight = true;
        this.enemies = [];
        this.boss = new Boss(this.level);
        document.getElementById('bossHealthBar').classList.remove('hidden');
        document.getElementById('bossName').textContent = this.boss.name;
        this.updateBossHealth();
    }

    updateBossHealth() {
        if (this.boss) {
            const healthPercent = this.boss.getHealthPercent() * 100;
            document.getElementById('bossHealth').style.width = healthPercent + '%';
        }
    }

    levelComplete() {
        this.state = GAME_STATE.LEVEL_COMPLETE;
        this.boss = null;
        this.inBossFight = false;
        this.monstersKilled = 0;
        
        document.getElementById('bossHealthBar').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('levelCompleteScreen').classList.add('hidden');
            
            // 检查是否通关所有关卡
            if (this.level >= GAME_CONFIG.maxLevels) {
                this.gameWin();
            } else {
                this.level++;
                this.state = GAME_STATE.PLAYING;
                this.lastTime = performance.now();
                requestAnimationFrame(this.gameLoop);
            }
        }, 3000);

        this.updateUI();
    }

    gameWin() {
        this.state = GAME_STATE.GAME_OVER;
        document.getElementById('finalScore').textContent = `恭喜通关! 最终得分: ${this.score}`;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('bossHealthBar').classList.add('hidden');
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        document.getElementById('finalScore').textContent = `最终得分: ${this.score}`;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('bossHealthBar').classList.add('hidden');
    }

    createExplosion(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const speed = 50 + Math.random() * 150;
            const life = 300 + Math.random() * 400;
            this.particles.push(new Particle(x, y, color, speed, life));
        }
    }

    updateUI() {
        document.getElementById('score').textContent = `得分: ${this.score}`;
        // 确保level显示为有效数字
        const safeLevel = (typeof this.level === 'number' && !isNaN(this.level)) ? this.level : 1;
        document.getElementById('level').textContent = `关卡: ${safeLevel}`;
        
        if (this.player) {
            const weaponName = this.player.weaponType === WEAPON_TYPES.NORMAL ? '普通' : '激光';
            document.getElementById('weapon').textContent = `武器: ${weaponName}`;
            document.getElementById('weaponLevel').textContent = `武器等级: ${this.player.weaponLevel}`;
            
            // 更新玩家血量显示
            const healthPercent = Math.floor(this.player.getHealthPercent() * 100);
            document.getElementById('playerHealth').textContent = `血量: ${healthPercent}%`;
        }
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制星空背景
        this.drawStars();

        // 绘制道具
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));

        // 绘制敌人
        this.enemies.forEach(enemy => enemy.draw(this.ctx));

        // 绘制BOSS
        if (this.boss) {
            this.boss.draw(this.ctx);
        }

        // 绘制玩家
        if (this.player) {
            this.player.draw(this.ctx);
        }

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(this.ctx));

        // 绘制粒子
        this.particles.forEach(particle => particle.draw(this.ctx));
    }

    drawStars() {
        const time = Date.now() / 1000;
        this.ctx.fillStyle = '#ffffff';
        
        for (let i = 0; i < 50; i++) {
            const x = (i * 73 + time * 10) % this.canvas.width;
            const y = (i * 37 + time * 20) % this.canvas.height;
            const size = (i % 3) + 1;
            const alpha = 0.3 + (Math.sin(time + i) + 1) / 4;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
}

// 启动游戏
window.onload = () => {
    const game = new Game();
};
