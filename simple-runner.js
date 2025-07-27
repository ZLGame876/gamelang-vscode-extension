#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 获取文件路径
const filePath = process.argv[2];

if (!filePath) {
    console.error('请提供GameLang文件路径');
    process.exit(1);
}

// 检查文件是否存在
if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    process.exit(1);
}

// 检查文件扩展名
if (!filePath.endsWith('.ln')) {
    console.error(`不是GameLang文件: ${filePath}`);
    process.exit(1);
}

console.log('=== GameLang 代码执行 ===');
console.log(`文件: ${path.basename(filePath)}`);
console.log(`路径: ${filePath}`);

try {
    // 读取文件内容
    const code = fs.readFileSync(filePath, 'utf8');
    console.log(`代码长度: ${code.length} 字符\n`);
    
    // 简单的代码执行
    const lines = code.split('\n');
    console.log(`总行数: ${lines.length}\n`);
    
    let lineNumber = 0;
    for (const line of lines) {
        lineNumber++;
        const trimmedLine = line.trim();
        
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            continue;
        }
        
        // 处理print语句
        if (trimmedLine.match(/^(print|打印)\(/)) {
            const match = trimmedLine.match(/(print|打印)\((.+)\)/);
            if (match) {
                const content = match[2].replace(/"/g, '').replace(/'/g, '');
                console.log(`[输出] ${content}`);
            }
        }
        // 处理变量赋值
        else if (trimmedLine.includes('=') && !trimmedLine.includes('==')) {
            const [varName, value] = trimmedLine.split('=').map(s => s.trim());
            console.log(`[变量] ${varName} = ${value}`);
        }
        // 处理函数调用
        else if (trimmedLine.includes('(') && trimmedLine.includes(')')) {
            const funcName = trimmedLine.substring(0, trimmedLine.indexOf('(')).trim();
            console.log(`[函数] 调用: ${funcName}`);
        }
        // 处理其他语句
        else {
            console.log(`[执行] ${trimmedLine}`);
        }
    }
    
    console.log('\n=== 执行完成 ===');
    
} catch (error) {
    console.error('执行错误:', error);
    process.exit(1);
} 