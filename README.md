# GameLang - 游戏编程语言扩展

[![Version](https://img.shields.io/badge/version-1.1.3-blue.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang)
[![Downloads](https://img.shields.io/badge/downloads-0-brightgreen.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang)
[![Rating](https://img.shields.io/badge/rating-0.0-yellow.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang)

GameLang是一个专为游戏开发设计的编程语言，支持**全英文、全中文、中英混合**三种编程模式。这个VS Code扩展提供了完整的开发支持。

## ✨ 功能特性

### 🌍 多语言编程支持
- **全英文编程**: 使用英文关键字和函数名
- **全中文编程**: 使用中文关键字和函数名
- **中英混合编程**: 混合使用中英文关键字和函数名
- **智能语言识别**: 自动识别编程语言模式

### 🎮 语言支持
- **语法高亮**: 完整的GameLang语法高亮支持
- **智能提示**: 自动补全关键字、函数和变量
- **代码片段**: 20+个常用代码模板
- **悬停文档**: 函数说明和用法示例

### 🔍 搜索功能
- **内置函数搜索**: 快速搜索96个GameLang内置函数
- **快捷键支持**: `Cmd+U` (macOS) / `Ctrl+U` (Windows/Linux)
- **搜索结果展示**: 在输出面板中显示详细结果
- **中英文关键词搜索**: 支持中英文函数名和关键词搜索

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

#### 全英文模式
```ln
# 第一个GameLang程序
print("Hello, GameLang!")

# 变量定义
name = "GameLang"
version = 1.0

# 函数定义
fn greet(name):
    print("Hello, " + name + "!")

# 调用函数
greet(name)

# 使用AI功能
ai_ask("什么是GameLang?")
```

#### 全中文模式
```ln
# 第一个GameLang程序
打印("你好，GameLang！")

# 变量定义
姓名 = "GameLang"
版本 = 1.0

# 函数定义
函数 问候(姓名):
    打印("你好，" + 姓名 + "！")

# 调用函数
问候(姓名)

# 使用AI功能
AI问答("什么是GameLang?")
```

#### 中英混合模式
```ln
# 第一个GameLang程序
print("Hello, GameLang!")

# 变量定义
name = "GameLang"
版本 = 1.0

# 函数定义
def greet(姓名):
    print("Hello, " + 姓名 + "!")

# 调用函数
greet(name)

# 使用AI功能
ai_ask("什么是GameLang?")
```

### 使用搜索功能
- 按 `Cmd+U` (macOS) 或 `Ctrl+U` (Windows/Linux)
- 输入要搜索的函数名或关键词（支持中英文）
- 查看搜索结果

### 调试代码
1. 在代码中设置断点
2. 按 `F5` 启动调试
3. 使用调试控制台查看变量

## 📚 语言特性

### 基础语法
```ln
# 变量声明（不需要var关键字）
name = "GameLang"
age = 18
isActive = true

# 函数定义（使用冒号而不是大括号）
fn calculate(a, b):
    return a + b

# 条件语句
if age >= 18:
    print("成年人")
else:
    print("未成年人")

# 循环语句
while age < 20:
    age = age + 1
    print("年龄: " + age)

# 类定义
class Player:
    fn __init__(self, name):
        self.name = name
    
    fn play():
        print(self.name + " 开始游戏")
```

### 内置函数库（96个函数）

#### 基础函数
```ln
# 输出和输入
print("Hello World")           # 打印输出
输入 = input("请输入: ")        # 获取输入
长度 = len([1, 2, 3])          # 获取长度

# 类型转换
字符串 = str(123)              # 转换为字符串
整数 = int("123")              # 转换为整数
浮点数 = float("3.14")         # 转换为浮点数
布尔值 = bool(1)               # 转换为布尔值
```

#### 数学函数
```ln
# 数学运算
绝对值 = abs(-5)               # 绝对值
最大值 = max(1, 2, 3)          # 最大值
最小值 = min(1, 2, 3)          # 最小值
四舍五入 = round(3.14159, 2)   # 四舍五入
总和 = sum([1, 2, 3, 4, 5])    # 求和

# 随机数
随机小数 = random()            # 0-1随机数
随机整数 = randint(1, 10)      # 1-10随机整数
```

#### 数据结构函数
```ln
# 列表操作
列表 = list([1, 2, 3])         # 创建列表
添加(列表, 4)                  # 添加元素
移除(列表, 1)                  # 移除元素
插入(列表, 1, "新元素")        # 插入元素
弹出 = 弹出(列表)              # 弹出最后一个元素
清空(列表)                     # 清空列表

# 字典操作
字典 = dict({"name": "GameLang"})  # 创建字典
更新(字典, "version", "1.1.3")     # 更新值
获取键 = get_keys(字典)            # 获取所有键
获取值 = get_values(字典)          # 获取所有值
获取项目 = get_items(字典)         # 获取所有键值对

# 集合操作
集合 = set([1, 2, 3])          # 创建集合
```

#### 字符串处理
```ln
# 字符串操作
替换 = replace("Hello World", "World", "GameLang")  # 替换
分割 = split("a,b,c", ",")                          # 分割
连接 = join(",", ["a", "b", "c"])                   # 连接
```

#### 文件操作
```ln
# 文件操作
文件 = open("test.txt", "r")    # 打开文件
内容 = read(文件)               # 读取文件
写入(文件, "Hello World")       # 写入文件
关闭(文件)                     # 关闭文件
复制("source.txt", "dest.txt")  # 复制文件
移动("old.txt", "new.txt")      # 移动文件
删除("file.txt")                # 删除文件
```

#### 高级函数
```ln
# 函数式编程
过滤 = filter([1, 2, 3, 4, 5], lambda x: x > 2)     # 过滤
映射 = map(lambda x: x * 2, [1, 2, 3])              # 映射
归约 = reduce(lambda x, y: x + y, [1, 2, 3, 4])     # 归约

# 时间函数
现在时间 = now()                # 当前时间
暂停(1)                        # 暂停1秒

# 搜索和AI
search_builtin("print")         # 搜索内置函数
ai_ask("什么是编程?")           # AI问答
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
    "gamelang.autoFormat": true,
    "files.associations": {
        "*.ln": "gamelang"
    }
}
```

### 快捷键
- `Cmd+U` / `Ctrl+U`: 搜索内置函数
- `Shift+Alt+F`: 格式化代码
- `Ctrl+Shift+L`: 语法检查
- `F5`: 启动调试

## 📁 示例文件

扩展包含多个示例文件：
- `hello_world.ln` - 基础语法示例
- `01_basic_syntax.ln` - 基础语法详解
- `02_game_development.ln` - 游戏开发示例
- `03_ai_integration.ln` - AI集成示例
- `04_debugging_demo.ln` - 调试功能演示
- `05_chinese_programming.ln` - 全中文编程示例
- `06_mixed_language.ln` - 中英混合编程示例

## 📖 文档

- [语言规范](https://github.com/ZLGame876/gamelang-vscode-extension/blob/main/docs/语言规范.md)
- [API参考](https://github.com/ZLGame876/gamelang-vscode-extension/blob/main/docs/API参考.md)
- [常见问题](https://github.com/ZLGame876/gamelang-vscode-extension/blob/main/docs/常见问题.md)
- [更新日志](https://github.com/ZLGame876/gamelang-vscode-extension/blob/main/CHANGELOG.md)

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