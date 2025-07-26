import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { GameLangDebugAdapter } from './debugger';
import { GameLangInterpreter } from './gamelang-interpreter';

export function activate(context: vscode.ExtensionContext) {
    console.log('=== GameLang Extension Activation ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extension.extensionPath);
    console.log('Extension Version:', context.extension.packageJSON.version);
    
    // 显示激活消息
    vscode.window.showInformationMessage('GameLang扩展已激活！搜索功能快捷键：Cmd+U');
    
    // 强制设置文件关联
    vscode.workspace.getConfiguration('files').update('associations', {
        '*.ln': 'gamelang'
    }, vscode.ConfigurationTarget.Global).then(() => {
        console.log('File association set successfully');
    });
    
    // 验证语言支持
    vscode.languages.getLanguages().then(languages => {
        console.log('Available languages:', languages);
        
        if (languages.includes('gamelang')) {
            console.log('GameLang language is properly registered');
            vscode.window.showInformationMessage('GameLang语言已正确注册！');
        } else {
            console.error('GameLang language is NOT registered!');
            vscode.window.showErrorMessage('GameLang语言注册失败！');
        }
    });
    
    // 监听文档打开事件，自动设置语言模式
    vscode.workspace.onDidOpenTextDocument((document) => {
        console.log('Document opened:', document.fileName, 'Language:', document.languageId);
        if (document.fileName.endsWith('.ln')) {
            vscode.languages.setTextDocumentLanguage(document, 'gamelang').then(() => {
                console.log('Language mode set to gamelang for:', document.fileName);
            });
        }
    });

    // 内置函数数据库（支持中英文）
    const builtinFunctions = {
        // 输出函数
        'print': {
            description: '打印输出，支持多参数',
            syntax: 'print(值1, 值2, ...)',
            example: 'print("Hello", "World")',
            keywords: ['打印', '输出', '显示', 'print'],
            chineseName: '打印'
        },
        '打印': {
            description: '打印输出，支持多参数',
            syntax: '打印(值1, 值2, ...)',
            example: '打印("你好", "世界")',
            keywords: ['打印', '输出', '显示', 'print'],
            chineseName: '打印'
        },
        
        // 输入函数
        'input': {
            description: '获取用户输入',
            syntax: 'input(提示)',
            example: 'name = input("请输入姓名：")',
            keywords: ['输入', '获取', '读取', 'input'],
            chineseName: '输入'
        },
        '输入': {
            description: '获取用户输入',
            syntax: '输入(提示)',
            example: '姓名 = 输入("请输入姓名：")',
            keywords: ['输入', '获取', '读取', 'input'],
            chineseName: '输入'
        },
        
        // 长度函数
        'len': {
            description: '获取列表、字符串等长度',
            syntax: 'len(对象)',
            example: 'length = len([1, 2, 3])',
            keywords: ['长度', '大小', '数量', 'len'],
            chineseName: '长度'
        },
        '长度': {
            description: '获取列表、字符串等长度',
            syntax: '长度(对象)',
            example: '长度值 = 长度([1, 2, 3])',
            keywords: ['长度', '大小', '数量', 'len'],
            chineseName: '长度'
        },
        
        // 类型函数
        'type': {
            description: '获取变量类型',
            syntax: 'type(变量)',
            example: 'var_type = type(name)',
            keywords: ['类型', '种类', 'type'],
            chineseName: '类型'
        },
        '类型': {
            description: '获取变量类型',
            syntax: '类型(变量)',
            example: '变量类型 = 类型(姓名)',
            keywords: ['类型', '种类', 'type'],
            chineseName: '类型'
        },
        
        // 字符串转换
        'str': {
            description: '转换为字符串',
            syntax: 'str(值)',
            example: 'text = str(123)',
            keywords: ['字符串', '文本', 'str'],
            chineseName: '字符串'
        },
        '字符串': {
            description: '转换为字符串',
            syntax: '字符串(值)',
            example: '文本 = 字符串(123)',
            keywords: ['字符串', '文本', 'str'],
            chineseName: '字符串'
        },
        
        // 整数转换
        'int': {
            description: '转换为整数',
            syntax: 'int(值)',
            example: 'number = int("123")',
            keywords: ['整数', '数字', 'int'],
            chineseName: '整数'
        },
        '整数': {
            description: '转换为整数',
            syntax: '整数(值)',
            example: '数字 = 整数("123")',
            keywords: ['整数', '数字', 'int'],
            chineseName: '整数'
        },
        
        // 浮点数转换
        'float': {
            description: '转换为浮点数',
            syntax: 'float(值)',
            example: 'decimal = float("3.14")',
            keywords: ['浮点', '小数', 'float'],
            chineseName: '浮点数'
        },
        '浮点数': {
            description: '转换为浮点数',
            syntax: '浮点数(值)',
            example: '小数 = 浮点数("3.14")',
            keywords: ['浮点', '小数', 'float'],
            chineseName: '浮点数'
        },
        
        // 布尔值转换
        'bool': {
            description: '转换为布尔值',
            syntax: 'bool(值)',
            example: 'is_true = bool(1)',
            keywords: ['布尔', '真假', 'bool'],
            chineseName: '布尔值'
        },
        '布尔值': {
            description: '转换为布尔值',
            syntax: '布尔值(值)',
            example: '是真 = 布尔值(1)',
            keywords: ['布尔', '真假', 'bool'],
            chineseName: '布尔值'
        },
        
        // 数学函数
        'abs': {
            description: '获取绝对值',
            syntax: 'abs(数值)',
            example: 'result = abs(-5)',
            keywords: ['绝对值', '绝对', 'abs'],
            chineseName: '绝对值'
        },
        '绝对值': {
            description: '获取绝对值',
            syntax: '绝对值(数值)',
            example: '结果 = 绝对值(-5)',
            keywords: ['绝对值', '绝对', 'abs'],
            chineseName: '绝对值'
        },
        
        'max': {
            description: '获取最大值',
            syntax: 'max(值1, 值2, ...)',
            example: 'maximum = max(1, 2, 3)',
            keywords: ['最大', '最大值', 'max'],
            chineseName: '最大值'
        },
        '最大值': {
            description: '获取最大值',
            syntax: '最大值(值1, 值2, ...)',
            example: '最大数 = 最大值(1, 2, 3)',
            keywords: ['最大', '最大值', 'max'],
            chineseName: '最大值'
        },
        
        'min': {
            description: '获取最小值',
            syntax: 'min(值1, 值2, ...)',
            example: 'minimum = min(1, 2, 3)',
            keywords: ['最小', '最小值', 'min'],
            chineseName: '最小值'
        },
        '最小值': {
            description: '获取最小值',
            syntax: '最小值(值1, 值2, ...)',
            example: '最小数 = 最小值(1, 2, 3)',
            keywords: ['最小', '最小值', 'min'],
            chineseName: '最小值'
        },
        
        'round': {
            description: '四舍五入',
            syntax: 'round(数值)',
            example: 'rounded = round(3.6)',
            keywords: ['四舍五入', '取整', 'round'],
            chineseName: '四舍五入'
        },
        '四舍五入': {
            description: '四舍五入',
            syntax: '四舍五入(数值)',
            example: '取整 = 四舍五入(3.6)',
            keywords: ['四舍五入', '取整', 'round'],
            chineseName: '四舍五入'
        },
        
        'sum': {
            description: '计算总和',
            syntax: 'sum(可迭代对象)',
            example: 'total = sum([1, 2, 3, 4, 5])',
            keywords: ['总和', '求和', 'sum'],
            chineseName: '总和'
        },
        '总和': {
            description: '计算总和',
            syntax: '总和(可迭代对象)',
            example: '总数 = 总和([1, 2, 3, 4, 5])',
            keywords: ['总和', '求和', 'sum'],
            chineseName: '总和'
        },
        
        // 随机函数
        'random': {
            description: '生成0-1随机小数',
            syntax: 'random()',
            example: 'rand = random()',
            keywords: ['随机', '随机数', 'random'],
            chineseName: '随机小数'
        },
        '随机小数': {
            description: '生成0-1随机小数',
            syntax: '随机小数()',
            example: '随机数 = 随机小数()',
            keywords: ['随机', '随机数', 'random'],
            chineseName: '随机小数'
        },
        
        'randint': {
            description: '生成指定范围随机整数',
            syntax: 'randint(最小值, 最大值)',
            example: 'rand_num = randint(1, 10)',
            keywords: ['随机整数', '随机数', 'randint'],
            chineseName: '随机整数'
        },
        '随机整数': {
            description: '生成指定范围随机整数',
            syntax: '随机整数(最小值, 最大值)',
            example: '随机数 = 随机整数(1, 10)',
            keywords: ['随机整数', '随机数', 'randint'],
            chineseName: '随机整数'
        },
        
        // 时间函数
        'now': {
            description: '获取当前时间',
            syntax: 'now()',
            example: 'current_time = now()',
            keywords: ['时间', '当前时间', '现在', 'now'],
            chineseName: '现在时间'
        },
        '现在时间': {
            description: '获取当前时间',
            syntax: '现在时间()',
            example: '当前时间 = 现在时间()',
            keywords: ['时间', '当前时间', '现在', 'now'],
            chineseName: '现在时间'
        },
        
        'sleep': {
            description: '暂停执行指定秒数',
            syntax: 'sleep(秒数)',
            example: 'sleep(1)',
            keywords: ['暂停', '等待', '延时', 'sleep'],
            chineseName: '暂停'
        },
        '暂停': {
            description: '暂停执行指定秒数',
            syntax: '暂停(秒数)',
            example: '暂停(1)',
            keywords: ['暂停', '等待', '延时', 'sleep'],
            chineseName: '暂停'
        },
        
        // 搜索函数
        'search_builtin': {
            description: '搜索内置函数',
            syntax: 'search_builtin(关键词)',
            example: 'search_builtin("print")',
            keywords: ['搜索', '查找', '内置函数', 'search'],
            chineseName: '搜索函数'
        },
        '搜索函数': {
            description: '搜索内置函数',
            syntax: '搜索函数(关键词)',
            example: '搜索函数("打印")',
            keywords: ['搜索', '查找', '内置函数', 'search'],
            chineseName: '搜索函数'
        },
        
        // AI函数
        'ai_ask': {
            description: 'AI问答功能',
            syntax: 'ai_ask(问题)',
            example: 'ai_ask("什么是GameLang？")',
            keywords: ['AI', '人工智能', '问答', 'ai'],
            chineseName: 'AI问答'
        },
        'AI问答': {
            description: 'AI问答功能',
            syntax: 'AI问答(问题)',
            example: 'AI问答("什么是GameLang？")',
            keywords: ['AI', '人工智能', '问答', 'ai'],
            chineseName: 'AI问答'
        },
        
        // 数据结构
        'list': {
            description: '创建列表',
            syntax: 'list(可迭代对象)',
            example: 'my_list = list([1, 2, 3])',
            keywords: ['列表', '数组', 'list'],
            chineseName: '列表'
        },
        '列表': {
            description: '创建列表',
            syntax: '列表(可迭代对象)',
            example: '我的列表 = 列表([1, 2, 3])',
            keywords: ['列表', '数组', 'list'],
            chineseName: '列表'
        },
        
        'dict': {
            description: '创建字典',
            syntax: 'dict(键值对)',
            example: 'my_dict = dict(name="张三", age=18)',
            keywords: ['字典', '映射', 'dict'],
            chineseName: '字典'
        },
        '字典': {
            description: '创建字典',
            syntax: '字典(键值对)',
            example: '我的字典 = 字典(姓名="张三", 年龄=18)',
            keywords: ['字典', '映射', 'dict'],
            chineseName: '字典'
        },
        
        'set': {
            description: '创建集合',
            syntax: 'set(可迭代对象)',
            example: 'my_set = set([1, 2, 3])',
            keywords: ['集合', 'set'],
            chineseName: '集合'
        },
        '集合': {
            description: '创建集合',
            syntax: '集合(可迭代对象)',
            example: '我的集合 = 集合([1, 2, 3])',
            keywords: ['集合', 'set'],
            chineseName: '集合'
        },
        
        // 排序和反转
        'sorted': {
            description: '排序',
            syntax: 'sorted(可迭代对象)',
            example: 'sorted_list = sorted([3, 1, 4, 1, 5])',
            keywords: ['排序', 'sorted'],
            chineseName: '排序'
        },
        '排序': {
            description: '排序',
            syntax: '排序(可迭代对象)',
            example: '排序列表 = 排序([3, 1, 4, 1, 5])',
            keywords: ['排序', 'sorted'],
            chineseName: '排序'
        },
        
        'reversed': {
            description: '反转',
            syntax: 'reversed(可迭代对象)',
            example: 'reversed_list = list(reversed([1, 2, 3]))',
            keywords: ['反转', '倒序', 'reversed'],
            chineseName: '反转'
        },
        '反转': {
            description: '反转',
            syntax: '反转(可迭代对象)',
            example: '反转列表 = 列表(反转([1, 2, 3]))',
            keywords: ['反转', '倒序', 'reversed'],
            chineseName: '反转'
        },
        
        // 迭代工具
        'enumerate': {
            description: '枚举',
            syntax: 'enumerate(可迭代对象)',
            example: 'for i, item in enumerate(["a", "b", "c"]):',
            keywords: ['枚举', 'enumerate'],
            chineseName: '枚举'
        },
        '枚举': {
            description: '枚举',
            syntax: '枚举(可迭代对象)',
            example: 'for i, item in 枚举(["a", "b", "c"]):',
            keywords: ['枚举', 'enumerate'],
            chineseName: '枚举'
        },
        
        'range': {
            description: '生成数字序列',
            syntax: 'range(开始, 结束, 步长)',
            example: 'for i in range(0, 10, 2):',
            keywords: ['范围', '序列', 'range'],
            chineseName: '范围'
        },
        '范围': {
            description: '生成数字序列',
            syntax: '范围(开始, 结束, 步长)',
            example: 'for i in 范围(0, 10, 2):',
            keywords: ['范围', '序列', 'range'],
            chineseName: '范围'
        },
        
        // 文件操作
        'open': {
            description: '打开文件',
            syntax: 'open(文件名, 模式)',
            example: 'file = open("test.txt", "r")',
            keywords: ['文件', '打开', 'open'],
            chineseName: '打开文件'
        },
        '打开文件': {
            description: '打开文件',
            syntax: '打开文件(文件名, 模式)',
            example: '文件 = 打开文件("test.txt", "r")',
            keywords: ['文件', '打开', 'open'],
            chineseName: '打开文件'
        },
        
        'read': {
            description: '读取文件内容',
            syntax: 'read()',
            example: 'content = file.read()',
            keywords: ['读取', 'read'],
            chineseName: '读取'
        },
        '读取': {
            description: '读取文件内容',
            syntax: '读取()',
            example: '内容 = 文件.读取()',
            keywords: ['读取', 'read'],
            chineseName: '读取'
        },
        
        'write': {
            description: '写入文件',
            syntax: 'write(内容)',
            example: 'file.write("Hello World")',
            keywords: ['写入', 'write'],
            chineseName: '写入'
        },
        '写入': {
            description: '写入文件',
            syntax: '写入(内容)',
            example: '文件.写入("Hello World")',
            keywords: ['写入', 'write'],
            chineseName: '写入'
        },
        
        'close': {
            description: '关闭文件',
            syntax: 'close()',
            example: 'file.close()',
            keywords: ['关闭', 'close'],
            chineseName: '关闭'
        },
        '关闭': {
            description: '关闭文件',
            syntax: '关闭()',
            example: '文件.关闭()',
            keywords: ['关闭', 'close'],
            chineseName: '关闭'
        },
        
        // 新增实用函数
        'add': {
            description: '添加元素到列表',
            syntax: 'add(列表, 元素)',
            example: 'add(my_list, "new_item")',
            keywords: ['添加', '增加', 'add'],
            chineseName: '添加'
        },
        '添加': {
            description: '添加元素到列表',
            syntax: '添加(列表, 元素)',
            example: '添加(我的列表, "新项目")',
            keywords: ['添加', '增加', 'add'],
            chineseName: '添加'
        },
        
        'remove': {
            description: '从列表中移除元素',
            syntax: 'remove(列表, 元素)',
            example: 'remove(my_list, "item")',
            keywords: ['移除', '删除', 'remove'],
            chineseName: '移除'
        },
        '移除': {
            description: '从列表中移除元素',
            syntax: '移除(列表, 元素)',
            example: '移除(我的列表, "项目")',
            keywords: ['移除', '删除', 'remove'],
            chineseName: '移除'
        },
        
        'update': {
            description: '更新字典中的值',
            syntax: 'update(字典, 键, 值)',
            example: 'update(my_dict, "key", "new_value")',
            keywords: ['更新', '修改', 'update'],
            chineseName: '更新'
        },
        '更新': {
            description: '更新字典中的值',
            syntax: '更新(字典, 键, 值)',
            example: '更新(我的字典, "键", "新值")',
            keywords: ['更新', '修改', 'update'],
            chineseName: '更新'
        },
        
        'create': {
            description: '创建新对象',
            syntax: 'create(类型, 参数)',
            example: 'create("list", [1, 2, 3])',
            keywords: ['创建', '建立', 'create'],
            chineseName: '创建'
        },
        '创建': {
            description: '创建新对象',
            syntax: '创建(类型, 参数)',
            example: '创建("列表", [1, 2, 3])',
            keywords: ['创建', '建立', 'create'],
            chineseName: '创建'
        },
        
        'delete': {
            description: '删除文件或对象',
            syntax: 'delete(路径或对象)',
            example: 'delete("file.txt")',
            keywords: ['删除', 'del', 'delete'],
            chineseName: '删除'
        },
        '删除': {
            description: '删除文件或对象',
            syntax: '删除(路径或对象)',
            example: '删除("文件.txt")',
            keywords: ['删除', 'del', 'delete'],
            chineseName: '删除'
        },
        
        'copy': {
            description: '复制文件或对象',
            syntax: 'copy(源, 目标)',
            example: 'copy("source.txt", "dest.txt")',
            keywords: ['复制', '拷贝', 'copy'],
            chineseName: '复制'
        },
        '复制': {
            description: '复制文件或对象',
            syntax: '复制(源, 目标)',
            example: '复制("源文件.txt", "目标文件.txt")',
            keywords: ['复制', '拷贝', 'copy'],
            chineseName: '复制'
        },
        
        'move': {
            description: '移动文件或对象',
            syntax: 'move(源, 目标)',
            example: 'move("old.txt", "new.txt")',
            keywords: ['移动', 'move'],
            chineseName: '移动'
        },
        '移动': {
            description: '移动文件或对象',
            syntax: '移动(源, 目标)',
            example: '移动("旧文件.txt", "新文件.txt")',
            keywords: ['移动', 'move'],
            chineseName: '移动'
        },
        
        'find': {
            description: '查找元素',
            syntax: 'find(列表, 条件)',
            example: 'find(my_list, lambda x: x > 5)',
            keywords: ['查找', '寻找', 'find'],
            chineseName: '查找'
        },
        '查找': {
            description: '查找元素',
            syntax: '查找(列表, 条件)',
            example: '查找(我的列表, lambda x: x > 5)',
            keywords: ['查找', '寻找', 'find'],
            chineseName: '查找'
        },
        
        'replace': {
            description: '替换字符串中的内容',
            syntax: 'replace(字符串, 旧值, 新值)',
            example: 'replace("Hello World", "World", "GameLang")',
            keywords: ['替换', 'replace'],
            chineseName: '替换'
        },
        '替换': {
            description: '替换字符串中的内容',
            syntax: '替换(字符串, 旧值, 新值)',
            example: '替换("你好世界", "世界", "GameLang")',
            keywords: ['替换', 'replace'],
            chineseName: '替换'
        },
        
        'split': {
            description: '分割字符串',
            syntax: 'split(字符串, 分隔符)',
            example: 'split("a,b,c", ",")',
            keywords: ['分割', 'split'],
            chineseName: '分割'
        },
        '分割': {
            description: '分割字符串',
            syntax: '分割(字符串, 分隔符)',
            example: '分割("a,b,c", ",")',
            keywords: ['分割', 'split'],
            chineseName: '分割'
        },
        
        'join': {
            description: '连接字符串列表',
            syntax: 'join(分隔符, 字符串列表)',
            example: 'join(",", ["a", "b", "c"])',
            keywords: ['连接', 'join'],
            chineseName: '连接'
        },
        '连接': {
            description: '连接字符串列表',
            syntax: '连接(分隔符, 字符串列表)',
            example: '连接(",", ["a", "b", "c"])',
            keywords: ['连接', 'join'],
            chineseName: '连接'
        },
        
        'filter': {
            description: '过滤列表',
            syntax: 'filter(列表, 条件)',
            example: 'filter([1, 2, 3, 4, 5], lambda x: x > 2)',
            keywords: ['过滤', 'filter'],
            chineseName: '过滤'
        },
        '过滤': {
            description: '过滤列表',
            syntax: '过滤(列表, 条件)',
            example: '过滤([1, 2, 3, 4, 5], lambda x: x > 2)',
            keywords: ['过滤', 'filter'],
            chineseName: '过滤'
        },
        
        'map': {
            description: '映射函数到列表',
            syntax: 'map(函数, 列表)',
            example: 'map(lambda x: x * 2, [1, 2, 3])',
            keywords: ['映射', 'map'],
            chineseName: '映射'
        },
        '映射': {
            description: '映射函数到列表',
            syntax: '映射(函数, 列表)',
            example: '映射(lambda x: x * 2, [1, 2, 3])',
            keywords: ['映射', 'map'],
            chineseName: '映射'
        },
        
        'reduce': {
            description: '归约列表',
            syntax: 'reduce(函数, 列表)',
            example: 'reduce(lambda x, y: x + y, [1, 2, 3, 4])',
            keywords: ['归约', 'reduce'],
            chineseName: '归约'
        },
        '归约': {
            description: '归约列表',
            syntax: '归约(函数, 列表)',
            example: '归约(lambda x, y: x + y, [1, 2, 3, 4])',
            keywords: ['归约', 'reduce'],
            chineseName: '归约'
        },
        
        'count': {
            description: '计算元素出现次数',
            syntax: 'count(列表, 元素)',
            example: 'count([1, 2, 2, 3, 2], 2)',
            keywords: ['计数', 'count'],
            chineseName: '计数'
        },
        '计数': {
            description: '计算元素出现次数',
            syntax: '计数(列表, 元素)',
            example: '计数([1, 2, 2, 3, 2], 2)',
            keywords: ['计数', 'count'],
            chineseName: '计数'
        },
        
        'index': {
            description: '获取元素索引',
            syntax: 'index(列表, 元素)',
            example: 'index([1, 2, 3], 2)',
            keywords: ['索引', 'index'],
            chineseName: '索引'
        },
        '索引': {
            description: '获取元素索引',
            syntax: '索引(列表, 元素)',
            example: '索引([1, 2, 3], 2)',
            keywords: ['索引', 'index'],
            chineseName: '索引'
        },
        
        'insert': {
            description: '在指定位置插入元素',
            syntax: 'insert(列表, 位置, 元素)',
            example: 'insert(my_list, 1, "new_item")',
            keywords: ['插入', 'insert'],
            chineseName: '插入'
        },
        '插入': {
            description: '在指定位置插入元素',
            syntax: '插入(列表, 位置, 元素)',
            example: '插入(我的列表, 1, "新项目")',
            keywords: ['插入', 'insert'],
            chineseName: '插入'
        },
        
        'pop': {
            description: '移除并返回列表最后一个元素',
            syntax: 'pop(列表)',
            example: 'last_item = pop(my_list)',
            keywords: ['弹出', 'pop'],
            chineseName: '弹出'
        },
        '弹出': {
            description: '移除并返回列表最后一个元素',
            syntax: '弹出(列表)',
            example: '最后项目 = 弹出(我的列表)',
            keywords: ['弹出', 'pop'],
            chineseName: '弹出'
        },
        
        'clear': {
            description: '清空列表或字典',
            syntax: 'clear(对象)',
            example: 'clear(my_list)',
            keywords: ['清空', 'clear'],
            chineseName: '清空'
        },
        '清空': {
            description: '清空列表或字典',
            syntax: '清空(对象)',
            example: '清空(我的列表)',
            keywords: ['清空', 'clear'],
            chineseName: '清空'
        },
        
        'exists': {
            description: '检查文件或键是否存在',
            syntax: 'exists(路径或键)',
            example: 'exists("file.txt")',
            keywords: ['存在', 'exists'],
            chineseName: '存在'
        },
        '存在': {
            description: '检查文件或键是否存在',
            syntax: '存在(路径或键)',
            example: '存在("文件.txt")',
            keywords: ['存在', 'exists'],
            chineseName: '存在'
        },
        
        'is_empty': {
            description: '检查对象是否为空',
            syntax: 'is_empty(对象)',
            example: 'is_empty(my_list)',
            keywords: ['为空', 'is_empty'],
            chineseName: '为空'
        },
        '为空': {
            description: '检查对象是否为空',
            syntax: '为空(对象)',
            example: '为空(我的列表)',
            keywords: ['为空', 'is_empty'],
            chineseName: '为空'
        }
    };

    // 注册搜索命令
    let searchCommand = vscode.commands.registerCommand('gamelang.searchBuiltin', async () => {
        const searchTerm = await vscode.window.showInputBox({
            prompt: '请输入要搜索的GameLang内置函数',
            placeHolder: '例如: 打印, 输入, 长度, 随机, 打印...'
        });

        if (searchTerm) {
            try {
                // 简化的搜索逻辑
                const searchLower = searchTerm.toLowerCase();
                const matches = Object.keys(builtinFunctions).filter(func => {
                    const funcInfo = builtinFunctions[func as keyof typeof builtinFunctions];
                    
                    // 检查函数名
                    if (func.toLowerCase().includes(searchLower)) return true;
                    
                    // 检查描述
                    if (funcInfo.description.toLowerCase().includes(searchLower)) return true;
                    
                    // 检查关键词
                    if (funcInfo.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))) return true;
                    
                    return false;
                });

                if (matches.length > 0) {
                    // 创建输出面板
                    const output = vscode.window.createOutputChannel('GameLang Search');
                    output.clear();
                    output.appendLine(`搜索 "${searchTerm}" 的结果:`);
                    output.appendLine('');

                    matches.forEach(func => {
                        const funcInfo = builtinFunctions[func as keyof typeof builtinFunctions];
                        output.appendLine(`📋 ${func}`);
                        output.appendLine(`   描述: ${funcInfo.description}`);
                        output.appendLine(`   语法: ${funcInfo.syntax}`);
                        output.appendLine(`   示例: ${funcInfo.example}`);
                        output.appendLine('');
                    });

                    output.show();
                    vscode.window.showInformationMessage(`找到 ${matches.length} 个匹配的函数`);
                } else {
                    vscode.window.showWarningMessage(`未找到包含 "${searchTerm}" 的内置函数`);
                }
                
            } catch (error) {
                vscode.window.showErrorMessage(`搜索失败: ${error}`);
            }
        }
    });

    // 注册调试配置提供者
    const debugProvider = vscode.debug.registerDebugConfigurationProvider('gamelang', {
        provideDebugConfigurations(folder: vscode.WorkspaceFolder | undefined, token?: vscode.CancellationToken): vscode.DebugConfiguration[] {
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
        createDebugAdapterDescriptor(session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
            return new vscode.DebugAdapterInlineImplementation(new GameLangDebugAdapter());
        }
    });

    // 注册代码补全提供者
    const completionProvider = vscode.languages.registerCompletionItemProvider('gamelang', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            const completions: vscode.CompletionItem[] = [];

            // 内置函数
            Object.keys(builtinFunctions).forEach(func => {
                const funcInfo = builtinFunctions[func as keyof typeof builtinFunctions];
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = `GameLang Built-in: ${funcInfo.description}`;
                item.documentation = new vscode.MarkdownString(`**${func}**\n\n${funcInfo.description}\n\n**语法:** ${funcInfo.syntax}\n\n**示例:** ${funcInfo.example}`);
                completions.push(item);
            });

            // 关键字（支持中英文）
            const keywords = [
                // 英文关键字
                'fn', 'class', 'if', 'elif', 'else', 'while', 'for', 'return', 'import', 'use',
                // 中文关键字
                '函数', '类', '如果', '否则如果', '否则', '当', '循环', '返回', '导入', '使用'
            ];
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
        provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return null;

            const word = document.getText(range);
            
            // 检查是否是内置函数
            if (builtinFunctions[word as keyof typeof builtinFunctions]) {
                const funcInfo = builtinFunctions[word as keyof typeof builtinFunctions];
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
        provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
            const edits: vscode.TextEdit[] = [];
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
                    } else if (trimmedLine.startsWith('else:') || trimmedLine.startsWith('elif ')) {
                        // else/elif 语句与对应的 if 语句同级
                        lineIndentLevel = currentIndentLevel;
                    } else if (trimmedLine.startsWith('return ') || trimmedLine.startsWith('print ') || 
                               trimmedLine.startsWith('break') || trimmedLine.startsWith('continue') ||
                               trimmedLine.startsWith('import ') || trimmedLine.startsWith('use ')) {
                        // 这些语句在函数/类内部，需要缩进
                        lineIndentLevel = currentIndentLevel;
                    } else if (trimmedLine.startsWith('fn ') || trimmedLine.startsWith('class ')) {
                        // 函数和类定义在顶层
                        currentIndentLevel = 0;
                        lineIndentLevel = 0;
                    } else if (trimmedLine.startsWith('if ') || trimmedLine.startsWith('while ') || 
                               trimmedLine.startsWith('for ')) {
                        // 控制语句在顶层
                        lineIndentLevel = currentIndentLevel;
                    } else {
                        // 其他语句（变量赋值等）
                        lineIndentLevel = currentIndentLevel;
                    }
                    
                    const newIndent = '    '.repeat(lineIndentLevel);
                    const newLine = newIndent + trimmedLine;
                    
                    if (newLine !== line) {
                        const range = new vscode.Range(i, 0, i, line.length);
                        edits.push(vscode.TextEdit.replace(range, newLine));
                    }
                } else {
                    // 空行，重置缩进
                    currentIndentLevel = 0;
                }
            }
            
            return edits;
        }
    });

    // 注册语法诊断
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('gamelang');
    
    const updateDiagnostics = (document: vscode.TextDocument) => {
        if (document.languageId !== 'gamelang') return;
        
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // 检查语法错误 - 支持双语法
            // 不再报错，因为现在支持大括号语法
            // if (line.includes('){') || line.includes('}(')) {
            //     const range = new vscode.Range(i, 0, i, line.length);
            //     diagnostics.push(new vscode.Diagnostic(
            //         range,
            //         '语法错误：GameLang使用冒号(:)而不是大括号({})',
            //         vscode.DiagnosticSeverity.Error
            //     ));
            // }
            
            // 检查未闭合的字符串
            const quoteCount = (line.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) {
                const range = new vscode.Range(i, 0, i, line.length);
                diagnostics.push(new vscode.Diagnostic(
                    range,
                    '字符串未闭合',
                    vscode.DiagnosticSeverity.Error
                ));
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
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            const snippets: vscode.CompletionItem[] = [];

            // 英文代码片段
            const fnSnippet = new vscode.CompletionItem('fn', vscode.CompletionItemKind.Snippet);
            fnSnippet.insertText = new vscode.SnippetString('fn ${1:函数名}(${2:参数}):\n\t${3:# 函数体}');
            fnSnippet.documentation = new vscode.MarkdownString('创建函数定义 (英文)');
            snippets.push(fnSnippet);

            const classSnippet = new vscode.CompletionItem('class', vscode.CompletionItemKind.Snippet);
            classSnippet.insertText = new vscode.SnippetString('class ${1:类名}:\n\t${2:# 类属性}');
            classSnippet.documentation = new vscode.MarkdownString('创建类定义 (英文)');
            snippets.push(classSnippet);

            const ifSnippet = new vscode.CompletionItem('if', vscode.CompletionItemKind.Snippet);
            ifSnippet.insertText = new vscode.SnippetString('if ${1:条件}:\n\t${2:# 代码块}');
            ifSnippet.documentation = new vscode.MarkdownString('创建if条件语句 (英文)');
            snippets.push(ifSnippet);

            const whileSnippet = new vscode.CompletionItem('while', vscode.CompletionItemKind.Snippet);
            whileSnippet.insertText = new vscode.SnippetString('while ${1:条件}:\n\t${2:# 循环体}');
            whileSnippet.documentation = new vscode.MarkdownString('创建while循环 (英文)');
            snippets.push(whileSnippet);

            const forSnippet = new vscode.CompletionItem('for', vscode.CompletionItemKind.Snippet);
            forSnippet.insertText = new vscode.SnippetString('for ${1:变量} in ${2:可迭代对象}:\n\t${3:# 循环体}');
            forSnippet.documentation = new vscode.MarkdownString('创建for循环 (英文)');
            snippets.push(forSnippet);

            // 中文代码片段
            const fnChineseSnippet = new vscode.CompletionItem('函数', vscode.CompletionItemKind.Snippet);
            fnChineseSnippet.insertText = new vscode.SnippetString('函数 ${1:函数名}(${2:参数}):\n\t${3:# 函数体}');
            fnChineseSnippet.documentation = new vscode.MarkdownString('创建函数定义 (中文)');
            snippets.push(fnChineseSnippet);

            const classChineseSnippet = new vscode.CompletionItem('类', vscode.CompletionItemKind.Snippet);
            classChineseSnippet.insertText = new vscode.SnippetString('类 ${1:类名}:\n\t${2:# 类属性}');
            classChineseSnippet.documentation = new vscode.MarkdownString('创建类定义 (中文)');
            snippets.push(classChineseSnippet);

            const ifChineseSnippet = new vscode.CompletionItem('如果', vscode.CompletionItemKind.Snippet);
            ifChineseSnippet.insertText = new vscode.SnippetString('如果 ${1:条件}:\n\t${2:# 代码块}');
            ifChineseSnippet.documentation = new vscode.MarkdownString('创建if条件语句 (中文)');
            snippets.push(ifChineseSnippet);

            const whileChineseSnippet = new vscode.CompletionItem('当', vscode.CompletionItemKind.Snippet);
            whileChineseSnippet.insertText = new vscode.SnippetString('当 ${1:条件}:\n\t${2:# 循环体}');
            whileChineseSnippet.documentation = new vscode.MarkdownString('创建while循环 (中文)');
            snippets.push(whileChineseSnippet);

            const forChineseSnippet = new vscode.CompletionItem('循环', vscode.CompletionItemKind.Snippet);
            forChineseSnippet.insertText = new vscode.SnippetString('循环 ${1:变量} 在 ${2:可迭代对象}:\n\t${3:# 循环体}');
            forChineseSnippet.documentation = new vscode.MarkdownString('创建for循环 (中文)');
            snippets.push(forChineseSnippet);

            // 大括号语法代码片段
            const fnBraceSnippet = new vscode.CompletionItem('fn{}', vscode.CompletionItemKind.Snippet);
            fnBraceSnippet.insertText = new vscode.SnippetString('fn ${1:函数名}(${2:参数}) {\n\t${3:// 函数体}\n}');
            fnBraceSnippet.documentation = new vscode.MarkdownString('创建函数定义 (大括号语法)');
            snippets.push(fnBraceSnippet);

            const classBraceSnippet = new vscode.CompletionItem('class{}', vscode.CompletionItemKind.Snippet);
            classBraceSnippet.insertText = new vscode.SnippetString('class ${1:类名} {\n\t${2:// 类属性}\n}');
            classBraceSnippet.documentation = new vscode.MarkdownString('创建类定义 (大括号语法)');
            snippets.push(classBraceSnippet);

            const ifBraceSnippet = new vscode.CompletionItem('if{}', vscode.CompletionItemKind.Snippet);
            ifBraceSnippet.insertText = new vscode.SnippetString('if (${1:条件}) {\n\t${2:// 代码块}\n}');
            ifBraceSnippet.documentation = new vscode.MarkdownString('创建if条件语句 (大括号语法)');
            snippets.push(ifBraceSnippet);

            const whileBraceSnippet = new vscode.CompletionItem('while{}', vscode.CompletionItemKind.Snippet);
            whileBraceSnippet.insertText = new vscode.SnippetString('while (${1:条件}) {\n\t${2:// 循环体}\n}');
            whileBraceSnippet.documentation = new vscode.MarkdownString('创建while循环 (大括号语法)');
            snippets.push(whileBraceSnippet);

            const forBraceSnippet = new vscode.CompletionItem('for{}', vscode.CompletionItemKind.Snippet);
            forBraceSnippet.insertText = new vscode.SnippetString('for (${1:变量} in ${2:范围}) {\n\t${3:// 循环体}\n}');
            forBraceSnippet.documentation = new vscode.MarkdownString('创建for循环 (大括号语法)');
            snippets.push(forBraceSnippet);

            return snippets;
        }
    }, 'f', 'c', 'i', 'w');

    // 注册缺失的命令实现
    const formatCodeCommand = vscode.commands.registerCommand('gamelang.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.commands.executeCommand('editor.action.formatDocument');
            vscode.window.showInformationMessage('GameLang代码格式化完成');
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const lintCodeCommand = vscode.commands.registerCommand('gamelang.lintCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            updateDiagnostics(editor.document);
            vscode.window.showInformationMessage('GameLang代码检查完成');
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const runFileCommand = vscode.commands.registerCommand('gamelang.runFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            try {
                const code = editor.document.getText();
                const interpreter = new GameLangInterpreter();
                await interpreter.execute(code);
                vscode.window.showInformationMessage('GameLang代码执行完成！');
            } catch (error) {
                vscode.window.showErrorMessage(`运行错误: ${error}`);
            }
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const aiGenerateCommand = vscode.commands.registerCommand('gamelang.aiGenerate', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.window.showInformationMessage('GameLang AI代码生成功能开发中...');
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const aiExplainCommand = vscode.commands.registerCommand('gamelang.aiExplain', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                vscode.window.showInformationMessage('GameLang AI代码解释功能开发中...');
            } else {
                vscode.window.showWarningMessage('请先选择要解释的代码');
            }
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const aiOptimizeCommand = vscode.commands.registerCommand('gamelang.aiOptimize', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                vscode.window.showInformationMessage('GameLang AI代码优化功能开发中...');
            } else {
                vscode.window.showWarningMessage('请先选择要优化的代码');
            }
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const aiRefactorCommand = vscode.commands.registerCommand('gamelang.aiRefactor', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                vscode.window.showInformationMessage('GameLang AI代码重构功能开发中...');
            } else {
                vscode.window.showWarningMessage('请先选择要重构的代码');
            }
        } else {
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
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const toggleBreakpointCommand = vscode.commands.registerCommand('gamelang.toggleBreakpoint', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.commands.executeCommand('editor.debug.action.toggleBreakpoint');
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const showVariablesCommand = vscode.commands.registerCommand('gamelang.showVariables', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.window.showInformationMessage('GameLang变量查看功能开发中...');
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    const debugConsoleCommand = vscode.commands.registerCommand('gamelang.debugConsole', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'gamelang') {
            vscode.commands.executeCommand('workbench.debug.action.toggleRepl');
        } else {
            vscode.window.showWarningMessage('请在GameLang文件中使用此命令');
        }
    });

    // 注册所有提供者
    context.subscriptions.push(
        searchCommand,
        formatCodeCommand,
        lintCodeCommand,
        runFileCommand,
        aiGenerateCommand,
        aiExplainCommand,
        aiOptimizeCommand,
        aiRefactorCommand,
        startDebugCommand,
        toggleBreakpointCommand,
        showVariablesCommand,
        debugConsoleCommand,
        debugProvider,
        debugAdapterFactory,
        completionProvider,
        hoverProvider,
        formattingProvider,
        diagnosticCollection,
        changeDocumentListener,
        openDocumentListener,
        snippetProvider
    );
}

export function deactivate() {} 