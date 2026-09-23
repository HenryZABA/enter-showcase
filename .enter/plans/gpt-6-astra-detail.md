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
- [ ] 首屏英文标题及对应 SEO 标题使用 and，移除该位置的 &。
- [ ] 左栏新增有标签的可编辑 Prompt 输入框，右侧模型图保留。
- [ ] 按钮复制最新输入成功后打开 Enter 首页；空输入禁用、失败留页提示。
- [ ] 输入/操作区采用已有分析工具的隐私屏蔽规则，不上报 Prompt。
- [ ] 移除 Featured 区块，锚点指向唯一 All Prompts 区。
- [ ] All Prompts 展示三张明确待补充的卡片，含视频位、提示词位和禁用按钮。
- [ ] About 与 5 条 FAQ 应用新面板样式，原 Header/Footer 不变。
- [ ] 新文案加入所有现有语言资源，不改变语言清单或 URL 规则。

## Verification checklist
- [ ] 正向：编辑 Prompt 后复制结果等于当前内容，成功后跳转指定首页；不带未经支持的参数。
- [ ] 负向：空格输入不能提交；剪贴板拒绝时无成功提示、无跳转；待补充卡片不能播放或跳转。
- [ ] 锚点定位 All Prompts；FAQ 可通过键盘展开收起；原入口与旧案例路由未变。
- [ ] 检查正文和构建 HTML 的英文标题、canonical、FAQ JSON-LD；语言切换后不出现缺失 key。
- [ ] 使用 `mobile_390` 与 `desktop_1280` 检查同一详情路径，确认输入框、三列转单列、About 和 FAQ 无溢出。
- [ ] 执行 `pnpm run typecheck`、`pnpm run build`、i18n check/scan 与 `git diff --check`。
- [ ] 执行相关构建审计；区分原有预算/CSR 告警和本次新增问题。浏览器或发布 HTTP 证据不足时标为未验证，不虚报通过。
