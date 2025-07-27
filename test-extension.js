#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 模拟VS Code环境
const mockVscode = {
    window: {
        activeTextEditor: {
            document: {
                fileName: path.join(__dirname, '..', 'debug_test.ln'),
                languageId: 'gamelang',
                getText: () => fs.readFileSync(path.join(__dirname, '..', 'debug_test.ln'), 'utf8')
            }
        },
        showInformationMessage: (msg) => console.log('INFO:', msg),
        showErrorMessage: (msg) => console.log('ERROR:', msg),
        createOutputChannel: (name) => ({
            appendLine: (text) => console.log(`[${name}] ${text}`),
            show: () => console.log(`[${name}] 显示输出面板`),
            clear: () => console.log(`[${name}] 清空输出面板`)
        })
    }
};

// 模拟全局vscode对象
global.vscode = mockVscode;

console.log('=== 测试扩展功能 ===');

try {
    // 导入解释器
    const { GameLangInterpreter } = require('./out/gamelang-interpreter.js');
    
    console.log('✅ 解释器导入成功');
    
    // 创建解释器实例
    const interpreter = new GameLangInterpreter();
    console.log('✅ 解释器实例创建成功');
    
    // 读取测试文件
    const testFile = path.join(__dirname, '..', 'debug_test.ln');
    const code = fs.readFileSync(testFile, 'utf8');
    console.log('✅ 文件读取成功');
    console.log('文件内容:');
    console.log(code);
    console.log('---');
    
    // 执行代码
    console.log('开始执行代码...');
    interpreter.execute(code).then(() => {
        console.log('✅ 代码执行完成');
    }).catch(error => {
        console.error('❌ 代码执行失败:', error);
    });
    
} catch (error) {
    console.error('❌ 测试失败:', error);
} 