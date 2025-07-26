// 测试GameLang扩展功能
const fs = require('fs');
const path = require('path');

// 创建测试文件
const testContent = `# 测试GameLang语言识别
# 这个文件用于测试扩展是否正确识别.ln文件

打印("Hello World!")
输入("请输入你的名字：")

如果 True:
    打印("条件为真")
否则:
    打印("条件为假")

# 测试搜索功能
search_builtin("print")
`;

const testFile = path.join(__dirname, 'test_language.ln');
fs.writeFileSync(testFile, testContent);

console.log('测试文件已创建:', testFile);
console.log('请在VS Code中打开此文件，检查语言模式是否正确识别为GameLang');
console.log('如果显示"Code language not supported or defined"，请：');
console.log('1. 重新加载VS Code窗口 (Cmd+Shift+P -> Developer: Reload Window)');
console.log('2. 手动设置语言模式 (右下角点击语言模式 -> 选择GameLang)');
console.log('3. 检查扩展是否正确安装和激活'); 