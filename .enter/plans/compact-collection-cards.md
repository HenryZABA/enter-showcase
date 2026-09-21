# Context

用户要求：Collections 每个主题是一张小卡片，视频封面直接播放；“Back to Collections” 与 “Explore More” 效果、颜色和规格一致。同时修复 Enter Logo 异常放大的 bug——不是重新设计或任意缩小正常 Logo。

当前代码确认：目录 `:only-child` 规则把单卡扩展至整行；CollectionCard 只渲染图片；返回按钮为普通链接；Logo 仅通过 `h-5 w-auto` 约束，没有 HTML width/height。当前桌面目录截图未复现 Logo 巨大问题，根因尚未确认，不能将缺少尺寸属性直接认定为原因。

## 推荐处理

1. 优先检查 Logo 尺寸样式加载与生效情况，使用明确的图片 width/height 属性及专用样式尺寸约束，避免原图尺寸撑开导航；保留用户提供的图片及正常约 20px 高的展示规格，不再擅自改成另一种 Logo 设计。
2. 删除目录单卡跨列和超宽比例规则，采用桌面三列、平板两列、手机单列的小卡片网格，缩紧卡片标题与信息间距。保留首页曲面轮播和合集详情内容。
3. 在合集数据中增加可选 `coverVideo`，GPT-6 Astra 使用已有 MP4；卡片视频静音、循环、自动内联播放，已有封面作 poster；无视频继续显示图片。
4. 复用 `liquidButtonVariants`、玻璃内部结构和现有 CSS，提供语义正确的链接版本；返回按钮使用与 Explore More 相同的 `lg` 尺寸、默认非流动描边，保留左箭头和带语言参数的目标地址。

## 关键文件

- `src/components/layout/Header.tsx`、`src/index.css`：Logo 尺寸约束。
- `src/styles/collection-directory.css`：小卡片布局。
- `src/components/case-library/collection-card.tsx`：媒体渲染。
- `src/data/showcase-collections/types.ts`、`src/data/showcase-collections/gpt-6-astra.ts`：视频字段。
- `src/components/ui/liquid-glass-button.tsx`、`src/components/case-library/showcase-library-view.tsx`：返回链接复用按钮视觉。

## Implementation checklist

- [x] 对照用户截图，补齐 Logo 的 116×20 HTML 尺寸属性及专用 CSS 最大尺寸约束，不改变图片素材和正常展示比例。用户截图确实显示原图级放大，本地未复现导致样式失效的具体条件。
- [x] 删除目录单主题铺满规则，改为紧凑三列/两列/单列网格。
- [x] 为 GPT-6 Astra 绑定已有视频，设置 autoPlay、muted、loop、playsInline。
- [x] 保留图片卡片分支、poster 和整卡 Link 导航。
- [x] 增加共享 variants、CSS 和内容结构的 LiquidLink，替换 Back to Collections。

## Verification checklist

- [x] 在 `mobile_390`、`desktop_1280` 检查目录：Logo 保持正常尺寸，桌面卡片宽约 395px，手机卡片宽约 342px，无横向溢出。手机导航保持原有换行行为。
- [ ] 视频持续播放/循环尚无自动化时间轴验证；截图已显示视频画面，静态图片分支通过代码检查。
- [ ] `/showcases/collections/gpt6` 返回按钮桌面外观已确认，目标地址和语言参数通过代码检查；点击交互未自动化验证。
- [ ] Logo 冷加载回归尚未自动化验证；已确认尺寸属性和显式 CSS 均存在，本地截图未复现用户先前的巨大 Logo。
- [x] `pnpm run build`（TypeScript + Vite）通过，`git diff --check` 通过；另执行 `pnpm exec vite build --manifest` 成功。

## 验证边界

- 构建通过；严格构建审计未验证：技能审计脚本缺少 parse5，审计说明读取工具报错。既有大于 500kB 的入口包警告仍在，本次不重构无关加载链。
- 浏览器性能未验证：无受控冷启动/CPU/网络对比数据。
- 功能回归：桌面及手机目录视觉检查通过；返回按钮桌面视觉检查通过；完整播放时间轴与点击回归未验证。
- 部署 HTTP 未验证：未提供实际发布地址。
