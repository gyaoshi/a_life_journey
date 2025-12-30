/**
 * LifeEvent - 人生事件数据模型
 * 定义人生事件的属性和行为，是游戏中所有事件的基础类
 * 每个人生事件都有自己的生命周期、交互方式和视觉表现
 */
class LifeEvent {
    /**
     * 构造函数 - 创建人生事件实例
     * @param {Object} config - 事件配置对象
     * @param {string} config.id - 事件唯一标识符
     * @param {string} config.name - 事件名称
     * @param {string} config.type - 交互类型（如：button、drag_target、moving_object）
     * @param {number} config.difficulty - 事件难度（1-5）
     * @param {number} config.timeLimit - 事件时间限制（毫秒）
     * @param {number} config.points - 完成事件获得的分数
     * @param {Object} config.position - 事件在屏幕上的位置 {x, y}
     * @param {Object} config.target - 交互目标配置
     */
    constructor(config) {
        this.id = config.id; // 事件唯一ID
        this.name = config.name; // 事件名称（如："第一次微笑"、"学会走路"）
        this.type = config.type; // 交互类型（按钮点击、拖拽、移动物体等）
        this.difficulty = config.difficulty; // 事件难度等级
        this.timeLimit = config.timeLimit; // 事件总时间限制(毫秒)
        this.timeRemaining = config.timeLimit; // 事件剩余时间(毫秒)
        this.points = config.points; // 完成事件后获得的分数
        this.position = config.position || { x: 0, y: 0 }; // 事件在屏幕上的位置，默认为(0, 0)
        this.target = config.target; // 交互目标的具体配置
        
        // 事件状态标记
        this.completed = false; // 事件是否已完成
        this.failed = false; // 事件是否已失败
        this.startTime = Date.now(); // 事件开始时间
        this.completedTime = null; // 事件完成时间，未完成则为null
        
        // 交互状态记录
        this.clickCount = 0; // 已点击次数
        this.dragDistance = 0; // 已拖拽距离
        this.lastInteractionTime = 0; // 上次交互时间
        
        // 视觉表现属性
        this.scale = 1.0; // 缩放比例
        this.opacity = 1.0; // 透明度
        
        console.log(`LifeEvent created: ${this.name}`); // 日志：事件创建成功
    }
    
    /**
     * 更新事件状态 - 每帧都会被调用
     * @param {number} deltaTime - 两帧之间的时间差（毫秒）
     * 功能：更新事件剩余时间，检查是否超时，并处理移动目标的位置更新
     */
    update(deltaTime) {
        // 如果事件已完成或失败，不再更新
        if (this.completed || this.failed) return;
        
        // 更新剩余时间
        this.timeRemaining -= deltaTime;
        
        // 检查是否超时
        if (this.timeRemaining <= 0) {
            this.fail(); // 调用失败方法
            return;
        }
        
        // 如果是移动物体类型，更新其位置
        if (this.target.type === 'moving_object') {
            this.updateMovingTarget(deltaTime);
        }
    }
    
    /**
     * 更新移动目标位置 - 处理移动物体类型事件的位置更新
     * @param {number} deltaTime - 两帧之间的时间差（毫秒）
     * 功能：根据速度和边界条件更新移动物体的位置，实现反弹效果
     */
    updateMovingTarget(deltaTime) {
        // 如果还没有初始化移动参数，先初始化
        if (!this.movement) {
            this.movement = {
                vx: (Math.random() - 0.5) * this.target.speed, // 随机水平速度
                vy: (Math.random() - 0.5) * this.target.speed, // 随机垂直速度
                bounds: this.getMovementBounds() // 移动边界
            };
        }
        
        // 根据速度和时间差更新位置
        this.position.x += this.movement.vx * deltaTime / 1000;
        this.position.y += this.movement.vy * deltaTime / 1000;
        
        // 处理边界反弹
        const bounds = this.movement.bounds;
        if (this.position.x <= bounds.left || this.position.x >= bounds.right) {
            this.movement.vx *= -1; // 水平方向反弹
        }
        if (this.position.y <= bounds.top || this.position.y >= bounds.bottom) {
            this.movement.vy *= -1; // 垂直方向反弹
        }
        
        // 确保物体不会超出边界
        this.position.x = Math.max(bounds.left, Math.min(bounds.right, this.position.x));
        this.position.y = Math.max(bounds.top, Math.min(bounds.bottom, this.position.y));
    }
    
    /**
     * 获取移动边界 - 计算移动物体的活动范围
     * @returns {Object} 边界对象 {left, right, top, bottom}
     * 功能：确保移动物体不会超出屏幕可视范围，并留出UI空间
     */
    getMovementBounds() {
        // 获取游戏画布元素
        const canvas = document.getElementById('gameCanvas');
        // 计算边界margin，确保物体不会完全移出屏幕
        const margin = Math.max(this.target.size.width, this.target.size.height) / 2;
        
        // 返回边界对象
        return {
            left: margin, // 左边界
            right: canvas.width - margin, // 右边界
            top: 100, // 上边界（留出顶部UI空间）
            bottom: canvas.height - 100 // 下边界（留出底部UI空间）
        };
    }
    
    /**
     * 处理交互输入 - 处理玩家的交互输入
     * @param {Object} inputEvent - 输入事件对象
     * @param {string} inputEvent.type - 输入类型（click, drag等）
     * @param {number} inputEvent.x - 输入位置的x坐标
     * @param {number} inputEvent.y - 输入位置的y坐标
     * @param {number} inputEvent.deltaX - 拖拽距离x分量（仅拖拽事件）
     * @param {number} inputEvent.deltaY - 拖拽距离y分量（仅拖拽事件）
     * @returns {boolean} 交互是否成功完成事件
     * 功能：根据事件类型调用相应的交互处理方法
     */
    handleInteraction(inputEvent) {
        // 如果事件已完成或失败，不再处理交互
        if (this.completed || this.failed) return false;
        
        // 更新上次交互时间
        this.lastInteractionTime = Date.now();
        
        // 根据目标类型调用不同的交互处理方法
        switch (this.target.type) {
            case 'button':
                return this.handleButtonClick(inputEvent);
            case 'drag_target':
                return this.handleDragInteraction(inputEvent);
            case 'moving_object':
                return this.handleMovingObjectClick(inputEvent);
            default:
                return false;
        }
    }
    
    /**
     * 处理按钮点击 - 处理按钮类型事件的点击交互
     * @param {Object} inputEvent - 输入事件对象
     * @returns {boolean} 交互是否成功完成事件
     * 功能：记录点击次数，达到要求次数则完成事件
     */
    handleButtonClick(inputEvent) {
        // 只处理点击事件
        if (inputEvent.type === 'click') {
            this.clickCount++; // 增加点击次数
            
            // 如果点击次数达到或超过要求次数，完成事件
            if (this.clickCount >= this.target.requiredClicks) {
                this.complete(); // 调用完成方法
                return true; // 返回成功
            }
        }
        
        return false; // 点击次数不足，返回失败
    }
    
    /**
     * 处理拖拽交互 - 处理拖拽类型事件的交互
     * @param {Object} inputEvent - 输入事件对象
     * @returns {boolean} 交互是否成功完成事件
     * 功能：计算拖拽距离，达到要求距离则完成事件
     */
    handleDragInteraction(inputEvent) {
        // 只处理拖拽事件
        if (inputEvent.type === 'drag') {
            // 计算拖拽的直线距离
            const distance = Math.sqrt(
                Math.pow(inputEvent.deltaX, 2) + Math.pow(inputEvent.deltaY, 2)
            );
            
            // 记录最大拖拽距离
            this.dragDistance = Math.max(this.dragDistance, distance);
            
            // 如果拖拽距离达到或超过要求距离，完成事件
            if (this.dragDistance >= this.target.dragDistance) {
                this.complete(); // 调用完成方法
                return true; // 返回成功
            }
        }
        
        return false; // 拖拽距离不足，返回失败
    }
    
    /**
     * 处理移动物体点击 - 处理移动物体类型事件的点击交互
     * @param {Object} inputEvent - 输入事件对象
     * @returns {boolean} 交互是否成功完成事件
     * 功能：点击移动物体即可完成事件
     */
    handleMovingObjectClick(inputEvent) {
        // 只处理点击事件
        if (inputEvent.type === 'click') {
            this.complete(); // 调用完成方法
            return true; // 返回成功
        }
        
        return false; // 不是点击事件，返回失败
    }
    
    /**
     * 完成事件 - 将事件标记为已完成
     * 功能：设置事件状态为已完成，记录完成时间，并输出日志
     */
    complete() {
        // 如果事件已完成或失败，不再处理
        if (this.completed || this.failed) return;
        
        this.completed = true; // 设置事件为已完成状态
        this.completedTime = Date.now(); // 记录完成时间
        
        console.log(`Event completed: ${this.name} (+${this.points} points)`); // 日志：事件完成
    }
    
    /**
     * 事件失败 - 将事件标记为失败
     * 功能：设置事件状态为失败，并输出日志
     */
    fail() {
        // 如果事件已完成或失败，不再处理
        if (this.completed || this.failed) return;
        
        this.failed = true; // 设置事件为失败状态
        
        console.log(`Event failed: ${this.name}`); // 日志：事件失败
    }
    
    /**
     * 检查点击是否在事件区域内 - 判断鼠标/触摸点是否在事件范围内
     * @param {number} x - 点击位置的x坐标
     * @param {number} y - 点击位置的y坐标
     * @returns {boolean} 点击位置是否在事件范围内
     * 功能：使用距离计算判断点击是否在事件目标的圆形范围内
     */
    isPointInside(x, y) {
        // 计算点击位置与事件中心的距离
        const dx = x - this.position.x;
        const dy = y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算事件目标的半径（取宽高最大值的一半）
        const radius = Math.max(this.target.size.width, this.target.size.height) / 2;
        // 如果距离小于等于半径，说明点击在范围内
        return distance <= radius;
    }
    
    /**
     * 获取事件的渲染信息 - 用于UI渲染的事件信息
     * @returns {Object} 渲染信息对象
     * 功能：提供事件的位置、大小、颜色、文本等渲染所需信息
     */
    getRenderInfo() {
        return {
            position: { ...this.position }, // 事件位置
            size: { ...this.target.size }, // 事件大小
            scale: this.scale, // 缩放比例
            opacity: this.opacity, // 透明度
            color: this.getEventColor(), // 事件颜色
            text: this.getDisplayText(), // 显示文本
            progress: this.getProgress() // 完成进度
        };
    }
    
    /**
     * 获取事件颜色 - 根据剩余时间动态调整事件颜色
     * @returns {string} 事件颜色的十六进制值
     * 功能：根据剩余时间比例返回不同颜色，用于视觉反馈
     */
    getEventColor() {
        // 计算紧急程度比例（剩余时间越少，比例越高）
        const urgencyRatio = 1 - (this.timeRemaining / this.timeLimit);
        
        if (urgencyRatio > 0.8) {
            return '#ff4757'; // 红色 - 非常紧急（剩余时间不足20%）
        } else if (urgencyRatio > 0.5) {
            return '#ffa502'; // 橙色 - 紧急（剩余时间20%-50%）
        } else {
            return '#2ed573'; // 绿色 - 正常（剩余时间50%以上）
        }
    }
    
    /**
     * 获取显示文本 - 生成事件的显示文本
     * @returns {string} 事件的显示文本
     * 功能：根据事件类型生成带有进度信息的显示文本
     */
    getDisplayText() {
        let text = this.name; // 基础文本为事件名称
        
        // 根据事件类型添加不同的进度信息
        if (this.target.type === 'rapid_click') {
            // 快速点击类型：显示已点击次数/总次数
            text += `\n(${this.clickCount}/${this.target.requiredClicks})`;
        } else if (this.target.type === 'drag_target') {
            // 拖拽类型：显示拖拽进度百分比
            const progress = Math.min(100, (this.dragDistance / this.target.dragDistance) * 100);
            text += `\n(${Math.round(progress)}%)`;
        }
        
        return text; // 返回完整显示文本
    }
    
    /**
     * 获取完成进度(0-1) - 计算事件的完成进度
     * @returns {number} 完成进度，范围0-1
     * 功能：根据事件类型和当前交互状态计算完成进度
     */
    getProgress() {
        switch (this.target.type) {
            case 'button':
            case 'moving_object':
                // 按钮和移动物体类型：点击次数达到要求则100%，否则0%
                return this.clickCount >= this.target.requiredClicks ? 1 : 0;
            case 'rapid_click':
                // 快速点击类型：已点击次数/总次数
                return this.clickCount / this.target.requiredClicks;
            case 'drag_target':
                // 拖拽类型：已拖拽距离/总距离，最大为1
                return Math.min(1, this.dragDistance / this.target.dragDistance);
            default:
                return 0; // 未知类型，返回0%
        }
    }
    
    /**
     * 获取剩余时间百分比 - 计算事件剩余时间比例
     * @returns {number} 剩余时间比例，范围0-1
     * 功能：用于UI显示时间进度条
     */
    getTimeRemainingRatio() {
        // 剩余时间/总时间，确保不小于0
        return Math.max(0, this.timeRemaining / this.timeLimit);
    }
    
    /**
     * 获取事件持续时间 - 计算事件从开始到现在或完成的持续时间
     * @returns {number} 事件持续时间（毫秒）
     * 功能：用于统计和分析事件完成时间
     */
    getDuration() {
        // 结束时间：如果已完成则使用完成时间，否则使用当前时间
        const endTime = this.completedTime || Date.now();
        // 持续时间 = 结束时间 - 开始时间
        return endTime - this.startTime;
    }
    
    /**
     * 检查事件是否活跃 - 判断事件是否处于活跃状态
     * @returns {boolean} 事件是否活跃
     * 功能：用于判断事件是否可以进行交互
     */
    isActive() {
        // 事件活跃条件：未完成、未失败、剩余时间大于0
        return !this.completed && !this.failed && this.timeRemaining > 0;
    }
    
    /**
     * 序列化事件数据 - 将事件对象转换为可存储的JSON格式
     * @returns {Object} 序列化后的事件数据
     * 功能：用于保存游戏状态或网络传输
     */
    serialize() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            difficulty: this.difficulty,
            timeLimit: this.timeLimit,
            timeRemaining: this.timeRemaining,
            points: this.points,
            position: this.position,
            target: this.target,
            completed: this.completed,
            failed: this.failed,
            startTime: this.startTime,
            completedTime: this.completedTime,
            clickCount: this.clickCount,
            dragDistance: this.dragDistance
        };
    }
    
    /**
     * 从序列化数据创建事件 - 静态方法，从JSON数据恢复事件对象
     * @param {Object} data - 序列化的事件数据
     * @returns {LifeEvent} 恢复的事件对象
     * 功能：用于加载游戏状态或处理网络传输的数据
     */
    static deserialize(data) {
        // 创建新的事件实例
        const event = new LifeEvent(data);
        
        // 恢复事件状态
        event.completed = data.completed || false;
        event.failed = data.failed || false;
        event.startTime = data.startTime || Date.now();
        event.completedTime = data.completedTime || null;
        event.clickCount = data.clickCount || 0;
        event.dragDistance = data.dragDistance || 0;
        
        return event; // 返回恢复的事件对象
    }
}