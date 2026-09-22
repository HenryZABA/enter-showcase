# Context

项目目前只支持根路径下的 `/showcases` 路由，没有已适配的页面子路径、资源命名空间或分析/同意管理入口。目标是按 `full-adaptation` 模式新增主子路径 `/prompts`，同时保留现有根路径入口；从 `/prompts` 进入后，地址栏、内部导航和 `?hl=` 语言参数都持续保留 `/prompts`。构建资源使用稳定命名空间 `/_prompts`，不把页面路径当资源目录。

## Path model and current capability status

- 模式：`full-adaptation`
- `SUBPATH=prompts`
- 页面入口：根路径与 `/prompts` 双入口，不做跨入口重定向
- `SUBPATH_ASSETS_DIR=_prompts`
- i18n：已实现基于 `i18n.config.json`、`?hl=`、cookie/browser detector 的语言能力；不新增 `/LANG/...` 路由，不改变现有语言模型
- 路由与 path helper：需改造；当前绝对链接会从 `/prompts` 跳回根入口
- 静态资源：需改造；当前 Vite 资源与 public 资源均未使用 `/_prompts`
- locale：已实现为 JS 内嵌资源，无运行时 locale JSON 请求；构建时仍按规范复制 locale JSON 到 `/_prompts/locales`
- Theme：已实现为当前仅亮色的 Showcase 页面主题；Cookie Manager 使用 `light`
- Cookie Manager：本轮新增
- GTM + Consent Mode：本轮新增，容器 `GTM-TXJCNVLK`
- Microsoft Clarity：本轮新增，项目 ID `xj39ml6cp1`
- Mixpanel：本轮新增，token `153bf97831e550c490f1f51fac241dea`
- Enter Analytics：保持不变；本次不新增另一套分析 SDK 或自定义产品事件

## Recommended implementation

1. 在 `src/lib/app-paths.ts` 建立唯一的页面入口与资源路径 helper：识别当前 URL 是否位于 `/prompts`，为内部业务路径保留当前入口，并为 public 资源生成 `/_prompts/...` URL。
2. 在 `src/App.tsx` 复用同一套页面组件/route factory，同时注册根入口和 `/prompts` 入口；让 `/` 与 `/prompts` 分别跳转到各自的 `showcases` 首页并保留 query，404 返回链接也保留当前入口。
3. 将 `Header`、`Footer`、`ShowcaseLibraryView`、`ShowcaseCollectionsPage` 和集合链接统一改用共享 path helper；语言切换继续只更新 `?hl=`，因此自动保留当前 pathname 与入口。
4. 在 `vite.config.ts` 保持 `base: "/"`，将构建 chunk 目录设为 `_prompts`，并在构建结束时把 `public/locales` 及项目实际使用的 public 字体、图片、媒体和页脚图标复制到 `dist/_prompts`。更新 `index.html`、CSS 和数据文件中的本地资源引用为 `/_prompts/...`；外部 CDN URL 保持不变。
5. 安装 `@enter-pro/cookie-management`、`@microsoft/clarity`、`mixpanel-browser`，并在 `pnpm-lock.yaml` 固化解析版本；Mixpanel 使用带内置 TypeScript 类型的 `>=2.66.0` 版本。
6. 新建单一的 app-root Cookie Consent provider，复用现有 `normalizeLanguage`、`fallbackLng` 和 i18n 变化；先订阅 data，再初始化，提供 `getData()` fallback，并将当前项目主题映射为 `light`。
7. 新建集中式 analytics 接线：GTM 在加载容器前写入默认 denied，随后跟随 Cookie Manager 更新 consent；Clarity 只初始化一次并同步 analytics/advertising consent；Mixpanel 仅在 Cookie Manager ready 且 analytics 已同意后初始化，开启 Autocapture 与 100% Session Replay，并按规范处理撤回/重新同意。
8. 不新增未定义的 `track`、`identify`、People 或自定义 pageview；对搜索输入添加 Clarity/Mixpanel 的敏感内容屏蔽与自动采集排除标记。

## Critical files

- `src/App.tsx`：共享 route tree、根入口和 `/prompts` 双入口、query 保留
- `src/lib/app-paths.ts`：新增统一页面路径与资源路径 helper
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/case-library/showcase-library-view.tsx`
- `src/pages/showcase/ShowcaseCollectionsPage.tsx`：内部导航保留当前入口
- `vite.config.ts`、`index.html`、相关 `src/data/*` 与 `src/styles/*`：`/_prompts` 资源命名空间
- `src/providers/cookie-consent-provider.tsx`：Cookie Manager 唯一初始化 owner
- `src/providers/analytics-provider.tsx` 与 `src/lib/analytics/*`：GTM、Clarity、Mixpanel 单例接线
- `package.json`、`pnpm-lock.yaml`：新增依赖

## Implementation checklist

- [ ] 在 `src/lib/app-paths.ts` 固定 `SUBPATH_ROUTE=/prompts` 与 `ASSET_NAMESPACE=/_prompts`，并实现完整前缀边界判断。
- [ ] 在 `src/App.tsx` 让根入口和 `/prompts` 入口复用同一套页面组件与路由定义。
- [ ] 让 `/` 跳转 `/showcases`、`/prompts` 跳转 `/prompts/showcases`，两者都原样保留 query。
- [ ] 将所有内部 React Router 链接迁移到共享 helper，确保进入 `/prompts` 后不会跳回根入口。
- [ ] 保持语言切换器只修改 `?hl=`，不引入 `/LANG/prompts` 或 `/prompts/LANG`。
- [ ] 在 `vite.config.ts` 保持 `base: "/"` 并输出构建资源到 `dist/_prompts`。
- [ ] 将 locale、字体、图片、媒体与页脚图标复制到 `dist/_prompts`，并把应用内本地资源 URL 指向 `/_prompts/...`。
- [ ] 安装并锁定 Cookie Manager、Clarity 与 Mixpanel 依赖。
- [ ] 在 app root 挂载一次 Cookie Consent provider，并同步现有 i18n 语言及亮色主题。
- [ ] 接入一次 GTM `GTM-TXJCNVLK`，确保 default denied 早于容器加载，后续 consent 来自 Cookie Manager。
- [ ] 接入一次 Clarity `xj39ml6cp1`，Cookie Manager ready 前不放行 consent。
- [ ] 接入一次 Mixpanel，使用固定 token、`autocapture: true`、`record_sessions_percent: 100`，并实现同意、撤回和重新同意流程。
- [ ] 对搜索输入添加 Clarity 与 Mixpanel 的敏感内容屏蔽/自动采集排除标记。
- [ ] 保持外部 URL、业务页面内容、下载流程、现有 i18n 文案与页面视觉样式不变。

## Verification checklist

- [ ] 运行 `pnpm run typecheck` 并通过。
- [ ] 运行 `pnpm run build` 并通过；检查 JS/CSS 位于 `dist/_prompts/`，locale 位于 `dist/_prompts/locales/`。
- [ ] 验证 `/`、`/showcases`、`/showcases/collections` 与集合详情仍可直接访问和刷新。
- [ ] 验证 `/prompts`、`/prompts/showcases`、`/prompts/showcases/collections` 与集合详情可直接访问和刷新。
- [ ] 验证 `/prompts?hl=zh-CN` 跳转后仍保留 `/prompts` 与 `hl`，切换语言也不丢失入口或其它 query。
- [ ] 验证 `/promptsx` 不会被误判为 `/prompts`，未知子路由保持现有 404 行为。
- [ ] 验证根入口与 `/prompts` 使用相同页面实现，内部导航分别保持各自入口。
- [ ] 验证浏览器资源请求使用 `/_prompts`，且没有错误的 `/prompts/fonts`、`/prompts/images`、`/prompts/media` 或 `/prompts/locales` 请求。
- [ ] 验证 Cookie Manager 在任一入口只初始化一次，语言变化会更新 locale，主题为现有亮色。
- [ ] 验证 GTM default consent 全部 denied，Cookie Manager 数据变化后才更新 consent，且容器不重复注入。
- [ ] 验证 Clarity 只初始化一次；analytics/advertising 拒绝与同意分别映射为 denied/granted。
- [ ] 验证 Mixpanel 在 Cookie Manager 未 ready 或 analytics 未同意时不初始化、不采集、不录屏；同意后只初始化一次，撤回后停止且不删除 profile/persistence，重新同意后恢复且不重复 pageview。
- [ ] 验证没有新增自定义 Mixpanel 事件、PII 上报或授权前事件队列。
- [ ] 在 `mobile_390` 与 `desktop_1280` 检查 `/prompts/showcases`，确认路由适配未造成视觉或响应式回归。