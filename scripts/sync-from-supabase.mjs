#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
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
const FEATURED_TOOL_COUNT = 24;
const MAX_ROLE_LABELS = 6;
const COMPACT_ROLE_LABELS = 4;
const COMPACT_SUMMARY_MAX_LENGTH = 220;
const MAX_UNMATCHED_ROLE_REFERENCE_RATIO = 0.05;
const ROLE_ALIASES = {
  'ai-engineer': 'software-engineer',
  appliedscientists: 'applied-mathematician',
  'applied-scientists': 'applied-mathematician',
  bloggers: 'writers-and-authors',
  'community-manager': 'customer-success-manager',
  consumerother: 'other-sales-roles',
  'consumer-other': 'other-sales-roles',
  cto: 'coo',
  'customer-service-manager': 'customer-success-manager',
  'customer-support-manager': 'customer-success-manager',
  customerother: 'other-sales-roles',
  'customer-other': 'other-sales-roles',
  'cyber-security-analyst': 'cybersecurity-analyst',
  cybersecurityanalysts: 'cybersecurity-analyst',
  'cyber-security-manager': 'cybersecurity-manager',
  datascientists: 'data-scientist',
  'data-scientists': 'data-scientist',
  ecommerceseller: 'e-commerce-seller',
  entrepreneurs: 'top-executives',
  financialanalysts: 'financial-analyst',
  'financial-analysts': 'financial-analyst',
  influencers: 'social-media-content-creator',
  'marketing-manager': 'marketing-and-sales-managers',
  'online-store': 'e-commerce-seller',
  operationsplanner: 'logistics-operations-planner',
  'operations-planner': 'logistics-operations-planner',
  otherservicespecialists: 'misc-service-specialists',
  'other-service-specialists': 'misc-service-specialists',
  productmanagementofficer: 'project-management-officer',
  'product-management-officer': 'project-management-officer',
  researchers: 'life-scientists',
  salessalesreps: 'service-sales-reps',
  'sales-sales-reps': 'service-sales-reps',
  seospecialist: 'digital-marketing-director',
  'seo-specialist': 'digital-marketing-director',
  softwaredevelopers: 'software-engineer',
  'software-developers': 'software-engineer',
  softwareengineers: 'software-engineer',
  'software-engineers': 'software-engineer',
  'tech-support-specialists': 'information-technology-managers',
};

const LOCALE_COPY = {
  en: {
    nativeName: 'English',
    docsTitle: 'Awesome AI Tools Directory',
    docsDescription:
      'A GitHub-friendly multilingual directory of AI tools from AimyFlow, showing each tool, what it does, and which job roles it fits.',
    generatedAt: 'Generated at',
    toolsExported: 'Tools exported',
    rolesCovered: 'Roles covered',
    whyUseHeading: 'Why This Page Exists',
    whyUsePoint1: 'See AI tools from AimyFlow in a lightweight GitHub directory.',
    whyUsePoint2: 'Check a short description and suitable roles for each tool.',
    whyUsePoint3: 'Jump to the full AimyFlow tool page when you want deeper details.',
    startHere: 'Start Here',
    backToDocsHome: 'Back to docs home',
    exploreTools: 'Explore all AI tools',
    inspectData: 'Inspect tools dataset',
    featuredTools: 'Recently Added Tools',
    featuredIntro: 'Fresh additions with summaries and role fit.',
    allTools: 'All Tools',
    suitableRoles: 'Suitable roles',
    officialSite: 'Official site',
    continueOnAimyFlow: 'Continue on AimyFlow',
    browseRoles: 'Browse roles',
    notes: 'Notes',
    notesBody:
      'This GitHub page stays intentionally short and list-like. AimyFlow remains the main destination for deeper tool pages, role pages, and workflows.',
    rootIndexTitle: 'Awesome AI Tools Docs',
    rootIndexIntro:
      'A public multilingual GitHub directory of AI tools from AimyFlow, with curated GitHub discovery and links back to each main AimyFlow page.',
    localeIndexLabel: 'Localized directories',
    fullDirectory: 'Expand the full tool directory',
    moreLabel: 'more',
    allToolsStyleNote: '_Compact view for faster scanning._',
  },
  zh: {
    nativeName: '中文',
    docsTitle: 'Awesome AI 工具目录',
    docsDescription: '一个适合 GitHub 展示的多语言 AI 工具目录，列出 AimyFlow 上的工具、简介以及适合的职业。',
    generatedAt: '生成时间',
    toolsExported: '工具数量',
    rolesCovered: '覆盖职业数',
    whyUseHeading: '这个页面的作用',
    whyUsePoint1: '用更轻量的 GitHub 目录方式浏览 AimyFlow 上的 AI 工具。',
    whyUsePoint2: '快速查看每个工具的简介和适合的职业。',
    whyUsePoint3: '需要更完整内容时，再跳转到 AimyFlow 的工具页。',
    startHere: '从这里开始',
    backToDocsHome: '返回文档首页',
    exploreTools: '查看全部 AI 工具',
    inspectData: '查看工具数据集',
    featuredTools: '最近新增工具',
    featuredIntro: '这里优先展示最近新增、便于快速判断的工具。',
    allTools: '全部工具',
    suitableRoles: '适合职业',
    officialSite: '官网',
    continueOnAimyFlow: '继续访问 AimyFlow',
    browseRoles: '浏览职业',
    notes: '说明',
    notesBody: '这里的 GitHub 页面保持简洁，以工具目录为主。更完整的工具详情、职业页和工作流内容仍以 AimyFlow 主站为准。',
    rootIndexTitle: 'Awesome AI 工具文档',
    rootIndexIntro: '这里汇总了多语言 AI 工具目录，并把每个工具链接回 AimyFlow 主站。',
    localeIndexLabel: '多语言目录',
    fullDirectory: '展开完整工具目录',
    moreLabel: '更多',
    allToolsStyleNote: '_使用紧凑视图，便于快速浏览。_',
  },
  es: {
    nativeName: 'Español',
    docsTitle: 'Directorio Awesome de Herramientas IA',
    docsDescription:
      'Un directorio multilingüe y apto para GitHub de herramientas de IA de AimyFlow, con descripciones breves y roles adecuados.',
    generatedAt: 'Generado el',
    toolsExported: 'Herramientas exportadas',
    rolesCovered: 'Roles cubiertos',
    whyUseHeading: 'Por qué existe esta página',
    whyUsePoint1: 'Ver herramientas de IA de AimyFlow en un directorio ligero dentro de GitHub.',
    whyUsePoint2: 'Revisar una breve descripción y los roles adecuados para cada herramienta.',
    whyUsePoint3: 'Abrir la página completa en AimyFlow cuando quieras más contexto.',
    startHere: 'Comienza aquí',
    backToDocsHome: 'Volver al inicio de docs',
    exploreTools: 'Explorar todas las herramientas IA',
    inspectData: 'Inspeccionar dataset de herramientas',
    featuredTools: 'Herramientas añadidas recientemente',
    featuredIntro: 'Nuevas incorporaciones con resumen breve y roles recomendados.',
    allTools: 'Todas las herramientas',
    suitableRoles: 'Roles adecuados',
    officialSite: 'Sitio oficial',
    continueOnAimyFlow: 'Continuar en AimyFlow',
    browseRoles: 'Explorar roles',
    notes: 'Notas',
    notesBody:
      'Esta página de GitHub es intencionalmente breve y orientada a directorio. AimyFlow sigue siendo el destino principal para páginas completas de herramientas, roles y workflows.',
    rootIndexTitle: 'Documentación Awesome de Herramientas IA',
    rootIndexIntro:
      'Un directorio público multilingüe en GitHub que enlaza cada herramienta de IA con su página principal en AimyFlow.',
    localeIndexLabel: 'Directorios localizados',
    fullDirectory: 'Expandir el directorio completo de herramientas',
    moreLabel: 'más',
    allToolsStyleNote: '_Vista compacta para explorar más rápido._',
  },
  ja: {
    nativeName: '日本語',
    docsTitle: 'Awesome AI ツールディレクトリ',
    docsDescription:
      'AimyFlow 上の AI ツールを、短い説明と適した職種つきで GitHub 向けにまとめた多言語ディレクトリです。',
    generatedAt: '生成日時',
    toolsExported: 'ツール数',
    rolesCovered: '対応職種数',
    whyUseHeading: 'このページの目的',
    whyUsePoint1: 'AimyFlow の AI ツールを GitHub 上で軽く一覧できます。',
    whyUsePoint2: '各ツールの短い説明と適した職種をすばやく確認できます。',
    whyUsePoint3: '詳しく知りたいときは AimyFlow の完全なツールページに進めます。',
    startHere: 'ここから始める',
    backToDocsHome: 'ドキュメントトップへ戻る',
    exploreTools: 'すべての AI ツールを見る',
    inspectData: 'ツールデータを見る',
    featuredTools: '最近追加されたツール',
    featuredIntro: '最近追加されたツールを、要約と適した職種つきで確認できます。',
    allTools: 'すべてのツール',
    suitableRoles: '適した職種',
    officialSite: '公式サイト',
    continueOnAimyFlow: 'AimyFlow で続きを見る',
    browseRoles: '職種を見る',
    notes: '補足',
    notesBody:
      'この GitHub ページは一覧性を重視して短く保っています。より詳しいツールページ、職種ページ、workflow は AimyFlow 本体にあります。',
    rootIndexTitle: 'Awesome AI ツール文書',
    rootIndexIntro:
      '各 AI ツールを AimyFlow 本体へリンクする、多言語 GitHub ディレクトリです。',
    localeIndexLabel: '多言語ディレクトリ',
    fullDirectory: '完全なツールディレクトリを開く',
    moreLabel: '件',
    allToolsStyleNote: '_一覧はコンパクト表示で、すばやく確認できます。_',
  },
  de: {
    nativeName: 'Deutsch',
    docsTitle: 'Awesome KI-Tool-Verzeichnis',
    docsDescription:
      'Ein mehrsprachiges, GitHub-taugliches Verzeichnis von KI-Tools aus AimyFlow mit Kurzbeschreibung und passenden Rollen.',
    generatedAt: 'Erstellt am',
    toolsExported: 'Exportierte Tools',
    rolesCovered: 'Abgedeckte Rollen',
    whyUseHeading: 'Warum es diese Seite gibt',
    whyUsePoint1: 'AimyFlow-KI-Tools in einem leichten GitHub-Verzeichnis ansehen.',
    whyUsePoint2: 'Kurzbeschreibung und passende Rollen pro Tool schnell prüfen.',
    whyUsePoint3: 'Bei Bedarf direkt zur vollständigen Tool-Seite auf AimyFlow wechseln.',
    startHere: 'Hier starten',
    backToDocsHome: 'Zur Docs-Startseite',
    exploreTools: 'Alle KI-Tools ansehen',
    inspectData: 'Tool-Datensatz ansehen',
    featuredTools: 'Zuletzt hinzugefügte Tools',
    featuredIntro: 'Neue Einträge mit Kurzbeschreibung und passenden Rollen.',
    allTools: 'Alle Tools',
    suitableRoles: 'Passende Rollen',
    officialSite: 'Offizielle Website',
    continueOnAimyFlow: 'Auf AimyFlow fortfahren',
    browseRoles: 'Rollen durchsuchen',
    notes: 'Hinweise',
    notesBody:
      'Diese GitHub-Seite bleibt bewusst kurz und verzeichnisartig. AimyFlow ist weiterhin das Hauptziel für ausführliche Tool-Seiten, Rollen-Seiten und Workflows.',
    rootIndexTitle: 'Awesome KI-Tool-Dokumentation',
    rootIndexIntro:
      'Ein öffentliches mehrsprachiges GitHub-Verzeichnis, das jedes KI-Tool mit seiner AimyFlow-Hauptseite verbindet.',
    localeIndexLabel: 'Lokalisierte Verzeichnisse',
    fullDirectory: 'Vollständiges Tool-Verzeichnis öffnen',
    moreLabel: 'mehr',
    allToolsStyleNote: '_Kompakte Ansicht für schnelleres Durchsehen._',
  },
  fr: {
    nativeName: 'Français',
    docsTitle: 'Répertoire Awesome des Outils IA',
    docsDescription:
      'Un répertoire multilingue compatible GitHub des outils IA d’AimyFlow, avec courte description et rôles adaptés.',
    generatedAt: 'Généré le',
    toolsExported: 'Outils exportés',
    rolesCovered: 'Rôles couverts',
    whyUseHeading: 'Pourquoi cette page existe',
    whyUsePoint1: 'Voir les outils IA d’AimyFlow dans un répertoire léger sur GitHub.',
    whyUsePoint2: 'Consulter rapidement une courte description et les rôles adaptés pour chaque outil.',
    whyUsePoint3: 'Ouvrir ensuite la page complète sur AimyFlow pour plus de détails.',
    startHere: 'Commencer ici',
    backToDocsHome: 'Retour à l’accueil des docs',
    exploreTools: 'Explorer tous les outils IA',
    inspectData: 'Inspecter le jeu de données des outils',
    featuredTools: 'Outils ajoutés récemment',
    featuredIntro: 'Nouveaux outils avec résumé rapide et rôles adaptés.',
    allTools: 'Tous les outils',
    suitableRoles: 'Rôles adaptés',
    officialSite: 'Site officiel',
    continueOnAimyFlow: 'Continuer sur AimyFlow',
    browseRoles: 'Parcourir les rôles',
    notes: 'Notes',
    notesBody:
      'Cette page GitHub reste volontairement concise et orientée annuaire. AimyFlow reste la destination principale pour les pages outils complètes, les rôles et les workflows.',
    rootIndexTitle: 'Documentation Awesome des Outils IA',
    rootIndexIntro:
      'Un répertoire GitHub multilingue qui relie chaque outil IA à sa page principale sur AimyFlow.',
    localeIndexLabel: 'Répertoires localisés',
    fullDirectory: 'Développer le répertoire complet des outils',
    moreLabel: 'de plus',
    allToolsStyleNote: '_Vue compacte pour un balayage plus rapide._',
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

function createLocaleCounterMap() {
  return Object.fromEntries(LOCALES.map((locale) => [locale, 0]));
}

function normalizeRoleReference(value) {
  return String(value || '')
    .trim()
    .replace(/[.,!?;:]+$/g, '')
    .replace(/[\\/]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function collapseRoleReference(value) {
  return normalizeRoleReference(value).replace(/[^a-z0-9]/g, '');
}

function buildRoleReferenceKeys(value) {
  const normalized = normalizeRoleReference(value);
  const collapsed = collapseRoleReference(value);
  const keys = new Set();

  if (normalized) {
    keys.add(normalized);
  }

  if (collapsed) {
    keys.add(collapsed);
  }

  if (normalized.endsWith('s') && normalized.length > 4) {
    keys.add(normalized.slice(0, -1));
  }

  if (collapsed.endsWith('s') && collapsed.length > 4) {
    keys.add(collapsed.slice(0, -1));
  }

  return [...keys];
}

function humanizeSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function humanizeToolSlug(slug) {
  const normalized = String(slug || '').replace(/\.[a-z]{2,}$/i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const parts = normalized.split('-').filter(Boolean);
  const trimmedParts = parts.filter((part, index) => !(index === parts.length - 1 && ['com', 'io', 'ai', 'app', 'dev', 'co', 'net', 'org'].includes(part)));

  return humanizeSlug((trimmedParts.length > 0 ? trimmedParts : parts).join('-')) || String(slug || '').trim();
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

function toDocSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatSummary(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function countLocalizedFallback(record, localizedFieldName, fallbackFieldNames, locale) {
  if (locale === 'en') {
    return 0;
  }

  return record[localizedFieldName] ? 0 : fallbackFieldNames.some((fieldName) => record[fieldName]) ? 1 : 0;
}

function buildLocaleSiteUrl(siteUrl, locale, pathname) {
  return `${siteUrl}/${locale}${pathname}`;
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function parseGitHubRepository(value) {
  const match = String(value || '')
    .trim()
    .match(/github\.com[:/]([^/]+)\/([^/.]+?)(?:\.git)?$/i);

  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2],
  };
}

function getRepositoryInfo() {
  const envRepository = process.env.GITHUB_REPOSITORY;

  if (envRepository && envRepository.includes('/')) {
    const [owner, repo] = envRepository.split('/', 2);

    if (owner && repo) {
      return { owner, repo };
    }
  }

  try {
    const remoteUrl = execFileSync('git', ['config', '--get', 'remote.origin.url'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    return parseGitHubRepository(remoteUrl);
  } catch {
    return null;
  }
}

function buildPagesInfo(repositoryInfo) {
  if (!repositoryInfo) {
    return null;
  }

  const { owner, repo } = repositoryInfo;
  const isUserSite = repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

  return {
    repository: `${owner}/${repo}`,
    repoUrl: `https://github.com/${owner}/${repo}`,
    url: `https://${owner}.github.io`,
    baseurl: isUserSite ? '' : `/${repo}`,
  };
}

function renderPageFrontMatter({ title, description, lang = 'en' }) {
  return [
    '---',
    'layout: default',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `lang: ${yamlQuote(lang)}`,
    '---',
    '',
  ].join('\n');
}

async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DOCS_DIR, { recursive: true });
}

async function resetDocsDirectory() {
  await fs.rm(DOCS_DIR, { recursive: true, force: true });
  await fs.mkdir(DOCS_DIR, { recursive: true });
}

async function removeLegacyDataFiles() {
  await fs.rm(path.join(DATA_DIR, 'roles.json'), { force: true });
  await fs.rm(path.join(DATA_DIR, 'skills.json'), { force: true });
}

async function writeJson(relativePath, value) {
  const absolutePath = path.join(REPO_ROOT, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(relativePath, value) {
  const absolutePath = path.join(REPO_ROOT, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, value, 'utf8');
}

function buildRoleLookup(roles) {
  const byKey = new Map();

  function registerVariant(role, variant) {
    for (const key of buildRoleReferenceKeys(variant)) {
      if (!byKey.has(key)) {
        byKey.set(key, role);
      }
    }
  }

  for (const role of roles) {
    const rolePreview = {
      slug: role.name,
      labels: {
        en: firstNonEmpty([role.title_en, role.title, humanizeSlug(role.name)]),
        zh: firstNonEmpty([role.title_zh, role.title_en, role.title, humanizeSlug(role.name)]),
        es: firstNonEmpty([role.title_es, role.title_en, role.title, humanizeSlug(role.name)]),
        ja: firstNonEmpty([role.title_ja, role.title_en, role.title, humanizeSlug(role.name)]),
        de: firstNonEmpty([role.title_de, role.title_en, role.title, humanizeSlug(role.name)]),
        fr: firstNonEmpty([role.title_fr, role.title_en, role.title, humanizeSlug(role.name)]),
      },
    };

    registerVariant(rolePreview, rolePreview.slug);

    for (const locale of LOCALES) {
      registerVariant(rolePreview, rolePreview.labels[locale]);
    }
  }

  return { byKey };
}

function resolveRoleReference(rawRoleSlug, labels, roleLookup) {
  const candidates = new Set();

  for (const value of [rawRoleSlug, labels.en, labels.zh, labels.es, labels.ja, labels.de, labels.fr]) {
    for (const key of buildRoleReferenceKeys(value)) {
      candidates.add(key);
    }
  }

  for (const candidate of candidates) {
    const aliasTarget = ROLE_ALIASES[candidate];

    if (aliasTarget) {
      for (const aliasKey of buildRoleReferenceKeys(aliasTarget)) {
        const aliasedRole = roleLookup.byKey.get(aliasKey);

        if (aliasedRole) {
          return aliasedRole;
        }
      }
    }

    const directRole = roleLookup.byKey.get(candidate);

    if (directRole) {
      return directRole;
    }
  }

  return null;
}

function cleanDisplayName(value, fallback) {
  const source = firstNonEmpty([value, fallback]);

  for (const delimiter of [' | ', ' ｜ ', ' - ', ' – ', ' — ', '|', '｜']) {
    if (source.includes(delimiter)) {
      return source.split(delimiter)[0].trim();
    }
  }

  return source;
}

function stripLeadingNoise(value) {
  return String(value || '')
    .replace(/^[\s"'“”‘’`]+|[\s"'“”‘’`]+$/g, '')
    .replace(/^[\[{(（【]+\s*(official|oficial|officiel|offiziell|官方|公式)\s*[\]})）】:：-]*\s*/iu, '')
    .replace(/^(official|oficial|officiel|offiziell|官方|公式)\s+/iu, '')
    .replace(/^[_*~`#>\-+=|/\\]+/g, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim();
}

function normalizeLinkLabel(value) {
  return stripLeadingNoise(value)
    .replace(/^(#\d+|top\s*\d+|no\.\s*\d+)\s+/iu, '')
    .replace(/^\d+[%+]*\s+(free|gratis|gratuit|kostenlos)\s+/iu, '')
    .replace(/\s+/g, ' ')
    .replace(/[®™]+$/u, '')
    .trim();
}

function extractBrandFromSummary(summary) {
  const source = formatSummary(summary);

  if (!source) {
    return '';
  }

  const patterns = [
    /^(.{1,80}?)\s+is\s/iu,
    /^(.{1,80}?)\s+are\s/iu,
    /^(.{1,80}?)\s+provides\s/iu,
    /^(.{1,80}?)\s+offers\s/iu,
    /^(.{1,80}?)\s+helps\s/iu,
    /^(.{1,80}?)\s+lets\s/iu,
    /^(.{1,80}?)\s+creates\s/iu,
    /^(.{1,80}?)\s+turns\s/iu,
    /^(.{1,80}?)\s+appears\s+to\s+be\s/iu,
    /^(.{1,80}?)\s+was\s/iu,
    /^(.{1,80}?)\s+是一/iu,
    /^(.{1,80}?)\s+是一个/iu,
    /^(.{1,80}?)\s+是一款/iu,
    /^(.{1,80}?)\s+提供/iu,
    /^(.{1,80}?)\s+可帮助/iu,
    /^(.{1,80}?)\s+es\s+una?\s/iu,
    /^(.{1,80}?)\s+es\s+un\s/iu,
    /^(.{1,80}?)\s+ist\s+ein(?:e|en|em|er)?\s/iu,
    /^(.{1,80}?)\s+bietet\s/iu,
    /^(.{1,80}?)\s+est\s+une?\s/iu,
    /^(.{1,80}?)\s+permet\s/iu,
    /^(.{1,80}?)\s+は\s/iu,
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);

    if (match) {
      return normalizeLinkLabel(match[1]);
    }
  }

  return '';
}

function extractHostnameLabel(url) {
  if (!url) {
    return '';
  }

  try {
    const { hostname } = new URL(url);
    const normalized = hostname.replace(/^www\./i, '').toLowerCase();
    const segments = normalized.split('.').filter(Boolean);

    if (segments.length === 0) {
      return '';
    }

    if (segments.length >= 2 && ['netlify', 'vercel', 'github'].includes(segments[segments.length - 2])) {
      return humanizeToolSlug(segments[0]);
    }

    if (segments.length >= 3 && ['co', 'com', 'org', 'net'].includes(segments[segments.length - 2])) {
      return humanizeToolSlug(segments[segments.length - 3]);
    }

    if (segments.length >= 2) {
      const registered = segments.slice(-2).join('.');

      if (/\.(ai|io|so|fm|app|dev)$/i.test(registered)) {
        return registered;
      }

      return humanizeToolSlug(segments[segments.length - 2]);
    }

    return humanizeToolSlug(segments[0]);
  } catch {
    return '';
  }
}

function isWeakDisplayName(value) {
  const source = normalizeLinkLabel(value).toLowerCase();

  if (!source) {
    return true;
  }

  if (
    source === 'coming soon' ||
    source === '即将推出' ||
    source.includes('official website') ||
    source.includes('官方网站')
  ) {
    return true;
  }

  return false;
}

function deriveSiteName({ summaries, titles, externalUrl, fallbackName }) {
  for (const locale of LOCALES) {
    const candidate = extractBrandFromSummary(summaries[locale]);

    if (candidate && !isWeakDisplayName(candidate)) {
      return candidate;
    }
  }

  for (const locale of LOCALES) {
    const candidate = cleanDisplayName(titles[locale], fallbackName);
    const normalized = normalizeLinkLabel(candidate);

    if (normalized && !isWeakDisplayName(normalized)) {
      return normalized;
    }
  }

  const hostLabel = extractHostnameLabel(externalUrl);

  if (hostLabel && !isWeakDisplayName(hostLabel)) {
    return hostLabel;
  }

  return normalizeLinkLabel(fallbackName) || fallbackName;
}

function buildToolRecord(tool, roleLookup, siteUrl) {
  const roleSlugs = splitCommaSeparated(tool.category_name);
  const localizedRoleNames = Object.fromEntries(
    LOCALES.map((locale) => [locale, splitCommaSeparated(getLocalizedField(tool, 'category_name', locale))]),
  );
  const roles = [];
  const unmatched_roles = [];
  const seenRoleSlugs = new Set();

  for (const [index, roleSlug] of roleSlugs.entries()) {
    const labels = Object.fromEntries(
      LOCALES.map((locale) => [locale, localizedRoleNames[locale][index] || humanizeSlug(roleSlug)]),
    );
    const resolvedRole = resolveRoleReference(roleSlug, labels, roleLookup);

    if (!resolvedRole) {
      unmatched_roles.push({
        slug: roleSlug,
        labels,
      });
      continue;
    }

    if (seenRoleSlugs.has(resolvedRole.slug)) {
      continue;
    }

    seenRoleSlugs.add(resolvedRole.slug);
    roles.push({
      slug: resolvedRole.slug,
      labels: resolvedRole.labels,
    });
  }

  const titles = {
    en: firstNonEmpty([tool.title_en, tool.title, tool.name]),
    zh: firstNonEmpty([tool.title_zh, tool.title_en, tool.title, tool.name]),
    es: firstNonEmpty([tool.title_es, tool.title_en, tool.title, tool.name]),
    ja: firstNonEmpty([tool.title_ja, tool.title_en, tool.title, tool.name]),
    de: firstNonEmpty([tool.title_de, tool.title_en, tool.title, tool.name]),
    fr: firstNonEmpty([tool.title_fr, tool.title_en, tool.title, tool.name]),
  };
  const fallbackName = humanizeToolSlug(tool.name);
  const summaries = {
    en: formatSummary(firstNonEmpty([tool.content_en, tool.content, tool.title_en, tool.title, tool.name])),
    zh: formatSummary(firstNonEmpty([tool.content_zh, tool.content_en, tool.title_zh, tool.title_en, tool.name])),
    es: formatSummary(firstNonEmpty([tool.content_es, tool.content_en, tool.title_es, tool.title_en, tool.name])),
    ja: formatSummary(firstNonEmpty([tool.content_ja, tool.content_en, tool.title_ja, tool.title_en, tool.name])),
    de: formatSummary(firstNonEmpty([tool.content_de, tool.content_en, tool.title_de, tool.title_en, tool.name])),
    fr: formatSummary(firstNonEmpty([tool.content_fr, tool.content_en, tool.title_fr, tool.title_en, tool.name])),
  };
  const siteName = deriveSiteName({
    summaries,
    titles,
    externalUrl: tool.url,
    fallbackName,
  });

  return {
    id: tool.id,
    name: tool.name,
    slug: toDocSlug(tool.name),
    display_name: Object.fromEntries(LOCALES.map((locale) => [locale, siteName])),
    site_name: siteName,
    title: titles,
    external_url: tool.url,
    aimyflow_urls: Object.fromEntries(
      LOCALES.map((locale) => [locale, buildLocaleSiteUrl(siteUrl, locale, `/ai/${encodePathSegment(tool.name)}`)]),
    ),
    image_url: tool.thumbnail_url || tool.image_url,
    collected_at: tool.collection_time,
    roles,
    unmatched_roles,
    summary: summaries,
    metadata: {
      star_rating: tool.star_rating,
      pricing_hint: firstNonEmpty([tool.detail_en, tool.detail]),
      tag_name: tool.tag_name,
    },
  };
}

function compareByDisplayName(left, right, locale = 'en') {
  return left.display_name[locale].localeCompare(right.display_name[locale], locale, { sensitivity: 'base' });
}

function sortToolRecords(toolRecords) {
  return toolRecords.slice().sort((left, right) => {
    const byName = compareByDisplayName(left, right);

    if (byName !== 0) {
      return byName;
    }

    return left.slug.localeCompare(right.slug);
  });
}

function getFeaturedTools(toolRecords) {
  return toolRecords
    .slice()
    .sort((left, right) => {
      const leftTime = left.collected_at ? Date.parse(left.collected_at) : 0;
      const rightTime = right.collected_at ? Date.parse(right.collected_at) : 0;

      if (rightTime !== leftTime) {
        return rightTime - leftTime;
      }

      return compareByDisplayName(left, right);
    })
    .slice(0, FEATURED_TOOL_COUNT);
}

function formatRoleList(toolRecord, locale, maxLabels = MAX_ROLE_LABELS) {
  const labels = toolRecord.roles.map((role) => role.labels[locale] || role.labels.en).filter(Boolean);
  const copy = LOCALE_COPY[locale];

  if (labels.length <= maxLabels) {
    return labels.join(', ');
  }

  return `${labels.slice(0, maxLabels).join(', ')} +${labels.length - maxLabels} ${copy.moreLabel}`;
}

function truncateSummary(text, maxLength) {
  const source = formatSummary(text);

  if (source.length <= maxLength) {
    return source;
  }

  const clipped = source.slice(0, maxLength).trim();
  const safeCut = clipped.lastIndexOf(' ');

  return `${(safeCut > 100 ? clipped.slice(0, safeCut) : clipped).trim()}...`;
}

function renderToolDirectoryEntry(toolRecord, locale, options = {}) {
  const { compact = false } = options;
  const copy = LOCALE_COPY[locale];
  const roleList = formatRoleList(toolRecord, locale, compact ? COMPACT_ROLE_LABELS : MAX_ROLE_LABELS);
  const summary = compact ? truncateSummary(toolRecord.summary[locale], COMPACT_SUMMARY_MAX_LENGTH) : toolRecord.summary[locale];

  if (compact) {
    const lines = [`- **[${toolRecord.display_name[locale]}](${toolRecord.aimyflow_urls[locale]})**`];

    if (summary) {
      lines.push(`  - ${summary}`);
    }

    if (roleList) {
      lines.push(`  - *${copy.suitableRoles}:* ${roleList}`);
    }

    return lines.join('\n');
  }

  const lines = ['<div class="tool-card" markdown="1">', '', `### [${toolRecord.display_name[locale]}](${toolRecord.aimyflow_urls[locale]})`, '', summary];

  if (roleList) {
    lines.push('', `**${copy.suitableRoles}:** ${roleList}`);
  }

  lines.push('', '</div>');

  return lines.join('\n');
}

function buildQualitySummary({ rawRoles, rawTools, toolRecords, unmatchedRoleReferenceCount, toolsWithUnmatchedRoles }) {
  const toolTitleFallbacks = createLocaleCounterMap();
  const toolSummaryFallbacks = createLocaleCounterMap();

  for (const tool of rawTools) {
    for (const locale of LOCALES) {
      toolTitleFallbacks[locale] += countLocalizedFallback(tool, `title_${locale}`, ['title_en', 'title', 'name'], locale);
      toolSummaryFallbacks[locale] += countLocalizedFallback(
        tool,
        `content_${locale}`,
        ['content_en', 'content', 'title_en', 'title', 'name'],
        locale,
      );
    }
  }

  const totalRoleReferenceCount = toolRecords.reduce(
    (count, toolRecord) => count + toolRecord.roles.length + toolRecord.unmatched_roles.length,
    0,
  );

  return {
    roles_covered: rawRoles.length,
    tools_with_unmatched_roles: toolsWithUnmatchedRoles,
    total_role_references: totalRoleReferenceCount,
    matched_role_references: totalRoleReferenceCount - unmatchedRoleReferenceCount,
    unmatched_role_references: unmatchedRoleReferenceCount,
    unmatched_role_reference_ratio:
      totalRoleReferenceCount > 0 ? Number((unmatchedRoleReferenceCount / totalRoleReferenceCount).toFixed(4)) : 0,
    tool_title_fallbacks: toolTitleFallbacks,
    tool_summary_fallbacks: toolSummaryFallbacks,
  };
}

function assertQuality(stats) {
  const failures = [];

  if (stats.tool_count === 0) {
    failures.push('no tools were exported');
  }

  if (stats.quality.unmatched_role_reference_ratio > MAX_UNMATCHED_ROLE_REFERENCE_RATIO) {
    failures.push(
      `unmatched role reference ratio ${stats.quality.unmatched_role_reference_ratio} exceeded ${MAX_UNMATCHED_ROLE_REFERENCE_RATIO}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`Quality checks failed:\n- ${failures.join('\n- ')}`);
  }
}

function renderLocaleDocsIndex(stats, toolRecords, locale) {
  const copy = LOCALE_COPY[locale];
  const featuredTools = getFeaturedTools(toolRecords);
  const lines = [
    renderPageFrontMatter({
      title: copy.docsTitle,
      description: copy.docsDescription,
      lang: locale,
    }).trimEnd(),
    '',
    `# ${copy.docsTitle}`,
    '',
    '<div class="landing-hero">',
    '',
    `<p class="landing-tag">${copy.nativeName}</p>`,
    '',
    `<p class="landing-lead">${copy.docsDescription}</p>`,
    '',
    '<p class="landing-actions">',
    `<a href="../">${copy.backToDocsHome}</a>`,
    `<a href="${buildLocaleSiteUrl(stats.site_url, locale, '/explore')}">${copy.exploreTools}</a>`,
    `<a href="../data/tools.json">${copy.inspectData}</a>`,
    '</p>',
    '',
    '</div>',
    '',
    '<div class="stats-grid">',
    `<div class="stat-card"><strong>${stats.tool_count}</strong><span>${copy.toolsExported}</span></div>`,
    `<div class="stat-card"><strong>${stats.role_count}</strong><span>${copy.rolesCovered}</span></div>`,
    `<div class="stat-card"><strong>${stats.generated_at.slice(0, 10)}</strong><span>${copy.generatedAt}</span></div>`,
    '</div>',
    '',
    `## ${copy.startHere}`,
    '',
    `- [${copy.backToDocsHome}](../)`,
    `- [${copy.exploreTools}](${buildLocaleSiteUrl(stats.site_url, locale, '/explore')})`,
    `- [${copy.browseRoles}](${buildLocaleSiteUrl(stats.site_url, locale, '/roles')})`,
    `- [${copy.inspectData}](../data/tools.json)`,
    '',
    `## ${copy.whyUseHeading}`,
    '',
    `- ${copy.whyUsePoint1}`,
    `- ${copy.whyUsePoint2}`,
    `- ${copy.whyUsePoint3}`,
    '',
    `## ${copy.featuredTools}`,
    '',
    `<p class="section-note">${copy.featuredIntro}</p>`,
    '',
  ];

  for (const toolRecord of featuredTools) {
    lines.push(renderToolDirectoryEntry(toolRecord, locale));
    lines.push('');
  }

  lines.push('', `## ${copy.allTools}`, '');
  lines.push('<details markdown="1">');
  lines.push(`<summary>${copy.fullDirectory} (${toolRecords.length})</summary>`);
  lines.push('');
  lines.push(`<p class="section-note">${copy.allToolsStyleNote}</p>`);
  lines.push('');
  lines.push('<div class="directory-list" markdown="1">');
  lines.push('');

  for (const toolRecord of toolRecords) {
    lines.push(renderToolDirectoryEntry(toolRecord, locale, { compact: true }));
    lines.push('');
  }

  lines.push('</div>');
  lines.push('', '</details>', '');
  lines.push(`## ${copy.continueOnAimyFlow}`, '');
  lines.push(`- [${copy.exploreTools}](${buildLocaleSiteUrl(stats.site_url, locale, '/explore')})`);
  lines.push(`- [${copy.browseRoles}](${buildLocaleSiteUrl(stats.site_url, locale, '/roles')})`);
  lines.push('', `## ${copy.notes}`, '');
  lines.push(`- ${copy.notesBody}`, '');

  return `${lines.join('\n')}\n`;
}

function renderRootDocsIndex(stats, pagesInfo) {
  const repoUrl = pagesInfo?.repoUrl;
  const lines = [
    renderPageFrontMatter({
      title: LOCALE_COPY.en.rootIndexTitle,
      description: LOCALE_COPY.en.rootIndexIntro,
      lang: 'en',
    }).trimEnd(),
    '',
    `# ${LOCALE_COPY.en.rootIndexTitle}`,
    '',
    '<div class="landing-hero">',
    '',
    '<p class="landing-tag">GitHub Pages companion for AimyFlow</p>',
    '',
    `<p class="landing-lead">${LOCALE_COPY.en.rootIndexIntro}</p>`,
    '',
    '<p class="landing-actions">',
    '  <a href="https://www.aimyflow.com">Visit AimyFlow</a>',
    `  <a href="${buildLocaleSiteUrl(stats.site_url, 'en', '/explore')}">Explore AI Tools</a>`,
    `  <a href="${buildLocaleSiteUrl(stats.site_url, 'en', '/roles')}">Browse Roles</a>`,
  ];

  if (repoUrl) {
    lines.push(`  <a href="${repoUrl}">View GitHub Repo</a>`);
  }

  lines.push(
    '</p>',
    '',
    '</div>',
    '',
    '<div class="stats-grid">',
    `<div class="stat-card"><strong>${stats.tool_count}</strong><span>Tools exported</span></div>`,
    `<div class="stat-card"><strong>${stats.role_count}</strong><span>Roles covered</span></div>`,
    `<div class="stat-card"><strong>${stats.locales.length}</strong><span>Locales</span></div>`,
    '</div>',
    '',
    '## Start Here',
    '',
    `- [Visit AimyFlow](https://www.aimyflow.com)`,
    `- [Explore all AI tools on AimyFlow](${buildLocaleSiteUrl(stats.site_url, 'en', '/explore')})`,
    `- [Browse roles on AimyFlow](${buildLocaleSiteUrl(stats.site_url, 'en', '/roles')})`,
  );

  if (repoUrl) {
    lines.push(`- [View the GitHub repository](${repoUrl})`);
  }

  lines.push(
    '',
    '## What You Can Do Here',
    '',
    '- Browse a multilingual AI tools directory without leaving GitHub Pages.',
    '- Jump from each listing to the full AimyFlow tool page when you want more detail.',
    '- Use the exported JSON files for indexing, scripting, or downstream analysis.',
    '',
    '## Localized Directories',
    '',
    '<div class="locale-grid">',
    '',
  );

  for (const locale of LOCALES) {
    lines.push('<div class="locale-card">');
    lines.push(`<h3><a href="./${locale}/">${LOCALE_COPY[locale].nativeName}</a></h3>`);
    lines.push(`<p>${LOCALE_COPY[locale].docsTitle}</p>`);
    lines.push('</div>');
    lines.push('');
  }

  lines.push('</div>', '', '## Data and Repo', '');
  lines.push('- [Tools dataset](./data/tools.json)');
  lines.push('- [Snapshot stats](./data/stats.json)');

  if (repoUrl) {
    lines.push(`- [GitHub repository](${repoUrl})`);
  }
  lines.push('', '## About This Site', '');
  lines.push(`- Generated at: ${stats.generated_at}`);
  lines.push('- This GitHub Pages site is the lightweight discovery layer.');
  lines.push('- AimyFlow remains the full destination for complete tool pages, exploration, and multilingual browsing.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function renderDocsSiteConfig(pagesInfo) {
  const lines = [
    'title: Awesome AI Tools Directory',
    'description: Public multilingual GitHub directory of AI tools from AimyFlow, with curated discovery and full directory links.',
    'theme: minima',
    'markdown: kramdown',
    'lang: en',
    'header_pages: []',
    'plugins:',
    '  - jekyll-seo-tag',
    '  - jekyll-sitemap',
  ];

  if (pagesInfo) {
    lines.push(`url: ${yamlQuote(pagesInfo.url)}`);
    lines.push(`baseurl: ${yamlQuote(pagesInfo.baseurl)}`);
    lines.push(`repository: ${yamlQuote(pagesInfo.repository)}`);
  }

  lines.push('');

  return lines.join('\n');
}

function renderDocsStyles() {
  return [
    '---',
    '---',
    '',
    '@import "minima";',
    '',
    ':root {',
    '  --page-border: #d6e6e1;',
    '  --page-muted: #536170;',
    '  --page-surface: #f7fbfa;',
    '  --page-accent: #0f766e;',
    '  --page-accent-strong: #115e59;',
    '  --page-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);',
    '}',
    '',
    '.wrapper {',
    '  max-width: 1100px;',
    '}',
    '',
    '.page-content {',
    '  padding: 28px 0 52px;',
    '}',
    '',
    '.site-header {',
    '  display: none;',
    '}',
    '',
    '.landing-hero {',
    '  margin: 0 0 28px;',
    '  padding: 24px 26px;',
    '  border: 1px solid var(--page-border);',
    '  border-radius: 20px;',
    '  background: linear-gradient(135deg, #f8fcfb 0%, #eef8f5 48%, #fffaf0 100%);',
    '  box-shadow: var(--page-shadow);',
    '}',
    '',
    '.landing-tag {',
    '  margin: 0 0 10px;',
    '  color: var(--page-accent-strong);',
    '  font-size: 0.85rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.08em;',
    '  text-transform: uppercase;',
    '}',
    '',
    '.landing-lead {',
    '  margin: 0;',
    '  color: #17212b;',
    '  font-size: 1.08rem;',
    '  line-height: 1.75;',
    '}',
    '',
    '.landing-actions {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 10px;',
    '  margin: 18px 0 0;',
    '}',
    '',
    '.landing-actions a {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  min-height: 40px;',
    '  padding: 0 14px;',
    '  border: 1px solid var(--page-border);',
    '  border-radius: 999px;',
    '  background: rgba(255, 255, 255, 0.92);',
    '  color: var(--page-accent-strong);',
    '  font-weight: 600;',
    '  text-decoration: none;',
    '}',
    '',
    '.landing-actions a:hover {',
    '  border-color: var(--page-accent);',
    '  text-decoration: none;',
    '}',
    '',
    '.stats-grid {',
    '  display: grid;',
    '  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));',
    '  gap: 12px;',
    '  margin: 0 0 28px;',
    '}',
    '',
    '.stat-card {',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 6px;',
    '  padding: 18px 20px;',
    '  border: 1px solid var(--page-border);',
    '  border-radius: 16px;',
    '  background: var(--page-surface);',
    '  box-shadow: var(--page-shadow);',
    '}',
    '',
    '.stat-card strong {',
    '  color: #17212b;',
    '  font-size: 1.45rem;',
    '  line-height: 1.1;',
    '}',
    '',
    '.stat-card span {',
    '  color: var(--page-muted);',
    '  font-size: 0.95rem;',
    '}',
    '',
    '.locale-grid {',
    '  display: grid;',
    '  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));',
    '  gap: 12px;',
    '  margin: 0 0 28px;',
    '}',
    '',
    '.locale-card {',
    '  padding: 18px 20px;',
    '  border: 1px solid var(--page-border);',
    '  border-radius: 16px;',
    '  background: #fff;',
    '  box-shadow: var(--page-shadow);',
    '}',
    '',
    '.locale-card h3,',
    '.locale-card p {',
    '  margin: 0;',
    '}',
    '',
    '.locale-card h3 {',
    '  margin-bottom: 8px;',
    '  font-size: 1.05rem;',
    '}',
    '',
    '.locale-card p {',
    '  color: var(--page-muted);',
    '  line-height: 1.6;',
    '}',
    '',
    '.section-note {',
    '  margin: 0 0 16px;',
    '  color: var(--page-muted);',
    '  font-size: 0.96rem;',
    '  line-height: 1.7;',
    '}',
    '',
    '.tool-card {',
    '  margin: 0 0 20px;',
    '  padding: 20px 22px;',
    '  border: 1px solid var(--page-border);',
    '  border-radius: 18px;',
    '  background: #fff;',
    '  box-shadow: var(--page-shadow);',
    '}',
    '',
    '.tool-card h3 {',
    '  margin-top: 0;',
    '  margin-bottom: 12px;',
    '}',
    '',
    '.tool-card p:last-child {',
    '  margin-bottom: 0;',
    '}',
    '',
    'details {',
    '  margin: 0 0 28px;',
    '  padding: 16px 18px;',
    '  border: 1px solid var(--page-border);',
    '  border-radius: 18px;',
    '  background: #fff;',
    '  box-shadow: var(--page-shadow);',
    '}',
    '',
    'summary {',
    '  cursor: pointer;',
    '  color: #17212b;',
    '  font-weight: 700;',
    '}',
    '',
    '.directory-list ul {',
    '  margin: 0;',
    '  padding-left: 20px;',
    '}',
    '',
    '.directory-list li {',
    '  margin-bottom: 14px;',
    '  line-height: 1.7;',
    '}',
    '',
    '.directory-list li > ul {',
    '  margin-top: 6px;',
    '}',
    '',
    'h2 {',
    '  margin-top: 34px;',
    '  padding-bottom: 8px;',
    '  border-bottom: 1px solid var(--page-border);',
    '}',
    '',
    '@media (max-width: 640px) {',
    '  .landing-hero {',
    '    padding: 20px 18px;',
    '  }',
    '',
    '  .tool-card,',
    '  .locale-card,',
    '  .stat-card,',
    '  details {',
    '    padding-left: 16px;',
    '    padding-right: 16px;',
    '  }',
    '',
    '  .landing-actions a {',
    '    width: 100%;',
    '  }',
    '}',
    '',
  ].join('\n');
}

async function main() {
  await loadLocalEnv();
  await ensureDirectories();
  await resetDocsDirectory();
  await removeLegacyDataFiles();

  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const siteUrl = getSiteUrl();
  const repositoryInfo = getRepositoryInfo();
  const pagesInfo = buildPagesInfo(repositoryInfo);

  const [roles, tools] = await Promise.all([
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
  ]);

  const roleLookup = buildRoleLookup(roles);
  const toolRecords = sortToolRecords(tools.map((tool) => buildToolRecord(tool, roleLookup, siteUrl)));
  let unmatchedRoleReferenceCount = 0;
  let toolsWithUnmatchedRoles = 0;

  for (const toolRecord of toolRecords) {
    if (toolRecord.unmatched_roles.length > 0) {
      unmatchedRoleReferenceCount += toolRecord.unmatched_roles.length;
      toolsWithUnmatchedRoles += 1;
    }
  }

  const stats = {
    generated_at: new Date().toISOString(),
    site_url: siteUrl,
    locales: LOCALES,
    tool_count: toolRecords.length,
    role_count: roles.length,
    quality: buildQualitySummary({
      rawRoles: roles,
      rawTools: tools,
      toolRecords,
      unmatchedRoleReferenceCount,
      toolsWithUnmatchedRoles,
    }),
    publication: {
      published_tool_counts: Object.fromEntries(LOCALES.map((locale) => [locale, toolRecords.length])),
    },
  };

  assertQuality(stats);

  await writeJson('data/tools.json', toolRecords);
  await writeJson('data/stats.json', stats);
  await writeJson('docs/data/tools.json', toolRecords);
  await writeJson('docs/data/stats.json', stats);
  await writeText('docs/_config.yml', renderDocsSiteConfig(pagesInfo));
  await writeText('docs/assets/main.scss', renderDocsStyles());
  await writeText('docs/index.md', renderRootDocsIndex(stats, pagesInfo));

  for (const locale of LOCALES) {
    await writeText(`docs/${locale}/index.md`, renderLocaleDocsIndex(stats, toolRecords, locale));
  }

  console.log(JSON.stringify(stats));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
