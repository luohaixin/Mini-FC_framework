/**
 * 扫雷游戏单元测试
 * 使用简单的测试框架
 */

// 模拟测试框架
const TestRunner = {
    tests: [],
    
    describe(name, fn) {
        console.log(`\n📦 ${name}`);
        fn();
    },
    
    it(name, fn) {
        try {
            fn();
            console.log(`  ✅ ${name}`);
        } catch (e) {
            console.log(`  ❌ ${name}`);
            console.log(`     ${e.message}`);
        }
    },
    
    expect(actual) {
        return {
            toBe(expected) {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toEqual(expected) {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeTruthy() {
                if (!actual) {
                    throw new Error(`Expected truthy value, but got ${actual}`);
                }
            },
            toBeFalsy() {
                if (actual) {
                    throw new Error(`Expected falsy value, but got ${actual}`);
                }
            },
            toBeGreaterThan(expected) {
                if (!(actual > expected)) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeLessThan(expected) {
                if (!(actual < expected)) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            toContain(expected) {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected ${actual} to contain ${expected}`);
                }
            }
        };
    }
};

// 运行测试
function runTests() {
    console.log('🧪 开始运行扫雷游戏单元测试...\n');
    
    // 导入模块（在浏览器环境中需要确保模块已加载）
    const { describe, it, expect } = TestRunner;
    
    // ==================== Minesweeper 类测试 ====================
    describe('Minesweeper 类', () => {
        it('应该正确初始化游戏', () => {
            const game = new Minesweeper(9, 9, 10);
            expect(game.rows).toBe(9);
            expect(game.cols).toBe(9);
            expect(game.mineCount).toBe(10);
            expect(game.gameState).toBe('ready');
        });
        
        it('应该正确创建游戏棋盘', () => {
            const game = new Minesweeper(5, 5, 3);
            expect(game.board.length).toBe(5);
            expect(game.board[0].length).toBe(5);
            
            // 检查每个格子的初始状态
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    const cell = game.board[row][col];
                    expect(cell.isMine).toBe(false);
                    expect(cell.isRevealed).toBe(false);
                    expect(cell.isFlagged).toBe(false);
                    expect(cell.neighborMines).toBe(0);
                }
            }
        });
        
        it('第一次点击后应该生成地雷', () => {
            const game = new Minesweeper(9, 9, 10);
            
            // 第一次点击前没有地雷
            let mineCount = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (game.board[row][col].isMine) mineCount++;
                }
            }
            expect(mineCount).toBe(0);
            
            // 第一次点击
            game.reveal(4, 4);
            
            // 应该有正确数量的地雷
            mineCount = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (game.board[row][col].isMine) mineCount++;
                }
            }
            expect(mineCount).toBe(10);
        });
        
        it('第一次点击的位置及其周围不应该有地雷', () => {
            const game = new Minesweeper(9, 9, 10);
            game.reveal(4, 4);
            
            // 检查3x3区域
            for (let row = 3; row <= 5; row++) {
                for (let col = 3; col <= 5; col++) {
                    expect(game.board[row][col].isMine).toBe(false);
                }
            }
        });
        
        it('应该正确计算周围地雷数量', () => {
            const game = new Minesweeper(3, 3, 0);
            
            // 手动设置地雷
            game.board[0][0].isMine = true;
            game.board[0][2].isMine = true;
            game.board[2][0].isMine = true;
            
            game.calculateNeighborMines();
            
            // 中心格子应该有3个周围地雷
            expect(game.board[1][1].neighborMines).toBe(3);
            
            // 角落格子应该只有1个周围地雷
            expect(game.board[0][1].neighborMines).toBe(1);
        });
        
        it('揭示空白格子应该连锁展开', () => {
            const game = new Minesweeper(5, 5, 0);
            game.firstClick = false;
            game.gameState = 'playing';
            
            // 只设置一个地雷
            game.board[4][4].isMine = true;
            game.calculateNeighborMines();
            
            // 揭示左上角，应该展开大片区域
            const result = game.reveal(0, 0);
            expect(result.success).toBe(true);
            expect(result.revealed.length).toBeGreaterThan(1);
        });
        
        it('标记功能应该正常工作', () => {
            const game = new Minesweeper(5, 5, 5);
            
            // 标记一个格子
            const result = game.toggleFlag(2, 2);
            expect(result.success).toBe(true);
            expect(result.action).toBe('flag');
            expect(game.board[2][2].isFlagged).toBe(true);
            expect(game.flaggedCount).toBe(1);
            
            // 再次点击变成问号
            const result2 = game.toggleFlag(2, 2);
            expect(result2.action).toBe('question');
            expect(game.board[2][2].isFlagged).toBe(false);
            expect(game.board[2][2].isQuestion).toBe(true);
            
            // 第三次点击取消标记
            const result3 = game.toggleFlag(2, 2);
            expect(result3.action).toBe('unmark');
            expect(game.board[2][2].isQuestion).toBe(false);
        });
        
        it('踩到地雷应该游戏结束', () => {
            const game = new Minesweeper(5, 5, 25); // 大量地雷确保能踩到
            game.firstClick = false;
            game.gameState = 'playing';
            
            // 手动设置地雷在特定位置
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    game.board[row][col].isMine = true;
                }
            }
            game.board[0][0].isMine = false;
            game.calculateNeighborMines();
            
            // 踩到地雷
            const result = game.reveal(1, 1);
            expect(result.exploded).toBe(true);
            expect(game.gameState).toBe('lost');
        });
        
        it('揭示所有安全格子应该获胜', () => {
            const game = new Minesweeper(3, 3, 1);
            game.firstClick = false;
            game.gameState = 'playing';
            
            // 设置地雷在角落
            game.board[2][2].isMine = true;
            game.calculateNeighborMines();
            
            // 揭示所有非地雷格子
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (!game.board[row][col].isMine) {
                        game.reveal(row, col);
                    }
                }
            }
            
            expect(game.gameState).toBe('won');
        });
        
        it('重置游戏应该恢复初始状态', () => {
            const game = new Minesweeper(5, 5, 5);
            game.firstClick = false;
            game.gameState = 'playing';
            game.board[2][2].isMine = true;
            game.revealedCount = 5;
            game.flaggedCount = 2;
            
            game.reset();
            
            expect(game.gameState).toBe('ready');
            expect(game.firstClick).toBe(true);
            expect(game.revealedCount).toBe(0);
            expect(game.flaggedCount).toBe(0);
            expect(game.board[2][2].isMine).toBe(false);
        });
        
        it('序列化和反序列化应该保持游戏状态', () => {
            const game = new Minesweeper(5, 5, 5);
            game.firstClick = false;
            game.gameState = 'playing';
            game.board[2][2].isMine = true;
            game.board[2][2].isRevealed = true;
            game.revealedCount = 1;
            
            const serialized = game.serialize();
            const restoredGame = Minesweeper.deserialize(serialized);
            
            expect(restoredGame.rows).toBe(game.rows);
            expect(restoredGame.cols).toBe(game.cols);
            expect(restoredGame.mineCount).toBe(game.mineCount);
            expect(restoredGame.gameState).toBe(game.gameState);
            expect(restoredGame.board[2][2].isMine).toBe(true);
            expect(restoredGame.board[2][2].isRevealed).toBe(true);
        });
    });
    
    // ==================== LevelSystem 测试 ====================
    describe('LevelSystem 关卡系统', () => {
        it('应该返回正确的关卡配置', () => {
            const config = LevelSystem.getLevelConfig(1);
            expect(config.level).toBe(1);
            expect(config.rows).toBe(9);
            expect(config.cols).toBe(9);
            expect(config.mineCount).toBe(10);
        });
        
        it('难度应该随关卡递增', () => {
            const easy = LevelSystem.getLevelConfig(1);
            const medium = LevelSystem.getLevelConfig(11);
            const hard = LevelSystem.getLevelConfig(21);
            const expert = LevelSystem.getLevelConfig(26);
            
            expect(easy.difficulty.name).toBe('easy');
            expect(medium.difficulty.name).toBe('medium');
            expect(hard.difficulty.name).toBe('hard');
            expect(expert.difficulty.name).toBe('expert');
        });
        
        it('棋盘大小应该随关卡递增', () => {
            const level1 = LevelSystem.getLevelConfig(1);
            const level15 = LevelSystem.getLevelConfig(15);
            const level30 = LevelSystem.getLevelConfig(30);
            
            expect(level30.rows).toBeGreaterThan(level15.rows);
            expect(level15.rows).toBeGreaterThan(level1.rows);
        });
        
        it('应该正确计算星级', () => {
            const config = LevelSystem.getLevelConfig(1);
            
            // 用时很短应该获得3星
            const stars3 = LevelSystem.calculateStars(1, config.parTime * 0.3);
            expect(stars3).toBe(3);
            
            // 用时中等应该获得2星
            const stars2 = LevelSystem.calculateStars(1, config.parTime * 0.8);
            expect(stars2).toBe(2);
            
            // 用时较长应该获得1星
            const stars1 = LevelSystem.calculateStars(1, config.parTime * 1.5);
            expect(stars1).toBe(1);
        });
        
        it('应该正确判断关卡解锁状态', () => {
            expect(LevelSystem.isLevelUnlocked(1, 5)).toBe(true);
            expect(LevelSystem.isLevelUnlocked(5, 5)).toBe(true);
            expect(LevelSystem.isLevelUnlocked(6, 5)).toBe(false);
        });
        
        it('应该正确获取下一关', () => {
            expect(LevelSystem.getNextLevel(1)).toBe(2);
            expect(LevelSystem.getNextLevel(30)).toBe(null);
        });
        
        it('应该正确验证配置', () => {
            expect(LevelSystem.validateConfig({ rows: 9, cols: 9, mineCount: 10 })).toBe(true);
            expect(LevelSystem.validateConfig({ rows: 0, cols: 9, mineCount: 10 })).toBe(false);
            expect(LevelSystem.validateConfig({ rows: 9, cols: 9, mineCount: 100 })).toBe(false);
        });
    });
    
    // ==================== Utils 测试 ====================
    describe('Utils 工具函数', () => {
        it('randomInt 应该生成指定范围内的随机数', () => {
            for (let i = 0; i < 100; i++) {
                const num = Utils.randomInt(1, 10);
                expect(num).toBeGreaterThan(0);
                expect(num).toBeLessThan(11);
            }
        });
        
        it('shuffle 应该打乱数组', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = Utils.shuffle(original);
            
            // 长度应该相同
            expect(shuffled.length).toBe(original.length);
            
            // 元素应该相同（只是顺序不同）
            expect(shuffled.sort()).toEqual(original.sort());
        });
        
        it('formatTime 应该正确格式化时间', () => {
            expect(Utils.formatTime(0)).toBe('00:00');
            expect(Utils.formatTime(45)).toBe('00:45');
            expect(Utils.formatTime(125)).toBe('02:05');
            expect(Utils.formatTime(3661)).toBe('61:01');
        });
        
        it('formatNumber 应该正确格式化数字', () => {
            expect(Utils.formatNumber(5)).toBe('005');
            expect(Utils.formatNumber(45)).toBe('045');
            expect(Utils.formatNumber(123)).toBe('123');
        });
        
        it('deepClone 应该深拷贝对象', () => {
            const original = { a: 1, b: { c: 2 } };
            const cloned = Utils.deepClone(original);
            
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
            expect(cloned.b).not.toBe(original.b);
        });
        
        it('safeJSONParse 应该安全解析JSON', () => {
            expect(Utils.safeJSONParse('{"a":1}')).toEqual({ a: 1 });
            expect(Utils.safeJSONParse('invalid')).toBe(null);
            expect(Utils.safeJSONParse('invalid', {})).toEqual({});
        });
        
        it('calculateStars 应该正确计算星级', () => {
            expect(Utils.calculateStars(30, 60)).toBe(3); // 用时50%
            expect(Utils.calculateStars(60, 60)).toBe(2); // 用时100%
            expect(Utils.calculateStars(90, 60)).toBe(1); // 用时150%
        });
    });
    
    console.log('\n✨ 测试完成！');
}

// 如果模块导出存在，导出测试函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests, TestRunner };
}
