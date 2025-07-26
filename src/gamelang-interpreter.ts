import * as vscode from 'vscode';

export class GameLangInterpreter {
    private variables: { [key: string]: any } = {};
    private functions: { [key: string]: Function } = {};
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('GameLang Interpreter');
        this.initializeBuiltinFunctions();
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

    public async execute(code: string): Promise<void> {
        this.outputChannel.clear();
        this.outputChannel.show();
        this.outputChannel.appendLine('=== GameLang 代码执行 ===');
        this.outputChannel.appendLine('');

        const lines = code.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // 跳过空行和注释
            if (!line || line.startsWith('#')) {
                continue;
            }

            try {
                await this.executeLine(line, i + 1);
            } catch (error) {
                this.outputChannel.appendLine(`第${i + 1}行错误: ${error}`);
            }
        }

        this.outputChannel.appendLine('');
        this.outputChannel.appendLine('=== 执行完成 ===');
    }

    private async executeLine(line: string, lineNumber: number): Promise<void> {
        // 处理print语句
        if (line.match(/^(print|打印)\(/)) {
            const match = line.match(/(print|打印)\((.+)\)/);
            if (match) {
                const args = this.parseArguments(match[2]);
                const result = await this.callFunction('print', args);
                this.outputChannel.appendLine(`[输出] ${result}`);
            }
            return;
        }

        // 处理变量赋值
        if (line.includes('=') && !line.includes('==')) {
            const [varName, value] = line.split('=').map(s => s.trim());
            if (varName && value) {
                const evaluatedValue = this.evaluateExpression(value);
                this.variables[varName] = evaluatedValue;
                this.outputChannel.appendLine(`[变量] ${varName} = ${evaluatedValue}`);
            }
            return;
        }

        // 处理函数调用
        if (line.includes('(') && line.includes(')')) {
            const match = line.match(/(\w+)\s*\((.+)\)/);
            if (match) {
                const funcName = match[1];
                const args = this.parseArguments(match[2]);
                
                if (this.functions[funcName]) {
                    const result = await this.callFunction(funcName, args);
                    this.outputChannel.appendLine(`[函数] ${funcName}(${args.join(', ')}) = ${result}`);
                } else {
                    this.outputChannel.appendLine(`[警告] 未定义的函数: ${funcName}`);
                }
            }
            return;
        }

        // 处理其他语句
        this.outputChannel.appendLine(`[执行] ${line}`);
    }

    private parseArguments(argsString: string): any[] {
        // 简单的参数解析
        const args: any[] = [];
        let current = '';
        let inString = false;
        let quoteChar = '';

        for (let i = 0; i < argsString.length; i++) {
            const char = argsString[i];
            
            if ((char === '"' || char === "'") && !inString) {
                inString = true;
                quoteChar = char;
                continue;
            }
            
            if (char === quoteChar && inString) {
                inString = false;
                args.push(current);
                current = '';
                continue;
            }
            
            if (char === ',' && !inString) {
                if (current.trim()) {
                    args.push(this.evaluateExpression(current.trim()));
                }
                current = '';
                continue;
            }
            
            current += char;
        }
        
        if (current.trim()) {
            args.push(this.evaluateExpression(current.trim()));
        }
        
        return args;
    }

    private evaluateExpression(expr: string): any {
        expr = expr.trim();
        
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
        if (expr === 'true' || expr === 'True') return true;
        if (expr === 'false' || expr === 'False') return false;
        
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
                throw new Error(`函数 ${funcName} 执行错误: ${error}`);
            }
        }
        throw new Error(`未定义的函数: ${funcName}`);
    }
} 