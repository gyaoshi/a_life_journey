/**
 * 儿童期动画模块 - 8个成长事件的活泼动画
 * 包含学会走路、上幼儿园、骑自行车、交朋友、学会游泳、表演、写字、比赛获奖
 * 足迹轨迹、学校书本粒子、友谊之心等特效
 */

export class ChildStageAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 4000, // 4秒动画时长
            eventType: 'learn_walk', // 默认事件类型
            ...config
        };
        
        // 动画状态
        this.currentTime = 0;
        this.isComplete = false;
        this.eventType = this.config.eventType;
        
        // 特效系统
        this.particles = [];
        this.footsteps = [];
        this.bookParticles = [];
        this.friendshipHearts = [];
        this.characterPosition = { x: 400, y: 300 };
        
        // 儿童环境
        this.childEnvironment = {
            playground: { visible: false, equipment: [] },
            school: { visible: false, building: null, books: [] },
            pool: { visible: false, water: null, splashes: [] },
            stage: { visible: false, lights: [], curtain: null }
        };
        
        // 动画进度
        this.animationProgress = 0;
        this.characterScale = 1;
        this.characterEmotion = 'happy';
        this.characterMovement = { x: 0, y: 0 };
        
        this.init();
    }
    
    /**
     * 初始化动画
     */
    init() {
        this.initChildEnvironment();
        this.initParticleSystem();
        this.setupEventSpecificElements();
        console.log(`Child stage animation initialized: ${this.eventType}`);
    }
    
    /**
     * 初始化儿童环境
     */
    initChildEnvironment() {
        // 游乐场设备
        this.childEnvironment.playground.equipment = [
            { type: 'swing', x: 200, y: 350, swing: 0 },
            { type: 'slide', x: 600, y: 320 },
            { type: 'seesaw', x: 400, y: 380, tilt: 0 }
        ];
        
        // 学校建筑
        this.childEnvironment.school.building = {
            x: 100, y: 200, width: 200, height: 150,
            windows: [
                { x: 120, y: 220 }, { x: 160, y: 220 }, { x: 200, y: 220 },
                { x: 120, y: 260 }, { x: 160, y: 260 }, { x: 200, y: 260 }
            ]
        };
        
        // 书本粒子
        for (let i = 0; i < 15; i++) {
            this.childEnvironment.school.books.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                rotation: Math.random() * Math.PI * 2,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                size: Math.random() * 20 + 10
            });
        }
        
        // 游泳池
        this.childEnvironment.pool.water = {
            x: 150, y: 350, width: 500, height: 200,
            waveOffset: 0
        };
        
        // 舞台灯光
        for (let i = 0; i < 6; i++) {
            this.childEnvironment.stage.lights.push({
                x: 100 + i * 120,
                y: 100,
                color: `hsl(${i * 60}, 80%, 70%)`,
                intensity: 0,
                beam: { width: 60, height: 400 }
            });
        }
    }
    
    /**
     * 初始化粒子系统
     */
    initParticleSystem() {
        // 足迹轨迹
        for (let i = 0; i < 10; i++) {
            this.footsteps.push({
                x: 0, y: 0,
                opacity: 0,
                maxOpacity: 0.8,
                size: 15,
                rotation: 0,
                life: 0,
                maxLife: 2000
            });
        }
        
        // 书本粒子
        for (let i = 0; i < 20; i++) {
            this.bookParticles.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                velocity: {
                    x: (Math.random() - 0.5) * 3,
                    y: (Math.random() - 0.5) * 3
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
                size: Math.random() * 15 + 8,
                opacity: 0,
                maxOpacity: Math.random() * 0.8 + 0.2
            });
        }
        
        // 友谊之心
        for (let i = 0; i < 15; i++) {
            this.friendshipHearts.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 200,
                y: this.characterPosition.y + (Math.random() - 0.5) * 200,
                size: Math.random() * 12 + 6,
                color: `hsl(${Math.random() * 60 + 300}, 80%, 70%)`,
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: -Math.random() * 2 - 1
                },
                opacity: 0,
                maxOpacity: Math.random() * 0.9 + 0.1,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    /**
     * 设置事件特定元素
     */
    setupEventSpecificElements() {
        switch (this.eventType) {
            case 'learn_walk':
                this.characterEmotion = 'determined';
                break;
            case 'first_kindergarten':
                this.characterEmotion = 'nervous';
                this.childEnvironment.school.visible = true;
                break;
            case 'learn_bicycle':
                this.characterEmotion = 'focused';
                this.childEnvironment.playground.visible = true;
                break;
            case 'make_friend':
                this.characterEmotion = 'joyful';
                break;
            case 'learn_swim':
                this.characterEmotion = 'brave';
                this.childEnvironment.pool.visible = true;
                break;
            case 'first_performance':
                this.characterEmotion = 'excited';
                this.childEnvironment.stage.visible = true;
                break;
            case 'learn_write':
                this.characterEmotion = 'concentrated';
                break;
            case 'first_award':
                this.characterEmotion = 'proud';
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
            case 'learn_walk':
                this.updateLearnWalkAnimation(deltaTime);
                break;
            case 'first_kindergarten':
                this.updateKindergartenAnimation(deltaTime);
                break;
            case 'learn_bicycle':
                this.updateBicycleAnimation(deltaTime);
                break;
            case 'make_friend':
                this.updateMakeFriendAnimation(deltaTime);
                break;
            case 'learn_swim':
                this.updateSwimAnimation(deltaTime);
                break;
            case 'first_performance':
                this.updatePerformanceAnimation(deltaTime);
                break;
            case 'learn_write':
                this.updateWriteAnimation(deltaTime);
                break;
            case 'first_award':
                this.updateAwardAnimation(deltaTime);
                break;
        }
    }
    
    /**
     * 更新学会走路动画
     */
    updateLearnWalkAnimation(deltaTime) {
        // 摇摆步态
        const walkCycle = Math.sin(this.animationProgress * Math.PI * 4) * 0.5 + 0.5;
        this.characterMovement.x = Math.sin(this.animationProgress * Math.PI * 2) * 5;
        this.characterMovement.y = Math.sin(this.animationProgress * Math.PI * 8) * 2;
        
        // 足迹轨迹
        if (this.animationProgress > 0.1) {
            const stepInterval = 400; // 每400ms一个脚印
            const stepIndex = Math.floor(this.currentTime / stepInterval) % this.footsteps.length;
            const footstep = this.footsteps[stepIndex];
            
            footstep.x = this.characterPosition.x + this.characterMovement.x;
            footstep.y = this.characterPosition.y + 40;
            footstep.opacity = footstep.maxOpacity;
            footstep.life = 0;
        }
    }
    
    /**
     * 更新幼儿园动画
     */
    updateKindergartenAnimation(deltaTime) {
        // 角色向学校移动
        const moveProgress = Math.min(1, this.animationProgress * 1.2);
        this.characterPosition.x = 400 + (200 - 400) * moveProgress;
        
        // 书本粒子飞舞
        if (moveProgress > 0.3) {
            this.bookParticles.forEach(particle => {
                particle.opacity = particle.maxOpacity * (moveProgress - 0.3) * 1.43;
            });
        }
        
        // 紧张兴奋的情绪表现
        this.characterScale = 1 + Math.sin(this.animationProgress * Math.PI * 6) * 0.05;
    }
    
    /**
     * 更新骑自行车动画
     */
    updateBicycleAnimation(deltaTime) {
        // 骑行运动
        const rideProgress = Math.min(1, this.animationProgress * 1.5);
        this.characterPosition.x = 350 + Math.sin(rideProgress * Math.PI) * 100;
        
        // 风力轨迹效果
        this.windTrail = {
            particles: [],
            intensity: rideProgress
        };
        
        // 平衡摇摆
        this.characterMovement.x = Math.sin(this.currentTime * 0.01) * 3 * rideProgress;
    }
    
    /**
     * 更新交朋友动画
     */
    updateMakeFriendAnimation(deltaTime) {
        // 友谊之心效果
        this.friendshipHearts.forEach(heart => {
            heart.opacity = heart.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            heart.pulse += deltaTime * 0.005;
            heart.size = (6 + Math.sin(heart.pulse) * 3);
        });
        
        // 握手光芒
        this.handshakeGlow = {
            radius: 60 * this.animationProgress,
            intensity: 0.7 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新游泳动画
     */
    updateSwimAnimation(deltaTime) {
        // 游泳动作
        const swimCycle = Math.sin(this.animationProgress * Math.PI * 6);
        this.characterMovement.x = swimCycle * 8;
        this.characterMovement.y = Math.sin(this.animationProgress * Math.PI * 3) * 5;
        
        // 水花飞溅
        if (this.animationProgress > 0.2) {
            this.childEnvironment.pool.splashes.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 50,
                y: this.characterPosition.y + 20,
                size: Math.random() * 15 + 5,
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: -Math.random() * 6 - 2
                },
                life: 0,
                maxLife: 1000,
                opacity: 0.8
            });
        }
    }
    
    /**
     * 更新表演动画
     */
    updatePerformanceAnimation(deltaTime) {
        // 舞台灯光效果
        this.childEnvironment.stage.lights.forEach((light, index) => {
            const lightDelay = index * 200;
            const lightProgress = Math.max(0, this.currentTime - lightDelay) / 1000;
            light.intensity = Math.min(1, lightProgress) * (0.5 + Math.sin(this.currentTime * 0.01 + index) * 0.5);
        });
        
        // 表演动作
        this.characterScale = 1 + Math.sin(this.animationProgress * Math.PI * 4) * 0.1;
        this.characterMovement.y = Math.sin(this.animationProgress * Math.PI * 8) * 10;
    }
    
    /**
     * 更新写字动画
     */
    updateWriteAnimation(deltaTime) {
        // 墨水滴落效果
        this.inkDrops = [];
        if (this.animationProgress > 0.3) {
            for (let i = 0; i < 5; i++) {
                this.inkDrops.push({
                    x: this.characterPosition.x + (Math.random() - 0.5) * 30,
                    y: this.characterPosition.y - 10,
                    size: Math.random() * 3 + 1,
                    velocity: { x: 0, y: Math.random() * 2 + 1 },
                    color: '#2F4F4F'
                });
            }
        }
        
        // 书写流动
        this.writingFlow = {
            progress: this.animationProgress,
            intensity: 0.8
        };
    }
    
    /**
     * 更新获奖动画
     */
    updateAwardAnimation(deltaTime) {
        // 胜利彩带
        this.victoryConfetti = [];
        for (let i = 0; i < 20; i++) {
            this.victoryConfetti.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 200,
                y: this.characterPosition.y - Math.random() * 100,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                size: Math.random() * 8 + 3,
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: Math.random() * 3 + 1
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }
        
        // 奖杯光芒
        this.trophyGlow = {
            radius: 80 * this.animationProgress,
            intensity: 0.9 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新粒子系统
     */
    updateParticles(deltaTime) {
        // 更新足迹
        this.footsteps.forEach(footstep => {
            if (footstep.opacity > 0) {
                footstep.life += deltaTime;
                footstep.opacity = footstep.maxOpacity * (1 - footstep.life / footstep.maxLife);
            }
        });
        
        // 更新书本粒子
        this.bookParticles.forEach(particle => {
            particle.x += particle.velocity.x * deltaTime * 0.1;
            particle.y += particle.velocity.y * deltaTime * 0.1;
            particle.rotation += particle.rotationSpeed * deltaTime;
            
            // 边界检查
            if (particle.x < 0 || particle.x > 800) particle.velocity.x *= -1;
            if (particle.y < 0 || particle.y > 600) particle.velocity.y *= -1;
        });
        
        // 更新友谊之心
        this.friendshipHearts.forEach(heart => {
            heart.x += heart.velocity.x * deltaTime * 0.1;
            heart.y += heart.velocity.y * deltaTime * 0.1;
        });
        
        // 更新水花
        if (this.childEnvironment.pool.splashes) {
            this.childEnvironment.pool.splashes.forEach((splash, index) => {
                splash.x += splash.velocity.x * deltaTime * 0.1;
                splash.y += splash.velocity.y * deltaTime * 0.1;
                splash.velocity.y += 0.5; // 重力
                splash.life += deltaTime;
                
                if (splash.life > splash.maxLife) {
                    this.childEnvironment.pool.splashes.splice(index, 1);
                }
            });
        }
    }
    
    /**
     * 更新环境元素
     */
    updateEnvironment(deltaTime) {
        // 游乐场设备动画
        this.childEnvironment.playground.equipment.forEach(equipment => {
            switch (equipment.type) {
                case 'swing':
                    equipment.swing = Math.sin(this.currentTime * 0.003) * 0.3;
                    break;
                case 'seesaw':
                    equipment.tilt = Math.sin(this.currentTime * 0.002) * 0.2;
                    break;
            }
        });
        
        // 游泳池水波
        if (this.childEnvironment.pool.water) {
            this.childEnvironment.pool.water.waveOffset += deltaTime * 0.005;
        }
    }
    
    /**
     * 渲染动画
     * @param {CanvasRenderingContext2D} ctx - 渲染上下文
     */
    render(ctx) {
        ctx.save();
        
        // 渲染环境
        this.renderEnvironment(ctx);
        
        // 渲染特效
        this.renderEffects(ctx);
        
        // 渲染角色
        this.renderCharacter(ctx);
        
        // 渲染事件特定效果
        this.renderEventSpecificEffects(ctx);
        
        ctx.restore();
    }
    
    /**
     * 渲染环境
     */
    renderEnvironment(ctx) {
        // 渲染背景
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#87CEEB'); // 天蓝色
        gradient.addColorStop(1, '#98FB98'); // 浅绿色
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // 渲染学校
        if (this.childEnvironment.school.visible) {
            this.renderSchool(ctx);
        }
        
        // 渲染游乐场
        if (this.childEnvironment.playground.visible) {
            this.renderPlayground(ctx);
        }
        
        // 渲染游泳池
        if (this.childEnvironment.pool.visible) {
            this.renderPool(ctx);
        }
        
        // 渲染舞台
        if (this.childEnvironment.stage.visible) {
            this.renderStage(ctx);
        }
    }
    
    /**
     * 渲染学校
     */
    renderSchool(ctx) {
        const school = this.childEnvironment.school.building;
        
        ctx.save();
        
        // 建筑主体
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(school.x, school.y, school.width, school.height);
        
        // 屋顶
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(school.x - 20, school.y);
        ctx.lineTo(school.x + school.width / 2, school.y - 40);
        ctx.lineTo(school.x + school.width + 20, school.y);
        ctx.closePath();
        ctx.fill();
        
        // 窗户
        ctx.fillStyle = '#87CEEB';
        school.windows.forEach(window => {
            ctx.fillRect(window.x, window.y, 30, 25);
        });
        
        // 门
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(school.x + school.width / 2 - 15, school.y + school.height - 50, 30, 50);
        
        ctx.restore();
    }
    
    /**
     * 渲染游乐场
     */
    renderPlayground(ctx) {
        this.childEnvironment.playground.equipment.forEach(equipment => {
            ctx.save();
            
            switch (equipment.type) {
                case 'swing':
                    ctx.translate(equipment.x, equipment.y);
                    ctx.rotate(equipment.swing);
                    
                    // 秋千架
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(-30, -50);
                    ctx.lineTo(0, -50);
                    ctx.lineTo(30, -50);
                    ctx.moveTo(-30, -50);
                    ctx.lineTo(-30, 0);
                    ctx.moveTo(30, -50);
                    ctx.lineTo(30, 0);
                    ctx.stroke();
                    
                    // 秋千座椅
                    ctx.fillStyle = '#DEB887';
                    ctx.fillRect(-15, -10, 30, 8);
                    break;
                    
                case 'slide':
                    // 滑梯
                    ctx.fillStyle = '#FF6B6B';
                    ctx.fillRect(equipment.x - 20, equipment.y, 40, 80);
                    
                    // 滑道
                    ctx.fillStyle = '#FFB6C1';
                    ctx.beginPath();
                    ctx.moveTo(equipment.x + 20, equipment.y);
                    ctx.quadraticCurveTo(equipment.x + 60, equipment.y + 40, equipment.x + 80, equipment.y + 80);
                    ctx.lineTo(equipment.x + 70, equipment.y + 85);
                    ctx.quadraticCurveTo(equipment.x + 50, equipment.y + 45, equipment.x + 10, equipment.y + 5);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染游泳池
     */
    renderPool(ctx) {
        const pool = this.childEnvironment.pool.water;
        
        ctx.save();
        
        // 池边
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(pool.x - 10, pool.y - 10, pool.width + 20, pool.height + 20);
        
        // 水面
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(pool.x, pool.y, pool.width, pool.height);
        
        // 水波纹
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const y = pool.y + 50 + i * 30;
            ctx.beginPath();
            ctx.moveTo(pool.x, y);
            for (let x = pool.x; x < pool.x + pool.width; x += 20) {
                const waveY = y + Math.sin((x - pool.x) * 0.1 + pool.waveOffset + i) * 5;
                ctx.lineTo(x, waveY);
            }
            ctx.stroke();
        }
        
        // 渲染水花
        this.childEnvironment.pool.splashes.forEach(splash => {
            ctx.globalAlpha = splash.opacity * (1 - splash.life / splash.maxLife);
            ctx.fillStyle = '#87CEEB';
            ctx.beginPath();
            ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
    
    /**
     * 渲染舞台
     */
    renderStage(ctx) {
        ctx.save();
        
        // 舞台地板
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(100, 400, 600, 100);
        
        // 幕布
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(80, 100, 20, 300);
        ctx.fillRect(700, 100, 20, 300);
        ctx.fillRect(100, 100, 600, 20);
        
        // 舞台灯光
        this.childEnvironment.stage.lights.forEach(light => {
            if (light.intensity > 0) {
                ctx.globalAlpha = light.intensity;
                
                // 灯光光束
                const gradient = ctx.createLinearGradient(
                    light.x, light.y,
                    light.x, light.y + light.beam.height
                );
                gradient.addColorStop(0, light.color);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    light.x - light.beam.width / 2,
                    light.y,
                    light.beam.width,
                    light.beam.height
                );
                
                // 灯具
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#2F2F2F';
                ctx.fillRect(light.x - 10, light.y - 20, 20, 20);
            }
        });
        
        ctx.restore();
    }
    
    /**
     * 渲染特效
     */
    renderEffects(ctx) {
        // 渲染足迹
        this.footsteps.forEach(footstep => {
            if (footstep.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = footstep.opacity;
                ctx.fillStyle = '#8B4513';
                
                // 绘制脚印
                ctx.translate(footstep.x, footstep.y);
                ctx.rotate(footstep.rotation);
                ctx.fillRect(-8, -12, 16, 24);
                ctx.fillRect(-6, -16, 12, 8);
                
                ctx.restore();
            }
        });
        
        // 渲染书本粒子
        this.bookParticles.forEach(particle => {
            if (particle.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                
                // 绘制书本
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 2 / 3);
                
                // 书页
                ctx.fillStyle = 'white';
                ctx.fillRect(-particle.size / 2 + 2, -particle.size / 3 + 2, particle.size - 4, particle.size * 2 / 3 - 4);
                
                ctx.restore();
            }
        });
        
        // 渲染友谊之心
        this.friendshipHearts.forEach(heart => {
            if (heart.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = heart.opacity;
                ctx.fillStyle = heart.color;
                
                // 绘制心形
                this.drawHeart(ctx, heart.x, heart.y, heart.size);
                
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
        
        ctx.translate(
            this.characterPosition.x + this.characterMovement.x,
            this.characterPosition.y + this.characterMovement.y
        );
        ctx.scale(this.characterScale, this.characterScale);
        
        // 绘制儿童角色
        this.drawChildCharacter(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制儿童角色
     */
    drawChildCharacter(ctx) {
        // 儿童身体（比婴儿更高更瘦）
        ctx.fillStyle = '#FFE4C4'; // 肤色
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 2;
        
        // 身体
        ctx.beginPath();
        ctx.ellipse(0, 15, 18, 25, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, -20, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 根据情感绘制表情
        this.drawFacialExpression(ctx);
        
        // 头发（更多）
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, -30, 15, 0, Math.PI);
        ctx.fill();
        
        // 手臂（更长）
        ctx.strokeStyle = '#FFE4C4';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-15, 8);
        ctx.lineTo(-25, 25);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(15, 8);
        ctx.lineTo(25, 25);
        ctx.stroke();
        
        // 腿（更长）
        ctx.beginPath();
        ctx.moveTo(-10, 35);
        ctx.lineTo(-10, 50);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(10, 35);
        ctx.lineTo(10, 50);
        ctx.stroke();
        
        // 衣服
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(-12, 5, 24, 20);
    }
    
    /**
     * 绘制面部表情
     */
    drawFacialExpression(ctx) {
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-7, -23, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(7, -23, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(-7, -23, 2.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(7, -23, 2.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // 根据情感绘制嘴巴
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        switch (this.characterEmotion) {
            case 'happy':
            case 'joyful':
            case 'excited':
            case 'proud':
                // 开心大笑
                ctx.beginPath();
                ctx.arc(0, -15, 8, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                break;
            case 'determined':
            case 'focused':
            case 'concentrated':
                // 专注
                ctx.beginPath();
                ctx.moveTo(-5, -15);
                ctx.lineTo(5, -15);
                ctx.stroke();
                break;
            case 'nervous':
                // 紧张
                ctx.beginPath();
                ctx.arc(0, -12, 4, 1.2 * Math.PI, 1.8 * Math.PI);
                ctx.stroke();
                break;
            case 'brave':
                // 勇敢
                ctx.beginPath();
                ctx.arc(0, -15, 6, 0.3 * Math.PI, 0.7 * Math.PI);
                ctx.stroke();
                break;
            default:
                // 默认微笑
                ctx.beginPath();
                ctx.arc(0, -15, 6, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
        }
    }
    
    /**
     * 渲染事件特定效果
     */
    renderEventSpecificEffects(ctx) {
        switch (this.eventType) {
            case 'make_friend':
                if (this.handshakeGlow) {
                    this.renderHandshakeGlow(ctx);
                }
                break;
            case 'first_award':
                if (this.trophyGlow) {
                    this.renderTrophyGlow(ctx);
                }
                if (this.victoryConfetti) {
                    this.renderVictoryConfetti(ctx);
                }
                break;
            case 'learn_write':
                if (this.inkDrops) {
                    this.renderInkDrops(ctx);
                }
                break;
        }
    }
    
    /**
     * 渲染握手光芒
     */
    renderHandshakeGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.handshakeGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x + 30, this.characterPosition.y, 0,
            this.characterPosition.x + 30, this.characterPosition.y, this.handshakeGlow.radius
        );
        gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x + 30, this.characterPosition.y, this.handshakeGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染奖杯光芒
     */
    renderTrophyGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.trophyGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y - 30, 0,
            this.characterPosition.x, this.characterPosition.y - 30, this.trophyGlow.radius
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y - 30, this.trophyGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染胜利彩带
     */
    renderVictoryConfetti(ctx) {
        this.victoryConfetti.forEach(confetti => {
            ctx.save();
            ctx.translate(confetti.x, confetti.y);
            ctx.rotate(confetti.rotation);
            ctx.fillStyle = confetti.color;
            
            ctx.fillRect(-confetti.size / 2, -confetti.size / 4, confetti.size, confetti.size / 2);
            
            ctx.restore();
            
            // 更新彩带位置
            confetti.x += confetti.velocity.x;
            confetti.y += confetti.velocity.y;
            confetti.rotation += confetti.rotationSpeed;
        });
    }
    
    /**
     * 渲染墨水滴
     */
    renderInkDrops(ctx) {
        this.inkDrops.forEach(drop => {
            ctx.save();
            ctx.fillStyle = drop.color;
            ctx.beginPath();
            ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // 更新墨水滴位置
            drop.x += drop.velocity.x;
            drop.y += drop.velocity.y;
        });
    }
    
    /**
     * 设置质量等级
     */
    setQuality(level) {
        switch (level) {
            case 'low':
                this.bookParticles = this.bookParticles.slice(0, 10);
                this.friendshipHearts = this.friendshipHearts.slice(0, 8);
                break;
            case 'medium':
                this.bookParticles = this.bookParticles.slice(0, 15);
                this.friendshipHearts = this.friendshipHearts.slice(0, 12);
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
        this.footsteps = [];
        this.bookParticles = [];
        this.friendshipHearts = [];
        console.log(`Child stage animation cleaned up: ${this.eventType}`);
    }
}