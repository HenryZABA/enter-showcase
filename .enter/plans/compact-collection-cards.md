# Context

当前 Collections 目录在只有一个主题时会把卡片横跨整行，并且只显示静态封面；用户希望每个主题始终保持小卡片尺寸，视频主题直接在卡片内播放。同时，合集详情页的 “Back to Collections” 需要与 “Explore More” 使用相同的液态玻璃效果、色彩和尺寸体系。

## Recommended approach

- 为合集数据增加可选的卡片视频字段，并为 GPT-6 Astra 指向现有 `/media/showcase-collections/gpt-6-astra-v1.mp4`，继续使用现有 poster 作为加载与降级画面。
- `CollectionCard` 根据媒体类型渲染图片或 `<video>`；视频采用 `autoPlay`、`muted`、`loop`、`playsInline`，保持整张卡片可点击。
- 删除单卡横跨整行及超宽比例规则；目录网格改为响应式小卡片布局，让一个主题只占一个正常卡位。
- 在现有液态玻璃按钮组件中增加同样视觉结构的链接版本，避免复制样式；详情页返回链接改用该组件，并保持左箭头与原导航地址。

## Critical files

- `src/data/showcase-collections/types.ts`
- `src/data/showcase-collections/gpt-6-astra.ts`
- `src/components/case-library/collection-card.tsx`
- `src/styles/collection-directory.css`
- `src/components/ui/liquid-glass-button.tsx`
- `src/components/case-library/showcase-library-view.tsx`

## Implementation checklist

- [ ] 在 `ShowcaseCollection` 中增加可选卡片视频源，并为 GPT-6 Astra 绑定现有 MP4。
- [ ] 在 `CollectionCard` 中按数据渲染视频或图片，视频静音自动循环播放且可内联播放。
- [ ] 调整 Collections 目录网格，使单个主题在桌面端保持小卡片而不再铺满整行，移动端保持单列自适应。
- [ ] 新增复用 `liquidButtonVariants` 和液态玻璃内部结构的链接组件。
- [ ] 将合集详情页的 “Back to Collections” 替换为与 “Explore More” 同规格的液态玻璃链接按钮。

## Verification checklist

- [ ] 打开 `/showcases/collections`，确认唯一主题只占一个小卡位，视频在卡片内静音循环播放。
- [ ] 确认视频 poster 在加载前可见，未配置视频的合集仍正常显示静态图片。
- [ ] 打开 `/showcases/collections/gpt6`，确认返回按钮的玻璃效果、渐变描边、圆角和尺寸与 “Explore More” 一致，点击可回到合集目录。
- [ ] 在 `mobile_390` 与 `desktop_1280` 视口检查卡片尺寸、溢出与按钮布局。
- [ ] 运行 `pnpm run build`；项目无 lint 脚本时以 TypeScript + Vite 构建为准。
