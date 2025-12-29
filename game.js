class LifeJourneyGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.status = document.getElementById('status');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.scoreElement = document.getElementById('score');
        this.stageElement = document.getElementById('currentStage');
        this.timeElement = document.getElementById('timeLeft');
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.totalGameTime = 100000; // 100秒
        this.score = 0;
        this.completedEvents = 0;
        this.totalEvents = 0;
        this.stage = 0;
        this.gameEnded = false;
        
        // 人生阶段配置
        this.stageNames = ['婴儿期', '儿童期', '青少年期', '成年期', '老年期'];
        this.stageColors = ['#ffb3ba', '#87ceeb', '#90ee90', '#ffff99', '#deb887'];
        this.stageDurations = [20000, 20000, 20000, 20000, 20000]; // 每阶段20秒
        
        // 角色属性
        this.character = {
            x: 450,
            y: 350,
            targetX: 450,
            targetY: 350,
            size: 40,
            emotion: 'neutral',
            moveSpeed: 4,
            isMoving: false,
            animationFrame: 0
        };
        
        // 当前事件
        this.currentEvent = null;
        this.lastEventTime = 0;
        this.eventInterval = 3000; // 3秒生成一个事件
        
        // 粒子系统
        this.particles = [];
        this.clickEffects = [];
        
        // 出生动画
        this.birthAnimation = {
            active: false,
            time: 0,
            phase: 'preparation'
        };
        
        // 人生事件数据
        this.lifeEvents = {
            0: [ // 婴儿期
                { title: '第一次微笑', description: '学会用微笑表达快乐', points: 10, color: '#ff69b4' },
                { title: '学会翻身', description: '人生第一个大动作', points: 15, color: '#ff1493' },
                { title: '第一次爬行', description: '开始探索世界', points: 20, color: '#ff6347' },
                { title: '认出妈妈', description: '建立最初的情感联系', points: 25, color: '#ffa500' },
                { title: '第一次站立', description: '迈向独立的重要一步', points: 30, color: '#ffd700' },
                { title: '第一次叫妈妈', description: '语言发展的里程碑', points: 35, color: '#ffb6c1' }
            ],
            1: [ // 儿童期
                { title: '学会走路', description: '迈出人生第一步', points: 40, color: '#98fb98' },
                { title: '第一天上幼儿园', description: '踏入社会的第一步', points: 45, color: '#87ceeb' },
                { title: '学会骑自行车', description: '平衡与勇气的考验', points: 50, color: '#dda0dd' },
                { title: '交到第一个朋友', description: '人生第一个真正的朋友', points: 55, color: '#f0e68c' },
                { title: '学会游泳', description: '克服恐惧的勇气', points: 60, color: '#40e0d0' },
                { title: '第一次表演', description: '在舞台上展现自己', points: 65, color: '#ee82ee' },
                { title: '学会写字', description: '知识学习的开始', points: 70, color: '#ffa07a' },
                { title: '第一次比赛获奖', description: '努力得到认可', points: 75, color: '#20b2aa' }
            ],
            2: [ // 青少年期
                { title: '中学入学考试', description: '学习压力的开始', points: 80, color: '#9370db' },
                { title: '初恋告白', description: '人生第一次心动', points: 85, color: '#ff1493' },
                { title: '参加社团活动', description: '发现自己的兴趣', points: 90, color: '#32cd32' },
                { title: '选择专业方向', description: '决定人生方向', points: 95, color: '#ff4500' },
                { title: '高考冲刺', description: '人生重要的转折点', points: 100, color: '#dc143c' },
                { title: '获得奖学金', description: '努力得到回报', points: 105, color: '#ffd700' },
                { title: '第一次打工', description: '体验社会生活', points: 110, color: '#4682b4' },
                { title: '毕业典礼', description: '青春的结束与开始', points: 115, color: '#da70d6' }
            ],
            3: [ // 成年期
                { title: '找到第一份工作', description: '踏入职场的第一步', points: 120, color: '#2e8b57' },
                { title: '结婚典礼', description: '人生最美好的时刻', points: 150, color: '#ff69b4' },
                { title: '买房置业', description: '安家立业的重要步骤', points: 130, color: '#cd853f' },
                { title: '孩子出生', description: '迎接新生命的喜悦', points: 200, color: '#ffb6c1' },
                { title: '升职加薪', description: '职业发展的成功', points: 140, color: '#32cd32' },
                { title: '创业成功', description: '实现自己的梦想', points: 180, color: '#ff4500' },
                { title: '孩子毕业', description: '见证下一代成长', points: 160, color: '#9370db' },
                { title: '买车实现梦想', description: '生活品质的提升', points: 125, color: '#4169e1' },
                { title: '投资理财成功', description: '财务自由的实现', points: 170, color: '#ffd700' },
                { title: '照顾年迈父母', description: '回报父母的养育之恩', points: 190, color: '#f0e68c' }
            ],
            4: [ // 老年期
                { title: '退休庆典', description: '享受悠闲的时光', points: 135, color: '#dda0dd' },
                { title: '含饴弄孙', description: '与孙辈的快乐时光', points: 145, color: '#ffb6c1' },
                { title: '回忆往昔', description: '回望人生的美好', points: 155, color: '#f5deb3' },
                { title: '传授人生智慧', description: '将经验传给后代', points: 165, color: '#daa520' },
                { title: '安享晚年', description: '平静祥和的生活', points: 175, color: '#e6e6fa' },
                { title: '写回忆录', description: '记录人生的点点滴滴', points: 185, color: '#f0f8ff' }
            ]
        };
        
        // 计算总事件数
        this.totalEvents = Object.values(this.lifeEvents).reduce((sum, events) => sum + events.length, 0);
        
        this.init();
    }
    
    init() {
        try {
            this.canvas.addEventListener('click', (e) => this.handleClick(e));
            this.showStartScreen();
            this.status.textContent = '游戏已准备就绪 - 点击开始按钮开始您的人生旅程！';
            console.log('人生旅程游戏初始化完成');
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.status.textContent = '游戏初始化失败，请刷新页面重试';
        }
    }
    
    showStartScreen() {
        const ctx = this.ctx;
        
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 900, 700);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 900, 700);
        
        // 主标题
        ctx.fillStyle = '#4ecdc4';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(78, 205, 196, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fillText('人生旅程游戏', 450, 180);
        
        // 副标题
        ctx.font = '28px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.shadowBlur = 10;
        ctx.fillText('体验完整的人生 - 100秒浓缩人生', 450, 220);
        
        // 开始提示
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#4ecdc4';
        ctx.shadowBlur = 15;
        ctx.fillText('点击"开始游戏"按钮开始', 450, 300);
        
        // 绘制预览角色
        this.drawCharacter(450, 400, 0, 'happy');
        
        // 人生阶段预览
        ctx.font = '18px Arial';
        ctx.fillStyle = '#999999';
        ctx.shadowBlur = 5;
        const stages = ['👶 婴儿期', '🧒 儿童期', '👦 青少年期', '👨 成年期', '👴 老年期'];
        stages.forEach((stage, index) => {
            ctx.fillText(stage, 180 + index * 140, 500);
        });
        
        // 说明文字
        ctx.font = '16px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.shadowBlur = 3;
        ctx.fillText('快速点击出现的事件圆圈完成人生里程碑', 450, 580);
        ctx.fillText('点击屏幕移动角色，体验互动人生', 450, 610);
        
        ctx.shadowBlur = 0; // 重置阴影
    }
    
    startGame() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.gameTime = 0;
        this.score = 0;
        this.completedEvents = 0;
        this.stage = 0;
        this.gameEnded = false;
        this.currentEvent = null;
        this.lastEventTime = 0;
        this.particles = [];
        this.clickEffects = [];
        
        // 重置角色位置
        this.character.x = 450;
        this.character.y = 350;
        this.character.targetX = 450;
        this.character.targetY = 350;
        this.character.emotion = 'neutral';
        this.character.isMoving = false;
        
        // 显示分数面板
        this.scoreDisplay.style.display = 'block';
        
        // 播放出生动画
        this.birthAnimation.active = true;
        this.birthAnimation.time = 0;
        this.birthAnimation.phase = 'preparation';
        
        this.status.textContent = '人生旅程开始！正在播放出生动画...';
        this.updateUI();
        this.gameLoop();
    }
    
    pauseGame() {
        if (!this.isRunning || this.gameEnded) return;
        this.isPaused = !this.isPaused;
        this.status.textContent = this.isPaused ? '游戏已暂停' : '游戏继续进行';
    }
    
    resetGame() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameEnded = false;
        this.scoreDisplay.style.display = 'none';
        this.showStartScreen();
        this.status.textContent = '游戏已重置 - 点击开始按钮重新开始！';
    }
    
    gameLoop() {
        if (!this.isRunning || this.gameEnded) return;
        
        if (!this.isPaused) {
            this.update();
        }
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        const deltaTime = 16; // 假设60fps
        
        // 出生动画期间暂停游戏时间
        if (this.birthAnimation.active) {
            this.updateBirthAnimation(deltaTime);
            return;
        }
        
        this.gameTime += deltaTime;
        
        // 检查游戏是否结束
        if (this.gameTime >= this.totalGameTime) {
            this.endGame();
            return;
        }
        
        // 更新人生阶段
        this.updateLifeStage();
        
        // 生成新事件
        if (!this.currentEvent && this.gameTime - this.lastEventTime > this.eventInterval) {
            this.generateEvent();
        }
        
        // 更新角色移动
        this.updateCharacterMovement();
        
        // 更新粒子系统
        this.updateParticles(deltaTime);
        this.updateClickEffects(deltaTime);
        
        // 更新UI
        this.updateUI();
    }
    
    updateBirthAnimation(deltaTime) {
        this.birthAnimation.time += deltaTime;
        
        // 出生动画持续6秒
        if (this.birthAnimation.time > 6000) {
            this.birthAnimation.active = false;
            this.status.textContent = '出生动画完成，人生旅程正式开始！';
        } else if (this.birthAnimation.time > 4000) {
            this.birthAnimation.phase = 'celebration';
        } else if (this.birthAnimation.time > 2000) {
            this.birthAnimation.phase = 'birth';
        } else {
            this.birthAnimation.phase = 'preparation';
        }
        
        // 生成出生特效粒子
        if (this.birthAnimation.time % 200 < 16) {
            this.createBirthParticles();
        }
    }
    
    updateLifeStage() {
        let currentStageTime = 0;
        let newStage = 0;
        
        for (let i = 0; i < this.stageDurations.length; i++) {
            if (this.gameTime < currentStageTime + this.stageDurations[i]) {
                newStage = i;
                break;
            }
            currentStageTime += this.stageDurations[i];
            newStage = i + 1;
        }
        
        if (newStage !== this.stage && newStage < this.stageNames.length) {
            this.stage = newStage;
            this.status.textContent = `进入${this.stageNames[this.stage]}！`;
            this.createStageTransitionEffect();
        }
    }
    
    generateEvent() {
        const stageEvents = this.lifeEvents[this.stage];
        if (!stageEvents || stageEvents.length === 0) return;
        
        const eventData = stageEvents[Math.floor(Math.random() * stageEvents.length)];
        
        this.currentEvent = {
            ...eventData,
            x: 150 + Math.random() * 600,
            y: 150 + Math.random() * 400,
            radius: 60,
            pulseTime: 0,
            timeLimit: 5000 - (this.stage * 500), // 难度递增
            startTime: this.gameTime
        };
        
        this.lastEventTime = this.gameTime;
    }
    
    handleClick(e) {
        if (!this.isRunning || this.isPaused || this.gameEnded) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // 检查是否点击了事件
        if (this.currentEvent) {
            const dx = clickX - this.currentEvent.x;
            const dy = clickY - this.currentEvent.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= this.currentEvent.radius) {
                this.completeEvent();
                this.createClickEffect(clickX, clickY, '#4ecdc4');
                return;
            }
        }
        
        // 移动角色
        this.moveCharacterTo(clickX, clickY);
        this.createClickEffect(clickX, clickY, '#ffffff');
    }
    
    completeEvent() {
        if (!this.currentEvent) return;
        
        this.score += this.currentEvent.points;
        this.completedEvents++;
        this.character.emotion = 'happy';
        
        // 创建成功特效
        this.createSuccessEffect(this.currentEvent.x, this.currentEvent.y);
        
        // 重置角色情绪
        setTimeout(() => {
            this.character.emotion = 'neutral';
        }, 1500);
        
        const points = this.currentEvent.points;
        this.currentEvent = null;
        this.status.textContent = `完成事件！获得 ${points} 分`;
    }
    
    moveCharacterTo(x, y) {
        this.character.targetX = x;
        this.character.targetY = y;
        this.character.isMoving = true;
    }
    
    updateCharacterMovement() {
        if (!this.character.isMoving) return;
        
        const dx = this.character.targetX - this.character.x;
        const dy = this.character.targetY - this.character.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.character.x = this.character.targetX;
            this.character.y = this.character.targetY;
            this.character.isMoving = false;
        } else {
            this.character.x += (dx / distance) * this.character.moveSpeed;
            this.character.y += (dy / distance) * this.character.moveSpeed;
        }
    }
    
    render() {
        const ctx = this.ctx;
        
        // 清空画布并绘制背景
        const gradient = ctx.createLinearGradient(0, 0, 900, 700);
        gradient.addColorStop(0, this.stageColors[this.stage] || '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 900, 700);
        
        // 渲染出生动画
        if (this.birthAnimation.active) {
            this.renderBirthAnimation();
            return;
        }
        
        // 渲染进度条
        this.renderProgressBar();
        
        // 渲染角色
        this.renderCharacter();
        
        // 渲染当前事件
        if (this.currentEvent) {
            this.renderCurrentEvent();
        }
        
        // 渲染粒子效果
        this.renderParticles();
        this.renderClickEffects();
    }
    
    renderBirthAnimation() {
        const ctx = this.ctx;
        const centerX = 450;
        const centerY = 350;
        const time = this.birthAnimation.time;
        
        // 背景光芒
        const glowRadius = 100 + Math.sin(time / 300) * 20;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
        gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制婴儿
        this.drawCharacter(centerX, centerY, 0, 'happy');
        
        // 出生文字
        ctx.fillStyle = '#4ecdc4';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(78, 205, 196, 0.8)';
        ctx.shadowBlur = 15;
        
        if (this.birthAnimation.phase === 'celebration') {
            ctx.fillText('🎉 新生命诞生！🎉', centerX, centerY - 100);
        } else if (this.birthAnimation.phase === 'birth') {
            ctx.fillText('👶 欢迎来到这个世界', centerX, centerY - 100);
        } else {
            ctx.fillText('✨ 生命即将开始...', centerX, centerY - 100);
        }
        
        ctx.shadowBlur = 0;
    }
    
    renderProgressBar() {
        const ctx = this.ctx;
        const progress = Math.min(1, this.gameTime / this.totalGameTime);
        
        // 背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(50, 20, 800, 25);
        
        // 进度条
        const progressGradient = ctx.createLinearGradient(50, 20, 850, 20);
        progressGradient.addColorStop(0, '#4ecdc4');
        progressGradient.addColorStop(1, '#44a08d');
        ctx.fillStyle = progressGradient;
        ctx.fillRect(50, 20, 800 * progress, 25);
        
        // 阶段标记
        for (let i = 0; i < 5; i++) {
            const x = 50 + (800 / 4) * i;
            ctx.fillStyle = i <= this.stage ? '#4ecdc4' : '#666666';
            ctx.fillRect(x - 2, 15, 4, 35);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.stageNames[i], x, 60);
        }
        
        // 时间显示
        const timeLeft = Math.max(0, Math.ceil((this.totalGameTime - this.gameTime) / 1000));
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`时间: ${timeLeft}s`, 840, 38);
    }
    
    renderCharacter() {
        this.drawCharacter(this.character.x, this.character.y, this.stage, this.character.emotion);
    }
    
    drawCharacter(x, y, stage, emotion) {
        const ctx = this.ctx;
        const size = this.character.size;
        
        // 移动轨迹效果
        if (this.character.isMoving) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = this.stageColors[stage];
            ctx.beginPath();
            ctx.arc(x, y, size + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // 角色主体
        ctx.fillStyle = this.stageColors[stage] || '#ffb3ba';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 轮廓
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 眼睛
        ctx.fillStyle = '#000000';
        const eyeOffset = emotion === 'happy' ? -2 : 0;
        ctx.beginPath();
        ctx.arc(x - 12, y - 8 + eyeOffset, 4, 0, Math.PI * 2);
        ctx.arc(x + 12, y - 8 + eyeOffset, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (emotion === 'happy') {
            ctx.arc(x, y + 5, 15, 0, Math.PI);
        } else {
            ctx.moveTo(x - 8, y + 8);
            ctx.lineTo(x + 8, y + 8);
        }
        ctx.stroke();
        
        // 年龄标识
        const ageEmojis = ['👶', '🧒', '👦', '👨', '👴'];
        if (ageEmojis[stage]) {
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ageEmojis[stage], x, y - size - 15);
        }
    }
    
    renderCurrentEvent() {
        if (!this.currentEvent) return;
        
        const ctx = this.ctx;
        const event = this.currentEvent;
        const elapsed = this.gameTime - event.startTime;
        const timeProgress = elapsed / event.timeLimit;
        
        // 事件超时检查
        if (timeProgress >= 1) {
            this.currentEvent = null;
            return;
        }
        
        // 脉冲效果
        event.pulseTime += 16;
        const pulse = 1 + Math.sin(event.pulseTime / 200) * 0.2;
        const urgency = Math.min(1, timeProgress * 2);
        
        // 事件圆圈
        ctx.save();
        ctx.globalAlpha = 1 - timeProgress * 0.3;
        
        // 外圈（紧急度指示）
        ctx.fillStyle = `rgba(255, ${255 - urgency * 200}, ${255 - urgency * 200}, 0.3)`;
        ctx.beginPath();
        ctx.arc(event.x, event.y, event.radius * pulse * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 主圆圈
        ctx.fillStyle = event.color;
        ctx.beginPath();
        ctx.arc(event.x, event.y, event.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // 事件文字
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 5;
        ctx.fillText(event.title, event.x, event.y - 5);
        
        ctx.font = '12px Arial';
        ctx.fillText('点击完成', event.x, event.y + 15);
        
        // 时间进度条
        const barWidth = event.radius * 1.5;
        const barHeight = 6;
        const barX = event.x - barWidth / 2;
        const barY = event.y + event.radius + 15;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = timeProgress > 0.7 ? '#ff4444' : '#4ecdc4';
        ctx.fillRect(barX, barY, barWidth * (1 - timeProgress), barHeight);
        
        ctx.restore();
        ctx.shadowBlur = 0;
    }
    
    createBirthParticles() {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = 450 + Math.cos(angle) * distance;
            const y = 350 + Math.sin(angle) * distance;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2 - 1,
                life: 3000,
                maxLife: 3000,
                size: 8,
                color: '#ffb6c1',
                type: 'heart'
            });
        }
    }
    
    createSuccessEffect(x, y) {
        // 成功粒子爆发
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4 - 2,
                life: 2000,
                maxLife: 2000,
                size: 6,
                color: '#ffd700',
                type: 'star'
            });
        }
    }
    
    createStageTransitionEffect() {
        // 阶段转换特效
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: 450 + (Math.random() - 0.5) * 200,
                y: 350 + (Math.random() - 0.5) * 200,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 3000,
                maxLife: 3000,
                size: 4,
                color: this.stageColors[this.stage],
                type: 'circle'
            });
        }
    }
    
    createClickEffect(x, y, color) {
        this.clickEffects.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 40,
            life: 600,
            maxLife: 600,
            color: color
        });
        
        // 点击粒子
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 800,
                maxLife: 800,
                size: 3,
                color: color,
                type: 'circle'
            });
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // 重力
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateClickEffects(deltaTime) {
        for (let i = this.clickEffects.length - 1; i >= 0; i--) {
            const effect = this.clickEffects[i];
            const progress = 1 - (effect.life / effect.maxLife);
            
            effect.radius = progress * effect.maxRadius;
            effect.life -= deltaTime;
            
            if (effect.life <= 0) {
                this.clickEffects.splice(i, 1);
            }
        }
    }
    
    renderParticles() {
        const ctx = this.ctx;
        
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            
            if (particle.type === 'heart') {
                this.drawHeart(ctx, particle.x, particle.y, particle.size);
            } else if (particle.type === 'star') {
                this.drawStar(ctx, particle.x, particle.y, particle.size);
            } else {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
    
    renderClickEffects() {
        const ctx = this.ctx;
        
        this.clickEffects.forEach(effect => {
            const alpha = effect.life / effect.maxLife;
            
            ctx.save();
            ctx.globalAlpha = alpha * 0.6;
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 3;
            
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        });
    }
    
    drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 10, size / 10);
        
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(-5, -2, -10, -2, -10, 3);
        ctx.bezierCurveTo(-10, 8, 0, 12, 0, 15);
        ctx.bezierCurveTo(0, 12, 10, 8, 10, 3);
        ctx.bezierCurveTo(10, -2, 5, -2, 0, 3);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawStar(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const radius = i % 2 === 0 ? size : size / 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
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
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.stageElement.textContent = this.stageNames[this.stage] || '准备中';
        this.timeElement.textContent = Math.max(0, Math.ceil((this.totalGameTime - this.gameTime) / 1000));
    }
    
    endGame() {
        this.gameEnded = true;
        this.isRunning = false;
        
        const completionRate = (this.completedEvents / this.totalEvents) * 100;
        let evaluation = '';
        
        if (completionRate >= 86) {
            evaluation = '完美人生 🌟';
        } else if (completionRate >= 61) {
            evaluation = '充实人生 😊';
        } else if (completionRate >= 31) {
            evaluation = '平凡人生 😐';
        } else {
            evaluation = '匆忙人生 😅';
        }
        
        this.status.textContent = `游戏结束！${evaluation} - 完成率: ${completionRate.toFixed(1)}%`;
        
        // 显示结束画面
        this.showEndScreen(evaluation, completionRate);
    }
    
    showEndScreen(evaluation, completionRate) {
        const ctx = this.ctx;
        
        // 半透明覆盖
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, 900, 700);
        
        // 结果标题
        ctx.fillStyle = '#4ecdc4';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(78, 205, 196, 0.8)';
        ctx.shadowBlur = 20;
        ctx.fillText('人生旅程结束', 450, 200);
        
        // 评价
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(evaluation, 450, 280);
        
        // 统计信息
        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`最终分数: ${this.score}`, 450, 340);
        ctx.fillText(`完成事件: ${this.completedEvents}/${this.totalEvents}`, 450, 380);
        ctx.fillText(`完成率: ${completionRate.toFixed(1)}%`, 450, 420);
        
        // 重新开始提示
        ctx.font = '20px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.fillText('点击"重新开始"按钮再次体验人生', 450, 500);
        
        ctx.shadowBlur = 0;
    }
}

// 初始化游戏
const game = new LifeJourneyGame();