# 发布命令指南

## 🚀 发布步骤

### 1. 登录vsce (需要PAT)
```bash
vsce login gamelang-team
```
系统会提示输入Personal Access Token (PAT)

### 2. 验证登录状态
```bash
vsce verify-pat gamelang-team
```

### 3. 发布扩展
```bash
vsce publish
```

### 4. 验证发布
```bash
vsce show gamelang-team.gamelang
```

## 📋 发布前检查

### 必需信息
- ✅ 扩展名称: GameLang - Game Programming Language
- ✅ 版本: 1.0.0
- ✅ 发布者: gamelang-team
- ✅ 描述: Complete support for GameLang programming language
- ✅ 许可证: MIT
- ✅ 图标: images/icon.png

### 功能验证
- ✅ 语法高亮
- ✅ 智能提示
- ✅ 搜索功能 (Cmd+U)
- ✅ 代码格式化
- ✅ 语法检查
- ✅ 调试支持
- ✅ 代码片段

## 🎯 发布后验证

### 1. 检查Marketplace页面
- 访问: https://marketplace.visualstudio.com/items?itemName=gamelang-team.gamelang
- 确认信息正确显示
- 检查下载链接

### 2. 测试安装
- 在VS Code中搜索"GameLang"
- 安装扩展
- 测试所有功能

### 3. 监控反馈
- 查看用户评论
- 回复用户问题
- 收集改进建议

## 📊 推广计划

### 社交媒体
- Twitter/X: 发布公告
- Reddit: r/vscode, r/programming
- GitHub: 发布Release

### 技术社区
- Stack Overflow: 回答相关问题
- 技术博客: 写介绍文章
- 开发者论坛: 分享经验

---

**准备就绪，开始发布！** 🎉 