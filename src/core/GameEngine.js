/**
 * GameEngine - 主游戏循环和渲染管理
 * 负责游戏的核心循环、渲染管道和基础生命周期管理
 * 集成性能监控和错误处理
 * 这是游戏的核心文件，控制着游戏的每帧更新和渲染
 */
class GameEngine {
    /**
     * 构造函数 - 创建游戏引擎实例
     * @param {HTMLCanvasElement} canvas - 游戏画布元素
     * @param {AudioManager} audioManager - 音频管理器实例
     */
    constructor(canvas, audioManager) {
        this.canvas = canvas; // 游戏画布
        this.ctx = canvas.getContext('2d'); // 2D绘图上下文
        this.audioManager = audioManager; // 音频管理器引用
        this.isRunning = false; // 游戏是否正在运行
        this.isPaused = false; // 游戏是否暂停
        this.lastFrameTime = 0; // 上一帧的时间戳
        this.targetFPS = 60; // 目标帧率（每秒60帧）
        this.frameInterval = 1000 / this.targetFPS; // 每帧间隔时间（毫秒）
        
        // 游戏核心组件引用
        this.stateManager = null; // 状态管理器 - 管理游戏阶段和时间
        this.eventSystem = null; // 事件系统 - 生成和管理游戏事件
        this.inputHandler = null; // 输入处理器 - 处理玩家输入
        this.scoreSystem = null; // 分数系统 - 计算和管理分数
        this.responsiveManager = null; // 响应式管理器 - 处理不同屏幕尺寸
        this.difficultyManager = null; // 难度管理器 - 调整游戏难度
        
        // 性能和错误管理组件
        this.performanceManager = null; // 性能管理器 - 监控和优化性能
        this.errorHandler = null; // 错误处理器 - 处理游戏错误
        
        // 性能优化设置
        this.optimizationConfig = {
            maxParticles: 50, // 最大粒子数量
            enableShadows: true, // 是否启用阴影效果
            enableBlur: true, // 是否启用模糊效果
            renderScale: 1.0, // 渲染缩放比例
            maxActiveEvents: 4 // 最大同时活跃事件数
        };
        
        // 绑定方法上下文，确保在事件回调中this指向正确
        this.gameLoop = this.gameLoop.bind(this);
        
        // 初始化性能和错误管理组件
        this.initializeManagers();
    }
    
    /**
     * 初始化管理器 - 初始化性能和错误管理组件
     * 这些组件负责监控游戏性能和处理错误
     */
    initializeManagers() {
        try {
            // 初始化性能管理器（如果可用）
            if (typeof PerformanceManager !== 'undefined') {
                this.performanceManager = new PerformanceManager();
                
                // 监听优化级别变更事件，更新优化配置
                document.addEventListener('optimizationLevelChanged', (e) => {
                    this.updateOptimizationConfig(e.detail.level);
                });
            }
            
            // 初始化错误处理器（如果可用）
            if (typeof ErrorHandler !== 'undefined') {
                this.errorHandler = new ErrorHandler();
                
                // 监听恢复模式进入事件
                document.addEventListener('recoveryModeEntered', () => {
                    this.enterSafeMode();
                });
                
                // 监听恢复模式退出事件
                document.addEventListener('recoveryModeExited', () => {
                    this.exitSafeMode();
                });
            }
        } catch (error) {
            console.error('Failed to initialize managers:', error);
        }
    }
    
    /**
     * 初始化游戏引擎和所有组件
     * 这是游戏引擎的核心初始化方法，负责设置所有游戏组件和系统
     * @param {StateManager} stateManager - 状态管理器实例
     * @param {EventSystem} eventSystem - 事件系统实例
     * @param {InputHandler} inputHandler - 输入处理器实例
     * @param {ScoreSystem} scoreSystem - 分数系统实例
     * @param {DifficultyManager} difficultyManager - 难度管理器实例
     * @param {Object} gameSettings - 游戏设置
     */
    initialize(stateManager, eventSystem, inputHandler, scoreSystem, difficultyManager, gameSettings = null) {
        try {
            // 设置游戏核心组件引用
            this.stateManager = stateManager; // 状态管理器
            this.eventSystem = eventSystem; // 事件系统
            this.inputHandler = inputHandler; // 输入处理器
            this.scoreSystem = scoreSystem; // 分数系统
            this.difficultyManager = difficultyManager; // 难度管理器
            this.gameSettings = gameSettings; // 游戏设置
            
            // 初始化响应式管理器，处理不同屏幕尺寸
            this.responsiveManager = new ResponsiveManager(this.canvas);
            
            // 初始化动画引擎（如果可用）
            if (typeof AnimationEngine !== 'undefined') {
                this.animationEngine = new AnimationEngine(this.canvas, {
                    fps: this.targetFPS, // 动画帧率
                    quality: this.optimizationConfig.animationQuality || 'high', // 动画质量
                    autoResize: true // 自动调整大小
                });
                
                // 设置动画引擎的游戏计时器控制回调
                this.animationEngine.onGameTimerPause = () => {
                    this.pause(); // 动画暂停时暂停游戏
                };
                
                this.animationEngine.onGameTimerResume = () => {
                    this.resume(); // 动画恢复时恢复游戏
                };
                
                console.log('AnimationEngine integrated with GameEngine');
            }
            
            // 初始化角色渲染器（如果可用）
            if (typeof CharacterRenderer !== 'undefined') {
                this.characterRenderer = new CharacterRenderer(this.ctx, {
                    quality: this.optimizationConfig.animationQuality || 'high' // 渲染质量
                });
                console.log('CharacterRenderer initialized');
            }
            
            // 初始化移动控制器（如果角色渲染器可用）
            if (typeof MovementController !== 'undefined' && this.characterRenderer) {
                this.movementController = new MovementController(this.characterRenderer, {
                    speed: 200, // 移动速度（像素/秒）
                    easing: 'easeOutQuad' // 缓动函数
                });
                console.log('MovementController initialized');
            }
            
            // 初始化交互管理器（如果可用）
            if (typeof InteractionManager !== 'undefined') {
                this.interactionManager = new InteractionManager(this.canvas, {
                    movementController: this.movementController, // 移动控制器引用
                    animationEngine: this.animationEngine // 动画引擎引用
                });
                console.log('InteractionManager initialized');
            }
            
            // 初始化交互圈渲染器（如果可用）
            if (typeof InteractionCircleRenderer !== 'undefined') {
                this.interactionCircleRenderer = new InteractionCircleRenderer(this.ctx, {
                    defaultRadius: 30, // 默认半径
                    strokeWidth: 4, // 描边宽度
                    animationSpeed: 0.05, // 动画速度
                    pulseIntensity: 0.3, // 脉冲强度
                    sparkleCount: 8, // 闪光数量
                    glowRadius: 10 // 发光半径
                });
                console.log('InteractionCircleRenderer initialized');
            }
            
            // 初始化动画可见性管理器（如果动画引擎可用）
            if (typeof AnimationVisibilityManager !== 'undefined' && this.animationEngine) {
                this.animationVisibilityManager = new AnimationVisibilityManager(this.canvas, this.animationEngine, {
                    centerPosition: { 
                        x: this.canvas.width / 2, 
                        y: this.canvas.height / 2 
                    }, // 中心位置
                    minSize: { 
                        width: 200, 
                        height: 150 
                    }, // 最小尺寸
                    maxSize: { 
                        width: this.canvas.width * 0.8, 
                        height: this.canvas.height * 0.8 
                    } // 最大尺寸
                });
                
                // 将可见性管理器设置到动画引擎中
                this.animationEngine.setAnimationVisibilityManager(this.animationVisibilityManager);
                
                console.log('AnimationVisibilityManager initialized and connected to AnimationEngine');
            }
            
            // 初始化评价系统（如果可用）
            if (typeof EvaluationSystem !== 'undefined') {
                this.evaluationSystem = new EvaluationSystem();
                console.log('EvaluationSystem initialized');
            }
            
            // 初始化像素艺术渲染器（如果可用）
            if (typeof PixelArtRenderer !== 'undefined') {
                this.pixelRenderer = new PixelArtRenderer(this.canvas);
            }
            
            // 初始化RPG风格渲染器（如果可用）
            if (typeof RPGStyleRenderer !== 'undefined') {
                this.rpgRenderer = new RPGStyleRenderer(this.canvas);
            }
            
            // 设置事件监听器，监听游戏内部事件
            this.setupEventListeners();
            
            // 设置动画系统集成，将动画与游戏逻辑结合
            this.setupAnimationIntegration();
            
            console.log('GameEngine initialized with enhanced graphics and animation system');
        } catch (error) {
            // 处理初始化过程中的错误
            if (this.errorHandler) {
                this.errorHandler.handleError(this.errorHandler.errorTypes.STATE_ERROR, error, {
                    component: 'GameEngine',
                    method: 'initialize'
                });
            } else {
                console.error('GameEngine initialization failed:', error);
            }
        }
    }
    
    /**
     * 更新优化配置 - 根据性能级别调整游戏设置
     * 当性能管理器检测到性能问题时，会触发此方法
     * @param {string} level - 优化级别（如：low, medium, high）
     */
    updateOptimizationConfig(level) {
        if (this.performanceManager) {
            // 从性能管理器获取最新的优化配置
            this.optimizationConfig = this.performanceManager.getOptimizationConfig();
            
            // 将优化设置应用到各个组件
            if (this.eventSystem && this.optimizationConfig.maxActiveEvents) {
                // 限制最大活跃事件数
                this.eventSystem.maxActiveEvents = this.optimizationConfig.maxActiveEvents;
            }
            
            // 输出优化信息
            console.log('Performance optimization applied');
            console.log(`Applied optimization config for level: ${level}`, this.optimizationConfig);
        }
    }
    
    /**
     * 进入安全模式 - 当游戏出现严重错误时调用
     * 禁用高级功能，降低游戏复杂度，确保基本功能正常运行
     */
    enterSafeMode() {
        console.warn('Entering safe mode due to critical errors');
        
        // 禁用高级功能，降低性能消耗
        console.log('Advanced features disabled for performance');
        
        // 设置像素渲染器为简单模式
        if (this.pixelRenderer) {
            this.pixelRenderer.setSimpleMode(true);
        }
        
        // 降低目标帧率，减少CPU消耗
        this.targetFPS = 30;
        this.frameInterval = 1000 / this.targetFPS;
        
        // 减少同时活跃的事件数量
        if (this.eventSystem) {
            this.eventSystem.maxActiveEvents = 1;
        }
    }
    
    /**
     * 退出安全模式 - 当游戏恢复正常时调用
     * 恢复正常的游戏设置和功能
     */
    exitSafeMode() {
        console.log('Exiting safe mode');
        
        // 恢复正常的目标帧率
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        // 恢复性能模式
        console.log('Performance mode enabled');
        
        // 关闭像素渲染器的简单模式
        if (this.pixelRenderer) {
            this.pixelRenderer.setSimpleMode(false);
        }
        
        // 恢复优化配置
        this.updateOptimizationConfig(this.performanceManager?.optimizationLevel || 'medium');
    }
    
    /**
     * 开始游戏循环 - 启动游戏的主循环
     * 调用requestAnimationFrame来触发游戏的每帧更新和渲染
     */
    start() {
        // 如果游戏已经在运行，直接返回
        if (this.isRunning) return;
        
        // 更新游戏状态标志
        this.isRunning = true;
        this.isPaused = false;
        this.lastFrameTime = performance.now(); // 记录当前时间，用于计算帧间隔
        
        console.log('Game started');
        // 启动游戏循环，requestAnimationFrame会在浏览器准备好绘制下一帧时调用gameLoop方法
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * 暂停游戏 - 暂停游戏的更新和渲染
     * 游戏仍然保持运行状态，但不会继续更新和渲染
     */
    pause() {
        this.isPaused = true; // 设置暂停标志
        console.log('Game paused');
    }
    
    /**
     * 恢复游戏 - 恢复暂停的游戏
     * 继续游戏的更新和渲染循环
     */
    resume() {
        // 如果游戏没有在运行，直接返回
        if (!this.isRunning) return;
        
        this.isPaused = false; // 取消暂停标志
        this.lastFrameTime = performance.now(); // 重置帧时间
        console.log('Game resumed');
        // 重新启动游戏循环
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * 停止游戏 - 完全停止游戏循环
     * 游戏不再运行，也不会响应恢复命令
     */
    stop() {
        this.isRunning = false; // 设置运行标志为false
        this.isPaused = false; // 取消暂停标志
        console.log('Game stopped');
    }
    
    /**
     * 清理资源 - 释放游戏使用的所有资源
     * 当游戏结束或需要重新初始化时调用
     */
    cleanup() {
        this.stop(); // 先停止游戏
        
        // 清理各个组件资源
        // 清理动画系统
        if (this.animationEngine) {
            this.animationEngine.destroy();
            this.animationEngine = null;
        }
        
        // 清理角色渲染器
        if (this.characterRenderer) {
            this.characterRenderer.cleanup();
            this.characterRenderer = null;
        }
        
        // 清理移动控制器
        if (this.movementController) {
            this.movementController.cleanup();
            this.movementController = null;
        }
        
        // 清理交互管理器
        if (this.interactionManager) {
            this.interactionManager.cleanup();
            this.interactionManager = null;
        }
        
        // 清理交互圈渲染器
        if (this.interactionCircleRenderer) {
            this.interactionCircleRenderer.reset();
            this.interactionCircleRenderer = null;
        }
        
        // 清理动画可见性管理器
        if (this.animationVisibilityManager) {
            this.animationVisibilityManager.destroy();
            this.animationVisibilityManager = null;
        }
        
        // 清理评价系统
        if (this.evaluationSystem) {
            this.evaluationSystem.hideEvaluation();
            this.evaluationSystem = null;
        }
        
        // 清理响应式管理器
        if (this.responsiveManager) {
            this.responsiveManager.destroy();
            this.responsiveManager = null;
        }
        
        // 清理RPG风格渲染器
        if (this.rpgRenderer) {
            this.rpgRenderer.reset();
            this.rpgRenderer = null;
        }
        
        // 清理像素艺术渲染器
        if (this.pixelRenderer) {
            this.pixelRenderer.reset();
            this.pixelRenderer = null;
        }
        
        console.log('GameEngine cleanup completed');
    }
    
    /**
     * 设置动画系统集成 - 将动画系统与游戏逻辑集成
     * 通过重写其他组件的方法，实现动画与游戏逻辑的联动
     */
    setupAnimationIntegration() {
        // 监听游戏开始事件，播放出生动画
        const originalStartGame = this.stateManager.startGame?.bind(this.stateManager);
        if (originalStartGame) {
            // 重写startGame方法，添加出生动画
            this.stateManager.startGame = async () => {
                console.log('Starting game with birth animation...');
                
                // 播放出生动画（如果动画引擎可用）
                if (this.animationEngine) {
                    try {
                        await this.animationEngine.playBirthAnimation(); // 等待出生动画完成
                        console.log('Birth animation completed, starting normal game flow');
                    } catch (error) {
                        console.error('Birth animation failed:', error);
                    }
                }
                
                // 启动正常游戏流程
                originalStartGame();
            };
        }
        
        // 监听阶段转换，更新角色形态
        const originalTransition = this.stateManager.transitionToStage?.bind(this.stateManager);
        if (originalTransition) {
            // 重写transitionToStage方法，添加角色形态更新
            this.stateManager.transitionToStage = (newStage) => {
                const oldStage = this.stateManager.getCurrentStage(); // 获取当前阶段
                const result = originalTransition(newStage); // 调用原始方法
                
                // 更新角色形态（如果角色渲染器可用）
                if (this.characterRenderer && newStage) {
                    this.characterRenderer.transitionToStage(oldStage?.id, newStage.id, 1000);
                }
                
                console.log('Stage transition with character form update:', oldStage?.id, '->', newStage?.id);
                
                return result;
            };
        }
        
        // 监听事件生成，集成移动和动画
        const originalGenerateEvent = this.eventSystem.generateEvent?.bind(this.eventSystem);
        if (originalGenerateEvent) {
            // 重写generateEvent方法，添加交互和动画处理
            this.eventSystem.generateEvent = (stage) => {
                const event = originalGenerateEvent(stage); // 调用原始方法生成事件
                
                // 如果有交互管理器，协调移动和事件
                if (this.interactionManager && event) {
                    this.interactionManager.handleEventGenerated(event);
                }
                
                // 显示交互圈（如果交互圈渲染器可用）
                if (this.interactionCircleRenderer && event) {
                    this.interactionCircleRenderer.showInteractionCircle(
                        { x: event.position.x, y: event.position.y },
                        'active'
                    );
                }
                
                return event;
            };
        }
        
        // 监听输入事件，集成移动控制
        const originalHandleInput = this.handleInput.bind(this);
        this.handleInput = (inputEvent) => {
            // 处理角色移动（如果移动控制器可用）
            if (this.movementController && inputEvent.type === 'click') {
                this.movementController.moveToPosition(inputEvent.x, inputEvent.y);
            }
            
            // 处理交互事件（如果交互管理器可用）
            if (this.interactionManager) {
                this.interactionManager.handleInput(inputEvent);
            }
            
            // 调用原始输入处理
            originalHandleInput(inputEvent);
        };
        
        console.log('Animation system integration completed');
    }
    
    /**
     * 设置事件监听器 - 监听游戏中的各种事件
     * 处理事件完成和失败时的视觉反馈
     */
    setupEventListeners() {
        // 监听事件完成事件
        document.addEventListener('eventCompleted', (e) => {
            console.log('Event completed:', e.detail.event.name);
            
            // 处理交互圈完成状态
            if (this.interactionCircleRenderer) {
                this.interactionCircleRenderer.onInteractionComplete();
            }
        });
        
        // 监听事件失败事件
        document.addEventListener('eventFailed', (e) => {
            console.log('Event failed:', e.detail.event.name);
            
            // 处理交互圈超时状态
            if (this.interactionCircleRenderer) {
                this.interactionCircleRenderer.onInteractionTimeout();
            }
        });
        
        // 监听阶段转换事件
        if (this.stateManager) {
            const originalTransition = this.stateManager.transitionToStage?.bind(this.stateManager);
            if (originalTransition) {
                this.stateManager.transitionToStage = (newStage) => {
                    const oldStage = this.stateManager.getCurrentStage();
                    const result = originalTransition(newStage);
                    
                    console.log('Stage transition:', oldStage?.id, '->', newStage?.id);
                    
                    return result;
                };
            }
        }
    }
    
    /**
     * 主游戏循环 - 游戏的核心方法，每帧都会被调用
     * 控制游戏的更新和渲染，确保帧率稳定
     * @param {number} currentTime - 当前时间戳（毫秒）
     */
    gameLoop(currentTime) {
        // 如果游戏没有运行或暂停，直接返回
        if (!this.isRunning || this.isPaused) return;
        
        // 计算两帧之间的时间差（毫秒）
        const deltaTime = currentTime - this.lastFrameTime;
        
        // 控制帧率，确保游戏以稳定的帧率运行
        if (deltaTime >= this.frameInterval) {
            // 使用性能管理器测量更新和渲染时间（如果可用）
            if (this.performanceManager) {
                // 测量更新时间
                this.performanceManager.measureUpdateTime(() => {
                    this.update(deltaTime); // 更新游戏状态
                });
                
                // 测量渲染时间
                this.performanceManager.measureRenderTime(() => {
                    this.render(); // 渲染游戏画面
                });
                
                // 更新性能管理器
                this.performanceManager.update(deltaTime);
            } else {
                // 没有性能管理器时，直接更新和渲染
                this.update(deltaTime);
                this.render();
            }
            
            // 更新上一帧时间
            this.lastFrameTime = currentTime;
        }
        
        // 继续下一帧游戏循环
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * 更新游戏状态 - 每帧都会调用，更新所有游戏组件的状态
     * @param {number} deltaTime - 两帧之间的时间差（毫秒）
     */
    update(deltaTime) {
        try {
            // 更新状态管理器，管理游戏阶段和时间
            if (this.stateManager) {
                this.stateManager.update(deltaTime);
            }
            
            // 更新事件系统，生成和管理游戏事件
            if (this.eventSystem) {
                this.eventSystem.update(deltaTime);
            }
            
            // 更新分数系统，计算和更新分数
            if (this.scoreSystem) {
                this.scoreSystem.update(deltaTime);
            }
            
            // 难度管理器不需要定期更新，它响应事件
            if (this.difficultyManager) {
                // DifficultyManager doesn't need regular updates, it responds to events
            }
            
            // 更新动画系统（如果可用）
            if (this.animationEngine) {
                // 动画引擎有自己的更新循环，但我们可以在这里同步状态
                const currentStage = this.stateManager.getCurrentStage();
                if (currentStage && this.animationEngine.currentStageId !== currentStage.id) {
                    this.animationEngine.currentStageId = currentStage.id;
                }
            }
            
            // 更新角色渲染器（如果可用）
            if (this.characterRenderer) {
                this.characterRenderer.update(deltaTime);
            }
            
            // 更新移动控制器（如果可用）
            if (this.movementController) {
                this.movementController.update(deltaTime);
            }
            
            // 更新交互管理器（如果可用）
            if (this.interactionManager) {
                this.interactionManager.update(deltaTime);
            }
            
            // 更新交互圈渲染器（如果可用）
            if (this.interactionCircleRenderer) {
                this.interactionCircleRenderer.update(deltaTime);
            }
            
            // 更新动画可见性管理器（如果可用）
            if (this.animationVisibilityManager) {
                this.animationVisibilityManager.update(deltaTime);
            }
            
            // 更新游戏逻辑
            this.updateGameLogic(deltaTime);
        } catch (error) {
            // 处理更新过程中的错误
            if (this.errorHandler) {
                this.errorHandler.handleError(this.errorHandler.errorTypes.STATE_ERROR, error, {
                    component: 'GameEngine',
                    method: 'update',
                    deltaTime: deltaTime
                });
            } else {
                console.error('Update error:', error);
            }
        }
    }
    
    /**
     * 更新游戏逻辑 - 处理额外的游戏逻辑
     * 这里可以添加特殊效果、动画状态同步等额外逻辑
     * @param {number} deltaTime - 两帧之间的时间差（毫秒）
     */
    updateGameLogic(deltaTime) {
        // 同步动画系统状态
        if (this.animationEngine && this.stateManager) {
            const currentStage = this.stateManager.getCurrentStage();
            if (currentStage && this.animationEngine.currentStageId !== currentStage.id) {
                this.animationEngine.currentStageId = currentStage.id;
            }
        }
    }
    
    /**
     * 渲染游戏画面 - 每帧都会调用，绘制游戏的所有元素
     * 按照背景、角色、事件、UI的顺序渲染，确保正确的层级关系
     */
    render() {
        try {
            // 获取缩放信息，用于响应式设计
            const scale = this.responsiveManager ? this.responsiveManager.getScale() : 1;
            const scaledSize = this.responsiveManager ? this.responsiveManager.getScaledSize() : 
                { width: this.canvas.width, height: this.canvas.height };
            
            // 应用渲染缩放优化，降低渲染分辨率以提高性能
            const renderScale = this.optimizationConfig.renderScale || 1.0;
            if (renderScale !== 1.0) {
                this.ctx.save(); // 保存当前绘图状态
                this.ctx.scale(renderScale, renderScale); // 应用缩放
            }
            
            // 清空画布，准备绘制新帧
            this.ctx.clearRect(0, 0, scaledSize.width / renderScale, scaledSize.height / renderScale);
            
            // 渲染背景
            const renderStyle = this.gameSettings?.renderStyle || 'rpg'; // 获取渲染风格，默认rpg
            
            // 根据渲染风格渲染不同的背景
            if (renderStyle === 'rpg' && this.rpgRenderer && this.stateManager) {
                // RPG风格渲染
                const currentStage = this.stateManager.getCurrentStage();
                // 获取角色位置
                const characterPosition = this.movementController ? 
                    this.movementController.getCurrentPosition() : 
                    { x: scaledSize.width / 2, y: scaledSize.height / 2 };
                
                if (currentStage) {
                    // 使用RPG风格渲染完整场景
                    this.rpgRenderer.renderRPGScene(
                        currentStage.id, // 人生阶段ID
                        characterPosition.x, // 角色x坐标
                        characterPosition.y, // 角色y坐标
                        scale * renderScale // 缩放比例
                    );
                }
            } else if (renderStyle === 'pixel' && this.pixelRenderer && this.stateManager) {
                // 像素风格渲染
                const currentStage = this.stateManager.getCurrentStage();
                if (currentStage) {
                    this.pixelRenderer.renderBackground(currentStage.id, scale * renderScale);
                }
            } else {
                // 回退到基础背景渲染
                this.ctx.fillStyle = '#1a1a2e'; // 深蓝色背景
                this.ctx.fillRect(0, 0, scaledSize.width / renderScale, scaledSize.height / renderScale);
            }
            
            // 渲染角色
            if (renderStyle === 'rpg' && this.rpgRenderer && this.stateManager) {
                // RPG渲染器已经在renderRPGScene中渲染了角色，这里不需要重复渲染
            } else if (this.characterRenderer && this.stateManager) {
                // 使用角色渲染器渲染角色
                const currentStage = this.stateManager.getCurrentStage();
                const characterPosition = this.movementController ? 
                    this.movementController.getCurrentPosition() : 
                    { x: scaledSize.width / 2, y: scaledSize.height / 2 };
                
                if (currentStage) {
                    this.characterRenderer.renderCharacter(
                        currentStage.id, // 人生阶段ID
                        characterPosition, // 角色位置
                        'neutral' // 角色情绪（可以根据游戏状态动态变化）
                    );
                }
            } else {
                // 回退到基础角色渲染
                this.renderGameState(scale * renderScale, scaledSize);
            }
            
            // 渲染游戏组件
            if (this.eventSystem) {
                this.renderEvents(scale * renderScale, scaledSize);
            }
            
            // 渲染交互圈（如果可用）
            if (this.interactionCircleRenderer) {
                this.interactionCircleRenderer.render();
            }
            
            // 渲染UI
            if (this.scoreSystem) {
                this.renderUI(scale * renderScale, scaledSize);
            }
            
            // 标记渲染完成
            this.renderComplete = true;
            
            // 渲染性能信息（调试模式下）
            if (this.performanceManager && window.DEBUG_MODE) {
                this.renderPerformanceInfo(scale * renderScale);
            }
            
            // 恢复渲染缩放
            if (renderScale !== 1.0) {
                this.ctx.restore(); // 恢复之前保存的绘图状态
            }
        } catch (error) {
            // 处理渲染过程中的错误
            if (this.errorHandler) {
                this.errorHandler.handleError(this.errorHandler.errorTypes.RENDER_ERROR, error, {
                    component: 'GameEngine',
                    method: 'render'
                });
            } else {
                console.error('Render error:', error);
                // 尝试基础渲染，确保游戏不会完全崩溃
                this.renderFallback();
            }
        }
    }
    
    /**
     * 渲染性能信息 - 在调试模式下显示游戏性能数据
     * 包括帧率、渲染时间、更新时间等
     * @param {number} scale - 缩放比例
     */
    renderPerformanceInfo(scale) {
        // 如果没有性能管理器，直接返回
        if (!this.performanceManager) return;
        
        // 获取性能数据
        const fps = this.performanceManager.getCurrentFPS();
        const stats = this.performanceManager.performanceStats;
        
        // 绘制半透明背景框
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10 * scale, 10 * scale, 200 * scale, 100 * scale);
        
        // 绘制性能文字
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${12 * scale}px monospace`;
        this.ctx.fillText(`FPS: ${fps}`, 15 * scale, 30 * scale); // 当前帧率
        this.ctx.fillText(`Avg: ${stats.averageFPS.toFixed(1)}`, 15 * scale, 45 * scale); // 平均帧率
        this.ctx.fillText(`Render: ${stats.renderTime.toFixed(2)}ms`, 15 * scale, 60 * scale); // 渲染时间
        this.ctx.fillText(`Update: ${stats.updateTime.toFixed(2)}ms`, 15 * scale, 75 * scale); // 更新时间
        
        // 如果有内存使用数据，也显示出来
        if (stats.memoryUsage) {
            this.ctx.fillText(`Memory: ${stats.memoryUsage.used}MB`, 15 * scale, 90 * scale);
        }
    }
    
    /**
     * 回退渲染 - 当主要渲染方法失败时调用
     * 显示简单的游戏运行中信息，确保游戏不会完全崩溃
     */
    renderFallback() {
        try {
            // 绘制背景
            this.ctx.fillStyle = '#1a1a2e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制文字
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏运行中...', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('(安全模式)', this.canvas.width / 2, this.canvas.height / 2 + 30);
        } catch (fallbackError) {
            console.error('Fallback render also failed:', fallbackError);
        }
    }
    
    /**
     * 渲染游戏状态 - 回退渲染方法，当没有专用渲染器时使用
     * 直接在Canvas上绘制游戏状态，包括人生阶段、角色和进度条
     * @param {number} scale - 缩放比例
     * @param {Object} scaledSize - 缩放后的尺寸
     */
    renderGameState(scale = 1, scaledSize = { width: this.canvas.width, height: this.canvas.height }) {
        // 获取当前人生阶段和进度
        const currentStage = this.stateManager.getCurrentStage();
        const progress = this.stateManager.getStageProgress();
        
        // 渲染当前人生阶段背景
        this.ctx.fillStyle = this.getStageColor(currentStage);
        this.ctx.fillRect(0, 0, scaledSize.width, scaledSize.height * 0.7);
        
        // 渲染人生阶段文字
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${24 * scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            currentStage ? currentStage.name : '准备开始',
            scaledSize.width / 2,
            50 * scale
        );
        
        // 渲染角色（小人）
        if (this.pixelRenderer && currentStage) {
            // 计算角色位置（屏幕中央偏下）
            const characterX = scaledSize.width / 2 - 50 * scale;
            const characterY = scaledSize.height / 2;
            
            // 根据游戏状态选择合适的动画
            let animation = 'idle'; // 默认空闲动画
            if (this.stateManager.isGameActive()) {
                // 如果游戏处于活跃状态，根据当前阶段和事件情况选择动画
                const activeEvents = this.eventSystem ? this.eventSystem.getActiveEvents() : [];
                if (activeEvents.length > 0) {
                    // 有活跃事件时，根据阶段选择不同动画
                    animation = currentStage.id === 'teen' ? 'excited' : 
                               currentStage.id === 'adult' ? 'working' : 
                               currentStage.id === 'elder' ? 'peaceful' : 'happy';
                } else {
                    // 没有活跃事件时，根据阶段选择不同动画
                    animation = currentStage.id === 'child' ? 'walking' : 'idle';
                }
            }
            
            // 渲染角色
            this.pixelRenderer.renderCharacter(
                currentStage.id, // 人生阶段ID
                animation, // 动画类型
                Math.floor(Date.now() / 500) % 2, // 简单的帧动画，每500ms切换一帧
                characterX, // 角色x坐标
                characterY, // 角色y坐标
                scale // 缩放比例
            );
            
            // 渲染场景元素，根据不同阶段显示不同元素
            if (currentStage.id === 'baby') {
                this.pixelRenderer.renderSceneElement('baby', 'crib', characterX + 100 * scale, characterY - 50 * scale, scale * 0.8);
            } else if (currentStage.id === 'child') {
                this.pixelRenderer.renderSceneElement('child', 'playground', characterX - 100 * scale, characterY - 30 * scale, scale * 0.6);
            } else if (currentStage.id === 'teen') {
                this.pixelRenderer.renderSceneElement('teen', 'classroom', characterX + 80 * scale, characterY - 40 * scale, scale * 0.7);
            } else if (currentStage.id === 'adult') {
                this.pixelRenderer.renderSceneElement('adult', 'office', characterX - 80 * scale, characterY - 60 * scale, scale * 0.5);
                this.pixelRenderer.renderSceneElement('adult', 'house', characterX + 120 * scale, characterY - 20 * scale, scale * 0.6);
            } else if (currentStage.id === 'elder') {
                this.pixelRenderer.renderSceneElement('elder', 'garden', characterX - 60 * scale, characterY + 20 * scale, scale * 0.8);
                this.pixelRenderer.renderSceneElement('elder', 'rocking_chair', characterX + 80 * scale, characterY - 10 * scale, scale * 0.7);
            }
        }
        
        // 渲染进度条
        this.renderProgressBar(progress, scale, scaledSize);
    }
    
    /**
     * 渲染事件 - 渲染所有活跃的游戏事件
     * 遍历活跃事件列表，为每个事件调用renderEvent方法
     * @param {number} scale - 缩放比例
     * @param {Object} scaledSize - 缩放后的尺寸
     */
    renderEvents(scale = 1, scaledSize = { width: this.canvas.width, height: this.canvas.height }) {
        // 获取活跃事件列表
        const activeEvents = this.eventSystem.getActiveEvents();
        
        // 遍历活跃事件，逐个渲染
        activeEvents.forEach(event => {
            this.renderEvent(event, scale, scaledSize);
        });
    }
    
    /**
     * 渲染单个事件 - 渲染一个具体的游戏事件
     * 根据事件类型和配置，渲染不同的视觉效果
     * @param {Object} event - 事件对象
     * @param {number} scale - 缩放比例
     * @param {Object} scaledSize - 缩放后的尺寸
     */
    renderEvent(event, scale = 1, scaledSize = { width: this.canvas.width, height: this.canvas.height }) {
        // 事件位置
        const x = event.position.x * scale;
        const y = event.position.y * scale;
        
        // 使用像素艺术渲染器渲染事件（如果可用）
        if (this.pixelRenderer) {
            this.pixelRenderer.renderEventIcon(event, x, y, scale);
        } else {
            // 回退到基础渲染
            const width = (event.target?.size?.width || 100) * scale;
            const height = (event.target?.size?.height || 50) * scale;
            
            // 渲染事件背景
            this.ctx.fillStyle = event.color || '#ff6b6b';
            this.ctx.fillRect(x - width/2, y - height/2, width, height);
            
            // 渲染事件图标
            if (event.icon) {
                this.ctx.font = `${24 * scale}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(event.icon, x, y - 10 * scale);
            }
            
            // 渲染事件文字
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `${12 * scale}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(event.name, x, y + 10 * scale);
        }
        
        // 渲染进度指示器（如果事件有进度）
        if (event.getProgress && typeof event.getProgress === 'function') {
            const progress = event.getProgress();
            if (progress > 0 && progress < 1) {
                this.renderEventProgress(event, x, y, progress, scale);
            }
        }
        
        // 渲染时间指示器（当事件时间不足30%时）
        const timeRatio = event.getTimeRemainingRatio ? event.getTimeRemainingRatio() : 1;
        if (timeRatio < 0.3) {
            this.renderUrgencyIndicator(event, x, y, timeRatio, scale);
        }
    }
    
    /**
     * 渲染UI界面 - 渲染游戏的用户界面元素
     * 包括分数和剩余时间等信息
     * @param {number} scale - 缩放比例
     * @param {Object} scaledSize - 缩放后的尺寸
     */
    renderUI(scale = 1, scaledSize = { width: this.canvas.width, height: this.canvas.height }) {
        // 获取分数和剩余时间
        const score = this.scoreSystem.getTotalScore();
        const timeLeft = this.stateManager.getTimeLeft();
        
        // 渲染分数
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${20 * scale}px Arial`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${score}`, 20 * scale, 30 * scale);
        
        // 渲染剩余时间
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`时间: ${Math.ceil(timeLeft)}s`, scaledSize.width - 20 * scale, 30 * scale);
    }
    
    /**
     * 渲染进度条 - 渲染人生阶段的进度条
     * 显示当前阶段的完成进度
     * @param {number} progress - 进度（0-1之间的数值）
     * @param {number} scale - 缩放比例
     * @param {Object} scaledSize - 缩放后的尺寸
     */
    renderProgressBar(progress, scale = 1, scaledSize = { width: this.canvas.width, height: this.canvas.height }) {
        // 进度条尺寸和位置
        const barWidth = scaledSize.width * 0.8;
        const barHeight = 10 * scale;
        const x = (scaledSize.width - barWidth) / 2;
        const y = scaledSize.height - 50 * scale;
        
        // 使用像素艺术渲染器渲染进度条（如果可用）
        if (this.pixelRenderer) {
            this.pixelRenderer.renderPixelProgressBar(x, y, barWidth, barHeight, progress, scale);
        } else {
            // 回退到基础渲染
            // 渲染进度条背景
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(x, y, barWidth, barHeight);
            
            // 渲染进度填充
            this.ctx.fillStyle = '#4ecdc4';
            this.ctx.fillRect(x, y, barWidth * progress, barHeight);
        }
    }
    
    /**
     * 渲染事件进度指示器 - 渲染事件的完成进度
     * 显示事件的完成情况，使用环形进度条
     * @param {Object} event - 事件对象
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {number} progress - 进度（0-1之间的数值）
     * @param {number} scale - 缩放比例
     */
    renderEventProgress(event, x, y, progress, scale) {
        const radius = 30 * scale;
        const centerX = x;
        const centerY = y + 40 * scale;
        
        // 渲染进度圆环背景
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 4 * scale;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 渲染进度填充
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + Math.PI * 2 * progress);
        this.ctx.stroke();
    }
    
    /**
     * 渲染紧急指示器 - 当事件时间不足时显示
     * 使用脉冲动画效果，提醒玩家尽快完成事件
     * @param {Object} event - 事件对象
     * @param {number} x - x坐标
     * @param {number} y - y坐标
     * @param {number} timeRatio - 剩余时间比例（0-1之间的数值）
     * @param {number} scale - 缩放比例
     */
    renderUrgencyIndicator(event, x, y, timeRatio, scale) {
        // 计算脉冲强度，时间越少强度越大
        const pulseIntensity = 1 - timeRatio;
        // 计算透明度，使用正弦函数实现脉冲效果
        const alpha = 0.3 + 0.7 * Math.sin(Date.now() / 100) * pulseIntensity;
        
        this.ctx.save(); // 保存当前绘图状态
        this.ctx.globalAlpha = alpha; // 设置透明度
        this.ctx.fillStyle = '#ff4757'; // 红色
        
        // 计算紧急指示器大小
        const size = (event.target?.size?.width || 100) * scale * (1 + pulseIntensity * 0.2);
        // 绘制紧急指示器
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        
        this.ctx.restore(); // 恢复绘图状态
    }
    
    /**
     * 获取人生阶段对应的颜色 - 根据不同的人生阶段返回不同的背景色
     * @param {Object} stage - 人生阶段对象
     * @returns {string} 颜色值（十六进制格式）
     */
    getStageColor(stage) {
        if (!stage) return '#1a1a2e'; // 默认颜色
        
        // 不同人生阶段对应的颜色
        const colors = {
            'baby': '#ffb3ba', // 婴儿期 - 浅红色
            'child': '#bae1ff', // 儿童期 - 浅蓝色
            'teen': '#baffc9', // 青少年期 - 浅绿色
            'adult': '#ffffba', // 成年期 - 浅黄色
            'elder': '#ffdfba'  // 老年期 - 浅橙色
        };
        
        return colors[stage.id] || '#1a1a2e'; // 如果没有匹配的颜色，返回默认颜色
    }
    
    /**
     * 处理输入事件 - 处理玩家的输入，如点击和拖拽
     * 将输入事件传递给相应的组件处理
     * @param {Object} inputEvent - 输入事件对象
     */
    handleInput(inputEvent) {
        // 直接使用原始点击坐标，不进行转换
        // 修复移动到点击位置有偏差的问题
        
        // 处理事件交互
        if (this.eventSystem) {
            this.eventSystem.processInteraction(inputEvent);
        }
        
        // 处理角色移动（如果是点击事件）
        if (this.movementController && inputEvent.type === 'click') {
            this.movementController.moveToPosition(inputEvent.x, inputEvent.y);
        }
    }
}