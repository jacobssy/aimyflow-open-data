#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA_DIR = path.join(REPO_ROOT, 'data');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const PAGE_SIZE = 1000;
const LOCALES = ['en', 'zh', 'es', 'ja', 'de', 'fr'];
const LOCAL_ENV_FILES = [
  path.join(REPO_ROOT, '.env.local'),
  path.join(REPO_ROOT, '.env'),
  '/root/aimyflow-aitools/.env.local',
  '/root/aimyflow-aitools/.env',
];

const LOCALE_COPY = {
  en: {
    nativeName: 'English',
    docsTitle: 'AimyFlow Open Data Index',
    docsDescription:
      'Open data exports for AimyFlow AI tools by role, with machine-readable datasets and GitHub-friendly landing pages.',
    generatedAt: 'Generated at',
    toolsExported: 'Tools exported',
    rolesExported: 'Roles exported',
    skillsExported: 'Skills exported',
    rolesHeading: 'Roles',
    openRolePage: 'Open full role page on AimyFlow',
    snapshot: 'Snapshot',
    toolMatches: 'Tool matches',
    skillCards: 'Skill cards',
    coreSkills: 'Core Skills',
    matchedTools: 'Matched Tools',
    nextSteps: 'Continue on AimyFlow',
    exploreTools: 'Explore all AI tools',
    browseRoles: 'Browse all roles',
    seeCommunityVotes: 'See community voting',
    notes: 'Notes',
    notesBody:
      'This GitHub page is intentionally short. Community voting, multilingual page variants and workflow content live on the main AimyFlow site.',
    localeIndexLabel: 'Localized docs',
    rootIndexTitle: 'AimyFlow Open Data Docs',
    rootIndexIntro:
      'This folder contains generated multilingual docs that summarize roles and link back to the full AimyFlow experience.',
  },
  zh: {
    nativeName: '中文',
    docsTitle: 'AimyFlow 开放数据索引',
    docsDescription: '按职业整理的 AimyFlow AI 工具开放数据，包含结构化数据集与适合 GitHub 收录的角色页。',
    generatedAt: '生成时间',
    toolsExported: '工具数量',
    rolesExported: '职业数量',
    skillsExported: '技能数量',
    rolesHeading: '职业列表',
    openRolePage: '在 AimyFlow 打开完整职业页',
    snapshot: '概览',
    toolMatches: '匹配工具数',
    skillCards: '技能卡片数',
    coreSkills: '核心技能',
    matchedTools: '匹配工具',
    nextSteps: '继续访问 AimyFlow',
    exploreTools: '查看全部 AI 工具',
    browseRoles: '浏览全部职业',
    seeCommunityVotes: '查看社区投票',
    notes: '说明',
    notesBody: '这里的 GitHub 页面保持简洁。社区投票、多语言详情页和工作流内容仍以 AimyFlow 主站为准。',
    localeIndexLabel: '多语言文档',
    rootIndexTitle: 'AimyFlow 开放数据文档',
    rootIndexIntro: '这里汇总了自动生成的多语言角色文档，并链接回 AimyFlow 主站的完整体验。',
  },
  es: {
    nativeName: 'Español',
    docsTitle: 'Índice de Datos Abiertos de AimyFlow',
    docsDescription:
      'Exportaciones abiertas de herramientas de IA por rol en AimyFlow, con datasets estructurados y páginas aptas para GitHub.',
    generatedAt: 'Generado el',
    toolsExported: 'Herramientas exportadas',
    rolesExported: 'Roles exportados',
    skillsExported: 'Habilidades exportadas',
    rolesHeading: 'Roles',
    openRolePage: 'Abrir la página completa del rol en AimyFlow',
    snapshot: 'Resumen',
    toolMatches: 'Herramientas asociadas',
    skillCards: 'Tarjetas de habilidades',
    coreSkills: 'Habilidades clave',
    matchedTools: 'Herramientas relacionadas',
    nextSteps: 'Continuar en AimyFlow',
    exploreTools: 'Explorar todas las herramientas IA',
    browseRoles: 'Explorar todos los roles',
    seeCommunityVotes: 'Ver la votación de la comunidad',
    notes: 'Notas',
    notesBody:
      'Esta página de GitHub es intencionalmente breve. Las votaciones de la comunidad, las variantes multilingües y los workflows completos viven en el sitio principal de AimyFlow.',
    localeIndexLabel: 'Documentación localizada',
    rootIndexTitle: 'Documentación de Datos Abiertos de AimyFlow',
    rootIndexIntro:
      'Esta carpeta contiene documentación multilingüe generada automáticamente con enlaces a la experiencia completa de AimyFlow.',
  },
  ja: {
    nativeName: '日本語',
    docsTitle: 'AimyFlow オープンデータ索引',
    docsDescription:
      '職種別 AI ツールをまとめた AimyFlow のオープンデータ。GitHub 向けの要約ページと構造化データを含みます。',
    generatedAt: '生成日時',
    toolsExported: 'ツール数',
    rolesExported: '役割数',
    skillsExported: 'スキル数',
    rolesHeading: '役割一覧',
    openRolePage: 'AimyFlow で完全版の役割ページを開く',
    snapshot: '概要',
    toolMatches: '一致ツール数',
    skillCards: 'スキルカード数',
    coreSkills: '主要スキル',
    matchedTools: '関連ツール',
    nextSteps: 'AimyFlow で続きを見る',
    exploreTools: 'すべての AI ツールを見る',
    browseRoles: 'すべての役割を見る',
    seeCommunityVotes: 'コミュニティ投票を見る',
    notes: '補足',
    notesBody:
      'この GitHub ページは意図的に簡潔です。コミュニティ投票、多言語ページ、workflow コンテンツは AimyFlow 本体にあります。',
    localeIndexLabel: '多言語ドキュメント',
    rootIndexTitle: 'AimyFlow オープンデータ文書',
    rootIndexIntro:
      'このフォルダには、自動生成された多言語の役割ドキュメントがあり、AimyFlow の完全な体験へリンクします。',
  },
  de: {
    nativeName: 'Deutsch',
    docsTitle: 'AimyFlow Open-Data-Index',
    docsDescription:
      'Offene Exporte von KI-Tools nach Rollen in AimyFlow, mit strukturierten Datensätzen und GitHub-tauglichen Übersichtsseiten.',
    generatedAt: 'Erstellt am',
    toolsExported: 'Exportierte Tools',
    rolesExported: 'Exportierte Rollen',
    skillsExported: 'Exportierte Skills',
    rolesHeading: 'Rollen',
    openRolePage: 'Vollständige Rollen-Seite auf AimyFlow öffnen',
    snapshot: 'Überblick',
    toolMatches: 'Zugeordnete Tools',
    skillCards: 'Skill-Karten',
    coreSkills: 'Kernkompetenzen',
    matchedTools: 'Passende Tools',
    nextSteps: 'Auf AimyFlow fortfahren',
    exploreTools: 'Alle KI-Tools ansehen',
    browseRoles: 'Alle Rollen durchsuchen',
    seeCommunityVotes: 'Community-Votings ansehen',
    notes: 'Hinweise',
    notesBody:
      'Diese GitHub-Seite ist bewusst kurz gehalten. Community-Votings, mehrsprachige Varianten und Workflow-Inhalte liegen auf der Hauptseite von AimyFlow.',
    localeIndexLabel: 'Lokalisierte Doku',
    rootIndexTitle: 'AimyFlow Open-Data-Dokumentation',
    rootIndexIntro:
      'Dieser Ordner enthält automatisch erzeugte mehrsprachige Rollendokumente mit Links zur vollständigen AimyFlow-Erfahrung.',
  },
  fr: {
    nativeName: 'Français',
    docsTitle: 'Index Open Data AimyFlow',
    docsDescription:
      'Exports ouverts des outils IA par métier sur AimyFlow, avec jeux de données structurés et pages compatibles GitHub.',
    generatedAt: 'Généré le',
    toolsExported: 'Outils exportés',
    rolesExported: 'Rôles exportés',
    skillsExported: 'Compétences exportées',
    rolesHeading: 'Rôles',
    openRolePage: 'Ouvrir la page complète du rôle sur AimyFlow',
    snapshot: 'Vue d’ensemble',
    toolMatches: 'Outils associés',
    skillCards: 'Cartes de compétences',
    coreSkills: 'Compétences clés',
    matchedTools: 'Outils associés',
    nextSteps: 'Continuer sur AimyFlow',
    exploreTools: 'Explorer tous les outils IA',
    browseRoles: 'Parcourir tous les rôles',
    seeCommunityVotes: 'Voir les votes de la communauté',
    notes: 'Notes',
    notesBody:
      'Cette page GitHub reste volontairement concise. Les votes de la communauté, les variantes multilingues et les workflows complets restent sur le site principal AimyFlow.',
    localeIndexLabel: 'Documentation localisée',
    rootIndexTitle: 'Documentation Open Data AimyFlow',
    rootIndexIntro:
      'Ce dossier contient une documentation multilingue générée automatiquement avec des liens vers l’expérience complète AimyFlow.',
  },
};

function parseEnvFile(content) {
  const values = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

async function loadLocalEnv() {
  for (const filePath of LOCAL_ENV_FILES) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const values = parseEnvFile(content);

      for (const [key, value] of Object.entries(values)) {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch {
      // Ignore missing env files.
    }
  }
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function splitCommaSeparated(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function humanizeSlug(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function firstNonEmpty(values) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() || '';
}

function getLocalizedField(record, fieldName, locale) {
  if (locale === 'en') {
    return record[`${fieldName}_en`] || record[fieldName];
  }

  return record[`${fieldName}_${locale}`] || record[`${fieldName}_en`] || record[fieldName];
}

function getSiteUrl() {
  return (process.env.AIMYFLOW_SITE_URL || process.env.SITE_URL || 'https://www.aimyflow.com').replace(/\/$/, '');
}

function buildHeaders(apiKey, extra = {}) {
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    ...extra,
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed (${response.status}): ${errorText.slice(0, 400)}`);
  }

  const text = await response.text();
  return text.trim() ? JSON.parse(text) : [];
}

async function fetchAllRows(baseUrl, apiKey, table, select, orderBy) {
  const rows = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const query = new URLSearchParams({
      select,
      order: `${orderBy}.asc`,
    });
    const page = await fetchJson(`${baseUrl}/rest/v1/${table}?${query.toString()}`, {
      headers: buildHeaders(apiKey, {
        Range: `${from}-${to}`,
      }),
    });

    rows.push(...page);

    if (page.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  return rows;
}

function encodePathSegment(value) {
  return encodeURIComponent(value);
}

function toRoleDocSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatSummary(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function buildLocaleSiteUrl(siteUrl, locale, pathname) {
  return `${siteUrl}/${locale}${pathname}`;
}

function getSiteOrigin(url) {
  return new URL(url).origin;
}

async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DOCS_DIR, { recursive: true });
}

async function resetDocsDirectory() {
  await fs.rm(DOCS_DIR, { recursive: true, force: true });
  await fs.mkdir(DOCS_DIR, { recursive: true });
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(REPO_ROOT, relativePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(relativePath, value) {
  const absolutePath = path.join(REPO_ROOT, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, value, 'utf8');
}

function buildToolRecord(tool, rolesBySlug, siteUrl) {
  const roleSlugs = splitCommaSeparated(tool.category_name);
  const localizedRoleNames = Object.fromEntries(
    LOCALES.map((locale) => [locale, splitCommaSeparated(getLocalizedField(tool, 'category_name', locale))]),
  );

  const roles = roleSlugs.map((roleSlug, index) => {
    const role = rolesBySlug.get(roleSlug);
    const labels = Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        localizedRoleNames[locale][index] || role?.title?.[locale] || role?.title?.en || humanizeSlug(roleSlug),
      ]),
    );
    const aimyflow_urls = Object.fromEntries(
      LOCALES.map((locale) => [locale, buildLocaleSiteUrl(siteUrl, locale, `/role/${encodePathSegment(roleSlug)}`)]),
    );

    return {
      slug: roleSlug,
      labels,
      aimyflow_urls,
    };
  });

  return {
    id: tool.id,
    name: tool.name,
    slug: toRoleDocSlug(tool.name),
    external_url: tool.url,
    aimyflow_urls: Object.fromEntries(
      LOCALES.map((locale) => [locale, buildLocaleSiteUrl(siteUrl, locale, `/ai/${encodePathSegment(tool.name)}`)]),
    ),
    image_url: tool.thumbnail_url || tool.image_url,
    collected_at: tool.collection_time,
    roles,
    summary: {
      en: formatSummary(firstNonEmpty([tool.content_en, tool.content, tool.title_en, tool.title, tool.name])),
      zh: formatSummary(firstNonEmpty([tool.content_zh, tool.content_en, tool.title_zh, tool.title_en, tool.name])),
      es: formatSummary(firstNonEmpty([tool.content_es, tool.content_en, tool.title_es, tool.title_en, tool.name])),
      ja: formatSummary(firstNonEmpty([tool.content_ja, tool.content_en, tool.title_ja, tool.title_en, tool.name])),
      de: formatSummary(firstNonEmpty([tool.content_de, tool.content_en, tool.title_de, tool.title_en, tool.name])),
      fr: formatSummary(firstNonEmpty([tool.content_fr, tool.content_en, tool.title_fr, tool.title_en, tool.name])),
    },
    title: {
      en: firstNonEmpty([tool.title_en, tool.title, tool.name]),
      zh: firstNonEmpty([tool.title_zh, tool.title_en, tool.title, tool.name]),
      es: firstNonEmpty([tool.title_es, tool.title_en, tool.title, tool.name]),
      ja: firstNonEmpty([tool.title_ja, tool.title_en, tool.title, tool.name]),
      de: firstNonEmpty([tool.title_de, tool.title_en, tool.title, tool.name]),
      fr: firstNonEmpty([tool.title_fr, tool.title_en, tool.title, tool.name]),
    },
    metadata: {
      star_rating: tool.star_rating,
      pricing_hint: firstNonEmpty([tool.detail_en, tool.detail]),
      tag_name: tool.tag_name,
    },
  };
}

function buildRoleRecord(role, toolsForRole, skillsForRole, siteUrl) {
  return {
    slug: role.name,
    doc_slug: toRoleDocSlug(role.name),
    title: {
      en: firstNonEmpty([role.title_en, role.title, humanizeSlug(role.name)]),
      zh: firstNonEmpty([role.title_zh, role.title_en, role.title, humanizeSlug(role.name)]),
      es: firstNonEmpty([role.title_es, role.title_en, role.title, humanizeSlug(role.name)]),
      ja: firstNonEmpty([role.title_ja, role.title_en, role.title, humanizeSlug(role.name)]),
      de: firstNonEmpty([role.title_de, role.title_en, role.title, humanizeSlug(role.name)]),
      fr: firstNonEmpty([role.title_fr, role.title_en, role.title, humanizeSlug(role.name)]),
    },
    aimyflow_urls: Object.fromEntries(
      LOCALES.map((locale) => [locale, buildLocaleSiteUrl(siteUrl, locale, `/role/${encodePathSegment(role.name)}`)]),
    ),
    sort: role.sort,
    tool_count: toolsForRole.length,
    skill_count: skillsForRole.length,
    tool_names: toolsForRole.map((tool) => tool.name),
    featured_tools: toolsForRole.slice(0, 8).map((tool) => ({
      name: tool.name,
      title: tool.title,
      aimyflow_urls: tool.aimyflow_urls,
      external_url: tool.external_url,
      summary: tool.summary,
    })),
    skills: skillsForRole.map((skill) => ({
      id: skill.id,
      sort_order: skill.sort_order,
      title: {
        en: firstNonEmpty([skill.title_en, skill.title, 'Untitled skill']),
        zh: firstNonEmpty([skill.title_zh, skill.title_en, skill.title, 'Untitled skill']),
        es: firstNonEmpty([skill.title_es, skill.title_en, skill.title, 'Untitled skill']),
        ja: firstNonEmpty([skill.title_ja, skill.title_en, skill.title, 'Untitled skill']),
        de: firstNonEmpty([skill.title_de, skill.title_en, skill.title, 'Untitled skill']),
        fr: firstNonEmpty([skill.title_fr, skill.title_en, skill.title, 'Untitled skill']),
      },
      description: {
        en: formatSummary(firstNonEmpty([skill.description_en, skill.description])),
        zh: formatSummary(firstNonEmpty([skill.description_zh, skill.description_en, skill.description])),
        es: formatSummary(firstNonEmpty([skill.description_es, skill.description_en, skill.description])),
        ja: formatSummary(firstNonEmpty([skill.description_ja, skill.description_en, skill.description])),
        de: formatSummary(firstNonEmpty([skill.description_de, skill.description_en, skill.description])),
        fr: formatSummary(firstNonEmpty([skill.description_fr, skill.description_en, skill.description])),
      },
    })),
  };
}

function renderRoleDoc(roleRecord, locale) {
  const copy = LOCALE_COPY[locale];
  const siteOrigin = getSiteOrigin(roleRecord.aimyflow_urls[locale]);
  const lines = [
    `# ${roleRecord.title[locale]}`,
    '',
    `[${copy.openRolePage}](${roleRecord.aimyflow_urls[locale]})`,
    '',
    `## ${copy.snapshot}`,
    '',
    `- ${copy.toolMatches}: ${roleRecord.tool_count}`,
    `- ${copy.skillCards}: ${roleRecord.skill_count}`,
    '',
  ];

  if (roleRecord.skills.length > 0) {
    lines.push(`## ${copy.coreSkills}`, '');

    for (const skill of roleRecord.skills) {
      lines.push(`- **${skill.title[locale]}**: ${skill.description[locale]}`);
    }

    lines.push('');
  }

  if (roleRecord.featured_tools.length > 0) {
    lines.push(`## ${copy.matchedTools}`, '');

    for (const tool of roleRecord.featured_tools) {
      lines.push(`- [${tool.name}](${tool.aimyflow_urls[locale]}): ${tool.summary[locale]}`);
    }

    lines.push('');
  }

  lines.push(`## ${copy.nextSteps}`, '');
  lines.push(
    `- [${copy.exploreTools}](${buildLocaleSiteUrl(siteOrigin, locale, '/explore')})`,
  );
  lines.push(
    `- [${copy.browseRoles}](${buildLocaleSiteUrl(siteOrigin, locale, '/roles')})`,
  );
  lines.push(
    `- [${copy.seeCommunityVotes}](${roleRecord.aimyflow_urls[locale]})`,
  );
  lines.push('');

  lines.push(`## ${copy.notes}`, '');
  lines.push(`- ${copy.notesBody}`, '');

  return `${lines.join('\n')}\n`;
}

function renderLocaleDocsIndex(stats, roleRecords, locale) {
  const copy = LOCALE_COPY[locale];
  const siteUrl = stats.site_url;
  const lines = [
    `# ${copy.docsTitle}`,
    '',
    copy.docsDescription,
    '',
    `${copy.generatedAt}: ${stats.generated_at}`,
    '',
    `- ${copy.toolsExported}: ${stats.tool_count}`,
    `- ${copy.rolesExported}: ${stats.role_count}`,
    `- ${copy.skillsExported}: ${stats.skill_count}`,
    '',
    `## ${copy.nextSteps}`,
    '',
    `- [${copy.exploreTools}](${buildLocaleSiteUrl(siteUrl, locale, '/explore')})`,
    `- [${copy.browseRoles}](${buildLocaleSiteUrl(siteUrl, locale, '/roles')})`,
    `- [${copy.seeCommunityVotes}](${buildLocaleSiteUrl(siteUrl, locale, '/roles')})`,
    '',
    `## ${copy.rolesHeading}`,
    '',
  ];

  for (const role of roleRecords) {
    lines.push(
      `- [${role.title[locale]}](./roles/${role.doc_slug}.md): ${role.tool_count} tools, ${role.skill_count} skills`,
    );
  }

  lines.push('');

  return `${lines.join('\n')}\n`;
}

function renderRootDocsIndex(stats) {
  const siteUrl = stats.site_url;
  const lines = [
    `# ${LOCALE_COPY.en.rootIndexTitle}`,
    '',
    LOCALE_COPY.en.rootIndexIntro,
    '',
    `Generated at: ${stats.generated_at}`,
    '',
    `- Tools exported: ${stats.tool_count}`,
    `- Roles exported: ${stats.role_count}`,
    `- Skills exported: ${stats.skill_count}`,
    '',
    `## Continue on AimyFlow`,
    '',
    `- [Explore all AI tools](${buildLocaleSiteUrl(siteUrl, 'en', '/explore')})`,
    `- [Browse roles and workflows](${buildLocaleSiteUrl(siteUrl, 'en', '/roles')})`,
    `- [See community voting](${buildLocaleSiteUrl(siteUrl, 'en', '/roles')})`,
    '',
    `## ${LOCALE_COPY.en.localeIndexLabel}`,
    '',
  ];

  for (const locale of LOCALES) {
    lines.push(`- [${LOCALE_COPY[locale].nativeName}](./${locale}/index.md)`);
  }

  lines.push('');

  return `${lines.join('\n')}\n`;
}

async function main() {
  await loadLocalEnv();
  await ensureDirectories();
  await resetDocsDirectory();

  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const siteUrl = getSiteUrl();

  const [roles, tools, skills] = await Promise.all([
    fetchAllRows(
      supabaseUrl,
      apiKey,
      'navigation_category',
      'name,sort,title,title_en,title_zh,title_es,title_ja,title_de,title_fr',
      'sort',
    ),
    fetchAllRows(
      supabaseUrl,
      apiKey,
      'web_navigation',
      [
        'id',
        'name',
        'url',
        'thumbnail_url',
        'image_url',
        'collection_time',
        'star_rating',
        'tag_name',
        'category_name',
        'category_name_en',
        'category_name_zh',
        'category_name_es',
        'category_name_ja',
        'category_name_de',
        'category_name_fr',
        'title',
        'title_en',
        'title_zh',
        'title_es',
        'title_ja',
        'title_de',
        'title_fr',
        'content',
        'content_en',
        'content_zh',
        'content_es',
        'content_ja',
        'content_de',
        'content_fr',
        'detail',
        'detail_en',
      ].join(','),
      'name',
    ),
    fetchAllRows(
      supabaseUrl,
      apiKey,
      'role_skills',
      [
        'id',
        'category_name',
        'sort_order',
        'title',
        'title_en',
        'title_zh',
        'title_es',
        'title_ja',
        'title_de',
        'title_fr',
        'description',
        'description_en',
        'description_zh',
        'description_es',
        'description_ja',
        'description_de',
        'description_fr',
      ].join(','),
      'sort_order',
    ),
  ]);

  const rolePreviewIndex = new Map(
    roles.map((role) => [
      role.name,
      {
        title: {
          en: firstNonEmpty([role.title_en, role.title, humanizeSlug(role.name)]),
          zh: firstNonEmpty([role.title_zh, role.title_en, role.title, humanizeSlug(role.name)]),
          es: firstNonEmpty([role.title_es, role.title_en, role.title, humanizeSlug(role.name)]),
          ja: firstNonEmpty([role.title_ja, role.title_en, role.title, humanizeSlug(role.name)]),
          de: firstNonEmpty([role.title_de, role.title_en, role.title, humanizeSlug(role.name)]),
          fr: firstNonEmpty([role.title_fr, role.title_en, role.title, humanizeSlug(role.name)]),
        },
      },
    ]),
  );

  const toolRecords = tools.map((tool) => buildToolRecord(tool, rolePreviewIndex, siteUrl));
  const toolsByRole = new Map();

  for (const toolRecord of toolRecords) {
    for (const role of toolRecord.roles) {
      if (!toolsByRole.has(role.slug)) {
        toolsByRole.set(role.slug, []);
      }

      toolsByRole.get(role.slug).push(toolRecord);
    }
  }

  const skillsByRole = new Map();

  for (const skill of skills) {
    if (!skillsByRole.has(skill.category_name)) {
      skillsByRole.set(skill.category_name, []);
    }

    skillsByRole.get(skill.category_name).push(skill);
  }

  const roleRecords = roles.map((role) =>
    buildRoleRecord(role, toolsByRole.get(role.name) || [], skillsByRole.get(role.name) || [], siteUrl),
  );

  roleRecords.sort((left, right) => {
    if (right.tool_count !== left.tool_count) {
      return right.tool_count - left.tool_count;
    }

    return left.title.en.localeCompare(right.title.en);
  });

  const skillRecords = skills
    .slice()
    .sort((left, right) => {
      if (left.category_name !== right.category_name) {
        return left.category_name.localeCompare(right.category_name);
      }

      return left.sort_order - right.sort_order;
    })
    .map((skill) => ({
      id: skill.id,
      role_slug: skill.category_name,
      sort_order: skill.sort_order,
      title: {
        en: firstNonEmpty([skill.title_en, skill.title]),
        zh: firstNonEmpty([skill.title_zh, skill.title_en, skill.title]),
        es: firstNonEmpty([skill.title_es, skill.title_en, skill.title]),
        ja: firstNonEmpty([skill.title_ja, skill.title_en, skill.title]),
        de: firstNonEmpty([skill.title_de, skill.title_en, skill.title]),
        fr: firstNonEmpty([skill.title_fr, skill.title_en, skill.title]),
      },
      description: {
        en: formatSummary(firstNonEmpty([skill.description_en, skill.description])),
        zh: formatSummary(firstNonEmpty([skill.description_zh, skill.description_en, skill.description])),
        es: formatSummary(firstNonEmpty([skill.description_es, skill.description_en, skill.description])),
        ja: formatSummary(firstNonEmpty([skill.description_ja, skill.description_en, skill.description])),
        de: formatSummary(firstNonEmpty([skill.description_de, skill.description_en, skill.description])),
        fr: formatSummary(firstNonEmpty([skill.description_fr, skill.description_en, skill.description])),
      },
    }));

  const stats = {
    generated_at: new Date().toISOString(),
    site_url: siteUrl,
    locales: LOCALES,
    tool_count: toolRecords.length,
    role_count: roleRecords.length,
    skill_count: skillRecords.length,
  };

  await writeJson('data/tools.json', toolRecords);
  await writeJson('data/roles.json', roleRecords);
  await writeJson('data/skills.json', skillRecords);
  await writeJson('data/stats.json', stats);
  await writeText('docs/index.md', renderRootDocsIndex(stats));

  for (const locale of LOCALES) {
    await writeText(`docs/${locale}/index.md`, renderLocaleDocsIndex(stats, roleRecords, locale));

    for (const roleRecord of roleRecords) {
      await writeText(`docs/${locale}/roles/${roleRecord.doc_slug}.md`, renderRoleDoc(roleRecord, locale));
    }
  }

  console.log(JSON.stringify(stats));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
