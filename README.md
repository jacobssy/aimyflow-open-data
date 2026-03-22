# AimyFlow Tool Directory

A multilingual GitHub directory of AI tools from [AimyFlow](https://www.aimyflow.com).

This repository is meant to show:

- the AimyFlow page for each tool
- a short description of what the tool does
- the job roles the tool is suitable for

It is intentionally simple. GitHub is the directory layer. AimyFlow is the full product.

## What This Repo Publishes

- `data/tools.json`: tool records with AimyFlow links, short summaries, and suitable roles
- `data/stats.json`: latest snapshot counts and export quality metrics
- `docs/index.md`: multilingual directory entry
- `docs/{locale}/index.md`: localized tool directory pages

Supported locales:

- `en`
- `zh`
- `es`
- `ja`
- `de`
- `fr`

## Who This Is For

This repo is useful for people searching for:

- AI tools by role
- AI tools by profession
- AI tools for software engineers
- AI tools for marketers
- AI tools for content creators
- multilingual AI tool directory

## Start Here

- [Open the multilingual docs index](./docs/index.md)
- [Inspect the tools dataset](./data/tools.json)
- [Explore all AI tools on AimyFlow](https://www.aimyflow.com/en/explore)
- [Browse roles on AimyFlow](https://www.aimyflow.com/en/roles)

## How Links Are Shown

This repository uses the product or website name as the visible link label.

- good: `[ChatGPT](https://www.aimyflow.com/en/ai/chat-openai-com-chat)`
- not desired: `https://www.aimyflow.com/en/ai/chat-openai-com-chat`

The same rule applies to official website links inside the generated directories.

In multilingual pages, the surrounding copy is localized, while the link label stays aligned with the product or website name.

## Why This Repo Exists

This repo is not a full mirror of `www.aimyflow.com`.

It exists to:

- create an indexable GitHub directory for AimyFlow tools
- make tool discovery easier from GitHub and search engines
- show short tool descriptions without copying the entire main site
- send users back to AimyFlow for the full experience

## Internationalization

Internationalization is part of the repository design, not an afterthought.

- each supported locale gets its own tool directory page
- tool descriptions and suitable role labels are localized when available
- all localized pages link back to the matching localized AimyFlow tool pages
- the goal is one tool directory, available in multiple languages

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

这个仓库现在定位为 AimyFlow 的多语言工具目录。

这里主要展示三类内容：

- 工具在 AimyFlow 上的页面链接
- 工具的简短内容简介
- 这个工具适合哪些职业

这个仓库不是主站完整镜像，而是适合 GitHub 和搜索收录的工具目录层。

你可以把它理解为：

- GitHub：工具列表和快速说明
- AimyFlow：完整工具页、职业页、工作流和更完整体验

多语言也会保留：

- 每个语言版本都有自己的工具目录页
- 工具简介和适合职业会按语言输出
- 每个语言页面都会链接回主站对应语言的工具页
- 链接显示名统一尽量使用产品名或网站名，而不是裸链接或营销标题

建议入口：

- 多语言目录索引：[`docs/index.md`](./docs/index.md)
- 工具数据：[`data/tools.json`](./data/tools.json)
- 主站工具页：https://www.aimyflow.com/zh/explore
