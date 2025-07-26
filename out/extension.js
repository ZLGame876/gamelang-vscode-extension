"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
const debugger_1 = require("./debugger");
function activate(context) {
    console.log('GameLang extension is now active!');
    // 显示激活消息
    vscode.window.showInformationMessage('GameLang扩展已激活！搜索功能快捷键：Cmd+U');
    // 注册搜索命令
    let searchCommand = vscode.commands.registerCommand('gamelang.searchBuiltin', async () => {
        const searchTerm = await vscode.window.showInputBox({
            prompt: '请输入要搜索的GameLang内置函数',
            placeHolder: '例如: print, input, len...'
        });
        if (searchTerm) {
            try {
                // 执行搜索命令
                const result = child_process.execSync(`python3 -c "
import sys
sys.path.append('${context.extensionPath}/../..')
from gamelang_interpreter import search_builtin
result = search_builtin('${searchTerm}')
print(result)
"`, { encoding: 'utf8' });
                // 显示搜索结果
                vscode.window.showInformationMessage(`搜索结果: ${result.trim()}`);
                // 在输出面板中显示详细信息
                const output = vscode.window.createOutputChannel('GameLang Search');
                output.appendLine(`搜索 "${searchTerm}" 的结果:`);
                output.appendLine(result);
                output.show();
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
            const builtinFunctions = [
                'print', 'input', 'len', 'type', 'str', 'int', 'float', 'bool',
                'abs', 'max', 'min', 'round', 'floor', 'ceil',
                'random', 'randint', 'now', 'sleep',
                'append', 'pop', 'get', 'keys', 'values', 'items',
                'search_builtin', 'ai_ask'
            ];
            builtinFunctions.forEach(func => {
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = 'GameLang Built-in Function';
                item.documentation = new vscode.MarkdownString(`**${func}** - GameLang内置函数`);
                completions.push(item);
            });
            // 关键字
            const keywords = ['fn', 'class', 'if', 'elif', 'else', 'while', 'for', 'return', 'var', 'import', 'use'];
            keywords.forEach(keyword => {
                const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                item.detail = 'GameLang Keyword';
                completions.push(item);
            });
            // 代码片段
            const snippets = [
                {
                    label: 'fn',
                    insertText: 'fn ${1:functionName}(${2:parameters}) {\n\t${3:// function body}\n}',
                    detail: 'Function Definition',
                    documentation: 'Create a new function'
                },
                {
                    label: 'class',
                    insertText: 'class ${1:ClassName} {\n\tfn __init__(${2:self}) {\n\t\t${3:// constructor}\n\t}\n}',
                    detail: 'Class Definition',
                    documentation: 'Create a new class'
                },
                {
                    label: 'if',
                    insertText: 'if ${1:condition} {\n\t${2:// code}\n}',
                    detail: 'If Statement',
                    documentation: 'Create an if statement'
                },
                {
                    label: 'while',
                    insertText: 'while ${1:condition} {\n\t${2:// code}\n}',
                    detail: 'While Loop',
                    documentation: 'Create a while loop'
                },
                {
                    label: 'for',
                    insertText: 'for ${1:item} in ${2:collection} {\n\t${3:// code}\n}',
                    detail: 'For Loop',
                    documentation: 'Create a for loop'
                }
            ];
            snippets.forEach(snippet => {
                const item = new vscode.CompletionItem(snippet.label, vscode.CompletionItemKind.Snippet);
                item.insertText = new vscode.SnippetString(snippet.insertText);
                item.detail = snippet.detail;
                item.documentation = snippet.documentation;
                completions.push(item);
            });
            return completions;
        }
    }, '.');
    // 注册悬停提供者
    const hoverProvider = vscode.languages.registerHoverProvider('gamelang', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            const hoverInfo = {
                'print': '打印函数 - 将内容输出到控制台\n\n**用法**: print(value)\n\n**示例**:\n```gamelang\nprint("Hello World")\nprint(42)\n```',
                'input': '输入函数 - 从用户获取输入\n\n**用法**: input(prompt)\n\n**示例**:\n```gamelang\nvar name = input("请输入姓名: ")\n```',
                'len': '长度函数 - 获取容器长度\n\n**用法**: len(container)\n\n**示例**:\n```gamelang\nvar length = len([1, 2, 3])\n```',
                'search_builtin': '搜索内置函数 - 搜索GameLang内置函数库\n\n**用法**: search_builtin(keyword)\n\n**示例**:\n```gamelang\nsearch_builtin("print")\n```',
                'ai_ask': 'AI问答 - 向AI助手提问\n\n**用法**: ai_ask(question)\n\n**示例**:\n```gamelang\nai_ask("什么是GameLang?")\n```',
                'fn': '函数定义关键字\n\n**语法**:\n```gamelang\nfn functionName(parameters) {\n    // function body\n}\n```',
                'class': '类定义关键字\n\n**语法**:\n```gamelang\nclass ClassName {\n    fn __init__(self) {\n        // constructor\n    }\n}\n```',
                'var': '变量声明关键字\n\n**语法**:\n```gamelang\nvar variableName = value\n```',
                'if': '条件语句关键字\n\n**语法**:\n```gamelang\nif condition {\n    // code\n} elif condition2 {\n    // code\n} else {\n    // code\n}\n```',
                'while': '循环语句关键字\n\n**语法**:\n```gamelang\nwhile condition {\n    // code\n}\n```',
                'for': '循环语句关键字\n\n**语法**:\n```gamelang\nfor item in collection {\n    // code\n}\n```',
                'return': '返回语句关键字\n\n**语法**:\n```gamelang\nreturn value\n```',
                'import': '模块导入关键字\n\n**语法**:\n```gamelang\nimport moduleName\nimport moduleName as alias\n```',
                'use': '模块使用关键字\n\n**语法**:\n```gamelang\nuse moduleName\n```'
            };
            if (hoverInfo[word]) {
                return new vscode.Hover(new vscode.MarkdownString(hoverInfo[word]));
            }
            return null;
        }
    });
    // 注册格式化提供者
    const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('gamelang', {
        provideDocumentFormattingEdits(document, options, token) {
            const edits = [];
            const text = document.getText();
            const lines = text.split('\n');
            let indentLevel = 0;
            const indentSize = options.tabSize || 4;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line === '')
                    continue;
                // 减少缩进的情况
                if (line.startsWith('}') || line.startsWith('elif') || line.startsWith('else')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                // 创建格式化后的行
                const indent = ' '.repeat(indentLevel * indentSize);
                const formattedLine = indent + line;
                // 添加编辑
                const range = new vscode.Range(i, 0, i, lines[i].length);
                edits.push(vscode.TextEdit.replace(range, formattedLine));
                // 增加缩进的情况
                if (line.endsWith('{') || line.startsWith('if') || line.startsWith('elif') || line.startsWith('else') || line.startsWith('while') || line.startsWith('for') || line.startsWith('fn') || line.startsWith('class')) {
                    indentLevel++;
                }
            }
            return edits;
        }
    });
    // 注册语法检查提供者
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('gamelang');
    const updateDiagnostics = (document) => {
        if (document.languageId !== 'gamelang')
            return;
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        // 简单的语法检查
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // 检查未闭合的引号
            const quoteCount = (line.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(range, '未闭合的引号', vscode.DiagnosticSeverity.Error));
            }
            // 检查未闭合的括号
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            if (openBraces !== closeBraces) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(range, '括号不匹配', vscode.DiagnosticSeverity.Warning));
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
    // 更新当前打开的文档
    vscode.workspace.textDocuments.forEach(document => {
        updateDiagnostics(document);
    });
    // 注册代码片段
    const snippets = [
        {
            label: 'GameLang Function',
            description: 'Create a GameLang function',
            body: [
                'fn ${1:functionName}(${2:parameters}) {',
                '\t${3:// function body}',
                '}'
            ]
        },
        {
            label: 'GameLang Class',
            description: 'Create a GameLang class',
            body: [
                'class ${1:ClassName} {',
                '\tfn __init__(${2:self}) {',
                '\t\t${3:// constructor}',
                '\t}',
                '}'
            ]
        },
        {
            label: 'GameLang If Statement',
            description: 'Create a GameLang if statement',
            body: [
                'if ${1:condition} {',
                '\t${2:// code}',
                '}'
            ]
        },
        {
            label: 'GameLang While Loop',
            description: 'Create a GameLang while loop',
            body: [
                'while ${1:condition} {',
                '\t${2:// code}',
                '}'
            ]
        },
        {
            label: 'GameLang For Loop',
            description: 'Create a GameLang for loop',
            body: [
                'for ${1:item} in ${2:collection} {',
                '\t${3:// code}',
                '}'
            ]
        },
        {
            label: 'GameLang Variable',
            description: 'Create a GameLang variable',
            body: [
                'var ${1:variableName} = ${2:value}'
            ]
        },
        {
            label: 'GameLang Print',
            description: 'Create a GameLang print statement',
            body: [
                'print(${1:"Hello World"})'
            ]
        },
        {
            label: 'GameLang Input',
            description: 'Create a GameLang input statement',
            body: [
                'var ${1:variableName} = input(${2:"Enter value: "})'
            ]
        },
        {
            label: 'GameLang Search',
            description: 'Search GameLang built-in functions',
            body: [
                'search_builtin(${1:"function_name"})'
            ]
        },
        {
            label: 'GameLang AI Ask',
            description: 'Ask AI assistant',
            body: [
                'ai_ask(${1:"What is GameLang?"})'
            ]
        }
    ];
    // 注册代码片段提供者
    const snippetProvider = vscode.languages.registerCompletionItemProvider('gamelang', {
        provideCompletionItems(document, position, token, context) {
            return snippets.map(snippet => {
                const item = new vscode.CompletionItem(snippet.label, vscode.CompletionItemKind.Snippet);
                item.detail = snippet.description;
                item.insertText = new vscode.SnippetString(snippet.body.join('\n'));
                return item;
            });
        }
    });
    // 将命令和提供者添加到上下文
    context.subscriptions.push(searchCommand, debugProvider, debugAdapterFactory, completionProvider, hoverProvider, formattingProvider, snippetProvider, diagnosticCollection, changeDocumentListener, openDocumentListener);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map