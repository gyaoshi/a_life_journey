/**
 * 出生动画 - 游戏开始时的特殊动画序列
 * 三阶段动画：预备-诞生-显现
 * 包含生命诞生光芒和温暖特效
 * 使用可爱温馨的RPG风格渲染
 */

export class BirthAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 7000, // 7秒总时长
            phases: {
                prebirth: { start: 0, end: 2000 },      // 预备阶段 0-2秒
                birth: { start: 2000, end: 5000 },      // 诞生阶段 2-5秒
                appear: { start: 5000, end: 7000 }      // 显现阶段 5-7秒
            },
            ...config
        };
        
        // 动画状态
        this.currentTime = 0;
        this.currentPhase = 'prebirth';
        this.isComplete = false;
        
        // 特效系统
        this.particles = [];
        this.lights = [];
        this.characterOpacity = 0;
        this.characterScale = 0;
        this.characterPosition = { x: 400, y: 300 }; // 画面中央
        
        // 可爱温馨的特效
        this.magicalSparkles = [];
        this.gentleLights = [];
        this.warmthAura = { radius: 0, intensity: 0 };
        this.loveHearts = [];
        this.softGlow = { radius: 0, intensity: 0 };
        
        // RPG风格设置
        this.pixelSize = 2;
        this.cuteColors = {
            warm: '#FFE4E1',      // 温暖粉色
            gentle: '#F0F8FF',    // 温柔蓝色
            magical: '#FFE4B5',   // 魔法金色
            love: '#FFB6C1',      // 爱心粉色
            pure: '#FFFAF0'       // 纯净白色
        };
        
        this.init();
    }
    
    /**
     * 初始化动画
     */
    init() {
        this.initMagicalSparkles();
        this.initGentleLights();
        this.initLoveHearts();
        console.log('Cute birth animation initialized');
    }
    
    /**
     * 初始化魔法闪光
     */
    initMagicalSparkles() {
        // 创建可爱的魔法闪光粒子
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const distance = 200 + Math.random() * 100;
            this.magicalSparkles.push({
                x: this.characterPosition.x + Math.cos(angle) * distance,
                y: this.characterPosition.y + Math.sin(angle) * distance,
                targetX: this.characterPosition.x,
                targetY: this.characterPosition.y,
                size: Math.random() * 4 + 2,
                color: this._getRandomCuteColor(),
                opacity: 0,
                maxOpacity: Math.random() * 0.8 + 0.4,
                speed: Math.random() * 1.5 + 0.5,
                twinkle: Math.random() * Math.PI * 2,
                life: 0
            });
        }
    }
    
    /**
     * 初始化温柔光芒
     */
    initGentleLights() {
        // 创建温柔的环形光芒
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.gentleLights.push({
                x: this.characterPosition.x,
                y: this.characterPosition.y,
                radius: 0,
                maxRadius: 80 + i * 20,
                intensity: 0,
                maxIntensity: 0.4 - i * 0.05,
                color: i % 2 === 0 ? this.cuteColors.warm : this.cuteColors.gentle,
                angle: angle,
                rotationSpeed: 0.02 + i * 0.005,
                pulsePhase: i * Math.PI / 3
            });
        }
    }
    
    /**
     * 初始化爱心粒子
     */
    initLoveHearts() {
        // 创建飘浮的爱心
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 150;
            this.loveHearts.push({
                x: this.characterPosition.x + Math.cos(angle) * distance,
                y: this.characterPosition.y + Math.sin(angle) * distance,
                size: Math.random() * 6 + 4,
                color: this.cuteColors.love,
                opacity: 0,
                maxOpacity: 0.7,
                floatSpeed: Math.random() * 0.5 + 0.3,
                floatPhase: Math.random() * Math.PI * 2,
                life: 0
            });
        }
    }
    
    /**
     * 获取随机可爱颜色
     * @private
     */
    _getRandomCuteColor() {
        const colors = [
            '#FFB6C1', '#FFE4E1', '#F0F8FF', '#FFE4B5', 
            '#E6E6FA', '#FFF0F5', '#F5FFFA', '#FFFACD'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * 更新动画
     * @param {number} time - 当前时间
     * @param {number} deltaTime - 时间差
     */
    update(time, deltaTime) {
        this.currentTime = time;
        this.updatePhase();
        
        switch (this.currentPhase) {
            case 'prebirth':
                this.updatePrebirthPhase(deltaTime);
                break;
            case 'birth':
                this.updateBirthPhase(deltaTime);
                break;
            case 'appear':
                this.updateAppearPhase(deltaTime);
                break;
        }
        
        this.updateParticles(deltaTime);
        this.updateLights(deltaTime);
    }
    
    /**
     * 更新当前阶段
     */
    updatePhase() {
        const phases = this.config.phases;
        
        if (this.currentTime >= phases.appear.start) {
            this.currentPhase = 'appear';
        } else if (this.currentTime >= phases.birth.start) {
            this.currentPhase = 'birth';
        } else {
            this.currentPhase = 'prebirth';
        }
        
        if (this.currentTime >= this.config.duration) {
            this.isComplete = true;
        }
    }
    
    /**
     * 更新预备阶段 - 温柔的开始
     */
    updatePrebirthPhase(deltaTime) {
        const phaseProgress = (this.currentTime - this.config.phases.prebirth.start) / 
                             (this.config.phases.prebirth.end - this.config.phases.prebirth.start);
        
        // 温柔光芒逐渐出现
        this.gentleLights.forEach((light, index) => {
            const pulseOffset = (this.currentTime / 1000 + light.pulsePhase) * Math.PI * 2;
            const pulse = (Math.sin(pulseOffset) + 1) / 2;
            
            light.radius = light.maxRadius * phaseProgress * (0.3 + pulse * 0.7);
            light.intensity = light.maxIntensity * phaseProgress * (0.5 + pulse * 0.5);
            
            // 轻柔旋转
            light.angle += light.rotationSpeed;
        });
        
        // 魔法闪光开始闪烁
        this.magicalSparkles.forEach(sparkle => {
            sparkle.twinkle += 0.1;
            sparkle.opacity = sparkle.maxOpacity * phaseProgress * 0.5 * 
                             (Math.sin(sparkle.twinkle) * 0.5 + 0.5);
        });
        
        // 柔和光晕开始形成
        this.softGlow.radius = 60 * phaseProgress;
        this.softGlow.intensity = 0.3 * phaseProgress;
    }
    
    /**
     * 更新诞生阶段 - 魔法的时刻
     */
    updateBirthPhase(deltaTime) {
        const phaseProgress = (this.currentTime - this.config.phases.birth.start) / 
                             (this.config.phases.birth.end - this.config.phases.birth.start);
        
        // 温柔光芒达到最强
        this.gentleLights.forEach(light => {
            const pulseOffset = (this.currentTime / 800 + light.pulsePhase) * Math.PI * 2;
            const pulse = (Math.sin(pulseOffset) + 1) / 2;
            
            light.radius = light.maxRadius * (0.8 + pulse * 0.2);
            light.intensity = light.maxIntensity * (0.9 + pulse * 0.1);
            light.angle += light.rotationSpeed;
        });
        
        // 魔法闪光向中心汇聚
        this.magicalSparkles.forEach(sparkle => {
            const dx = sparkle.targetX - sparkle.x;
            const dy = sparkle.targetY - sparkle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 3) {
                sparkle.x += (dx / distance) * sparkle.speed * deltaTime * 0.01;
                sparkle.y += (dy / distance) * sparkle.speed * deltaTime * 0.01;
            }
            
            sparkle.twinkle += 0.15;
            sparkle.opacity = sparkle.maxOpacity * Math.min(1, phaseProgress * 2) * 
                             (Math.sin(sparkle.twinkle) * 0.3 + 0.7);
            sparkle.life = Math.min(1, phaseProgress * 1.5);
        });
        
        // 爱心开始飘浮
        this.loveHearts.forEach((heart, index) => {
            heart.floatPhase += heart.floatSpeed * deltaTime * 0.01;
            heart.y += Math.sin(heart.floatPhase) * 0.5;
            heart.opacity = heart.maxOpacity * Math.min(1, phaseProgress * 1.5);
            heart.life = Math.min(1, phaseProgress * 1.2);
        });
        
        // 温暖光环形成
        this.warmthAura.radius = 120 * phaseProgress;
        this.warmthAura.intensity = 0.5 * phaseProgress;
        
        // 柔和光晕增强
        this.softGlow.radius = 60 + 40 * phaseProgress;
        this.softGlow.intensity = 0.3 + 0.4 * phaseProgress;
    }
    
    /**
     * 更新显现阶段 - 可爱的诞生
     */
    updateAppearPhase(deltaTime) {
        const phaseProgress = (this.currentTime - this.config.phases.appear.start) / 
                             (this.config.phases.appear.end - this.config.phases.appear.start);
        
        // 角色逐渐显现，带有可爱的弹跳效果
        const bounceProgress = Math.min(1, phaseProgress * 2);
        const bounce = bounceProgress < 1 ? 
                      Math.sin(bounceProgress * Math.PI) * 0.2 + bounceProgress :
                      1;
        
        this.characterOpacity = Math.min(1, phaseProgress * 2);
        this.characterScale = bounce;
        
        // 温柔光芒逐渐减弱但保持温暖
        this.gentleLights.forEach(light => {
            const pulseOffset = (this.currentTime / 1200 + light.pulsePhase) * Math.PI * 2;
            const pulse = (Math.sin(pulseOffset) + 1) / 2;
            
            light.intensity = light.maxIntensity * (1 - phaseProgress * 0.6) * (0.7 + pulse * 0.3);
            light.radius = light.maxRadius * (1 - phaseProgress * 0.3);
            light.angle += light.rotationSpeed * 0.5; // 减慢旋转
        });
        
        // 魔法闪光变成温柔的闪烁
        this.magicalSparkles.forEach(sparkle => {
            sparkle.twinkle += 0.08;
            sparkle.opacity = sparkle.maxOpacity * (1 - phaseProgress * 0.7) * 
                             (Math.sin(sparkle.twinkle) * 0.4 + 0.6);
        });
        
        // 爱心继续飘浮但逐渐淡出
        this.loveHearts.forEach(heart => {
            heart.floatPhase += heart.floatSpeed * deltaTime * 0.008;
            heart.y += Math.sin(heart.floatPhase) * 0.3;
            heart.opacity = heart.maxOpacity * (1 - phaseProgress * 0.8);
        });
        
        // 温暖光环稳定并保持
        this.warmthAura.radius = 120 * (1 - phaseProgress * 0.3);
        this.warmthAura.intensity = 0.5 * (1 - phaseProgress * 0.4);
        
        // 柔和光晕保持温暖
        this.softGlow.radius = 100 * (1 - phaseProgress * 0.2);
        this.softGlow.intensity = 0.7 * (1 - phaseProgress * 0.3);
    }
    
    /**
     * 更新粒子系统
     */
    updateParticles(deltaTime) {
        // 更新魔法闪光
        this.magicalSparkles.forEach(sparkle => {
            // 添加轻微的随机飘动
            sparkle.x += (Math.random() - 0.5) * 0.3;
            sparkle.y += (Math.random() - 0.5) * 0.3;
            
            // 闪烁大小变化
            const twinkleScale = Math.sin(sparkle.twinkle) * 0.3 + 0.7;
            sparkle.currentSize = sparkle.size * twinkleScale;
        });
        
        // 更新爱心飘浮
        this.loveHearts.forEach(heart => {
            // 轻柔的上下飘动
            heart.currentY = heart.y + Math.sin(heart.floatPhase) * 8;
            
            // 轻微的左右摆动
            heart.currentX = heart.x + Math.cos(heart.floatPhase * 0.7) * 3;
        });
    }
    
    /**
     * 更新光效系统
     */
    updateLights(deltaTime) {
        // 温柔光芒的动态效果
        this.gentleLights.forEach(light => {
            // 轻柔的位置摆动
            const swayX = Math.sin(this.currentTime * 0.0008 + light.angle) * 8;
            const swayY = Math.cos(this.currentTime * 0.0008 + light.angle) * 8;
            
            light.currentX = light.x + swayX;
            light.currentY = light.y + swayY;
        });
    }
    
    /**
     * 渲染动画
     * @param {CanvasRenderingContext2D} ctx - 渲染上下文
     */
    render(ctx) {
        // 保存上下文状态
        ctx.save();
        
        // 禁用抗锯齿以获得像素风格
        ctx.imageSmoothingEnabled = false;
        
        // 设置混合模式为叠加
        ctx.globalCompositeOperation = 'screen';
        
        // 渲染柔和光晕背景
        this.renderSoftGlow(ctx);
        
        // 渲染温柔光芒
        this.renderGentleLights(ctx);
        
        // 渲染魔法闪光
        this.renderMagicalSparkles(ctx);
        
        // 渲染温暖光环
        this.renderWarmthAura(ctx);
        
        // 渲染爱心
        this.renderLoveHearts(ctx);
        
        // 恢复正常混合模式
        ctx.globalCompositeOperation = 'source-over';
        
        // 渲染角色（如果在显现阶段）
        if (this.currentPhase === 'appear' && this.characterOpacity > 0) {
            this.renderCuteCharacter(ctx);
        }
        
        // 恢复抗锯齿设置
        ctx.imageSmoothingEnabled = true;
        
        // 恢复上下文状态
        ctx.restore();
    }
    
    /**
     * 渲染柔和光晕
     */
    renderSoftGlow(ctx) {
        if (this.softGlow.intensity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.softGlow.intensity;
        
        // 创建柔和的径向渐变
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, 
            this.characterPosition.y, 
            0,
            this.characterPosition.x, 
            this.characterPosition.y, 
            this.softGlow.radius
        );
        
        gradient.addColorStop(0, this.cuteColors.pure);
        gradient.addColorStop(0.3, this.cuteColors.warm);
        gradient.addColorStop(0.7, this.cuteColors.gentle);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            this.characterPosition.x, 
            this.characterPosition.y, 
            this.softGlow.radius, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染温柔光芒
     */
    renderGentleLights(ctx) {
        this.gentleLights.forEach(light => {
            if (light.intensity <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = light.intensity;
            
            // 创建温柔的径向渐变
            const gradient = ctx.createRadialGradient(
                light.currentX || light.x, 
                light.currentY || light.y, 
                0,
                light.currentX || light.x, 
                light.currentY || light.y, 
                light.radius
            );
            
            gradient.addColorStop(0, light.color);
            gradient.addColorStop(0.5, light.color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                light.currentX || light.x, 
                light.currentY || light.y, 
                light.radius, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染魔法闪光
     */
    renderMagicalSparkles(ctx) {
        this.magicalSparkles.forEach(sparkle => {
            if (sparkle.opacity <= 0 || !sparkle.currentSize) return;
            
            ctx.save();
            ctx.globalAlpha = sparkle.opacity;
            
            // 绘制星形闪光
            this._drawPixelStar(ctx, sparkle.x, sparkle.y, sparkle.currentSize, sparkle.color);
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染爱心
     */
    renderLoveHearts(ctx) {
        this.loveHearts.forEach(heart => {
            if (heart.opacity <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = heart.opacity;
            ctx.fillStyle = heart.color;
            
            // 绘制像素风格爱心
            this._drawPixelHeart(ctx, heart.currentX || heart.x, heart.currentY || heart.y, heart.size);
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染温暖光环
     */
    renderWarmthAura(ctx) {
        if (this.warmthAura.intensity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.warmthAura.intensity;
        
        // 创建温暖的径向渐变
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, 
            this.characterPosition.y, 
            0,
            this.characterPosition.x, 
            this.characterPosition.y, 
            this.warmthAura.radius
        );
        
        gradient.addColorStop(0, 'rgba(255, 228, 225, 0.8)');  // 温暖粉色
        gradient.addColorStop(0.3, 'rgba(255, 240, 245, 0.6)'); // 柔和粉色
        gradient.addColorStop(0.7, 'rgba(240, 248, 255, 0.3)'); // 淡蓝色
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            this.characterPosition.x, 
            this.characterPosition.y, 
            this.warmthAura.radius, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染可爱角色（婴儿形态）
     */
    renderCuteCharacter(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.characterOpacity;
        ctx.translate(this.characterPosition.x, this.characterPosition.y);
        ctx.scale(this.characterScale, this.characterScale);
        
        // 绘制超可爱的婴儿形态
        this.drawSuperCuteBaby(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制超可爱的婴儿
     */
    drawSuperCuteBaby(ctx) {
        const pixelSize = this.pixelSize;
        
        // 可爱的阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(-12, 28, 24, 4);
        
        // 身体（超圆润）
        ctx.fillStyle = '#FFB3E6'; // 粉嫩色衣服
        this._drawRoundedPixelRect(ctx, -10, 8, 20, 20, pixelSize);
        
        // 头部（超大超圆）
        ctx.fillStyle = '#FFDBCB'; // 温暖肤色
        ctx.beginPath();
        ctx.arc(0, -8, 16, 0, 2 * Math.PI);
        ctx.fill();
        
        // 头部高光
        ctx.fillStyle = '#FFF0F5';
        ctx.beginPath();
        ctx.arc(-5, -12, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // 超大可爱眼睛
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-6, -10, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -10, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#87CEEB'; // 天空蓝
        ctx.beginPath();
        ctx.arc(-6, -10, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -10, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 眼睛高光
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-7, -11, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, -11, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // 粉嫩脸颊
        ctx.fillStyle = '#FFB6C1';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(-10, -5, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, -5, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // 小巧鼻子
        ctx.fillStyle = '#FFB6C1';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(0, -6, 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // 甜美微笑
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, -3, 4, 0.3 * Math.PI, 0.7 * Math.PI);
        ctx.stroke();
        
        // 稀疏可爱头发
        ctx.fillStyle = '#F4E4BC';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI;
            const x = Math.cos(angle) * 12;
            const y = -16 + Math.sin(angle) * 4;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // 可爱小手
        ctx.fillStyle = '#FFDBCB';
        ctx.beginPath();
        ctx.arc(-14, 15, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(14, 15, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 小脚丫
        ctx.beginPath();
        ctx.arc(-6, 26, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, 26, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 可爱围嘴
        ctx.fillStyle = '#FFFFFF';
        this._drawRoundedPixelRect(ctx, -4, 2, 8, 6, 1);
        
        // 围嘴上的小心心
        ctx.fillStyle = '#FFB6C1';
        this._drawPixelHeart(ctx, 0, 5, 3);
    }
    
    /**
     * 绘制像素风格星形
     * @private
     */
    _drawPixelStar(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        
        // 简化的像素星形
        const pixelSize = this.pixelSize;
        
        // 中心
        ctx.fillRect(x - pixelSize, y - pixelSize, pixelSize * 2, pixelSize * 2);
        
        // 四个方向的射线
        ctx.fillRect(x - size, y - pixelSize/2, size * 2, pixelSize);
        ctx.fillRect(x - pixelSize/2, y - size, pixelSize, size * 2);
        
        // 对角线射线
        const diagonalSize = size * 0.7;
        ctx.fillRect(x - diagonalSize, y - diagonalSize, pixelSize, diagonalSize * 2);
        ctx.fillRect(x + diagonalSize - pixelSize, y - diagonalSize, pixelSize, diagonalSize * 2);
    }
    
    /**
     * 绘制像素风格爱心
     * @private
     */
    _drawPixelHeart(ctx, x, y, size) {
        const pixelSize = Math.max(1, Math.floor(size / 4));
        
        // 爱心的像素化绘制
        ctx.fillRect(x - pixelSize * 2, y - pixelSize, pixelSize, pixelSize);
        ctx.fillRect(x - pixelSize, y - pixelSize * 2, pixelSize, pixelSize);
        ctx.fillRect(x, y - pixelSize * 2, pixelSize, pixelSize);
        ctx.fillRect(x + pixelSize, y - pixelSize, pixelSize, pixelSize);
        
        ctx.fillRect(x - pixelSize * 2, y, pixelSize, pixelSize);
        ctx.fillRect(x - pixelSize, y, pixelSize, pixelSize);
        ctx.fillRect(x, y, pixelSize, pixelSize);
        ctx.fillRect(x + pixelSize, y, pixelSize, pixelSize);
        
        ctx.fillRect(x - pixelSize, y + pixelSize, pixelSize, pixelSize);
        ctx.fillRect(x, y + pixelSize, pixelSize, pixelSize);
        
        ctx.fillRect(x, y + pixelSize * 2, pixelSize, pixelSize);
    }
    
    /**
     * 绘制圆角像素矩形
     * @private
     */
    _drawRoundedPixelRect(ctx, x, y, width, height, cornerSize) {
        // 主体矩形
        ctx.fillRect(x + cornerSize, y, width - cornerSize * 2, height);
        ctx.fillRect(x, y + cornerSize, width, height - cornerSize * 2);
        
        // 圆角
        ctx.fillRect(x + cornerSize, y + cornerSize, cornerSize, cornerSize);
        ctx.fillRect(x + width - cornerSize * 2, y + cornerSize, cornerSize, cornerSize);
        ctx.fillRect(x + cornerSize, y + height - cornerSize * 2, cornerSize, cornerSize);
        ctx.fillRect(x + width - cornerSize * 2, y + height - cornerSize * 2, cornerSize, cornerSize);
    }
    
    /**
     * 设置质量等级
     * @param {string} level - 质量等级
     */
    setQuality(level) {
        switch (level) {
            case 'low':
                this.magicalSparkles = this.magicalSparkles.slice(0, 15);
                this.gentleLights = this.gentleLights.slice(0, 3);
                this.loveHearts = this.loveHearts.slice(0, 6);
                break;
            case 'medium':
                this.magicalSparkles = this.magicalSparkles.slice(0, 20);
                this.gentleLights = this.gentleLights.slice(0, 4);
                this.loveHearts = this.loveHearts.slice(0, 8);
                break;
            case 'high':
            default:
                // 保持所有效果
                break;
        }
    }
    
    /**
     * 检查动画是否完成
     */
    isAnimationComplete() {
        return this.isComplete;
    }
    
    /**
     * 获取最终角色位置
     */
    getFinalCharacterPosition() {
        return { ...this.characterPosition };
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        this.particles = [];
        this.lights = [];
        this.magicalSparkles = [];
        this.gentleLights = [];
        this.loveHearts = [];
        console.log('Cute birth animation cleaned up');
    }
}