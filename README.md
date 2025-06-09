# 原神体验项目

本项目基于 [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) 构建，旨在实现原神相关的交互体验和界面展示。

## 项目结构

```
├── public/                # 静态资源目录
├── src/                   # 源码目录
│   ├── assets/            # 图片等资源
│   ├── components/        # Vue 组件
│   ├── Experience/        # 体验相关模块
│   ├── App.vue            # 入口组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── docs/                  # 文档及演示页面
├── package.json           # 项目依赖与脚本
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

## 快速开始

1. 安装依赖

   ```sh
   pnpm install
   ```

2. 启动开发服务器

   ```sh
   pnpm dev
   ```

3. 打包生产环境

   ```sh
   pnpm build
   ```

## 主要功能

- Vue 3 组件化开发
- TypeScript 类型安全
- Vite 极速构建与热更新
- 原神相关资源展示与交互

## 相关链接

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

---

如需二次开发或反馈问题，欢迎提交 Issue 或 PR！
