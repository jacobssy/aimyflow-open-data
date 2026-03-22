# AimyFlow Open Data

An open, multilingual dataset of AI tools mapped to real job roles.

中文说明见下方。This repository is an indexable, machine-readable companion to AimyFlow, designed for GitHub discovery and clean traffic back to the main product.

Use GitHub to inspect the data. Use AimyFlow to explore live role pages, community voting and workflows.

This repo is designed for people searching for:

- AI tools by career
- AI tools by role
- workflow automation datasets
- open data for AI tool directories
- multilingual AI tool and job mapping

Current snapshot:

- 1,557 AI tools
- 221 roles
- 1,105 role skills

Site links:

- Main site: https://www.aimyflow.com
- Explore tools: https://www.aimyflow.com/en/explore
- Browse roles: https://www.aimyflow.com/en/roles
- Localized docs entry: [`docs/index.md`](./docs/index.md)

## Why This Repo Exists

- publish a clean public dataset that can be indexed independently of the main site
- help developers and researchers inspect role-to-tool mappings quickly
- create a GitHub-friendly discovery surface for people searching by role, career or workflow
- send qualified traffic back to AimyFlow for the full product experience

## Start Here

- Search visitors: open [`docs/index.md`](./docs/index.md)
- Developers and researchers: inspect `data/tools.json` and `data/roles.json`
- Product users: continue to AimyFlow for live role pages and community voting

## Continue On AimyFlow

- [Explore all AI tools](https://www.aimyflow.com/en/explore)
- [Browse roles and workflows](https://www.aimyflow.com/en/roles)
- [See community voting](https://www.aimyflow.com/en/roles)

## What This Repo Publishes

- `data/tools.json`: normalized tool records with localized summaries and linked roles
- `data/roles.json`: role records with localized labels, matched tools and skills
- `data/skills.json`: role skill cards exported from the live dataset
- `data/stats.json`: snapshot counts and generation metadata
- `docs/{locale}/roles/*.md`: GitHub-friendly localized role landing pages
- `docs/index.md`: multilingual docs entry point

## Why Visit AimyFlow Instead Of Staying On GitHub

- richer AI tool detail pages
- role-level workflow pages
- community voting data
- multilingual browsing experience
- direct exploration of tools by profession

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

## Search Strategy

This repo is not meant to mirror the full site. It is meant to create indexable GitHub entry points that can rank for role-based AI tool searches and then send qualified visitors back to `www.aimyflow.com`.

- keep the strongest role pages indexable on GitHub
- avoid publishing thin role pages with zero or near-zero tool coverage
- resolve messy role aliases before export so public mappings stay consistent
- link every role page back to the matching localized AimyFlow page, not just the generic directory

## Internationalization Strategy

The repo supports six locales: `en`, `zh`, `es`, `ja`, `de`, `fr`.

- `en` and `zh` are the broad-coverage primary locales
- `es`, `ja`, `de`, and `fr` publish a curated head set of stronger role pages first
- locale exports should favor quality over page count; if a locale is thin, publish fewer pages
- localization fallback pressure and publishing counts are tracked in `data/stats.json`

## Data Quality Guardrails

The sync script now treats SEO quality as part of the export contract.

- roles with zero or very low tool coverage should not be published as docs pages
- unmatched role references are tracked and quality-checked during sync
- generated stats include publication counts by locale and localization fallback counts
- if role mapping quality falls too far, the sync should fail instead of committing weak exports

## Content Strategy

This repo should publish short, structured, index-like content. Do not copy full website body content here.

- keep GitHub focused on data files, concise summaries and role/tool relationships
- keep the full community voting, workflows and multilingual browsing on the main site

## 中文说明

这个仓库用于承载 AimyFlow 的开放数据导出，是一个适合 GitHub 收录和传播的公开入口，不是主站内容的完整镜像。

你可以在 GitHub 看数据，在 AimyFlow 看实时角色页、社区投票和工作流内容。

适合搜索这些内容的人进入这个仓库：

- 按职业找 AI 工具
- 按岗位看 AI 工具目录
- AI 工作流自动化开放数据
- 多语言 AI 工具与职业映射

当前快照：

- 1557 个 AI 工具
- 221 个职业
- 1105 个职业技能

这个仓库存在的目的：

- 用公开数据页承接 GitHub 和搜索流量
- 让开发者和研究者更容易查看职业与工具的结构化映射
- 给按职业找 AI 工具的人一个更轻量的入口
- 把高质量用户继续引导回 AimyFlow 主站

建议从这里开始：

- 搜索访客：先看 [`docs/index.md`](./docs/index.md)
- 开发者和研究者：先看 `data/tools.json` 与 `data/roles.json`
- 产品用户：回到 AimyFlow 查看实时角色页和社区投票

适合放在这里的内容：

- 结构化数据
- 简短工具摘要
- 职业与工具映射
- 指向主站的详情链接
- 多语言 GitHub 文档页

不适合放在这里的内容：

- 主站完整正文
- 角色详情页长文案
- 工作流完整内容
- 社区投票完整交互

推荐入口：

- 主站首页：https://www.aimyflow.com
- 主站职业页：https://www.aimyflow.com/zh/roles
- 多语言文档入口：[`docs/index.md`](./docs/index.md)
