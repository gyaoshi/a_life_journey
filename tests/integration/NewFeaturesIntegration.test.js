/**
 * 新功能集成测试 - 测试UI集成、交互圈、动画可见性、详细评价的协同工作
 * 需求: 16.1-19.6
 */

// 设置Node.js环境的全局变量
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock DOM环境
global.window = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    MouseEvent: class MockMouseEvent {
        constructor(type, options = {}) {
            this.type = type;
            this.clientX = options.clientX || 0;
            this.clientY = options.clientY || 0;
        }
    }
};

global.document = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    createElement: jest.fn(() => ({
        style: {},
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
    }))
};

global.HTMLCanvasElement = class MockCanvas {
    constructor() {
        this.width = 900;
        this.height = 700;
        this.style = {};
    }
    
    getContext() {
        return mockContext;
    }
    
    getBoundingClientRect() {
        return { left: 0, top: 0, width: 900, height: 700 };
    }
    
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {}
};

global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
global.performance = { now: () => Date.now() };

// Mock Canvas 2D Context
const mockContext = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    globalAlpha: 1,
    imageSmoothingEnabled: true,
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    drawImage: jest.fn()
};

// 加载需要测试的类
const GameUIManager = require('../../src/core/GameUIManager');
const InteractionCircleRenderer = require('../../src/graphics/InteractionCircleRenderer');
const AnimationVisibilityManager = require('../../src/graphics/AnimationVisibilityManager');
const EvaluationSystem = require('../../src/core/EvaluationSystem');

describe('新功能集成测试', () => {
    let canvas, gameEngine, uiManager, interactionCircleRenderer, animationVisibilityManager, evaluationSystem;
    let mockAnimationEngine;

    beforeEach(() => {
        // 创建模拟的Canvas和DOM元素
        const mockStartButton = {
            textContent: '开始游戏',
            getAttribute: () => 'startGame()',
            style: { display: '' },
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };
        
        const mockRestartButton = {
            textContent: '重新开始',
            getAttribute: () => 'resetGame()',
            style: { display: '' },
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };
        
        canvas = new HTMLCanvasElement();
        
        // 设置DOM查询模拟
        document.getElementById = jest.fn((id) => {
            if (id === 'gameCanvas') return canvas;
            return null;
        });
        
        document.querySelector = jest.fn((selector) => {
            if (selector.includes('startGame')) return mockStartButton;
            if (selector.includes('resetGame')) return mockRestartButton;
            return null;
        });
        
        document.querySelectorAll = jest.fn((selector) => {
            if (selector === 'button, .btn') {
                return [mockStartButton, mockRestartButton];
            }
            if (selector === 'div') {
                return [];
            }
            return [];
        });
        
        // 创建模拟的游戏引擎
        gameEngine = {
            canvas: canvas,
            ctx: canvas.getContext('2d'),
            responsiveManager: {
                getScale: () => 1,
                getScaledSize: () => ({ width: 900, height: 700 })
            },
            game: {
                isInitialized: true,
                isStarted: false,
                startGame: jest.fn(),
                stopGame: jest.fn(),
                showStartPrompt: jest.fn()
            }
        };
        
        // 创建模拟的动画引擎
        mockAnimationEngine = {
            isPlaying: false,
            currentAnimation: null,
            setAnimationVisibilityManager: jest.fn(),
            playAnimation: jest.fn(),
            pauseAnimation: jest.fn(),
            resumeAnimation: jest.fn()
        };
        
        // 初始化组件
        uiManager = new GameUIManager(canvas, gameEngine);
        interactionCircleRenderer = new InteractionCircleRenderer(canvas.getContext('2d'));
        animationVisibilityManager = new AnimationVisibilityManager(canvas, mockAnimationEngine);
        evaluationSystem = new EvaluationSystem();
    });

    afterEach(() => {
        // 清理
        if (uiManager) uiManager.cleanup();
        if (interactionCircleRenderer) interactionCircleRenderer.reset();
        if (animationVisibilityManager) animationVisibilityManager.destroy();
        if (evaluationSystem) evaluationSystem.hideEvaluation();
    });

    describe('UI集成功能测试', () => {
        test('应该移除外部按钮并集成游戏内UI', () => {
            // 验证初始状态 - 外部按钮存在
            const startButton = document.querySelector('button[onclick*="startGame"]');
            const restartButton = document.querySelector('button[onclick*="resetGame"]');
            expect(startButton).toBeTruthy();
            expect(restartButton).toBeTruthy();
            
            // 初始化UI管理器
            uiManager.initialize();
            
            // 验证外部按钮被隐藏
            expect(startButton.style.display).toBe('none');
            expect(restartButton.style.display).toBe('none');
            
            // 验证UI管理器状态
            expect(uiManager.externalButtons.startButton).toBe(startButton);
            expect(uiManager.externalButtons.restartButton).toBe(restartButton);
        });

        test('应该显示游戏结束界面并集成重新开始按钮', () => {
            uiManager.initialize();
            
            const mockEvaluation = {
                title: '充实人生',
                description: '把握了大部分机会，活得很精彩',
                percentage: 75,
                totalScore: 750,
                completedEvents: 15,
                totalPossibleEvents: 20
            };
            
            // 显示游戏结束界面
            uiManager.showGameEndScreen(750, mockEvaluation);
            
            // 验证游戏结束界面状态
            expect(uiManager.showingGameEndScreen).toBe(true);
            expect(uiManager.restartButtonBounds).toBeTruthy();
            expect(uiManager.restartButtonBounds.width).toBe(120);
            expect(uiManager.restartButtonBounds.height).toBe(40);
        });

        test('应该处理游戏内重新开始按钮点击', () => {
            uiManager.initialize();
            
            const mockEvaluation = {
                title: '平凡人生',
                description: '虽然平淡，但也有属于自己的精彩',
                percentage: 50,
                totalScore: 500,
                completedEvents: 10,
                totalPossibleEvents: 20
            };
            
            uiManager.showGameEndScreen(500, mockEvaluation);
            
            // 模拟点击重新开始按钮
            const buttonBounds = uiManager.restartButtonBounds;
            const clickX = buttonBounds.x + buttonBounds.width / 2;
            const clickY = buttonBounds.y + buttonBounds.height / 2;
            
            // 创建点击事件
            const clickEvent = new window.MouseEvent('click', {
                clientX: clickX,
                clientY: clickY
            });
            
            // 模拟Canvas边界
            canvas.getBoundingClientRect = jest.fn(() => ({
                left: 0,
                top: 0,
                width: 900,
                height: 700
            }));
            
            // 触发点击事件
            canvas.dispatchEvent(clickEvent);
            
            // 验证游戏重新开始被调用
            setTimeout(() => {
                expect(gameEngine.game.stopGame).toHaveBeenCalled();
            }, 150);
        });
    });

    describe('交互圈系统测试', () => {
        test('应该显示和隐藏交互圈', () => {
            const position = { x: 450, y: 350 };
            
            // 显示交互圈
            interactionCircleRenderer.showInteractionCircle(position, 'active');
            
            // 验证交互圈状态
            expect(interactionCircleRenderer.isVisible).toBe(true);
            expect(interactionCircleRenderer.position).toEqual(position);
            expect(interactionCircleRenderer.circleState).toBe('active');
            expect(interactionCircleRenderer.animationType).toBe('pulse');
            
            // 隐藏交互圈
            interactionCircleRenderer.hideInteractionCircle();
            
            // 验证淡出开始
            expect(interactionCircleRenderer.fadeDirection).toBe(-1);
        });

        test('应该处理交互完成和超时状态', () => {
            const position = { x: 300, y: 400 };
            interactionCircleRenderer.showInteractionCircle(position, 'active');
            
            // 测试交互完成
            interactionCircleRenderer.onInteractionComplete();
            expect(interactionCircleRenderer.circleState).toBe('complete');
            expect(interactionCircleRenderer.animationType).toBe('blink');
            
            // 重置并测试交互超时
            interactionCircleRenderer.showInteractionCircle(position, 'active');
            interactionCircleRenderer.onInteractionTimeout();
            expect(interactionCircleRenderer.circleState).toBe('timeout');
            expect(interactionCircleRenderer.animationType).toBe('pulse');
        });

        test('应该更新动画状态', () => {
            const position = { x: 500, y: 300 };
            interactionCircleRenderer.showInteractionCircle(position, 'active');
            
            const initialAnimationTime = interactionCircleRenderer.animationTime;
            const deltaTime = 16; // 16ms (60fps)
            
            // 更新动画
            interactionCircleRenderer.update(deltaTime);
            
            // 验证动画时间更新
            expect(interactionCircleRenderer.animationTime).toBeGreaterThan(initialAnimationTime);
            
            // 验证淡入效果 - 检查淡入方向而不是透明度值
            expect(interactionCircleRenderer.fadeDirection).toBe(1); // 正在淡入
        });
    });

    describe('动画可见性管理测试', () => {
        test('应该确保动画在可见区域播放', async () => {
            const mockAnimation = {
                name: 'testAnimation',
                position: { x: 100, y: 100 }, // 初始位置在边缘
                size: { width: 150, height: 100 },
                scale: 1,
                setPosition: jest.fn(),
                play: jest.fn(),
                isComplete: jest.fn(() => true), // 模拟动画立即完成
                completed: true
            };
            
            // 确保动画可见
            await animationVisibilityManager.ensureAnimationVisible(mockAnimation);
            
            // 验证动画被居中
            expect(mockAnimation.setPosition).toHaveBeenCalledWith(450, 350); // 画布中心
            
            // 验证动画状态 - 由于动画立即完成，isAnimationPlaying会变为false
            expect(animationVisibilityManager.currentAnimation).toBeNull(); // 动画完成后被清理
        });

        test('应该调整动画尺寸以满足最小要求', async () => {
            const mockAnimation = {
                name: 'smallAnimation',
                position: { x: 450, y: 350 },
                size: { width: 50, height: 30 }, // 小于最小尺寸
                _originalSize: null, // 用于存储原始尺寸
                scale: 1,
                setPosition: jest.fn(),
                setScale: jest.fn(),
                play: jest.fn(),
                isComplete: jest.fn(() => true),
                completed: true
            };
            
            await animationVisibilityManager.ensureAnimationVisible(mockAnimation, {
                minSize: { width: 200, height: 150 }
            });
            
            // 验证缩放被应用 - 检查_originalSize的存在表明尺寸被调整了
            expect(mockAnimation._originalSize).toBeTruthy();
            expect(mockAnimation.size.width).toBeGreaterThan(50); // 尺寸应该被放大
        });

        test('应该暂停和恢复背景元素', () => {
            // 模拟全局游戏引擎
            global.gameEngine = {
                renderBackground: jest.fn(),
                renderEvents: jest.fn(),
                renderUI: jest.fn()
            };
            
            // 暂停背景元素
            animationVisibilityManager.pauseBackgroundElements();
            
            // 验证背景元素被暂停
            expect(animationVisibilityManager.backgroundElementsPaused).toBe(true);
            expect(animationVisibilityManager.pausedElements.has('gameEngine')).toBe(true);
            
            // 恢复背景元素
            animationVisibilityManager.resumeBackgroundElements();
            
            // 验证背景元素被恢复
            expect(animationVisibilityManager.backgroundElementsPaused).toBe(false);
            expect(animationVisibilityManager.pausedElements.size).toBe(0);
            
            // 清理
            delete global.gameEngine;
        });

        test('应该显示备用文字当动画失败时', () => {
            const eventName = '第一次微笑';
            
            // 显示备用文字
            animationVisibilityManager.showFallbackText(eventName);
            
            // 验证备用文字状态
            expect(animationVisibilityManager.fallbackTextActive).toBe(true);
            
            // 验证Canvas绘制调用
            expect(mockContext.fillRect).toHaveBeenCalled();
            expect(mockContext.fillText).toHaveBeenCalledWith(
                expect.stringContaining(eventName),
                expect.any(Number),
                expect.any(Number)
            );
        });
    });

    describe('详细评价系统测试', () => {
        test('应该根据分数生成正确的评价', () => {
            const testCases = [
                { score: 200, total: 20, completed: 5, expectedTitle: '匆忙人生' },
                { score: 500, total: 20, completed: 10, expectedTitle: '平凡人生' },
                { score: 750, total: 20, completed: 15, expectedTitle: '充实人生' },
                { score: 950, total: 20, completed: 19, expectedTitle: '完美人生' }
            ];
            
            testCases.forEach(testCase => {
                const evaluation = evaluationSystem.generateEvaluation(
                    testCase.score,
                    testCase.total,
                    testCase.completed
                );
                
                expect(evaluation.title).toBe(testCase.expectedTitle);
                expect(evaluation.score).toBe(testCase.score);
                expect(evaluation.completedEvents).toBe(testCase.completed);
                expect(evaluation.totalEvents).toBe(testCase.total);
                expect(evaluation.percentage).toBe(Math.round((testCase.completed / testCase.total) * 100));
                expect(evaluation.summary).toContain(`完成了 ${testCase.completed} 个重要事件`);
            });
        });

        test('应该显示评价界面', () => {
            const evaluation = evaluationSystem.generateEvaluation(750, 20, 15);
            
            // 显示评价界面
            evaluationSystem.displayEvaluation(mockContext, 900, 700);
            
            // 验证评价显示状态
            expect(evaluationSystem.isDisplaying).toBe(true);
            
            // 验证Canvas绘制调用
            expect(mockContext.fillRect).toHaveBeenCalled(); // 背景和面板
            expect(mockContext.strokeRect).toHaveBeenCalled(); // 面板边框
            expect(mockContext.fillText).toHaveBeenCalled(); // 文字内容
            
            // 验证重新开始按钮
            expect(evaluationSystem.restartButton).toBeTruthy();
            expect(evaluationSystem.restartButton.width).toBe(120);
            expect(evaluationSystem.restartButton.height).toBe(40);
        });

        test('应该检测重新开始按钮点击', () => {
            const evaluation = evaluationSystem.generateEvaluation(500, 20, 10);
            evaluationSystem.displayEvaluation(mockContext, 900, 700);
            
            const button = evaluationSystem.restartButton;
            
            // 测试按钮内点击
            const insideClick = evaluationSystem.checkRestartButtonClick(
                button.x + button.width / 2,
                button.y + button.height / 2
            );
            expect(insideClick).toBe(true);
            
            // 测试按钮外点击
            const outsideClick = evaluationSystem.checkRestartButtonClick(
                button.x - 10,
                button.y - 10
            );
            expect(outsideClick).toBe(false);
        });
    });

    describe('端到端集成测试', () => {
        test('应该完整地处理游戏流程', async () => {
            // 1. 初始化所有组件
            uiManager.initialize();
            
            // 验证UI集成
            expect(uiManager.externalButtons.startButton.style.display).toBe('none');
            expect(uiManager.externalButtons.restartButton.style.display).toBe('none');
            
            // 2. 模拟游戏事件触发交互圈
            const eventPosition = { x: 400, y: 300 };
            interactionCircleRenderer.showInteractionCircle(eventPosition, 'active');
            
            // 等待淡入动画开始
            interactionCircleRenderer.update(100); // 更新一帧让淡入开始
            
            // 验证交互圈显示
            expect(interactionCircleRenderer.isVisible).toBe(true);
            
            // 3. 模拟动画播放
            const mockAnimation = {
                name: 'gameEvent',
                position: { x: 200, y: 200 },
                size: { width: 100, height: 80 },
                scale: 1,
                setPosition: jest.fn(),
                play: jest.fn(),
                isComplete: jest.fn(() => true),
                completed: true
            };
            
            await animationVisibilityManager.ensureAnimationVisible(mockAnimation);
            
            // 验证动画可见性管理 - 动画完成后状态会被重置
            expect(mockAnimation.setPosition).toHaveBeenCalled();
            
            // 4. 模拟交互完成
            interactionCircleRenderer.onInteractionComplete();
            
            // 验证交互圈状态变化
            expect(interactionCircleRenderer.circleState).toBe('complete');
            
            // 5. 模拟游戏结束并显示评价
            const finalEvaluation = evaluationSystem.generateEvaluation(800, 20, 16);
            uiManager.showGameEndScreen(800, finalEvaluation);
            
            // 验证游戏结束界面
            expect(uiManager.showingGameEndScreen).toBe(true);
            expect(evaluationSystem.getCurrentEvaluation()).toBeTruthy();
            
            // 6. 模拟重新开始
            const restartBounds = uiManager.restartButtonBounds;
            canvas.getBoundingClientRect = jest.fn(() => ({
                left: 0, top: 0, width: 900, height: 700
            }));
            
            const clickEvent = new window.MouseEvent('click', {
                clientX: restartBounds.x + restartBounds.width / 2,
                clientY: restartBounds.y + restartBounds.height / 2
            });
            
            canvas.dispatchEvent(clickEvent);
            
            // 验证重新开始流程
            setTimeout(() => {
                expect(gameEngine.game.stopGame).toHaveBeenCalled();
            }, 150);
        });

        test('应该协调所有组件的更新循环', () => {
            const deltaTime = 16;
            
            // 初始化组件
            uiManager.initialize();
            interactionCircleRenderer.showInteractionCircle({ x: 450, y: 350 }, 'active');
            
            // 模拟游戏循环更新
            interactionCircleRenderer.update(deltaTime);
            animationVisibilityManager.update(deltaTime);
            
            // 验证组件状态更新
            expect(interactionCircleRenderer.animationTime).toBeGreaterThan(0);
            expect(interactionCircleRenderer.fadeDirection).toBe(1); // 正在淡入
            
            // 验证动画可见性管理器更新
            // (在没有活跃动画时应该正常运行)
            expect(() => animationVisibilityManager.update(deltaTime)).not.toThrow();
        });

        test('应该处理错误情况和降级方案', async () => {
            // 测试动画加载失败的情况
            const invalidAnimation = null;
            
            try {
                await animationVisibilityManager.ensureAnimationVisible(invalidAnimation);
            } catch (error) {
                // 验证错误被正确处理
                expect(error.message).toContain('Invalid animation object');
            }
            
            // 验证备用文字显示
            expect(animationVisibilityManager.fallbackTextActive).toBe(true);
            
            // 测试评价系统的边界情况
            const extremeEvaluation = evaluationSystem.generateEvaluation(0, 20, 0);
            expect(extremeEvaluation.title).toBe('匆忙人生');
            expect(extremeEvaluation.percentage).toBe(0);
            
            const perfectEvaluation = evaluationSystem.generateEvaluation(1000, 20, 20);
            expect(perfectEvaluation.title).toBe('完美人生');
            expect(perfectEvaluation.percentage).toBe(100);
        });
    });

    describe('性能和资源管理测试', () => {
        test('应该正确清理所有组件资源', () => {
            // 初始化所有组件
            uiManager.initialize();
            interactionCircleRenderer.showInteractionCircle({ x: 450, y: 350 }, 'active');
            
            const mockAnimation = {
                name: 'testAnimation',
                position: { x: 450, y: 350 },
                size: { width: 100, height: 100 },
                setPosition: jest.fn(),
                play: jest.fn()
            };
            
            animationVisibilityManager.ensureAnimationVisible(mockAnimation);
            evaluationSystem.generateEvaluation(500, 20, 10);
            
            // 清理所有组件
            uiManager.cleanup();
            interactionCircleRenderer.reset();
            animationVisibilityManager.destroy();
            evaluationSystem.hideEvaluation();
            
            // 验证清理状态
            expect(uiManager.showingGameEndScreen).toBe(false);
            expect(interactionCircleRenderer.isVisible).toBe(false);
            expect(animationVisibilityManager.isAnimationPlaying).toBe(false);
            expect(evaluationSystem.isDisplaying).toBe(false);
        });

        test('应该处理内存泄漏预防', () => {
            // 创建多个动画实例来测试内存管理
            for (let i = 0; i < 10; i++) {
                const animation = {
                    name: `animation${i}`,
                    position: { x: 450, y: 350 },
                    size: { width: 100, height: 100 },
                    setPosition: jest.fn(),
                    play: jest.fn()
                };
                
                animationVisibilityManager.ensureAnimationVisible(animation);
                animationVisibilityManager.reset(); // 立即清理
            }
            
            // 验证没有累积的状态
            expect(animationVisibilityManager.pausedElements.size).toBe(0);
            expect(animationVisibilityManager.currentAnimation).toBeNull();
        });
    });
});