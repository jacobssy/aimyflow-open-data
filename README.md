# AimyFlow Open Data

Open data exports for AimyFlow's AI tools by role directory.

中文说明见下方。This repository is an indexable, linkable, machine-readable companion to the main site, not a second copy of the website.

This repo is designed for people searching for:

- AI tools by career
- AI tools by role
- workflow automation datasets
- open data for AI tool directories
- multilingual AI tool and job mapping

Current snapshot:

- 1,507 AI tools
- 221 roles
- 1,105 role skills

Site links:

- Main site: https://www.aimyflow.com
- Explore tools: https://www.aimyflow.com/en/explore
- Browse roles: https://www.aimyflow.com/en/roles
- Localized docs entry: [`docs/index.md`](./docs/index.md)

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

## Best Entry Points

- Developers and researchers: start with `data/tools.json` and `data/roles.json`
- Search visitors: start with [`docs/index.md`](./docs/index.md)
- Product users: continue to AimyFlow for role pages, tool details, workflows and community voting

## Why This Exists

- create an open dataset that can rank and be shared independently of the main site
- earn GitHub discovery, stars, forks and links
- give developers a structured way to inspect the directory
- send qualified traffic back to AimyFlow for the full product experience

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

## Content Strategy

This repo should publish short, structured, index-like content. Do not copy full website body content here.

- keep GitHub focused on data files, concise summaries and role/tool relationships
- keep the full community voting, workflows and multilingual browsing on the main site

## 中文说明

这个仓库用于承载 AimyFlow 的开放数据导出，不是主站内容的完整镜像。

适合搜索这些内容的人进入这个仓库：

- 按职业找 AI 工具
- 按岗位看 AI 工具目录
- AI 工作流自动化开放数据
- 多语言 AI 工具与职业映射

当前快照：

- 1507 个 AI 工具
- 221 个职业
- 1105 个职业技能

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
