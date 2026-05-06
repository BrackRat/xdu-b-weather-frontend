# Weather Frontend

<p align="center">
  <a href="../README.md">English</a> | 简体中文
</p>

<p align="center">
  <img src="Screenshot_main.png" alt="天气仪表盘主界面" width="360" />
</p>

<p align="center">
  一个打磨完整的 Svelte 天气仪表盘，支持 GPS/IP 定位、空气质量分析、预报图表，以及适合演示和测试的内置 Mock 场景。
</p>

<p align="center">
  <a href="#功能特性">功能特性</a>
  ·
  <a href="#界面截图">界面截图</a>
  ·
  <a href="#快速开始">快速开始</a>
  ·
  <a href="#配置说明">配置说明</a>
  ·
  <a href="#脚本命令">脚本命令</a>
</p>

<p align="center">
  <img alt="Svelte" src="https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white" />
  <img alt="Playwright" src="https://img.shields.io/badge/Playwright-e2e-2ead33?logo=playwright&logoColor=white" />
</p>

## 功能特性

- **真实天气数据**：通过 `PUBLIC_WEATHER_API_BASE_URL` 接入后端天气服务。
- **智能定位流程**：优先使用浏览器 GPS 定位，权限、HTTPS 或设备能力受限时自动回退到 IP 模糊定位。
- **适配中国坐标系**：请求按位置获取天气前，将浏览器 WGS-84 坐标转换为 GCJ-02。
- **完整天气概览**：展示当前温度、体感温度、风速风向、湿度、气压、能见度、紫外线、AQI、污染物、日出日落、逐时湿度和每日预报。
- **可切换数据模式**：在真实数据和本地 Mock 场景之间无缝切换。
- **内置 Mock 实验台**：提供正常、重度污染、严寒、暴雨、错误场景，并支持自定义经纬度测试。
- **工程化前端栈**：基于 SvelteKit、TypeScript、Chart.js、Motion、静态适配器和 Playwright。
- **响应式视觉系统**：Apple 风格的字体、间距和克制界面，适配移动端优先的使用场景。

## 界面截图

| 主界面 | Mock / 重度污染场景 |
| --- | --- |
| <img src="Screenshot_main.png" alt="天气仪表盘主界面" width="320" /> | <img src="Screenshot_mock_poor.png" alt="Mock 重度污染场景" width="320" /> |

## 技术栈

- [Svelte 5](https://svelte.dev/) 与 runes
- [SvelteKit](https://kit.svelte.dev/) 与 `@sveltejs/adapter-static`
- [Vite](https://vite.dev/) 用于本地开发和生产构建
- [TypeScript](https://www.typescriptlang.org/) 提供类型约束
- [Tailwind CSS 4](https://tailwindcss.com/) 通过 Vite 插件接入
- [Chart.js](https://www.chartjs.org/) 和 `svelte-chartjs` 用于天气图表
- [Motion](https://motion.dev/) 用于细节动效
- [Playwright](https://playwright.dev/) 用于端到端测试

## 快速开始

```bash
pnpm install
cp .env.example .env
pnpm dev
```

应用会运行在 Vite 开发服务器上，通常是 `http://localhost:5173`。

生产构建：

```bash
pnpm build
pnpm preview
```

## 配置说明

从 `.env.example` 创建 `.env`，并配置公开的后端接口地址：

```bash
PUBLIC_WEATHER_API_BASE_URL=https://your-api.example.com
PUBLIC_BEIAN_ENABLED=false
PUBLIC_BEIAN_TEXT=XICP备XXXXX号
```

前端期望后端提供以下接口：

- `GET /weather/comprehensive`：用于 IP 定位天气和定位兜底。
- `GET /weather/by-location?latitude={lat}&longitude={lon}`：用于 GPS 或自定义经纬度天气。

浏览器 GPS 需要安全上下文。生产环境请使用 HTTPS；如果定位不可用，应用会自动回退到 IP 模糊定位。

## Mock 模式

应用内置隐藏 Mock 面板，适合演示、QA 和接口异常测试。

- 双击左上角日期区域打开 Mock 面板。
- 选择 Mock 场景：`normal`、`heavy-pollution`、`cold`、`rain` 或 `error`。
- 输入自定义纬度和经度，可在 Mock 工作流中请求指定位置的真实天气。
- 可在同一面板中切回实时模式。

Mock 偏好会写入 `localStorage`，刷新页面后仍会保留当前模式和场景。

## 项目结构

```text
frontend/
├── docs/                    # README 截图和文档资源
├── src/
│   ├── lib/
│   │   ├── api/             # 天气 API 客户端
│   │   ├── components/      # 天气 UI 模块
│   │   ├── mock/            # 本地 Mock 天气场景
│   │   ├── stores/          # Svelte stores 和数据加载流程
│   │   ├── types/           # 天气 API 与 UI 数据模型
│   │   └── geolocation.ts   # 浏览器 GPS + WGS-84 到 GCJ-02 转换
│   └── routes/              # SvelteKit 页面与样式
├── static/                  # 静态公共资源
├── svelte.config.js         # 静态适配器配置
├── vite.config.ts           # Vite + SvelteKit + Tailwind 配置
└── playwright.config.ts     # E2E 测试配置
```

## 脚本命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器。 |
| `pnpm build` | 构建静态生产产物到 `build/`。 |
| `pnpm preview` | 本地预览生产构建。 |
| `pnpm check` | 运行 Svelte 和 TypeScript 检查。 |
| `pnpm test:e2e` | 运行 Playwright 端到端测试。 |
| `pnpm lint` | 使用 Prettier 检查格式。 |
| `pnpm format` | 使用 Prettier 格式化项目。 |

## 开发说明

- GPS 定位可能因 HTTP、浏览器权限或设备不支持而失败；store 层会处理失败并回退到 IP 数据。
- API 请求通过 `AbortController` 和请求 ID 防止过期响应覆盖新数据。
- 项目通过 `@sveltejs/adapter-static` 支持静态部署，可将生成的 `build/` 目录部署到任意静态托管平台。
- 视觉方向记录在 [DESIGN.md](../DESIGN.md)。

## 许可证

本项目基于 [MIT License](../LICENSE) 开源。
