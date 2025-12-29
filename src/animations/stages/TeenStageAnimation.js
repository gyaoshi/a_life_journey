/**
 * 青少年期动画模块 - 8个关键事件的情感动画
 * 包含入学考试、初恋告白、社团活动、选专业、高考冲刺、获奖学金、打工、毕业典礼
 * 学习笔记粒子、爱情花瓣、创意火花等特效
 */

export class TeenStageAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 4000, // 4秒动画时长
            eventType: 'entrance_exam', // 默认事件类型
            ...config
        };
        
        // 动画状态
        this.currentTime = 0;
        this.isComplete = false;
        this.eventType = this.config.eventType;
        
        // 特效系统
        this.particles = [];
        this.studyNotes = [];
        this.lovePetals = [];
        this.creativeSparks = [];
        this.characterPosition = { x: 400, y: 300 };
        
        // 青少年环境
        this.teenEnvironment = {
            classroom: { visible: false, desks: [], blackboard: null },
            campus: { visible: false, buildings: [], trees: [] },
            club: { visible: false, equipment: [], stage: null },
            workplace: { visible: false, counter: null, customers: [] }
        };
        
        // 动画进度
        this.animationProgress = 0;
        this.characterScale = 1;
        this.characterEmotion = 'focused';
        this.characterMovement = { x: 0, y: 0 };
        this.characterRotation = 0;
        
        this.init();
    }
    
    /**
     * 初始化动画
     */
    init() {
        this.initTeenEnvironment();
        this.initParticleSystem();
        this.setupEventSpecificElements();
        console.log(`Teen stage animation initialized: ${this.eventType}`);
    }
    
    /**
     * 初始化青少年环境
     */
    initTeenEnvironment() {
        // 教室环境
        this.teenEnvironment.classroom.desks = [
            { x: 200, y: 350, occupied: true },
            { x: 300, y: 350, occupied: false },
            { x: 500, y: 350, occupied: false },
            { x: 600, y: 350, occupied: false }
        ];
        
        this.teenEnvironment.classroom.blackboard = {
            x: 100, y: 200, width: 600, height: 100,
            content: '数学公式 f(x) = ax² + bx + c'
        };
        
        // 校园环境
        this.teenEnvironment.campus.buildings = [
            { x: 50, y: 150, width: 150, height: 200, type: 'main' },
            { x: 250, y: 180, width: 120, height: 170, type: 'library' },
            { x: 600, y: 160, width: 140, height: 190, type: 'lab' }
        ];
        
        this.teenEnvironment.campus.trees = [
            { x: 400, y: 380, size: 40, sway: 0 },
            { x: 500, y: 390, size: 35, sway: 0 },
            { x: 150, y: 400, size: 45, sway: 0 }
        ];
        
        // 社团活动室
        this.teenEnvironment.club.equipment = [
            { type: 'easel', x: 200, y: 300 },
            { type: 'piano', x: 500, y: 320 },
            { type: 'computer', x: 350, y: 280 }
        ];
        
        // 打工场所
        this.teenEnvironment.workplace.counter = {
            x: 300, y: 350, width: 200, height: 50
        };
        
        this.teenEnvironment.workplace.customers = [
            { x: 250, y: 400, mood: 'happy' },
            { x: 550, y: 410, mood: 'neutral' }
        ];
    }
    
    /**
     * 初始化粒子系统
     */
    initParticleSystem() {
        // 学习笔记粒子
        for (let i = 0; i < 25; i++) {
            this.studyNotes.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                content: ['A+', '公式', '笔记', '重点'][Math.floor(Math.random() * 4)],
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                color: `hsl(${Math.random() * 60 + 40}, 70%, 80%)`,
                size: Math.random() * 20 + 15,
                opacity: 0,
                maxOpacity: Math.random() * 0.8 + 0.2
            });
        }
        
        // 爱情花瓣
        for (let i = 0; i < 30; i++) {
            this.lovePetals.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 300,
                y: this.characterPosition.y + (Math.random() - 0.5) * 300,
                size: Math.random() * 12 + 6,
                color: `hsl(${Math.random() * 60 + 300}, 90%, 80%)`, // 粉红色系
                velocity: {
                    x: (Math.random() - 0.5) * 3,
                    y: -Math.random() * 4 - 1
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                opacity: 0,
                maxOpacity: Math.random() * 0.9 + 0.1,
                flutter: Math.random() * Math.PI * 2
            });
        }
        
        // 创意火花
        for (let i = 0; i < 20; i++) {
            this.creativeSparks.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 200,
                y: this.characterPosition.y + (Math.random() - 0.5) * 200,
                size: Math.random() * 8 + 4,
                color: `hsl(${Math.random() * 120 + 180}, 80%, 70%)`, // 蓝绿色系
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: (Math.random() - 0.5) * 4
                },
                energy: Math.random(),
                maxEnergy: 1,
                opacity: 0,
                maxOpacity: Math.random() * 0.8 + 0.2,
                sparkle: Math.random() * Math.PI * 2
            });
        }
    }
    
    /**
     * 设置事件特定元素
     */
    setupEventSpecificElements() {
        switch (this.eventType) {
            case 'entrance_exam':
                this.characterEmotion = 'concentrated';
                this.teenEnvironment.classroom.visible = true;
                break;
            case 'first_love':
                this.characterEmotion = 'shy';
                this.teenEnvironment.campus.visible = true;
                break;
            case 'club_activity':
                this.characterEmotion = 'creative';
                this.teenEnvironment.club.visible = true;
                break;
            case 'choose_major':
                this.characterEmotion = 'thoughtful';
                break;
            case 'exam_sprint':
                this.characterEmotion = 'intense';
                this.teenEnvironment.classroom.visible = true;
                break;
            case 'scholarship':
                this.characterEmotion = 'proud';
                break;
            case 'part_time_job':
                this.characterEmotion = 'hardworking';
                this.teenEnvironment.workplace.visible = true;
                break;
            case 'graduation':
                this.characterEmotion = 'nostalgic';
                this.teenEnvironment.campus.visible = true;
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
            case 'entrance_exam':
                this.updateEntranceExamAnimation(deltaTime);
                break;
            case 'first_love':
                this.updateFirstLoveAnimation(deltaTime);
                break;
            case 'club_activity':
                this.updateClubActivityAnimation(deltaTime);
                break;
            case 'choose_major':
                this.updateChooseMajorAnimation(deltaTime);
                break;
            case 'exam_sprint':
                this.updateExamSprintAnimation(deltaTime);
                break;
            case 'scholarship':
                this.updateScholarshipAnimation(deltaTime);
                break;
            case 'part_time_job':
                this.updatePartTimeJobAnimation(deltaTime);
                break;
            case 'graduation':
                this.updateGraduationAnimation(deltaTime);
                break;
        }
    }
    
    /**
     * 更新入学考试动画
     */
    updateEntranceExamAnimation(deltaTime) {
        // 书写运动
        const writeIntensity = Math.sin(this.animationProgress * Math.PI * 8) * 0.5 + 0.5;
        this.characterMovement.x = Math.sin(this.currentTime * 0.02) * 3 * writeIntensity;
        
        // 学习笔记粒子飞舞
        this.studyNotes.forEach(note => {
            note.opacity = note.maxOpacity * Math.min(1, this.animationProgress * 2);
        });
        
        // 专注强度表现
        this.focusIntensity = {
            radius: 60 * this.animationProgress,
            intensity: 0.7 * writeIntensity
        };
    }
    
    /**
     * 更新初恋告白动画
     */
    updateFirstLoveAnimation(deltaTime) {
        // 心跳颤动
        const heartbeat = Math.sin(this.animationProgress * Math.PI * 12) * 0.5 + 0.5;
        this.characterScale = 1 + heartbeat * 0.05;
        
        // 爱情花瓣效果
        this.lovePetals.forEach(petal => {
            petal.opacity = petal.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            petal.flutter += deltaTime * 0.01;
            petal.size = (6 + Math.sin(petal.flutter) * 2);
        });
        
        // 害羞红晕
        this.blushEffect = {
            intensity: 0.6 * heartbeat,
            color: 'rgba(255, 182, 193, 0.6)'
        };
    }
    
    /**
     * 更新社团活动动画
     */
    updateClubActivityAnimation(deltaTime) {
        // 创意火花爆发
        this.creativeSparks.forEach(spark => {
            spark.opacity = spark.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            spark.energy = Math.sin(this.currentTime * 0.01 + spark.x * 0.01) * 0.5 + 0.5;
            spark.sparkle += deltaTime * 0.008;
        });
        
        // 艺术流动效果
        this.artFlow = {
            waves: [],
            intensity: this.animationProgress
        };
        
        for (let i = 0; i < 5; i++) {
            this.artFlow.waves.push({
                x: this.characterPosition.x + Math.sin(this.currentTime * 0.005 + i) * 100,
                y: this.characterPosition.y + Math.cos(this.currentTime * 0.005 + i) * 50,
                radius: 30 + i * 10,
                color: `hsl(${(this.currentTime * 0.1 + i * 60) % 360}, 70%, 60%)`
            });
        }
    }
    
    /**
     * 更新选择专业动画
     */
    updateChooseMajorAnimation(deltaTime) {
        // 决策光线
        this.decisionRays = [];
        const rayCount = 6;
        
        for (let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const progress = Math.max(0, this.animationProgress - i * 0.1);
            
            this.decisionRays.push({
                angle: angle,
                length: 80 * progress,
                intensity: 0.8 * progress,
                color: `hsl(${i * 60}, 80%, 70%)`
            });
        }
        
        // 选择光芒
        this.choiceGlow = {
            radius: 100 * this.animationProgress,
            intensity: 0.6 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新高考冲刺动画
     */
    updateExamSprintAnimation(deltaTime) {
        // 高强度学习效果
        const intensity = Math.sin(this.animationProgress * Math.PI * 10) * 0.5 + 0.5;
        this.characterMovement.x = Math.sin(this.currentTime * 0.05) * 2 * intensity;
        this.characterMovement.y = Math.sin(this.currentTime * 0.03) * 1 * intensity;
        
        // 专注光芒
        this.studyGlow = {
            radius: 70 * this.animationProgress,
            intensity: 0.9 * intensity,
            color: 'rgba(255, 255, 0, 0.6)'
        };
        
        // 学习笔记暴风雪
        this.studyNotes.forEach(note => {
            note.opacity = note.maxOpacity * intensity;
            note.velocity.x += (Math.random() - 0.5) * 0.5;
            note.velocity.y += (Math.random() - 0.5) * 0.5;
        });
    }
    
    /**
     * 更新获得奖学金动画
     */
    updateScholarshipAnimation(deltaTime) {
        // 金色星光
        this.goldenStars = [];
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const distance = 60 + Math.sin(this.currentTime * 0.01 + i) * 20;
            
            this.goldenStars.push({
                x: this.characterPosition.x + Math.cos(angle) * distance,
                y: this.characterPosition.y + Math.sin(angle) * distance,
                size: 8 + Math.sin(this.currentTime * 0.02 + i) * 3,
                opacity: 0.8 * Math.sin(this.animationProgress * Math.PI),
                twinkle: this.currentTime * 0.01 + i
            });
        }
        
        // 奖杯闪耀
        this.trophyShine = {
            radius: 90 * this.animationProgress,
            intensity: 0.9 * Math.sin(this.animationProgress * Math.PI),
            color: 'rgba(255, 215, 0, 0.8)'
        };
    }
    
    /**
     * 更新打工动画
     */
    updatePartTimeJobAnimation(deltaTime) {
        // 工作汗水
        this.workSweat = [];
        if (this.animationProgress > 0.3) {
            for (let i = 0; i < 8; i++) {
                this.workSweat.push({
                    x: this.characterPosition.x + (Math.random() - 0.5) * 30,
                    y: this.characterPosition.y - 20 - Math.random() * 10,
                    size: Math.random() * 4 + 2,
                    velocity: { x: 0, y: Math.random() * 2 + 1 },
                    opacity: 0.6,
                    color: 'rgba(135, 206, 235, 0.8)'
                });
            }
        }
        
        // 劳动运动
        const workRhythm = Math.sin(this.animationProgress * Math.PI * 6) * 0.5 + 0.5;
        this.characterMovement.y = Math.sin(this.currentTime * 0.01) * 3 * workRhythm;
        
        // 努力光环
        this.effortAura = {
            radius: 50 * this.animationProgress,
            intensity: 0.5 * workRhythm
        };
    }
    
    /**
     * 更新毕业典礼动画
     */
    updateGraduationAnimation(deltaTime) {
        // 毕业帽飞舞
        this.graduationCaps = [];
        for (let i = 0; i < 10; i++) {
            this.graduationCaps.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 300,
                y: this.characterPosition.y - Math.random() * 200,
                velocity: {
                    x: (Math.random() - 0.5) * 3,
                    y: -Math.random() * 4 - 2
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                size: Math.random() * 20 + 15
            });
        }
        
        // 仪式光芒
        this.ceremonyGlow = {
            radius: 120 * this.animationProgress,
            intensity: 0.7 * Math.sin(this.animationProgress * Math.PI),
            color: 'rgba(255, 215, 0, 0.6)'
        };
        
        // 怀旧情感波动
        this.nostalgiaWave = Math.sin(this.animationProgress * Math.PI * 3) * 0.3 + 0.7;
    }
    
    /**
     * 更新粒子系统
     */
    updateParticles(deltaTime) {
        // 更新学习笔记
        this.studyNotes.forEach(note => {
            note.x += note.velocity.x * deltaTime * 0.1;
            note.y += note.velocity.y * deltaTime * 0.1;
            note.rotation += note.rotationSpeed * deltaTime;
            
            // 边界检查
            if (note.x < 0 || note.x > 800) note.velocity.x *= -1;
            if (note.y < 0 || note.y > 600) note.velocity.y *= -1;
        });
        
        // 更新爱情花瓣
        this.lovePetals.forEach(petal => {
            petal.x += petal.velocity.x * deltaTime * 0.1;
            petal.y += petal.velocity.y * deltaTime * 0.1;
            petal.rotation += petal.rotationSpeed * deltaTime;
            
            // 飘落效果
            petal.velocity.y += 0.02; // 重力
            petal.velocity.x += Math.sin(petal.flutter) * 0.01; // 飘摆
        });
        
        // 更新创意火花
        this.creativeSparks.forEach(spark => {
            spark.x += spark.velocity.x * deltaTime * 0.1;
            spark.y += spark.velocity.y * deltaTime * 0.1;
            spark.sparkle += deltaTime * 0.01;
            
            // 能量脉动
            spark.size = (4 + Math.sin(spark.sparkle) * 2) * spark.energy;
        });
    }
    
    /**
     * 更新环境元素
     */
    updateEnvironment(deltaTime) {
        // 校园树木摇摆
        this.teenEnvironment.campus.trees.forEach(tree => {
            tree.sway = Math.sin(this.currentTime * 0.002 + tree.x * 0.01) * 0.1;
        });
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
        gradient.addColorStop(0, '#E6E6FA'); // 淡紫色
        gradient.addColorStop(1, '#F0F8FF'); // 爱丽丝蓝
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // 渲染教室
        if (this.teenEnvironment.classroom.visible) {
            this.renderClassroom(ctx);
        }
        
        // 渲染校园
        if (this.teenEnvironment.campus.visible) {
            this.renderCampus(ctx);
        }
        
        // 渲染社团活动室
        if (this.teenEnvironment.club.visible) {
            this.renderClub(ctx);
        }
        
        // 渲染工作场所
        if (this.teenEnvironment.workplace.visible) {
            this.renderWorkplace(ctx);
        }
    }
    
    /**
     * 渲染教室
     */
    renderClassroom(ctx) {
        // 黑板
        const blackboard = this.teenEnvironment.classroom.blackboard;
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(blackboard.x, blackboard.y, blackboard.width, blackboard.height);
        
        // 黑板内容
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(blackboard.content, blackboard.x + 20, blackboard.y + 50);
        
        // 课桌
        this.teenEnvironment.classroom.desks.forEach(desk => {
            ctx.fillStyle = desk.occupied ? '#DEB887' : '#F5DEB3';
            ctx.fillRect(desk.x - 25, desk.y - 15, 50, 30);
            
            // 椅子
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(desk.x - 20, desk.y + 20, 40, 8);
        });
    }
    
    /**
     * 渲染校园
     */
    renderCampus(ctx) {
        // 建筑物
        this.teenEnvironment.campus.buildings.forEach(building => {
            ctx.fillStyle = building.type === 'main' ? '#DEB887' : '#D2B48C';
            ctx.fillRect(building.x, building.y, building.width, building.height);
            
            // 屋顶
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.moveTo(building.x - 10, building.y);
            ctx.lineTo(building.x + building.width / 2, building.y - 30);
            ctx.lineTo(building.x + building.width + 10, building.y);
            ctx.closePath();
            ctx.fill();
            
            // 窗户
            ctx.fillStyle = '#87CEEB';
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 2; j++) {
                    ctx.fillRect(
                        building.x + 20 + i * 40,
                        building.y + 30 + j * 50,
                        25, 30
                    );
                }
            }
        });
        
        // 树木
        this.teenEnvironment.campus.trees.forEach(tree => {
            ctx.save();
            ctx.translate(tree.x, tree.y);
            ctx.rotate(tree.sway);
            
            // 树干
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-5, 0, 10, 40);
            
            // 树冠
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(0, -10, tree.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染社团活动室
     */
    renderClub(ctx) {
        // 活动室背景
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(100, 200, 600, 300);
        
        // 设备
        this.teenEnvironment.club.equipment.forEach(equipment => {
            ctx.save();
            
            switch (equipment.type) {
                case 'easel':
                    // 画架
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(equipment.x - 20, equipment.y + 50);
                    ctx.lineTo(equipment.x, equipment.y - 30);
                    ctx.lineTo(equipment.x + 20, equipment.y + 50);
                    ctx.stroke();
                    
                    // 画布
                    ctx.fillStyle = 'white';
                    ctx.fillRect(equipment.x - 25, equipment.y - 20, 50, 40);
                    break;
                    
                case 'piano':
                    // 钢琴
                    ctx.fillStyle = '#2F2F2F';
                    ctx.fillRect(equipment.x - 40, equipment.y - 20, 80, 40);
                    
                    // 琴键
                    ctx.fillStyle = 'white';
                    for (let i = 0; i < 7; i++) {
                        ctx.fillRect(equipment.x - 35 + i * 10, equipment.y + 15, 8, 15);
                    }
                    break;
                    
                case 'computer':
                    // 电脑
                    ctx.fillStyle = '#C0C0C0';
                    ctx.fillRect(equipment.x - 20, equipment.y - 15, 40, 30);
                    
                    // 屏幕
                    ctx.fillStyle = '#000080';
                    ctx.fillRect(equipment.x - 18, equipment.y - 13, 36, 20);
                    break;
            }
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染工作场所
     */
    renderWorkplace(ctx) {
        // 柜台
        const counter = this.teenEnvironment.workplace.counter;
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(counter.x, counter.y, counter.width, counter.height);
        
        // 收银机
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(counter.x + 50, counter.y - 20, 40, 20);
        
        // 顾客
        this.teenEnvironment.workplace.customers.forEach(customer => {
            ctx.save();
            ctx.translate(customer.x, customer.y);
            
            // 简单的顾客形象
            ctx.fillStyle = customer.mood === 'happy' ? '#FFB6C1' : '#D3D3D3';
            ctx.beginPath();
            ctx.arc(0, -10, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(-10, 0, 20, 30);
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染特效
     */
    renderEffects(ctx) {
        // 渲染学习笔记
        this.studyNotes.forEach(note => {
            if (note.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = note.opacity;
                ctx.translate(note.x, note.y);
                ctx.rotate(note.rotation);
                
                // 笔记纸
                ctx.fillStyle = note.color;
                ctx.fillRect(-note.size / 2, -note.size / 3, note.size, note.size * 2 / 3);
                
                // 文字
                ctx.fillStyle = '#2F2F2F';
                ctx.font = `${note.size / 3}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(note.content, 0, 0);
                
                ctx.restore();
            }
        });
        
        // 渲染爱情花瓣
        this.lovePetals.forEach(petal => {
            if (petal.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = petal.opacity;
                ctx.translate(petal.x, petal.y);
                ctx.rotate(petal.rotation);
                
                // 花瓣形状
                ctx.fillStyle = petal.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, petal.size, petal.size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        });
        
        // 渲染创意火花
        this.creativeSparks.forEach(spark => {
            if (spark.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = spark.opacity * (Math.sin(spark.sparkle) * 0.5 + 0.5);
                ctx.fillStyle = spark.color;
                ctx.shadowColor = spark.color;
                ctx.shadowBlur = spark.size * 2;
                
                // 火花形状
                this.drawStar(ctx, spark.x, spark.y, spark.size, 6);
                
                ctx.restore();
            }
        });
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
     * 渲染角色
     */
    renderCharacter(ctx) {
        ctx.save();
        
        ctx.translate(
            this.characterPosition.x + this.characterMovement.x,
            this.characterPosition.y + this.characterMovement.y
        );
        ctx.rotate(this.characterRotation);
        ctx.scale(this.characterScale, this.characterScale);
        
        // 绘制青少年角色
        this.drawTeenCharacter(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制青少年角色
     */
    drawTeenCharacter(ctx) {
        // 青少年身体（更高更成熟）
        ctx.fillStyle = '#FFE4C4'; // 肤色
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 2;
        
        // 身体
        ctx.beginPath();
        ctx.ellipse(0, 20, 20, 30, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, -25, 22, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 根据情感绘制表情
        this.drawFacialExpression(ctx);
        
        // 头发（青少年发型）
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, -35, 18, 0, Math.PI);
        ctx.fill();
        
        // 刘海
        ctx.beginPath();
        ctx.arc(-8, -40, 8, 0, Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, -40, 8, 0, Math.PI);
        ctx.fill();
        
        // 手臂
        ctx.strokeStyle = '#FFE4C4';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-18, 10);
        ctx.lineTo(-30, 30);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(18, 10);
        ctx.lineTo(30, 30);
        ctx.stroke();
        
        // 腿
        ctx.beginPath();
        ctx.moveTo(-12, 45);
        ctx.lineTo(-12, 65);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(12, 45);
        ctx.lineTo(12, 65);
        ctx.stroke();
        
        // 校服
        ctx.fillStyle = '#000080';
        ctx.fillRect(-15, 8, 30, 25);
        
        // 领带
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(-3, 8, 6, 20);
    }
    
    /**
     * 绘制面部表情
     */
    drawFacialExpression(ctx) {
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-8, -28, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, -28, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(-8, -28, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, -28, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 根据情感绘制嘴巴和眉毛
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        switch (this.characterEmotion) {
            case 'concentrated':
            case 'intense':
                // 专注皱眉
                ctx.beginPath();
                ctx.moveTo(-12, -35);
                ctx.lineTo(-5, -32);
                ctx.moveTo(5, -32);
                ctx.lineTo(12, -35);
                ctx.stroke();
                
                // 紧抿的嘴
                ctx.beginPath();
                ctx.moveTo(-6, -18);
                ctx.lineTo(6, -18);
                ctx.stroke();
                break;
                
            case 'shy':
                // 害羞表情
                ctx.beginPath();
                ctx.arc(0, -18, 4, 0.3 * Math.PI, 0.7 * Math.PI);
                ctx.stroke();
                
                // 红晕
                if (this.blushEffect) {
                    ctx.fillStyle = this.blushEffect.color;
                    ctx.globalAlpha = this.blushEffect.intensity;
                    ctx.beginPath();
                    ctx.arc(-15, -25, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(15, -25, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
                break;
                
            case 'creative':
                // 创意兴奋
                ctx.beginPath();
                ctx.arc(0, -18, 8, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                
                // 兴奋的眉毛
                ctx.beginPath();
                ctx.moveTo(-10, -35);
                ctx.lineTo(-6, -32);
                ctx.moveTo(6, -32);
                ctx.lineTo(10, -35);
                ctx.stroke();
                break;
                
            case 'thoughtful':
                // 思考表情
                ctx.beginPath();
                ctx.arc(0, -18, 5, 0, Math.PI);
                ctx.stroke();
                
                // 思考皱眉
                ctx.beginPath();
                ctx.moveTo(-10, -33);
                ctx.lineTo(-6, -34);
                ctx.moveTo(6, -34);
                ctx.lineTo(10, -33);
                ctx.stroke();
                break;
                
            case 'proud':
                // 骄傲微笑
                ctx.beginPath();
                ctx.arc(0, -18, 10, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                
                // 自信的眉毛
                ctx.beginPath();
                ctx.moveTo(-12, -34);
                ctx.lineTo(-6, -33);
                ctx.moveTo(6, -33);
                ctx.lineTo(12, -34);
                ctx.stroke();
                break;
                
            case 'hardworking':
                // 努力工作
                ctx.beginPath();
                ctx.arc(0, -18, 6, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
                
            case 'nostalgic':
                // 怀旧
                ctx.beginPath();
                ctx.arc(0, -18, 7, 0.15 * Math.PI, 0.85 * Math.PI);
                ctx.stroke();
                break;
                
            default:
                // 默认微笑
                ctx.beginPath();
                ctx.arc(0, -18, 6, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
        }
    }
    
    /**
     * 渲染事件特定效果
     */
    renderEventSpecificEffects(ctx) {
        switch (this.eventType) {
            case 'entrance_exam':
                if (this.focusIntensity) {
                    this.renderFocusEffect(ctx);
                }
                break;
            case 'choose_major':
                if (this.decisionRays) {
                    this.renderDecisionRays(ctx);
                }
                if (this.choiceGlow) {
                    this.renderChoiceGlow(ctx);
                }
                break;
            case 'exam_sprint':
                if (this.studyGlow) {
                    this.renderStudyGlow(ctx);
                }
                break;
            case 'scholarship':
                if (this.goldenStars) {
                    this.renderGoldenStars(ctx);
                }
                if (this.trophyShine) {
                    this.renderTrophyShine(ctx);
                }
                break;
            case 'club_activity':
                if (this.artFlow) {
                    this.renderArtFlow(ctx);
                }
                break;
            case 'part_time_job':
                if (this.workSweat) {
                    this.renderWorkSweat(ctx);
                }
                if (this.effortAura) {
                    this.renderEffortAura(ctx);
                }
                break;
            case 'graduation':
                if (this.graduationCaps) {
                    this.renderGraduationCaps(ctx);
                }
                if (this.ceremonyGlow) {
                    this.renderCeremonyGlow(ctx);
                }
                break;
        }
    }
    
    /**
     * 渲染专注效果
     */
    renderFocusEffect(ctx) {
        ctx.save();
        ctx.globalAlpha = this.focusIntensity.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y - 20, 0,
            this.characterPosition.x, this.characterPosition.y - 20, this.focusIntensity.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.6)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y - 20, this.focusIntensity.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染决策光线
     */
    renderDecisionRays(ctx) {
        this.decisionRays.forEach(ray => {
            if (ray.intensity > 0) {
                ctx.save();
                ctx.globalAlpha = ray.intensity;
                ctx.strokeStyle = ray.color;
                ctx.lineWidth = 4;
                
                const startX = this.characterPosition.x;
                const startY = this.characterPosition.y - 20;
                const endX = startX + Math.cos(ray.angle) * ray.length;
                const endY = startY + Math.sin(ray.angle) * ray.length;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                ctx.restore();
            }
        });
    }
    
    /**
     * 渲染选择光芒
     */
    renderChoiceGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.choiceGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y, 0,
            this.characterPosition.x, this.characterPosition.y, this.choiceGlow.radius
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y, this.choiceGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染学习光芒
     */
    renderStudyGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.studyGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y - 20, 0,
            this.characterPosition.x, this.characterPosition.y - 20, this.studyGlow.radius
        );
        gradient.addColorStop(0, this.studyGlow.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y - 20, this.studyGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染金色星光
     */
    renderGoldenStars(ctx) {
        this.goldenStars.forEach(star => {
            ctx.save();
            ctx.globalAlpha = star.opacity * (Math.sin(star.twinkle) * 0.5 + 0.5);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = star.size * 2;
            
            this.drawStar(ctx, star.x, star.y, star.size, 5);
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染奖杯闪耀
     */
    renderTrophyShine(ctx) {
        ctx.save();
        ctx.globalAlpha = this.trophyShine.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y - 40, 0,
            this.characterPosition.x, this.characterPosition.y - 40, this.trophyShine.radius
        );
        gradient.addColorStop(0, this.trophyShine.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y - 40, this.trophyShine.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染艺术流动
     */
    renderArtFlow(ctx) {
        this.artFlow.waves.forEach(wave => {
            ctx.save();
            ctx.globalAlpha = this.artFlow.intensity * 0.6;
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 3;
            
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染工作汗水
     */
    renderWorkSweat(ctx) {
        this.workSweat.forEach(sweat => {
            ctx.save();
            ctx.globalAlpha = sweat.opacity;
            ctx.fillStyle = sweat.color;
            
            ctx.beginPath();
            ctx.arc(sweat.x, sweat.y, sweat.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            // 更新汗水位置
            sweat.x += sweat.velocity.x;
            sweat.y += sweat.velocity.y;
        });
    }
    
    /**
     * 渲染努力光环
     */
    renderEffortAura(ctx) {
        ctx.save();
        ctx.globalAlpha = this.effortAura.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y, 0,
            this.characterPosition.x, this.characterPosition.y, this.effortAura.radius
        );
        gradient.addColorStop(0, 'rgba(255, 140, 0, 0.6)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y, this.effortAura.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 渲染毕业帽
     */
    renderGraduationCaps(ctx) {
        this.graduationCaps.forEach(cap => {
            ctx.save();
            ctx.translate(cap.x, cap.y);
            ctx.rotate(cap.rotation);
            ctx.fillStyle = '#2F2F2F';
            
            // 帽子主体
            ctx.fillRect(-cap.size / 2, -cap.size / 4, cap.size, cap.size / 2);
            
            // 帽檐
            ctx.fillRect(-cap.size / 1.5, 0, cap.size * 1.33, cap.size / 8);
            
            ctx.restore();
            
            // 更新帽子位置
            cap.x += cap.velocity.x;
            cap.y += cap.velocity.y;
            cap.rotation += cap.rotationSpeed;
        });
    }
    
    /**
     * 渲染仪式光芒
     */
    renderCeremonyGlow(ctx) {
        ctx.save();
        ctx.globalAlpha = this.ceremonyGlow.intensity;
        
        const gradient = ctx.createRadialGradient(
            this.characterPosition.x, this.characterPosition.y, 0,
            this.characterPosition.x, this.characterPosition.y, this.ceremonyGlow.radius
        );
        gradient.addColorStop(0, this.ceremonyGlow.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.characterPosition.x, this.characterPosition.y, this.ceremonyGlow.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 设置质量等级
     */
    setQuality(level) {
        switch (level) {
            case 'low':
                this.studyNotes = this.studyNotes.slice(0, 12);
                this.lovePetals = this.lovePetals.slice(0, 15);
                this.creativeSparks = this.creativeSparks.slice(0, 10);
                break;
            case 'medium':
                this.studyNotes = this.studyNotes.slice(0, 18);
                this.lovePetals = this.lovePetals.slice(0, 20);
                this.creativeSparks = this.creativeSparks.slice(0, 15);
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
        this.studyNotes = [];
        this.lovePetals = [];
        this.creativeSparks = [];
        console.log(`Teen stage animation cleaned up: ${this.eventType}`);
    }
}