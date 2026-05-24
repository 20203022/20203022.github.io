## 前言

Claude Code 是 Anthropic 推出的终端 AI 编程助手，也是我日常使用最多的 Vibe Coding 工具。本文将分享我的深度使用经验。

## 安装与配置

```bash
npm install -g @anthropic-ai/claude-code
claude
```

## 核心功能

### 1. 代码库理解

Claude Code 能够理解整个项目的结构和上下文，不仅仅是单个文件。当你描述需求时，它能找到相关的代码文件并进行修改。

### 2. 多文件编辑

一次对话可以同时修改多个文件，保持变更的一致性。比如添加一个新 API 端点时，它可以同时创建 Controller、Service、Repository 和 DTO。

### 3. 终端命令执行

Claude Code 可以直接运行终端命令——安装依赖、运行测试、构建项目、部署到服务器，全部在对话中完成。

### 4. Git 集成

自动管理 Git 工作流：创建分支、提交代码、编写 commit message，甚至创建 PR。

## 高效使用技巧

### 技巧一：写好 CLAUDE.md

在项目根目录创建 CLAUDE.md 文件，描述项目架构、编码规范和常用命令。Claude Code 会自动读取，大幅提升准确度。

### 技巧二：分步推进

不要一次性描述整个功能。拆分成小步骤，每步确认后再继续。

### 技巧三：善用命令

- `/clear` — 清理对话上下文
- `/compact` — 压缩上下文，保留关键信息
- `/init` — 为项目生成 CLAUDE.md

### 技巧四：提供具体反馈

当 AI 生成的代码不符合预期时，不要只说"不对"，具体指出哪里需要修改。

## 实战案例

我最近用 Claude Code 在 2 小时内完成了一个全栈项目的搭建：
- Spring Boot 后端 + React 前端
- JWT 认证系统
- 数据库 Schema 设计
- Docker 部署配置
- Nginx 反向代理配置

这在使用传统开发方式时至少需要 2-3 天。

## 总结

Claude Code 是目前最强大的终端 AI 编程工具。掌握好它的使用技巧，开发效率能提升 5-10 倍。
