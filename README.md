<div align="center">

# 知乎智能助手 🚀

一款专为知乎用户设计的智能浏览器插件，提升你的知乎阅读体验

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)

</div>

> [!NOTE]
> 基于 [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) 构建

> [!TIP]
> 支持主题切换、广告过滤、AI总结等智能功能
> 让知乎回归纯粹的知识分享体验

## 目录

- [项目介绍](#项目介绍)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
  - [开发环境](#开发环境)
  - [安装插件](#安装插件)
- [项目结构](#项目结构)
  - [核心功能模块](#核心功能模块)
  - [技术架构](#技术架构)
- [配置说明](#配置说明)
- [开发指南](#开发指南)
- [技术栈](#技术栈)
- [参考资料](#参考资料)

## 项目介绍

知乎智能助手是一款专为知乎用户设计的Chrome浏览器插件，旨在通过智能化工具显著提升知乎的浏览体验。

### 解决的问题
- 🚫 **广告干扰** - 知乎页面广告和推荐内容过多，影响阅读体验
- 📖 **信息过载** - 长篇回答阅读负担重，难以快速获取核心观点
- 🎨 **视觉疲劳** - 缺乏护眼主题，长时间阅读容易疲劳
- ⏱️ **效率不高** - 需要手动筛选高质量回答，耗时较长

### 核心价值
让知乎回归纯粹的知识分享平台体验，帮助用户高效获取有价值的信息。

## 功能特性

### 🎨 主题美化
- **多主题支持** - 默认、暗黑、护眼三种预设主题
- **一键切换** - 通过插件弹窗快速切换主题
- **视觉优化** - 优化字体、间距、配色，提升阅读舒适度
- **即时生效** - 主题切换无需刷新页面

### 🚫 智能过滤
- **广告移除** - 自动识别并隐藏信息流广告
- **推广过滤** - 清理侧边栏推广内容和软文推荐
- **页面净化** - 保持页面布局整洁，专注优质内容
- **规则可配** - 支持自定义过滤规则

### 📚 内容聚合
- **智能提取** - 自动提取问答页面所有回答
- **排序展示** - 按赞同数降序在侧边栏展示
- **快速预览** - 卡片式展示回答摘要
- **一键复制** - 支持复制回答内容到剪贴板

### 🤖 AI增强
- **智能总结** - 调用大模型API生成回答核心观点
- **多模型支持** - 兼容OpenAI、通义千问等主流API
- **批量分析** - 综合分析多个高赞回答的不同���点
- **安全存储** - API密钥加密存储

### ⌨️ 快捷操作
- **键盘快捷键** - Alt+Z切换侧边栏，Alt+C复制，Alt+S总结
- **设备同步** - 设置通过Chrome账号同步到不同设备
- **响应式设计** - 支持不同屏幕尺寸自适应

## 快速开始

### 开发环境

> [!IMPORTANT]  
> 确保你的开发环境满足以下要求：
> - Node.js >= 22.12.0 (推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理版本)
> - pnpm >= 9.15.1 (包管理器)
> - Chrome/Edge 浏览器用于调试

1. **克隆项目**
   ```bash
   git clone https://github.com/yiancode/Zhihu-Smart-Assistant.git
   cd Zhihu-Smart-Assistant
   ```

2. **安装依赖**
   ```bash
   npm install -g pnpm  # 安装 pnpm
   pnpm install        # 安装项目依赖
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev           # Chrome 开发模式
   # 或
   pnpm dev:firefox   # Firefox 开发模式
   ```

4. **构建生产版本**
   ```bash
   pnpm build         # Chrome 生产构建
   pnpm zip          # 构建并打包为 zip 文件
   ```

### 安装插件

#### 开发环境安装

1. 打开Chrome浏览器，访问 `chrome://extensions`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录下的 `dist` 文件夹
5. 插件安装成功，可以在工具栏看到插件图标

#### 生产环境安装

1. 下载 [Release](https://github.com/yiancode/Zhihu-Smart-Assistant/releases) 中的 `.zip` 文件
2. 按照上述开发环境安装步骤操作
3. 或通过Chrome Web Store安装（待上架）

## 项目结构

### 核心功能模块

```
src/
├── background/              # 后台服务 (Service Worker)
│   ├── index.ts
│   ├── messages/           # 消息处理
│   └── services/           # AI、存储等服务
├── content/                # 内容脚本 (注入知乎页面)
│   ├── components/
│   │   ├── Sidebar/       # 侧边栏组件
│   │   └── ThemeInjector/ # 主题注入
│   └── hooks/             # 内容提取、广告过滤钩子
├── popup/                  # 插件弹窗界面
│   ├── components/
│   │   ├── ThemeSelector.tsx
│   │   └── QuickSettings.tsx
│   └── App.tsx
├── options/                # 设置页面
│   ├── pages/
│   │   ├── ThemeSettings.tsx
│   │   ├── FilterSettings.tsx
│   │   └── AISettings.tsx
│   └── App.tsx
└── shared/                 # 共享代码
    ├── types/             # TypeScript 类型定义
    ├── utils/             # 工具函数
    ├── stores/            # 状态管理 (Zustand)
    └── constants/         # 常量定义
```

### 技术架构

- **Monorepo结构** - 使用Turborepo管理多包项目
- **模块化设计** - 各功能模块独立，便于维护和测试
- **类型安全** - 全面使用TypeScript，减少运行时错误
- **现代构建** - Vite提供快速的开发和构建体验

## 配置说明

### 环境变量

1. 复制 `.example.env` 为 `.env`
2. 配置必要的环境变量：

```env
# AI API 配置 (可选，也可在插件设置中配置)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_BASE_URL=https://api.openai.com/v1

# 开发配置
VITE_DEV_MODE=true
```

### AI服务配置

插件支持多种AI服务提供商：

- **OpenAI** - GPT-3.5/GPT-4 系列模型
- **自定义端点** - 兼容OpenAI API格式的其他服务
- **本地模型** - 支持Ollama等本地部署方案

在插件设置页面中配置API密钥和选择模型。

## 开发指南

### 常用命令

```bash
# 开发相关
pnpm dev                    # 启动开发服务器 (Chrome)
pnpm dev:firefox           # 启动开发服务器 (Firefox)
pnpm build                 # 生产构建
pnpm build:firefox         # Firefox 构建

# 代码质量
pnpm type-check            # TypeScript 类型检查
pnpm lint                  # ESLint 代码检查
pnpm lint:fix             # ESLint 自动修复
pnpm prettier             # Prettier 格式化

# 测试和打包
pnpm e2e                  # 端到端测试
pnpm zip                  # 构建并打包为 zip 文件
```

### 开发规范

1. **代码风格** - 项目使用 ESLint + Prettier 确保代码风格一致
2. **类型安全** - 充分利用 TypeScript 的类型系统
3. **组件设计** - 遵循 React 最佳实践，保持组件单一职责
4. **提交规范** - 使用 [Conventional Commits](https://conventionalcommits.org/) 规范

### 调试技巧

1. **插件调试**
   - 在 `chrome://extensions` 中查看插件状态
   - 使用 DevTools 调试各个页面组件
   - Background Script 在插件详情页的 "检查视图" 中调试

2. **内容脚本调试**
   - 在知乎页面打开 DevTools
   - 在 Console 中可以访问注入的脚本
   - 使用 `console.log` 和断点调试

### 故障排除

#### 热重载失效

如果保存文件后插件没有自动重新加载：

1. 停止开发服务器 (Ctrl+C) 并重新启动 `pnpm dev`
2. 如果遇到 `grpc` 错误，终止 `turbo` 进程后重新启动
3. 在浏览器插件页面手动点击刷新按钮

#### 构建错误

1. 确保 Node.js 版本 >= 22.12.0
2. 清除缓存并重新安装依赖：
   ```bash
   pnpm clean
   pnpm install
   ```
3. 检查是否有 TypeScript 类型错误：
   ```bash
   pnpm type-check
   ```

## 技术栈

### 核心框架
- **[React 18](https://reactjs.org/)** - 现代化用户界面库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript 超集
- **[Vite](https://vitejs.dev/)** - 快速的构建工具和开发服务器
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化CSS框架，支持主题切换

### Chrome扩展
- **[Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)** - 最新的Chrome扩展标准
- **[Chrome APIs](https://developer.chrome.com/docs/extensions/reference/)** - 丰富的浏览器API支持
- **Content Scripts** - 页面内容注入和交互
- **Service Worker** - 后台任务处理

### 开发工具
- **[Turborepo](https://turbo.build/repo)** - 高性能构建系统
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - 代码质量和格式化
- **[WebdriverIO](https://webdriver.io/)** - 端到端测试框架

### 状态管理和存储
- **[Zustand](https://zustand-demo.pmnd.rs/)** - 轻量级状态管理
- **[Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)** - 跨设备设置同步

## 参考资料

### 官方文档
- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/migrating/)
- [Content Scripts 最佳实践](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)

### 技术栈文档
- [React 官方文档](https://react.dev/)
- [Vite 插件开发](https://vitejs.dev/guide/api-plugin.html)
- [Tailwind CSS 定制](https://tailwindcss.com/docs/customization)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 开源项目
- [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) - 项目基础模板
- [知乎API分析](https://github.com/topics/zhihu-api) - 知乎数据获取相关项目

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 支持项目

如果这个项目对你有帮助，请考虑：

- ⭐ 给项目点个星标
- 🐛 报告 Bug 或提出新功能建议
- 📢 分享给其他知乎用户
- 💻 贡献代码或文档

---

Made with ❤️ for 知乎用户
