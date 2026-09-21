# Enter Showcase

可独立运行的 Enter Showcase 前端，使用 React、Vite 和 TypeScript。项目包含 Showcase 页面主题、弧形画廊、案例卡片、详情动效、实时 iframe 预览、搜索分类、Prompt 复制及单个/批量下载、多语言切换。

## 启动

需要 Node.js 22.12+（或符合 Vite 7 要求的版本）。

```bash
npm ci
npm run dev
```

打开终端显示的本地地址，首页会进入 `/showcases`。

```bash
npm run build
npm run preview
```

`build` 同时运行 TypeScript 检查。`dist/` 为可部署的静态文件；部署服务须把未知前端路由回退到 `index.html`。默认部署在域名根目录，已提供兼容 Netlify/Cloudflare Pages 的 `public/_redirects`。

## 导入 Enter Web

1. 在 Enter Web 端选择从 GitHub 导入项目。
2. 选择本仓库和稳定分支 `main`。
3. 安装命令使用 `npm ci`，构建命令使用 `npm run build`。
4. 构建产物目录填写 `dist`。

本项目是纯静态 Vite 应用，不依赖服务端运行时、环境变量、数据库或登录。构建会生成 Enter 可识别的 `dist/index.html`。

## 提取范围

- `/showcases`：首页，共 14 个压缩包自带案例；初始显示 9 个，点击展开全部。
- `/showcases/collections`：专题目录。
- `/showcases/collections/gpt6`：GPT-6 Astra 合集，保留旧 slug `gpt-6-astra`。
- 案例详情通过卡片弹层打开，含单个 Prompt 下载。
- 原项目的本地图片、视频、字体及字体许可证已复制；外部案例实时预览和页脚品牌图片仍需网络，外部页面能否嵌入由其服务端策略决定。

## 独立化调整

项目只保留 Showcase 首页、合集目录、合集详情、案例弹层、筛选和 Prompt 下载。论坛、活动、聊天、登录、投稿、社区数据库、点赞评论、管理后台、产品导航、生产环境变量及埋点代码均已删除。

不需要 `.env`、数据库或登录即可启动。原始压缩包保持不变。

## 修改入口

| 目的 | 文件 |
| --- | --- |
| 调整案例、链接和 Prompt 关联 | `src/data/cases.ts` |
| 修改 Prompt 正文 | `src/data/prompts/*.txt` |
| 管理合集和成员 | `src/data/showcase-collections.ts`、`src/data/showcase-collections/gpt-6-astra.ts` |
| 页面 | `src/pages/showcase/` |
| 卡片和交互组件 | `src/components/case-library/` |
| Showcase 主题、画廊和布局 | `src/styles/` |
| 独立导航 | `src/components/layout/Header.tsx` |
| 修改多语言文案 | `public/locales/*.json` |
| 增加/修改路由 | `src/App.tsx` |

这是独立 Showcase 前端，不包含原站后端或用户数据。仓库不提交 `node_modules` 和 `dist`；用 `npm ci` 安装锁定依赖。

## License

MIT，详见 `LICENSE`。
