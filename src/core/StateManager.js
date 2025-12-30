/**
 * StateManager - 人生阶段状态机
 * 负责管理游戏的人生阶段转换和时间进度跟踪
 * 这是游戏的核心状态管理组件，控制着游戏的时间流逝和人生阶段变化
 */
class StateManager {
    /**
     * 构造函数 - 创建状态管理器实例
     * 初始化游戏状态和人生阶段定义
     */
    constructor() {
        this.currentStage = null; // 当前人生阶段
        this.gameTime = 0; // 游戏已进行时间(毫秒)
        this.totalGameTime = 100000; // 总游戏时间100秒(毫秒)
        this.isGameActive = false; // 游戏是否活跃
        this.isGameComplete = false; // 游戏是否完成
        
        // 人生阶段定义数组，包含5个人生阶段
        this.lifeStages = [
            {
                id: 'baby', // 阶段ID
                name: '婴儿期', // 阶段名称
                duration: 15000, // 持续时间(15秒)
                difficulty: 1, // 难度级别(1-5)
                startTime: 0 // 开始时间(从游戏开始算起)
            },
            {
                id: 'child',
                name: '儿童期',
                duration: 20000, // 20秒
                difficulty: 2,
                startTime: 15000 // 从第15秒开始
            },
            {
                id: 'teen',
                name: '青少年期',
                duration: 20000, // 20秒
                difficulty: 3,
                startTime: 35000 // 从第35秒开始
            },
            {
                id: 'adult',
                name: '成年期',
                duration: 30000, // 30秒
                difficulty: 4,
                startTime: 55000 // 从第55秒开始
            },
            {
                id: 'elder',
                name: '老年期',
                duration: 15000, // 15秒
                difficulty: 3,
                startTime: 85000 // 从第85秒开始
            }
        ];
        
        console.log('StateManager initialized');
    }
    
    /**
     * 开始游戏 - 初始化游戏状态，准备开始游戏
     * 重置游戏时间，设置游戏为活跃状态，进入第一个人生阶段
     */
    startGame() {
        this.gameTime = 0; // 重置游戏时间
        this.isGameActive = true; // 设置游戏为活跃状态
        this.isGameComplete = false; // 游戏未完成
        this.currentStage = this.lifeStages[0]; // 进入第一个人生阶段(婴儿期)
        
        console.log('Game started - entering', this.currentStage.name);
    }
    
    /**
     * 重置游戏状态 - 将游戏状态恢复到初始状态
     * 用于重新开始游戏或退出游戏时
     */
    resetGame() {
        this.gameTime = 0; // 重置游戏时间
        this.isGameActive = false; // 游戏不活跃
        this.isGameComplete = false; // 游戏未完成
        this.currentStage = null; // 没有当前阶段
        
        console.log('Game reset');
    }
    
    /**
     * 更新游戏时间和状态 - 每帧都会被调用
     * 增加游戏时间，检查阶段转换，检查游戏结束
     * @param {number} deltaTime - 两帧之间的时间差(毫秒)
     */
    update(deltaTime) {
        // 如果游戏不活跃或已完成，直接返回
        if (!this.isGameActive || this.isGameComplete) return;
        
        this.gameTime += deltaTime; // 增加游戏时间
        
        // 检查是否需要切换人生阶段
        this.checkStageTransition();
        
        // 检查游戏是否结束
        if (this.gameTime >= this.totalGameTime) {
            this.endGame(); // 结束游戏
        }
    }
    
    /**
     * 检查并执行人生阶段转换 - 检查当前时间是否需要切换到下一个人生阶段
     */
    checkStageTransition() {
        // 根据当前游戏时间获取应该处于的人生阶段
        const newStage = this.getStageForTime(this.gameTime);
        
        // 如果新阶段和当前阶段不同，执行转换
        if (newStage && newStage.id !== this.currentStage.id) {
            this.transitionToStage(newStage);
        }
    }
    
    /**
     * 根据时间获取对应的人生阶段 - 给定一个时间点，返回对应的人生阶段
     * @param {number} time - 游戏时间(毫秒)
     * @returns {Object} 对应的人生阶段对象
     */
    getStageForTime(time) {
        // 从最后一个阶段开始检查，找到第一个时间大于等于该阶段开始时间的阶段
        for (let i = this.lifeStages.length - 1; i >= 0; i--) {
            if (time >= this.lifeStages[i].startTime) {
                return this.lifeStages[i];
            }
        }
        return this.lifeStages[0]; // 默认返回第一个阶段
    }
    
    /**
     * 切换到指定的人生阶段 - 执行人生阶段的转换
     * @param {Object} stage - 要切换到的人生阶段对象
     */
    transitionToStage(stage) {
        const previousStage = this.currentStage; // 记录当前阶段
        this.currentStage = stage; // 设置新的当前阶段
        
        console.log(`Stage transition: ${previousStage?.name || 'None'} -> ${stage.name}`);
        
        // 触发阶段切换事件
        this.onStageTransition(previousStage, stage);
    }
    
    /**
     * 阶段切换事件处理 - 当人生阶段切换时调用
     * 可以在这里添加阶段切换的特殊逻辑，如播放动画、音效等
     * @param {Object} previousStage - 之前的人生阶段
     * @param {Object} newStage - 新的人生阶段
     */
    onStageTransition(previousStage, newStage) {
        // 可以在这里添加阶段切换的特殊逻辑
        // 比如播放过渡动画、音效等
    }
    
    /**
     * 结束游戏 - 当游戏时间结束时调用
     * 设置游戏为非活跃状态和完成状态
     */
    endGame() {
        this.isGameActive = false; // 游戏不再活跃
        this.isGameComplete = true; // 游戏已完成
        
        console.log('Game completed');
    }
    
    /**
     * 获取当前人生阶段 - 返回当前游戏所处的人生阶段
     * @returns {Object} 当前人生阶段对象
     */
    getCurrentStage() {
        return this.currentStage;
    }
    
    /**
     * 获取当前阶段的进度 - 返回当前人生阶段的完成进度(0-1之间的数值)
     * @returns {number} 当前阶段的进度(0-1)
     */
    getStageProgress() {
        if (!this.currentStage) return 0; // 如果没有当前阶段，返回0
        
        // 计算当前阶段已经过的时间
        const stageElapsed = this.gameTime - this.currentStage.startTime;
        // 返回进度，最大为1
        return Math.min(stageElapsed / this.currentStage.duration, 1);
    }
    
    /**
     * 获取游戏总进度 - 返回整个游戏的完成进度(0-1之间的数值)
     * @returns {number} 游戏总进度(0-1)
     */
    getGameProgress() {
        // 返回游戏总进度，最大为1
        return Math.min(this.gameTime / this.totalGameTime, 1);
    }
    
    /**
     * 获取剩余时间 - 返回游戏剩余时间(秒)
     * @returns {number} 剩余时间(秒)
     */
    getTimeLeft() {
        // 计算剩余时间
        const timeLeft = this.totalGameTime - this.gameTime;
        // 返回剩余时间，最小为0
        return Math.max(timeLeft / 1000, 0);
    }
    
    /**
     * 获取已用时间 - 返回游戏已经进行的时间(秒)
     * @returns {number} 已用时间(秒)
     */
    getElapsedTime() {
        return this.gameTime / 1000; // 将毫秒转换为秒
    }
    
    /**
     * 检查游戏是否完成 - 返回游戏是否已经完成
     * @returns {boolean} 游戏是否完成
     */
    isGameComplete() {
        return this.isGameComplete;
    }
    
    /**
     * 检查游戏是否活跃 - 返回游戏是否处于活跃状态
     * @returns {boolean} 游戏是否活跃
     */
    isGameActive() {
        return this.isGameActive;
    }
    
    /**
     * 获取所有人生阶段 - 返回所有定义的人生阶段数组
     * @returns {Array} 人生阶段数组
     */
    getAllStages() {
        return [...this.lifeStages]; // 返回人生阶段数组的副本
    }
    
    /**
     * 根据ID获取人生阶段 - 根据阶段ID返回对应的人生阶段对象
     * @param {string} stageId - 人生阶段ID
     * @returns {Object} 对应的人生阶段对象
     */
    getStageById(stageId) {
        // 使用find方法查找匹配的阶段
        return this.lifeStages.find(stage => stage.id === stageId);
    }
}