# Context

将 Prompt Library 的原文展示从列表内下拉，改为与 Case 相同的独立详情卡片／翻转弹层。首页和所有合集详情页同步生效；不更改列表尺寸、三列布局、提示词数据、合集 URL 或视频播放策略。

## 推荐实现

- 点击「查看原始提示词」或卡片标题，打开详情卡片；删除列表里的 `<details>` 原文下拉，不再撑高列表。
- 直接复用 `CaseFlipTransition` / `useCaseFlip`：同样的卡片展开、玻璃弹层、遮罩、关闭按钮、Esc、焦点约束及返回原卡片动画。
- 详情内容是标题、简述、作者／来源链接，以及完整原文。复用 `PromptPanel` 的正文滚动区、复制、下载、加载失败与重试；不构造假的 Case 数据或应用预览 iframe。
- 详情外壳点击后立即出现；正文面板在翻转落定后按需加载，继续使用 `loadPrompt` 缓存。原文内容和换行不变。
- 卡片「复制」仍直接复制，来源仍打开外链；视频封面仍只负责播放，不误开详情或触发库切换。
- 保留既有单库逻辑：标题等卡片主体打开详情时，等关闭动画结束后再进入 Prompt 单库模式，避免源卡位置改变；「查看原始提示词」只打开详情，不额外切换库。

## 关键文件与复用点

- 修改 `src/components/case-library/model-trending-prompts.tsx`：统一详情状态，替换下拉入口，保留二级操作。
- 新增 `src/components/case-library/prompt-detail-shell.tsx`：复用 `CaseFlipTransition`、Dialog 标题组件，并按需使用现有 `PromptPanel`。
- 修改 `src/styles/showcase.css`、`src/styles/model-detail.css` 中必要的查看按钮与翻转层级规则；不重做卡片样式。
- 复用且原则上不改动：`case-flip-transition.tsx`、`use-case-flip.ts`、`prompt-panel.tsx`、`lib/prompt-cache.ts`、`hover-video.tsx`。
- 在 `tests/` 增加入口与详情交互回归测试；只有确需新文案时才同步 11 语言字典。

## Implementation checklist

- [ ] 首页和合集共用的 Prompt 卡移除原文 `<details>`，改为独立详情入口；默认卡片高度、三列间距保持不变。
- [ ] 每个 Prompt 列表同时最多打开一个详情，记录真实源卡与触发按钮，复用现有 Case 翻转弹层和关闭行为。
- [ ] 弹层显示该条标题、描述、来源与逐字原文；正文按需加载并复用原文复制／下载／失败重试。
- [ ] 标题入口在详情关闭后执行原有单库切换；查看原文入口不切换；复制、来源与视频控制不误开详情。
- [ ] Prompt 区域翻转层级适配现有遮罩；关闭、快速开关及切换页面后恢复滚动锁和焦点，不影响 Case 详情。
- [ ] 不改已上线的 `/prompts/collection/...`、媒体 Referrer 策略、12 条原文与现有视频交互。

## Verification checklist

- [ ] 默认状态无原文下拉、无提前请求正文；点击标题／查看原文后显示正确提示词，不再撑高网格。
- [ ] 长原文保留换行并在详情内滚动；复制／下载正确，网络失败可重试；关闭后快速打开另一条不串内容。
- [ ] 复制、来源、视频 hover／点击不误开详情；查看原文不额外切库；标题开关详情不破坏翻转起点。
- [ ] Esc、遮罩、关闭按钮、键盘焦点、减少动态效果、路由离开清理，以及原 Case 详情行为回归。
- [ ] 执行 `pnpm run typecheck`、`pnpm run build`、`node --experimental-strip-types --test tests/*.test.mjs`、`git diff --check`；如文案变化则执行 i18n check 与 scan。
- [ ] 对代表性合集页在 1280px／390px 核对卡片与弹层；浏览器交互或严格性能审计环境仍不可用时，明确记为未验证，不以构建／截图代替。
