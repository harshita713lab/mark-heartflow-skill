<<<<<<< HEAD
# HeartFlow 安装指南

## 系统要求

- **Node.js >= 18**（[下载](https://nodejs.org/)）
- 操作系统：macOS / Linux / Windows
- **零外部依赖** — 无需 API key、无需模型文件、无需网络

## 安装（2分钟）

### 方式一：git clone（推荐）

```bash
git clone --depth 1 https://github.com/yun520-1/mark-heartflow-skill.git
cd mark-heartflow-skill
npm install
```

### 方式二：curl 下载

```bash
curl -L https://api.github.com/repos/yun520-1/mark-heartflow-skill/zipball/main -o heartflow.zip
unzip heartflow.zip && cd yun520-1-mark-heartflow-skill-*
npm install
```

## 验证

```bash
node bin/verify.js
```

看到 `✅ 全部通过` 即安装成功。

## 快速使用

### 交互式控制台

```bash
node bin/cli.js chat
# 或
npm start
```

输入任意内容，心虫会自动分析情绪、心理状态、哲学立场，输出结构化认知分析。

### 单次分析

```bash
node bin/cli.js --chat "我想辞职去创业"
```

### 查看引擎状态

```bash
node bin/cli.js status
# 或
npm run status
```

## 集成到 AI Agent

### MCP 服务器（推荐）

```bash
# 启动 MCP HTTP 服务
node mcp/mcp-server-http.js --port 8099 &

# 注册到 Hermes Agent
hermes mcp add heartflow --url http://localhost:8099/mcp

# 验证
hermes mcp test heartflow
```

MCP 提供 16 个工具：think、emotion、memory、decision router、dream、psychology 等。

### Node.js API

```javascript
const { HeartFlow } = require('./src/core/heartflow.js');
const hf = new HeartFlow();
hf.start();

// 全量认知分析
const result = await hf.think("你的输入");
console.log(result.cognition.emotion);   // PAD 情绪向量
console.log(result.cognition.judgment);  // 多路径判断
console.log(result.cognition.decision);  // 决策策略
```

## 遇到问题？

| 问题 | 解决方法 |
|------|---------|
| `npm install` 报错 | 确认 Node.js >= 18：`node --version` |
| `node bin/cli.js` 报 "engine not found" | 确保在项目根目录执行 |
| MCP 端口被占用 | `node mcp/mcp-server-http.js --port 8100` |
| 其他问题 | [提 Issue](https://github.com/yun520-1/mark-heartflow-skill/issues) |

## 更新

```bash
git pull
npm install
node bin/verify.js
=======
# HeartFlow 轻量级安装

## 快速安装（Core ~3MB）

```bash
# 1. 克隆仓库（仅核心文件）
git clone --depth 1 --filter=blob:none --sparse https://github.com/yun520-1/mark-heartflow-skill.git heartflow
cd heartflow
git sparse-checkout set src/core mcp bin VERSION package.json config.json

# 2. 安装依赖
npm install

# 3. 验证安装
node core/upgrade.js --check
```

## 按需升级

```bash
# 下载AI认知引擎（~5MB）
node core/upgrade.js --engines

# 下载公式数据库（~10MB）
node core/upgrade.js --data

# 下载全部
node core/upgrade.js --full

# 下载指定引擎
node core/upgrade.js --engine creativity
node core/upgrade.js --engine humor
```

## 组件说明

| 组件 | 大小 | 安装命令 | 说明 |
|------|------|----------|------|
| Core | ~3MB | 默认安装 | 核心引擎、MCP server、CLI |
| Engines | ~5MB | `--engines` | 11个AI认知引擎 |
| Data | ~10MB | `--data` | 公式库(2397个)、知识图谱 |
| Skills | ~3MB | `--skills` | 额外skill模块 |

## 验证安装

```bash
node core/upgrade.js --check
```

输出示例：
```
Core:        ✅ Installed
engines      ✅ 11/11 files (~5MB)
data         ⚠️  2/5 files (~10MB)
skills       ❌ 0/3 files (~3MB)
>>>>>>> e84538af12ba8f9d63816fdf6cfc2e2b929be321
```
