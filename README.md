# GameLang VS Code Extension

[![Version](https://img.shields.io/badge/version-1.2.2-blue.svg)](https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Complete VS Code extension for GameLang programming language with syntax highlighting, IntelliSense, debugging, AI integration, and **code execution**.

## ✨ Features

### 🎯 Core Features
- **Syntax Highlighting**: Full support for GameLang syntax
- **IntelliSense**: Auto-completion, hover documentation, and code snippets
- **Code Formatting**: Automatic code formatting with `Shift+Alt+F`
- **Linting**: Real-time syntax error detection
- **Debugging**: Full debugging support with breakpoints
- **AI Integration**: AI-powered code generation and explanation
- **🔴 NEW: Code Execution**: Run GameLang code directly in VS Code!

### 🌍 Multi-language Programming Support
GameLang supports three programming modes:
- **English**: Full English keywords and functions
- **Chinese**: Full Chinese keywords and functions  
- **Mixed**: Mix Chinese and English in the same file

### 🔤 Dual Syntax Support
GameLang supports two syntax styles:
- **Colon Syntax**: `if condition:` (concise)
- **Brace Syntax**: `if (condition) {` (traditional)
- **Mixed Syntax**: Use both in the same file

### 🔍 Search Function
- **96 Built-in Functions**: Search through 48 English + 48 Chinese functions
- **Keyword Search**: Search by function name, description, or keywords
- **Shortcut**: `Cmd+U` to open search

### 🚀 Code Execution
- **Direct Execution**: Run `.ln` files directly in VS Code
- **Output Panel**: View results in dedicated GameLang output panel
- **Built-in Functions**: All GameLang functions are executable
- **Error Handling**: Friendly error messages with line numbers

## 🚀 Quick Start

### Installation
1. Install from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang)
2. Or install from VSIX file: `code --install-extension gamelang-1.2.2.vsix`

### Basic Usage
1. Create a `.ln` file
2. Write GameLang code
3. Use syntax highlighting and IntelliSense
4. **Run your code** with `F5` or `Cmd+Shift+P` → "Run GameLang File"

## 📝 Code Examples

### English Programming
```ln
fn greet(name):
    print("Hello", name)

if age >= 18:
    print("Adult")
else:
    print("Minor")
```

### Chinese Programming
```ln
函数 问候(姓名):
    打印("你好", 姓名)

如果 年龄 >= 18:
    打印("成年人")
否则:
    打印("未成年人")
```

### Mixed Programming
```ln
def calculate_average(分数列表):
    total = sum(分数列表)
    return total / len(分数列表)

if 年龄 >= 18:
    print("Adult")
else:
    打印("未成年人")
```

### Dual Syntax
```ln
# Colon syntax
fn test():
    print("Colon syntax")

# Brace syntax  
fn test2() {
    print("Brace syntax");
}

# Mixed syntax
fn mixed_function(name) {
    if name == "GameLang":
        print("Using colon syntax");
    else {
        print("Using brace syntax");
    }
}
```

### Code Execution
```ln
# Run this code with F5 or "Run GameLang File"
print("Hello GameLang!")

name = "GameLang"
result = abs(-10)
print("Welcome to", name)
print("Absolute value:", result)

random_num = random()
current_time = now()
print("Random number:", random_num)
print("Current time:", current_time)
```

## 🔧 Built-in Functions

### Basic Functions
- `print()` / `打印()` - Output text
- `input()` / `输入()` - Get user input
- `len()` / `长度()` - Get length
- `type()` / `类型()` - Get type

### Math Functions
- `abs()` / `绝对值()` - Absolute value
- `max()` / `最大值()` - Maximum value
- `min()` / `最小值()` - Minimum value
- `round()` / `四舍五入()` - Round number

### Random Functions
- `random()` / `随机小数()` - Random float
- `randint()` / `随机整数()` - Random integer

### Time Functions
- `now()` / `现在时间()` - Current time
- `sleep()` / `暂停()` - Sleep for seconds

### Data Structures
- `list()` / `列表()` - Create list
- `dict()` / `字典()` - Create dictionary
- `set()` / `集合()` - Create set

### String Functions
- `str()` / `字符串()` - Convert to string
- `split()` / `分割()` - Split string
- `join()` / `连接()` - Join strings

### File Functions
- `open()` / `打开文件()` - Open file
- `read()` / `读取()` - Read file
- `write()` / `写入()` - Write file
- `close()` / `关闭()` - Close file

### Advanced Functions
- `search_builtin()` / `搜索函数()` - Search functions
- `ai_ask()` / `AI问答()` - AI assistance

## 🎮 Game Development Features

### Game-Specific Functions
- `create_sprite()` - Create game sprite
- `move_sprite()` - Move sprite
- `collision_detect()` - Detect collisions
- `play_sound()` - Play audio
- `draw_text()` - Draw text on screen

### AI Integration
- `ai_generate_code()` - Generate code with AI
- `ai_explain_code()` - Explain code with AI
- `ai_optimize_code()` - Optimize code with AI
- `ai_refactor_code()` - Refactor code with AI

## ⚙️ Configuration

### VS Code Settings
```json
{
    "files.associations": {
        "*.ln": "gamelang"
    },
    "gamelang.formatOnSave": true,
    "gamelang.enableLinting": true,
    "gamelang.enableIntelliSense": true
}
```

### Keybindings
- `Cmd+U` - Search builtin functions
- `Shift+Alt+F` - Format code
- `F5` - Run GameLang file
- `Cmd+Shift+P` - Open command palette

## 📁 Example Files

The extension includes 8 example files:
- `hello_world.ln` - Basic hello world
- `01_basic_syntax.ln` - Basic syntax examples
- `02_game_development.ln` - Game development examples
- `03_ai_integration.ln` - AI integration examples
- `04_debugging_demo.ln` - Debugging examples
- `05_chinese_programming.ln` - Chinese programming examples
- `06_mixed_language.ln` - Mixed language examples
- `07_dual_syntax.ln` - Dual syntax examples
- `test_run.ln` - Code execution test

## 🔍 Search Function

Press `Cmd+U` to search through 96 built-in functions:
- Search by function name (English/Chinese)
- Search by description
- Search by keywords
- View syntax and examples

## 🚀 Running Code

### Methods to Run
1. **F5 Key**: Press F5 to run current file
2. **Command Palette**: `Cmd+Shift+P` → "Run GameLang File"
3. **Right-click Menu**: Right-click → "Run GameLang File"
4. **Run Button**: Click the run button in VS Code

### Output
Results appear in the "GameLang Interpreter" output panel:
```
=== GameLang 代码执行 ===

[输出] Hello GameLang!
[变量] name = GameLang
[函数] abs(-10) = 10
[输出] Absolute value: 10

=== 执行完成 ===
```

## 🐛 Debugging

### Setup Debugging
1. Set breakpoints by clicking in the gutter
2. Press `F5` or use "Start Debugging" command
3. Use debug console and variable inspection

### Debug Features
- Breakpoint support
- Variable inspection
- Call stack viewing
- Step through code

## 📚 Documentation

- [Language Specification](docs/语言规范.md)
- [API Reference](docs/API参考.md)
- [Common Questions](docs/常见问题.md)
- [Module System Guide](docs/模块系统指南.md)
- [Change Log](CHANGELOG.md)

## 🔗 Links

- **Marketplace**: [GameLang Extension](https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang)
- **GitHub**: [Repository](https://github.com/ZLGame876/gamelang-vscode-extension)
- **Issues**: [Report Bugs](https://github.com/ZLGame876/gamelang-vscode-extension/issues)
- **Documentation**: [Full Documentation](https://github.com/ZLGame876/gamelang-vscode-extension#readme)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 What's New in v1.2.2

- **🎯 Code Execution**: Run GameLang code directly in VS Code!
- **📊 Output Panel**: View execution results in dedicated panel
- **🔧 GameLangInterpreter**: Complete code execution engine
- **📝 Error Handling**: Friendly error messages with line numbers
- **🚀 Built-in Functions**: All functions are now executable

Try running the `test_run.ln` example file to see the new execution feature in action! 