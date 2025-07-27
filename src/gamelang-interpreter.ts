import * as vscode from 'vscode';

export class GameLangInterpreter {
    private variables: { [key: string]: any } = {};
    private functions: { [key: string]: Function } = {};
    private outputChannel: vscode.OutputChannel;
    private modules: { [key: string]: any } = {};
    private importedModules: Set<string> = new Set();

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('GameLang Interpreter');
        this.initializeBuiltinFunctions();
        this.initializeGameModule();
    }

    private initializeBuiltinFunctions() {
        // 内置print函数
        this.functions['print'] = (...args: any[]) => {
            const output = args.map(arg => String(arg)).join(' ');
            this.outputChannel.appendLine(output);
            return output;
        };

        this.functions['打印'] = this.functions['print'];

        // 内置input函数
        this.functions['input'] = async (prompt: string) => {
            const input = await vscode.window.showInputBox({
                prompt: prompt
            });
            return input || '';
        };

        this.functions['输入'] = this.functions['input'];

        // 内置len函数
        this.functions['len'] = (obj: any) => {
            if (Array.isArray(obj) || typeof obj === 'string') {
                return obj.length;
            }
            return 0;
        };

        this.functions['长度'] = this.functions['len'];

        // 内置type函数
        this.functions['type'] = (obj: any) => {
            return typeof obj;
        };

        this.functions['类型'] = this.functions['type'];

        // 内置数学函数
        this.functions['abs'] = Math.abs;
        this.functions['绝对值'] = Math.abs;
        this.functions['max'] = Math.max;
        this.functions['最大值'] = Math.max;
        this.functions['min'] = Math.min;
        this.functions['最小值'] = Math.min;
        this.functions['round'] = Math.round;
        this.functions['四舍五入'] = Math.round;

        // 内置随机函数
        this.functions['random'] = () => Math.random();
        this.functions['随机小数'] = () => Math.random();
        this.functions['randint'] = (min: number, max: number) => 
            Math.floor(Math.random() * (max - min + 1)) + min;
        this.functions['随机整数'] = this.functions['randint'];

        // 内置时间函数
        this.functions['now'] = () => new Date().toLocaleString();
        this.functions['现在时间'] = this.functions['now'];
        this.functions['sleep'] = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));
        this.functions['暂停'] = this.functions['sleep'];
    }

    private initializeGameModule() {
        // 游戏开发模块
        const gameModule = {
            // 游戏创建
            '创建游戏': (config: any) => {
                const game = {
                    size: config.大小 || '10x10',
                    mines: config.地雷数 || 10,
                    board: [],
                    revealed: [],
                    flagged: [],
                    gameOver: false,
                    victory: false
                };
                this.outputChannel.appendLine(`[游戏] 创建游戏: ${game.size}, 地雷数: ${game.mines}`);
                return game;
            },

            // 游戏对象方法
            '有地雷': (game: any, position: any) => {
                this.outputChannel.appendLine(`[游戏] 检查位置 ${position} 是否有地雷`);
                return Math.random() > 0.8; // 模拟地雷检查
            },

            '计算附近地雷数': (game: any, position: any) => {
                this.outputChannel.appendLine(`[游戏] 计算位置 ${position} 附近地雷数`);
                return Math.floor(Math.random() * 9); // 模拟地雷计数
            },

            '显示格子': (game: any, position: any, number: any) => {
                this.outputChannel.appendLine(`[游戏] 显示格子 ${position}, 数字: ${number}`);
            },

            '切换标记': (game: any, position: any) => {
                this.outputChannel.appendLine(`[游戏] 切换位置 ${position} 的标记`);
            },

            '未揭开': (game: any, position: any) => {
                this.outputChannel.appendLine(`[游戏] 检查位置 ${position} 是否未揭开`);
                return Math.random() > 0.5;
            },

            '胜利': (game: any) => {
                this.outputChannel.appendLine(`[游戏] 检查是否胜利`);
                return Math.random() > 0.7;
            },

            // 游戏控制
            '游戏结束': (reason: string) => {
                this.outputChannel.appendLine(`[游戏] 游戏结束: ${reason}`);
            },

            '显示游戏窗口': (game: any) => {
                this.outputChannel.appendLine(`[游戏] 显示游戏窗口`);
            },

            // 事件系统
            '当': (eventName: string, callback: Function) => {
                this.outputChannel.appendLine(`[事件] 注册事件监听器: ${eventName}`);
                this.functions.set(eventName, callback);
            },

            // 条件判断
            '若': (condition: any, callback: Function) => {
                if (condition) {
                    callback();
                }
            },

            '否则': (callback: Function) => {
                callback();
            },

            // 循环
            '遍历': (items: any[], callback: Function) => {
                for (const item of items) {
                    callback(item);
                }
            },

            // 对象属性访问
            '邻居': (position: any) => {
                return ['上', '下', '左', '右', '左上', '右上', '左下', '右下'];
            }
        };

        this.modules['game'] = gameModule;
    }

    public async execute(code: string): Promise<void> {
        this.outputChannel.show();
        this.outputChannel.clear();
        this.outputChannel.appendLine('=== GameLang 代码执行 ===');
        this.outputChannel.appendLine(`代码长度: ${code.length} 字符\n`);

        const lines = code.split('\n');
        this.outputChannel.appendLine(`总行数: ${lines.length}\n`);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#')) {
                await this.executeLine(line, i + 1);
            } else {
                this.outputChannel.appendLine(`[跳过] 第${i + 1}行: ${line}`);
            }
        }

        this.outputChannel.appendLine('\n=== 执行完成 ===');
    }

    private async executeLine(line: string, lineNumber: number): Promise<void> {
        line = line.trim();
        
        // 跳过空行和注释
        if (!line || line.startsWith('#')) {
            return;
        }

        // 处理import语句
        if (line.startsWith('import ')) {
            const moduleName = line.replace('import ', '').replace(';', '').trim();
            if (this.modules[moduleName]) {
                this.importedModules.add(moduleName);
                const module = this.modules[moduleName];
                // 将模块中的函数添加到全局函数表
                for (const [funcName, func] of Object.entries(module)) {
                    this.functions[funcName] = func as Function;
                }
                this.outputChannel.appendLine(`[导入] 成功导入模块: ${moduleName}`);
            } else {
                this.outputChannel.appendLine(`[错误] 模块不存在: ${moduleName}`);
            }
            return;
        }

        // 处理函数定义
        if (line.match(/^fn\s+\w+\s*\([^)]*\)\s*:/) || line.match(/^函数\s+\w+\s*\([^)]*\)\s*:/)) {
            this.outputChannel.appendLine(`[函数定义] ${line}`);
            return;
        }

        // 处理事件定义 (当...)
        if (line.match(/^当\s+\w+\s*\([^)]*\)\s*\{/)) {
            this.outputChannel.appendLine(`[事件定义] ${line}`);
            return;
        }

        // 处理变量赋值
        if (line.includes('=')) {
            const [varName, value] = line.split('=').map(s => s.trim());
            const evaluatedValue = this.evaluateExpression(value);
            this.variables[varName] = evaluatedValue;
            this.outputChannel.appendLine(`[变量] ${varName} = ${evaluatedValue}`);
            return;
        }

        // 处理函数调用
        if (line.includes('(') && line.includes(')')) {
            const funcName = line.substring(0, line.indexOf('(')).trim();
            const argsStr = line.substring(line.indexOf('(') + 1, line.lastIndexOf(')'));
            const args = this.parseArguments(argsStr);
            
            if (this.functions[funcName]) {
                const func = this.functions[funcName];
                try {
                    const result = await func(...args);
                    this.outputChannel.appendLine(`[函数] ${funcName}(${args.join(', ')}) = ${result}`);
                } catch (error) {
                    this.outputChannel.appendLine(`[错误] 函数调用失败: ${error}`);
                }
            } else {
                this.outputChannel.appendLine(`[错误] 未定义的函数: ${funcName}`);
            }
            return;
        }

        // 处理其他表达式
        try {
            const result = this.evaluateExpression(line);
            if (result !== undefined) {
                this.outputChannel.appendLine(`[输出] ${result}`);
            }
        } catch (error) {
            this.outputChannel.appendLine(`[错误] 第${lineNumber}行: ${error}`);
        }
    }

    private parseArguments(argsStr: string): any[] {
        if (!argsStr.trim()) return [];
        
        const args: any[] = [];
        let current = '';
        let inString = false;
        let stringChar = '';
        let parenCount = 0;
        
        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];
            
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                current += char;
            } else if (inString && char === stringChar) {
                inString = false;
                current += char;
            } else if (!inString && char === '(') {
                parenCount++;
                current += char;
            } else if (!inString && char === ')') {
                parenCount--;
                current += char;
            } else if (!inString && parenCount === 0 && char === ',') {
                args.push(this.evaluateExpression(current.trim()));
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            args.push(this.evaluateExpression(current.trim()));
        }
        
        return args;
    }

    private evaluateExpression(expr: string): any {
        expr = expr.trim();
        
        // 处理字符串拼接
        if (expr.includes('+')) {
            const parts = expr.split('+').map(part => part.trim());
            const evaluatedParts = parts.map(part => this.evaluateExpression(part));
            return evaluatedParts.join('');
        }
        
        // 字符串
        if ((expr.startsWith('"') && expr.endsWith('"')) || 
            (expr.startsWith("'") && expr.endsWith("'"))) {
            return expr.slice(1, -1);
        }
        
        // 数字
        if (!isNaN(Number(expr))) {
            return Number(expr);
        }
        
        // 布尔值
        if (expr === 'true' || expr === 'false') {
            return expr === 'true';
        }
        
        // 变量
        if (this.variables[expr] !== undefined) {
            return this.variables[expr];
        }
        
        return expr;
    }

    private async callFunction(funcName: string, args: any[]): Promise<any> {
        const func = this.functions[funcName];
        if (func) {
            try {
                return await func(...args);
            } catch (error) {
                throw new Error(`函数执行错误: ${error}`);
            }
        } else {
            throw new Error(`未定义的函数: ${funcName}`);
        }
    }
} 