# VS Code扩展发布指南

## 📋 发布前检查清单

### ✅ 必需文件
- [x] `package.json` - 扩展配置
- [x] `README.md` - 扩展说明
- [x] `CHANGELOG.md` - 更新日志
- [x] `LICENSE` - 许可证文件
- [x] `images/icon.png` - 扩展图标 (128x128)
- [x] `out/extension.js` - 编译后的扩展代码

### ✅ 功能测试
- [x] 语法高亮正常工作
- [x] 智能提示功能正常
- [x] 搜索功能正常 (Cmd+U)
- [x] 代码格式化正常
- [x] 语法检查正常
- [x] 调试功能正常
- [x] 代码片段正常

### ✅ 文档检查
- [x] README包含完整功能介绍
- [x] 安装和使用说明清晰
- [x] 代码示例正确
- [x] 快捷键说明完整

## 🚀 发布步骤

### 1. 创建Microsoft开发者账户
1. 访问 [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
2. 点击 "Sign in" 登录Microsoft账户
3. 如果没有账户，需要先注册

### 2. 安装vsce工具
```bash
npm install -g @vscode/vsce
```

### 3. 登录vsce
```bash
vsce login <publisher-name>
```

### 4. 打包扩展
```bash
vsce package
```

### 5. 发布扩展
```bash
vsce publish
```

## 📝 发布信息

### 扩展信息
- **名称**: GameLang - Game Programming Language
- **ID**: gamelang
- **发布者**: gamelang-team
- **版本**: 1.0.0
- **描述**: Complete support for GameLang programming language with syntax highlighting, IntelliSense, debugging, and AI integration

### 分类标签
- Programming Languages
- Debuggers
- Snippets
- Other

### 关键词
- gamelang
- game
- programming
- language
- chinese
- ai
- debugging
- syntax-highlighting

## 🎯 发布后推广

### 1. 社交媒体
- 在Twitter/X上发布公告
- 在Reddit相关社区分享
- 在GitHub上发布Release

### 2. 技术社区
- 在Stack Overflow上回答相关问题
- 在技术博客上写介绍文章
- 在开发者论坛上分享

### 3. 文档和教程
- 创建使用教程视频
- 编写详细的使用指南
- 提供示例项目

## 📊 发布后监控

### 1. 下载量统计
- 监控扩展下载量
- 关注用户评分
- 查看用户反馈

### 2. 问题反馈
- 及时回复用户问题
- 收集功能建议
- 修复bug报告

### 3. 版本更新
- 根据反馈改进功能
- 定期发布更新
- 保持与VS Code版本兼容

## 🔧 常见问题

### Q: 发布失败怎么办？
A: 检查package.json配置，确保所有必需字段都正确填写。

### Q: 如何更新扩展？
A: 修改版本号，重新打包并发布。

### Q: 如何删除扩展？
A: 在Marketplace管理页面可以下架扩展。

---

**祝发布成功！** 🎉 