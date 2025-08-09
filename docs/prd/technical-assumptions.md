# 技术假设

## 仓库结构

单仓库（Monorepo）

## 服务架构

Chrome扩展客户端 + 外部AI API服务

## 测试要求

- 单元测试覆盖率 >70%
- 集成测试覆盖核心功能流程
- 手动测试覆盖不同知乎页面类型

## 额外技术假设

- 使用chrome-extension-boilerplate-react-vite作为基础框架
- 采用React 18 + TypeScript + Vite构建
- 使用Tailwind CSS实现样式和主题系统
- 集成OpenAI API作为默认AI服务提供商