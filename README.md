# JsonWeaver - 可视化 JSON 结构映射与转换平台

[![License](https://img.shields.io/github/license/your-username/JsonWeaver)](https://github.com/your-username/JsonWeaver/blob/main/LICENSE)
[![Version](https://img.shields.io/github/package-json/v/your-username/JsonWeaver)](https://github.com/your-username/JsonWeaver)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-43853D?logo=node.js&logoColor=white)](https://nodejs.org)
[![Jolt](https://img.shields.io/badge/Powered_by-Jolt-06C?logo=github&logoColor=white)](https://github.com/bazaarvoice/jolt)

![JsonWeaver Banner](https://via.placeholder.com/800x300?text=JSON+Weaver+Visual+Transformer)

---

## 项目简介

**JsonWeaver** 是一款基于 [Jolt](https://github.com/bazaarvoice/jolt) 转换引擎的可视化 JSON 结构映射与转换平台。通过拖拽和可视化配置，用户可以轻松定义 JSON 数据的映射规则，将源 JSON 数据自动转换为目标格式，极大提升了数据适配、接口对接、配置迁移等场景下的开发效率。

---

## 背景与优势

- **传统 JSON 转换痛点**：手写转换代码繁琐、易错，规则难以维护，沟通成本高。
- **JsonWeaver 解决方案**：通过可视化界面，零代码配置映射规则，实时预览转换结果，支持复杂嵌套结构和多层级映射，极大降低了门槛和出错率。

---

## 核心亮点

- 🚀 **基于 Jolt 引擎，转换能力强大且灵活**
- 🧩 **可视化拖拽配置，所见即所得**
- 🔄 **实时预览转换结果，调试高效**
- 🌙 **深色/浅色主题自由切换，界面美观**
- 📝 **内置丰富转换示例，快速上手**
- 🏷️ **支持复杂嵌套与数组结构映射**
- 💾 **一键导出/导入映射规则，便于复用和分享**
- 🌐 **多语言国际化支持**

---

## 主要功能

1. **可视化映射规则编辑器**  
   通过拖拽和表单配置，轻松定义字段映射、结构调整、值转换等规则。

2. **实时转换与预览**  
   输入源 JSON，实时展示目标 JSON，便于调试和验证。

3. **多种转换模式**  
   支持对象、数组、嵌套结构等多种复杂 JSON 格式的转换。

4. **规则导入导出**  
   支持将映射规则导出为文件，或从文件导入，方便团队协作和迁移。

5. **主题切换与国际化**  
   支持深色/浅色主题，内置中英文界面。

6. **示例与帮助文档**  
   内置常见转换场景示例，配套详细文档，助力快速上手。

---

## 技术架构

| 技术        | 说明/版本                                                    |
| ----------- | ----------------------------------------------------------- |
| 前端框架    | Vue 3 + TypeScript                                          |
| 状态管理    | [Pinia](https://pinia.vuejs.org/)                           |
| UI 组件     | [Element Plus](https://element-plus.org/)                   |
| JSON 编辑器 | [vue3-json-editor](https://github.com/vaakian/vue3-json-editor) |
| 构建工具    | [Vite](https://vitejs.dev/)                                 |
| 样式处理    | Sass + [Windi CSS](https://windicss.org/)                   |
| 转换引擎    | [Jolt](https://github.com/bazaarvoice/jolt)                 |

---

## 目录结构

```
├── src/                # 源码目录
│   ├── api/            # 接口与数据请求
│   ├── assets/         # 静态资源
│   ├── components/     # 通用组件
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   └── views/          # 页面视图
├── public/             # 公共资源
├── presets/            # 预设映射规则
├── locales/            # 国际化资源
├── package.json
├── README.md
└── ...
```

---

## 快速开始

### 环境要求

- Node.js >= 18.x
- pnpm >= 7.x

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

### 构建生产包

```bash
pnpm build
```

### 预览生产包

```bash
pnpm preview
```

---

## 应用场景

- API 数据适配与聚合
- 配置文件格式迁移
- 第三方平台数据对接
- 复杂 JSON 结构的批量转换
- 前后端数据结构解耦

---

## 常见问题（FAQ）

**Q1：支持哪些类型的 JSON 结构？**  
A：支持对象、数组、嵌套、复杂层级等多种 JSON 结构。

**Q2：转换规则可以导出/导入吗？**  
A：支持一键导出和导入，便于团队协作和规则复用。

**Q3：转换引擎是否开源？**  
A：底层转换引擎基于开源的 [Jolt](https://github.com/bazaarvoice/jolt)。

---

## 贡献方式

欢迎提交 Issue 或 Pull Request 参与项目共建！  
如有建议或需求，欢迎在 GitHub 讨论区留言。

---

## License

MIT
