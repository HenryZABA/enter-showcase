# GPT-6 Sol & Luna 合并模型页

## Context
在现有 GPT-6 Astra 模型详情页与 Collections 目录基础上，新增一个合并介绍 GPT-6 Sol 与 GPT-6 Luna 的页面。新页使用已确认的 `/prompts/gpt-6-sol-luna` 主入口，并同时支持 `/showcases/gpt-6-sol-luna`；整体结构与 Astra 一致，但内容围绕 Sol 的高强度构建能力与 Luna 的快速迭代能力展开。Hot Prompts 与 All Prompts 暂时展示明确的占位卡，不虚构已发布案例。首屏使用 nano-banana-pro 生成无文字的双星主题专属视觉。

## 推荐实现
- 抽取一个数据驱动的共享模型详情页壳层，让 Astra 与 Sol/Luna 复用同一 Hero、Prompt Composer、占位内容、About、FAQ 结构；模型名称、i18n 前缀、图片、区块编号与 SEO 数据通过 props/data 注入，避免复制后残留 Astra 文案。
- 将 `ModelPromptComposer`、`ModelPromptCategories`、`ModelPromptPlaceholder` 的 Astra 固定键改为显式文案/模型标签参数，保持现有复制后打开 Enter、隐私屏蔽与错误处理行为不变。
- Sol/Luna 页面用双模型叙事：标题显示 “GPT-6 Sol & Luna”，副标题、About、FAQ 分别解释两者适合的构建节奏与使用方式；不声称未经项目来源验证的具体规格、价格或基准成绩。
- Hot Prompts 使用三张与 All Prompts 一致语义的“内容待补充”占位卡；非 All 分类继续显示空状态。后续加入真实案例时可直接替换数据，不改变页面结构。
- 用 nano-banana-pro 生成深色双星/双轨道抽象视觉，不放模型商标字样或其他文字；保存到 `public/media/showcase-collections/`，同时作为首屏图片与 Collections 卡片封面。仅增加 Sol/Luna 局部视觉变体，保留 Astra 样式。
- 将运行时 SEO hook 与构建时 `model-page-head.ts` 改为模型数据驱动：为两条 Sol/Luna 路由输出独立 title、description、keywords、canonical、OG image 与 5 项 FAQ JSON-LD，同时保持 Astra 两条静态详情入口不变。
- 新增 Sol/Luna collection registry 项，卡片链接到模型页；不把它设为首页 featured collection，也不改变旧 Astra collection 的 slug、案例数据或 legacy route。
- 为 `modelSolLuna.*` 与新增 Collections 文案补齐现有 11 个 locale JSON；继续由 `src/i18n/config.ts` 直接打包，不改变语言清单。

## 关键文件
- `src/pages/showcase/Gpt6AstraPage.tsx`、新增 `src/pages/showcase/Gpt6SolLunaPage.tsx`：接入共享模型页结构。
- 新增 `src/components/case-library/model-detail-page.tsx`：承载 Astra 与 Sol/Luna 共用页面组合。
- `src/components/case-library/model-prompt-composer.tsx`、`model-prompt-categories.tsx`、`model-prompt-placeholder.tsx`：移除 Astra 固定文案依赖，改为可复用参数。
- 新增 `src/data/model-pages/gpt-6-sol-luna.ts`，并调整 `src/data/model-pages/gpt-6-astra.ts`：统一模型页数据与 FAQ schema 形状。
- `src/hooks/use-model-page-seo.ts`、`model-page-head.ts`：按模型数据生成运行时与构建时 metadata。
- 新增 `src/data/showcase-collections/gpt-6-sol-luna.ts`，更新 `src/data/showcase-collections.ts`、`src/App.tsx`。
- `src/styles/model-detail.css`：仅加入双星首图所需的局部 modifier 与窄屏标题适配。
- `public/locales/*.json`、`public/media/showcase-collections/`：11 语言文案与生成图片。

## Implementation checklist
- [ ] 使用 nano-banana-pro 生成无文字的 Sol/Luna 双星主题首图，并将可用资源保存到 `public/media/showcase-collections/`。
- [ ] 建立共享模型详情页配置/组件，使 Astra 页面视觉、CTA、复制逻辑、FAQ 与现有路由行为保持不变。
- [ ] 新增 Sol/Luna 模型数据与页面，H1 为 “GPT-6 Sol & Luna”，页面正文明确区分两种构建节奏而不写未经验证的规格。
- [ ] Sol/Luna 的 Hot Prompts 展示三张明确禁用的占位卡；All Prompts 保留 All 三张占位与其他分类空状态。
- [ ] Composer 在 Sol/Luna 页显示对应模型标签与专属初始 Prompt，复制成功后仍打开 Enter，失败时不离页。
- [ ] `/prompts/gpt-6-sol-luna` 与 `/showcases/gpt-6-sol-luna` 渲染同一页面，并通过 `useAppHref` 与 `?hl=` 保留入口前缀和语言。
- [ ] Collections 新增 GPT-6 Sol & Luna 卡片并指向新模型页；Astra 仍为 featured，旧 collection/legacy 路由不变。
- [ ] 运行时 SEO 使用当前模型的 canonical、keywords、OG image 与 FAQ schema，不再固定引用 Astra。
- [ ] 构建时为 Astra 与 Sol/Luna 各两条入口写出各自独立 head，根页面不被模型 metadata 污染。
- [ ] 11 个 locale 文件包含完整 `modelSolLuna.*` 和 collection 文案，`src/i18n/config.ts` 的直接打包机制不变。
- [ ] 样式仅新增 Sol/Luna 局部 modifier，并确保长模型名在桌面与手机不横向溢出。

## Verification checklist
- [ ] 正向检查 Collections 卡片可进入两种前缀的新页面，Prompt 复制、浏览锚点、分类切换、FAQ 展开均可用。
- [ ] 默认/回归检查 Astra 两条模型路由、旧 collection route、Astra 卡片与首页 featured collection 均保持原行为。
- [ ] 边界检查空 Prompt 禁用，复制失败不跳转；Hot/All 占位卡无假视频请求且按钮为 disabled。
- [ ] 使用 `?hl=zh-CN` 与至少一个非中文 locale 检查新页无原始 i18n key，路径与语言参数往返保留。
- [ ] 运行 `node /workspace/.agents/skills/enter_i18n@1/assets/scripts/check-i18n.mjs` 与 `scan-i18n.mjs`，要求 11 语言无缺键、无未知动态 key。
- [ ] 运行 `pnpm run typecheck` 与 `pnpm run build`；检查 `dist/prompts/gpt-6-sol-luna/index.html` 和 `dist/showcases/gpt-6-sol-luna/index.html` 的 title、canonical、OG 与 5 项 FAQ JSON-LD，并核对 Astra 构建页未回归。
- [ ] 在 `mobile_390` 与 `desktop_1280` 检查同一 Sol/Luna 路由：双星首图、长 H1、占位卡、About、FAQ 无横向溢出或不可读对比。
- [ ] 执行既有 marketing build audit；如仅命中已知共享 JS/字体、CSR 正文和外部字体告警，保持预算不变并如实记录，不能宣称性能通过。
