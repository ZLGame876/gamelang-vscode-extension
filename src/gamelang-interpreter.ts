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
            if (Array.isArray(obj)) return 'array';
            if (obj === null) return 'null';
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

        // ===== 新增：数组/列表操作函数 =====
        
        // 创建数组
        this.functions['array'] = (...args: any[]) => args;
        this.functions['数组'] = this.functions['array'];
        this.functions['list'] = (...args: any[]) => args;
        this.functions['列表'] = this.functions['list'];

        // 数组操作
        this.functions['push'] = (arr: any[], ...items: any[]) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是数组');
                return arr;
            }
            arr.push(...items);
            return arr;
        };
        this.functions['添加'] = this.functions['push'];
        this.functions['append'] = this.functions['push'];
        this.functions['追加'] = this.functions['push'];

        this.functions['pop'] = (arr: any[]) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 参数必须是数组');
                return undefined;
            }
            return arr.pop();
        };
        this.functions['移除'] = this.functions['pop'];
        this.functions['删除'] = this.functions['pop'];

        this.functions['insert'] = (arr: any[], index: number, item: any) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是数组');
                return arr;
            }
            arr.splice(index, 0, item);
            return arr;
        };
        this.functions['插入'] = this.functions['insert'];

        this.functions['remove'] = (arr: any[], item: any) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是数组');
                return arr;
            }
            const index = arr.indexOf(item);
            if (index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        };
        this.functions['移除元素'] = this.functions['remove'];

        this.functions['index'] = (arr: any[], item: any) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是数组');
                return -1;
            }
            return arr.indexOf(item);
        };
        this.functions['索引'] = this.functions['index'];

        this.functions['sort'] = (arr: any[]) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 参数必须是数组');
                return arr;
            }
            return [...arr].sort();
        };
        this.functions['排序'] = this.functions['sort'];

        this.functions['reverse'] = (arr: any[]) => {
            if (!Array.isArray(arr)) {
                this.outputChannel.appendLine('❌ 错误: 参数必须是数组');
                return arr;
            }
            return [...arr].reverse();
        };
        this.functions['反转'] = this.functions['reverse'];

        // ===== 新增：字典/映射操作函数 =====
        
        // 创建字典
        this.functions['dict'] = () => ({});
        this.functions['字典'] = this.functions['dict'];
        this.functions['map'] = () => ({});
        this.functions['映射'] = this.functions['map'];

        // 字典操作
        this.functions['set'] = (dict: any, key: string, value: any) => {
            if (typeof dict !== 'object' || dict === null) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是字典');
                return dict;
            }
            dict[key] = value;
            return dict;
        };
        this.functions['设置'] = this.functions['set'];

        this.functions['get'] = (dict: any, key: string, defaultValue?: any) => {
            if (typeof dict !== 'object' || dict === null) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是字典');
                return defaultValue;
            }
            return dict.hasOwnProperty(key) ? dict[key] : defaultValue;
        };
        this.functions['获取'] = this.functions['get'];

        this.functions['delete'] = (dict: any, key: string) => {
            if (typeof dict !== 'object' || dict === null) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是字典');
                return false;
            }
            if (dict.hasOwnProperty(key)) {
                delete dict[key];
                return true;
            }
            return false;
        };
        this.functions['删除键'] = this.functions['delete'];

        this.functions['keys'] = (dict: any) => {
            if (typeof dict !== 'object' || dict === null) {
                this.outputChannel.appendLine('❌ 错误: 参数必须是字典');
                return [];
            }
            return Object.keys(dict);
        };
        this.functions['键列表'] = this.functions['keys'];

        this.functions['values'] = (dict: any) => {
            if (typeof dict !== 'object' || dict === null) {
                this.outputChannel.appendLine('❌ 错误: 参数必须是字典');
                return [];
            }
            return Object.values(dict);
        };
        this.functions['值列表'] = this.functions['values'];

        this.functions['has'] = (dict: any, key: string) => {
            if (typeof dict !== 'object' || dict === null) {
                this.outputChannel.appendLine('❌ 错误: 第一个参数必须是字典');
                return false;
            }
            return dict.hasOwnProperty(key);
        };
        this.functions['包含'] = this.functions['has'];
        this.functions['存在'] = this.functions['has'];

        // ===== 新增：错误处理相关函数 =====
        
        // 抛出异常
        this.functions['throw'] = (message: string) => {
            throw new Error(message);
        };
        this.functions['抛出'] = this.functions['throw'];
        this.functions['异常'] = this.functions['throw'];

        // 断言
        this.functions['assert'] = (condition: any, message?: string) => {
            if (!condition) {
                const errorMessage = message || '断言失败';
                throw new Error(`断言错误: ${errorMessage}`);
            }
        };
        this.functions['断言'] = this.functions['assert'];

        // 检查是否为数字
        this.functions['isNumber'] = (value: any) => {
            return typeof value === 'number' && !isNaN(value);
        };
        this.functions['是数字'] = this.functions['isNumber'];

        // 检查是否为字符串
        this.functions['isString'] = (value: any) => {
            return typeof value === 'string';
        };
        this.functions['是字符串'] = this.functions['isString'];

        // 检查是否为数组
        this.functions['isArray'] = (value: any) => {
            return Array.isArray(value);
        };
        this.functions['是数组'] = this.functions['isArray'];

        // 检查是否为对象
        this.functions['isObject'] = (value: any) => {
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        };
        this.functions['是对象'] = this.functions['isObject'];

        // 检查是否为空
        this.functions['isEmpty'] = (value: any) => {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string') return value.length === 0;
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === 'object') return Object.keys(value).length === 0;
            return false;
        };
        this.functions['为空'] = this.functions['isEmpty'];

        // 安全除法（避免除零错误）
        this.functions['safeDivide'] = (a: number, b: number, defaultValue?: number) => {
            if (b === 0) {
                if (defaultValue !== undefined) {
                    return defaultValue;
                }
                throw new Error('除零错误');
            }
            return a / b;
        };
        this.functions['安全除法'] = this.functions['safeDivide'];

        // 安全数组访问
        this.functions['safeGet'] = (arr: any[], index: number, defaultValue?: any) => {
            if (!Array.isArray(arr)) {
                throw new Error('第一个参数必须是数组');
            }
            if (index < 0 || index >= arr.length) {
                return defaultValue;
            }
            return arr[index];
        };
        this.functions['安全获取'] = this.functions['safeGet'];

        // 安全字典访问
        this.functions['safeGetDict'] = (dict: any, key: string, defaultValue?: any) => {
            if (typeof dict !== 'object' || dict === null) {
                throw new Error('第一个参数必须是字典');
            }
            return dict.hasOwnProperty(key) ? dict[key] : defaultValue;
        };
        this.functions['安全获取字典'] = this.functions['safeGetDict'];
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

        await this.executeLines(lines);
        this.outputChannel.appendLine('\n=== 执行完成 ===');
    }

    private async executeLines(lines: string[]): Promise<void> {
        let i = 0;
        while (i < lines.length) {
            const line = lines[i].trim();
            
            if (!line || line.startsWith('#')) {
                i++;
                continue;
            }

            // 处理try-catch-finally块
            if (line.startsWith('try') || line.startsWith('尝试')) {
                i = await this.executeTryCatchBlock(lines, i);
            } else {
                await this.executeLine(line, i + 1);
                i++;
            }
        }
    }

    private async executeTryCatchBlock(lines: string[], startIndex: number): Promise<number> {
        const tryStart = startIndex;
        let tryEnd = startIndex;
        let catchStart = -1;
        let catchEnd = -1;
        let finallyStart = -1;
        let finallyEnd = -1;
        
        let braceCount = 0;
        let inTryBlock = false;
        let inCatchBlock = false;
        let inFinallyBlock = false;

        // 解析try-catch-finally结构
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('try') || line.startsWith('尝试')) {
                inTryBlock = true;
                // tryStart = i; // 移除这行，因为tryStart已经是常量
                continue;
            }
            
            if (line.startsWith('catch') || line.startsWith('捕获')) {
                if (inTryBlock) {
                    tryEnd = i - 1;
                    inTryBlock = false;
                }
                inCatchBlock = true;
                catchStart = i;
                continue;
            }
            
            if (line.startsWith('finally') || line.startsWith('最终')) {
                if (inCatchBlock) {
                    catchEnd = i - 1;
                    inCatchBlock = false;
                } else if (inTryBlock) {
                    tryEnd = i - 1;
                    inTryBlock = false;
                }
                inFinallyBlock = true;
                finallyStart = i;
                continue;
            }

            // 计算花括号
            if (line.includes('{')) {
                braceCount += (line.match(/\{/g) || []).length;
            }
            if (line.includes('}')) {
                braceCount -= (line.match(/\}/g) || []).length;
            }

            // 如果花括号计数为0，说明块结束
            if (braceCount === 0 && (inTryBlock || inCatchBlock || inFinallyBlock)) {
                if (inTryBlock) {
                    tryEnd = i;
                    inTryBlock = false;
                } else if (inCatchBlock) {
                    catchEnd = i;
                    inCatchBlock = false;
                } else if (inFinallyBlock) {
                    finallyEnd = i;
                    inFinallyBlock = false;
                    break;
                }
            }
        }

        // 执行try块
        let error = null;
        try {
            this.outputChannel.appendLine(`[错误处理] 执行try块 (第${tryStart + 1}-${tryEnd + 1}行)`);
            for (let i = tryStart + 1; i <= tryEnd; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#')) {
                    await this.executeLine(line, i + 1);
                }
            }
        } catch (err) {
            error = err;
            this.outputChannel.appendLine(`[错误处理] try块发生异常: ${err}`);
        }

        // 执行catch块
        if (error && catchStart >= 0) {
            this.outputChannel.appendLine(`[错误处理] 执行catch块 (第${catchStart + 1}-${catchEnd + 1}行)`);
            // 将错误信息存储到变量中
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.variables['error'] = errorMessage;
            this.variables['异常'] = errorMessage;
            
            for (let i = catchStart + 1; i <= catchEnd; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#')) {
                    await this.executeLine(line, i + 1);
                }
            }
        }

        // 执行finally块
        if (finallyStart >= 0) {
            this.outputChannel.appendLine(`[错误处理] 执行finally块 (第${finallyStart + 1}-${finallyEnd + 1}行)`);
            for (let i = finallyStart + 1; i <= finallyEnd; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#')) {
                    await this.executeLine(line, i + 1);
                }
            }
        }

        return finallyEnd >= 0 ? finallyEnd + 1 : (catchEnd >= 0 ? catchEnd + 1 : tryEnd + 1);
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
        
        // 数组字面量 [1, 2, 3]
        if (expr.startsWith('[') && expr.endsWith(']')) {
            const content = expr.slice(1, -1).trim();
            if (!content) return [];
            
            const elements: any[] = [];
            let current = '';
            let inString = false;
            let stringChar = '';
            let parenCount = 0;
            let braceCount = 0;
            
            for (let i = 0; i < content.length; i++) {
                const char = content[i];
                
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
                } else if (!inString && char === '[') {
                    braceCount++;
                    current += char;
                } else if (!inString && char === ']') {
                    braceCount--;
                    current += char;
                } else if (!inString && parenCount === 0 && braceCount === 0 && char === ',') {
                    elements.push(this.evaluateExpression(current.trim()));
                    current = '';
                } else {
                    current += char;
                }
            }
            
            if (current.trim()) {
                elements.push(this.evaluateExpression(current.trim()));
            }
            
            return elements;
        }
        
        // 字典字面量 {"key": "value", "key2": "value2"}
        if (expr.startsWith('{') && expr.endsWith('}')) {
            const content = expr.slice(1, -1).trim();
            if (!content) return {};
            
            const dict: { [key: string]: any } = {};
            let current = '';
            let inString = false;
            let stringChar = '';
            let parenCount = 0;
            let braceCount = 0;
            let expectingValue = false;
            let currentKey = '';
            
            for (let i = 0; i < content.length; i++) {
                const char = content[i];
                
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
                } else if (!inString && char === '[') {
                    braceCount++;
                    current += char;
                } else if (!inString && char === ']') {
                    braceCount--;
                    current += char;
                } else if (!inString && char === ':') {
                    currentKey = current.trim();
                    current = '';
                    expectingValue = true;
                } else if (!inString && parenCount === 0 && braceCount === 0 && char === ',') {
                    if (expectingValue && currentKey) {
                        dict[currentKey] = this.evaluateExpression(current.trim());
                        currentKey = '';
                        expectingValue = false;
                    }
                    current = '';
                } else {
                    current += char;
                }
            }
            
            if (expectingValue && currentKey && current.trim()) {
                dict[currentKey] = this.evaluateExpression(current.trim());
            }
            
            return dict;
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
        
        // null值
        if (expr === 'null' || expr === '空') {
            return null;
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