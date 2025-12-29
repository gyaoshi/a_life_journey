/**
 * EvaluationSystem 属性测试
 * 需求: 19.1, 19.6
 */

const fc = require('fast-check');
const EvaluationSystem = require('../../src/core/EvaluationSystem');

describe('EvaluationSystem Property Tests', () => {
    let evaluationSystem;

    beforeEach(() => {
        evaluationSystem = new EvaluationSystem();
    });

    /**
     * **Feature: life-journey-game, Property 27: 详细评价显示**
     * 验证评价系统能够根据分数正确生成和显示详细评语
     */
    test('Property 27: 详细评价显示', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1, max: 50 }), // 总事件数
            fc.integer({ min: 0, max: 100 }), // 完成百分比
            (totalEvents, percentage) => {
                const completedEvents = Math.floor((percentage / 100) * totalEvents);
                const score = completedEvents * 10; // 简单分数计算
                const actualPercentage = Math.round((completedEvents / totalEvents) * 100);
                
                // 生成评价
                const evaluation = evaluationSystem.generateEvaluation(score, totalEvents, completedEvents);
                
                // 验证评价结构完整性
                expect(evaluation).toHaveProperty('score');
                expect(evaluation).toHaveProperty('percentage');
                expect(evaluation).toHaveProperty('title');
                expect(evaluation).toHaveProperty('description');
                expect(evaluation).toHaveProperty('highlights');
                expect(evaluation).toHaveProperty('summary');
                
                // 验证分数范围对应的评价标题
                if (actualPercentage >= 0 && actualPercentage <= 30) {
                    expect(evaluation.title).toBe('匆忙人生');
                    expect(evaluation.description).toBe('生活节奏太快，错过了很多美好时光');
                } else if (actualPercentage >= 31 && actualPercentage <= 60) {
                    expect(evaluation.title).toBe('平凡人生');
                    expect(evaluation.description).toBe('虽然平淡，但也有属于自己的精彩');
                } else if (actualPercentage >= 61 && actualPercentage <= 85) {
                    expect(evaluation.title).toBe('充实人生');
                    expect(evaluation.description).toBe('把握了大部分机会，活得很精彩');
                } else if (actualPercentage >= 86 && actualPercentage <= 100) {
                    expect(evaluation.title).toBe('完美人生');
                    expect(evaluation.description).toBe('几乎没有遗憾，真正活出了自己');
                }
                
                // 验证数据一致性
                expect(evaluation.score).toBe(score);
                expect(evaluation.percentage).toBe(actualPercentage);
                expect(evaluation.totalEvents).toBe(totalEvents);
                expect(evaluation.completedEvents).toBe(completedEvents);
                
                // 验证亮点数组不为空
                expect(Array.isArray(evaluation.highlights)).toBe(true);
                expect(evaluation.highlights.length).toBeGreaterThan(0);
                
                // 验证总结包含关键信息
                expect(evaluation.summary).toContain(completedEvents.toString());
                expect(evaluation.summary).toContain('个重要事件');
                
                return true;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: life-journey-game, Property 28: 评价完成后UI状态**
     * 验证评价显示完成后界面状态和重新开始功能正确
     */
    test('Property 28: 评价完成后UI状态', () => {
        fc.assert(fc.property(
            fc.integer({ min: 0, max: 100 }), // 完成百分比
            fc.integer({ min: 10, max: 30 }), // 总事件数
            fc.integer({ min: 400, max: 800 }), // Canvas宽度
            fc.integer({ min: 300, max: 600 }), // Canvas高度
            (percentage, totalEvents, canvasWidth, canvasHeight) => {
                const completedEvents = Math.floor((percentage / 100) * totalEvents);
                const score = completedEvents * 10;
                
                // 创建模拟Canvas上下文
                const mockCtx = {
                    fillStyle: '',
                    strokeStyle: '',
                    lineWidth: 0,
                    font: '',
                    textAlign: '',
                    fillRect: jest.fn(),
                    strokeRect: jest.fn(),
                    fillText: jest.fn(),
                    measureText: jest.fn(() => ({ width: 100 }))
                };
                
                // 生成评价
                const evaluation = evaluationSystem.generateEvaluation(score, totalEvents, completedEvents);
                
                // 初始状态检查
                expect(evaluationSystem.isEvaluationDisplaying()).toBe(false);
                
                // 显示评价
                evaluationSystem.displayEvaluation(mockCtx, canvasWidth, canvasHeight);
                
                // 验证显示状态
                expect(evaluationSystem.isEvaluationDisplaying()).toBe(true);
                expect(evaluationSystem.getCurrentEvaluation()).toEqual(evaluation);
                
                // 验证重新开始按钮存在
                expect(evaluationSystem.restartButton).toBeDefined();
                expect(evaluationSystem.restartButton).toHaveProperty('x');
                expect(evaluationSystem.restartButton).toHaveProperty('y');
                expect(evaluationSystem.restartButton).toHaveProperty('width');
                expect(evaluationSystem.restartButton).toHaveProperty('height');
                
                // 验证按钮位置在Canvas范围内
                expect(evaluationSystem.restartButton.x).toBeGreaterThanOrEqual(0);
                expect(evaluationSystem.restartButton.y).toBeGreaterThanOrEqual(0);
                expect(evaluationSystem.restartButton.x + evaluationSystem.restartButton.width).toBeLessThanOrEqual(canvasWidth);
                expect(evaluationSystem.restartButton.y + evaluationSystem.restartButton.height).toBeLessThanOrEqual(canvasHeight);
                
                // 测试按钮点击检测
                const buttonCenterX = evaluationSystem.restartButton.x + evaluationSystem.restartButton.width / 2;
                const buttonCenterY = evaluationSystem.restartButton.y + evaluationSystem.restartButton.height / 2;
                
                // 点击按钮中心应该返回true
                expect(evaluationSystem.checkRestartButtonClick(buttonCenterX, buttonCenterY)).toBe(true);
                
                // 点击按钮外部应该返回false
                expect(evaluationSystem.checkRestartButtonClick(0, 0)).toBe(false);
                expect(evaluationSystem.checkRestartButtonClick(canvasWidth, canvasHeight)).toBe(false);
                
                // 隐藏评价后状态检查
                evaluationSystem.hideEvaluation();
                expect(evaluationSystem.isEvaluationDisplaying()).toBe(false);
                expect(evaluationSystem.getCurrentEvaluation()).toBe(null);
                expect(evaluationSystem.restartButton).toBe(null);
                
                return true;
            }
        ), { numRuns: 100 });
    });

    // 边界值测试
    describe('边界值测试', () => {
        test('分数边界值测试', () => {
            // 测试0%
            let evaluation = evaluationSystem.generateEvaluation(0, 10, 0);
            expect(evaluation.title).toBe('匆忙人生');
            expect(evaluation.percentage).toBe(0);
            
            // 测试30%
            evaluation = evaluationSystem.generateEvaluation(30, 10, 3);
            expect(evaluation.title).toBe('匆忙人生');
            expect(evaluation.percentage).toBe(30);
            
            // 测试31%
            evaluation = evaluationSystem.generateEvaluation(31, 100, 31);
            expect(evaluation.title).toBe('平凡人生');
            expect(evaluation.percentage).toBe(31);
            
            // 测试60%
            evaluation = evaluationSystem.generateEvaluation(60, 10, 6);
            expect(evaluation.title).toBe('平凡人生');
            expect(evaluation.percentage).toBe(60);
            
            // 测试61%
            evaluation = evaluationSystem.generateEvaluation(61, 100, 61);
            expect(evaluation.title).toBe('充实人生');
            expect(evaluation.percentage).toBe(61);
            
            // 测试85%
            evaluation = evaluationSystem.generateEvaluation(85, 100, 85);
            expect(evaluation.title).toBe('充实人生');
            expect(evaluation.percentage).toBe(85);
            
            // 测试86%
            evaluation = evaluationSystem.generateEvaluation(86, 100, 86);
            expect(evaluation.title).toBe('完美人生');
            expect(evaluation.percentage).toBe(86);
            
            // 测试100%
            evaluation = evaluationSystem.generateEvaluation(100, 10, 10);
            expect(evaluation.title).toBe('完美人生');
            expect(evaluation.percentage).toBe(100);
        });

        test('Canvas尺寸边界测试', () => {
            const mockCtx = {
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 0,
                font: '',
                textAlign: '',
                fillRect: jest.fn(),
                strokeRect: jest.fn(),
                fillText: jest.fn(),
                measureText: jest.fn(() => ({ width: 50 }))
            };
            
            // 先生成评价数据
            evaluationSystem.generateEvaluation(50, 10, 5);
            
            // 测试最小Canvas尺寸
            evaluationSystem.displayEvaluation(mockCtx, 200, 150);
            expect(evaluationSystem.isEvaluationDisplaying()).toBe(true);
            
            evaluationSystem.hideEvaluation();
            
            // 重新生成评价数据（因为hideEvaluation会清除）
            evaluationSystem.generateEvaluation(50, 10, 5);
            
            // 测试大Canvas尺寸
            evaluationSystem.displayEvaluation(mockCtx, 1200, 800);
            expect(evaluationSystem.isEvaluationDisplaying()).toBe(true);
        });
    });
});