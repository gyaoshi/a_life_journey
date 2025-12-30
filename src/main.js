/**
 * 人生旅程游戏 - 主入口文件
 * 初始化游戏并启动主循环
 * 这是整个游戏的核心控制文件，负责协调各个组件的工作
 */

// 全局游戏实例，用于在整个页面中访问游戏对象
let game = null;

/**
 * 游戏主类
 * 管理游戏的整个生命周期，从初始化到结束
 */
class LifeJourneyGame {
    /**
     * 构造函数 - 创建游戏对象时调用
     * 初始化游戏的各个组件引用和设置
     */
    constructor() {
        // 游戏画布引用
        this.canvas = null;
        // 游戏引擎 - 负责渲染和更新循环
        this.gameEngine = null;
        // 状态管理器 - 管理游戏的人生阶段和时间
        this.stateManager = null;
        // 事件系统 - 生成和管理游戏中的各种事件
        this.eventSystem = null;
        // 输入处理器 - 处理玩家的点击和触摸输入
        this.inputHandler = null;
        // 音频管理器 - 处理游戏音效和背景音乐
        this.audioManager = null;
        // 分数系统 - 计算和管理玩家分数
        this.scoreSystem = null;
        // 难度管理器 - 根据玩家表现调整游戏难度
        this.difficultyManager = null;
        // 游戏状态 - 保存游戏的全局状态
        this.gameState = null;
        // UI管理器 - 处理游戏界面的显示和交互
        this.uiManager = null;
        
        // 游戏设置
        this.settings = {
            renderStyle: 'rpg', // 渲染风格：'rpg'（角色扮演风格）或 'pixel'（像素风格）
            enableAnimations: true, // 是否启用动画效果
            showDebugInfo: false // 是否显示调试信息
        };
        
        // 游戏状态标志
        this.isInitialized = false; // 游戏是否已初始化
        this.isStarted = false; // 游戏是否已开始
        
        console.log('LifeJourneyGame created');
    }
    
    /**
     * 初始化游戏 - 异步方法，确保所有组件正确加载
     * 这是游戏启动的关键方法，负责创建和配置所有游戏组件
     */
    async initialize() {
        try {
            // 获取页面中的Canvas元素，这是游戏绘制的区域
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }
            
            // 创建游戏的核心组件
            this.audioManager = new AudioManager(); // 音频管理器
            this.gameState = new GameState(); // 游戏状态存储
            this.stateManager = new StateManager(); // 状态管理器
            // 难度管理器 - 暂时传递null作为EventSystem，稍后会设置
            this.difficultyManager = new DifficultyManager(this.stateManager, null);
            // 事件系统 - 依赖状态管理器和难度管理器
            this.eventSystem = new EventSystem(this.stateManager, this.difficultyManager);
            // 输入处理器 - 监听Canvas上的输入
            this.inputHandler = new InputHandler(this.canvas);
            this.scoreSystem = new ScoreSystem(); // 分数系统
            // 游戏引擎 - 核心渲染和更新循环
            this.gameEngine = new GameEngine(this.canvas, this.audioManager);
            
            // 为难度管理器设置EventSystem引用（之前创建时无法直接传递）
            this.difficultyManager.eventSystem = this.eventSystem;
            
            // 初始化游戏引擎，传递所有必要的组件和设置
            this.gameEngine.initialize(
                this.stateManager,
                this.eventSystem,
                this.inputHandler,
                this.scoreSystem,
                this.difficultyManager,
                this.settings
            );
            
            // 如果存在UI管理器类，初始化UI管理器
            if (typeof GameUIManager !== 'undefined') {
                this.uiManager = new GameUIManager(this.canvas, this.gameEngine);
                this.gameEngine.game = this; // 设置游戏引擎的游戏实例引用
                this.uiManager.initialize();
                console.log('GameUIManager initialized');
            }
            
            // 如果存在评价系统类，初始化评价系统
            if (typeof EvaluationSystem !== 'undefined') {
                this.evaluationSystem = new EvaluationSystem();
                console.log('EvaluationSystem initialized');
            }
            
            // 设置输入事件回调，处理玩家的点击和触摸
            this.setupInputCallbacks();
            
            // 设置游戏事件监听，处理游戏内部的各种事件
            this.setupGameEventListeners();
            
            // 标记游戏已初始化
            this.isInitialized = true;
            console.log('Game initialized successfully');
            
            // 隐藏页面上的加载文本
            const loadingText = document.getElementById('loadingText');
            if (loadingText) {
                loadingText.style.display = 'none';
            }
            
            // 如果有UI管理器，使用它来集成UI元素
            if (this.uiManager) {
                this.uiManager.integrateUIElements();
            } else {
                // 否则显示简单的开始提示
                this.showStartPrompt();
            }
            
        } catch (error) {
            // 捕获并处理初始化过程中的错误
            console.error('Failed to initialize game:', error);
            this.showError('游戏初始化失败: ' + error.message);
        }
    }
    
    /**
     * 设置输入回调 - 配置玩家输入的处理方式
     * 为不同类型的输入（点击、拖拽、触摸）设置相应的处理函数
     */
    setupInputCallbacks() {
        // 设置点击事件回调
        this.inputHandler.setClickCallback((inputEvent) => {
            if (this.gameEngine && this.isStarted) {
                // 如果游戏已开始，将点击事件传递给游戏引擎处理
                this.gameEngine.handleInput(inputEvent);
            } else if (!this.isStarted) {
                // 如果游戏未开始，点击屏幕将启动游戏
                this.startGame();
            }
        });
        
        // 设置拖拽事件回调
        this.inputHandler.setDragCallback((inputEvent) => {
            if (this.gameEngine && this.isStarted) {
                // 只有游戏已开始时，才处理拖拽事件
                this.gameEngine.handleInput(inputEvent);
            }
        });
        
        // 设置触摸事件回调
        this.inputHandler.setTouchCallback((inputEvent) => {
            // 恢复音频上下文 - 浏览器要求音频必须由用户交互触发
            if (this.audioManager) {
                this.audioManager.resumeAudioContext();
            }
        });
    }
    
    /**
     * 设置游戏事件监听 - 监听游戏内部发生的各种事件
     * 通过重写组件的方法来实现事件监听和处理
     */
    setupGameEventListeners() {
        // 监听事件完成事件
        // 保存原始的completeEvent方法，以便稍后调用
        const originalCompleteEvent = this.eventSystem.completeEvent.bind(this.eventSystem);
        // 重写completeEvent方法，添加自定义逻辑
        this.eventSystem.completeEvent = (eventId) => {
            // 找到对应的事件对象
            const event = this.eventSystem.activeEvents.find(e => e.id === eventId);
            if (event) {
                // 将完成的事件添加到分数系统，计算分数
                this.scoreSystem.addCompletedEvent(event);
                
                // 播放成功音效
                if (this.audioManager) {
                    this.audioManager.playSoundEffect('success');
                }
                
                // 更新游戏状态，记录已完成的事件
                this.gameState.completeEvent(event);
            }
            
            // 调用原始方法，确保事件系统的正常流程
            originalCompleteEvent(eventId);
        };
        
        // 监听游戏结束事件
        // 保存原始的endGame方法
        const originalEndGame = this.stateManager.endGame.bind(this.stateManager);
        // 重写endGame方法，添加自定义逻辑
        this.stateManager.endGame = () => {
            // 调用原始方法，结束游戏状态
            originalEndGame();
            // 调用自定义的游戏结束处理方法
            this.onGameEnd();
        };
    }
    
    /**
     * 开始游戏 - 启动游戏的主流程
     * 重置所有组件状态并开始游戏循环
     */
    startGame() {
        // 检查游戏是否可以开始：必须已初始化且未开始
        if (!this.isInitialized || this.isStarted) {
            console.log('Cannot start game:', { initialized: this.isInitialized, started: this.isStarted });
            return;
        }
        
        try {
            console.log('Starting game...');
            
            // 重置所有游戏组件的状态
            this.stateManager.resetGame(); // 重置状态管理器
            this.eventSystem.reset(); // 重置事件系统
            this.scoreSystem.reset(); // 重置分数系统
            this.difficultyManager.reset(); // 重置难度管理器
            this.gameState.reset(); // 重置游戏状态
            
            // 启动游戏的各个组件
            this.stateManager.startGame(); // 开始游戏状态
            this.gameState.startNewGame(); // 开始新游戏
            this.gameEngine.start(); // 启动游戏引擎的更新和渲染循环
            
            // 播放背景音乐
            if (this.audioManager) {
                this.audioManager.playBackgroundMusic();
            }
            
            // 标记游戏已开始
            this.isStarted = true;
            console.log('Game started successfully');
            console.log('Current stage:', this.stateManager.getCurrentStage());
            console.log('Game active:', this.stateManager.isGameActive());
            
        } catch (error) {
            // 处理游戏启动过程中的错误
            console.error('Failed to start game:', error);
            this.showError('游戏启动失败: ' + error.message);
        }
    }
    
    /**
     * 游戏结束处理 - 当游戏时间结束或被手动结束时调用
     * 负责处理游戏结束后的各种逻辑，如计算得分、显示结果等
     */
    onGameEnd() {
        // 标记游戏已结束
        this.isStarted = false;
        
        // 停止背景音乐
        if (this.audioManager) {
            this.audioManager.stopBackgroundMusic();
        }
        
        // 使用分数系统计算最终评价
        const finalEvaluation = this.scoreSystem.calculateFinalEvaluation();
        
        // 使用评价系统生成更详细的评价（如果可用）
        let detailedEvaluation = finalEvaluation;
        if (this.evaluationSystem) {
            detailedEvaluation = this.evaluationSystem.generateEvaluation(
                finalEvaluation.totalScore,
                finalEvaluation.totalPossibleEvents,
                finalEvaluation.completedEvents
            );
        }
        
        // 显示游戏结果
        if (this.uiManager) {
            // 如果有UI管理器，使用它来显示游戏结束屏幕
            this.uiManager.showGameEndScreen(detailedEvaluation.score, detailedEvaluation);
        } else {
            // 否则使用回退方法直接在Canvas上绘制结果
            this.showGameResult(detailedEvaluation);
        }
        
        console.log('Game ended', detailedEvaluation);
    }
    
    /**
     * 显示开始提示 - 在游戏未开始时显示在屏幕中央
     * 提示玩家点击屏幕开始游戏，并显示游戏的基本信息
     */
    showStartPrompt() {
        // 获取Canvas的2D绘图上下文
        const ctx = this.canvas.getContext('2d');
        // 获取缩放比例，用于响应式设计
        const scale = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScale() : 1;
        // 获取缩放后的画布尺寸
        const scaledSize = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScaledSize() : 
            { width: this.canvas.width, height: this.canvas.height };
        
        // 清空画布
        ctx.clearRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制背景
        ctx.fillStyle = '#1a1a2e'; // 深蓝色背景
        ctx.fillRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制游戏标题
        ctx.fillStyle = '#ffffff'; // 白色文字
        ctx.font = `bold ${32 * scale}px Arial`; // 粗体大字体
        ctx.textAlign = 'center'; // 文字居中
        ctx.fillText('人生旅程游戏', scaledSize.width / 2, scaledSize.height / 2 - 60 * scale);
        
        // 绘制副标题
        ctx.font = `${18 * scale}px Arial`; // 较小字体
        ctx.fillStyle = '#cccccc'; // 灰色文字
        ctx.fillText('100秒体验完整人生', scaledSize.width / 2, scaledSize.height / 2 - 20 * scale);
        
        // 绘制开始提示
        ctx.font = `${24 * scale}px Arial`; // 较大字体
        ctx.fillStyle = '#4ecdc4'; // 青色文字
        ctx.fillText('点击屏幕开始游戏', scaledSize.width / 2, scaledSize.height / 2 + 40 * scale);
        
        // 绘制游戏说明
        ctx.font = `${14 * scale}px Arial`; // 小字体
        ctx.fillStyle = '#999999'; // 浅灰色文字
        ctx.fillText('通过快速反应完成人生事件', scaledSize.width / 2, scaledSize.height / 2 + 80 * scale);
        ctx.fillText('思考什么才是人生中真正重要的', scaledSize.width / 2, scaledSize.height / 2 + 100 * scale);
        
        // 添加调试信息
        ctx.font = `${12 * scale}px Arial`;
        ctx.fillStyle = '#666666';
        ctx.fillText(`游戏状态: ${this.isInitialized ? '已初始化' : '未初始化'} | ${this.isStarted ? '已开始' : '未开始'}`, scaledSize.width / 2, scaledSize.height - 40 * scale);
        
        // 显示一个示例小人，让用户知道游戏正常工作
        if (this.gameEngine && this.gameEngine.pixelRenderer) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `${12 * scale}px Arial`;
            ctx.fillText('预览小人:', scaledSize.width / 2, scaledSize.height / 2 + 140 * scale);
            
            // 渲染一个成年人的示例小人
            this.gameEngine.pixelRenderer.renderCharacter(
                'adult', // 角色类型
                'idle', // 动画类型
                0, // 动画帧索引
                scaledSize.width / 2 - 30 * scale, // x坐标
                scaledSize.height / 2 + 180 * scale, // y坐标
                scale // 缩放比例
            );
        }
    }
    
    /**
     * 显示游戏结果 - 在游戏结束时显示
     * 展示玩家的得分、评价和其他游戏统计信息
     */
    showGameResult(evaluation) {
        // 获取Canvas的2D绘图上下文
        const ctx = this.canvas.getContext('2d');
        // 获取缩放比例
        const scale = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScale() : 1;
        // 获取缩放后的画布尺寸
        const scaledSize = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScaledSize() : 
            { width: this.canvas.width, height: this.canvas.height };
        
        // 清空画布
        ctx.clearRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制背景
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制结果标题
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${28 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('人生旅程结束', scaledSize.width / 2, 80 * scale);
        
        // 绘制评价等级（如：完美人生、充实人生等）
        ctx.font = `bold ${36 * scale}px Arial`;
        ctx.fillStyle = this.getEvaluationColor(evaluation.title); // 根据评价等级选择颜色
        ctx.fillText(evaluation.title, scaledSize.width / 2, 140 * scale);
        
        // 绘制评价描述
        ctx.font = `${18 * scale}px Arial`;
        ctx.fillStyle = '#cccccc';
        ctx.fillText(evaluation.description, scaledSize.width / 2, 180 * scale);
        
        // 绘制分数信息
        ctx.font = `${20 * scale}px Arial`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`完成度: ${evaluation.percentage}%`, scaledSize.width / 2, 220 * scale);
        ctx.fillText(`总分数: ${evaluation.totalScore}`, scaledSize.width / 2, 250 * scale);
        ctx.fillText(`完成事件: ${evaluation.completedEvents}/${evaluation.totalPossibleEvents}`, scaledSize.width / 2, 280 * scale);
        
        // 绘制重新开始提示
        ctx.font = `${16 * scale}px Arial`;
        ctx.fillStyle = '#4ecdc4';
        ctx.fillText('点击屏幕重新开始', scaledSize.width / 2, 340 * scale);
        
        // 绘制思考提示
        ctx.font = `${14 * scale}px Arial`;
        ctx.fillStyle = '#999999';
        ctx.fillText('回想一下，什么才是人生中最重要的？', scaledSize.width / 2, 380 * scale);
    }
    
    /**
     * 获取评价等级对应的颜色
     * 根据不同的评价等级返回不同的颜色，使界面更直观
     */
    getEvaluationColor(title) {
        const colors = {
            '匆忙人生': '#ff6b6b', // 红色 - 较低评价
            '平凡人生': '#feca57', // 黄色 - 中等评价
            '充实人生': '#48dbfb', // 蓝色 - 较高评价
            '完美人生': '#0be881'  // 绿色 - 最高评价
        };
        
        // 如果没有匹配的颜色，默认返回白色
        return colors[title] || '#ffffff';
    }
    
    /**
     * 显示错误信息 - 当游戏出现错误时调用
     * 在屏幕中央显示错误信息，方便玩家了解问题
     */
    showError(message) {
        // 获取Canvas的2D绘图上下文
        const ctx = this.canvas.getContext('2d');
        // 获取缩放比例
        const scale = this.gameEngine && this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScale() : 1;
        // 获取缩放后的画布尺寸
        const scaledSize = this.gameEngine && this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScaledSize() : 
            { width: this.canvas.width, height: this.canvas.height };
        
        // 清空画布并绘制背景
        ctx.clearRect(0, 0, scaledSize.width, scaledSize.height);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制错误标题
        ctx.fillStyle = '#ff6b6b'; // 红色文字
        ctx.font = `${20 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('错误', scaledSize.width / 2, scaledSize.height / 2 - 20 * scale);
        
        // 绘制错误信息
        ctx.fillStyle = '#ffffff'; // 白色文字
        ctx.font = `${16 * scale}px Arial`;
        ctx.fillText(message, scaledSize.width / 2, scaledSize.height / 2 + 20 * scale);
    }
    
    /**
     * 暂停游戏 - 暂停游戏的更新和渲染循环
     */
    pauseGame() {
        if (this.gameEngine && this.isStarted) {
            this.gameEngine.pause();
        }
    }
    
    /**
     * 恢复游戏 - 恢复游戏的更新和渲染循环
     */
    resumeGame() {
        if (this.gameEngine && this.isStarted) {
            this.gameEngine.resume();
        }
    }
    
    /**
     * 停止游戏 - 完全停止游戏并清理资源
     * 调用游戏引擎和其他组件的清理方法，释放资源
     */
    stopGame() {
        if (this.gameEngine) {
            this.gameEngine.cleanup();
        }
        
        if (this.audioManager) {
            this.audioManager.stopBackgroundMusic();
        }
        
        if (this.uiManager) {
            this.uiManager.cleanup();
        }
        
        this.isStarted = false;
    }
}

/**
 * 页面加载完成后初始化游戏
 * 当HTML页面完全加载后，创建游戏实例并初始化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing game...');
    
    try {
        // 创建游戏实例
        game = new LifeJourneyGame();
        // 初始化游戏
        await game.initialize();
    } catch (error) {
        console.error('Failed to create game:', error);
    }
});

/**
 * 页面可见性变化处理
 * 当页面隐藏时暂停游戏，当页面重新可见时恢复游戏
 */
document.addEventListener('visibilitychange', () => {
    if (game) {
        if (document.hidden) {
            // 页面隐藏，暂停游戏
            game.pauseGame();
        } else {
            // 页面重新可见，恢复游戏
            game.resumeGame();
        }
    }
});

/**
 * 页面卸载前清理
 * 当用户关闭页面或导航离开时，清理游戏资源
 */
window.addEventListener('beforeunload', () => {
    if (game) {
        game.stopGame();
    }
});