# Context

当前模型合集页把站内案例称为 Hot Prompts，并把 Astra 的六个项目误展示在 Sol & Luna 页；下方 All Prompts 是无真实内容的占位卡。用户希望两块分别成为 **Hot Cases（Enter 站内项目）** 和 **Trending Prompts（有来源的外部原始提示词）**，并新增 Claude Opus 5.5 合集，让 Sol & Luna 与 Opus 占据 Case Library 曲面 Gallery 中紧随 Astra 的两个 Coming Soon 位置。参考图用于 Trending Prompt 卡片的信息层级，不照搬色彩。

用户确认：Sol/Luna 与 Opus 的真实站内项目、Trending Prompts 正文及来源均稍后提供；正式 Enter 转链稍后提供，届时所有复制/下载动作才接入**成功后在新标签页打开**的统一跳转；Opus 封面用 **nano-banana-2** 生成，Sol/Luna 沿用现有素材。没有真实数据时必须呈现准确空态，不复制 Astra 项目、不发明作者/来源/Prompt，也不把抽象封面当作实际项目。此计划先交付可用结构、Opus 展示与移除下载完成弹窗；数据与正式转链的接入保持明确未完成，等待用户提供。

## 实现方向

1. **共享模型页结构**：`src/components/case-library/model-detail-page.tsx` 更名可见标题为 Hot Cases 和 Trending Prompts；保持现有 Hero、输入框、About、FAQ 与响应式布局。Astra 的前六个真实项目继续显示；`src/components/case-library/model-hot-prompt-gallery.tsx` 改从当前合集 `caseIds` 读取，不再硬编码 Astra 内容供所有模型复用。Sol/Luna 和 Opus 在案例未到时显示“暂无站内项目”空态。仅在 `.model-hot-grid` 范围调整 `src/styles/model-detail.css`，让图片说明及可读遮罩默认可见，其他 Case Library 卡片仍按原悬停行为。
2. **简洁的 Trending Prompts**：用专门的数据结构及卡片替代 `model-prompt-categories.tsx` 的虚构占位。每条真实记录才显示名称、简介、可验证的来源（有 URL 才链接）、Original Prompts 标签、可展开原文和 Copy Prompt；没有数据时展示明确空态，无可操作的假卡片。沿用 `--primary`、`--card`、`--foreground` 等已有语义色和现有字体，手机单列、桌面网格；键盘和焦点可用。真实提示词正文延续 `loadPrompt` 的按需加载/失败重试，不预先打入首屏。此轮不抓取或杜撰外部内容。
3. **Opus 合集与 Gallery**：新增 `src/data/model-pages/claude-opus-5-5.ts`、`src/data/showcase-collections/claude-opus-5-5.ts` 和模型页入口，注册到 `src/App.tsx`、`src/data/showcase-collections.ts`、`model-page-head.ts`；生成一张抽象、无伪造 logo 或案例截图的 Opus 封面并作为站内静态媒体。`src/data/curved-gallery.ts` 只替换 Astra 后面两个装饰性 Coming Soon 项：Sol/Luna 用现有封面、Opus 用新封面；余下装饰项保留。目录卡、Gallery 和模型页路由用既有 `showcaseCollectionHref` / `useAppHref` 保留 `/prompts`、`/showcases` 和 `hl`。
4. **复制/下载动作分阶段**：`src/components/case-library/showcase-library-view.tsx` 去掉下载完成弹窗和无关加载，现有单项/批量下载在正式链接到来之前继续只报告真实成功或失败；不加假转链。后续收到链接后，在 `src/lib/model-prompt-action.ts` 统一实现用户手势时预留新标签页、复制/下载真正成功才跳转正式 URL；失败时关闭空白页并报告错误，弹窗受阻时不谎称完成。接入模型顶部输入框、Trending Prompt Copy、`src/components/case-library/prompt-panel.tsx` 的单项复制/下载，以及 Case Library 批量下载；保留 UTF-8 原文、文件顺序与现有剪贴板失败反馈。
5. **文案与约束**：`src/data/model-pages/{types,gpt-6-astra,gpt-6-sol-luna}.ts` 和 `public/locales/*.json` 更新真实含义，新增 Opus 的中性、无未经证实能力声明的介绍。所有 11 种语言的键一致；按 `enter_i18n` 规则检查并重扫报告。不修改项目原有预览/remix URL、Cookie/统计、语言探测、旧路由或平台构建插件；不启用数据库或在线抓取。

## Implementation checklist

- [x] Hot Cases 标题/说明指向站内真实项目，Astra 保留前六项，Sol/Luna/Opus 无项目时显示诚实空态（组件测试通过）。
- [x] 仅 Hot Cases 卡片说明及遮罩默认可见，目录与其他案例卡悬停效果不变（CSS 范围检查；实际悬停视觉未实测）。
- [x] Trending Prompts 模型、简洁卡片和无数据空态完成；测试数据验证来源链接、原文按需读取和复制；线上暂无真实收录项。
- [x] 用 nano-banana-2 生成 Opus 抽象封面并压缩为站内 54 KB WebP；保留 Sol/Luna 原有封面。
- [x] 新增 Opus 页面/合集注册与两套静态 head；Gallery 前两个装饰项替换为 Sol/Luna、Opus 可点击卡，其余保持不变（组件测试通过）。
- [x] 移除批量下载完成弹窗；正式转链未到前不增加假跳转。
- [ ] 仅收到用户的真实提示词/项目后填充对应合集数据，不把 Astra 项目归入其他模型。
- [ ] 仅收到正式转链后统一实现新标签页跳转，覆盖所有复制及单项/批量下载入口与失败/拦截状态；在此之前保持待办。
- [x] 所有新增/变更的 UI 文案在 11 个 locale 中成对维护；不主动删除未用的旧翻译键（check-i18n 与 scan-i18n 均通过）。

## Verification checklist

- [x] `pnpm run typecheck`、`pnpm run build`、`git diff --check`、i18n `check-i18n.mjs` 与 `scan-i18n.mjs` 均通过；Opus 两套静态 HTML 的 title/description/canonical/OG 已核对。
- [x] 测试 Astra 的六个项目、Sol/Luna 和 Opus 零项目/零提示词空态；测试夹具验证来源/Original Prompts/原文/复制只在有真实形态数据时可见（29 项组件测试通过，实际外部数据仍待用户提供）。
- [ ] 检查 `/prompts`、`/showcases` 的三个模型页与合集目录直接进入、刷新、Gallery 点击、`hl` 保留和旧 Astra slug 不退化；无数据时不出现可点击的虚构项目或作者。
- [ ] 后续收到正式链接再测：剪贴板成功/拒绝、正文加载失败、单项和批量下载成功/失败、弹窗受阻、重复点击；每次成功只打开一个正确的新标签页，不显示旧弹窗。
- [ ] 手机 390 与桌面 1280 核对新增模型页/Trending 区块，验证默认标题可读、链接焦点可见与缩减动态效果；不能取得浏览器证据时标记未验证而不是通过。
- [x] 用 marketing 严格构建审计记录所有模型/合集入口与媒体：无缺失产物/未映射 HTML 错误，仍有原有 CSR 静态正文及 JS/字体预算告警（退出码 1）；浏览器性能、真实部署 HTTP 仍未验证。

## 本轮交付证据与未完成依赖

- `pnpm run typecheck`、`pnpm run build`、`git diff --check`、i18n 校验及 29 项 JSDOM 测试通过。模型页 `/prompts/{gpt-6-astra,gpt-6-sol-luna,claude-opus-5-5}` 与 `/showcases/…` 共 6 份静态 HTML 产物均有 canonical 与 OG 图片；Opus 页面手机 390/桌面 1280 截图已取得。Opus 封面压缩为约 54 KB 本地 WebP；Gallery 两个入口的 `hl` 路径映射有单元测试。
- 目录用现有 `/prompts` 与 `/showcases` 路由工厂、`useAppHref` 和 `/_prompts` 资产命名空间；Cookie 管理、GTM、Clarity、Mixpanel 均由既有 app root 统一挂载，没有为 Opus 新建实例，真实 consent/事件端到端尚未验证。当前语言仍遵守项目已有 `hl` 参数模式，不重建另一套路由式 i18n。
- Hot Cases 与 Trending Prompt 测试夹具不进入生产数据。**仍需用户提供** Sol/Luna/Opus 站内项目、各模型抓取提示词的完整原文及来源、以及正式转链；在此之前没有假项目、假作者或带错误 URL 的强制跳转。正式链接到来后需完成所有复制与下载动作的新标签页契约，不能将当前阶段表述为全量完成。
- 严格构建审计保留已有 CSR 无静态 H1/正文和部分 canonical/JSON-LD、远程字体未验证、JS 与字体默认预算超限的告警。浏览器冷暖 5 次性能测试和线上缓存/HTTP 响应头未做，本轮不宣称速度或部署达标。
