# AimyFlow Open Data

AI tools by role, career, and workflow.

This repository is the public, multilingual open-data layer for [AimyFlow](https://www.aimyflow.com), built for:

- people searching for AI tools by job role
- developers looking for a machine-readable AI tools dataset
- researchers comparing role-to-tool coverage across professions
- search users who want a fast GitHub entry point before visiting the main site

If you want the full product experience, use AimyFlow:

- [Explore AI tools](https://www.aimyflow.com/en/explore)
- [Browse job roles](https://www.aimyflow.com/en/roles)
- [Open multilingual docs index](./docs/index.md)

## What You Can Find Here

This repo is designed to rank and be discoverable for queries such as:

- AI tools by role
- AI tools by profession
- AI tools for software engineers
- AI tools for marketers
- AI tools for content creators
- multilingual AI tools dataset
- open data for AI tools and careers

This repository publishes:

- `data/tools.json`: normalized AI tool records with localized summaries and linked roles
- `data/roles.json`: role records with localized titles, matched tools, and role skills
- `data/skills.json`: role skill cards exported from the live dataset
- `data/stats.json`: latest snapshot counts, publication rules, and quality metrics
- `docs/{locale}/roles/*.md`: GitHub-friendly role landing pages
- `docs/index.md`: multilingual documentation entry point

## Start With These Pages

Popular role pages on GitHub:

- [Software Engineer](./docs/en/roles/software-engineer.md)
- [Content Creator](./docs/en/roles/content-creator.md)
- [Copywriter](./docs/en/roles/copywriter.md)
- [Digital Marketing Director](./docs/en/roles/digital-marketing-director.md)
- [Project Management Officer](./docs/en/roles/project-management-officer.md)
- [Data Scientist](./docs/en/roles/data-scientist.md)

Go deeper on AimyFlow:

- [AI tools for software engineers](https://www.aimyflow.com/en/role/software-engineer)
- [AI tools for content creators](https://www.aimyflow.com/en/role/Content%20Creator)
- [AI tools for copywriters](https://www.aimyflow.com/en/role/copywriter)
- [AI tools for digital marketing](https://www.aimyflow.com/en/role/digital-marketing-director)
- [All roles and workflows](https://www.aimyflow.com/en/roles)

## Why This Repo Exists

This is not a full mirror of `www.aimyflow.com`.

It exists to:

- create indexable GitHub pages for long-tail role-based AI search queries
- publish clean open data that can be inspected outside the main product
- give search visitors a faster first step into the AimyFlow ecosystem
- send qualified users back to AimyFlow for live role pages, community voting, and workflows

## Why Visit AimyFlow Instead Of Staying On GitHub

GitHub is the lightweight discovery layer. AimyFlow is the main product.

Use AimyFlow for:

- richer AI tool detail pages
- live role pages and workflow pages
- community voting and ranking signals
- deeper multilingual browsing
- a better end-user exploration flow

## Search And SEO Strategy

This repository is intentionally optimized as a GitHub discovery surface, not as a content farm.

- publish strong role pages, not every possible thin page
- avoid low-coverage role pages with weak search value
- normalize messy role aliases before export so public mappings stay trustworthy
- link every role page back to the matching localized AimyFlow destination
- keep GitHub content short, structured, and index-like

## Internationalization Strategy

Supported locales:

- `en`
- `zh`
- `es`
- `ja`
- `de`
- `fr`

Publishing is quality-based, not quantity-based:

- `en` and `zh` are the broad-coverage primary locales
- `es`, `ja`, `de`, and `fr` publish curated head sets first
- locale exports favor stronger localized pages over maximum page count
- localization fallback counts and publication counts are tracked in `data/stats.json`

## Data Quality Guardrails

The export pipeline treats SEO quality as part of the contract.

- low-value role pages should not be published to docs
- unmatched role references are tracked and quality-checked during sync
- publication counts by locale are tracked
- localization fallback counts are tracked
- if role mapping quality drops too far, sync should fail instead of committing weak exports

## Latest Snapshot

The latest live snapshot is stored in:

- [`data/stats.json`](./data/stats.json)

That file includes:

- tool count
- role count
- skill count
- locale publication counts
- quality metrics for role matching and localization coverage

## Local Usage

Copy `.env.example` to `.env.local`, fill in the Supabase values, then run:

```bash
node scripts/sync-from-supabase.mjs
```

The sync script also tries local env files from `/root/aimyflow-aitools/.env.local` and `/root/aimyflow-aitools/.env` when present, so it can be run conveniently beside the main project.

## GitHub Automation

The workflow at `.github/workflows/sync.yml` can run on a schedule and commit refreshed exports automatically.

Required GitHub repository secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended)
- `AIMYFLOW_SITE_URL` (optional, defaults to `https://www.aimyflow.com`)

## 中文说明

这是 AimyFlow 的开放数据仓库，用来承接 GitHub 和 Google 上与“按职业找 AI 工具”相关的搜索流量。

它更像一个适合收录和传播的公开入口，而不是主站内容的完整镜像。

这个仓库适合这些搜索意图：

- 按职业找 AI 工具
- AI tools by role
- AI tools for software engineers
- AI tools for marketers
- 面向内容创作者的 AI 工具
- 多语言 AI 工具数据集

这里适合看：

- 结构化 JSON 数据
- 职业与工具映射
- 精简的 GitHub 职业落地页
- 指向主站的深链接

主站 AimyFlow 更适合看：

- 实时职业页
- 社区投票
- 工作流内容
- 更完整的工具详情
- 更强的多语言浏览体验

建议入口：

- 多语言文档索引：[`docs/index.md`](./docs/index.md)
- 工具数据：[`data/tools.json`](./data/tools.json)
- 职业数据：[`data/roles.json`](./data/roles.json)
- 主站首页：https://www.aimyflow.com
- 主站职业页：https://www.aimyflow.com/zh/roles
