# 镜心 · 添薪

## 添域

镜心 第一域为「东方文人墨客」三十人。
新域贡献，请：

1. 新建 `src/domain/figures/figures.<your-domain>.ts`，遵循
   [`figure.types.ts`](./src/domain/figures/figure.types.ts) 与既有
   [`figures.east-literati.ts`](./src/domain/figures/figures.east-literati.ts) 的写法。
2. **人物 30+**；每位皆有 12 维向量，且分布在五区段（极端外 / 偏外 / 中段 / 偏内 / 极端内）。
3. 新建 `src/domain/items/items.<your-domain>.ts`，48 题（12 维 × 4 题）。
4. 在 `src/domain/figures/figures.index.ts` 与 `src/domain/items/items.index.ts` 注册新域。
5. 在 `src/pages/Path.tsx` 把对应卡片 `ready: true`。
6. 在 `scripts/gen-portraits.mjs` 中加新域人物，由 SVG 自动出图。

## 文体

人物条目以"文言-白话"双行：

- 文言（4-12 字）：凝练之定场句。
- 白话（30-80 字）：以正史为本，述其行迹与性格。
- 轶事两条：以正史或为世共知之典为限。
- 不夸张，不溢美，不苛责。

## 出图

每域须有手绘水墨 SVG 肖像，存放于 `public/portraits/<domain>/`。
先生成可由 `node scripts/gen-portraits.mjs` 跑出占位图，
再以设计师出图替换。

## 提交

- Commit 文以"动作为主"，如 `add(east-statesman): 宰相 30 人`。
- 不引入新依赖而不议。
- 不动 `package.json` 中的 `name`、`license`、仓库地址。
