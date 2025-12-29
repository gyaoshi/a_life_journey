/**
 * 游戏UI管理器
 * 负责管理游戏界面集成，移除外部按钮，实现游戏内UI控制
 */

class GameUIManager {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.gameEngine = gameEngine;
        this.context = canvas.getContext('2d');
        
        // UI状态
        this.showingGameEndScreen = false;
        this.restartButtonBounds = null;
        
        // 外部按钮引用
        this.externalButtons = {
            startButton: null,
            restartButton: null
        };
        
        // 游戏内UI配置
        this.inGameUI = {
            restartButton: {
                width: 120,
                height: 40,
                padding: 10,
                backgroundColor: '#4ecdc4',
                textColor: '#ffffff',
                hoverColor: '#44a08d',
                fontSize: 16
            },
            evaluationScreen: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                textColor: '#ffffff',
                titleColor: '#4ecdc4',
                padding: 20
            }
        };
        
        console.log('GameUIManager initialized');
    }
    
    /**
     * 初始化UI管理器
     */
    initialize() {
        // 查找并存储外部按钮引用
        this.findExternalButtons();
        
        // 移除外部按钮
        this.removeExternalButtons();
        
        // 设置画布点击事件监听
        this.setupCanvasClickHandler();
        
        console.log('GameUIManager initialized and external buttons removed');
    }
    
    /**
     * 查找外部按钮
     */
    findExternalButtons() {
        // 查找所有可能的外部按钮
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            const text = button.textContent.trim();
            const onclick = button.getAttribute('onclick');
            
            if (text.includes('开始游戏') || (onclick && onclick.includes('startGame'))) {
                this.externalButtons.startButton = button;
            }
            
            if (text.includes('重新开始') || (onclick && onclick.includes('resetGame'))) {
                this.externalButtons.restartButton = button;
            }
        });
        
        console.log('Found external buttons:', {
            startButton: !!this.externalButtons.startButton,
            restartButton: !!this.externalButtons.restartButton
        });
    }
    
    /**
     * 移除外部按钮
     */
    removeExternalButtons() {
        // 移除开始游戏按钮
        if (this.externalButtons.startButton) {
            this.externalButtons.startButton.style.display = 'none';
            console.log('Start button hidden');
        }
        
        // 移除重新开始按钮
        if (this.externalButtons.restartButton) {
            this.externalButtons.restartButton.style.display = 'none';
            console.log('Restart button hidden');
        }
        
        // 也可以移除包含按钮的div容器
        const buttonContainers = document.querySelectorAll('div');
        buttonContainers.forEach(container => {
            const buttons = container.querySelectorAll('button');
            if (buttons.length > 0) {
                // 检查是否只包含游戏控制按钮
                let onlyGameButtons = true;
                buttons.forEach(button => {
                    const text = button.textContent.trim();
                    const onclick = button.getAttribute('onclick');
                    if (!text.includes('开始游戏') && !text.includes('重新开始') && 
                        (!onclick || (!onclick.includes('startGame') && !onclick.includes('resetGame')))) {
                        onlyGameButtons = false;
                    }
                });
                
                if (onlyGameButtons) {
                    container.style.display = 'none';
                    console.log('Button container hidden');
                }
            }
        });
    }
    
    /**
     * 设置画布点击事件处理
     */
    setupCanvasClickHandler() {
        this.canvas.addEventListener('click', (event) => {
            if (this.showingGameEndScreen && this.restartButtonBounds) {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                // 检查是否点击了重新开始按钮
                if (this.isPointInBounds(x, y, this.restartButtonBounds)) {
                    this.handleRestartClick();
                }
            }
        });
        
        // 添加鼠标移动事件以实现悬停效果
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.showingGameEndScreen && this.restartButtonBounds) {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                // 更新鼠标样式
                if (this.isPointInBounds(x, y, this.restartButtonBounds)) {
                    this.canvas.style.cursor = 'pointer';
                } else {
                    this.canvas.style.cursor = 'default';
                }
            }
        });
    }
    
    /**
     * 检查点是否在边界内
     */
    isPointInBounds(x, y, bounds) {
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    }
    
    /**
     * 显示游戏结束界面
     */
    showGameEndScreen(score, evaluation) {
        this.showingGameEndScreen = true;
        
        const scale = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScale() : 1;
        const scaledSize = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScaledSize() : 
            { width: this.canvas.width, height: this.canvas.height };
        
        // 清空画布
        this.context.clearRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制半透明背景
        this.context.fillStyle = this.inGameUI.evaluationScreen.backgroundColor;
        this.context.fillRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 绘制评价内容
        this.drawEvaluationContent(evaluation, scale, scaledSize);
        
        // 绘制游戏内重新开始按钮
        this.drawRestartButton(scale, scaledSize);
        
        console.log('Game end screen displayed with integrated restart button');
    }
    
    /**
     * 绘制评价内容
     */
    drawEvaluationContent(evaluation, scale, scaledSize) {
        const ctx = this.context;
        const padding = this.inGameUI.evaluationScreen.padding * scale;
        
        // 结果标题
        ctx.fillStyle = this.inGameUI.evaluationScreen.titleColor;
        ctx.font = `bold ${28 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('人生旅程结束', scaledSize.width / 2, 80 * scale);
        
        // 评价等级
        ctx.font = `bold ${36 * scale}px Arial`;
        ctx.fillStyle = this.getEvaluationColor(evaluation.title);
        ctx.fillText(evaluation.title, scaledSize.width / 2, 140 * scale);
        
        // 评价描述
        ctx.font = `${18 * scale}px Arial`;
        ctx.fillStyle = '#cccccc';
        ctx.fillText(evaluation.description, scaledSize.width / 2, 180 * scale);
        
        // 分数信息
        ctx.font = `${20 * scale}px Arial`;
        ctx.fillStyle = this.inGameUI.evaluationScreen.textColor;
        ctx.fillText(`完成度: ${evaluation.percentage}%`, scaledSize.width / 2, 220 * scale);
        ctx.fillText(`总分数: ${evaluation.totalScore}`, scaledSize.width / 2, 250 * scale);
        ctx.fillText(`完成事件: ${evaluation.completedEvents}/${evaluation.totalPossibleEvents}`, scaledSize.width / 2, 280 * scale);
        
        // 思考提示
        ctx.font = `${14 * scale}px Arial`;
        ctx.fillStyle = '#999999';
        ctx.fillText('回想一下，什么才是人生中最重要的？', scaledSize.width / 2, 320 * scale);
    }
    
    /**
     * 绘制重新开始按钮
     */
    drawRestartButton(scale, scaledSize) {
        const ctx = this.context;
        const buttonConfig = this.inGameUI.restartButton;
        
        // 计算按钮位置和大小
        const buttonWidth = buttonConfig.width * scale;
        const buttonHeight = buttonConfig.height * scale;
        const buttonX = (scaledSize.width - buttonWidth) / 2;
        const buttonY = 360 * scale;
        
        // 存储按钮边界用于点击检测
        this.restartButtonBounds = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
        
        // 绘制按钮背景
        ctx.fillStyle = buttonConfig.backgroundColor;
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // 绘制按钮边框
        ctx.strokeStyle = buttonConfig.backgroundColor;
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // 绘制按钮文字
        ctx.fillStyle = buttonConfig.textColor;
        ctx.font = `bold ${buttonConfig.fontSize * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('重新开始', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 6 * scale);
        
        console.log('Restart button drawn at:', this.restartButtonBounds);
    }
    
    /**
     * 获取评价等级对应的颜色
     */
    getEvaluationColor(title) {
        const colors = {
            '匆忙人生': '#ff6b6b',
            '平凡人生': '#feca57',
            '充实人生': '#48dbfb',
            '完美人生': '#0be881'
        };
        
        return colors[title] || '#ffffff';
    }
    
    /**
     * 处理重新开始按钮点击
     */
    handleRestartClick() {
        console.log('Restart button clicked');
        
        // 隐藏游戏结束界面
        this.hideGameEndScreen();
        
        // 重置游戏状态
        if (this.gameEngine && this.gameEngine.game) {
            // 通过游戏引擎重置游戏
            this.gameEngine.game.stopGame();
            setTimeout(() => {
                if (this.gameEngine.game.isInitialized) {
                    // 自动开始新游戏而不是显示开始提示
                    this.gameEngine.game.startGame();
                }
            }, 100);
        }
    }
    
    /**
     * 隐藏游戏结束界面
     */
    hideGameEndScreen() {
        this.showingGameEndScreen = false;
        this.restartButtonBounds = null;
        this.canvas.style.cursor = 'default';
        
        console.log('Game end screen hidden');
    }
    
    /**
     * 显示重新开始按钮（在游戏结束时调用）
     */
    showRestartButton() {
        // 这个方法由showGameEndScreen处理
        console.log('Restart button is integrated in game end screen');
    }
    
    /**
     * 隐藏重新开始按钮
     */
    hideRestartButton() {
        this.hideGameEndScreen();
    }
    
    /**
     * 集成UI元素到游戏内
     */
    integrateUIElements() {
        // 确保外部按钮被移除
        this.removeExternalButtons();
        
        // 设置自动游戏启动
        this.setupAutoGameStart();
        
        console.log('UI elements integrated into game canvas');
    }
    
    /**
     * 设置自动游戏启动
     */
    setupAutoGameStart() {
        // 修改游戏的初始化流程，使其自动开始
        if (this.gameEngine && this.gameEngine.game) {
            const originalShowStartPrompt = this.gameEngine.game.showStartPrompt.bind(this.gameEngine.game);
            
            // 重写showStartPrompt方法，使其自动开始游戏
            this.gameEngine.game.showStartPrompt = () => {
                // 显示简短的准备提示然后自动开始
                this.showAutoStartPrompt();
                
                // 延迟自动开始游戏
                setTimeout(() => {
                    if (this.gameEngine.game && this.gameEngine.game.isInitialized && !this.gameEngine.game.isStarted) {
                        this.gameEngine.game.startGame();
                    }
                }, 2000); // 2秒后自动开始
            };
        }
    }
    
    /**
     * 显示自动开始提示
     */
    showAutoStartPrompt() {
        const ctx = this.context;
        const scale = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScale() : 1;
        const scaledSize = this.gameEngine.responsiveManager ? this.gameEngine.responsiveManager.getScaledSize() : 
            { width: this.canvas.width, height: this.canvas.height };
        
        // 清空画布
        ctx.clearRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 背景
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, scaledSize.width, scaledSize.height);
        
        // 标题
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${32 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('人生旅程游戏', scaledSize.width / 2, scaledSize.height / 2 - 60 * scale);
        
        // 副标题
        ctx.font = `${18 * scale}px Arial`;
        ctx.fillStyle = '#cccccc';
        ctx.fillText('100秒体验完整人生', scaledSize.width / 2, scaledSize.height / 2 - 20 * scale);
        
        // 自动开始提示
        ctx.font = `${24 * scale}px Arial`;
        ctx.fillStyle = '#4ecdc4';
        ctx.fillText('游戏即将自动开始...', scaledSize.width / 2, scaledSize.height / 2 + 40 * scale);
        
        // 说明文字
        ctx.font = `${14 * scale}px Arial`;
        ctx.fillStyle = '#999999';
        ctx.fillText('通过快速反应完成人生事件', scaledSize.width / 2, scaledSize.height / 2 + 80 * scale);
        ctx.fillText('思考什么才是人生中真正重要的', scaledSize.width / 2, scaledSize.height / 2 + 100 * scale);
        
        console.log('Auto-start prompt displayed');
    }
    
    /**
     * 检查是否显示游戏结束界面
     */
    isShowingGameEndScreen() {
        return this.showingGameEndScreen;
    }
    
    /**
     * 获取重新开始按钮边界
     */
    getRestartButtonBounds() {
        return this.restartButtonBounds;
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 恢复外部按钮显示（如果需要）
        if (this.externalButtons.startButton) {
            this.externalButtons.startButton.style.display = '';
        }
        
        if (this.externalButtons.restartButton) {
            this.externalButtons.restartButton.style.display = '';
        }
        
        // 重置状态
        this.showingGameEndScreen = false;
        this.restartButtonBounds = null;
        
        console.log('GameUIManager cleaned up');
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUIManager;
}