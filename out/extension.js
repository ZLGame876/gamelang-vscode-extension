"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const debugger_1 = require("./debugger");
function activate(context) {
    console.log('GameLang extension is now active!');
    // 显示激活消息
    vscode.window.showInformationMessage('GameLang扩展已激活！搜索功能快捷键：Cmd+U');
    // 内置函数数据库
    const builtinFunctions = {
        'print': {
            description: '打印输出，支持多参数',
            syntax: 'print(值1, 值2, ...)',
            example: 'print("Hello", "World")',
            keywords: ['打印', '输出', '显示', 'print']
        },
        'input': {
            description: '获取用户输入',
            syntax: 'input(提示)',
            example: 'name = input("请输入姓名：")',
            keywords: ['输入', '获取', '读取', 'input']
        },
        'len': {
            description: '获取列表、字符串等长度',
            syntax: 'len(对象)',
            example: 'length = len([1, 2, 3])',
            keywords: ['长度', '大小', '数量', 'len']
        },
        'type': {
            description: '获取变量类型',
            syntax: 'type(变量)',
            example: 'var_type = type(name)',
            keywords: ['类型', '种类', 'type']
        },
        'str': {
            description: '转换为字符串',
            syntax: 'str(值)',
            example: 'text = str(123)',
            keywords: ['字符串', '文本', 'str']
        },
        'int': {
            description: '转换为整数',
            syntax: 'int(值)',
            example: 'number = int("123")',
            keywords: ['整数', '数字', 'int']
        },
        'float': {
            description: '转换为浮点数',
            syntax: 'float(值)',
            example: 'decimal = float("3.14")',
            keywords: ['浮点', '小数', 'float']
        },
        'bool': {
            description: '转换为布尔值',
            syntax: 'bool(值)',
            example: 'is_true = bool(1)',
            keywords: ['布尔', '真假', 'bool']
        },
        'abs': {
            description: '获取绝对值',
            syntax: 'abs(数值)',
            example: 'result = abs(-5)',
            keywords: ['绝对值', '绝对', 'abs']
        },
        'max': {
            description: '获取最大值',
            syntax: 'max(值1, 值2, ...)',
            example: 'maximum = max(1, 2, 3)',
            keywords: ['最大', '最大值', 'max']
        },
        'min': {
            description: '获取最小值',
            syntax: 'min(值1, 值2, ...)',
            example: 'minimum = min(1, 2, 3)',
            keywords: ['最小', '最小值', 'min']
        },
        'round': {
            description: '四舍五入',
            syntax: 'round(数值)',
            example: 'rounded = round(3.6)',
            keywords: ['四舍五入', '取整', 'round']
        },
        'random': {
            description: '生成0-1随机小数',
            syntax: 'random()',
            example: 'rand = random()',
            keywords: ['随机', '随机数', 'random']
        },
        'randint': {
            description: '生成指定范围随机整数',
            syntax: 'randint(最小值, 最大值)',
            example: 'rand_num = randint(1, 10)',
            keywords: ['随机整数', '随机数', 'randint']
        },
        'now': {
            description: '获取当前时间',
            syntax: 'now()',
            example: 'current_time = now()',
            keywords: ['时间', '当前时间', '现在', 'now']
        },
        'sleep': {
            description: '暂停执行指定秒数',
            syntax: 'sleep(秒数)',
            example: 'sleep(1)',
            keywords: ['暂停', '等待', '延时', 'sleep']
        },
        'search_builtin': {
            description: '搜索内置函数',
            syntax: 'search_builtin(关键词)',
            example: 'search_builtin("print")',
            keywords: ['搜索', '查找', '内置函数', 'search']
        },
        'ai_ask': {
            description: 'AI问答功能',
            syntax: 'ai_ask(问题)',
            example: 'ai_ask("什么是GameLang？")',
            keywords: ['AI', '人工智能', '问答', 'ai']
        },
        'list': {
            description: '创建列表',
            syntax: 'list(可迭代对象)',
            example: 'my_list = list([1, 2, 3])',
            keywords: ['列表', '数组', 'list']
        },
        'dict': {
            description: '创建字典',
            syntax: 'dict(键值对)',
            example: 'my_dict = dict(name="张三", age=18)',
            keywords: ['字典', '映射', 'dict']
        },
        'set': {
            description: '创建集合',
            syntax: 'set(可迭代对象)',
            example: 'my_set = set([1, 2, 3])',
            keywords: ['集合', 'set']
        },
        'sum': {
            description: '计算总和',
            syntax: 'sum(可迭代对象)',
            example: 'total = sum([1, 2, 3, 4, 5])',
            keywords: ['总和', '求和', 'sum']
        },
        'sorted': {
            description: '排序',
            syntax: 'sorted(可迭代对象)',
            example: 'sorted_list = sorted([3, 1, 4, 1, 5])',
            keywords: ['排序', 'sorted']
        },
        'reversed': {
            description: '反转',
            syntax: 'reversed(可迭代对象)',
            example: 'reversed_list = list(reversed([1, 2, 3]))',
            keywords: ['反转', '倒序', 'reversed']
        },
        'enumerate': {
            description: '枚举',
            syntax: 'enumerate(可迭代对象)',
            example: 'for i, item in enumerate(["a", "b", "c"]):',
            keywords: ['枚举', 'enumerate']
        },
        'range': {
            description: '生成数字序列',
            syntax: 'range(开始, 结束, 步长)',
            example: 'for i in range(0, 10, 2):',
            keywords: ['范围', '序列', 'range']
        },
        'open': {
            description: '打开文件',
            syntax: 'open(文件名, 模式)',
            example: 'file = open("test.txt", "r")',
            keywords: ['文件', '打开', 'open']
        },
        'read': {
            description: '读取文件内容',
            syntax: 'read()',
            example: 'content = file.read()',
            keywords: ['读取', 'read']
        },
        'write': {
            description: '写入文件',
            syntax: 'write(内容)',
            example: 'file.write("Hello World")',
            keywords: ['写入', 'write']
        },
        'close': {
            description: '关闭文件',
            syntax: 'close()',
            example: 'file.close()',
            keywords: ['关闭', 'close']
        }
    };
    // 注册搜索命令
    let searchCommand = vscode.commands.registerCommand('gamelang.searchBuiltin', async () => {
        const searchTerm = await vscode.window.showInputBox({
            prompt: '请输入要搜索的GameLang内置函数',
            placeHolder: '例如: print, input, len, 随机, 打印...'
        });
        if (searchTerm) {
            try {
                // 简化的搜索逻辑
                const searchLower = searchTerm.toLowerCase();
                const matches = Object.keys(builtinFunctions).filter(func => {
                    const funcInfo = builtinFunctions[func];
                    // 检查函数名
                    if (func.toLowerCase().includes(searchLower))
                        return true;
                    // 检查描述
                    if (funcInfo.description.toLowerCase().includes(searchLower))
                        return true;
                    // 检查关键词
                    if (funcInfo.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)))
                        return true;
                    return false;
                });
                if (matches.length > 0) {
                    // 创建输出面板
                    const output = vscode.window.createOutputChannel('GameLang Search');
                    output.clear();
                    output.appendLine(`搜索 "${searchTerm}" 的结果:`);
                    output.appendLine('');
                    matches.forEach(func => {
                        const funcInfo = builtinFunctions[func];
                        output.appendLine(`📋 ${func}`);
                        output.appendLine(`   描述: ${funcInfo.description}`);
                        output.appendLine(`   语法: ${funcInfo.syntax}`);
                        output.appendLine(`   示例: ${funcInfo.example}`);
                        output.appendLine('');
                    });
                    output.show();
                    vscode.window.showInformationMessage(`找到 ${matches.length} 个匹配的函数`);
                }
                else {
                    vscode.window.showWarningMessage(`未找到包含 "${searchTerm}" 的内置函数`);
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`搜索失败: ${error}`);
            }
        }
    });
    // 注册调试配置提供者
    const debugProvider = vscode.debug.registerDebugConfigurationProvider('gamelang', {
        provideDebugConfigurations(folder, token) {
            return [
                {
                    name: 'Launch GameLang File',
                    type: 'gamelang',
                    request: 'launch',
                    program: '${file}',
                    console: 'integratedTerminal'
                },
                {
                    name: 'Attach to GameLang Process',
                    type: 'gamelang',
                    request: 'attach',
                    processId: '${command:pickProcess}'
                }
            ];
        }
    });
    // 注册调试适配器工厂
    const debugAdapterFactory = vscode.debug.registerDebugAdapterDescriptorFactory('gamelang', {
        createDebugAdapterDescriptor(session, executable) {
            return new vscode.DebugAdapterInlineImplementation(new debugger_1.GameLangDebugAdapter());
        }
    });
    // 注册代码补全提供者
    const completionProvider = vscode.languages.registerCompletionItemProvider('gamelang', {
        provideCompletionItems(document, position, token, context) {
            const completions = [];
            // 内置函数
            Object.keys(builtinFunctions).forEach(func => {
                const funcInfo = builtinFunctions[func];
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = `GameLang Built-in: ${funcInfo.description}`;
                item.documentation = new vscode.MarkdownString(`**${func}**\n\n${funcInfo.description}\n\n**语法:** ${funcInfo.syntax}\n\n**示例:** ${funcInfo.example}`);
                completions.push(item);
            });
            // 关键字
            const keywords = ['fn', 'class', 'if', 'elif', 'else', 'while', 'for', 'return', 'import', 'use'];
            keywords.forEach(keyword => {
                const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                item.detail = 'GameLang Keyword';
                completions.push(item);
            });
            return completions;
        }
    }, '.');
    // 注册悬浮提示提供者
    const hoverProvider = vscode.languages.registerHoverProvider('gamelang', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return null;
            const word = document.getText(range);
            // 检查是否是内置函数
            if (builtinFunctions[word]) {
                const funcInfo = builtinFunctions[word];
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown(`**${word}** - GameLang内置函数\n\n`);
                markdown.appendMarkdown(`**描述:** ${funcInfo.description}\n\n`);
                markdown.appendMarkdown(`**语法:** \`${funcInfo.syntax}\`\n\n`);
                markdown.appendMarkdown(`**示例:** \`${funcInfo.example}\``);
                return new vscode.Hover(markdown, range);
            }
            return null;
        }
    });
    // 注册代码格式化提供者
    const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('gamelang', {
        provideDocumentFormattingEdits(document, options, token) {
            const edits = [];
            const text = document.getText();
            const lines = text.split('\n');
            let currentIndentLevel = 0;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    // 检查是否是结束语句（减少缩进）
                    if (trimmedLine.startsWith('else:') || trimmedLine.startsWith('elif ')) {
                        currentIndentLevel = Math.max(0, currentIndentLevel - 1);
                    }
                    // 计算当前行的缩进
                    let lineIndentLevel = currentIndentLevel;
                    // 检查是否是开始语句（下一行需要增加缩进）
                    if (trimmedLine.endsWith(':') && !trimmedLine.startsWith('#')) {
                        // 这是开始语句，当前行不缩进，但下一行会缩进
                        lineIndentLevel = currentIndentLevel;
                        currentIndentLevel += 1;
                    }
                    else if (trimmedLine.startsWith('else:') || trimmedLine.startsWith('elif ')) {
                        // else/elif 语句与对应的 if 语句同级
                        lineIndentLevel = currentIndentLevel;
                    }
                    else if (trimmedLine.startsWith('return ') || trimmedLine.startsWith('print ') ||
                        trimmedLine.startsWith('break') || trimmedLine.startsWith('continue') ||
                        trimmedLine.startsWith('import ') || trimmedLine.startsWith('use ')) {
                        // 这些语句在函数/类内部，需要缩进
                        lineIndentLevel = currentIndentLevel;
                    }
                    else if (trimmedLine.startsWith('fn ') || trimmedLine.startsWith('class ')) {
                        // 函数和类定义在顶层
                        currentIndentLevel = 0;
                        lineIndentLevel = 0;
                    }
                    else if (trimmedLine.startsWith('if ') || trimmedLine.startsWith('while ') ||
                        trimmedLine.startsWith('for ')) {
                        // 控制语句在顶层
                        lineIndentLevel = currentIndentLevel;
                    }
                    else {
                        // 其他语句（变量赋值等）
                        lineIndentLevel = currentIndentLevel;
                    }
                    const newIndent = '    '.repeat(lineIndentLevel);
                    const newLine = newIndent + trimmedLine;
                    if (newLine !== line) {
                        const range = new vscode.Range(i, 0, i, line.length);
                        edits.push(vscode.TextEdit.replace(range, newLine));
                    }
                }
                else {
                    // 空行，重置缩进
                    currentIndentLevel = 0;
                }
            }
            return edits;
        }
    });
    // 注册语法诊断
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('gamelang');
    const updateDiagnostics = (document) => {
        if (document.languageId !== 'gamelang')
            return;
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // 检查语法错误
            if (line.includes('){') || line.includes('}(')) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(range, '语法错误：GameLang使用冒号(:)而不是大括号({})', vscode.DiagnosticSeverity.Error));
            }
            // 检查未闭合的字符串
            const quoteCount = (line.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(range, '字符串未闭合', vscode.DiagnosticSeverity.Error));
            }
        }
        diagnosticCollection.set(document.uri, diagnostics);
    };
    // 监听文档变化
    const changeDocumentListener = vscode.workspace.onDidChangeTextDocument(event => {
        updateDiagnostics(event.document);
    });
    const openDocumentListener = vscode.workspace.onDidOpenTextDocument(document => {
        updateDiagnostics(document);
    });
    // 注册代码片段提供者
    const snippetProvider = vscode.languages.registerCompletionItemProvider('gamelang', {
        provideCompletionItems(document, position, token, context) {
            const snippets = [];
            // 函数定义片段
            const fnSnippet = new vscode.CompletionItem('fn', vscode.CompletionItemKind.Snippet);
            fnSnippet.insertText = new vscode.SnippetString('fn ${1:函数名}(${2:参数}):\n\t${3:# 函数体}');
            fnSnippet.documentation = new vscode.MarkdownString('创建函数定义');
            snippets.push(fnSnippet);
            // 类定义片段
            const classSnippet = new vscode.CompletionItem('class', vscode.CompletionItemKind.Snippet);
            classSnippet.insertText = new vscode.SnippetString('class ${1:类名}:\n\t${2:# 类属性}');
            classSnippet.documentation = new vscode.MarkdownString('创建类定义');
            snippets.push(classSnippet);
            // if语句片段
            const ifSnippet = new vscode.CompletionItem('if', vscode.CompletionItemKind.Snippet);
            ifSnippet.insertText = new vscode.SnippetString('if ${1:条件}:\n\t${2:# 代码块}');
            ifSnippet.documentation = new vscode.MarkdownString('创建if条件语句');
            snippets.push(ifSnippet);
            // while循环片段
            const whileSnippet = new vscode.CompletionItem('while', vscode.CompletionItemKind.Snippet);
            whileSnippet.insertText = new vscode.SnippetString('while ${1:条件}:\n\t${2:# 循环体}');
            whileSnippet.documentation = new vscode.MarkdownString('创建while循环');
            snippets.push(whileSnippet);
            // for循环片段
            const forSnippet = new vscode.CompletionItem('for', vscode.CompletionItemKind.Snippet);
            forSnippet.insertText = new vscode.SnippetString('for ${1:变量} in ${2:可迭代对象}:\n\t${3:# 循环体}');
            forSnippet.documentation = new vscode.MarkdownString('创建for循环');
            snippets.push(forSnippet);
            return snippets;
        }
    }, 'f', 'c', 'i', 'w');
    // 注册缺失的命令实现
    const formatCodeCommand = vscode.commands.registerCommand('gamelang.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.commands.executeCommand('editor.action.formatDocument');
            vscode.window.showInformationMessage('GameLang代码格式化完成');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const lintCodeCommand = vscode.commands.registerCommand('gamelang.lintCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            updateDiagnostics(editor.document);
            vscode.window.showInformationMessage('GameLang代码检查完成');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const runFileCommand = vscode.commands.registerCommand('gamelang.runFile', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.window.showInformationMessage('GameLang文件运行功能开发中...');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const aiGenerateCommand = vscode.commands.registerCommand('gamelang.aiGenerate', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.window.showInformationMessage('GameLang AI代码生成功能开发中...');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const aiExplainCommand = vscode.commands.registerCommand('gamelang.aiExplain', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                vscode.window.showInformationMessage('GameLang AI代码解释功能开发中...');
            }
            else {
                vscode.window.showWarningMessage('请先选择要解释的代码');
            }
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const aiOptimizeCommand = vscode.commands.registerCommand('gamelang.aiOptimize', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                vscode.window.showInformationMessage('GameLang AI代码优化功能开发中...');
            }
            else {
                vscode.window.showWarningMessage('请先选择要优化的代码');
            }
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const aiRefactorCommand = vscode.commands.registerCommand('gamelang.aiRefactor', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                vscode.window.showInformationMessage('GameLang AI代码重构功能开发中...');
            }
            else {
                vscode.window.showWarningMessage('请先选择要重构的代码');
            }
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const startDebugCommand = vscode.commands.registerCommand('gamelang.startDebug', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.debug.startDebugging(undefined, {
                name: 'Launch GameLang File',
                type: 'gamelang',
                request: 'launch',
                program: editor.document.fileName,
                console: 'integratedTerminal'
            });
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const toggleBreakpointCommand = vscode.commands.registerCommand('gamelang.toggleBreakpoint', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.commands.executeCommand('editor.debug.action.toggleBreakpoint');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const showVariablesCommand = vscode.commands.registerCommand('gamelang.showVariables', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.window.showInformationMessage('GameLang变量查看功能开发中...');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    const debugConsoleCommand = vscode.commands.registerCommand('gamelang.debugConsole', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.commands.executeCommand('workbench.debug.action.toggleRepl');
        }
        else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });
    // 注册所有提供者
    context.subscriptions.push(searchCommand, formatCodeCommand, lintCodeCommand, runFileCommand, aiGenerateCommand, aiExplainCommand, aiOptimizeCommand, aiRefactorCommand, startDebugCommand, toggleBreakpointCommand, showVariablesCommand, debugConsoleCommand, debugProvider, debugAdapterFactory, completionProvider, hoverProvider, formattingProvider, diagnosticCollection, changeDocumentListener, openDocumentListener, snippetProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map