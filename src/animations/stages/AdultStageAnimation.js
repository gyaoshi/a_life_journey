/**
 * 成年期动画模块 - 10个重要事件的成熟动画
 * 包含第一份工作、结婚、买房、孩子出生、升职、创业成功、孩子毕业、买车、投资、照顾父母
 * 职业阶梯、婚礼彩带、房屋钥匙、金钱雨等特效
 */

export class AdultStageAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 4000, // 4秒动画时长
            eventType: 'first_job', // 默认事件类型
            ...config
        };
        
        // 动画状态
        this.currentTime = 0;
        this.isComplete = false;
        this.eventType = this.config.eventType;
        
        // 特效系统
        this.particles = [];
        this.careerLadder = [];
        this.weddingConfetti = [];
        this.moneyRain = [];
        this.characterPosition = { x: 400, y: 300 };
        
        // 成年环境
        this.adultEnvironment = {
            office: { visible: false, desk: null, computer: null, documents: [] },
            church: { visible: false, altar: null, decorations: [] },
            house: { visible: false, building: null, garden: [] },
            hospital: { visible: false, room: null, equipment: [] }
        };
        
        // 动画进度
        this.animationProgress = 0;
        this.characterScale = 1;
        this.characterEmotion = 'confident';
        this.characterMovement = { x: 0, y: 0 };
        
        this.init();
    }
    
    /**
     * 初始化动画
     */
    init() {
        this.initAdultEnvironment();
        this.initParticleSystem();
        this.setupEventSpecificElements();
        console.log(`Adult stage animation initialized: ${this.eventType}`);
    }
    
    /**
     * 初始化成年环境
     */
    initAdultEnvironment() {
        // 办公室环境
        this.adultEnvironment.office.desk = {
            x: 300, y: 350, width: 200, height: 80
        };
        
        this.adultEnvironment.office.computer = {
            x: 350, y: 320, screen: true
        };
        
        this.adultEnvironment.office.documents = [
            { x: 280, y: 340, type: 'contract' },
            { x: 320, y: 345, type: 'report' },
            { x: 450, y: 340, type: 'presentation' }
        ];
        
        // 教堂环境
        this.adultEnvironment.church.altar = {
            x: 400, y: 200, width: 100, height: 50
        };
        
        this.adultEnvironment.church.decorations = [
            { type: 'flower', x: 200, y: 250, color: '#FFB6C1' },
            { type: 'flower', x: 600, y: 250, color: '#FFB6C1' },
            { type: 'candle', x: 350, y: 180 },
            { type: 'candle', x: 450, y: 180 }
        ];
        
        // 房屋环境
        this.adultEnvironment.house.building = {
            x: 250, y: 200, width: 300, height: 200
        };
        
        this.adultEnvironment.house.garden = [
            { type: 'tree', x: 200, y: 420, size: 30 },
            { type: 'flower', x: 580, y: 430, color: '#FF69B4' },
            { type: 'grass', x: 400, y: 450, width: 200 }
        ];
        
        // 医院环境
        this.adultEnvironment.hospital.room = {
            x: 200, y: 250, width: 400, height: 200
        };
        
        this.adultEnvironment.hospital.equipment = [
            { type: 'bed', x: 300, y: 350 },
            { type: 'monitor', x: 450, y: 300 },
            { type: 'chair', x: 250, y: 380 }
        ];
    }
    
    /**
     * 初始化粒子系统
     */
    initParticleSystem() {
        // 职业阶梯
        for (let i = 0; i < 8; i++) {
            this.careerLadder.push({
                x: this.characterPosition.x - 100 + i * 25,
                y: this.characterPosition.y + 50 - i * 15,
                width: 20,
                height: 8,
                opacity: 0,
                maxOpacity: 0.8,
                glow: false
            });
        }
        
        // 婚礼彩带
        for (let i = 0; i < 30; i++) {
            this.weddingConfetti.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 400,
                y: this.characterPosition.y - Math.random() * 200,
                color: ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493'][Math.floor(Math.random() * 4)],
                size: Math.random() * 12 + 6,
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: Math.random() * 3 + 1
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                opacity: 0,
                maxOpacity: Math.random() * 0.9 + 0.1
            });
        }
        
        // 金钱雨
        for (let i = 0; i < 25; i++) {
            this.moneyRain.push({
                x: Math.random() * 800,
                y: -Math.random() * 200,
                symbol: ['$', '¥', '€', '£'][Math.floor(Math.random() * 4)],
                size: Math.random() * 20 + 15,
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: Math.random() * 4 + 2
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                color: '#FFD700',
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
            case 'first_job':
                this.characterEmotion = 'professional';
                this.adultEnvironment.office.visible = true;
                break;
            case 'wedding':
                this.characterEmotion = 'joyful';
                this.adultEnvironment.church.visible = true;
                break;
            case 'buy_house':
                this.characterEmotion = 'proud';
                this.adultEnvironment.house.visible = true;
                break;
            case 'child_birth':
                this.characterEmotion = 'tender';
                this.adultEnvironment.hospital.visible = true;
                break;
            case 'promotion':
                this.characterEmotion = 'successful';
                this.adultEnvironment.office.visible = true;
                break;
            case 'startup_success':
                this.characterEmotion = 'triumphant';
                break;
            case 'child_graduation':
                this.characterEmotion = 'proud_parent';
                break;
            case 'buy_car':
                this.characterEmotion = 'satisfied';
                break;
            case 'investment_success':
                this.characterEmotion = 'wealthy';
                break;
            case 'care_parents':
                this.characterEmotion = 'caring';
                this.adultEnvironment.hospital.visible = true;
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
            case 'first_job':
                this.updateFirstJobAnimation(deltaTime);
                break;
            case 'wedding':
                this.updateWeddingAnimation(deltaTime);
                break;
            case 'buy_house':
                this.updateBuyHouseAnimation(deltaTime);
                break;
            case 'child_birth':
                this.updateChildBirthAnimation(deltaTime);
                break;
            case 'promotion':
                this.updatePromotionAnimation(deltaTime);
                break;
            case 'startup_success':
                this.updateStartupAnimation(deltaTime);
                break;
            case 'child_graduation':
                this.updateChildGraduationAnimation(deltaTime);
                break;
            case 'buy_car':
                this.updateBuyCarAnimation(deltaTime);
                break;
            case 'investment_success':
                this.updateInvestmentAnimation(deltaTime);
                break;
            case 'care_parents':
                this.updateCareParentsAnimation(deltaTime);
                break;
        }
    }
    
    /**
     * 更新第一份工作动画
     */
    updateFirstJobAnimation(deltaTime) {
        // 职业阶梯逐步点亮
        const stepProgress = this.animationProgress * this.careerLadder.length;
        this.careerLadder.forEach((step, index) => {
            if (stepProgress > index) {
                step.opacity = step.maxOpacity;
                step.glow = true;
            }
        });
        
        // 专业光芒
        this.professionalGlow = {
            radius: 70 * this.animationProgress,
            intensity: 0.6 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新结婚动画
     */
    updateWeddingAnimation(deltaTime) {
        // 婚礼彩带飞舞
        this.weddingConfetti.forEach(confetti => {
            confetti.opacity = confetti.maxOpacity * Math.sin(this.animationProgress * Math.PI);
        });
        
        // 婚钟响起效果
        this.weddingBells = {
            rings: Math.floor(this.animationProgress * 6),
            intensity: 0.8 * Math.sin(this.animationProgress * Math.PI * 3)
        };
    }
    
    /**
     * 更新买房动画
     */
    updateBuyHouseAnimation(deltaTime) {
        // 房屋钥匙闪光
        this.houseKeys = {
            x: this.characterPosition.x + 30,
            y: this.characterPosition.y - 20,
            glow: 0.7 * Math.sin(this.animationProgress * Math.PI * 4),
            rotation: this.animationProgress * Math.PI * 2
        };
        
        // 家庭温暖光芒
        this.homeWarmth = {
            radius: 90 * this.animationProgress,
            intensity: 0.5 * this.animationProgress
        };
    }
    
    /**
     * 更新孩子出生动画
     */
    updateChildBirthAnimation(deltaTime) {
        // 新生命光芒
        this.newLifeGlow = {
            radius: 100 * this.animationProgress,
            intensity: 0.9 * Math.sin(this.animationProgress * Math.PI),
            color: 'rgba(255, 220, 150, 0.8)'
        };
        
        // 温柔摇篮动画
        this.gentleCradle = {
            sway: Math.sin(this.currentTime * 0.003) * 5 * this.animationProgress
        };
    }
    
    /**
     * 更新升职动画
     */
    updatePromotionAnimation(deltaTime) {
        // 成功金币雨
        this.moneyRain.forEach(coin => {
            coin.opacity = coin.maxOpacity * this.animationProgress;
            coin.sparkle += deltaTime * 0.01;
        });
        
        // 晋升上升效果
        this.promotionRise = {
            height: -30 * this.animationProgress,
            glow: 0.8 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新创业成功动画
     */
    updateStartupAnimation(deltaTime) {
        // 火箭轨迹
        this.rocketTrail = {
            x: this.characterPosition.x,
            y: this.characterPosition.y - this.animationProgress * 150,
            particles: [],
            intensity: this.animationProgress
        };
        
        // 发射序列
        this.launchSequence = {
            stage: Math.floor(this.animationProgress * 3),
            power: this.animationProgress
        };
    }
    
    /**
     * 更新孩子毕业动画
     */
    updateChildGraduationAnimation(deltaTime) {
        // 毕业帽和骄傲时刻
        this.graduationPride = {
            capHeight: -40 * this.animationProgress,
            prideGlow: 0.7 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新买车动画
     */
    updateBuyCarAnimation(deltaTime) {
        // 汽车尾气和驾驶运动
        this.carExhaust = [];
        if (this.animationProgress > 0.3) {
            for (let i = 0; i < 5; i++) {
                this.carExhaust.push({
                    x: this.characterPosition.x - 50 - i * 10,
                    y: this.characterPosition.y + 20,
                    size: 8 + i * 2,
                    opacity: 0.5 - i * 0.1
                });
            }
        }
        
        this.drivingMotion = {
            vibration: Math.sin(this.currentTime * 0.02) * 2 * this.animationProgress
        };
    }
    
    /**
     * 更新投资成功动画
     */
    updateInvestmentAnimation(deltaTime) {
        // 金钱雨效果
        this.moneyRain.forEach(money => {
            money.opacity = money.maxOpacity * this.animationProgress;
        });
        
        // 财富光芒
        this.wealthGlow = {
            radius: 120 * this.animationProgress,
            intensity: 0.8 * Math.sin(this.animationProgress * Math.PI),
            color: 'rgba(255, 215, 0, 0.7)'
        };
    }
    
    /**
     * 更新照顾父母动画
     */
    updateCareParentsAnimation(deltaTime) {
        // 关爱之心
        this.careHeart = {
            size: 20 + Math.sin(this.animationProgress * Math.PI * 4) * 5,
            glow: 0.6 * Math.sin(this.animationProgress * Math.PI)
        };
        
        // 温柔照料光芒
        this.tenderCare = {
            radius: 80 * this.animationProgress,
            intensity: 0.5 * this.animationProgress
        };
    }
    
    /**
     * 更新粒子系统
     */
    updateParticles(deltaTime) {
        // 更新婚礼彩带
        this.weddingConfetti.forEach(confetti => {
            confetti.x += confetti.velocity.x * deltaTime * 0.1;
            confetti.y += confetti.velocity.y * deltaTime * 0.1;
            confetti.rotation += confetti.rotationSpeed * deltaTime;
            
            // 重力效果
            confetti.velocity.y += 0.02;
        });
        
        // 更新金钱雨
        this.moneyRain.forEach(money => {
            money.x += money.velocity.x * deltaTime * 0.1;
            money.y += money.velocity.y * deltaTime * 0.1;
            money.rotation += money.rotationSpeed * deltaTime;
            money.sparkle += deltaTime * 0.01;
            
            // 循环效果
            if (money.y > 650) {
                money.y = -50;
                money.x = Math.random() * 800;
            }
        });
    }
    
    /**
     * 更新环境元素
     */
    updateEnvironment(deltaTime) {
        // 花园植物轻微摆动
        if (this.adultEnvironment.house.garden) {
            this.adultEnvironment.house.garden.forEach(item => {
                if (item.type === 'tree') {
                    item.sway = Math.sin(this.currentTime * 0.002 + item.x * 0.01) * 0.1;
                }
            });
        }
    }
    
    /**
     * 渲染动画
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
        gradient.addColorStop(0, '#F0F8FF'); // 爱丽丝蓝
        gradient.addColorStop(1, '#E6E6FA'); // 淡紫色
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // 根据环境类型渲染
        if (this.adultEnvironment.office.visible) {
            this.renderOffice(ctx);
        }
        if (this.adultEnvironment.church.visible) {
            this.renderChurch(ctx);
        }
        if (this.adultEnvironment.house.visible) {
            this.renderHouse(ctx);
        }
        if (this.adultEnvironment.hospital.visible) {
            this.renderHospital(ctx);
        }
    }
    
    /**
     * 渲染办公室
     */
    renderOffice(ctx) {
        const office = this.adultEnvironment.office;
        
        // 办公桌
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(office.desk.x, office.desk.y, office.desk.width, office.desk.height);
        
        // 电脑
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(office.computer.x, office.computer.y, 40, 30);
        
        // 屏幕
        ctx.fillStyle = '#000080';
        ctx.fillRect(office.computer.x + 2, office.computer.y + 2, 36, 20);
        
        // 文件
        office.documents.forEach(doc => {
            ctx.fillStyle = 'white';
            ctx.fillRect(doc.x, doc.y, 15, 20);
        });
    }
    
    /**
     * 渲染教堂
     */
    renderChurch(ctx) {
        const church = this.adultEnvironment.church;
        
        // 祭坛
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(church.altar.x, church.altar.y, church.altar.width, church.altar.height);
        
        // 装饰
        church.decorations.forEach(decoration => {
            switch (decoration.type) {
                case 'flower':
                    ctx.fillStyle = decoration.color;
                    ctx.beginPath();
                    ctx.arc(decoration.x, decoration.y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'candle':
                    ctx.fillStyle = '#FFFACD';
                    ctx.fillRect(decoration.x, decoration.y, 8, 25);
                    // 火焰
                    ctx.fillStyle = '#FF4500';
                    ctx.beginPath();
                    ctx.arc(decoration.x + 4, decoration.y - 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
        });
    }
    
    /**
     * 渲染房屋
     */
    renderHouse(ctx) {
        const house = this.adultEnvironment.house;
        
        // 房屋主体
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(house.building.x, house.building.y, house.building.width, house.building.height);
        
        // 屋顶
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(house.building.x - 20, house.building.y);
        ctx.lineTo(house.building.x + house.building.width / 2, house.building.y - 50);
        ctx.lineTo(house.building.x + house.building.width + 20, house.building.y);
        ctx.closePath();
        ctx.fill();
        
        // 窗户
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(house.building.x + 50, house.building.y + 50, 40, 30);
        ctx.fillRect(house.building.x + 210, house.building.y + 50, 40, 30);
        
        // 门
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(house.building.x + 135, house.building.y + 150, 30, 50);
        
        // 花园
        house.garden.forEach(item => {
            switch (item.type) {
                case 'tree':
                    ctx.save();
                    ctx.translate(item.x, item.y);
                    if (item.sway) ctx.rotate(item.sway);
                    
                    // 树干
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(-5, 0, 10, 30);
                    
                    // 树冠
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.arc(0, -10, item.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                    break;
                case 'flower':
                    ctx.fillStyle = item.color;
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'grass':
                    ctx.fillStyle = '#90EE90';
                    ctx.fillRect(item.x - item.width / 2, item.y, item.width, 10);
                    break;
            }
        });
    }
    
    /**
     * 渲染医院
     */
    renderHospital(ctx) {
        const hospital = this.adultEnvironment.hospital;
        
        // 房间
        ctx.fillStyle = '#F0F8FF';
        ctx.fillRect(hospital.room.x, hospital.room.y, hospital.room.width, hospital.room.height);
        
        // 设备
        hospital.equipment.forEach(equipment => {
            switch (equipment.type) {
                case 'bed':
                    ctx.fillStyle = 'white';
                    ctx.fillRect(equipment.x, equipment.y, 80, 40);
                    break;
                case 'monitor':
                    ctx.fillStyle = '#2F2F2F';
                    ctx.fillRect(equipment.x, equipment.y, 30, 25);
                    break;
                case 'chair':
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(equipment.x, equipment.y, 25, 30);
                    break;
            }
        });
    }
    
    /**
     * 渲染特效
     */
    renderEffects(ctx) {
        // 渲染职业阶梯
        this.careerLadder.forEach(step => {
            if (step.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = step.opacity;
                ctx.fillStyle = step.glow ? '#FFD700' : '#DEB887';
                if (step.glow) {
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 10;
                }
                ctx.fillRect(step.x, step.y, step.width, step.height);
                ctx.restore();
            }
        });
        
        // 渲染婚礼彩带
        this.weddingConfetti.forEach(confetti => {
            if (confetti.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = confetti.opacity;
                ctx.translate(confetti.x, confetti.y);
                ctx.rotate(confetti.rotation);
                ctx.fillStyle = confetti.color;
                ctx.fillRect(-confetti.size / 2, -confetti.size / 4, confetti.size, confetti.size / 2);
                ctx.restore();
            }
        });
        
        // 渲染金钱雨
        this.moneyRain.forEach(money => {
            if (money.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = money.opacity * (Math.sin(money.sparkle) * 0.5 + 0.5);
                ctx.translate(money.x, money.y);
                ctx.rotate(money.rotation);
                ctx.fillStyle = money.color;
                ctx.shadowColor = money.color;
                ctx.shadowBlur = money.size;
                ctx.font = `${money.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(money.symbol, 0, 0);
                ctx.restore();
            }
        });
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
        
        // 绘制成年角色
        this.drawAdultCharacter(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制成年角色
     */
    drawAdultCharacter(ctx) {
        // 成年身体（更成熟稳重）
        ctx.fillStyle = '#FFE4C4'; // 肤色
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 2;
        
        // 身体
        ctx.beginPath();
        ctx.ellipse(0, 25, 22, 35, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, -30, 25, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 根据情感绘制表情
        this.drawFacialExpression(ctx);
        
        // 成熟发型
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, -40, 20, 0, Math.PI);
        ctx.fill();
        
        // 手臂
        ctx.strokeStyle = '#FFE4C4';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-20, 15);
        ctx.lineTo(-35, 35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(20, 15);
        ctx.lineTo(35, 35);
        ctx.stroke();
        
        // 腿
        ctx.beginPath();
        ctx.moveTo(-15, 55);
        ctx.lineTo(-15, 75);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(15, 55);
        ctx.lineTo(15, 75);
        ctx.stroke();
        
        // 正装
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(-18, 12, 36, 30);
        
        // 领带
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(-4, 12, 8, 25);
    }
    
    /**
     * 绘制面部表情
     */
    drawFacialExpression(ctx) {
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-9, -33, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(9, -33, 7, 0, 2 * Math.PI);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(-9, -33, 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(9, -33, 3.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // 根据情感绘制嘴巴
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        switch (this.characterEmotion) {
            case 'professional':
            case 'confident':
                // 自信微笑
                ctx.beginPath();
                ctx.arc(0, -20, 8, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
            case 'joyful':
                // 开心大笑
                ctx.beginPath();
                ctx.arc(0, -20, 10, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                break;
            case 'proud':
            case 'successful':
            case 'triumphant':
                // 骄傲满足
                ctx.beginPath();
                ctx.arc(0, -20, 9, 0.15 * Math.PI, 0.85 * Math.PI);
                ctx.stroke();
                break;
            case 'tender':
            case 'caring':
                // 温柔关爱
                ctx.beginPath();
                ctx.arc(0, -20, 6, 0.3 * Math.PI, 0.7 * Math.PI);
                ctx.stroke();
                break;
            case 'wealthy':
                // 满意富足
                ctx.beginPath();
                ctx.arc(0, -20, 7, 0.25 * Math.PI, 0.75 * Math.PI);
                ctx.stroke();
                break;
            case 'satisfied':
                // 满足
                ctx.beginPath();
                ctx.arc(0, -20, 6, 0.3 * Math.PI, 0.7 * Math.PI);
                ctx.stroke();
                break;
            case 'proud_parent':
                // 父母的骄傲
                ctx.beginPath();
                ctx.arc(0, -20, 8, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
            default:
                // 默认成熟微笑
                ctx.beginPath();
                ctx.arc(0, -20, 7, 0.25 * Math.PI, 0.75 * Math.PI);
                ctx.stroke();
        }
    }
    
    /**
     * 渲染事件特定效果
     */
    renderEventSpecificEffects(ctx) {
        // 根据事件类型渲染特定效果
        if (this.professionalGlow) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.professionalGlow.radius, this.professionalGlow.intensity, 
                          'rgba(0, 100, 200, 0.6)');
        }
        
        if (this.newLifeGlow) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.newLifeGlow.radius, this.newLifeGlow.intensity, 
                          this.newLifeGlow.color);
        }
        
        if (this.wealthGlow) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.wealthGlow.radius, this.wealthGlow.intensity, 
                          this.wealthGlow.color);
        }
        
        // 其他特效...
    }
    
    /**
     * 渲染光芒效果
     */
    renderGlow(ctx, x, y, radius, intensity, color) {
        ctx.save();
        ctx.globalAlpha = intensity;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * 设置质量等级
     */
    setQuality(level) {
        switch (level) {
            case 'low':
                this.weddingConfetti = this.weddingConfetti.slice(0, 15);
                this.moneyRain = this.moneyRain.slice(0, 12);
                break;
            case 'medium':
                this.weddingConfetti = this.weddingConfetti.slice(0, 20);
                this.moneyRain = this.moneyRain.slice(0, 18);
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
        this.careerLadder = [];
        this.weddingConfetti = [];
        this.moneyRain = [];
        console.log(`Adult stage animation cleaned up: ${this.eventType}`);
    }
}