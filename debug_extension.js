const fs = require('fs');
const path = require('path');

console.log('=== GameLang Extension Debug Info ===');

// 检查关键文件是否存在
const files = [
    'package.json',
    'out/extension.js',
    'language-configuration.json',
    'syntaxes/gamelang.tmLanguage.json'
];

console.log('\n1. 检查关键文件:');
files.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? '存在' : '不存在'}`);
});

// 检查package.json内容
console.log('\n2. 检查package.json配置:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`✅ 扩展名称: ${packageJson.name}`);
    console.log(`✅ 版本: ${packageJson.version}`);
    console.log(`✅ 发布者: ${packageJson.publisher}`);
    console.log(`✅ 主文件: ${packageJson.main}`);
    console.log(`✅ 激活事件: ${JSON.stringify(packageJson.activationEvents)}`);
    
    if (packageJson.contributes && packageJson.contributes.languages) {
        console.log(`✅ 语言配置: ${JSON.stringify(packageJson.contributes.languages)}`);
    }
} catch (error) {
    console.log(`❌ 读取package.json失败: ${error.message}`);
}

// 检查语言配置
console.log('\n3. 检查语言配置:');
try {
    const langConfig = JSON.parse(fs.readFileSync('language-configuration.json', 'utf8'));
    console.log(`✅ 语言配置有效`);
} catch (error) {
    console.log(`❌ 语言配置无效: ${error.message}`);
}

// 检查语法文件
console.log('\n4. 检查语法文件:');
try {
    const syntaxFile = JSON.parse(fs.readFileSync('syntaxes/gamelang.tmLanguage.json', 'utf8'));
    console.log(`✅ 语法文件有效`);
    console.log(`✅ 作用域名称: ${syntaxFile.scopeName}`);
} catch (error) {
    console.log(`❌ 语法文件无效: ${error.message}`);
}

console.log('\n=== 调试信息完成 ===');
console.log('\n请尝试以下步骤:');
console.log('1. 重启VS Code');
console.log('2. 打开一个.ln文件');
console.log('3. 检查右下角是否显示"GameLang"');
console.log('4. 按Cmd+Shift+P，输入"Developer: Toggle Developer Tools"查看控制台'); 