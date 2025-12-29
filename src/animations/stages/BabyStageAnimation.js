/**
 * 婴儿期动画模块 - 6个重要里程碑的温馨动画
 * 包含第一次微笑、学会翻身、第一次爬行、认出妈妈、第一次站立、第一次叫妈妈
 * 温馨婴儿房环境和心形粒子、闪光特效
 */

export class BabyStageAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 4000, // 4秒动画时长
            eventType: 'first_smile', // 默认事件类型
            ...config
        };
        
        // 动画状态
        this.currentTime = 0;
        this.isComplete = false;
        this.eventType = this.config.eventType;
        
        // 特效系统
        this.particles = [];
        this.heartParticles = [];
        this.sparkles = [];
        this.characterPosition = { x: 400, y: 300 };
        
        // 婴儿房环境
        this.nurseryElements = {
            crib: { x: 300, y: 350, visible: false },
            toys: [],
            mobile: { rotation: 0, items: [] },
            wallDecorations: []
        };
        
        // 动画进度
        this.animationProgress = 0;
        this.characterScale = 1;
        this.characterEmotion = 'neutral';
        
        this.init();
    }
    
    /**
     * 初始化动画
     */
    init() {
        this.initNurseryEnvironment();
        this.initParticleSystem();
        this.setupEventSpecificElements();
        console.log(`Baby stage animation initialized: ${this.eventType}`);
    }
    
    /**
     * 初始化婴儿房环境
     */
    initNurseryEnvironment() {
        // 创建玩具
        this.nurseryElements.toys = [
            { type: 'teddy', x: 200, y: 380, color: '#8B4513', bounce: 0 },
            { type: 'ball', x: 600, y: 370, color: '#FF6B6B', bounce: 0 },
            { type: 'blocks', x: 150, y: 390, color: '#4ECDC4', bounce: 0 }
        ];
        
        // 创建床铃
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            this.nurseryElements.mobile.items.push({
                x: 50 * Math.cos(angle),
                y: 30 * Math.sin(angle),
                type: i % 2 === 0 ? 'star' : 'moon',
                color: i % 2 === 0 ? '#FFD700' : '#87CEEB'
            });
        }
        
        // 创建墙面装饰
        this.nurseryElements.wallDecorations = [
            { type: 'cloud', x: 100, y: 100, size: 30 },
            { type: 'cloud', x: 700, y: 120, size: 25 },
            { type: 'sun', x: 400, y: 80, size: 40 }
        ];
    }
    
    /**
     * 初始化粒子系统
     */
    initParticleSystem() {
        // 心形粒子
        for (let i = 0; i < 20; i++) {
            this.heartParticles.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 200,
                y: this.characterPosition.y + (Math.random() - 0.5) * 200,
                size: Math.random() * 8 + 4,
                color: `hsl(${Math.random() * 60 + 300}, 80%, 70%)`, // 粉色系
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: -Math.random() * 3 - 1
                },
                opacity: 0,
                maxOpacity: Math.random() * 0.8 + 0.2,
                life: 0,
                maxLife: Math.random() * 2000 + 2000
            });
        }
        
        // 闪光特效
        for (let i = 0; i < 30; i++) {
            this.sparkles.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 300,
                y: this.characterPosition.y + (Math.random() - 0.5) * 300,
                size: Math.random() * 4 + 2,
                color: `hsl(${Math.random() * 60 + 40}, 90%, 80%)`, // 金色系
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                opacity: 0,
                maxOpacity: Math.random() * 0.9 + 0.1
            });
        }
    }
    
    /**
     * 设置事件特定元素
     */
    setupEventSpecificElements() {
        switch (this.eventType) {
            case 'first_smile':
                this.characterEmotion = 'happy';
                this.nurseryElements.crib.visible = true;
                break;
            case 'learn_rollover':
                this.characterEmotion = 'focused';
                break;
            case 'first_crawl':
                this.characterEmotion = 'curious';
                break;
            case 'recognize_mom':
                this.characterEmotion = 'loving';
                break;
            case 'first_stand':
                this.characterEmotion = 'determined';
                break;
            case 'first_mama':
                this.characterEmotion = 'excited';
                break;
        }
    }
    
    /**
     * 更新动画
     * @param {number} time - 当前时间
     * @param {number} deltaTime - 时间差
     */
    update(time, deltaTime) {
        this.currentTime = time;
        this.animationProgress = Math.min(1, time / this.config.duration);
        
        // 更新事件特定动画
        this.updateEventSpecificAnimation(deltaTime);
        
        // 更新粒子系统
        this.updateParticles(deltaTime);
        
        // 更新环境元素
        this.updateEnvironment(deltaTime);
        
        // 检查动画完成
        if (this.animationProgress >= 1) {
            this.isComplete = true;
        }
    }
    
    /**
     * 更新事件特定动画
     */
    updateEventSpecificAnimation(deltaTime) {
        switch (this.eventType) {
            case 'first_smile':
                this.updateFirstSmileAnimation(deltaTime);
                break;
            case 'learn_rollover':
                this.updateRolloverAnimation(deltaTime);
                break;
            case 'first_crawl':
                this.updateCrawlAnimation(deltaTime);
                break;
            case 'recognize_mom':
                this.updateRecognizeMomAnimation(deltaTime);
                break;
            case 'first_stand':
                this.updateFirstStandAnimation(deltaTime);
                break;
            case 'first_mama':
                this.updateFirstMamaAnimation(deltaTime);
                break;
        }
    }
    
    /**
     * 更新第一次微笑动画
     */
    updateFirstSmileAnimation(deltaTime) {
        // 角色缓慢放大表示喜悦
        this.characterScale = 1 + Math.sin(this.animationProgress * Math.PI) * 0.1;
        
        // 心形粒子逐渐出现
        this.heartParticles.forEach(particle => {
            particle.opacity = particle.maxOpacity * Math.min(1, this.animationProgress * 2);
        });
    }
    
    /**
     * 更新翻身动画
     */
    updateRolloverAnimation(deltaTime) {
        // 角色旋转动画
        const rotationProgress = Math.min(1, this.animationProgress * 1.5);
        this.characterRotation = rotationProgress * Math.PI;
        
        // 闪光特效在翻身完成时爆发
        if (rotationProgress > 0.8) {
            this.sparkles.forEach(sparkle => {
                sparkle.opacity = sparkle.maxOpacity * (rotationProgress - 0.8) * 5;
            });
        }
    }
    
    /**
     * 更新爬行动画
     */
    updateCrawlAnimation(deltaTime) {
        // 角色位置移动
        const moveProgress = Math.min(1, this.animationProgress);
        const startX = 350;
        const endX = 450;
        this.characterPosition.x = startX + (endX - startX) * moveProgress;
        
        // 爬行轨迹特效
        if (moveProgress > 0.2) {
            this.sparkles.forEach((sparkle, index) => {
                if (index < 10) { // 前10个作为轨迹
                    sparkle.x = startX + (this.characterPosition.x - startX) * (index / 10);
                    sparkle.opacity = sparkle.maxOpacity * 0.5;
                }
            });
        }
    }
    
    /**
     * 更新认出妈妈动画
     */
    updateRecognizeMomAnimation(deltaTime) {
        // 爱心泡泡效果
        this.heartParticles.forEach(particle => {
            particle.opacity = particle.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            particle.size = (4 + Math.sin(this.currentTime * 0.01 + particle.x) * 2);
        });
        
        // 认知光环
        this.recognitionGlow = {
            radius: 80 * this.animationProgress,
            intensity: 0.6 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新第一次站立动画
     */
    updateFirstStandAnimation(deltaTime) {
        // 角色垂直位置变化（站起来）
        const standProgress = Math.min(1, this.animationProgress * 1.2);
        this.characterPosition.y = 300 - standProgress * 20;
        
        // 成就星光
        if (standProgress > 0.5) {
            this.sparkles.forEach(sparkle => {
                sparkle.opacity = sparkle.maxOpacity * (standProgress - 0.5) * 2;
                sparkle.twinkle += sparkle.twinkleSpeed * deltaTime;
            });
        }
        
        // 摇摆动画
        this.characterSway = Math.sin(this.currentTime * 0.005) * 5 * standProgress;
    }
    
    /**
     * 更新第一次叫妈妈动画
     */
    updateFirstMamaAnimation(deltaTime) {
        // 声波可视化效果
        const soundWaves = Math.sin(this.animationProgress * Math.PI * 4) * 0.5 + 0.5;
        this.soundWaveRadius = 50 + soundWaves * 30;
        this.soundWaveOpacity = 0.4 * Math.sin(this.animationProgress * Math.PI);
        
        // 语音光芒
        this.speechGlow = {
            radius: 60 * this.animationProgress,
            intensity: 0.8 * soundWaves
        };
    }
    
    /**
     * 更新粒子系统
     */
    updateParticles(deltaTime) {
        // 更新心形粒子
        this.heartParticles.forEach(particle => {
            particle.x += particle.velocity.x * deltaTime * 0.1;
            particle.y += particle.velocity.y * deltaTime * 0.1;
            particle.life += deltaTime;
            
            // 粒子生命周期
            if (particle.life > particle.maxLife) {
                particle.life = 0;
                particle.x = this.characterPosition.x + (Math.random() - 0.5) * 200;
                particle.y = this.characterPosition.y + (Math.random() - 0.5) * 200;
            }
        });
        
        // 更新闪光特效
        this.sparkles.forEach(sparkle => {
            sparkle.twinkle += sparkle.twinkleSpeed * deltaTime;
        });
    }
    
    /**
     * 更新环境元素
     */
    updateEnvironment(deltaTime) {
        // 床铃旋转
        this.nurseryElements.mobile.rotation += deltaTime * 0.001;
        
        // 玩具轻微弹跳
        this.nurseryElements.toys.forEach(toy => {
            toy.bounce = Math.sin(this.currentTime * 0.003 + toy.x * 0.01) * 2;
        });
    }
    
    /**
     * 渲染动画
     * @param {CanvasRenderingContext2D} ctx - 渲染上下文
     */
    render(ctx) {
        ctx.save();
        
        // 渲染婴儿房环境
        this.renderNurseryEnvironment(ctx);
        
        // 渲染特效
        this.renderEffects(ctx);
        
        // 渲染角色
        this.renderCharacter(ctx);
        
        // 渲染事件特定效果
        this.renderEventSpecificEffects(ctx);
        
        ctx.restore();
    }
    
    /**
     * 渲染婴儿房环境
     */
    renderNurseryEnvironment(ctx) {
        // 渲染背景
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#FFE4E1'); // 浅粉色
        gradient.addColorStop(1, '#FFF8DC'); // 浅黄色
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // 渲染墙面装饰
        this.nurseryElements.wallDecorations.forEach(decoration => {
            this.renderDecoration(ctx, decoration);
        });
        
        // 渲染婴儿床（如果可见）
        if (this.nurseryElements.crib.visible) {
            this.renderCrib(ctx);
        }
        
        // 渲染玩具
        this.nurseryElements.toys.forEach(toy => {
            this.renderToy(ctx, toy);
        });
        
        // 渲染床铃
        this.renderMobile(ctx);
    }
    
    /**
     * 渲染装饰
     */
    renderDecoration(ctx, decoration) {
        ctx.save();
        
        switch (decoration.type) {
            case 'cloud':
                ctx.fillStyle = 'white';
                ctx.shadowColor = 'rgba(0,0,0,0.1)';
                ctx.shadowBlur = 5;
                
                // 绘制云朵
                ctx.beginPath();
                ctx.arc(decoration.x, decoration.y, decoration.size * 0.6, 0, Math.PI * 2);
                ctx.arc(decoration.x + decoration.size * 0.4, decoration.y, decoration.size * 0.4, 0, Math.PI * 2);
                ctx.arc(decoration.x - decoration.size * 0.4, decoration.y, decoration.size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'sun':
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FFA500';
                ctx.shadowBlur = 10;
                
                // 绘制太阳
                ctx.beginPath();
                ctx.arc(decoration.x, decoration.y, decoration.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制光芒
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const startRadius = decoration.size * 0.6;
                    const endRadius = decoration.size * 0.8;
                    
                    ctx.beginPath();
                    ctx.moveTo(
                        decoration.x + Math.cos(angle) * startRadius,
                        decoration.y + Math.sin(angle) * startRadius
                    );
                    ctx.lineTo(
                        decoration.x + Math.cos(angle) * endRadius,
                        decoration.y + Math.sin(angle) * endRadius
                    );
                    ctx.stroke();
                }
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染婴儿床
     */
    renderCrib(ctx) {
        const crib = this.nurseryElements.crib;
        
        ctx.save();
        ctx.fillStyle = '#DEB887'; // 木色
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        
        // 床框
        ctx.fillRect(crib.x - 60, crib.y - 20, 120, 40);
        ctx.strokeRect(crib.x - 60, crib.y - 20, 120, 40);
        
        // 床栏杆
        for (let i = 0; i < 8; i++) {
            const x = crib.x - 50 + i * 12;
            ctx.beginPath();
            ctx.moveTo(x, crib.y - 20);
            ctx.lineTo(x, crib.y - 60);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染玩具
     */
    renderToy(ctx, toy) {
        ctx.save();
        ctx.translate(toy.x, toy.y + toy.bounce);
        
        switch (toy.type) {
            case 'teddy':
                // 泰迪熊
                ctx.fillStyle = toy.color;
                ctx.beginPath();
                ctx.arc(0, 0, 15, 0, Math.PI * 2); // 身体
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, -20, 10, 0, Math.PI * 2); // 头
                ctx.fill();
                break;
                
            case 'ball':
                // 球
                ctx.fillStyle = toy.color;
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'blocks':
                // 积木
                ctx.fillStyle = toy.color;
                ctx.fillRect(-8, -8, 16, 16);
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染床铃
     */
    renderMobile(ctx) {
        const mobile = this.nurseryElements.mobile;
        
        ctx.save();
        ctx.translate(400, 150);
        ctx.rotate(mobile.rotation);
        
        // 床铃支架
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -30);
        ctx.stroke();
        
        // 床铃物品
        mobile.items.forEach(item => {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.fillStyle = item.color;
            
            if (item.type === 'star') {
                // 绘制星星
                this.drawStar(ctx, 0, 0, 8, 5);
            } else {
                // 绘制月亮
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
        
        ctx.restore();
    }
    
    /**
     * 绘制星星
     */
    drawStar(ctx, x, y, radius, points) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const r = i % 2 === 0 ? radius : radius * 0.5;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    /**
     * 渲染特效
     */
    renderEffects(ctx) {
        // 渲染心形粒子
        this.heartParticles.forEach(particle => {
            if (particle.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                
                // 绘制心形
                this.drawHeart(ctx, particle.x, particle.y, particle.size);
                
                ctx.restore();
            }
        });
        
        // 渲染闪光特效
        this.sparkles.forEach(sparkle => {
            if (sparkle.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = sparkle.opacity * (Math.sin(sparkle.twinkle) * 0.5 + 0.5);
                ctx.fillStyle = sparkle.color;
                ctx.shadowColor = sparkle.color;
                ctx.shadowBlur = sparkle.size * 2;
                
                ctx.beginPath();
                ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        });
    }
    
    /**
     * 绘制心形
     */
    drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 10, size / 10);
        
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(-5, -2, -10, 1, -5, 8);
        ctx.bezierCurveTo(0, 12, 0, 12, 0, 12);
        ctx.bezierCurveTo(0, 12, 0, 12, 5, 8);
        ctx.bezierCurveTo(10, 1, 5, -2, 0, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染角色
     */
    renderCharacter(ctx) {
        ctx.save();
        
        ctx.translate(this.characterPosition.x, this.characterPosition.y);
        if (this.characterRotation) {
            ctx.rotate(this.characterRotation);
        }
        if (this.characterSway) {
            ctx.translate(this.characterSway, 0);
        }
        ctx.scale(this.characterScale, this.characterScale);
        
        // 绘制婴儿角色
        this.drawBabyCharacter(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制婴儿角色
     */
    drawBabyCharacter(ctx) {
        // 婴儿身体
        ctx.fillStyle = '#FFE4C4'; // 肤色
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 2;
        
        // 身体
        ctx.beginPath();
        ctx.ellipse(0, 10, 15, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, -15, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 根据情感绘制表情
        this.drawFacialExpression(ctx);
        
        // 头发
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, -25, 12, 0, Math.PI);
        ctx.fill();
        
        // 手臂
        ctx.strokeStyle = '#FFE4C4';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-12, 5);
        ctx.lineTo(-20, 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(12, 5);
        ctx.lineTo(20, 15);
        ctx.stroke();
        
        // 腿
        ctx.beginPath();
        ctx.moveTo(-8, 25);
        ctx.lineTo(-8, 35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(8, 25);
        ctx.lineTo(8, 35);
        ctx.stroke();
    }
    
    /**
     * 绘制面部表情
     */
    drawFacialExpression(ctx) {
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-6, -18, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -18, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(-6, -18, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -18, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // 根据情感绘制嘴巴
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        switch (this.characterEmotion) {
            case 'happy':
                // 大笑
                ctx.beginPath();
                ctx.arc(0, -10, 8, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                break;
            case 'focused':
                // 专注
                ctx.beginPath();
                ctx.arc(0, -8, 4, 0, Math.PI);
                ctx.stroke();
                break;
            case 'curious':
                // 好奇
                ctx.beginPath();
                ctx.ellipse(0, -10, 3, 5, 0, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case 'loving':
                // 爱意
                ctx.beginPath();
                ctx.arc(0, -10, 6, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
            case 'determined':
                // 坚定
                ctx.beginPath();
                ctx.moveTo(-4, -10);
                ctx.lineTo(4, -10);
                ctx.stroke();
                break;
            case 'excited':
                // 兴奋
                ctx.beginPath();
                ctx.arc(0, -10, 6, 0, Math.PI);
                ctx.stroke();
                break;
            default:
                // 中性
                ctx.beginPath();
                ctx.arc(0, -10, 4, 0.3 * Math.PI, 0.7 * Math.PI);
                ctx.stroke();
        }
    }
    
    /**
     * 渲染事件特定效果
     */
    renderEventSpecificEffects(ctx) {
        switch (this.eventType) {
            case 'recognize_mom':
                if (this.recognitionGlow) {
                    this.renderRecognitionGlow(ctx);
                }
                break;
            case 'first_mama':
                if (this.soundWaveRadius) {
                    this.renderSoundWaves(ctx);
                }
                if (this.speechGlow) {
                    this.renderSpeechGlow(ctx);
                }
                break;
        }
    }
    
    /**
     * 渲染认知光环
     */
    renderRecognitionGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.recognitionGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y, 0,
            this.characterPosition.x, this.characterPosition.y, this.recognitionGlow.radius
        );
        gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y, this.recognitionGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染声波
     */
    renderSoundWaves(ctx) {
        ctx.save();
        ctx.globalAlpha = this.soundWaveOpacity;
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 3; i++) {
            const radius = this.soundWaveRadius + i * 20;
            ctx.beginPath();
            ctx.arc(this.characterPosition.x, this.characterPosition.y - 15, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * 渲染语音光芒
     */
    renderSpeechGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.speechGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y - 15, 0,
            this.characterPosition.x, this.characterPosition.y - 15, this.speechGlow.radius
        );
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y - 15, this.speechGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 设置质量等级
     */
    setQuality(level) {
        switch (level) {
            case 'low':
                this.heartParticles = this.heartParticles.slice(0, 10);
                this.sparkles = this.sparkles.slice(0, 15);
                break;
            case 'medium':
                this.heartParticles = this.heartParticles.slice(0, 15);
                this.sparkles = this.sparkles.slice(0, 20);
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
     * 清理资源
     */
    cleanup() {
        this.particles = [];
        this.heartParticles = [];
        this.sparkles = [];
        console.log(`Baby stage animation cleaned up: ${this.eventType}`);
    }
}