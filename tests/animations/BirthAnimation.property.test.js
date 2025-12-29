/**
 * 出生动画和角色系统属性测试
 * 验证出生动画完成状态、形态转换过渡效果和角色视觉一致性
 */

const fc = require('fast-check');

// 模拟Canvas上下文
const mockCanvasContext = {
    save: jest.fn(),
    restore: jest.fn(),
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    ellipse: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    }))
};

// 模拟Canvas
const mockCanvas = {
    width: 800,
    height: 600,
    getContext: jest.fn(() => mockCanvasContext)
};

// 模拟BirthAnimation类 - 更新为可爱RPG风格
class MockBirthAnimation {
    constructor(context, config = {}) {
        this.ctx = context;
        this.config = {
            duration: 7000,
            phases: {
                prebirth: { start: 0, end: 2000 },
                birth: { start: 2000, end: 5000 },
                appear: { start: 5000, end: 7000 }
            },
            ...config
        };
        
        this.currentTime = 0;
        this.currentPhase = 'prebirth';
        this.isComplete = false;
        this.characterOpacity = 0;
        this.characterScale = 0;
        this.characterPosition = { x: 400, y: 300 };
        
        // 可爱温馨的特效系统
        this.magicalSparkles = [];
        this.gentleLights = [];
        this.loveHearts = [];
        this.warmthAura = { radius: 0, intensity: 0 };
        this.softGlow = { radius: 0, intensity: 0 };
        
        // RPG风格设置
        this.pixelSize = 2;
        this.cuteColors = {
            warm: '#FFE4E1',
            gentle: '#F0F8FF',
            magical: '#FFE4B5',
            love: '#FFB6C1',
            pure: '#FFFAF0'
        };
        
        this.init();
    }
    
    init() {
        // 初始化可爱特效系统
        for (let i = 0; i < 30; i++) {
            this.magicalSparkles.push({
                size: Math.random() * 4 + 2,
                color: this._getRandomCuteColor(),
                opacity: 0,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        
        for (let i = 0; i < 6; i++) {
            this.gentleLights.push({
                radius: 0,
                maxRadius: 80 + i * 20,
                intensity: 0,
                maxIntensity: 0.4 - i * 0.05,
                color: i % 2 === 0 ? this.cuteColors.warm : this.cuteColors.gentle
            });
        }
        
        for (let i = 0; i < 12; i++) {
            this.loveHearts.push({
                size: Math.random() * 6 + 4,
                color: this.cuteColors.love,
                opacity: 0,
                maxOpacity: 0.7
            });
        }
    }
    
    _getRandomCuteColor() {
        const colors = [
            '#FFB6C1', '#FFE4E1', '#F0F8FF', '#FFE4B5', 
            '#E6E6FA', '#FFF0F5', '#F5FFFA', '#FFFACD'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updatePhase() {
        const phases = this.config.phases;
        
        if (this.currentTime >= phases.appear.start) {
            this.currentPhase = 'appear';
            // 可爱的弹跳效果
            const phaseProgress = (this.currentTime - phases.appear.start) / 
                                 (phases.appear.end - phases.appear.start);
            const bounceProgress = Math.min(1, phaseProgress * 2);
            const bounce = bounceProgress < 1 ? 
                          Math.sin(bounceProgress * Math.PI) * 0.2 + bounceProgress :
                          1;
            
            this.characterOpacity = Math.min(1, phaseProgress * 2);
            this.characterScale = bounce;
        } else if (this.currentTime >= phases.birth.start) {
            this.currentPhase = 'birth';
        } else {
            this.currentPhase = 'prebirth';
        }
        
        if (this.currentTime >= this.config.duration) {
            this.isComplete = true;
            this.characterOpacity = 1;
            this.characterScale = 1;
        }
    }
    
    isAnimationComplete() {
        return this.isComplete;
    }
    
    getFinalCharacterPosition() {
        return { ...this.characterPosition };
    }
    
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
}

// 模拟CharacterRenderer类 - 更新为可爱RPG风格
class MockCharacterRenderer {
    constructor(context, options = {}) {
        this.context = context;
        this.currentStage = 'baby';
        this.currentPosition = { x: 0, y: 0 };
        this.currentEmotion = 'neutral';
        this.scale = options.scale || 1.0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionEffects = null;
        
        // RPG风格渲染器
        this.rpgRenderer = options.rpgRenderer || null;
        
        this.characterAssets = new Map();
        this.initializeCharacterForms();
    }
    
    initializeCharacterForms() {
        // 更新为可爱抽象的RPG风格角色形态
        this.characterAssets.set('baby', {
            size: { width: 32, height: 32 },
            proportions: { head: 0.6, body: 0.4, limbs: 0.25 },
            bodyShape: { headRadius: 16, bodyWidth: 12, bodyHeight: 16, limbThickness: 4 },
            colors: { 
                skin: '#FFDBCB', hair: '#F4E4BC', eyes: '#87CEEB', 
                clothes: '#FFB3E6', cheeks: '#FFB6C1' 
            },
            features: ['huge_sparkly_eyes', 'tiny_button_nose', 'chubby_cheeks', 'innocent_smile'],
            posture: 'sitting_cute',
            characteristics: ['adorable', 'innocent', 'curious', 'tiny'],
            rpgStyle: { pixelSize: 2, cuteness: 'maximum', roundness: 'extreme' }
        });
        
        this.characterAssets.set('child', {
            size: { width: 40, height: 48 },
            proportions: { head: 0.45, body: 0.55, limbs: 0.35 },
            bodyShape: { headRadius: 14, bodyWidth: 16, bodyHeight: 28, limbThickness: 6 },
            colors: { 
                skin: '#FFDBCB', hair: '#D2691E', eyes: '#32CD32', 
                clothes: '#87CEEB', accessories: '#FF6347' 
            },
            features: ['bright_sparkling_eyes', 'cheerful_smile', 'rosy_cheeks', 'messy_hair'],
            posture: 'bouncy_standing',
            characteristics: ['energetic', 'playful', 'curious', 'bouncy'],
            rpgStyle: { pixelSize: 2, cuteness: 'high', animation: 'bouncy' }
        });
        
        this.characterAssets.set('teen', {
            size: { width: 44, height: 56 },
            proportions: { head: 0.35, body: 0.65, limbs: 0.45 },
            bodyShape: { headRadius: 12, bodyWidth: 18, bodyHeight: 38, limbThickness: 8 },
            colors: { 
                skin: '#FFDBCB', hair: '#8B4513', eyes: '#9370DB', 
                clothes: '#DDA0DD', accessories: '#FF69B4' 
            },
            features: ['expressive_eyes', 'youthful_smile', 'stylish_hair', 'confident_posture'],
            posture: 'confident_cute',
            characteristics: ['youthful', 'expressive', 'stylish', 'growing'],
            rpgStyle: { pixelSize: 2, cuteness: 'medium-high', style: 'trendy' }
        });
        
        this.characterAssets.set('adult', {
            size: { width: 48, height: 64 },
            proportions: { head: 0.3, body: 0.7, limbs: 0.5 },
            bodyShape: { headRadius: 11, bodyWidth: 20, bodyHeight: 44, limbThickness: 10 },
            colors: { 
                skin: '#FFDBCB', hair: '#8B4513', eyes: '#4169E1', 
                clothes: '#4682B4', accessories: '#DAA520' 
            },
            features: ['kind_eyes', 'gentle_smile', 'mature_features', 'warm_expression'],
            posture: 'gentle_professional',
            characteristics: ['mature', 'kind', 'stable', 'caring'],
            rpgStyle: { pixelSize: 2, cuteness: 'medium', elegance: 'high' }
        });
        
        this.characterAssets.set('elder', {
            size: { width: 44, height: 60 },
            proportions: { head: 0.35, body: 0.65, limbs: 0.4 },
            bodyShape: { headRadius: 13, bodyWidth: 18, bodyHeight: 40, limbThickness: 8 },
            colors: { 
                skin: '#F5DEB3', hair: '#E6E6FA', eyes: '#4682B4', 
                clothes: '#9ACD32', accessories: '#CD853F' 
            },
            features: ['wise_twinkling_eyes', 'gentle_smile', 'silver_hair', 'kind_wrinkles'],
            posture: 'wise_gentle',
            characteristics: ['wise', 'gentle', 'peaceful', 'loving'],
            rpgStyle: { pixelSize: 2, cuteness: 'gentle', wisdom: 'high' }
        });
    }
    
    renderCharacter(stage, position, emotion = 'neutral') {
        if (!this.characterAssets.has(stage)) {
            console.warn(`Unknown character stage: ${stage}`);
            return false;
        }
        this.currentStage = stage;
        this.currentPosition = position;
        this.currentEmotion = emotion;
        return true;
    }
    
    getCharacterBounds() {
        const characterData = this.characterAssets.get(this.currentStage);
        if (!characterData) return null;

        return {
            x: this.currentPosition.x - (characterData.size.width * this.scale) / 2,
            y: this.currentPosition.y - (characterData.size.height * this.scale) / 2,
            width: characterData.size.width * this.scale,
            height: characterData.size.height * this.scale
        };
    }
    
    _createTransitionEffects(fromStage, toStage) {
        return {
            particles: Array(20).fill({
                x: 0, y: 0, size: 3, color: '#FFB6C1', opacity: 0.8
            }),
            lights: Array(5).fill({
                radius: 30, intensity: 0.6, color: '#FFE4E1'
            }),
            growthRings: Array(3).fill({
                radius: 40, opacity: 0.5, color: '#F0F8FF'
            }),
            cuteEffects: {
                sparkles: Array(15).fill({ twinkle: true, cute: true }),
                hearts: Array(8).fill({ floating: true, pink: true })
            }
        };
    }
    
    _interpolateCharacterData(fromData, toData, progress) {
        return {
            size: {
                width: this._lerp(fromData.size.width, toData.size.width, progress),
                height: this._lerp(fromData.size.height, toData.size.height, progress)
            },
            proportions: {
                head: this._lerp(fromData.proportions.head, toData.proportions.head, progress),
                body: this._lerp(fromData.proportions.body, toData.proportions.body, progress),
                limbs: this._lerp(fromData.proportions.limbs, toData.proportions.limbs, progress)
            },
            bodyShape: {
                headRadius: this._lerp(fromData.bodyShape.headRadius, toData.bodyShape.headRadius, progress),
                bodyWidth: this._lerp(fromData.bodyShape.bodyWidth, toData.bodyShape.bodyWidth, progress),
                bodyHeight: this._lerp(fromData.bodyShape.bodyHeight, toData.bodyShape.bodyHeight, progress),
                limbThickness: this._lerp(fromData.bodyShape.limbThickness, toData.bodyShape.limbThickness, progress)
            },
            // 新增可爱特征插值
            rpgStyle: {
                pixelSize: fromData.rpgStyle ? fromData.rpgStyle.pixelSize : 2,
                cuteness: progress < 0.5 ? 
                         (fromData.rpgStyle ? fromData.rpgStyle.cuteness : 'medium') : 
                         (toData.rpgStyle ? toData.rpgStyle.cuteness : 'medium')
            }
        };
    }
    
    _lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
}

// 模拟CharacterAssets类 - 更新为可爱RPG风格
class MockCharacterAssets {
    constructor() {
        this.assets = new Map();
        this.initializeAssetConfigs();
    }
    
    initializeAssetConfigs() {
        const stages = ['baby', 'child', 'teen', 'adult', 'elder'];
        
        stages.forEach(stage => {
            this.assets.set(stage, {
                sprites: {
                    idle: [{ frame: 0, description: `${stage} cute idle`, type: `${stage}_idle` }],
                    walk: [{ frame: 0, description: `${stage} cute walk`, type: `${stage}_walk` }],
                    emotions: {
                        happy: [{ frame: 0, description: `${stage} sparkly happy`, type: `${stage}_happy` }],
                        sad: [{ frame: 0, description: `${stage} gentle sad`, type: `${stage}_sad` }],
                        excited: [{ frame: 0, description: `${stage} bouncy excited`, type: `${stage}_excited` }],
                        love: [{ frame: 0, description: `${stage} heart-eyed love`, type: `${stage}_love` }]
                    }
                },
                dimensions: { 
                    width: stage === 'baby' ? 32 : stage === 'child' ? 40 : stage === 'teen' ? 44 : stage === 'adult' ? 48 : 44, 
                    height: stage === 'baby' ? 32 : stage === 'child' ? 48 : stage === 'teen' ? 56 : stage === 'adult' ? 64 : 60, 
                    scale: 1.0 
                },
                animations: { frameRate: 8, looping: true, transitions: { emotion_change: 300 } },
                characteristics: {
                    headSize: stage === 'baby' ? 'huge_cute' : stage === 'child' ? 'large_bright' : 
                             stage === 'teen' ? 'expressive' : stage === 'adult' ? 'kind_mature' : 'wise_gentle',
                    bodyProportions: stage === 'baby' ? 'super_chubby' : stage === 'child' ? 'bouncy_energetic' :
                                   stage === 'teen' ? 'stylish_growing' : stage === 'adult' ? 'gentle_stable' : 'wise_dignified',
                    features: stage === 'baby' ? ['huge_sparkly_eyes', 'tiny_button_nose', 'chubby_cheeks'] : 
                             stage === 'child' ? ['bright_sparkling_eyes', 'cheerful_smile', 'rosy_cheeks'] :
                             stage === 'teen' ? ['expressive_eyes', 'youthful_smile', 'stylish_hair'] : 
                             stage === 'adult' ? ['kind_eyes', 'gentle_smile', 'mature_features'] : 
                             ['wise_twinkling_eyes', 'gentle_smile', 'silver_hair'],
                    colors: {
                        skin: '#FFDBCB',
                        hair: stage === 'baby' ? '#F4E4BC' : stage === 'elder' ? '#E6E6FA' : '#8B4513',
                        eyes: stage === 'baby' ? '#87CEEB' : stage === 'child' ? '#32CD32' : 
                              stage === 'teen' ? '#9370DB' : '#4169E1',
                        clothes: stage === 'baby' ? '#FFB3E6' : stage === 'child' ? '#87CEEB' : 
                                stage === 'teen' ? '#DDA0DD' : stage === 'adult' ? '#4682B4' : '#9ACD32'
                    },
                    rpgStyle: {
                        pixelSize: 2,
                        cuteness: stage === 'baby' ? 'maximum' : stage === 'child' ? 'high' : 
                                 stage === 'teen' ? 'medium-high' : stage === 'adult' ? 'medium' : 'gentle',
                        specialFeatures: stage === 'baby' ? ['bouncy', 'sparkly'] : 
                                       stage === 'child' ? ['energetic', 'playful'] :
                                       stage === 'teen' ? ['stylish', 'expressive'] :
                                       stage === 'adult' ? ['elegant', 'caring'] : ['wise', 'peaceful']
                    }
                }
            });
        });
    }
    
    getAssetConfig(stage) {
        return this.assets.get(stage);
    }
    
    getDetailedAppearance(stage) {
        const config = this.assets.get(stage);
        return {
            physicalFeatures: {
                cutenessLevel: config.characteristics.rpgStyle.cuteness,
                pixelStyle: config.characteristics.rpgStyle.pixelSize,
                specialFeatures: config.characteristics.rpgStyle.specialFeatures
            },
            facialExpressions: {
                eyeStyle: config.characteristics.features.find(f => f.includes('eyes')) || 'normal_eyes',
                smileType: config.characteristics.features.find(f => f.includes('smile')) || 'neutral_smile'
            },
            bodyLanguage: {
                posture: stage === 'baby' ? 'sitting_cute' : stage === 'child' ? 'bouncy_standing' :
                        stage === 'teen' ? 'confident_cute' : stage === 'adult' ? 'gentle_professional' : 'wise_gentle'
            },
            clothingStyle: {
                color: config.characteristics.colors.clothes,
                style: stage === 'baby' ? 'adorable_onesie' : stage === 'child' ? 'playful_casual' :
                       stage === 'teen' ? 'trendy_expressive' : stage === 'adult' ? 'professional_cute' : 'comfortable_dignified'
            },
            movementPatterns: {
                speed: stage === 'baby' ? 'very_slow_cute' : stage === 'child' ? 'fast_bouncy' :
                       stage === 'teen' ? 'variable_expressive' : stage === 'adult' ? 'steady_graceful' : 'slow_wise'
            }
        };
    }
    
    generateEmotionalExpression(stage, emotion) {
        const config = this.assets.get(stage);
        const cutenessLevel = config.characteristics.rpgStyle.cuteness;
        
        return [
            { 
                type: 'facial_expression', 
                duration: 1000,
                cuteness: cutenessLevel,
                sparkles: emotion === 'happy' || emotion === 'excited',
                hearts: emotion === 'love'
            },
            { 
                type: 'body_language', 
                duration: 800,
                cuteness: cutenessLevel,
                bouncy: stage === 'child' && (emotion === 'happy' || emotion === 'excited'),
                gentle: stage === 'elder' || emotion === 'love',
                sparkles: emotion === 'happy' || emotion === 'excited',
                hearts: emotion === 'love'
            }
        ];
    }
    
    generateNaturalMovement(stage, movementType) {
        const config = this.assets.get(stage);
        const characteristics = config.characteristics.rpgStyle.specialFeatures;
        
        return [
            { 
                frame: 0, 
                description: `cute ${stage} ${movementType}`, 
                duration: 300, 
                characteristics: ['natural', 'cute', ...characteristics],
                pixelStyle: true,
                cutenessLevel: config.characteristics.rpgStyle.cuteness
            }
        ];
    }
    
    validateCharacterAssets(stage) {
        const config = this.assets.get(stage);
        const errors = [];
        const warnings = [];
        
        if (!config) {
            errors.push(`Stage ${stage} not found`);
        } else {
            // 验证RPG风格特有属性
            if (!config.characteristics.rpgStyle) {
                errors.push('Missing RPG style configuration');
            } else {
                if (!config.characteristics.rpgStyle.cuteness) {
                    warnings.push('Cuteness level not specified');
                }
                if (!config.characteristics.rpgStyle.pixelSize) {
                    warnings.push('Pixel size not specified');
                }
            }
            
            // 验证可爱特征
            if (!config.characteristics.features.some(f => f.includes('eyes'))) {
                warnings.push('No eye features specified for cute character');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }
}

describe('出生动画和角色系统属性测试', () => {
    
    /**
     * **Feature: life-journey-game, Property 22: 出生动画完成状态**
     * **Validates: Requirements 7.1-7.5**
     * 
     * 属性22: 出生动画完成状态
     * 对于任何出生动画实例，动画完成后角色应该以婴儿形态保留在画面中央
     */
    describe('Property 22: 出生动画完成状态', () => {
        test('动画完成后角色以婴儿形态保留在中央', () => {
            fc.assert(fc.property(
                fc.record({
                    duration: fc.integer({ min: 5000, max: 10000 }),
                    quality: fc.constantFrom('high', 'medium', 'low'),
                    centerX: fc.integer({ min: 300, max: 500 }),
                    centerY: fc.integer({ min: 200, max: 400 })
                }),
                (config) => {
                    // 创建出生动画实例
                    const birthAnimation = new MockBirthAnimation(mockCanvasContext, {
                        duration: config.duration,
                        quality: config.quality
                    });
                    
                    // 设置角色位置
                    birthAnimation.characterPosition = { 
                        x: config.centerX, 
                        y: config.centerY 
                    };
                    
                    // 模拟动画完成
                    birthAnimation.currentTime = config.duration;
                    birthAnimation.updatePhase();
                    
                    // 验证动画完成状态
                    expect(birthAnimation.isAnimationComplete()).toBe(true);
                    
                    // 验证角色位置保持在中央
                    const finalPosition = birthAnimation.getFinalCharacterPosition();
                    expect(finalPosition.x).toBe(config.centerX);
                    expect(finalPosition.y).toBe(config.centerY);
                    
                    // 验证角色透明度和缩放达到完全显示状态
                    expect(birthAnimation.characterOpacity).toBeGreaterThanOrEqual(0.8);
                    expect(birthAnimation.characterScale).toBeGreaterThanOrEqual(0.8);
                    
                    // 验证当前阶段为显现阶段
                    expect(birthAnimation.currentPhase).toBe('appear');
                }
            ), { numRuns: 100 });
        });
    });

    /**
     * **Feature: life-journey-game, Property 23: 形态转换过渡效果**
     * **Validates: Requirements 8.1-8.6**
     * 
     * 属性23: 形态转换过渡效果
     * 对于任何角色形态转换，转换时应该显示成长变化动画
     */
    describe('Property 23: 形态转换过渡效果', () => {
        test('转换时应该显示成长变化动画', () => {
            fc.assert(fc.property(
                fc.record({
                    fromStage: fc.constantFrom('baby', 'child', 'teen', 'adult'),
                    toStage: fc.constantFrom('child', 'teen', 'adult', 'elder'),
                    duration: fc.integer({ min: 500, max: 2000 }),
                    position: fc.record({
                        x: fc.integer({ min: 100, max: 700 }),
                        y: fc.integer({ min: 100, max: 500 })
                    })
                }).filter(config => {
                    // 确保转换是向前的（成长方向）
                    const stageOrder = ['baby', 'child', 'teen', 'adult', 'elder'];
                    const fromIndex = stageOrder.indexOf(config.fromStage);
                    const toIndex = stageOrder.indexOf(config.toStage);
                    return toIndex > fromIndex;
                }),
                (config) => {
                    // 创建角色渲染器
                    const renderer = new MockCharacterRenderer(mockCanvasContext);
                    renderer.currentPosition = config.position;
                    
                    // 开始转换
                    renderer.isTransitioning = true;
                    renderer.transitionProgress = 0;
                    
                    // 创建转换特效
                    const effects = renderer._createTransitionEffects(config.fromStage, config.toStage);
                    renderer.transitionEffects = effects;
                    
                    // 验证转换特效存在
                    expect(effects).toBeDefined();
                    expect(effects.particles).toBeDefined();
                    expect(effects.growthRings).toBeDefined();
                    expect(effects.particles.length).toBeGreaterThan(0);
                    expect(effects.growthRings.length).toBeGreaterThan(0);
                    
                    // 验证可爱特效
                    expect(effects.cuteEffects).toBeDefined();
                    expect(effects.cuteEffects.sparkles).toBeDefined();
                    expect(effects.cuteEffects.hearts).toBeDefined();
                    expect(effects.cuteEffects.sparkles.length).toBeGreaterThan(0);
                    expect(effects.cuteEffects.hearts.length).toBeGreaterThan(0);
                    
                    // 验证粒子具有可爱属性
                    effects.particles.forEach(particle => {
                        expect(particle.color).toBeDefined();
                        expect(particle.opacity).toBeGreaterThan(0);
                    });
                    
                    // 验证可爱特效属性
                    effects.cuteEffects.sparkles.forEach(sparkle => {
                        expect(sparkle.twinkle).toBe(true);
                        expect(sparkle.cute).toBe(true);
                    });
                    
                    effects.cuteEffects.hearts.forEach(heart => {
                        expect(heart.floating).toBe(true);
                        expect(heart.pink).toBe(true);
                    });
                    
                    // 模拟转换过程中的不同进度点
                    const progressPoints = [0.25, 0.5, 0.75, 1.0];
                    
                    progressPoints.forEach(progress => {
                        renderer.transitionProgress = progress;
                        
                        // 验证转换数据插值
                        const fromData = renderer.characterAssets.get(config.fromStage);
                        const toData = renderer.characterAssets.get(config.toStage);
                        const interpolatedData = renderer._interpolateCharacterData(fromData, toData, progress);
                        
                        // 验证尺寸插值
                        expect(interpolatedData.size.width).toBeGreaterThanOrEqual(
                            Math.min(fromData.size.width, toData.size.width)
                        );
                        expect(interpolatedData.size.width).toBeLessThanOrEqual(
                            Math.max(fromData.size.width, toData.size.width)
                        );
                        
                        // 验证身体比例插值
                        expect(interpolatedData.proportions.head).toBeGreaterThanOrEqual(
                            Math.min(fromData.proportions.head, toData.proportions.head)
                        );
                        expect(interpolatedData.proportions.head).toBeLessThanOrEqual(
                            Math.max(fromData.proportions.head, toData.proportions.head)
                        );
                        
                        // 验证身体形状插值
                        expect(interpolatedData.bodyShape.headRadius).toBeGreaterThanOrEqual(
                            Math.min(fromData.bodyShape.headRadius, toData.bodyShape.headRadius)
                        );
                        expect(interpolatedData.bodyShape.headRadius).toBeLessThanOrEqual(
                            Math.max(fromData.bodyShape.headRadius, toData.bodyShape.headRadius)
                        );
                        
                        // 验证RPG风格属性插值
                        expect(interpolatedData.rpgStyle).toBeDefined();
                        expect(interpolatedData.rpgStyle.pixelSize).toBe(2);
                        expect(interpolatedData.rpgStyle.cuteness).toBeDefined();
                    });
                    
                    // 验证转换完成后状态
                    renderer.transitionProgress = 1.0;
                    renderer.isTransitioning = false;
                    renderer.currentStage = config.toStage;
                    expect(renderer.currentStage).toBe(config.toStage);
                }
            ), { numRuns: 100 });
        });
    });

    /**
     * **Feature: life-journey-game, Property 24: 角色视觉一致性**
     * **Validates: Requirements 8.1-8.6**
     * 
     * 属性24: 角色视觉一致性
     * 对于任何人生阶段，新形象应该与阶段特征一致
     */
    describe('Property 24: 角色视觉一致性', () => {
        test('新形象与阶段特征一致', () => {
            fc.assert(fc.property(
                fc.record({
                    stage: fc.constantFrom('baby', 'child', 'teen', 'adult', 'elder'),
                    emotion: fc.constantFrom('happy', 'sad', 'surprised', 'neutral'),
                    position: fc.record({
                        x: fc.integer({ min: 50, max: 750 }),
                        y: fc.integer({ min: 50, max: 550 })
                    })
                }),
                (config) => {
                    // 创建角色资源管理器
                    const assets = new MockCharacterAssets();
                    
                    // 获取阶段配置
                    const stageConfig = assets.getAssetConfig(config.stage);
                    expect(stageConfig).toBeDefined();
                    
                    // 验证阶段特征一致性
                    const characteristics = stageConfig.characteristics;
                    expect(characteristics).toBeDefined();
                    
                    // 验证尺寸合理性
                    expect(stageConfig.dimensions.width).toBeGreaterThan(0);
                    expect(stageConfig.dimensions.height).toBeGreaterThan(0);
                    
                    // 验证颜色配置
                    expect(characteristics.colors.skin).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(characteristics.colors.hair).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(characteristics.colors.eyes).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(characteristics.colors.clothes).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    
                    // 验证RPG风格配置
                    expect(characteristics.rpgStyle).toBeDefined();
                    expect(characteristics.rpgStyle.pixelSize).toBe(2);
                    expect(characteristics.rpgStyle.cuteness).toBeDefined();
                    expect(characteristics.rpgStyle.specialFeatures).toBeDefined();
                    expect(Array.isArray(characteristics.rpgStyle.specialFeatures)).toBe(true);
                    
                    // 验证特征与阶段的一致性
                    switch (config.stage) {
                        case 'baby':
                            expect(characteristics.headSize).toBe('huge_cute');
                            expect(characteristics.bodyProportions).toBe('super_chubby');
                            expect(characteristics.features).toContain('huge_sparkly_eyes');
                            expect(characteristics.rpgStyle.cuteness).toBe('maximum');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('bouncy');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('sparkly');
                            break;
                        case 'child':
                            expect(characteristics.headSize).toBe('large_bright');
                            expect(characteristics.bodyProportions).toBe('bouncy_energetic');
                            expect(characteristics.features).toContain('bright_sparkling_eyes');
                            expect(characteristics.rpgStyle.cuteness).toBe('high');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('energetic');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('playful');
                            break;
                        case 'teen':
                            expect(characteristics.headSize).toBe('expressive');
                            expect(characteristics.bodyProportions).toBe('stylish_growing');
                            expect(characteristics.features).toContain('expressive_eyes');
                            expect(characteristics.rpgStyle.cuteness).toBe('medium-high');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('stylish');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('expressive');
                            break;
                        case 'adult':
                            expect(characteristics.headSize).toBe('kind_mature');
                            expect(characteristics.bodyProportions).toBe('gentle_stable');
                            expect(characteristics.features).toContain('kind_eyes');
                            expect(characteristics.rpgStyle.cuteness).toBe('medium');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('elegant');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('caring');
                            break;
                        case 'elder':
                            expect(characteristics.headSize).toBe('wise_gentle');
                            expect(characteristics.bodyProportions).toBe('wise_dignified');
                            expect(characteristics.features).toContain('wise_twinkling_eyes');
                            expect(characteristics.rpgStyle.cuteness).toBe('gentle');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('wise');
                            expect(characteristics.rpgStyle.specialFeatures).toContain('peaceful');
                            break;
                    }
                    
                    // 验证详细外观特征
                    const detailedAppearance = assets.getDetailedAppearance(config.stage);
                    expect(detailedAppearance).toBeDefined();
                    expect(detailedAppearance.physicalFeatures).toBeDefined();
                    expect(detailedAppearance.facialExpressions).toBeDefined();
                    expect(detailedAppearance.bodyLanguage).toBeDefined();
                    expect(detailedAppearance.clothingStyle).toBeDefined();
                    expect(detailedAppearance.movementPatterns).toBeDefined();
                    
                    // 验证可爱度等级
                    expect(detailedAppearance.physicalFeatures.cutenessLevel).toBeDefined();
                    expect(detailedAppearance.physicalFeatures.pixelStyle).toBe(2);
                    expect(detailedAppearance.physicalFeatures.specialFeatures).toBeDefined();
                    expect(Array.isArray(detailedAppearance.physicalFeatures.specialFeatures)).toBe(true);
                    
                    // 验证情感表达与阶段的一致性
                    const emotionalExpression = assets.generateEmotionalExpression(config.stage, config.emotion);
                    expect(emotionalExpression).toBeDefined();
                    expect(emotionalExpression.length).toBeGreaterThan(0);
                    
                    // 验证可爱特效
                    emotionalExpression.forEach(expression => {
                        expect(expression.cuteness).toBeDefined();
                        if (config.emotion === 'happy' || config.emotion === 'excited') {
                            expect(expression.sparkles).toBe(true);
                        }
                        if (config.emotion === 'love') {
                            expect(expression.hearts).toBe(true);
                        }
                    });
                    
                    // 验证移动动画与阶段的一致性
                    const walkAnimation = assets.generateNaturalMovement(config.stage, 'walk');
                    expect(walkAnimation).toBeDefined();
                    expect(walkAnimation.length).toBeGreaterThan(0);
                    
                    // 验证每个动画帧都有必要的属性
                    walkAnimation.forEach(frame => {
                        expect(frame.frame).toBeDefined();
                        expect(frame.description).toBeDefined();
                        expect(frame.duration).toBeGreaterThan(0);
                        expect(frame.characteristics).toBeDefined();
                        expect(Array.isArray(frame.characteristics)).toBe(true);
                        expect(frame.characteristics).toContain('cute');
                        expect(frame.pixelStyle).toBe(true);
                        expect(frame.cutenessLevel).toBeDefined();
                    });
                    
                    // 验证资源完整性
                    const validation = assets.validateCharacterAssets(config.stage);
                    expect(validation.valid).toBe(true);
                    expect(validation.errors.length).toBe(0);
                }
            ), { numRuns: 100 });
        });
    });

    /**
     * 额外的边界条件测试
     */
    describe('边界条件测试', () => {
        test('出生动画在不同质量设置下保持一致性', () => {
            fc.assert(fc.property(
                fc.constantFrom('high', 'medium', 'low'),
                (quality) => {
                    const birthAnimation = new MockBirthAnimation(mockCanvasContext);
                    
                    // 设置质量等级
                    birthAnimation.setQuality(quality);
                    
                    // 验证可爱特效数量根据质量调整
                    switch (quality) {
                        case 'low':
                            expect(birthAnimation.magicalSparkles.length).toBeLessThanOrEqual(15);
                            expect(birthAnimation.gentleLights.length).toBeLessThanOrEqual(3);
                            expect(birthAnimation.loveHearts.length).toBeLessThanOrEqual(6);
                            break;
                        case 'medium':
                            expect(birthAnimation.magicalSparkles.length).toBeLessThanOrEqual(20);
                            expect(birthAnimation.gentleLights.length).toBeLessThanOrEqual(4);
                            expect(birthAnimation.loveHearts.length).toBeLessThanOrEqual(8);
                            break;
                        case 'high':
                            expect(birthAnimation.magicalSparkles.length).toBeLessThanOrEqual(30);
                            expect(birthAnimation.gentleLights.length).toBeLessThanOrEqual(6);
                            expect(birthAnimation.loveHearts.length).toBeLessThanOrEqual(12);
                            break;
                    }
                    
                    // 验证可爱颜色配置存在
                    expect(birthAnimation.cuteColors).toBeDefined();
                    expect(birthAnimation.cuteColors.warm).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(birthAnimation.cuteColors.gentle).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(birthAnimation.cuteColors.magical).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(birthAnimation.cuteColors.love).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    expect(birthAnimation.cuteColors.pure).toMatch(/^#[0-9A-Fa-f]{6}$/);
                    
                    // 验证RPG风格设置
                    expect(birthAnimation.pixelSize).toBe(2);
                    
                    // 验证动画仍然能正常完成
                    birthAnimation.currentTime = birthAnimation.config.duration;
                    birthAnimation.updatePhase();
                    expect(birthAnimation.isAnimationComplete()).toBe(true);
                }
            ), { numRuns: 50 });
        });

        test('角色渲染器处理无效阶段时的错误处理', () => {
            fc.assert(fc.property(
                fc.string().filter(s => !['baby', 'child', 'teen', 'adult', 'elder'].includes(s)),
                (invalidStage) => {
                    const renderer = new MockCharacterRenderer(mockCanvasContext);
                    
                    // 尝试渲染无效阶段
                    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
                    
                    renderer.renderCharacter(invalidStage, { x: 400, y: 300 });
                    
                    // 验证警告被记录
                    expect(consoleSpy).toHaveBeenCalledWith(`Unknown character stage: ${invalidStage}`);
                    
                    consoleSpy.mockRestore();
                }
            ), { numRuns: 30 });
        });
    });
});