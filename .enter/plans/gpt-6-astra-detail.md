# GPT-6 Astra 单页调整

## Context
参考 Combos 模型单页与用户提供的两张截图，优化当前 Astra 页面。本次以最新确认覆盖上次“不放输入框”的要求：增加可编辑 Prompt；仅保留 All Prompts；展示三张明确标注待补充的组件样式卡；美化 About 与 FAQ。

## 已确认范围
- H1 改为 **GPT-6 Astra Prompts and App Examples**，只把 `&` 改为 `and`。
- 首屏仍左文右图：左侧标题下加入 Prompt 输入框，右侧保留 Astra 模型图。
- 输入框预填原文档的项目仪表盘 Prompt。按钮复制用户当前输入，再打开 `https://enter.converge.ai/`；**不宣称自动传入或自动生成**。
- 移除 Featured Prompts，仅保留 All Prompts。三张卡片标明“待补充”，不使用真实或虚构案例数据。
- 用户所说的下方 feature 指 **FAQ**；不新增 Features 区、不修改公共 Footer。

## 推荐实现
### 首屏输入框
复用现有深色主题、字体和粉橙渐变，参考 Combos 的圆角玻璃面板：顶部短标签、分隔线、可编辑多行文本、底部说明与主按钮。桌面位于左栏，手机全宽。
按钮采用准确表达“复制并打开 Enter”的文案；复制成功后同标签页跳转首页，避免异步复制后的弹窗拦截。空白内容禁用按钮；复制失败保留输入并明确提示，不虚报成功、不自动离页。
输入区域与复制操作使用项目已有的隐私排除规则，避免现有分析工具采集 Prompt；不新增埋点或后台能力。

### All Prompts
居中区块标题，桌面三列、手机单列。每张卡片：
1. 上方 16:9 视频预留区与视频图标，明确“视频待补充”，不是可播放的假视频。
2. 下方标题预留、简短说明、提示词预留面板。
3. 底部完整样式的禁用跳转按钮，清晰说明内容待补充。
不添加没有数据可筛选的假分类按钮。首屏 Browse Examples 锚点更新为 `#all-prompts`。

### About 与 FAQ
About 改为有背景层次、细边框及品牌细节的介绍面板，整理“关于模型提示词”和“在 Enter 中使用”层级。FAQ 改为独立圆角折叠项，保留原 5 问、原生 details/summary 键盘行为；展开、悬停、焦点状态一致。

### 保持不变
详情路径 `/prompts/gpt-6-astra` 与 `/showcases/gpt-6-astra`、入口卡片跳转、旧案例集合、Header/Footer、语言切换和资源命名空间 `/_prompts` 均保留。复用现有 `useShowcaseTheme`、`useModelPageSeo`、`getAstraCopy`、语言资源和通知组件。SEO 中对应英文标题将 `&` 同步为 `and`，保留 canonical 与结构化数据；构建插件继续放根目录 `model-page-head.ts`，不得移回被忽略的 `build/`。

## 关键文件
- `src/pages/showcase/Gpt6AstraPage.tsx`：组合输入区、单一 All Prompts、About 和 FAQ。
- `src/components/case-library/model-prompt-composer.tsx`（新增）：输入与复制后跳转。
- `src/components/case-library/model-prompt-placeholder.tsx`（新增）：三张待补充卡片复用同一组件。
- `src/components/case-library/model-faq.tsx`、`src/styles/model-detail.css`：局部视觉与状态。
- `src/data/model-pages/gpt-6-astra.ts`、`public/locales/*.json`：标题与新文案，沿用现有 i18n。
- 只在必要时调整 `src/components/case-library/model-empty-section.tsx` 的使用，不改旧集合内容。

## Implementation checklist
- [x] 首屏英文标题及对应 SEO 标题使用 and，移除该位置的 &。
- [x] 左栏新增有标签的可编辑 Prompt 输入框，右侧模型图保留。
- [x] 按钮复制最新输入成功后打开 Enter 首页；空输入禁用、失败留页提示。
- [x] 输入/操作区加入 mp-no-track、mp-block 与 data-clarity-mask；未添加 Prompt 上报逻辑。线上 SDK 屏蔽效果未实测。
- [x] 移除 Featured 区块，锚点指向唯一 All Prompts 区。
- [x] All Prompts 展示三张明确待补充的卡片，含视频位、提示词位和禁用按钮。
- [x] About 与 5 条 FAQ 应用新面板样式，原 Header/Footer 不变。
- [x] 新文案加入所有现有语言资源，不改变语言清单或 URL 规则。

## Verification checklist
- [x] `tests/model-prompt-action.test.mjs` 的 5 项自动测试通过：原样复制编辑内容、复制先于跳转、空白输入不执行、权限拒绝和剪贴板不可用时不跳转。
- [x] 卡片使用明确的 disabled 按钮，无 video/source 或假视频请求；输入失败提示与空白禁用逻辑已实现。浏览器系统剪贴板权限弹窗未实测。
- [ ] 浏览器键盘 FAQ、实际锚点点击、路由往返尚未进行完整交互测试；沿用原生 details/summary 与现有路由，代码未更改旧入口。
- [x] 两个入口构建 HTML 的英文标题、canonical 与 5 项 FAQ JSON-LD 断言通过；i18n check/scan 通过，完整语言切换交互未实测。
- [x] `mobile_390` 与 `desktop_1280` 同一路径截图已检查：输入框、三列转单列、About 与 FAQ 无可见横向溢出。现有 Cookie 提示仍可覆盖部分首屏，未更改该公共组件。
- [x] `pnpm run typecheck`、`pnpm run build`、i18n check/scan 与 `git diff --check` 通过。
- [x] 严格审计已执行，零错误但因既有 JS/字体预算、CSR 静态正文和外部字体告警未通过；未抬高预算。浏览器性能与发布 HTTP 未验证，未宣称达标。
