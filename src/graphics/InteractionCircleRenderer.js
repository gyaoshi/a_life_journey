/**
 * InteractionCircleRenderer - 交互圈渲染器
 * 使用RPGStyleRenderer渲染风格实现交互圈的显示、隐藏和动画效果
 */
class InteractionCircleRenderer {
    constructor(context, options = {}) {
        this.ctx = context;
        this.canvas = context.canvas;
        
        // 禁用抗锯齿以获得像素风格
        this.ctx.imageSmoothingEnabled = false;
        
        // RPG风格调色板
        this.palette = {
            // 交互圈颜色
            circleActive: '#FFD700',      // 金色 - 活跃状态
            circleHover: '#FFA500',       // 橙色 - 悬停状态
            circleComplete: '#4CAF50',    // 绿色 - 完成状态
            circleTimeout: '#F44336',     // 红色 - 超时状态
            circleBackground: '#FFFFFF',  // 白色 - 背景
            
            // 动画效果颜色
            pulseInner: '#FFFF00',        // 黄色 - 脉动内圈
            pulseOuter: '#FFD700',        // 金色 - 脉动外圈
            sparkle: '#FFFFFF',           // 白色 - 闪烁效果
            glow: '#FFF8DC'               // 米色 - 光晕效果
        };
        
        // 配置选项
        this.options = {
            defaultRadius: options.defaultRadius || 30,
            strokeWidth: options.strokeWidth || 4,
            animationSpeed: options.animationSpeed || 0.05,
            pulseIntensity: options.pulseIntensity || 0.3,
            sparkleCount: options.sparkleCount || 8,
            glowRadius: options.glowRadius || 10,
            ...options
        };
        
        // 当前状态
        this.isVisible = false;
        this.position = { x: 0, y: 0 };
        this.radius = this.options.defaultRadius;
        this.animationTime = 0;
        this.animationType = 'pulse'; // pulse, blink, rotate
        this.circleState = 'active'; // active, hover, complete, timeout
        
        // 动画参数
        this.pulsePhase = 0;
        this.blinkPhase = 0;
        this.rotationAngle = 0;
        this.sparkles = [];
        
        // 淡入淡出
        this.fadeInDuration = options.fadeInDuration || 300;
        this.fadeOutDuration = options.fadeOutDuration || 500;
        this.fadeStartTime = 0;
        this.fadeDirection = 0; // 0: none, 1: fade in, -1: fade out
        this.opacity = 0;
        
        console.log('InteractionCircleRenderer initialized with RPG style');
    }
    
    /**
     * 显示交互圈
     */
    showInteractionCircle(position, type = 'active') {
        this.position = { ...position };
        this.circleState = type;
        this.isVisible = true;
        this.animationTime = 0;
        this.pulsePhase = 0;
        this.blinkPhase = 0;
        this.rotationAngle = 0;
        
        // 设置默认动画类型
        this.animateCircle('pulse');
        
        // 开始淡入动画
        this.startFadeIn();
        
        // 初始化闪烁效果
        this.initializeSparkles();
        
        console.log(`Interaction circle shown at (${position.x}, ${position.y}) with type: ${type}`);
    }
    
    /**
     * 隐藏交互圈
     */
    hideInteractionCircle() {
        if (this.isVisible) {
            this.startFadeOut();
            console.log('Interaction circle hidden');
        }
    }
    
    /**
     * 播放圈动画
     */
    animateCircle(animation = 'pulse') {
        this.animationType = animation;
        console.log(`Circle animation set to: ${animation}`);
    }
    
    /**
     * 设置圈样式
     */
    setCircleStyle(style) {
        if (style.radius) this.radius = style.radius;
        if (style.strokeWidth) this.options.strokeWidth = style.strokeWidth;
        if (style.color) this.palette.circleActive = style.color;
        if (style.animationSpeed) this.options.animationSpeed = style.animationSpeed;
        
        console.log('Circle style updated:', style);
    }
    
    /**
     * 更新圈位置
     */
    updateCirclePosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    
    /**
     * 检查圈是否可见
     */
    isCircleVisible() {
        return this.isVisible && this.opacity > 0;
    }
    
    /**
     * 开始淡入动画
     */
    startFadeIn() {
        this.fadeDirection = 1;
        this.fadeStartTime = Date.now();
        this.opacity = 0;
    }
    
    /**
     * 开始淡出动画
     */
    startFadeOut() {
        this.fadeDirection = -1;
        this.fadeStartTime = Date.now();
    }
    
    /**
     * 初始化闪烁粒子
     */
    initializeSparkles() {
        this.sparkles = [];
        for (let i = 0; i < this.options.sparkleCount; i++) {
            const angle = (i / this.options.sparkleCount) * Math.PI * 2;
            this.sparkles.push({
                angle: angle,
                distance: this.radius + 10,
                size: 2 + Math.random() * 3,
                phase: Math.random() * Math.PI * 2,
                speed: 0.1 + Math.random() * 0.1
            });
        }
    }
    
    /**
     * 更新动画状态
     */
    update(deltaTime) {
        if (!this.isVisible) return;
        
        // 更新动画时间
        this.animationTime += deltaTime * this.options.animationSpeed;
        
        // 更新淡入淡出
        this.updateFade();
        
        // 更新动画效果
        this.updateAnimations(deltaTime);
        
        // 更新闪烁粒子
        this.updateSparkles(deltaTime);
    }
    
    /**
     * 更新淡入淡出效果
     */
    updateFade() {
        if (this.fadeDirection === 0) return;
        
        const elapsed = Date.now() - this.fadeStartTime;
        const duration = this.fadeDirection === 1 ? this.fadeInDuration : this.fadeOutDuration;
        const progress = Math.min(elapsed / duration, 1);
        
        if (this.fadeDirection === 1) {
            // 淡入
            this.opacity = progress;
            if (progress >= 1) {
                this.fadeDirection = 0;
            }
        } else {
            // 淡出
            this.opacity = 1 - progress;
            if (progress >= 1) {
                this.isVisible = false;
                this.fadeDirection = 0;
                this.opacity = 0;
            }
        }
    }
    
    /**
     * 更新动画效果
     */
    updateAnimations(deltaTime) {
        switch (this.animationType) {
            case 'pulse':
                this.pulsePhase += deltaTime * 0.003;
                break;
            case 'blink':
                this.blinkPhase += deltaTime * 0.008;
                break;
            case 'rotate':
                this.rotationAngle += deltaTime * 0.002;
                break;
        }
    }
    
    /**
     * 更新闪烁粒子
     */
    updateSparkles(deltaTime) {
        this.sparkles.forEach(sparkle => {
            sparkle.phase += sparkle.speed * deltaTime * 0.001;
            sparkle.angle += deltaTime * 0.001;
        });
    }
    
    /**
     * 渲染交互圈
     */
    render() {
        if (!this.isCircleVisible()) return;
        
        this.ctx.save();
        
        // 设置全局透明度
        this.ctx.globalAlpha = this.opacity;
        
        // 渲染光晕效果
        this.renderGlow();
        
        // 渲染主圈
        this.renderMainCircle();
        
        // 渲染动画效果
        this.renderAnimationEffects();
        
        // 渲染闪烁粒子
        this.renderSparkles();
        
        // 渲染RPG风格装饰
        this.renderRPGDecorations();
        
        this.ctx.restore();
    }
    
    /**
     * 渲染光晕效果
     */
    renderGlow() {
        const glowRadius = this.radius + this.options.glowRadius;
        const gradient = this.ctx.createRadialGradient(
            this.position.x, this.position.y, this.radius,
            this.position.x, this.position.y, glowRadius
        );
        
        gradient.addColorStop(0, this.palette.glow + '40');
        gradient.addColorStop(1, this.palette.glow + '00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * 渲染主圈
     */
    renderMainCircle() {
        const color = this.getCircleColor();
        
        // 外圈
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.options.strokeWidth;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 内圈背景（半透明）
        this.ctx.fillStyle = this.palette.circleBackground + '20';
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius - this.options.strokeWidth, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * 获取圈颜色
     */
    getCircleColor() {
        switch (this.circleState) {
            case 'hover': return this.palette.circleHover;
            case 'complete': return this.palette.circleComplete;
            case 'timeout': return this.palette.circleTimeout;
            default: return this.palette.circleActive;
        }
    }
    
    /**
     * 渲染动画效果
     */
    renderAnimationEffects() {
        switch (this.animationType) {
            case 'pulse':
                this.renderPulseEffect();
                break;
            case 'blink':
                this.renderBlinkEffect();
                break;
            case 'rotate':
                this.renderRotateEffect();
                break;
        }
    }
    
    /**
     * 渲染脉动效果
     */
    renderPulseEffect() {
        const pulseRadius = this.radius + Math.sin(this.pulsePhase) * this.options.pulseIntensity * this.radius;
        const pulseOpacity = (Math.sin(this.pulsePhase) + 1) * 0.3;
        
        this.ctx.strokeStyle = this.palette.pulseOuter + Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, pulseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 内部脉动
        const innerPulseRadius = this.radius * 0.7 + Math.sin(this.pulsePhase + Math.PI) * this.options.pulseIntensity * this.radius * 0.3;
        this.ctx.fillStyle = this.palette.pulseInner + Math.floor(pulseOpacity * 128).toString(16).padStart(2, '0');
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, innerPulseRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * 渲染闪烁效果
     */
    renderBlinkEffect() {
        const blinkOpacity = (Math.sin(this.blinkPhase) + 1) * 0.5;
        
        this.ctx.fillStyle = this.palette.sparkle + Math.floor(blinkOpacity * 255).toString(16).padStart(2, '0');
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * 渲染旋转效果
     */
    renderRotateEffect() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotationAngle);
        
        // 绘制旋转的装饰线条
        this.ctx.strokeStyle = this.palette.circleActive;
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const startRadius = this.radius * 0.8;
            const endRadius = this.radius * 1.2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(angle) * startRadius, Math.sin(angle) * startRadius);
            this.ctx.lineTo(Math.cos(angle) * endRadius, Math.sin(angle) * endRadius);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    /**
     * 渲染闪烁粒子
     */
    renderSparkles() {
        this.sparkles.forEach(sparkle => {
            const sparkleOpacity = (Math.sin(sparkle.phase) + 1) * 0.5;
            const x = this.position.x + Math.cos(sparkle.angle) * sparkle.distance;
            const y = this.position.y + Math.sin(sparkle.angle) * sparkle.distance;
            
            this.ctx.fillStyle = this.palette.sparkle + Math.floor(sparkleOpacity * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(x, y, sparkle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    /**
     * 渲染RPG风格装饰
     */
    renderRPGDecorations() {
        // 像素风格的装饰边框
        this.renderPixelBorder();
        
        // 角落装饰
        this.renderCornerDecorations();
    }
    
    /**
     * 渲染像素风格边框
     */
    renderPixelBorder() {
        const pixelSize = 2;
        const borderRadius = this.radius + 8;
        
        this.ctx.fillStyle = this.getCircleColor();
        
        // 绘制像素化的边框点
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
            const x = this.position.x + Math.cos(angle) * borderRadius;
            const y = this.position.y + Math.sin(angle) * borderRadius;
            
            this.ctx.fillRect(x - pixelSize / 2, y - pixelSize / 2, pixelSize, pixelSize);
        }
    }
    
    /**
     * 渲染角落装饰
     */
    renderCornerDecorations() {
        const decorationSize = 4;
        const decorationDistance = this.radius + 15;
        
        this.ctx.fillStyle = this.palette.circleActive;
        
        // 四个角落的小方块装饰
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const x = this.position.x + Math.cos(angle) * decorationDistance;
            const y = this.position.y + Math.sin(angle) * decorationDistance;
            
            this.ctx.fillRect(x - decorationSize / 2, y - decorationSize / 2, decorationSize, decorationSize);
        }
    }
    
    /**
     * 设置圈状态
     */
    setCircleState(state) {
        this.circleState = state;
        console.log(`Circle state changed to: ${state}`);
    }
    
    /**
     * 处理交互完成
     */
    onInteractionComplete() {
        this.setCircleState('complete');
        this.animateCircle('blink');
        
        // 延迟隐藏
        setTimeout(() => {
            this.hideInteractionCircle();
        }, 500);
    }
    
    /**
     * 处理交互超时
     */
    onInteractionTimeout() {
        this.setCircleState('timeout');
        this.animateCircle('pulse');
        
        // 延迟隐藏
        setTimeout(() => {
            this.hideInteractionCircle();
        }, 1000);
    }
    
    /**
     * 重置渲染器
     */
    reset() {
        this.isVisible = false;
        this.opacity = 0;
        this.fadeDirection = 0;
        this.animationTime = 0;
        this.sparkles = [];
        
        console.log('InteractionCircleRenderer reset');
    }
    
    /**
     * 获取渲染器状态
     */
    getState() {
        return {
            isVisible: this.isVisible,
            position: { ...this.position },
            radius: this.radius,
            circleState: this.circleState,
            animationType: this.animationType,
            opacity: this.opacity
        };
    }
}

// Export for Node.js (testing) and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionCircleRenderer;
}