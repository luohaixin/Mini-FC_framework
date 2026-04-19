/**
 * 音频管理模块
 * 负责游戏音效和背景音乐的管理
 */

const AudioManager = {
    // 音频上下文
    context: null,
    
    // 设置
    settings: {
        sound: true,
        music: false,
        volume: 0.5
    },
    
    // 音效缓存
    sounds: {},
    
    // 背景音乐
    bgm: null,
    
    // 是否已初始化
    initialized: false,

    /**
     * 初始化音频管理器
     */
    init() {
        if (this.initialized) return;
        
        // 加载设置
        const savedSettings = Storage.getSettings();
        this.settings.sound = savedSettings.sound !== false;
        this.settings.music = savedSettings.music === true;
        
        // 创建音频上下文（需要用户交互后才能创建）
        this.setupAudioContext();
        
        // 初始化音效
        this.initSounds();
        
        this.initialized = true;
    },

    /**
     * 设置音频上下文
     */
    setupAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.context = new AudioContext();
            }
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    },

    /**
     * 初始化音效
     */
    initSounds() {
        // 使用 Web Audio API 生成简单的音效
        this.sounds = {
            click: () => this.generateTone(800, 0.05, 'sine'),
            reveal: () => this.generateTone(600, 0.08, 'sine'),
            flag: () => this.generateTone(400, 0.1, 'square'),
            unflag: () => this.generateTone(300, 0.1, 'square'),
            win: () => this.playMelody([523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.3]),
            lose: () => this.playMelody([400, 350, 300, 250], [0.2, 0.2, 0.2, 0.4]),
            explode: () => this.generateNoise(0.3),
            hint: () => this.generateTone(1000, 0.15, 'sine'),
            levelUp: () => this.playMelody([523, 659, 784, 880, 1047], [0.1, 0.1, 0.1, 0.1, 0.4]),
            menu: () => this.generateTone(500, 0.05, 'sine')
        };
    },

    /**
     * 生成音调
     * @param {number} frequency - 频率
     * @param {number} duration - 持续时间
     * @param {string} type - 波形类型
     */
    generateTone(frequency, duration, type = 'sine') {
        if (!this.settings.sound || !this.context) return;
        
        try {
            // 恢复音频上下文（如果处于暂停状态）
            if (this.context.state === 'suspended') {
                this.context.resume();
            }
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(this.settings.volume * 0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        } catch (e) {
            console.warn('Audio generation error:', e);
        }
    },

    /**
     * 生成噪音（用于爆炸音效）
     * @param {number} duration - 持续时间
     */
    generateNoise(duration) {
        if (!this.settings.sound || !this.context) return;
        
        try {
            if (this.context.state === 'suspended') {
                this.context.resume();
            }
            
            const bufferSize = this.context.sampleRate * duration;
            const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.context.createBufferSource();
            noise.buffer = buffer;
            
            const gainNode = this.context.createGain();
            gainNode.gain.setValueAtTime(this.settings.volume * 0.5, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            // 添加低通滤波器使声音更低沉
            const filter = this.context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            noise.start();
        } catch (e) {
            console.warn('Noise generation error:', e);
        }
    },

    /**
     * 播放旋律
     * @param {Array<number>} frequencies - 频率数组
     * @param {Array<number>} durations - 持续时间数组
     */
    playMelody(frequencies, durations) {
        if (!this.settings.sound || !this.context) return;
        
        let currentTime = this.context.currentTime;
        
        frequencies.forEach((freq, index) => {
            const duration = durations[index] || 0.1;
            
            try {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(this.settings.volume * 0.3, currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + duration);
                
                currentTime += duration;
            } catch (e) {
                console.warn('Melody generation error:', e);
            }
        });
    },

    /**
     * 播放音效
     * @param {string} soundName - 音效名称
     */
    play(soundName) {
        if (!this.settings.sound) return;
        
        if (!this.initialized) {
            this.init();
        }
        
        const sound = this.sounds[soundName];
        if (sound) {
            sound();
        }
    },

    /**
     * 播放背景音乐
     */
    playBGM() {
        if (!this.settings.music) return;
        
        // 这里可以添加背景音乐播放逻辑
        // 由于版权问题，使用程序化生成的简单背景音乐
        this.startAmbientMusic();
    },

    /**
     * 停止背景音乐
     */
    stopBGM() {
        if (this.bgm) {
            this.bgm.stop();
            this.bgm = null;
        }
    },

    /**
     * 开始环境音乐
     */
    startAmbientMusic() {
        if (!this.context) return;
        
        // 简单的环境音效循环
        const playAmbient = () => {
            if (!this.settings.music) return;
            
            const freq = 200 + Math.random() * 100;
            this.generateTone(freq, 2, 'sine');
            
            if (this.settings.music) {
                setTimeout(playAmbient, 3000 + Math.random() * 2000);
            }
        };
        
        playAmbient();
    },

    /**
     * 设置音效开关
     * @param {boolean} enabled - 是否启用
     */
    setSound(enabled) {
        this.settings.sound = enabled;
        this.saveSettings();
    },

    /**
     * 设置音乐开关
     * @param {boolean} enabled - 是否启用
     */
    setMusic(enabled) {
        this.settings.music = enabled;
        this.saveSettings();
        
        if (enabled) {
            this.playBGM();
        } else {
            this.stopBGM();
        }
    },

    /**
     * 设置音量
     * @param {number} volume - 音量（0-1）
     */
    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    },

    /**
     * 保存设置
     */
    saveSettings() {
        const savedSettings = Storage.getSettings();
        savedSettings.sound = this.settings.sound;
        savedSettings.music = this.settings.music;
        Storage.saveSettings(savedSettings);
    },

    /**
     * 振动反馈
     * @param {number} duration - 振动持续时间
     */
    vibrate(duration = 50) {
        if (navigator.vibrate && Storage.getSettings().vibration !== false) {
            navigator.vibrate(duration);
        }
    },

    /**
     * 播放点击音效并振动
     */
    playClick() {
        this.play('click');
        this.vibrate(30);
    },

    /**
     * 播放揭示音效
     */
    playReveal() {
        this.play('reveal');
    },

    /**
     * 播放标记音效
     */
    playFlag() {
        this.play('flag');
        this.vibrate(40);
    },

    /**
     * 播放取消标记音效
     */
    playUnflag() {
        this.play('unflag');
        this.vibrate(30);
    },

    /**
     * 播放胜利音效
     */
    playWin() {
        this.play('win');
        this.vibrate([50, 100, 50, 100, 200]);
    },

    /**
     * 播放失败音效
     */
    playLose() {
        this.play('lose');
        this.vibrate([200, 100, 200]);
    },

    /**
     * 播放爆炸音效
     */
    playExplode() {
        this.play('explode');
        this.vibrate(300);
    },

    /**
     * 播放提示音效
     */
    playHint() {
        this.play('hint');
    },

    /**
     * 播放升级音效
     */
    playLevelUp() {
        this.play('levelUp');
        this.vibrate([50, 50, 50, 100, 200]);
    },

    /**
     * 播放菜单音效
     */
    playMenu() {
        this.play('menu');
    },

    /**
     * 静音所有音频
     */
    mute() {
        this.settings.sound = false;
        this.settings.music = false;
        this.stopBGM();
        this.saveSettings();
    },

    /**
     * 取消静音
     */
    unmute() {
        this.settings.sound = true;
        this.saveSettings();
    },

    /**
     * 切换静音状态
     * @returns {boolean} 新的静音状态
     */
    toggleMute() {
        this.settings.sound = !this.settings.sound;
        this.saveSettings();
        return this.settings.sound;
    },

    /**
     * 获取当前设置
     * @returns {Object} 音频设置
     */
    getSettings() {
        return { ...this.settings };
    },

    /**
     * 检查是否支持音频
     * @returns {boolean} 是否支持
     */
    isSupported() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
