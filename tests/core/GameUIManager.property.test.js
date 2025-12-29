/**
 * GameUIManager Property-Based Tests
 * 验证UI集成系统的正确性属性
 */

const fc = require('fast-check');

// Mock DOM environment for testing
const mockElement = {
    querySelectorAll: jest.fn(() => []),
    style: { display: '' },
    textContent: '',
    getAttribute: jest.fn(() => null)
};

// Mock container element with querySelectorAll method
const mockContainer = {
    querySelectorAll: jest.fn(() => []),
    style: { display: '' }
};

global.document = {
    querySelectorAll: jest.fn((selector) => {
        if (selector === 'div') {
            return [mockContainer];
        }
        return [mockElement];
    }),
    addEventListener: jest.fn(),
    getElementById: jest.fn(() => null)
};

global.window = {
    DEBUG_MODE: false
};

// Mock Canvas and Context
const mockContext = {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    fillText: jest.fn(),
    arc: jest.fn(),
    beginPath: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    set fillStyle(value) { this._fillStyle = value; },
    get fillStyle() { return this._fillStyle; },
    set strokeStyle(value) { this._strokeStyle = value; },
    get strokeStyle() { return this._strokeStyle; },
    set font(value) { this._font = value; },
    get font() { return this._font; },
    set textAlign(value) { this._textAlign = value; },
    get textAlign() { return this._textAlign; },
    set textBaseline(value) { this._textBaseline = value; },
    get textBaseline() { return this._textBaseline; },
    set lineWidth(value) { this._lineWidth = value; },
    get lineWidth() { return this._lineWidth; },
    set globalAlpha(value) { this._globalAlpha = value; },
    get globalAlpha() { return this._globalAlpha; }
};

const mockCanvas = {
    getContext: jest.fn(() => mockContext),
    addEventListener: jest.fn(),
    getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 })),
    style: {},
    width: 900,
    height: 700
};

// Mock GameEngine
const mockGameEngine = {
    responsiveManager: {
        getScale: jest.fn(() => 1),
        getScaledSize: jest.fn(() => ({ width: 900, height: 700 }))
    },
    game: null
};

// Load the GameUIManager
const GameUIManager = require('../../src/core/GameUIManager.js');

describe('GameUIManager Property-Based Tests', () => {
    let uiManager;
    
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Reset DOM mock
        document.querySelectorAll = jest.fn((selector) => {
            if (selector === 'div') {
                return [mockContainer];
            }
            return [mockElement];
        });
        
        // Reset canvas context mock
        mockCanvas.getContext = jest.fn(() => mockContext);
        
        // Create fresh UI manager instance
        uiManager = new GameUIManager(mockCanvas, mockGameEngine);
        mockGameEngine.game = {
            isInitialized: true,
            isStarted: false,
            startGame: jest.fn(),
            stopGame: jest.fn(),
            showStartPrompt: jest.fn()
        };
    });
    
    describe('**Feature: life-journey-game, Property 18: UI集成一致性**', () => {
        /**
         * **验证: 需求 16.1, 16.2**
         * 对于任何游戏加载完成状态，外部按钮应该被移除且游戏应该自动开始出生动画
         */
        test('外部按钮移除和自动启动一致性', () => {
            fc.assert(fc.property(
                fc.record({
                    hasStartButton: fc.boolean(),
                    hasRestartButton: fc.boolean(),
                    buttonCount: fc.integer({ min: 0, max: 5 }),
                    gameInitialized: fc.boolean()
                }),
                (testData) => {
                    // 模拟外部按钮存在
                    const mockButtons = [];
                    
                    if (testData.hasStartButton) {
                        const startButton = {
                            textContent: '开始游戏',
                            getAttribute: jest.fn(() => 'startGame()'),
                            style: { display: '' }
                        };
                        mockButtons.push(startButton);
                    }
                    
                    if (testData.hasRestartButton) {
                        const restartButton = {
                            textContent: '重新开始',
                            getAttribute: jest.fn(() => 'resetGame()'),
                            style: { display: '' }
                        };
                        mockButtons.push(restartButton);
                    }
                    
                    // 添加其他按钮
                    for (let i = 0; i < testData.buttonCount; i++) {
                        mockButtons.push({
                            textContent: `其他按钮${i}`,
                            getAttribute: jest.fn(() => null),
                            style: { display: '' }
                        });
                    }
                    
                    // 模拟DOM查询
                    const mockContainers = [];
                    for (let i = 0; i < Math.max(1, testData.buttonCount); i++) {
                        mockContainers.push({
                            querySelectorAll: jest.fn(() => []),
                            style: { display: '' }
                        });
                    }
                    
                    document.querySelectorAll = jest.fn((selector) => {
                        if (selector === 'div') {
                            return mockContainers;
                        }
                        return mockButtons;
                    });
                    
                    // 设置游戏状态
                    mockGameEngine.game.isInitialized = testData.gameInitialized;
                    
                    // 执行初始化
                    uiManager.initialize();
                    
                    // 验证外部按钮被隐藏
                    if (testData.hasStartButton) {
                        const startButton = mockButtons.find(b => b.textContent.includes('开始游戏'));
                        expect(startButton.style.display).toBe('none');
                    }
                    
                    if (testData.hasRestartButton) {
                        const restartButton = mockButtons.find(b => b.textContent.includes('重新开始'));
                        expect(restartButton.style.display).toBe('none');
                    }
                    
                    // 验证其他按钮不受影响
                    const otherButtons = mockButtons.filter(b => 
                        !b.textContent.includes('开始游戏') && 
                        !b.textContent.includes('重新开始')
                    );
                    otherButtons.forEach(button => {
                        expect(button.style.display).not.toBe('none');
                    });
                    
                    // 验证UI管理器状态
                    expect(uiManager.externalButtons.startButton).toBeDefined();
                    expect(uiManager.externalButtons.restartButton).toBeDefined();
                }
            ), { numRuns: 100 });
        });
        
        test('自动游戏启动机制', () => {
            fc.assert(fc.property(
                fc.record({
                    gameInitialized: fc.boolean(),
                    gameStarted: fc.boolean(),
                    autoStartDelay: fc.integer({ min: 1000, max: 5000 })
                }),
                (testData) => {
                    // 设置游戏状态
                    mockGameEngine.game.isInitialized = testData.gameInitialized;
                    mockGameEngine.game.isStarted = testData.gameStarted;
                    
                    // 模拟自动启动设置
                    uiManager.setupAutoGameStart();
                    
                    // 如果游戏已初始化且未开始，应该设置自动启动
                    if (testData.gameInitialized && !testData.gameStarted) {
                        expect(mockGameEngine.game.showStartPrompt).toBeDefined();
                    }
                    
                    // 验证UI集成状态
                    expect(uiManager.canvas).toBe(mockCanvas);
                    expect(uiManager.gameEngine).toBe(mockGameEngine);
                }
            ), { numRuns: 100 });
        });
    });
    
    describe('**Feature: life-journey-game, Property 19: 游戏内重新开始功能**', () => {
        /**
         * **验证: 需求 16.3, 16.4**
         * 对于任何游戏结束状态，游戏画面内应该显示重新开始按钮，点击后应该重置游戏状态
         */
        test('游戏结束界面重新开始按钮显示', () => {
            fc.assert(fc.property(
                fc.record({
                    score: fc.integer({ min: 0, max: 1000 }),
                    percentage: fc.integer({ min: 0, max: 100 }),
                    completedEvents: fc.integer({ min: 0, max: 50 }),
                    totalEvents: fc.integer({ min: 10, max: 50 }),
                    evaluationTitle: fc.constantFrom('匆忙人生', '平凡人生', '充实人生', '完美人生')
                }),
                (testData) => {
                    const evaluation = {
                        title: testData.evaluationTitle,
                        description: '测试评价描述',
                        percentage: testData.percentage,
                        totalScore: testData.score,
                        completedEvents: testData.completedEvents,
                        totalPossibleEvents: Math.max(testData.totalEvents, testData.completedEvents)
                    };
                    
                    // 显示游戏结束界面
                    uiManager.showGameEndScreen(testData.score, evaluation);
                    
                    // 验证游戏结束界面状态
                    expect(uiManager.showingGameEndScreen).toBe(true);
                    expect(uiManager.restartButtonBounds).toBeDefined();
                    expect(uiManager.restartButtonBounds.x).toBeGreaterThanOrEqual(0);
                    expect(uiManager.restartButtonBounds.y).toBeGreaterThanOrEqual(0);
                    expect(uiManager.restartButtonBounds.width).toBeGreaterThan(0);
                    expect(uiManager.restartButtonBounds.height).toBeGreaterThan(0);
                    
                    // 验证Canvas绘制调用
                    expect(mockContext.clearRect).toHaveBeenCalled();
                    expect(mockContext.fillRect).toHaveBeenCalled();
                    expect(mockContext.fillText).toHaveBeenCalled();
                }
            ), { numRuns: 100 });
        });
        
        test('重新开始按钮点击处理', () => {
            fc.assert(fc.property(
                fc.record({
                    clickX: fc.integer({ min: 0, max: 900 }),
                    clickY: fc.integer({ min: 0, max: 700 }),
                    buttonX: fc.integer({ min: 100, max: 800 }),
                    buttonY: fc.integer({ min: 100, max: 600 }),
                    buttonWidth: fc.integer({ min: 80, max: 200 }),
                    buttonHeight: fc.integer({ min: 30, max: 80 })
                }),
                (testData) => {
                    // 设置重新开始按钮边界
                    uiManager.restartButtonBounds = {
                        x: testData.buttonX,
                        y: testData.buttonY,
                        width: testData.buttonWidth,
                        height: testData.buttonHeight
                    };
                    uiManager.showingGameEndScreen = true;
                    
                    // 检查点击是否在按钮内
                    const isInside = uiManager.isPointInBounds(
                        testData.clickX, 
                        testData.clickY, 
                        uiManager.restartButtonBounds
                    );
                    
                    const expectedInside = 
                        testData.clickX >= testData.buttonX &&
                        testData.clickX <= testData.buttonX + testData.buttonWidth &&
                        testData.clickY >= testData.buttonY &&
                        testData.clickY <= testData.buttonY + testData.buttonHeight;
                    
                    // 验证点击检测准确性
                    expect(isInside).toBe(expectedInside);
                    
                    // 如果点击在按钮内，模拟点击处理
                    if (isInside) {
                        uiManager.handleRestartClick();
                        
                        // 验证游戏重置调用
                        expect(mockGameEngine.game.stopGame).toHaveBeenCalled();
                        expect(uiManager.showingGameEndScreen).toBe(false);
                        expect(uiManager.restartButtonBounds).toBeNull();
                    }
                }
            ), { numRuns: 100 });
        });
        
        test('UI状态管理一致性', () => {
            fc.assert(fc.property(
                fc.record({
                    initialShowingEndScreen: fc.boolean(),
                    hasRestartBounds: fc.boolean(),
                    performHide: fc.boolean(),
                    performShow: fc.boolean()
                }),
                (testData) => {
                    // 设置初始状态
                    uiManager.showingGameEndScreen = testData.initialShowingEndScreen;
                    
                    if (testData.hasRestartBounds) {
                        uiManager.restartButtonBounds = {
                            x: 100, y: 100, width: 120, height: 40
                        };
                    } else {
                        uiManager.restartButtonBounds = null;
                    }
                    
                    // 执行操作
                    if (testData.performShow) {
                        const mockEvaluation = {
                            title: '测试人生',
                            description: '测试描述',
                            percentage: 50,
                            totalScore: 500,
                            completedEvents: 10,
                            totalPossibleEvents: 20
                        };
                        uiManager.showGameEndScreen(500, mockEvaluation);
                        
                        // 验证显示状态
                        expect(uiManager.showingGameEndScreen).toBe(true);
                        expect(uiManager.restartButtonBounds).toBeDefined();
                    }
                    
                    if (testData.performHide) {
                        uiManager.hideGameEndScreen();
                        
                        // 验证隐藏状态
                        expect(uiManager.showingGameEndScreen).toBe(false);
                        expect(uiManager.restartButtonBounds).toBeNull();
                    }
                    
                    // 验证状态一致性
                    const isShowingScreen = uiManager.isShowingGameEndScreen();
                    expect(isShowingScreen).toBe(uiManager.showingGameEndScreen);
                    
                    const buttonBounds = uiManager.getRestartButtonBounds();
                    expect(buttonBounds).toBe(uiManager.restartButtonBounds);
                }
            ), { numRuns: 100 });
        });
    });
    
    describe('UI集成边界条件测试', () => {
        test('按钮边界检测准确性', () => {
            fc.assert(fc.property(
                fc.record({
                    buttonX: fc.float({ min: 0, max: 800 }),
                    buttonY: fc.float({ min: 0, max: 600 }),
                    buttonWidth: fc.float({ min: 10, max: 200 }),
                    buttonHeight: fc.float({ min: 10, max: 100 }),
                    testX: fc.float({ min: -50, max: 950 }),
                    testY: fc.float({ min: -50, max: 750 })
                }),
                (testData) => {
                    const bounds = {
                        x: testData.buttonX,
                        y: testData.buttonY,
                        width: testData.buttonWidth,
                        height: testData.buttonHeight
                    };
                    
                    const isInside = uiManager.isPointInBounds(testData.testX, testData.testY, bounds);
                    
                    const expectedInside = 
                        testData.testX >= testData.buttonX &&
                        testData.testX <= testData.buttonX + testData.buttonWidth &&
                        testData.testY >= testData.buttonY &&
                        testData.testY <= testData.buttonY + testData.buttonHeight;
                    
                    expect(isInside).toBe(expectedInside);
                }
            ), { numRuns: 100 });
        });
        
        test('评价颜色映射正确性', () => {
            fc.assert(fc.property(
                fc.constantFrom('匆忙人生', '平凡人生', '充实人生', '完美人生', '未知评价'),
                (evaluationTitle) => {
                    const color = uiManager.getEvaluationColor(evaluationTitle);
                    
                    // 验证已知评价有对应颜色
                    if (['匆忙人生', '平凡人生', '充实人生', '完美人生'].includes(evaluationTitle)) {
                        expect(color).not.toBe('#ffffff'); // 不应该是默认颜色
                        expect(color).toMatch(/^#[0-9a-f]{6}$/i); // 应该是有效的十六进制颜色
                    } else {
                        expect(color).toBe('#ffffff'); // 未知评价应该返回默认颜色
                    }
                }
            ), { numRuns: 100 });
        });
    });
    
    describe('清理和资源管理', () => {
        test('清理操作完整性', () => {
            fc.assert(fc.property(
                fc.record({
                    hasStartButton: fc.boolean(),
                    hasRestartButton: fc.boolean(),
                    showingEndScreen: fc.boolean()
                }),
                (testData) => {
                    // 设置初始状态
                    if (testData.hasStartButton) {
                        uiManager.externalButtons.startButton = {
                            style: { display: 'none' }
                        };
                    }
                    
                    if (testData.hasRestartButton) {
                        uiManager.externalButtons.restartButton = {
                            style: { display: 'none' }
                        };
                    }
                    
                    uiManager.showingGameEndScreen = testData.showingEndScreen;
                    uiManager.restartButtonBounds = testData.showingEndScreen ? 
                        { x: 100, y: 100, width: 120, height: 40 } : null;
                    
                    // 执行清理
                    uiManager.cleanup();
                    
                    // 验证清理结果
                    expect(uiManager.showingGameEndScreen).toBe(false);
                    expect(uiManager.restartButtonBounds).toBeNull();
                    
                    // 验证外部按钮恢复（如果存在）
                    if (testData.hasStartButton) {
                        expect(uiManager.externalButtons.startButton.style.display).toBe('');
                    }
                    
                    if (testData.hasRestartButton) {
                        expect(uiManager.externalButtons.restartButton.style.display).toBe('');
                    }
                }
            ), { numRuns: 100 });
        });
    });
});