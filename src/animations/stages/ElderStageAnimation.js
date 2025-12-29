/**
 * 老年期动画模块 - 6个智慧事件的深沉动画
 * 包含退休庆典、含饴弄孙、回忆往昔、传授智慧、安享晚年、写回忆录
 * 退休气球、家庭温暖、记忆片段、智慧之光等特效
 */

export class ElderStageAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 4000, // 4秒动画时长
            eventType: 'retirement', // 默认事件类型
            ...config
        };
        
        // 动画状态
        this.currentTime = 0;
        this.isComplete = false;
        this.eventType = this.config.eventType;
        
        // 特效系统
        this.particles = [];
        this.retirementBalloons = [];
        this.memoryFragments = [];
        this.wisdomLight = [];
        this.characterPosition = { x: 400, y: 300 };
        
        // 老年环境
        this.elderEnvironment = {
            home: { visible: false, livingRoom: null, family: [] },
            garden: { visible: false, bench: null, flowers: [] },
            library: { visible: false, shelves: [], desk: null },
            park: { visible: false, path: null, trees: [] }
        };
        
        // 动画进度
        this.animationProgress = 0;
        this.characterScale = 1;
        this.characterEmotion = 'serene';
        this.characterMovement = { x: 0, y: 0 };
        
        this.init();
    }
    
    /**
     * 初始化动画
     */
    init() {
        this.initElderEnvironment();
        this.initParticleSystem();
        this.setupEventSpecificElements();
        console.log(`Elder stage animation initialized: ${this.eventType}`);
    }
    
    /**
     * 初始化老年环境
     */
    initElderEnvironment() {
        // 家庭环境
        this.elderEnvironment.home.livingRoom = {
            x: 200, y: 250, width: 400, height: 200
        };
        
        this.elderEnvironment.home.family = [
            { type: 'grandchild', x: 300, y: 380, age: 'young' },
            { type: 'grandchild', x: 500, y: 385, age: 'teen' },
            { type: 'adult_child', x: 350, y: 350, gender: 'female' },
            { type: 'adult_child', x: 450, y: 350, gender: 'male' }
        ];
        
        // 花园环境
        this.elderEnvironment.garden.bench = {
            x: 400, y: 380, width: 100, height: 40
        };
        
        this.elderEnvironment.garden.flowers = [
            { x: 200, y: 420, type: 'rose', color: '#FF69B4' },
            { x: 250, y: 430, type: 'tulip', color: '#FFD700' },
            { x: 550, y: 425, type: 'lily', color: '#FFF8DC' },
            { x: 600, y: 435, type: 'daisy', color: '#FFFFFF' }
        ];
        
        // 图书馆环境
        this.elderEnvironment.library.shelves = [
            { x: 100, y: 200, width: 50, height: 200, books: 15 },
            { x: 200, y: 200, width: 50, height: 200, books: 18 },
            { x: 650, y: 200, width: 50, height: 200, books: 12 }
        ];
        
        this.elderEnvironment.library.desk = {
            x: 350, y: 350, width: 150, height: 80,
            items: ['pen', 'paper', 'glasses', 'book']
        };
        
        // 公园环境
        this.elderEnvironment.park.path = {
            points: [
                { x: 100, y: 400 },
                { x: 200, y: 380 },
                { x: 300, y: 390 },
                { x: 400, y: 370 },
                { x: 500, y: 385 },
                { x: 600, y: 375 },
                { x: 700, y: 390 }
            ]
        };
        
        this.elderEnvironment.park.trees = [
            { x: 150, y: 300, size: 50, type: 'oak' },
            { x: 350, y: 280, size: 45, type: 'maple' },
            { x: 550, y: 290, size: 40, type: 'birch' },
            { x: 650, y: 310, size: 55, type: 'pine' }
        ];
    }
    
    /**
     * 初始化粒子系统
     */
    initParticleSystem() {
        // 退休气球
        for (let i = 0; i < 12; i++) {
            this.retirementBalloons.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 200,
                y: this.characterPosition.y + Math.random() * 100,
                color: ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'][Math.floor(Math.random() * 4)],
                size: Math.random() * 15 + 10,
                velocity: {
                    x: (Math.random() - 0.5) * 1,
                    y: -Math.random() * 2 - 0.5
                },
                string: { length: Math.random() * 30 + 20 },
                opacity: 0,
                maxOpacity: Math.random() * 0.8 + 0.2,
                sway: Math.random() * Math.PI * 2
            });
        }
        
        // 记忆片段
        for (let i = 0; i < 20; i++) {
            this.memoryFragments.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                type: ['photo', 'letter', 'medal', 'flower'][Math.floor(Math.random() * 4)],
                size: Math.random() * 25 + 15,
                velocity: {
                    x: (Math.random() - 0.5) * 1.5,
                    y: (Math.random() - 0.5) * 1.5
                },
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: 0,
                maxOpacity: Math.random() * 0.7 + 0.3,
                fade: Math.random() * Math.PI * 2
            });
        }
        
        // 智慧之光
        for (let i = 0; i < 15; i++) {
            this.wisdomLight.push({
                x: this.characterPosition.x + (Math.random() - 0.5) * 150,
                y: this.characterPosition.y + (Math.random() - 0.5) * 150,
                size: Math.random() * 10 + 5,
                color: `hsl(${Math.random() * 60 + 40}, 80%, 80%)`, // 金色系
                intensity: Math.random(),
                maxIntensity: 1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
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
            case 'retirement':
                this.characterEmotion = 'celebratory';
                break;
            case 'grandchildren':
                this.characterEmotion = 'loving';
                this.elderEnvironment.home.visible = true;
                break;
            case 'reminisce':
                this.characterEmotion = 'nostalgic';
                this.elderEnvironment.garden.visible = true;
                break;
            case 'teach_wisdom':
                this.characterEmotion = 'wise';
                this.elderEnvironment.library.visible = true;
                break;
            case 'peaceful_life':
                this.characterEmotion = 'peaceful';
                this.elderEnvironment.park.visible = true;
                break;
            case 'write_memoir':
                this.characterEmotion = 'reflective';
                this.elderEnvironment.library.visible = true;
                break;
        }
    }
    
    /**
     * 更新动画
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
            case 'retirement':
                this.updateRetirementAnimation(deltaTime);
                break;
            case 'grandchildren':
                this.updateGrandchildrenAnimation(deltaTime);
                break;
            case 'reminisce':
                this.updateReminisceAnimation(deltaTime);
                break;
            case 'teach_wisdom':
                this.updateTeachWisdomAnimation(deltaTime);
                break;
            case 'peaceful_life':
                this.updatePeacefulLifeAnimation(deltaTime);
                break;
            case 'write_memoir':
                this.updateWriteMemoirAnimation(deltaTime);
                break;
        }
    }
    
    /**
     * 更新退休庆典动画
     */
    updateRetirementAnimation(deltaTime) {
        // 退休气球上升
        this.retirementBalloons.forEach(balloon => {
            balloon.opacity = balloon.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            balloon.sway += deltaTime * 0.003;
        });
        
        // 庆祝光芒
        this.celebrationGlow = {
            radius: 100 * this.animationProgress,
            intensity: 0.7 * Math.sin(this.animationProgress * Math.PI),
            color: 'rgba(255, 215, 0, 0.6)'
        };
    }
    
    /**
     * 更新含饴弄孙动画
     */
    updateGrandchildrenAnimation(deltaTime) {
        // 家庭温暖效果
        this.familyWarmth = {
            radius: 120 * this.animationProgress,
            intensity: 0.5 * this.animationProgress,
            color: 'rgba(255, 182, 193, 0.5)'
        };
        
        // 温柔拥抱动画
        this.gentleEmbrace = {
            sway: Math.sin(this.currentTime * 0.002) * 3 * this.animationProgress
        };
    }
    
    /**
     * 更新回忆往昔动画
     */
    updateReminisceAnimation(deltaTime) {
        // 记忆片段飘浮
        this.memoryFragments.forEach(fragment => {
            fragment.opacity = fragment.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            fragment.fade += deltaTime * 0.005;
        });
        
        // 怀旧淡化效果
        this.nostalgiaFade = {
            intensity: 0.4 * Math.sin(this.animationProgress * Math.PI * 2),
            sepia: this.animationProgress * 0.3
        };
    }
    
    /**
     * 更新传授智慧动画
     */
    updateTeachWisdomAnimation(deltaTime) {
        // 智慧之光闪耀
        this.wisdomLight.forEach(light => {
            light.opacity = light.maxOpacity * Math.sin(this.animationProgress * Math.PI);
            light.pulse += light.pulseSpeed * deltaTime;
            light.intensity = (Math.sin(light.pulse) * 0.5 + 0.5) * light.maxIntensity;
        });
        
        // 教导光芒
        this.teachingGlow = {
            radius: 90 * this.animationProgress,
            intensity: 0.8 * Math.sin(this.animationProgress * Math.PI),
            color: 'rgba(255, 255, 0, 0.6)'
        };
    }
    
    /**
     * 更新安享晚年动画
     */
    updatePeacefulLifeAnimation(deltaTime) {
        // 平静光芒
        this.peacefulGlow = {
            radius: 80 * this.animationProgress,
            intensity: 0.4 * this.animationProgress,
            color: 'rgba(135, 206, 235, 0.4)'
        };
        
        // 宁静脉动
        this.serenePulse = {
            rhythm: Math.sin(this.currentTime * 0.001) * 0.1 + 0.9
        };
    }
    
    /**
     * 更新写回忆录动画
     */
    updateWriteMemoirAnimation(deltaTime) {
        // 回忆录页面效果
        this.memoirPages = [];
        if (this.animationProgress > 0.2) {
            for (let i = 0; i < 8; i++) {
                this.memoirPages.push({
                    x: this.characterPosition.x + (Math.random() - 0.5) * 100,
                    y: this.characterPosition.y - 50 - i * 10,
                    rotation: (Math.random() - 0.5) * 0.3,
                    opacity: 0.7 * (this.animationProgress - 0.2) * 1.25
                });
            }
        }
        
        // 记忆书写效果
        this.memoryWriting = {
            progress: this.animationProgress,
            intensity: 0.6 * Math.sin(this.animationProgress * Math.PI)
        };
    }
    
    /**
     * 更新粒子系统
     */
    updateParticles(deltaTime) {
        // 更新退休气球
        this.retirementBalloons.forEach(balloon => {
            balloon.x += balloon.velocity.x * deltaTime * 0.1;
            balloon.y += balloon.velocity.y * deltaTime * 0.1;
            balloon.sway += deltaTime * 0.003;
            
            // 轻微摆动
            balloon.x += Math.sin(balloon.sway) * 0.5;
        });
        
        // 更新记忆片段
        this.memoryFragments.forEach(fragment => {
            fragment.x += fragment.velocity.x * deltaTime * 0.1;
            fragment.y += fragment.velocity.y * deltaTime * 0.1;
            fragment.rotation += fragment.rotationSpeed * deltaTime;
            fragment.fade += deltaTime * 0.005;
            
            // 边界检查
            if (fragment.x < 0 || fragment.x > 800) fragment.velocity.x *= -1;
            if (fragment.y < 0 || fragment.y > 600) fragment.velocity.y *= -1;
        });
        
        // 更新智慧之光
        this.wisdomLight.forEach(light => {
            light.pulse += light.pulseSpeed * deltaTime;
        });
    }
    
    /**
     * 更新环境元素
     */
    updateEnvironment(deltaTime) {
        // 公园树木轻微摆动
        if (this.elderEnvironment.park.trees) {
            this.elderEnvironment.park.trees.forEach(tree => {
                tree.sway = Math.sin(this.currentTime * 0.001 + tree.x * 0.01) * 0.05;
            });
        }
        
        // 花园花朵轻摆
        if (this.elderEnvironment.garden.flowers) {
            this.elderEnvironment.garden.flowers.forEach(flower => {
                flower.sway = Math.sin(this.currentTime * 0.002 + flower.x * 0.01) * 0.02;
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
        gradient.addColorStop(0, '#FFF8DC'); // 玉米丝色
        gradient.addColorStop(1, '#F5DEB3'); // 小麦色
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // 根据环境类型渲染
        if (this.elderEnvironment.home.visible) {
            this.renderHome(ctx);
        }
        if (this.elderEnvironment.garden.visible) {
            this.renderGarden(ctx);
        }
        if (this.elderEnvironment.library.visible) {
            this.renderLibrary(ctx);
        }
        if (this.elderEnvironment.park.visible) {
            this.renderPark(ctx);
        }
    }
    
    /**
     * 渲染家庭环境
     */
    renderHome(ctx) {
        const home = this.elderEnvironment.home;
        
        // 客厅
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(home.livingRoom.x, home.livingRoom.y, home.livingRoom.width, home.livingRoom.height);
        
        // 沙发
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(home.livingRoom.x + 50, home.livingRoom.y + 150, 120, 40);
        
        // 茶几
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(home.livingRoom.x + 200, home.livingRoom.y + 170, 80, 50);
        
        // 家庭成员
        home.family.forEach(member => {
            ctx.save();
            ctx.translate(member.x, member.y);
            
            switch (member.type) {
                case 'grandchild':
                    // 孙子孙女
                    ctx.fillStyle = '#FFE4C4';
                    ctx.beginPath();
                    ctx.arc(0, -10, member.age === 'young' ? 8 : 12, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#4169E1';
                    ctx.fillRect(-6, 0, 12, member.age === 'young' ? 15 : 20);
                    break;
                    
                case 'adult_child':
                    // 成年子女
                    ctx.fillStyle = '#FFE4C4';
                    ctx.beginPath();
                    ctx.arc(0, -15, 15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = member.gender === 'female' ? '#FF69B4' : '#000080';
                    ctx.fillRect(-10, 0, 20, 25);
                    break;
            }
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染花园
     */
    renderGarden(ctx) {
        const garden = this.elderEnvironment.garden;
        
        // 长椅
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(garden.bench.x, garden.bench.y, garden.bench.width, garden.bench.height);
        
        // 椅背
        ctx.fillRect(garden.bench.x, garden.bench.y - 20, 10, 30);
        ctx.fillRect(garden.bench.x + garden.bench.width - 10, garden.bench.y - 20, 10, 30);
        
        // 花朵
        garden.flowers.forEach(flower => {
            ctx.save();
            ctx.translate(flower.x, flower.y);
            if (flower.sway) ctx.rotate(flower.sway);
            
            // 花茎
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -20);
            ctx.stroke();
            
            // 花朵
            ctx.fillStyle = flower.color;
            ctx.beginPath();
            ctx.arc(0, -20, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // 花瓣
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 6, -20 + Math.sin(angle) * 6, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染图书馆
     */
    renderLibrary(ctx) {
        const library = this.elderEnvironment.library;
        
        // 书架
        library.shelves.forEach(shelf => {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(shelf.x, shelf.y, shelf.width, shelf.height);
            
            // 书籍
            for (let i = 0; i < shelf.books; i++) {
                const bookY = shelf.y + 20 + (i % 8) * 20;
                const bookX = shelf.x + 5 + Math.floor(i / 8) * 15;
                
                ctx.fillStyle = `hsl(${i * 30}, 60%, 50%)`;
                ctx.fillRect(bookX, bookY, 12, 18);
            }
        });
        
        // 书桌
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(library.desk.x, library.desk.y, library.desk.width, library.desk.height);
        
        // 桌上物品
        library.desk.items.forEach((item, index) => {
            const itemX = library.desk.x + 20 + index * 30;
            const itemY = library.desk.y - 10;
            
            switch (item) {
                case 'pen':
                    ctx.strokeStyle = '#2F2F2F';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(itemX, itemY);
                    ctx.lineTo(itemX + 15, itemY - 5);
                    ctx.stroke();
                    break;
                case 'paper':
                    ctx.fillStyle = 'white';
                    ctx.fillRect(itemX, itemY, 20, 15);
                    break;
                case 'glasses':
                    ctx.strokeStyle = '#2F2F2F';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(itemX + 5, itemY, 6, 0, Math.PI * 2);
                    ctx.arc(itemX + 15, itemY, 6, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'book':
                    ctx.fillStyle = '#8B0000';
                    ctx.fillRect(itemX, itemY, 15, 20);
                    break;
            }
        });
    }
    
    /**
     * 渲染公园
     */
    renderPark(ctx) {
        const park = this.elderEnvironment.park;
        
        // 小径
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        park.path.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
        
        // 树木
        park.trees.forEach(tree => {
            ctx.save();
            ctx.translate(tree.x, tree.y);
            if (tree.sway) ctx.rotate(tree.sway);
            
            // 树干
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-8, 0, 16, 50);
            
            // 树冠
            ctx.fillStyle = tree.type === 'pine' ? '#006400' : '#228B22';
            if (tree.type === 'pine') {
                // 松树形状
                ctx.beginPath();
                ctx.moveTo(0, -30);
                ctx.lineTo(-tree.size / 2, 10);
                ctx.lineTo(tree.size / 2, 10);
                ctx.closePath();
                ctx.fill();
            } else {
                // 圆形树冠
                ctx.beginPath();
                ctx.arc(0, -10, tree.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
    
    /**
     * 渲染特效
     */
    renderEffects(ctx) {
        // 渲染退休气球
        this.retirementBalloons.forEach(balloon => {
            if (balloon.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = balloon.opacity;
                
                // 气球
                ctx.fillStyle = balloon.color;
                ctx.beginPath();
                ctx.arc(balloon.x, balloon.y, balloon.size, 0, Math.PI * 2);
                ctx.fill();
                
                // 气球绳子
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(balloon.x, balloon.y + balloon.size);
                ctx.lineTo(balloon.x, balloon.y + balloon.size + balloon.string.length);
                ctx.stroke();
                
                ctx.restore();
            }
        });
        
        // 渲染记忆片段
        this.memoryFragments.forEach(fragment => {
            if (fragment.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = fragment.opacity * (Math.sin(fragment.fade) * 0.3 + 0.7);
                ctx.translate(fragment.x, fragment.y);
                ctx.rotate(fragment.rotation);
                
                switch (fragment.type) {
                    case 'photo':
                        // 照片
                        ctx.fillStyle = '#F5F5DC';
                        ctx.fillRect(-fragment.size / 2, -fragment.size / 3, fragment.size, fragment.size * 2 / 3);
                        ctx.strokeStyle = '#8B4513';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(-fragment.size / 2, -fragment.size / 3, fragment.size, fragment.size * 2 / 3);
                        break;
                        
                    case 'letter':
                        // 信件
                        ctx.fillStyle = 'white';
                        ctx.fillRect(-fragment.size / 2, -fragment.size / 3, fragment.size, fragment.size * 2 / 3);
                        
                        // 文字线条
                        ctx.strokeStyle = '#2F2F2F';
                        ctx.lineWidth = 1;
                        for (let i = 0; i < 3; i++) {
                            ctx.beginPath();
                            ctx.moveTo(-fragment.size / 3, -fragment.size / 6 + i * 5);
                            ctx.lineTo(fragment.size / 3, -fragment.size / 6 + i * 5);
                            ctx.stroke();
                        }
                        break;
                        
                    case 'medal':
                        // 奖章
                        ctx.fillStyle = '#FFD700';
                        ctx.beginPath();
                        ctx.arc(0, 0, fragment.size / 3, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 绶带
                        ctx.fillStyle = '#8B0000';
                        ctx.fillRect(-2, -fragment.size / 2, 4, fragment.size / 2);
                        break;
                        
                    case 'flower':
                        // 花朵
                        ctx.fillStyle = '#FF69B4';
                        ctx.beginPath();
                        ctx.arc(0, 0, fragment.size / 4, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 花瓣
                        for (let i = 0; i < 5; i++) {
                            const angle = (i / 5) * Math.PI * 2;
                            ctx.beginPath();
                            ctx.arc(Math.cos(angle) * fragment.size / 6, Math.sin(angle) * fragment.size / 6, fragment.size / 8, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                }
                
                ctx.restore();
            }
        });
        
        // 渲染智慧之光
        this.wisdomLight.forEach(light => {
            if (light.opacity > 0) {
                ctx.save();
                ctx.globalAlpha = light.opacity * light.intensity;
                ctx.fillStyle = light.color;
                ctx.shadowColor = light.color;
                ctx.shadowBlur = light.size * 3;
                
                ctx.beginPath();
                ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2);
                ctx.fill();
                
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
        
        // 绘制老年角色
        this.drawElderCharacter(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制老年角色
     */
    drawElderCharacter(ctx) {
        // 老年身体（略微佝偻）
        ctx.fillStyle = '#FFE4C4'; // 肤色
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 2;
        
        // 身体
        ctx.beginPath();
        ctx.ellipse(0, 30, 20, 32, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 头部
        ctx.beginPath();
        ctx.arc(0, -25, 23, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // 根据情感绘制表情
        this.drawFacialExpression(ctx);
        
        // 白发
        ctx.fillStyle = '#F5F5F5';
        ctx.beginPath();
        ctx.arc(0, -35, 18, 0, Math.PI);
        ctx.fill();
        
        // 手臂
        ctx.strokeStyle = '#FFE4C4';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-18, 20);
        ctx.lineTo(-28, 40);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(18, 20);
        ctx.lineTo(28, 40);
        ctx.stroke();
        
        // 腿
        ctx.beginPath();
        ctx.moveTo(-12, 58);
        ctx.lineTo(-12, 75);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(12, 58);
        ctx.lineTo(12, 75);
        ctx.stroke();
        
        // 舒适的衣服
        ctx.fillStyle = '#8B7D6B';
        ctx.fillRect(-15, 18, 30, 28);
        
        // 拐杖（如果需要）
        if (this.characterEmotion === 'peaceful') {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(35, 40);
            ctx.lineTo(35, 75);
            ctx.stroke();
        }
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
        
        // 皱纹
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-15, -35);
        ctx.lineTo(-10, -32);
        ctx.moveTo(10, -32);
        ctx.lineTo(15, -35);
        ctx.stroke();
        
        // 根据情感绘制嘴巴
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        switch (this.characterEmotion) {
            case 'celebratory':
                // 庆祝笑容
                ctx.beginPath();
                ctx.arc(0, -18, 9, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                break;
            case 'loving':
                // 慈爱微笑
                ctx.beginPath();
                ctx.arc(0, -18, 7, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.stroke();
                break;
            case 'nostalgic':
                // 怀旧沉思
                ctx.beginPath();
                ctx.arc(0, -16, 5, 0.4 * Math.PI, 0.6 * Math.PI);
                ctx.stroke();
                break;
            case 'wise':
                // 智慧微笑
                ctx.beginPath();
                ctx.arc(0, -18, 6, 0.3 * Math.PI, 0.7 * Math.PI);
                ctx.stroke();
                break;
            case 'peaceful':
                // 平静安详
                ctx.beginPath();
                ctx.arc(0, -18, 4, 0.4 * Math.PI, 0.6 * Math.PI);
                ctx.stroke();
                break;
            case 'reflective':
                // 沉思
                ctx.beginPath();
                ctx.moveTo(-4, -18);
                ctx.lineTo(4, -18);
                ctx.stroke();
                break;
            default:
                // 默认慈祥微笑
                ctx.beginPath();
                ctx.arc(0, -18, 6, 0.25 * Math.PI, 0.75 * Math.PI);
                ctx.stroke();
        }
    }
    
    /**
     * 渲染事件特定效果
     */
    renderEventSpecificEffects(ctx) {
        // 根据事件类型渲染特定效果
        if (this.celebrationGlow) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.celebrationGlow.radius, this.celebrationGlow.intensity, 
                          this.celebrationGlow.color);
        }
        
        if (this.familyWarmth) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.familyWarmth.radius, this.familyWarmth.intensity, 
                          this.familyWarmth.color);
        }
        
        if (this.teachingGlow) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.teachingGlow.radius, this.teachingGlow.intensity, 
                          this.teachingGlow.color);
        }
        
        if (this.peacefulGlow) {
            this.renderGlow(ctx, this.characterPosition.x, this.characterPosition.y, 
                          this.peacefulGlow.radius, this.peacefulGlow.intensity, 
                          this.peacefulGlow.color);
        }
        
        // 渲染回忆录页面
        if (this.memoirPages) {
            this.memoirPages.forEach(page => {
                ctx.save();
                ctx.globalAlpha = page.opacity;
                ctx.translate(page.x, page.y);
                ctx.rotate(page.rotation);
                
                ctx.fillStyle = 'white';
                ctx.fillRect(-15, -20, 30, 40);
                
                // 文字线条
                ctx.strokeStyle = '#2F2F2F';
                ctx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.moveTo(-10, -15 + i * 6);
                    ctx.lineTo(10, -15 + i * 6);
                    ctx.stroke();
                }
                
                ctx.restore();
            });
        }
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
                this.retirementBalloons = this.retirementBalloons.slice(0, 6);
                this.memoryFragments = this.memoryFragments.slice(0, 10);
                this.wisdomLight = this.wisdomLight.slice(0, 8);
                break;
            case 'medium':
                this.retirementBalloons = this.retirementBalloons.slice(0, 9);
                this.memoryFragments = this.memoryFragments.slice(0, 15);
                this.wisdomLight = this.wisdomLight.slice(0, 12);
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
        this.retirementBalloons = [];
        this.memoryFragments = [];
        this.wisdomLight = [];
        console.log(`Elder stage animation cleaned up: ${this.eventType}`);
    }
}