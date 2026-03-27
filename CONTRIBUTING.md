# Contributing

This repository is not meant to be a raw dump of every possible AI tool.

The GitHub homepage should behave like an awesome list:

- curated
- easy to scan
- neutral in tone
- useful for discovery

## What Can Be Added

- A tool that already has a public AimyFlow tool page
- A category section that improves browseability
- A short description that explains what the tool helps with
- Better organization for multilingual discovery and SEO

## What Should Not Be Added

- Raw external URLs without an AimyFlow page
- Marketing slogans as link labels
- Duplicate tools in multiple nearby sections without a strong reason
- Exhaustive dumping of hundreds of entries into the README

## README Rules

- Use the product or website name as the link label
- Link to the AimyFlow tool page, not the raw external site
- Keep each description short and neutral
- Prefer the most specific category available
- Treat the README as the curated layer, not the full directory

## Full Directory Rules

- Full coverage belongs in `docs/` and `data/`
- Generated files should stay in sync with `scripts/sync-from-supabase.mjs`
- Keep internationalization intact across supported locales

## Suggesting a Tool

If a tool is not yet present on AimyFlow, submit it through the main site first:

- https://www.aimyflow.com/en/submit

Once the tool exists on AimyFlow, it can be considered for curated placement in the README.

## Pull Requests

Good pull requests usually do one of these:

- improve the curated homepage structure
- improve wording without making it more promotional
- improve multilingual entry points
- improve sync logic without breaking generated outputs

If a PR changes generated files, include the generator change when relevant.
