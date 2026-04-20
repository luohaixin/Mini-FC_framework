/**
 * 工具函数模块
 * 包含通用的辅助函数
 */

const Utils = {
    /**
     * 生成指定范围内的随机整数
     * @param {number} min - 最小值（包含）
     * @param {number} max - 最大值（包含）
     * @returns {number} 随机整数
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 打乱数组（Fisher-Yates算法）
     * @param {Array} array - 要打乱的数组
     * @returns {Array} 打乱后的新数组
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.randomInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * 格式化时间为 mm:ss 格式
     * @param {number} seconds - 秒数
     * @returns {string} 格式化后的时间字符串
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * 格式化时间为三位数字符串
     * @param {number} num - 数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        return num.toString().padStart(3, '0');
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * 检测是否为触摸设备
     * @returns {boolean} 是否为触摸设备
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * 检测是否为移动设备
     * @returns {boolean} 是否为移动设备
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * 添加事件监听器（支持多种事件）
     * @param {Element} element - DOM元素
     * @param {string} events - 事件名称（空格分隔）
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 事件选项
     */
    addEventListeners(element, events, handler, options = {}) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler, options);
        });
    },

    /**
     * 移除事件监听器
     * @param {Element} element - DOM元素
     * @param {string} events - 事件名称（空格分隔）
     * @param {Function} handler - 事件处理函数
     */
    removeEventListeners(element, events, handler) {
        events.split(' ').forEach(event => {
            element.removeEventListener(event, handler);
        });
    },

    /**
     * 创建自定义事件
     * @param {string} name - 事件名称
     * @param {*} detail - 事件数据
     * @returns {CustomEvent} 自定义事件
     */
    createEvent(name, detail = null) {
        return new CustomEvent(name, { detail, bubbles: true });
    },

    /**
     * 派发事件
     * @param {Element} target - 目标元素
     * @param {string} name - 事件名称
     * @param {*} detail - 事件数据
     */
    dispatchEvent(target, name, detail = null) {
        target.dispatchEvent(this.createEvent(name, detail));
    },

    /**
     * 深拷贝对象
     * @param {*} obj - 要拷贝的对象
     * @returns {*} 拷贝后的对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    },

    /**
     * 合并对象
     * @param {Object} target - 目标对象
     * @param {...Object} sources - 源对象
     * @returns {Object} 合并后的对象
     */
    merge(target, ...sources) {
        return Object.assign({}, target, ...sources);
    },

    /**
     * 生成唯一ID
     * @returns {string} 唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * 等待指定时间
     * @param {number} ms - 等待时间（毫秒）
     * @returns {Promise} Promise对象
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 动画帧请求包装器
     * @param {Function} callback - 回调函数
     * @returns {number} 动画帧ID
     */
    requestAnimationFrame(callback) {
        return window.requestAnimationFrame(callback);
    },

    /**
     * 批量添加CSS类
     * @param {Element} element - DOM元素
     * @param {...string} classes - CSS类名
     */
    addClasses(element, ...classes) {
        element.classList.add(...classes.filter(Boolean));
    },

    /**
     * 批量移除CSS类
     * @param {Element} element - DOM元素
     * @param {...string} classes - CSS类名
     */
    removeClasses(element, ...classes) {
        element.classList.remove(...classes.filter(Boolean));
    },

    /**
     * 切换CSS类
     * @param {Element} element - DOM元素
     * @param {string} className - CSS类名
     * @param {boolean} force - 强制添加或移除
     */
    toggleClass(element, className, force) {
        element.classList.toggle(className, force);
    },

    /**
     * 检查元素是否包含CSS类
     * @param {Element} element - DOM元素
     * @param {string} className - CSS类名
     * @returns {boolean} 是否包含
     */
    hasClass(element, className) {
        return element.classList.contains(className);
    },

    /**
     * 获取元素相对于视口的位置
     * @param {Element} element - DOM元素
     * @returns {Object} 位置信息
     */
    getElementRect(element) {
        return element.getBoundingClientRect();
    },

    /**
     * 阻止默认事件
     * @param {Event} e - 事件对象
     */
    preventDefault(e) {
        e.preventDefault();
    },

    /**
     * 阻止事件冒泡
     * @param {Event} e - 事件对象
     */
    stopPropagation(e) {
        e.stopPropagation();
    },

    /**
     * 安全地解析JSON
     * @param {string} json - JSON字符串
     * @param {*} defaultValue - 默认值
     * @returns {*} 解析结果
     */
    safeJSONParse(json, defaultValue = null) {
        try {
            return JSON.parse(json);
        } catch (e) {
            return defaultValue;
        }
    },

    /**
     * 安全地序列化为JSON
     * @param {*} value - 要序列化的值
     * @param {string} defaultValue - 默认值
     * @returns {string} JSON字符串
     */
    safeJSONStringify(value, defaultValue = '{}') {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return defaultValue;
        }
    },

    /**
     * 计算星级评价
     * @param {number} time - 用时（秒）
     * @param {number} parTime - 标准时间（秒）
     * @returns {number} 星级（1-3）
     */
    calculateStars(time, parTime) {
        if (time <= parTime * 0.5) return 3;
        if (time <= parTime) return 2;
        return 1;
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
