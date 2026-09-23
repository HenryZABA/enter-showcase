# Context

用户要把三个模型合集的目录页和单页写得更清楚：删除目录卡图片上的“Model Library”、标题下的“Explore model”、目录大标题前后的装饰文案；目录卡说明只说这里收录该模型相关的有趣案例。单页删掉顶部“Model Library”、营销式副标题，以及 Hot Cases、Trending Prompts、FAQ 标题上方的编号小字；缩小 Hot Cases 卡片的说明文字。同时为今后收录的 Cases 与 Trending Prompts 预留**静态图片或视频**两种真实媒体格式。项目尚未收到其他模型的新案例和外部提示词，不新增虚构媒体或内容。

## 实施方式

- 在 `ShowcaseCollectionsPage.tsx` 与 `collection-card.tsx` 只保留“Collections.”标题、真实模型名称和一句直白描述；图片不叠加 Model Library，标题下不再出现 Explore model。修改三个 `showcase-collections/*.ts` 的描述，在 11 份 `public/locales/*.json` 中对应更新真实文案：Astra 可以介绍现有案例，Sol/Luna 和 Opus 只表述“将收录”，不假装已有案例。
- `model-detail-page.tsx` 删除标题上方的眉题、标题下营销句，以及 Hot Cases / Trending Prompts 上面的编号；`model-faq.tsx` 删除 FAQ 上面的“03 / FAQ”。保留三页标题、项目输入框、模型封面、两个内容区、FAQ、返回按钮和 Footer。清理 `ModelPageCopy` 中不再渲染的 eyebrow/tagline 等字段及 scoped 旧 CSS；模型封面下重复的“01 / MODEL”索引也同步去除，不改真实案例和模型的名称。
- 仅调整 `model-detail.css` 中 `.model-hot-grid .case-photo-caption p` 的字号（包括手机），不改变主案例目录的卡片字体与现有卡片点击详情交互。
- 用一个聚焦的可见性视频组件复用已有 `collection-card.tsx` 的加载/播放生命周期：靠近视口才设置 src，可见且页面活动时静音循环播放，离屏/后台暂停，卸载清理监听和 observer，减少动态效果时停留在 poster。Cases 的 `CaseEntry.gallery` 在既有 `imageUrl`（视频封面兼详情 poster）上支持可选 `videoUrl`；无 `videoUrl` 保持既有静态图片。Trending Prompt 将可选媒体明确区分 `{type:'image',src}` 和 `{type:'video',src,poster}`，无媒体的卡片保持简洁；图片/视频同为 16:9 稳定占位。播放被浏览器阻止时保留 poster，不自动创建假内容或额外 API。
- 保留当前图片资源、Gallery 动效和 Cookie/统计、路由、`hl`、`/_prompts` 路径。没有新增数据和转链：复制/下载后强制在新标签页打开 Enter 仍待用户提供正式链接，绝不接临时假 URL。

## 关键文件

- `src/pages/showcase/ShowcaseCollectionsPage.tsx`、`src/components/case-library/collection-card.tsx`、`src/styles/collection-directory.css`
- `src/components/case-library/{model-detail-page,model-faq,case-photo-card,model-trending-prompts}.tsx`、`src/styles/{model-detail,case-photogrid}.css`
- `src/data/{cases.ts,model-pages/types.ts,model-pages/trending-prompts.ts,showcase-collections/*.ts}`、`public/locales/*.json`
- 新建共享视频预览组件；仅在 `CasePhotoCard` 和 `ModelTrendingPrompts` 中使用。

## Implementation checklist

- [x] 目录页大标题前后、小卡媒体角标及模型卡标题下的 Explore model 全部消失，标题与链接仍可用。
- [x] 三张目录卡说明改为简单、对应模型且不误导当前空数据的文案；11 语言文本一致（结构校验通过）。
- [x] 三种模型单页的眉题、营销副标题、三个分区编号和重复图片索引消失；原有主标题/输入框/返回链接及 FAQ 仍在。
- [x] 仅 Hot Cases 卡片说明字号减小，默认显示及图片卡原来的悬停/点击行为保持（390/1280 截图取得）。
- [x] Case 卡既支持现有静态图片又支持带 poster 的视频，详情海报及本地案例归属保持不变（测试夹具验证）。
- [x] Trending Prompt 卡可选图片或带 poster 的视频；正文、来源、复制动作与无数据空态不变（测试夹具验证）。
- [x] 两种视频卡均只在邻近视口加载、可见且非后台时播放，离屏/卸载/减少动态效果能安全停止；真实视频源浏览器验收仍待内容提供。

## Verification checklist

- [x] `pnpm run typecheck`、`pnpm run build`、34 项 JSDOM 测试和 `git diff --check` 通过；i18n 校验及最终扫描通过，旧键保留。
- [x] Astra 现有真实卡片在 mobile_390/desktop_1280 截图中可见且小标题更紧凑；目录卡无装饰角标/Explore model 有 DOM 测试。Sol/Luna、Opus 无数据的既有空态及路径由原有测试保护；目录页和视频真实资源的浏览器视觉仍未单独验证。
- [x] 使用**仅存在于测试**的图片与视频夹具验证 Case/Prompt 两种媒体分支、poster、无媒体、进入/离开视口、后台/前台、减少动态效果、被阻止自动播放和卸载；不向正式库注入假案例。
- [x] marketing 严格构建审计无缺失产物错误，但保留现有 CSR 静态正文及 JS/字体预算告警（退出码 1）；浏览器性能、部署 HTTP 缺证据，不能宣称提速或上线缓存达标。
