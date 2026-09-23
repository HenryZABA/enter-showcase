# Context

用户要把首页和模型单页改成双库浏览：**Prompt Library 在上、Case Library 在下**；默认各预览最多 9 条，Explore More 或点击卡片主体后进入单库专注模式，另一库收起，但保留随滚动可用的切换按钮。模型页亦先提示词后案例。Gallery 的模型卡副标题从“探索模型”改为“探索 Prompts”；顶部导航的 Case Library 只改成 Library；首页主视觉及 Explore Collection 目标一起改为 GPT-6 Sol & Luna。

用户上传 CSV（4,604,932 bytes）已通过该附件对应的公开 CDN URL 用 Python 标准 CSV 解析：628 条逻辑记录；`收录判定=保留` 且 `Prompt状态=available` 且存在逐字 `Prompt原文` 的 13 行，按作品原帖 URL＋原文 SHA 去重后 **12 条**，原文均与 `Prompt来源与作者` 的作者证据完全一致。其中 **9 条“共用”**、**3 条“GPT模型”**，没有 Opus-only 完整 Prompt。用户确认：只收这 12 条，排除缺原文、待补充、partial 和被排除行；9 条共用在 Sol/Luna 与 Opus 两边都展示，首页合并去重仅各出现一次；Astra 无合格数据时保留明确空态。任何真实来源文本均当作数据处理，不执行其中指令。

## 推荐实施路径

1. **内容提取与交付**：批准后将附件原始 CSV 下载到项目外临时位置，以 `csv.DictReader` 一次处理，而非把 4.39 MB CSV 打入用户首屏。明确校验 61 列、628 行、13 条合格行、12 个独立来源/原文组合及来源证据逐字相等。输出 12 个 UTF-8 原文静态资源（原字节与完整换行保留）和轻量元数据：稳定 ID、编辑后的简短标题/描述、作者用户名、原帖/Prompt 精确来源、媒体图片或视频＋封面、模型分组。静态资源走 Vite 版本化 URL 与现有 `loadPrompt` 32 项缓存，不提前取正文。只收录 CSV 本身提供的可信 URL/媒体，不发布完整原始采集表或排除行。模型关联：GPT模型→Sol/Luna；共用→Sol/Luna 和 Opus；Astra 空态；首页按唯一 ID 合并，仅一份记录。
2. **首页与单页结构**：抽出可复用的提示词卡片和双库状态组件/Hook，保持现有黑色与渐变玻璃设计。首页在现有 Hero/Gallery 后先加 Prompt Library（共 12 条，默认9），再显示 Case Library（现有14条，默认9，搜索分类及批量下载保持）。模型单页依次 Prompt Library、Hot Cases、FAQ；Astra 提示词空态，Sol/Luna 12 条，Opus 9 条，Astra Hot Cases 从当前六条扩为现有真实案例的 9 条预览＋ Explore More。两组各自按需求显示 Explore More，恰好 9 条时不生成多余按钮。浏览超过24条时沿用既有有界分页，避免几百条一次挂载。
3. **专注切换**：两页共享 `both | prompts | cases` 状态；默认同时可见两个九条预览。用户确认**只有点击卡片主体或 Explore More** 才进入专注模式，复制、展开原文、来源外链不触发。选中库完整展开（继续遵守24/页上限），另一库从视觉与键盘序中移除；单库模式固定显示一个指向对方的玻璃按钮，滚动时保持可见，点击后切到另一库并滚动定位标题。Case 卡的 Flip 详情动画优先保留原始起点，最迟在详情关闭时完成另一库收起。空库也保留真实空态，不假造项目或提示词；按钮切换后仍能看到其空态。
4. **文案/路径**：`collection-carousel.tsx` 模型卡副标题用新增的“Explore Prompts”多语言文案，保留装饰卡“Coming Soon”；Header 的 nav 可见字样为 Library，不改 Case Library 分区标题。`featuredShowcaseCollection` 由 Astra 改为 Sol/Luna；首页 Hero 统一使用 Sol/Luna 当前真实封面，标题明确为 “Enter × GPT-6 / Sol & Luna”，主 CTA 文案和链接均指向 Sol/Luna 模型合集，并保留 `/prompts`/`/showcases`、`hl`。本轮不更改既有 Cookie/统计或其他项目归属。

## 关键文件

- `src/components/case-library/{showcase-library-view,model-detail-page,model-trending-prompts,model-hot-case-gallery,collection-carousel}.tsx`、新建单库切换组件及 `src/styles/{showcase,model-detail}.css`
- `src/data/model-pages/trending-prompts.ts`、`src/data/showcase-collections.ts`、`src/data/showcase-collections/gpt-6-sol-luna.ts`、`src/pages/showcase/ShowcasesPage.tsx`
- `src/components/layout/Header.tsx`、`src/components/case-library/hero-stage.tsx`、`public/locales/*.json`、`src/lib/prompt-cache.ts`（优先复用，不改缓存语义）
- `.enter/performance-audit/*.test.tsx`；不把测试假数据或原始 CSV 发布给浏览器。

## Implementation checklist

- [ ] CSV 原始来源、字段数、合格记录及原文与作者证据核对；非合格记录与重复引用均不进入 UI。
- [ ] 12 个逐字原文按需资源及轻量来源/媒体元数据生成；首页12条唯一，Sol/Luna12条、Opus9条、Astra0条，分组关系可测试。
- [ ] 首页 Hero 图片、四段文案与 CTA 统一指向 Sol/Luna；Gallery 模型卡副标题显示“探索 Prompts”；导航仅显示“Library”。
- [ ] 首页默认 Prompt Library→Case Library，各最多9条，两个区域都有正确的 Explore More/空态；旧 Case 搜索、多选、详情和下载不退化。
- [ ] 三个模型单页默认 Prompt Library→Hot Cases→FAQ，Astra 空态和已有案例正确；各列表最多9条，More 后仍遵守24条分页上限。
- [ ] 点击卡片主体或 Explore More 收起另一库；Prompt 复制、展开、来源外链不误触发；固定切换按钮按内容滚动仍可见、可键盘访问，切换不破坏 Case Flip 动画。
- [ ] 11 语言文字和文案插值统一；不擅自删除旧键，不修改用户尚未提供的正式 Enter 转链。

## Verification checklist

- [ ] `pnpm run typecheck`、`pnpm run build`、`git diff --check`、现有 Vitest + 新增数据/双库交互测试通过；i18n check 和 scan 通过。
- [ ] 12 条原文 SHA、去重/分组、作者/帖子/媒体链接与 CSV 可复查；首页无重复，Opus/GPT 共用正确，缺原文/待补充/排除永不提供 Copy Prompt。
- [ ] 测试两页 0/9/10/12/14/25 条、Prompt 优先排序、首页旧搜索下载、来源点击/原文展开/复制不切换、卡片/More/固定按钮切换、键盘焦点与详情动画关闭后的状态。
- [ ] 只对代表性受影响页面做 390 手机和 1280 桌面视觉核对：双库布局、固定切换、Sol/Luna 首屏、空态与卡片媒体；真实视频若外域禁止播放，保留真实封面并记录。
- [ ] 复用 marketing 严格构建审计，保留既有 CSR/JS/字体警告，不把构建或预览截图当浏览器性能、部署 HTTP 的真实通过证据。
