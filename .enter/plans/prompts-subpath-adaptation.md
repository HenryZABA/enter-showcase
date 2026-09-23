# Context

对当前 HEAD 与历史恢复点完成审计后，确认此前的大部分功能没有丢失：`/` 仍跳转 `/prompts`，`/prompts` 与 `/prompts/collections/:slug` 路由、子页返回、`/_prompts` 资源命名空间、Cookie Manager、GTM、Clarity、Mixpanel 以及后续性能优化均仍在。真正被覆盖的是 `src/App.tsx` 中的白屏修复：滚动复位 effect 又写成了 `useEffect(() => window.scrollTo(...))`，在当前预览环境里会返回非函数值，React 卸载路由时因此报 `destroy is not a function`。

不应回退或整段恢复旧提交，因为 `bc2f81a` 之后已有大量案例数据、媒体生命周期、缓存和卡片性能改动。推荐仅恢复已确认丢失的一行行为，并保留所有后续代码。

## Recovery scope

- 修改：`src/App.tsx` 的 `LanguageSync` 滚动复位 effect。
- 保持：当前 `/prompts` 路由结构、合集子页与返回流程、SPA `Link`、资源配置、analytics/consent、当前案例数据与性能优化。
- 不执行：提交回退、文件整体覆盖、恢复旧版 Hero/卡片/媒体实现。

## Implementation checklist

- [ ] 将 `useEffect(() => window.scrollTo(0, 0), [pathname])` 改为块级 effect，显式不返回任何值。
- [ ] 全项目扫描 `useEffect`/`useLayoutEffect`，确认没有其它返回 Promise 或非 cleanup 值的同类写法。
- [ ] 确认“探索合集”继续使用 SPA `Link` 进入 `/prompts/collections/gpt6`，不恢复 `reloadDocument`。
- [ ] 保留 `bc2f81a` 之后的 `src/data/cases.ts`、卡片、媒体、缓存和 Vite 性能改动。

## Verification checklist

- [ ] 运行 `pnpm run typecheck`。
- [ ] 运行 `pnpm run build`。
- [ ] 运行现有 `.enter/performance-audit` 中与路径、合集媒体和功能回归相关的测试。
- [ ] 验证 `/` 仍立即跳转 `/prompts`，并保留 query。
- [ ] 验证 `/prompts` 可进入 `/prompts/collections/gpt6`，子页返回按钮正常。
- [ ] 检查最新控制台，不再出现 `useEffect must not return` 或 `destroy is not a function`。
- [ ] 确认 `/_prompts` 静态资源与现有 Cookie/analytics 单例没有被改写。