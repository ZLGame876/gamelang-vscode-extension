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

// 读取文件内容
const code = fs.readFileSync(filePath, 'utf8');

console.log('=== GameLang 代码执行 ===');
console.log(`文件: ${filePath}`);
console.log(`代码长度: ${code.length} 字符\n`);

// 简单的代码执行模拟
const lines = code.split('\n');
console.log(`总行数: ${lines.length}\n`);

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#')) {
        console.log(`[执行] 第${i + 1}行: ${line}`);
        
        // 处理import语句
        if (line.startsWith('import ')) {
            const moduleName = line.replace('import ', '').replace(';', '').trim();
            console.log(`[导入] 成功导入模块: ${moduleName}`);
        }
        // 处理print语句
        else if (line.match(/^(print|打印)\(/)) {
            const match = line.match(/(print|打印)\((.+)\)/);
            if (match) {
                const content = match[2].replace(/"/g, '').replace(/'/g, '');
                console.log(`[输出] ${content}`);
            }
        }
        // 处理变量赋值
        else if (line.includes('=')) {
            const [varName, value] = line.split('=').map(s => s.trim());
            console.log(`[变量] ${varName} = ${value}`);
        }
        // 处理函数调用
        else if (line.includes('(') && line.includes(')')) {
            const funcName = line.substring(0, line.indexOf('(')).trim();
            console.log(`[函数] 调用: ${funcName}`);
        }
    } else {
        console.log(`[跳过] 第${i + 1}行: ${line}`);
    }
}

console.log('\n=== 执行完成 ==='); 