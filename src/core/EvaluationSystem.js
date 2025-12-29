/**
 * 详细评价系统 - 基于分数生成详细评语和人生总结
 * 需求: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6
 */
class EvaluationSystem {
    constructor() {
        this.evaluationData = {
            ranges: [
                {
                    min: 0, max: 30,
                    title: "匆忙人生",
                    description: "生活节奏太快，错过了很多美好时光",
                    highlights: ["时间管理", "慢下来感受生活", "珍惜当下"]
                },
                {
                    min: 31, max: 60,
                    title: "平凡人生", 
                    description: "虽然平淡，但也有属于自己的精彩",
                    highlights: ["平凡中的美好", "稳定的生活", "简单的幸福"]
                },
                {
                    min: 61, max: 85,
                    title: "充实人生",
                    description: "把握了大部分机会，活得很精彩",
                    highlights: ["积极进取", "把握机会", "丰富经历"]
                },
                {
                    min: 86, max: 100,
                    title: "完美人生",
                    description: "几乎没有遗憾，真正活出了自己",
                    highlights: ["无悔选择", "完美平衡", "人生赢家"]
                }
            ]
        };
        
        this.currentEvaluation = null;
        this.isDisplaying = false;
    }

    /**
     * 根据分数生成详细评价
     * @param {number} score - 游戏分数 (0-100)
     * @param {number} totalEvents - 总事件数
     * @param {number} completedEvents - 完成事件数
     * @returns {Object} 评价结果
     */
    generateEvaluation(score, totalEvents, completedEvents) {
        const percentage = Math.round((completedEvents / totalEvents) * 100);
        const evaluation = this.findEvaluationRange(percentage);
        
        this.currentEvaluation = {
            score: score,
            percentage: percentage,
            totalEvents: totalEvents,
            completedEvents: completedEvents,
            title: evaluation.title,
            description: evaluation.description,
            highlights: evaluation.highlights,
            summary: this.generateLifeSummary(percentage, completedEvents, totalEvents)
        };
        
        return this.currentEvaluation;
    }

    /**
     * 查找分数对应的评价范围
     * @param {number} percentage - 完成百分比
     * @returns {Object} 评价数据
     */
    findEvaluationRange(percentage) {
        for (const range of this.evaluationData.ranges) {
            if (percentage >= range.min && percentage <= range.max) {
                return range;
            }
        }
        // 默认返回第一个范围
        return this.evaluationData.ranges[0];
    }

    /**
     * 生成人生总结
     * @param {number} percentage - 完成百分比
     * @param {number} completed - 完成事件数
     * @param {number} total - 总事件数
     * @returns {string} 人生总结文本
     */
    generateLifeSummary(percentage, completed, total) {
        const missed = total - completed;
        let summary = `在这段人生旅程中，你完成了 ${completed} 个重要事件，`;
        
        if (percentage >= 86) {
            summary += "几乎抓住了所有的人生机会，活出了精彩的一生。";
        } else if (percentage >= 61) {
            summary += `错过了 ${missed} 个机会，但仍然过得很充实。`;
        } else if (percentage >= 31) {
            summary += `错过了 ${missed} 个机会，生活虽然平凡但也有自己的美好。`;
        } else {
            summary += `错过了 ${missed} 个重要机会，也许需要放慢脚步，更用心地生活。`;
        }
        
        return summary;
    }

    /**
     * 显示评价界面
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {number} canvasWidth - Canvas宽度
     * @param {number} canvasHeight - Canvas高度
     */
    displayEvaluation(ctx, canvasWidth, canvasHeight) {
        if (!this.currentEvaluation) return;
        
        this.isDisplaying = true;
        
        // 绘制半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // 绘制评价面板
        const panelWidth = Math.min(canvasWidth * 0.8, 400);
        const panelHeight = Math.min(canvasHeight * 0.7, 500);
        const panelX = (canvasWidth - panelWidth) / 2;
        const panelY = (canvasHeight - panelHeight) / 2;
        
        // 面板背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        
        // 面板边框
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // 绘制评价内容
        this.drawEvaluationContent(ctx, panelX, panelY, panelWidth, panelHeight);
        
        // 绘制重新开始按钮
        this.drawRestartButton(ctx, panelX, panelY, panelWidth, panelHeight);
    }

    /**
     * 绘制评价内容
     */
    drawEvaluationContent(ctx, x, y, width, height) {
        const padding = 20;
        let currentY = y + padding;
        
        // 标题
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.currentEvaluation.title, x + width/2, currentY + 30);
        currentY += 60;
        
        // 分数
        ctx.font = '18px Arial';
        ctx.fillText(`完成度: ${this.currentEvaluation.percentage}%`, x + width/2, currentY);
        currentY += 30;
        ctx.fillText(`(${this.currentEvaluation.completedEvents}/${this.currentEvaluation.totalEvents} 个事件)`, x + width/2, currentY);
        currentY += 40;
        
        // 描述
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        this.wrapText(ctx, this.currentEvaluation.description, x + padding, currentY, width - padding * 2, 20);
        currentY += 60;
        
        // 人生总结
        ctx.font = '14px Arial';
        this.wrapText(ctx, this.currentEvaluation.summary, x + padding, currentY, width - padding * 2, 18);
        currentY += 80;
        
        // 亮点分析
        ctx.font = 'bold 16px Arial';
        ctx.fillText('人生亮点:', x + padding, currentY);
        currentY += 25;
        
        ctx.font = '14px Arial';
        this.currentEvaluation.highlights.forEach(highlight => {
            ctx.fillText(`• ${highlight}`, x + padding + 10, currentY);
            currentY += 20;
        });
    }

    /**
     * 绘制重新开始按钮
     */
    drawRestartButton(ctx, panelX, panelY, panelWidth, panelHeight) {
        const buttonWidth = 120;
        const buttonHeight = 40;
        const buttonX = panelX + (panelWidth - buttonWidth) / 2;
        const buttonY = panelY + panelHeight - 60;
        
        // 按钮背景
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // 按钮边框
        ctx.strokeStyle = '#45a049';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // 按钮文字
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('重新开始', buttonX + buttonWidth/2, buttonY + buttonHeight/2 + 6);
        
        // 存储按钮位置用于点击检测
        this.restartButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
    }

    /**
     * 文本换行显示
     */
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split('');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i];
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }

    /**
     * 检查重新开始按钮点击
     * @param {number} x - 点击X坐标
     * @param {number} y - 点击Y坐标
     * @returns {boolean} 是否点击了重新开始按钮
     */
    checkRestartButtonClick(x, y) {
        if (!this.isDisplaying || !this.restartButton) return false;
        
        return x >= this.restartButton.x && 
               x <= this.restartButton.x + this.restartButton.width &&
               y >= this.restartButton.y && 
               y <= this.restartButton.y + this.restartButton.height;
    }

    /**
     * 隐藏评价界面
     */
    hideEvaluation() {
        this.isDisplaying = false;
        this.currentEvaluation = null;
        this.restartButton = null;
    }

    /**
     * 获取当前评价状态
     * @returns {boolean} 是否正在显示评价
     */
    isEvaluationDisplaying() {
        return this.isDisplaying;
    }

    /**
     * 获取当前评价数据
     * @returns {Object|null} 当前评价数据
     */
    getCurrentEvaluation() {
        return this.currentEvaluation;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EvaluationSystem;
}