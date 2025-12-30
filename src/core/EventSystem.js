/**
 * EventSystem - 人生事件管理器
 * 负责人生事件的生成、管理和完成逻辑，建立事件与人生阶段的关联机制
 * 这是游戏的核心事件处理组件，控制着游戏中所有事件的生命周期
 */
class EventSystem {
    /**
     * 构造函数 - 创建事件系统实例
     * @param {StateManager} stateManager - 状态管理器实例
     * @param {DifficultyManager} difficultyManager - 难度管理器实例（可选）
     */
    constructor(stateManager, difficultyManager = null) {
        this.stateManager = stateManager; // 状态管理器引用
        this.difficultyManager = difficultyManager; // 难度管理器引用
        this.activeEvents = []; // 当前活跃的事件列表
        this.completedEvents = []; // 已完成的事件列表
        this.eventQueue = []; // 事件队列
        this.lastEventTime = 0; // 上次生成事件的时间
        this.eventIdCounter = 0; // 事件ID计数器
        
        // 事件生成配置
        this.eventGenerationInterval = 2000; // 每2秒尝试生成新事件
        this.maxActiveEvents = 3; // 最大同时活跃事件数
        
        // 初始化人生阶段事件模板
        this.eventTemplates = this.initializeEventTemplates();
        
        console.log('EventSystem initialized');
    }
    
    /**
     * 初始化事件模板 - 加载不同人生阶段的事件模板
     * @returns {Object} 事件模板对象，按人生阶段分类
     */
    initializeEventTemplates() {
        // 尝试使用外部的丰富事件数据（如果可用）
        if (typeof LifeEventsData !== 'undefined') {
            return LifeEventsData.getAllEventTemplates();
        }
        
        // 回退到基础模板（如果LifeEventsData未加载）
        return {
            // 婴儿期事件模板
            'baby': [
                {
                    name: '第一次微笑', // 事件名称
                    type: 'simple_click', // 交互类型：简单点击
                    difficulty: 1, // 难度级别：1（最简单）
                    timeLimit: 3000, // 时间限制：3秒
                    points: 10, // 完成后获得分数
                    icon: '😊', // 事件图标
                    color: '#ffb3ba', // 事件颜色
                    target: {
                        type: 'button', // 目标类型：按钮
                        size: { width: 100, height: 60 }, // 目标尺寸
                        requiredClicks: 1 // 所需点击次数
                    }
                }
            ],
            // 儿童期事件模板
            'child': [
                {
                    name: '学会走路',
                    type: 'rapid_click', // 交互类型：快速点击
                    difficulty: 2,
                    timeLimit: 3000,
                    points: 20,
                    icon: '👣',
                    color: '#bae1ff',
                    target: {
                        type: 'button',
                        size: { width: 90, height: 50 },
                        requiredClicks: 3 // 需要3次点击
                    }
                }
            ],
            // 青少年期事件模板
            'teen': [
                {
                    name: '考试及格',
                    type: 'rapid_click',
                    difficulty: 3,
                    timeLimit: 2500,
                    points: 30,
                    icon: '📝',
                    color: '#baffc9',
                    target: {
                        type: 'button',
                        size: { width: 80, height: 45 },
                        requiredClicks: 5 // 需要5次点击
                    }
                }
            ],
            // 成年期事件模板
            'adult': [
                {
                    name: '找到工作',
                    type: 'drag_target', // 交互类型：拖拽目标
                    difficulty: 4,
                    timeLimit: 2000,
                    points: 40,
                    icon: '💼',
                    color: '#ffffba',
                    target: {
                        type: 'drag_target',
                        size: { width: 70, height: 70 },
                        dragDistance: 100 // 需要拖拽100像素
                    }
                }
            ],
            // 老年期事件模板
            'elder': [
                {
                    name: '退休生活',
                    type: 'simple_click',
                    difficulty: 2,
                    timeLimit: 3000,
                    points: 30,
                    icon: '🎉',
                    color: '#ffdfba',
                    target: {
                        type: 'button',
                        size: { width: 90, height: 55 },
                        requiredClicks: 1
                    }
                }
            ]
        };
    }
    
    /**
     * 更新事件系统 - 每帧都会被调用
     * 处理事件系统的核心逻辑：更新活跃事件、生成新事件、清理完成或失败的事件
     * @param {number} deltaTime - 两帧之间的时间差(毫秒)
     */
    update(deltaTime) {
        // 更新活跃事件，调用每个活跃事件的update方法
        this.updateActiveEvents(deltaTime);
        
        // 尝试生成新事件
        this.generateEvents(deltaTime);
        
        // 清理完成或失败的事件
        this.cleanupEvents();
    }
    
    /**
     * 更新活跃事件 - 更新所有当前活跃的事件
     * @param {number} deltaTime - 两帧之间的时间差(毫秒)
     */
    updateActiveEvents(deltaTime) {
        // 遍历所有活跃事件，调用每个事件的update方法
        this.activeEvents.forEach(event => {
            event.update(deltaTime);
        });
    }
    
    /**
     * 生成新事件 - 尝试生成新的游戏事件
     * 只有在满足条件时才会生成新事件
     * @param {number} deltaTime - 两帧之间的时间差(毫秒)
     */
    generateEvents(deltaTime) {
        // 累积时间，用于判断是否需要生成新事件
        this.lastEventTime += deltaTime;
        
        // 检查是否需要生成新事件：
        // 1. 距离上次生成事件的时间超过了事件生成间隔
        // 2. 当前活跃事件数量小于最大活跃事件数
        if (this.lastEventTime >= this.eventGenerationInterval && 
            this.activeEvents.length < this.maxActiveEvents) {
            
            // 获取当前人生阶段
            const currentStage = this.stateManager.getCurrentStage();
            // 只有当游戏活跃且有当前人生阶段时，才生成事件
            if (currentStage && this.stateManager.isGameActive()) {
                // 根据当前人生阶段生成事件
                this.generateEvent(currentStage);
                // 重置事件生成时间
                this.lastEventTime = 0;
            }
        }
    }
    
    /**
     * 根据人生阶段生成事件 - 核心方法，创建具体的游戏事件
     * @param {Object} stage - 人生阶段对象
     * @returns {Object} 生成的事件对象
     */
    generateEvent(stage) {
        // 获取当前阶段的事件模板
        const templates = this.eventTemplates[stage.id];
        // 如果没有模板或模板列表为空，返回null
        if (!templates || templates.length === 0) return null;
        
        // 从模板列表中随机选择一个事件模板
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // 创建事件配置对象
        const eventConfig = {
            id: `event_${this.eventIdCounter++}`, // 生成唯一事件ID
            name: template.name, // 事件名称
            type: template.type, // 事件类型
            difficulty: this.calculateEventDifficulty(template.difficulty, stage.difficulty), // 计算事件难度
            timeLimit: this.calculateTimeLimit(template.timeLimit, stage.difficulty), // 计算事件时间限制
            points: template.points, // 事件分数
            position: this.generateEventPosition(), // 生成事件位置
            target: { ...template.target } // 复制事件目标配置
        };
        
        // 根据难度调整目标配置
        this.adjustTargetForDifficulty(eventConfig.target, eventConfig.difficulty);
        
        // 创建事件实例
        const event = new LifeEvent(eventConfig);
        
        // 将事件添加到活跃事件列表
        this.activeEvents.push(event);
        
        console.log(`Generated event: ${event.name} (difficulty: ${eventConfig.difficulty})`);
        
        return event;
    }
    
    /**
     * 计算事件难度 - 根据基础难度和阶段难度计算最终事件难度
     * @param {number} baseDifficulty - 事件模板的基础难度
     * @param {number} stageDifficulty - 人生阶段的难度
     * @returns {number} 计算后的事件难度
     */
    calculateEventDifficulty(baseDifficulty, stageDifficulty) {
        // 如果有难度管理器，使用难度管理器计算难度
        if (this.difficultyManager) {
            return this.difficultyManager.calculateEventDifficulty(baseDifficulty, this.stateManager.getCurrentStage()?.id);
        }
        // 否则使用简单的计算公式：基础难度 + 阶段难度 - 1，最大为5
        return Math.min(5, baseDifficulty + stageDifficulty - 1);
    }
    
    /**
     * 计算时间限制 - 根据基础时间限制和阶段难度计算最终时间限制
     * @param {number} baseTimeLimit - 事件模板的基础时间限制
     * @param {number} stageDifficulty - 人生阶段的难度
     * @returns {number} 计算后的事件时间限制
     */
    calculateTimeLimit(baseTimeLimit, stageDifficulty) {
        // 如果有难度管理器，使用难度管理器调整时间限制
        if (this.difficultyManager) {
            const difficulty = this.difficultyManager.calculateEventDifficulty(1, this.stateManager.getCurrentStage()?.id);
            return this.difficultyManager.adjustTimeLimit(baseTimeLimit, difficulty);
        }
        // 否则使用简单的计算公式：难度越高，时间越短
        const difficultyFactor = 1 - (stageDifficulty - 1) * 0.15; // 难度因子，难度越高，因子越小
        return Math.max(1000, baseTimeLimit * difficultyFactor); // 最低1秒
    }
    
    /**
     * 生成事件位置 - 随机生成事件在画布上的位置
     * @returns {Object} 事件位置坐标 {x, y}
     */
    generateEventPosition() {
        // 获取画布元素
        const canvas = document.getElementById('gameCanvas');
        // 如果没有找到画布，返回默认位置
        if (!canvas) {
            return { x: 400, y: 300 }; // 默认位置
        }
        
        // 边距，确保事件不会出现在屏幕边缘
        const margin = 100;
        // 随机生成x坐标，范围是边距到画布宽度减去边距
        const x = margin + Math.random() * (canvas.width - 2 * margin);
        // 随机生成y坐标，范围是边距到画布高度减去边距
        const y = margin + Math.random() * (canvas.height - 2 * margin);
        
        return { x, y };
    }
    
    /**
     * 根据难度调整目标配置 - 根据事件难度调整事件目标的属性
     * 难度越高，目标要求越严格
     * @param {Object} target - 事件目标配置
     * @param {number} difficulty - 事件难度
     */
    adjustTargetForDifficulty(target, difficulty) {
        // 根据目标类型调整不同的属性
        switch (target.type) {
            case 'button':
                // 如果难度大于等于3，增加所需点击次数
                if (difficulty >= 3) {
                    target.requiredClicks = Math.max(target.requiredClicks, difficulty);
                }
                break;
                
            case 'drag_target':
                // 增加拖拽距离，难度越高，拖拽距离越长
                target.dragDistance = target.dragDistance * (1 + (difficulty - 1) * 0.3);
                break;
                
            case 'moving_object':
                // 增加移动物体的速度
                target.speed = target.speed * (1 + (difficulty - 1) * 0.4);
                // 减小移动物体的尺寸，难度越高，物体越小
                target.size.width = Math.max(30, target.size.width - (difficulty - 1) * 5);
                target.size.height = Math.max(30, target.size.height - (difficulty - 1) * 5);
                break;
        }
    }
    
    /**
     * 处理玩家交互 - 处理玩家的输入，判断是否与事件交互成功
     * @param {Object} inputEvent - 输入事件对象
     * @returns {boolean} 是否成功处理了交互
     */
    processInteraction(inputEvent) {
        let interactionHandled = false; // 标记是否处理了交互
        
        // 遍历所有活跃事件
        for (const event of this.activeEvents) {
            // 检查事件是否活跃且点击位置在事件范围内
            if (event.isActive() && event.isPointInside(inputEvent.x, inputEvent.y)) {
                // 处理事件交互
                const success = event.handleInteraction(inputEvent);
                
                if (success) {
                    // 如果交互成功，处理事件完成
                    this.onEventCompleted(event);
                    interactionHandled = true;
                    break; // 只处理第一个匹配的事件
                }
            }
        }
        
        return interactionHandled;
    }
    
    /**
     * 事件完成处理 - 当事件被成功完成时调用
     * @param {Object} event - 完成的事件对象
     */
    onEventCompleted(event) {
        console.log(`Event completed: ${event.name} (+${event.points} points)`);
        
        // 如果有难度管理器，记录交互结果
        if (this.difficultyManager) {
            const completionTime = event.getDuration();
            this.difficultyManager.recordInteractionResult(true, event.difficulty, completionTime);
        }
        
        // 触发成功反馈
        this.triggerSuccessFeedback(event);
        
        // 将事件添加到已完成事件列表
        this.completedEvents.push(event);
        
        // 从活跃事件列表中移除事件
        const index = this.activeEvents.indexOf(event);
        if (index > -1) {
            this.activeEvents.splice(index, 1);
        }
    }
    
    /**
     * 事件失败处理
     */
    onEventFailed(event) {
        console.log(`Event failed: ${event.name}`);
        
        // 记录到难度管理器
        if (this.difficultyManager) {
            this.difficultyManager.recordInteractionResult(false, event.difficulty, null);
        }
        
        // 触发失败反馈
        this.triggerFailureFeedback(event);
        
        // 从活跃列表移除
        const index = this.activeEvents.indexOf(event);
        if (index > -1) {
            this.activeEvents.splice(index, 1);
        }
    }
    
    /**
     * 触发成功反馈
     */
    triggerSuccessFeedback(event) {
        // 这里可以触发视觉和音频反馈
        // 例如：粒子效果、音效播放等
        
        // 创建成功反馈事件
        const feedbackEvent = new CustomEvent('eventCompleted', {
            detail: {
                event: event,
                points: event.points,
                position: event.position
            }
        });
        
        document.dispatchEvent(feedbackEvent);
    }
    
    /**
     * 触发失败反馈
     */
    triggerFailureFeedback(event) {
        // 创建失败反馈事件
        const feedbackEvent = new CustomEvent('eventFailed', {
            detail: {
                event: event,
                position: event.position
            }
        });
        
        document.dispatchEvent(feedbackEvent);
    }
    
    /**
     * 清理完成或失败的事件
     */
    cleanupEvents() {
        // 移除失败的事件
        const failedEvents = this.activeEvents.filter(event => event.failed);
        failedEvents.forEach(event => this.onEventFailed(event));
    }
    
    /**
     * 完成指定事件
     */
    completeEvent(eventId) {
        const event = this.activeEvents.find(e => e.id === eventId);
        if (event && event.isActive()) {
            event.complete();
            this.onEventCompleted(event);
            return true;
        }
        return false;
    }
    
    /**
     * 获取活跃事件列表
     */
    getActiveEvents() {
        return [...this.activeEvents];
    }
    
    /**
     * 获取已完成事件列表
     */
    getCompletedEvents() {
        return [...this.completedEvents];
    }
    
    /**
     * 获取总完成事件数
     */
    getTotalCompletedEvents() {
        return this.completedEvents.length;
    }
    
    /**
     * 获取总分数
     */
    getTotalScore() {
        return this.completedEvents.reduce((total, event) => total + event.points, 0);
    }
    
    /**
     * 获取当前阶段的事件统计
     */
    getStageEventStats(stageId) {
        const stageEvents = this.completedEvents.filter(event => {
            const templates = this.eventTemplates[stageId] || [];
            return templates.some(template => template.name === event.name);
        });
        
        return {
            completed: stageEvents.length,
            totalScore: stageEvents.reduce((total, event) => total + event.points, 0),
            averageTime: this.calculateAverageCompletionTime(stageEvents)
        };
    }
    
    /**
     * 计算平均完成时间
     */
    calculateAverageCompletionTime(events) {
        if (events.length === 0) return 0;
        
        const totalTime = events.reduce((total, event) => total + event.getDuration(), 0);
        return totalTime / events.length;
    }
    
    /**
     * 重置事件系统
     */
    reset() {
        this.activeEvents = [];
        this.completedEvents = [];
        this.eventQueue = [];
        this.lastEventTime = 0;
        this.eventIdCounter = 0;
        
        console.log('EventSystem reset');
    }
    
    /**
     * 暂停事件生成
     */
    pauseEventGeneration() {
        this.eventGenerationPaused = true;
    }
    
    /**
     * 恢复事件生成
     */
    resumeEventGeneration() {
        this.eventGenerationPaused = false;
    }
    
    /**
     * 获取事件生成统计
     */
    getEventGenerationStats() {
        const totalEvents = this.completedEvents.length + this.activeEvents.length;
        const completionRate = totalEvents > 0 ? (this.completedEvents.length / totalEvents) * 100 : 0;
        
        return {
            totalGenerated: totalEvents,
            completed: this.completedEvents.length,
            active: this.activeEvents.length,
            completionRate: completionRate,
            totalScore: this.getTotalScore()
        };
    }
    
    /**
     * 序列化事件系统状态
     */
    serialize() {
        return {
            activeEvents: this.activeEvents.map(event => event.serialize()),
            completedEvents: this.completedEvents.map(event => event.serialize()),
            lastEventTime: this.lastEventTime,
            eventIdCounter: this.eventIdCounter
        };
    }
    
    /**
     * 从序列化数据恢复状态
     */
    deserialize(data) {
        this.activeEvents = data.activeEvents.map(eventData => LifeEvent.deserialize(eventData));
        this.completedEvents = data.completedEvents.map(eventData => LifeEvent.deserialize(eventData));
        this.lastEventTime = data.lastEventTime || 0;
        this.eventIdCounter = data.eventIdCounter || 0;
        
        console.log('EventSystem state restored');
    }
}