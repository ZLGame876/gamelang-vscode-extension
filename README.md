# GameLang - 游戏编程语言扩展

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang.gamelang)
[![Downloads](https://img.shields.io/badge/downloads-0-brightgreen.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang.gamelang)
[![Rating](https://img.shields.io/badge/rating-0.0-yellow.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang.gamelang)

GameLang是一个专为游戏开发设计的编程语言，这个VS Code扩展提供了完整的开发支持。

## ✨ 功能特性

### 🎮 语言支持
- **语法高亮**: 完整的GameLang语法高亮支持
- **智能提示**: 自动补全关键字、函数和变量
- **代码片段**: 20+个常用代码模板
- **悬停文档**: 函数说明和用法示例

### 🔍 搜索功能
- **内置函数搜索**: 快速搜索GameLang内置函数库
- **快捷键支持**: `Cmd+U` (macOS) / `Ctrl+U` (Windows/Linux)
- **搜索结果展示**: 在输出面板中显示详细结果

### 🛠️ 代码质量
- **语法检查**: 实时语法错误检测
- **代码格式化**: 自动格式化代码
- **错误诊断**: 智能错误提示和修复建议

### 🐛 调试支持
- **断点管理**: 设置和管理断点
- **变量查看**: 实时查看变量值
- **调用栈分析**: 显示函数调用栈
- **单步调试**: 支持继续、下一步、步入、步出

### 🤖 AI集成
- **AI代码生成**: 使用AI生成代码
- **AI代码解释**: 解释代码功能
- **AI代码优化**: 优化代码性能
- **AI代码重构**: 重构代码结构

## 🚀 快速开始

### 安装扩展
1. 打开VS Code
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索 "GameLang"
4. 点击安装

### 创建第一个GameLang文件
1. 创建新文件，保存为 `.ln` 扩展名
2. 开始编写GameLang代码：

```gamelang
// 第一个GameLang程序
print("Hello, GameLang!")

// 变量定义
var name = "GameLang"
var version = 1.0

// 函数定义
fn greet(name) {
    print("Hello, " + name + "!")
}

// 调用函数
greet(name)

// 使用AI功能
ai_ask("什么是GameLang?")
```

### 使用搜索功能
- 按 `Cmd+U` (macOS) 或 `Ctrl+U` (Windows/Linux)
- 输入要搜索的函数名或关键词
- 查看搜索结果

### 调试代码
1. 在代码中设置断点
2. 按 `F5` 启动调试
3. 使用调试控制台查看变量

## 📚 语言特性

### 基础语法
```gamelang
// 变量声明
var name = "GameLang"
var age = 18
var isActive = true

// 函数定义
fn calculate(a, b) {
    return a + b
}

// 条件语句
if age >= 18 {
    print("成年人")
} else {
    print("未成年人")
}

// 循环语句
while age < 20 {
    age = age + 1
    print("年龄: " + age)
}

// 类定义
class Player {
    fn __init__(self, name) {
        self.name = name
    }
    
    fn play() {
        print(self.name + " 开始游戏")
    }
}
```

### 内置函数
```gamelang
// 基础函数
print("Hello World")           // 打印输出
var input = input("请输入: ")  // 获取输入
var length = len([1, 2, 3])    // 获取长度

// 数学函数
var abs = abs(-5)              // 绝对值
var max = max(1, 2, 3)         // 最大值
var min = min(1, 2, 3)         // 最小值

// 随机数
var random = random()          // 0-1随机数
var randint = randint(1, 10)   // 1-10随机整数

// 时间函数
var now = now()                // 当前时间
sleep(1)                       // 暂停1秒

// 搜索函数
search_builtin("print")        // 搜索内置函数

// AI函数
ai_ask("什么是编程?")          // AI问答
```

## 🎯 使用场景

### 游戏开发
- 游戏逻辑编写
- 角色控制
- 游戏状态管理
- 物理计算

### 教育学习
- 编程入门
- 算法学习
- 逻辑思维训练
- 项目实践

### 原型开发
- 快速原型
- 概念验证
- 功能测试
- 创意实现

## 🔧 配置选项

### 扩展设置
```json
{
    "gamelang.enableSearch": true,
    "gamelang.enableAI": true,
    "gamelang.enableDebug": true,
    "gamelang.autoFormat": true
}
```

### 快捷键
- `Cmd+U` / `Ctrl+U`: 搜索内置函数
- `Shift+Alt+F`: 格式化代码
- `Ctrl+Shift+L`: 语法检查
- `F5`: 启动调试

## 📖 文档

- [语言规范](https://github.com/gamelang/docs/language-spec)
- [API参考](https://github.com/gamelang/docs/api)
- [示例代码](https://github.com/gamelang/examples)
- [常见问题](https://github.com/gamelang/docs/faq)

## 🤝 贡献

欢迎贡献代码和反馈！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为GameLang项目做出贡献的开发者！

---

**享受GameLang编程的乐趣！** 🎮✨ 