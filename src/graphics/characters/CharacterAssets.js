/**
 * 角色视觉资源管理器
 * 负责管理和加载不同人生阶段的角色视觉资源
 * 替换原有的简单笑脸为详细的人物形象
 */
class CharacterAssets {
    constructor() {
        this.assets = new Map();
        this.loadedAssets = new Map();
        this.isLoading = false;
        
        // 初始化资源配置
        this.initializeAssetConfigs();
    }

    /**
     * 初始化资源配置
     */
    initializeAssetConfigs() {
        // 婴儿期资源配置
        this.assets.set('baby', {
            sprites: {
                idle: this._generateBabyIdleFrames(),
                walk: this._generateBabyWalkFrames(),
                emotions: {
                    happy: this._generateBabyHappyFrames(),
                    sad: this._generateBabySadFrames(),
                    surprised: this._generateBabySurprisedFrames(),
                    sleepy: this._generateBabySleepyFrames()
                }
            },
            dimensions: {
                width: 40,
                height: 40,
                scale: 1.0
            },
            animations: {
                frameRate: 8,
                looping: true,
                transitions: {
                    idle_to_walk: 200,
                    walk_to_idle: 200,
                    emotion_change: 300
                }
            },
            characteristics: {
                headSize: 'large',
                bodyProportions: 'chubby',
                features: ['big_eyes', 'small_nose', 'round_cheeks'],
                colors: {
                    skin: '#FFE4C4',
                    hair: '#D2B48C',
                    eyes: '#4169E1',
                    clothes: '#FFB6C1'
                }
            }
        });

        // 儿童期资源配置
        this.assets.set('child', {
            sprites: {
                idle: this._generateChildIdleFrames(),
                walk: this._generateChildWalkFrames(),
                run: this._generateChildRunFrames(),
                emotions: {
                    happy: this._generateChildHappyFrames(),
                    excited: this._generateChildExcitedFrames(),
                    curious: this._generateChildCuriousFrames(),
                    playful: this._generateChildPlayfulFrames()
                }
            },
            dimensions: {
                width: 50,
                height: 60,
                scale: 1.0
            },
            animations: {
                frameRate: 12,
                looping: true,
                transitions: {
                    idle_to_walk: 150,
                    walk_to_run: 100,
                    emotion_change: 250
                }
            },
            characteristics: {
                headSize: 'medium',
                bodyProportions: 'energetic',
                features: ['bright_eyes', 'playful_smile', 'active_posture'],
                colors: {
                    skin: '#FFE4C4',
                    hair: '#8B4513',
                    eyes: '#32CD32',
                    clothes: '#87CEEB'
                }
            }
        });

        // 青少年期资源配置
        this.assets.set('teen', {
            sprites: {
                idle: this._generateTeenIdleFrames(),
                walk: this._generateTeenWalkFrames(),
                emotions: {
                    confident: this._generateTeenConfidentFrames(),
                    shy: this._generateTeenShyFrames(),
                    determined: this._generateTeenDeterminedFrames(),
                    romantic: this._generateTeenRomanticFrames()
                }
            },
            dimensions: {
                width: 55,
                height: 75,
                scale: 1.0
            },
            animations: {
                frameRate: 10,
                looping: true,
                transitions: {
                    idle_to_walk: 180,
                    emotion_change: 400
                }
            },
            characteristics: {
                headSize: 'proportional',
                bodyProportions: 'growing',
                features: ['expressive_eyes', 'youthful_face', 'dynamic_posture'],
                colors: {
                    skin: '#FFE4C4',
                    hair: '#654321',
                    eyes: '#8B4513',
                    clothes: '#DDA0DD'
                }
            }
        });

        // 成年期资源配置
        this.assets.set('adult', {
            sprites: {
                idle: this._generateAdultIdleFrames(),
                walk: this._generateAdultWalkFrames(),
                professional: this._generateAdultProfessionalFrames(),
                emotions: {
                    confident: this._generateAdultConfidentFrames(),
                    focused: this._generateAdultFocusedFrames(),
                    caring: this._generateAdultCaringFrames(),
                    proud: this._generateAdultProudFrames()
                }
            },
            dimensions: {
                width: 60,
                height: 80,
                scale: 1.0
            },
            animations: {
                frameRate: 8,
                looping: true,
                transitions: {
                    idle_to_walk: 200,
                    emotion_change: 350
                }
            },
            characteristics: {
                headSize: 'mature',
                bodyProportions: 'stable',
                features: ['mature_eyes', 'confident_smile', 'professional_posture'],
                colors: {
                    skin: '#FFE4C4',
                    hair: '#8B4513',
                    eyes: '#4169E1',
                    clothes: '#2F4F4F'
                }
            }
        });

        // 老年期资源配置
        this.assets.set('elder', {
            sprites: {
                idle: this._generateElderIdleFrames(),
                walk: this._generateElderWalkFrames(),
                emotions: {
                    wise: this._generateElderWiseFrames(),
                    gentle: this._generateElderGentleFrames(),
                    peaceful: this._generateElderPeacefulFrames(),
                    nostalgic: this._generateElderNostalgicFrames()
                }
            },
            dimensions: {
                width: 55,
                height: 75,
                scale: 1.0
            },
            animations: {
                frameRate: 6,
                looping: true,
                transitions: {
                    idle_to_walk: 300,
                    emotion_change: 500
                }
            },
            characteristics: {
                headSize: 'wise',
                bodyProportions: 'gentle',
                features: ['kind_eyes', 'gentle_smile', 'calm_posture'],
                colors: {
                    skin: '#F5DEB3',
                    hair: '#C0C0C0',
                    eyes: '#4682B4',
                    clothes: '#8FBC8F'
                }
            }
        });
    }

    /**
     * 获取指定阶段的资源配置
     * @param {string} stage - 人生阶段
     * @returns {Object} 资源配置
     */
    getAssetConfig(stage) {
        return this.assets.get(stage);
    }

    /**
     * 获取所有可用的人生阶段
     * @returns {Array} 阶段列表
     */
    getAvailableStages() {
        return Array.from(this.assets.keys());
    }

    /**
     * 预加载指定阶段的资源
     * @param {string} stage - 人生阶段
     * @returns {Promise} 加载完成的Promise
     */
    async preloadStageAssets(stage) {
        if (this.loadedAssets.has(stage)) {
            return this.loadedAssets.get(stage);
        }

        const config = this.assets.get(stage);
        if (!config) {
            throw new Error(`Unknown stage: ${stage}`);
        }

        // 模拟资源加载过程
        const loadedData = await this._loadAssetData(config);
        this.loadedAssets.set(stage, loadedData);
        
        return loadedData;
    }

    /**
     * 预加载所有阶段的资源
     * @returns {Promise} 所有资源加载完成的Promise
     */
    async preloadAllAssets() {
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        
        try {
            const stages = this.getAvailableStages();
            const loadPromises = stages.map(stage => this.preloadStageAssets(stage));
            await Promise.all(loadPromises);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 获取角色精灵帧
     * @param {string} stage - 人生阶段
     * @param {string} animation - 动画类型
     * @param {string} emotion - 情感状态（可选）
     * @returns {Array} 精灵帧数组
     */
    getSpriteFrames(stage, animation, emotion = null) {
        const config = this.assets.get(stage);
        if (!config) return [];

        if (emotion && config.sprites.emotions && config.sprites.emotions[emotion]) {
            return config.sprites.emotions[emotion];
        }

        return config.sprites[animation] || [];
    }

    /**
     * 获取详细外观特征
     * @param {string} stage - 人生阶段
     * @returns {Object} 详细外观特征
     */
    getDetailedAppearance(stage) {
        const config = this.assets.get(stage);
        if (!config) return null;

        return {
            physicalFeatures: this._getPhysicalFeatures(stage),
            facialExpressions: this._getFacialExpressions(stage),
            bodyLanguage: this._getBodyLanguage(stage),
            clothingStyle: this._getClothingStyle(stage),
            movementPatterns: this._getMovementPatterns(stage)
        };
    }

    /**
     * 获取物理特征
     * @private
     */
    _getPhysicalFeatures(stage) {
        const baseFeatures = {
            baby: {
                headShape: 'round_large',
                eyeSize: 'very_large',
                noseSize: 'tiny',
                mouthSize: 'small',
                bodyBuild: 'chubby_soft',
                skinTexture: 'smooth_baby',
                hairStyle: 'sparse_fine'
            },
            child: {
                headShape: 'round_medium',
                eyeSize: 'large_bright',
                noseSize: 'small',
                mouthSize: 'medium_playful',
                bodyBuild: 'lean_energetic',
                skinTexture: 'smooth_healthy',
                hairStyle: 'thick_messy'
            },
            teen: {
                headShape: 'oval_growing',
                eyeSize: 'medium_expressive',
                noseSize: 'developing',
                mouthSize: 'medium_changing',
                bodyBuild: 'growing_lanky',
                skinTexture: 'changing_adolescent',
                hairStyle: 'styled_trendy'
            },
            adult: {
                headShape: 'defined_mature',
                eyeSize: 'medium_confident',
                noseSize: 'full_developed',
                mouthSize: 'full_expressive',
                bodyBuild: 'strong_stable',
                skinTexture: 'mature_refined',
                hairStyle: 'professional_neat'
            },
            elder: {
                headShape: 'wise_weathered',
                eyeSize: 'kind_deep',
                noseSize: 'prominent_character',
                mouthSize: 'gentle_experienced',
                bodyBuild: 'gentle_dignified',
                skinTexture: 'weathered_wise',
                hairStyle: 'silver_distinguished'
            }
        };

        return baseFeatures[stage] || baseFeatures.adult;
    }

    /**
     * 获取面部表情
     * @private
     */
    _getFacialExpressions(stage) {
        const expressions = {
            baby: {
                default: 'innocent_wonder',
                happy: 'pure_joy_giggle',
                sad: 'confused_crying',
                surprised: 'wide_eyed_amazement',
                sleepy: 'drowsy_peaceful'
            },
            child: {
                default: 'curious_bright',
                happy: 'excited_laughter',
                sad: 'disappointed_pout',
                surprised: 'amazed_wonder',
                playful: 'mischievous_grin'
            },
            teen: {
                default: 'thoughtful_searching',
                happy: 'confident_smile',
                sad: 'emotional_turmoil',
                surprised: 'dramatic_shock',
                romantic: 'dreamy_longing'
            },
            adult: {
                default: 'composed_focused',
                happy: 'satisfied_achievement',
                sad: 'concerned_responsibility',
                surprised: 'controlled_surprise',
                proud: 'accomplished_confidence'
            },
            elder: {
                default: 'peaceful_wisdom',
                happy: 'gentle_contentment',
                sad: 'nostalgic_melancholy',
                surprised: 'amused_knowing',
                wise: 'deep_understanding'
            }
        };

        return expressions[stage] || expressions.adult;
    }

    /**
     * 获取肢体语言
     * @private
     */
    _getBodyLanguage(stage) {
        const bodyLanguage = {
            baby: {
                idle: 'sitting_wobbling',
                movement: 'crawling_exploring',
                interaction: 'reaching_grasping',
                emotional: 'whole_body_expression'
            },
            child: {
                idle: 'bouncing_fidgeting',
                movement: 'running_skipping',
                interaction: 'animated_gesturing',
                emotional: 'energetic_expression'
            },
            teen: {
                idle: 'self_conscious_posturing',
                movement: 'awkward_growing',
                interaction: 'expressive_dramatic',
                emotional: 'intense_gestures'
            },
            adult: {
                idle: 'confident_stable',
                movement: 'purposeful_efficient',
                interaction: 'controlled_professional',
                emotional: 'measured_expression'
            },
            elder: {
                idle: 'calm_dignified',
                movement: 'careful_deliberate',
                interaction: 'gentle_wise',
                emotional: 'subtle_profound'
            }
        };

        return bodyLanguage[stage] || bodyLanguage.adult;
    }

    /**
     * 获取服装风格
     * @private
     */
    _getClothingStyle(stage) {
        const clothing = {
            baby: {
                style: 'soft_onesie',
                colors: ['pastel_pink', 'baby_blue', 'soft_yellow'],
                patterns: ['polka_dots', 'cute_animals', 'simple_stripes'],
                accessories: ['bib', 'soft_hat']
            },
            child: {
                style: 'playful_casual',
                colors: ['bright_primary', 'cheerful_secondary'],
                patterns: ['cartoon_characters', 'fun_prints', 'colorful_stripes'],
                accessories: ['backpack', 'sneakers', 'cap']
            },
            teen: {
                style: 'trendy_expressive',
                colors: ['bold_statement', 'mood_colors'],
                patterns: ['graphic_tees', 'band_logos', 'artistic_designs'],
                accessories: ['headphones', 'messenger_bag', 'trendy_shoes']
            },
            adult: {
                style: 'professional_mature',
                colors: ['business_neutral', 'sophisticated_tones'],
                patterns: ['solid_colors', 'subtle_textures', 'classic_patterns'],
                accessories: ['briefcase', 'watch', 'formal_shoes']
            },
            elder: {
                style: 'comfortable_dignified',
                colors: ['warm_earth_tones', 'gentle_pastels'],
                patterns: ['classic_designs', 'timeless_patterns'],
                accessories: ['reading_glasses', 'comfortable_shoes', 'cardigan']
            }
        };

        return clothing[stage] || clothing.adult;
    }

    /**
     * 获取移动模式
     * @private
     */
    _getMovementPatterns(stage) {
        const movements = {
            baby: {
                speed: 'very_slow',
                style: 'crawling_wobbling',
                rhythm: 'irregular_exploring',
                transitions: 'gradual_careful'
            },
            child: {
                speed: 'fast_energetic',
                style: 'running_jumping',
                rhythm: 'bouncy_playful',
                transitions: 'quick_spontaneous'
            },
            teen: {
                speed: 'variable_moody',
                style: 'confident_awkward',
                rhythm: 'dramatic_expressive',
                transitions: 'sudden_emotional'
            },
            adult: {
                speed: 'steady_purposeful',
                style: 'efficient_controlled',
                rhythm: 'consistent_professional',
                transitions: 'smooth_planned'
            },
            elder: {
                speed: 'slow_deliberate',
                style: 'careful_dignified',
                rhythm: 'measured_wise',
                transitions: 'gentle_thoughtful'
            }
        };

        return movements[stage] || movements.adult;
    }

    /**
     * 生成自然移动动画序列
     * @param {string} stage - 人生阶段
     * @param {string} movementType - 移动类型
     * @param {Object} options - 动画选项
     * @returns {Array} 动画序列
     */
    generateNaturalMovement(stage, movementType, options = {}) {
        const movementPatterns = this._getMovementPatterns(stage);
        const bodyLanguage = this._getBodyLanguage(stage);
        
        const animationSequence = [];
        
        switch (movementType) {
            case 'walk':
                animationSequence.push(...this._generateWalkSequence(stage, movementPatterns));
                break;
            case 'run':
                if (stage !== 'baby' && stage !== 'elder') {
                    animationSequence.push(...this._generateRunSequence(stage, movementPatterns));
                } else {
                    // 婴儿和老人不能跑，改为快速移动
                    animationSequence.push(...this._generateFastMoveSequence(stage, movementPatterns));
                }
                break;
            case 'idle':
                animationSequence.push(...this._generateIdleSequence(stage, bodyLanguage));
                break;
            case 'interaction':
                animationSequence.push(...this._generateInteractionSequence(stage, bodyLanguage));
                break;
        }
        
        return animationSequence;
    }

    /**
     * 生成步行动画序列
     * @private
     */
    _generateWalkSequence(stage, patterns) {
        const baseSequence = [
            { frame: 0, description: '准备迈步', duration: 200 },
            { frame: 1, description: '抬起脚', duration: 300 },
            { frame: 2, description: '向前迈步', duration: 400 },
            { frame: 3, description: '落脚着地', duration: 300 }
        ];

        // 根据阶段调整动画特征
        switch (stage) {
            case 'baby':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'crawling_movement',
                    characteristics: ['wobbly', 'exploring', 'careful']
                }));
            case 'child':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'energetic_bouncing',
                    characteristics: ['bouncy', 'playful', 'quick']
                }));
            case 'teen':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'confident_stride',
                    characteristics: ['confident', 'expressive', 'dynamic']
                }));
            case 'adult':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'purposeful_walk',
                    characteristics: ['efficient', 'stable', 'professional']
                }));
            case 'elder':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'careful_steps',
                    characteristics: ['deliberate', 'dignified', 'measured'],
                    duration: frame.duration * 1.5 // 更慢的节奏
                }));
        }
        
        return baseSequence;
    }

    /**
     * 生成跑步动画序列
     * @private
     */
    _generateRunSequence(stage, patterns) {
        const baseSequence = [
            { frame: 0, description: '准备冲刺', duration: 150 },
            { frame: 1, description: '快速抬腿', duration: 200 },
            { frame: 2, description: '向前冲刺', duration: 250 },
            { frame: 3, description: '着地推进', duration: 200 }
        ];

        switch (stage) {
            case 'child':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'excited_running',
                    characteristics: ['energetic', 'joyful', 'carefree']
                }));
            case 'teen':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'athletic_running',
                    characteristics: ['powerful', 'determined', 'competitive']
                }));
            case 'adult':
                return baseSequence.map(frame => ({
                    ...frame,
                    style: 'efficient_jogging',
                    characteristics: ['controlled', 'fitness_focused', 'steady']
                }));
        }
        
        return baseSequence;
    }

    /**
     * 生成待机动画序列
     * @private
     */
    _generateIdleSequence(stage, bodyLanguage) {
        const sequences = {
            baby: [
                { frame: 0, description: '坐着摇摆', duration: 1000, characteristics: ['innocent', 'curious'] },
                { frame: 1, description: '环顾四周', duration: 800, characteristics: ['wondering', 'exploring'] },
                { frame: 2, description: '轻微晃动', duration: 1200, characteristics: ['peaceful', 'content'] }
            ],
            child: [
                { frame: 0, description: '轻微跳跃', duration: 600, characteristics: ['energetic', 'restless'] },
                { frame: 1, description: '左右摇摆', duration: 500, characteristics: ['playful', 'fidgety'] },
                { frame: 2, description: '好奇张望', duration: 700, characteristics: ['curious', 'alert'] }
            ],
            teen: [
                { frame: 0, description: '自信站立', duration: 800, characteristics: ['confident', 'self_aware'] },
                { frame: 1, description: '整理外表', duration: 600, characteristics: ['self_conscious', 'image_aware'] },
                { frame: 2, description: '思考姿态', duration: 1000, characteristics: ['contemplative', 'dreamy'] }
            ],
            adult: [
                { frame: 0, description: '稳重站立', duration: 1000, characteristics: ['professional', 'composed'] },
                { frame: 1, description: '检查时间', duration: 500, characteristics: ['time_conscious', 'responsible'] },
                { frame: 2, description: '专注思考', duration: 800, characteristics: ['focused', 'analytical'] }
            ],
            elder: [
                { frame: 0, description: '平静站立', duration: 1500, characteristics: ['peaceful', 'dignified'] },
                { frame: 1, description: '温和微笑', duration: 1200, characteristics: ['kind', 'wise'] },
                { frame: 2, description: '回忆往昔', duration: 2000, characteristics: ['nostalgic', 'reflective'] }
            ]
        };

        return sequences[stage] || sequences.adult;
    }

    /**
     * 生成交互动画序列
     * @private
     */
    _generateInteractionSequence(stage, bodyLanguage) {
        const sequences = {
            baby: [
                { frame: 0, description: '伸手够取', duration: 800, characteristics: ['reaching', 'grasping'] },
                { frame: 1, description: '好奇触摸', duration: 600, characteristics: ['exploring', 'tactile'] }
            ],
            child: [
                { frame: 0, description: '兴奋指点', duration: 400, characteristics: ['excited', 'animated'] },
                { frame: 1, description: '跳跃庆祝', duration: 500, characteristics: ['joyful', 'expressive'] }
            ],
            teen: [
                { frame: 0, description: '戏剧性手势', duration: 600, characteristics: ['dramatic', 'expressive'] },
                { frame: 1, description: '情感丰富', duration: 700, characteristics: ['passionate', 'intense'] }
            ],
            adult: [
                { frame: 0, description: '专业手势', duration: 500, characteristics: ['controlled', 'purposeful'] },
                { frame: 1, description: '确认动作', duration: 400, characteristics: ['decisive', 'confident'] }
            ],
            elder: [
                { frame: 0, description: '温和手势', duration: 800, characteristics: ['gentle', 'wise'] },
                { frame: 1, description: '慈祥点头', duration: 600, characteristics: ['understanding', 'patient'] }
            ]
        };

        return sequences[stage] || sequences.adult;
    }

    /**
     * 生成情感表达动画
     * @param {string} stage - 人生阶段
     * @param {string} emotion - 情感类型
     * @returns {Array} 情感动画序列
     */
    generateEmotionalExpression(stage, emotion) {
        const expressions = this._getFacialExpressions(stage);
        const bodyLanguage = this._getBodyLanguage(stage);
        
        const emotionalSequence = [];
        
        // 基础情感表达
        emotionalSequence.push({
            type: 'facial_expression',
            expression: expressions[emotion] || expressions.default,
            duration: 1000,
            intensity: this._getEmotionalIntensity(stage, emotion)
        });
        
        // 肢体语言配合
        emotionalSequence.push({
            type: 'body_language',
            gesture: bodyLanguage.emotional,
            duration: 800,
            characteristics: this._getEmotionalCharacteristics(stage, emotion)
        });
        
        return emotionalSequence;
    }

    /**
     * 获取情感强度
     * @private
     */
    _getEmotionalIntensity(stage, emotion) {
        const intensityMap = {
            baby: { happy: 0.9, sad: 0.8, surprised: 0.9, sleepy: 0.3 },
            child: { happy: 1.0, sad: 0.7, surprised: 0.9, playful: 0.8 },
            teen: { happy: 0.8, sad: 0.9, surprised: 0.7, romantic: 0.6 },
            adult: { happy: 0.6, sad: 0.5, surprised: 0.4, proud: 0.7 },
            elder: { happy: 0.5, sad: 0.4, surprised: 0.3, wise: 0.8 }
        };
        
        return intensityMap[stage]?.[emotion] || 0.5;
    }

    /**
     * 获取角色特征
     * @param {string} stage - 人生阶段
     * @returns {Object} 角色特征
     */
    getCharacteristics(stage) {
        const config = this.assets.get(stage);
        return config ? config.characteristics : null;
    }

    /**
     * 生成快速移动序列（用于婴儿和老人）
     * @private
     */
    _generateFastMoveSequence(stage, patterns) {
        if (stage === 'baby') {
            return [
                { frame: 0, description: '快速爬行准备', duration: 300, characteristics: ['eager', 'determined'] },
                { frame: 1, description: '加速爬行', duration: 400, characteristics: ['excited', 'focused'] },
                { frame: 2, description: '继续爬行', duration: 350, characteristics: ['persistent', 'joyful'] }
            ];
        } else if (stage === 'elder') {
            return [
                { frame: 0, description: '加快步伐', duration: 400, characteristics: ['purposeful', 'careful'] },
                { frame: 1, description: '稳步前进', duration: 500, characteristics: ['determined', 'dignified'] },
                { frame: 2, description: '保持节奏', duration: 450, characteristics: ['steady', 'wise'] }
            ];
        }
        
        return [];
    }

    /**
     * 替换角色视觉资源
     * @param {string} stage - 人生阶段
     * @param {Object} newVisualData - 新的视觉数据
     */
    replaceCharacterVisuals(stage, newVisualData) {
        if (!this.assets.has(stage)) {
            console.warn(`Stage ${stage} not found for visual replacement`);
            return;
        }

        const currentAssets = this.assets.get(stage);
        
        // 深度合并新的视觉数据
        const updatedAssets = this._deepMerge(currentAssets, newVisualData);
        
        // 更新资源
        this.assets.set(stage, updatedAssets);
        
        // 清除缓存，强制重新加载
        if (this.loadedAssets.has(stage)) {
            this.loadedAssets.delete(stage);
        }
        
        console.log(`Visual assets updated for stage: ${stage}`);
    }

    /**
     * 深度合并对象
     * @private
     */
    _deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this._deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    /**
     * 创建自定义角色外观
     * @param {string} stage - 人生阶段
     * @param {Object} customization - 自定义选项
     * @returns {Object} 自定义外观配置
     */
    createCustomAppearance(stage, customization = {}) {
        const baseConfig = this.assets.get(stage);
        if (!baseConfig) return null;

        const customAppearance = {
            ...baseConfig,
            characteristics: {
                ...baseConfig.characteristics,
                // 自定义肤色
                skinTone: customization.skinTone || baseConfig.characteristics.colors.skin,
                // 自定义发色
                hairColor: customization.hairColor || baseConfig.characteristics.colors.hair,
                // 自定义眼色
                eyeColor: customization.eyeColor || baseConfig.characteristics.colors.eyes,
                // 自定义服装
                clothingStyle: customization.clothingStyle || this._getClothingStyle(stage),
                // 自定义配饰
                accessories: customization.accessories || []
            }
        };

        return customAppearance;
    }

    /**
     * 验证角色资源完整性
     * @param {string} stage - 人生阶段
     * @returns {Object} 验证结果
     */
    validateCharacterAssets(stage) {
        const config = this.assets.get(stage);
        if (!config) {
            return { valid: false, errors: [`Stage ${stage} not found`] };
        }

        const errors = [];
        const requiredFields = ['sprites', 'dimensions', 'animations', 'characteristics'];
        
        requiredFields.forEach(field => {
            if (!config[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });

        // 验证精灵动画
        if (config.sprites) {
            const requiredAnimations = ['idle', 'walk', 'emotions'];
            requiredAnimations.forEach(anim => {
                if (!config.sprites[anim]) {
                    errors.push(`Missing animation: ${anim}`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: this._getAssetWarnings(config)
        };
    }

    /**
     * 获取资源警告
     * @private
     */
    _getAssetWarnings(config) {
        const warnings = [];
        
        // 检查动画帧率
        if (config.animations && config.animations.frameRate > 30) {
            warnings.push('High frame rate may impact performance on mobile devices');
        }
        
        // 检查尺寸
        if (config.dimensions && (config.dimensions.width > 100 || config.dimensions.height > 100)) {
            warnings.push('Large character dimensions may impact performance');
        }
        
        return warnings;
    }

    /**
     * 更新角色资源
     * @param {string} stage - 人生阶段
     * @param {Object} newAssets - 新的资源配置
     */
    updateAssets(stage, newAssets) {
        if (this.assets.has(stage)) {
            const currentAssets = this.assets.get(stage);
            this.assets.set(stage, { ...currentAssets, ...newAssets });
            
            // 清除已加载的缓存，强制重新加载
            if (this.loadedAssets.has(stage)) {
                this.loadedAssets.delete(stage);
            }
        }
    }

    // 以下是生成各个阶段动画帧的私有方法
    // 这些方法返回描述性的帧数据，实际实现中可以是图像数据或绘制指令

    _generateBabyIdleFrames() {
        return [
            { type: 'baby_idle', frame: 0, description: '婴儿安静坐着，眼睛眨动' },
            { type: 'baby_idle', frame: 1, description: '婴儿轻微摇摆，表情天真' },
            { type: 'baby_idle', frame: 2, description: '婴儿回到中心位置，微笑' }
        ];
    }

    _generateBabyWalkFrames() {
        return [
            { type: 'baby_crawl', frame: 0, description: '婴儿准备爬行' },
            { type: 'baby_crawl', frame: 1, description: '婴儿向前爬行' },
            { type: 'baby_crawl', frame: 2, description: '婴儿继续爬行动作' }
        ];
    }

    _generateBabyHappyFrames() {
        return [
            { type: 'baby_happy', frame: 0, description: '婴儿开心笑容，眼睛弯成月牙' },
            { type: 'baby_happy', frame: 1, description: '婴儿拍手，表情兴奋' }
        ];
    }

    _generateBabySadFrames() {
        return [
            { type: 'baby_sad', frame: 0, description: '婴儿皱眉，嘴角下垂' },
            { type: 'baby_sad', frame: 1, description: '婴儿眼中含泪' }
        ];
    }

    _generateBabySurprisedFrames() {
        return [
            { type: 'baby_surprised', frame: 0, description: '婴儿眼睛睁大，嘴巴张开' }
        ];
    }

    _generateBabySleepyFrames() {
        return [
            { type: 'baby_sleepy', frame: 0, description: '婴儿眼睛半闭，打哈欠' }
        ];
    }

    _generateChildIdleFrames() {
        return [
            { type: 'child_idle', frame: 0, description: '儿童站立，好奇地环顾四周' },
            { type: 'child_idle', frame: 1, description: '儿童轻微跳跃，充满活力' },
            { type: 'child_idle', frame: 2, description: '儿童回到站立姿势，微笑' }
        ];
    }

    _generateChildWalkFrames() {
        return [
            { type: 'child_walk', frame: 0, description: '儿童抬起左脚' },
            { type: 'child_walk', frame: 1, description: '儿童向前迈步' },
            { type: 'child_walk', frame: 2, description: '儿童抬起右脚' },
            { type: 'child_walk', frame: 3, description: '儿童完成步伐' }
        ];
    }

    _generateChildRunFrames() {
        return [
            { type: 'child_run', frame: 0, description: '儿童准备奔跑' },
            { type: 'child_run', frame: 1, description: '儿童快速奔跑，头发飞扬' },
            { type: 'child_run', frame: 2, description: '儿童继续奔跑动作' }
        ];
    }

    _generateChildHappyFrames() {
        return [
            { type: 'child_happy', frame: 0, description: '儿童开心跳跃' },
            { type: 'child_happy', frame: 1, description: '儿童举起双手庆祝' }
        ];
    }

    _generateChildExcitedFrames() {
        return [
            { type: 'child_excited', frame: 0, description: '儿童兴奋地挥舞双臂' }
        ];
    }

    _generateChildCuriousFrames() {
        return [
            { type: 'child_curious', frame: 0, description: '儿童歪头思考，手指放在嘴边' }
        ];
    }

    _generateChildPlayfulFrames() {
        return [
            { type: 'child_playful', frame: 0, description: '儿童做鬼脸，调皮表情' }
        ];
    }

    // 青少年、成人、老人的帧生成方法类似...
    // 为了简洁，这里只展示几个关键的

    _generateTeenIdleFrames() {
        return [
            { type: 'teen_idle', frame: 0, description: '青少年自信站立，略显青涩' },
            { type: 'teen_idle', frame: 1, description: '青少年整理头发，展现青春活力' }
        ];
    }

    _generateTeenWalkFrames() {
        return [
            { type: 'teen_walk', frame: 0, description: '青少年步伐轻快' },
            { type: 'teen_walk', frame: 1, description: '青少年走路带有青春的朝气' }
        ];
    }

    _generateAdultIdleFrames() {
        return [
            { type: 'adult_idle', frame: 0, description: '成人稳重站立，姿态专业' },
            { type: 'adult_idle', frame: 1, description: '成人略微调整姿势，保持自信' }
        ];
    }

    _generateElderIdleFrames() {
        return [
            { type: 'elder_idle', frame: 0, description: '老人慈祥站立，散发智慧' },
            { type: 'elder_idle', frame: 1, description: '老人温和微笑，眼中有故事' }
        ];
    }

    // 其他情感帧生成方法...
    _generateTeenConfidentFrames() {
        return [{ type: 'teen_confident', frame: 0, description: '青少年挺胸抬头，自信满满' }];
    }

    _generateTeenShyFrames() {
        return [{ type: 'teen_shy', frame: 0, description: '青少年低头害羞，脸颊微红' }];
    }

    _generateTeenDeterminedFrames() {
        return [{ type: 'teen_determined', frame: 0, description: '青少年眼神坚定，握拳决心' }];
    }

    _generateTeenRomanticFrames() {
        return [{ type: 'teen_romantic', frame: 0, description: '青少年眼中有爱意，表情温柔' }];
    }

    _generateAdultConfidentFrames() {
        return [{ type: 'adult_confident', frame: 0, description: '成人展现成熟自信' }];
    }

    _generateAdultFocusedFrames() {
        return [{ type: 'adult_focused', frame: 0, description: '成人专注工作，眉头微皱' }];
    }

    _generateAdultCaringFrames() {
        return [{ type: 'adult_caring', frame: 0, description: '成人温柔关怀，眼神慈爱' }];
    }

    _generateAdultProudFrames() {
        return [{ type: 'adult_proud', frame: 0, description: '成人骄傲微笑，成就感满满' }];
    }

    _generateAdultProfessionalFrames() {
        return [{ type: 'adult_professional', frame: 0, description: '成人职业装扮，专业姿态' }];
    }

    _generateElderWiseFrames() {
        return [{ type: 'elder_wise', frame: 0, description: '老人智慧的眼神，深邃而温和' }];
    }

    _generateElderGentleFrames() {
        return [{ type: 'elder_gentle', frame: 0, description: '老人温柔慈祥，如春风般和煦' }];
    }

    _generateElderPeacefulFrames() {
        return [{ type: 'elder_peaceful', frame: 0, description: '老人内心平静，表情安详' }];
    }

    _generateElderNostalgicFrames() {
        return [{ type: 'elder_nostalgic', frame: 0, description: '老人回忆往昔，眼中有怀念' }];
    }

    _generateElderWalkFrames() {
        return [
            { type: 'elder_walk', frame: 0, description: '老人缓慢而稳重地行走' },
            { type: 'elder_walk', frame: 1, description: '老人每一步都很踏实' }
        ];
    }

    /**
     * 模拟资源加载
     * @private
     */
    async _loadAssetData(config) {
        // 模拟异步加载过程
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ...config,
                    loaded: true,
                    loadTime: Date.now()
                });
            }, 100); // 模拟100ms加载时间
        });
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterAssets;
} else if (typeof window !== 'undefined') {
    window.CharacterAssets = CharacterAssets;
}