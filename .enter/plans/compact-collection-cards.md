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

- [ ] 排查 Logo 异常尺寸路径；补齐明确的尺寸属性及专用样式约束，不改变图片素材和正常展示比例。
- [ ] 删除目录单主题铺满规则，改为紧凑网格；单卡不会随主题数量变大。
- [ ] 为 GPT-6 Astra 绑定已有视频，并在卡片内静音循环内联播放。
- [ ] 保留图片卡片分支、poster 和整卡导航。
- [ ] 增加复用现有液态玻璃结构的链接组件，并替换 Back to Collections。

## Verification checklist

- [ ] 按未指定设备的情况，以 `mobile_390`、`desktop_1280` 检查目录：Logo 不撑开导航、卡片不铺满桌面、无横向溢出。
- [ ] 验证视频实际播放而非仅显示 poster；确认无视频字段时仍渲染图片。
- [ ] 检查 `/showcases/collections/gpt6` 返回按钮外观及跳转，保持语言参数。
- [ ] 检查 Logo 冷加载时尺寸约束；如无法复现用户截图中的异常，明确记录而不宣称已确认根因。
- [ ] 运行 `pnpm run build`（含 TypeScript 校验）；项目无 lint 脚本，不宣称通过 lint。
