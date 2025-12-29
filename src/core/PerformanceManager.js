/**
 * PerformanceManager - 性能管理器
 * 负责帧率监控调整、内存使用量跟踪、自动质量降级和资源清理机制
 */
class PerformanceManager {
    constructor(options = {}) {
        this.options = {
            targetFPS: 60,
            minFPS: 30,
            memoryThreshold: 100, // MB
            performanceCheckInterval: 1000, // ms
            autoOptimize: true,
            ...options
        };
        
        // 性能统计
        this.performanceStats = {
            currentFPS: 0,
            averageFPS: 0,
            frameTime: 0,
            renderTime: 0,
            updateTime: 0,
            minFPS: Infinity,
            maxFPS: 0,
            frameDrops: 0,
            memoryUsage: {
                used: 0,
                total: 0,
                percentage: 0
            },
            frameCount: 0,
            totalFrames: 0
        };
        
        // 优化级别
        this.optimizationLevel = 'auto'; // auto, high, medium, low
        this.optimizationConfig = this.getOptimizationConfig();
        
        // 性能监控
        this.lastFrameTime = performance.now();
        this.lastPerformanceCheck = performance.now();
        this.frameTimeHistory = [];
        this.maxHistoryLength = 60; // 保存60帧的历史
        
        // 资源管理
        this.resourceCache = new Map();
        this.unusedResources = new Set();
        this.lastCleanupTime = performance.now();
        this.cleanupInterval = 30000; // 30秒清理一次
        
        // 懒加载管理
        this.lazyLoadQueue = [];
        this.loadingResources = new Set();
        this.maxConcurrentLoads = 3;
        
        // 事件监听器
        this.performanceListeners = new Set();
        
        this.init();
    }
    
    /**
     * 初始化性能管理器
     */
    init() {
        this.setupPerformanceMonitoring();
        this.setupMemoryMonitoring();
        this.setupResourceManagement();
        
        console.log('PerformanceManager initialized:', {
            targetFPS: this.options.targetFPS,
            optimizationLevel: this.optimizationLevel,
            autoOptimize: this.options.autoOptimize
        });
    }

    // Getter properties for test compatibility
    get currentFPS() {
        return this.performanceStats.currentFPS;
    }

    get targetFPS() {
        return this.options.targetFPS;
    }

    get adaptiveQuality() {
        return this.options.autoOptimize;
    }
    
    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        // 监控帧率
        this.fpsInterval = setInterval(() => {
            this.updateFPSStats();
            this.checkPerformance();
        }, this.options.performanceCheckInterval);
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
    }
    
    /**
     * 设置内存监控
     */
    setupMemoryMonitoring() {
        if (performance.memory) {
            this.memoryInterval = setInterval(() => {
                this.updateMemoryStats();
            }, this.options.performanceCheckInterval);
        }
    }
    
    /**
     * 设置资源管理
     */
    setupResourceManagement() {
        // 定期清理未使用的资源
        this.cleanupInterval = setInterval(() => {
            this.cleanupUnusedResources();
        }, this.cleanupInterval);
        
        // 处理懒加载队列
        this.processLazyLoadQueue();
    }
    
    /**
     * 更新性能统计
     */
    update(deltaTime) {
        const currentTime = performance.now();
        
        // 更新帧时间
        this.performanceStats.frameTime = deltaTime;
        this.performanceStats.frameCount++;
        this.performanceStats.totalFrames++;
        
        // 添加到历史记录
        this.frameTimeHistory.push(deltaTime);
        if (this.frameTimeHistory.length > this.maxHistoryLength) {
            this.frameTimeHistory.shift();
        }
        
        // 检查是否需要性能检查
        if (currentTime - this.lastPerformanceCheck >= this.options.performanceCheckInterval) {
            this.performPerformanceCheck();
            this.lastPerformanceCheck = currentTime;
        }
        
        // 检查是否需要资源清理
        if (currentTime - this.lastCleanupTime >= this.cleanupInterval) {
            this.cleanupUnusedResources();
            this.lastCleanupTime = currentTime;
        }
    }
    
    /**
     * 测量更新时间
     */
    measureUpdateTime(updateFunction) {
        const startTime = performance.now();
        updateFunction();
        this.performanceStats.updateTime = performance.now() - startTime;
    }
    
    /**
     * 测量渲染时间
     */
    measureRenderTime(renderFunction) {
        const startTime = performance.now();
        renderFunction();
        this.performanceStats.renderTime = performance.now() - startTime;
    }
    
    /**
     * 更新FPS统计
     */
    updateFPSStats(fps = null) {
        const currentTime = performance.now();
        const timeDelta = currentTime - this.lastFrameTime;
        
        if (fps !== null) {
            // Manual FPS update for testing
            this.performanceStats.currentFPS = fps;
            
            // Update min/max FPS
            if (fps < this.performanceStats.minFPS) {
                this.performanceStats.minFPS = fps;
            }
            if (fps > this.performanceStats.maxFPS) {
                this.performanceStats.maxFPS = fps;
            }
            
            // Track frame drops
            if (fps < this.options.minFPS) {
                this.performanceStats.frameDrops = (this.performanceStats.frameDrops || 0) + 1;
            }
            
            // Update frame history for average calculation
            if (!this.fpsHistory) {
                this.fpsHistory = [];
            }
            this.fpsHistory.push(fps);
            if (this.fpsHistory.length > 10) {
                this.fpsHistory.shift();
            }
            
            // Calculate average FPS
            if (this.fpsHistory.length > 0) {
                this.performanceStats.averageFPS = this.fpsHistory.reduce((sum, f) => sum + f, 0) / this.fpsHistory.length;
            }
        } else {
            // Automatic FPS calculation
            if (timeDelta > 0) {
                this.performanceStats.currentFPS = Math.round(1000 / (timeDelta / this.performanceStats.frameCount));
                
                // 计算平均FPS
                if (this.frameTimeHistory.length > 0) {
                    const avgFrameTime = this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
                    this.performanceStats.averageFPS = Math.round(1000 / avgFrameTime);
                }
            }
        }
        
        this.performanceStats.frameCount = 0;
        this.lastFrameTime = currentTime;
    }
    
    /**
     * 更新内存统计
     */
    updateMemoryStats() {
        if (performance.memory) {
            const memory = performance.memory;
            this.performanceStats.memoryUsage = {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            };
        }
    }
    
    /**
     * 执行性能检查
     */
    performPerformanceCheck() {
        const fps = this.performanceStats.currentFPS;
        const memoryUsage = this.performanceStats.memoryUsage.used;
        
        // 检查FPS性能
        if (fps < this.options.minFPS && this.options.autoOptimize) {
            this.handleLowFPS(fps);
        }
        
        // 检查内存使用
        if (memoryUsage > this.options.memoryThreshold && this.options.autoOptimize) {
            this.handleHighMemoryUsage(memoryUsage);
        }
        
        // 触发性能事件
        this.notifyPerformanceListeners({
            type: 'performance-check',
            fps: fps,
            memory: memoryUsage,
            optimizationLevel: this.optimizationLevel
        });
    }
    
    /**
     * 处理低FPS情况
     */
    handleLowFPS(currentFPS) {
        console.warn(`Low FPS detected: ${currentFPS}, optimizing...`);
        
        // 自动降级优化级别
        if (this.optimizationLevel === 'high') {
            this.setOptimizationLevel('medium');
        } else if (this.optimizationLevel === 'medium') {
            this.setOptimizationLevel('low');
        }
        
        // 触发优化事件
        this.notifyPerformanceListeners({
            type: 'fps-optimization',
            oldFPS: currentFPS,
            newLevel: this.optimizationLevel
        });
    }
    
    /**
     * 处理高内存使用情况
     */
    handleHighMemoryUsage(memoryUsage) {
        console.warn(`High memory usage detected: ${memoryUsage}MB, cleaning up...`);
        
        // 立即清理资源
        this.cleanupUnusedResources();
        
        // 清理缓存
        this.clearOldCache();
        
        // 触发内存优化事件
        this.notifyPerformanceListeners({
            type: 'memory-optimization',
            memoryUsage: memoryUsage,
            action: 'cleanup'
        });
    }
    
    /**
     * 获取优化配置
     */
    getOptimizationConfig() {
        const configs = {
            auto: {
                maxParticles: 50,
                enableShadows: true,
                enableBlur: true,
                renderScale: 1.0,
                maxActiveEvents: 4,
                animationQuality: 'medium',
                textureQuality: 'medium'
            },
            high: {
                maxParticles: 50,
                enableShadows: true,
                enableBlur: true,
                renderScale: 1.0,
                maxActiveEvents: 6,
                animationQuality: 'high',
                textureQuality: 'high'
            },
            medium: {
                maxParticles: 30,
                enableShadows: true,
                enableBlur: false,
                renderScale: 0.8,
                maxActiveEvents: 4,
                animationQuality: 'medium',
                textureQuality: 'medium'
            },
            low: {
                maxParticles: 10,
                enableShadows: false,
                enableBlur: false,
                renderScale: 0.75,
                maxActiveEvents: 2,
                animationQuality: 'low',
                textureQuality: 'low'
            }
        };
        
        return configs[this.optimizationLevel] || configs.auto;
    }

    /**
     * 测量渲染时间
     */
    measureRenderTime(renderFunction) {
        const startTime = performance.now();
        renderFunction();
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        this.performanceStats.renderTime = renderTime;
        return renderTime;
    }

    /**
     * 根据性能调整质量
     */
    adjustQualityBasedOnPerformance() {
        if (!this.fpsHistory || this.fpsHistory.length === 0) {
            return;
        }

        const avgFPS = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
        
        if (avgFPS < 25) {
            this.setOptimizationLevel('low');
        } else if (avgFPS < 45) {
            this.setOptimizationLevel('medium');
        } else if (avgFPS > 55) {
            this.setOptimizationLevel('high');
        }
    }

    /**
     * 获取优化建议
     */
    getOptimizationRecommendations() {
        const recommendations = [];
        
        if (this.performanceStats.averageFPS < 30) {
            recommendations.push({
                type: 'fps',
                message: 'Low FPS detected, consider reducing particle count',
                priority: 'high'
            });
        }
        
        if (this.performanceStats.renderTime > 16) {
            recommendations.push({
                type: 'render',
                message: 'High render time, consider reducing visual effects',
                priority: 'medium'
            });
        }
        
        if (this.performanceStats.frameDrops > 10) {
            recommendations.push({
                type: 'stability',
                message: 'Frequent frame drops, consider lowering quality settings',
                priority: 'high'
            });
        }
        
        return recommendations;
    }

    /**
     * 设置优化级别
     */
    setOptimizationLevel(level) {
        if (['auto', 'high', 'medium', 'low'].includes(level)) {
            this.optimizationLevel = level;
            this.optimizationConfig = this.getOptimizationConfig();
            
            console.log(`Optimization level set to: ${level}`);
        }
    }
    
    /**
     * 缓存资源
     */
    cacheResource(key, resource, metadata = {}) {
        this.resourceCache.set(key, {
            resource: resource,
            lastUsed: performance.now(),
            useCount: 0,
            size: metadata.size || 0,
            type: metadata.type || 'unknown'
        });
        
        // 从未使用列表中移除
        this.unusedResources.delete(key);
    }
    
    /**
     * 获取缓存资源
     */
    getCachedResource(key) {
        const cached = this.resourceCache.get(key);
        if (cached) {
            cached.lastUsed = performance.now();
            cached.useCount++;
            return cached.resource;
        }
        return null;
    }
    
    /**
     * 标记资源为未使用
     */
    markResourceUnused(key) {
        if (this.resourceCache.has(key)) {
            this.unusedResources.add(key);
        }
    }
    
    /**
     * 清理未使用的资源
     */
    cleanupUnusedResources() {
        const currentTime = performance.now();
        const maxAge = 60000; // 60秒未使用则清理
        let cleanedCount = 0;
        let freedMemory = 0;
        
        for (const [key, cached] of this.resourceCache) {
            const age = currentTime - cached.lastUsed;
            
            // 清理长时间未使用的资源
            if (age > maxAge || this.unusedResources.has(key)) {
                // 清理资源
                if (cached.resource && typeof cached.resource.cleanup === 'function') {
                    cached.resource.cleanup();
                }
                
                freedMemory += cached.size || 0;
                this.resourceCache.delete(key);
                this.unusedResources.delete(key);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} unused resources, freed ~${Math.round(freedMemory / 1024)}KB`);
        }
    }
    
    /**
     * 清理旧缓存
     */
    clearOldCache() {
        const currentTime = performance.now();
        const maxCacheAge = 30000; // 30秒
        
        for (const [key, cached] of this.resourceCache) {
            if (currentTime - cached.lastUsed > maxCacheAge) {
                this.resourceCache.delete(key);
            }
        }
    }
    
    /**
     * 懒加载资源
     */
    lazyLoadResource(key, loadFunction, priority = 0) {
        if (this.resourceCache.has(key) || this.loadingResources.has(key)) {
            return Promise.resolve(this.getCachedResource(key));
        }
        
        return new Promise((resolve, reject) => {
            this.lazyLoadQueue.push({
                key: key,
                loadFunction: loadFunction,
                priority: priority,
                resolve: resolve,
                reject: reject
            });
            
            // 按优先级排序
            this.lazyLoadQueue.sort((a, b) => b.priority - a.priority);
            
            // 处理队列
            this.processLazyLoadQueue();
        });
    }
    
    /**
     * 处理懒加载队列
     */
    async processLazyLoadQueue() {
        while (this.lazyLoadQueue.length > 0 && this.loadingResources.size < this.maxConcurrentLoads) {
            const item = this.lazyLoadQueue.shift();
            this.loadingResources.add(item.key);
            
            try {
                const resource = await item.loadFunction();
                this.cacheResource(item.key, resource);
                item.resolve(resource);
            } catch (error) {
                console.error(`Failed to lazy load resource: ${item.key}`, error);
                item.reject(error);
            } finally {
                this.loadingResources.delete(item.key);
            }
        }
        
        // 如果还有队列项，稍后再处理
        if (this.lazyLoadQueue.length > 0) {
            setTimeout(() => this.processLazyLoadQueue(), 100);
        }
    }
    
    /**
     * 页面隐藏时的优化
     */
    onPageHidden() {
        console.log('Page hidden, reducing performance overhead');
        
        // 暂停非关键的性能监控
        if (this.fpsInterval) {
            clearInterval(this.fpsInterval);
            this.fpsInterval = null;
        }
        
        // 清理资源
        this.cleanupUnusedResources();
    }
    
    /**
     * 页面可见时恢复
     */
    onPageVisible() {
        console.log('Page visible, resuming performance monitoring');
        
        // 恢复性能监控
        if (!this.fpsInterval) {
            this.fpsInterval = setInterval(() => {
                this.updateFPSStats();
                this.checkPerformance();
            }, this.options.performanceCheckInterval);
        }
    }
    
    /**
     * 检查性能
     */
    checkPerformance() {
        this.performPerformanceCheck();
    }
    
    /**
     * 获取当前FPS
     */
    getCurrentFPS() {
        return this.performanceStats.currentFPS;
    }
    
    /**
     * 获取性能统计
     */
    getPerformanceStats() {
        return { ...this.performanceStats };
    }
    
    /**
     * 添加性能监听器
     */
    addPerformanceListener(listener) {
        this.performanceListeners.add(listener);
    }
    
    /**
     * 移除性能监听器
     */
    removePerformanceListener(listener) {
        this.performanceListeners.delete(listener);
    }
    
    /**
     * 通知性能监听器
     */
    notifyPerformanceListeners(event) {
        for (const listener of this.performanceListeners) {
            try {
                listener(event);
            } catch (error) {
                console.error('Performance listener error:', error);
            }
        }
    }
    
    /**
     * 强制垃圾回收（如果可用）
     */
    forceGarbageCollection() {
        if (window.gc) {
            window.gc();
            console.log('Forced garbage collection');
        }
    }
    
    /**
     * 获取内存使用情况
     */
    getMemoryUsage() {
        return { ...this.performanceStats.memoryUsage };
    }
    
    /**
     * 重置性能统计
     */
    resetStats() {
        this.performanceStats.frameCount = 0;
        this.performanceStats.totalFrames = 0;
        this.frameTimeHistory = [];
        console.log('Performance stats reset');
    }
    
    /**
     * 销毁性能管理器
     */
    destroy() {
        // 清理定时器
        if (this.fpsInterval) {
            clearInterval(this.fpsInterval);
        }
        if (this.memoryInterval) {
            clearInterval(this.memoryInterval);
        }
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        
        // 清理资源
        this.cleanupUnusedResources();
        this.resourceCache.clear();
        this.unusedResources.clear();
        
        // 清理监听器
        this.performanceListeners.clear();
        
        // 移除事件监听器
        document.removeEventListener('visibilitychange', this.onPageHidden);
        
        console.log('PerformanceManager destroyed');
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
} else if (typeof window !== 'undefined') {
    window.PerformanceManager = PerformanceManager;
}