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
const PRIMARY_LOCALES = ['en', 'zh'];
const SECONDARY_LOCALES = LOCALES.filter((locale) => !PRIMARY_LOCALES.includes(locale));
const PUBLISH_RULES = {
  en: { minToolCount: 8, maxRoles: null },
  zh: { minToolCount: 8, maxRoles: null },
  es: { minToolCount: 20, maxRoles: 80 },
  ja: { minToolCount: 20, maxRoles: 80 },
  de: { minToolCount: 20, maxRoles: 80 },
  fr: { minToolCount: 20, maxRoles: 80 },
};
const FEATURED_ROLE_PRIORITIES = {
  en: [
    'software-engineer',
    'content-creator',
    'copywriter',
    'digital-marketing-director',
    'project-management-officer',
    'data-scientist',
    'technical-writer',
  ],
  zh: [
    'software-engineer',
    'content-creator',
    'data-scientist',
    'copywriter',
    'digital-marketing-director',
    'project-management-officer',
    'cybersecurity-analyst',
  ],
  es: [
    'digital-marketing-director',
    'e-commerce-seller',
    'content-creator',
    'copywriter',
    'project-management-officer',
    'software-engineer',
  ],
  ja: [
    'software-engineer',
    'project-management-officer',
    'technical-writer',
    'software-development-manager',
    'data-scientist',
    'content-creator',
  ],
  de: [
    'software-development-manager',
    'software-engineer',
    'cybersecurity-analyst',
    'it-infrastructure-manager',
    'project-management-officer',
    'data-engineer',
  ],
  fr: [
    'content-creator',
    'graphic-designer',
    'copywriter',
    'digital-marketing-director',
    'customer-success-manager',
    'software-engineer',
  ],
};
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
const MAX_UNMATCHED_ROLE_REFERENCE_RATIO = 0.05;
const MIN_PRIMARY_PUBLISHED_ROLES = 30;
const MIN_SECONDARY_PUBLISHED_ROLES = 20;

const LOCALE_COPY = {
  en: {
    nativeName: 'English',
    docsTitle: 'AimyFlow Open Data Index',
    docsDescription:
      'An open, multilingual index of AI tools mapped to real job roles, with machine-readable exports and GitHub-friendly landing pages.',
    startHere: 'Start Here',
    featuredRoles: 'Featured Roles',
    dataFiles: 'Data Files',
    whyUseHeading: 'Why This Page Exists',
    whyUsePoint1: 'Find AI tools by role without opening the full product first.',
    whyUsePoint2: 'Inspect multilingual role, tool and skill exports in plain JSON.',
    whyUsePoint3: 'Jump to AimyFlow for live pages, community voting and workflows.',
    bestForHeading: 'Best For',
    bestForPoint1: 'Developers and researchers inspecting structured AI tool data.',
    bestForPoint2: 'Operators comparing tool coverage across roles.',
    bestForPoint3: 'Search visitors who want a fast role-by-role starting point.',
    exportIncludesHeading: 'What Is Included',
    openRoleDirectory: 'Browse the full role directory',
    roleCountLabel: 'roles',
    toolCountLabel: 'tools',
    skillCountLabel: 'skills',
    openDocs: 'Open localized docs',
    inspectData: 'Inspect raw datasets',
    viewRoles: 'View featured role pages',
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
      'A public, multilingual entry point for exploring AI tools by role, with clean data exports on GitHub and deeper role pages on AimyFlow.',
    publishedRoles: 'Published role pages',
    coverageFull:
      'This locale publishes the broader role set because coverage and localization quality are stronger here.',
    coverageSelective:
      'This locale currently publishes a curated head set of role pages so GitHub stays focused on the strongest localized entries.',
    roleIntroHeading: 'Why This Role Page Exists',
  },
  zh: {
    nativeName: '中文',
    docsTitle: 'AimyFlow 开放数据索引',
    docsDescription: '一个按真实职业组织的多语言 AI 工具开放索引，包含结构化导出数据与适合 GitHub 收录的落地页。',
    startHere: '从这里开始',
    featuredRoles: '热门职业',
    dataFiles: '数据文件',
    whyUseHeading: '这个页面的作用',
    whyUsePoint1: '先按职业快速了解 AI 工具覆盖面，再决定是否进入主站。',
    whyUsePoint2: '直接查看多语言的职业、工具和技能 JSON 数据。',
    whyUsePoint3: '跳转到 AimyFlow 查看实时页面、社区投票和工作流内容。',
    bestForHeading: '适合谁看',
    bestForPoint1: '想研究结构化 AI 工具数据的开发者和研究者。',
    bestForPoint2: '想比较不同职业工具覆盖情况的团队或运营人员。',
    bestForPoint3: '想按职业快速了解 AI 工具的搜索访客。',
    exportIncludesHeading: '这里包含什么',
    openRoleDirectory: '展开完整职业目录',
    roleCountLabel: '个职业',
    toolCountLabel: '个工具',
    skillCountLabel: '项技能',
    openDocs: '查看多语言文档',
    inspectData: '查看原始数据集',
    viewRoles: '查看热门职业页',
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
    publishedRoles: '已发布职业页',
    coverageFull: '这个语言版本目前发布更完整的职业覆盖，因为这里的数据覆盖和本地化质量更稳定。',
    coverageSelective: '这个语言版本目前只发布精选头部职业页，避免 GitHub 出现过多薄内容页面。',
    roleIntroHeading: '为什么看这个职业页',
  },
  es: {
    nativeName: 'Español',
    docsTitle: 'Índice de Datos Abiertos de AimyFlow',
    docsDescription:
      'Un índice abierto y multilingüe de herramientas de IA conectadas con roles reales, con datasets estructurados y páginas aptas para GitHub.',
    startHere: 'Comienza aquí',
    featuredRoles: 'Roles destacados',
    dataFiles: 'Archivos de datos',
    whyUseHeading: 'Por qué existe esta página',
    whyUsePoint1: 'Encontrar herramientas de IA por rol sin abrir primero el producto completo.',
    whyUsePoint2: 'Inspeccionar exportaciones multilingües de roles, herramientas y habilidades en JSON.',
    whyUsePoint3: 'Saltar a AimyFlow para páginas activas, votos de la comunidad y workflows.',
    bestForHeading: 'Ideal para',
    bestForPoint1: 'Desarrolladores e investigadores que revisan datos estructurados de herramientas IA.',
    bestForPoint2: 'Operadores que comparan la cobertura de herramientas entre roles.',
    bestForPoint3: 'Visitantes de búsqueda que quieren un punto de entrada rápido por rol.',
    exportIncludesHeading: 'Qué incluye esta exportación',
    openRoleDirectory: 'Ver el directorio completo de roles',
    roleCountLabel: 'roles',
    toolCountLabel: 'herramientas',
    skillCountLabel: 'habilidades',
    openDocs: 'Abrir documentación localizada',
    inspectData: 'Inspeccionar datasets',
    viewRoles: 'Ver páginas de roles destacadas',
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
    publishedRoles: 'Páginas de roles publicadas',
    coverageFull:
      'Este idioma publica una cobertura más amplia porque aquí la cobertura y la localización son más sólidas.',
    coverageSelective:
      'Este idioma publica por ahora un conjunto curado de roles principales para mantener GitHub enfocado en las mejores páginas localizadas.',
    roleIntroHeading: 'Por qué existe esta página de rol',
  },
  ja: {
    nativeName: '日本語',
    docsTitle: 'AimyFlow オープンデータ索引',
    docsDescription:
      '実際の職種に対応した AI ツールをまとめた、多言語対応のオープンインデックスです。構造化データと GitHub 向けの案内ページを含みます。',
    startHere: 'ここから始める',
    featuredRoles: '注目の役割',
    dataFiles: 'データファイル',
    whyUseHeading: 'このページの目的',
    whyUsePoint1: 'まず職種別の AI ツールを素早く把握し、その後に本体へ進めます。',
    whyUsePoint2: '役割、ツール、スキルの多言語 JSON エクスポートを確認できます。',
    whyUsePoint3: 'AimyFlow 本体でコミュニティ投票や workflow、詳細ページに進めます。',
    bestForHeading: 'こんな人に最適',
    bestForPoint1: '構造化された AI ツールデータを調べる開発者や研究者。',
    bestForPoint2: '役割ごとのツール網羅性を比較したい運用担当者。',
    bestForPoint3: '職種別に素早く調べたい検索ユーザー。',
    exportIncludesHeading: 'このエクスポートに含まれるもの',
    openRoleDirectory: '完全な役割ディレクトリを見る',
    roleCountLabel: '役割',
    toolCountLabel: 'ツール',
    skillCountLabel: 'スキル',
    openDocs: '多言語ドキュメントを見る',
    inspectData: '生データを見る',
    viewRoles: '注目の役割ページを見る',
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
    publishedRoles: '公開中の役割ページ',
    coverageFull:
      'この言語では、データのカバレッジとローカライズ品質が比較的高いため、より広い役割セットを公開しています。',
    coverageSelective:
      'この言語では、GitHub 上のページ品質を保つため、まず主要な役割ページに絞って公開しています。',
    roleIntroHeading: 'この役割ページの目的',
  },
  de: {
    nativeName: 'Deutsch',
    docsTitle: 'AimyFlow Open-Data-Index',
    docsDescription:
      'Ein offener, mehrsprachiger Index von KI-Tools für reale Rollen, mit strukturierten Datensätzen und GitHub-tauglichen Landingpages.',
    startHere: 'Hier starten',
    featuredRoles: 'Wichtige Rollen',
    dataFiles: 'Datendateien',
    whyUseHeading: 'Warum es diese Seite gibt',
    whyUsePoint1: 'KI-Tools nach Rolle finden, ohne sofort das ganze Produkt zu öffnen.',
    whyUsePoint2: 'Mehrsprachige Exporte für Rollen, Tools und Skills direkt als JSON prüfen.',
    whyUsePoint3: 'Zu AimyFlow wechseln für Live-Seiten, Community-Votings und Workflows.',
    bestForHeading: 'Geeignet für',
    bestForPoint1: 'Entwickler und Researcher mit Fokus auf strukturierte KI-Tool-Daten.',
    bestForPoint2: 'Operatoren, die Tool-Abdeckung über Rollen hinweg vergleichen.',
    bestForPoint3: 'Suchnutzer, die einen schnellen Einstieg nach Rollen wollen.',
    exportIncludesHeading: 'Was dieser Export enthält',
    openRoleDirectory: 'Vollständiges Rollenverzeichnis öffnen',
    roleCountLabel: 'Rollen',
    toolCountLabel: 'Tools',
    skillCountLabel: 'Skills',
    openDocs: 'Lokalisierte Doku öffnen',
    inspectData: 'Rohdaten ansehen',
    viewRoles: 'Top-Rollen ansehen',
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
    publishedRoles: 'Veröffentlichte Rollenseiten',
    coverageFull:
      'Diese Sprache veröffentlicht eine breitere Rollenabdeckung, weil Datenlage und Lokalisierung hier belastbarer sind.',
    coverageSelective:
      'Diese Sprache veröffentlicht derzeit nur eine kuratierte Auswahl starker Rollen-Seiten, damit GitHub nicht mit dünnen Inhalten gefüllt wird.',
    roleIntroHeading: 'Warum diese Rollen-Seite existiert',
  },
  fr: {
    nativeName: 'Français',
    docsTitle: 'Index Open Data AimyFlow',
    docsDescription:
      'Un index ouvert et multilingue des outils IA reliés à de vrais métiers, avec jeux de données structurés et pages compatibles GitHub.',
    startHere: 'Commencer ici',
    featuredRoles: 'Rôles mis en avant',
    dataFiles: 'Fichiers de données',
    whyUseHeading: 'Pourquoi cette page existe',
    whyUsePoint1: 'Trouver des outils IA par rôle sans ouvrir tout le produit dès le départ.',
    whyUsePoint2: 'Inspecter les exports multilingues de rôles, outils et compétences en JSON.',
    whyUsePoint3: 'Aller sur AimyFlow pour les pages live, les votes de la communauté et les workflows.',
    bestForHeading: 'Idéal pour',
    bestForPoint1: 'Les développeurs et chercheurs qui inspectent des données structurées sur les outils IA.',
    bestForPoint2: 'Les équipes qui comparent la couverture des outils selon les rôles.',
    bestForPoint3: 'Les visiteurs issus de la recherche qui veulent un point de départ rapide par rôle.',
    exportIncludesHeading: 'Ce que contient cet export',
    openRoleDirectory: 'Parcourir le répertoire complet des rôles',
    roleCountLabel: 'rôles',
    toolCountLabel: 'outils',
    skillCountLabel: 'compétences',
    openDocs: 'Ouvrir la documentation localisée',
    inspectData: 'Inspecter les jeux de données',
    viewRoles: 'Voir les rôles mis en avant',
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
    publishedRoles: 'Pages de rôles publiées',
    coverageFull:
      'Cette langue publie une couverture plus large car la qualité de couverture et de localisation y est plus solide.',
    coverageSelective:
      'Cette langue publie pour l’instant un ensemble sélectionné de rôles majeurs afin de garder GitHub concentré sur les meilleures pages localisées.',
    roleIntroHeading: 'Pourquoi cette page de rôle existe',
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

function countLocalizedFallback(record, localizedFieldName, fallbackFieldNames, locale) {
  if (locale === 'en') {
    return 0;
  }

  return record[localizedFieldName] ? 0 : fallbackFieldNames.some((fieldName) => record[fieldName]) ? 1 : 0;
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
      doc_slug: toRoleDocSlug(role.name),
      title: {
        en: firstNonEmpty([role.title_en, role.title, humanizeSlug(role.name)]),
        zh: firstNonEmpty([role.title_zh, role.title_en, role.title, humanizeSlug(role.name)]),
        es: firstNonEmpty([role.title_es, role.title_en, role.title, humanizeSlug(role.name)]),
        ja: firstNonEmpty([role.title_ja, role.title_en, role.title, humanizeSlug(role.name)]),
        de: firstNonEmpty([role.title_de, role.title_en, role.title, humanizeSlug(role.name)]),
        fr: firstNonEmpty([role.title_fr, role.title_en, role.title, humanizeSlug(role.name)]),
      },
    };

    registerVariant(rolePreview, rolePreview.slug);
    registerVariant(rolePreview, rolePreview.doc_slug);

    for (const locale of LOCALES) {
      registerVariant(rolePreview, rolePreview.title[locale]);
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
      LOCALES.map((locale) => [
        locale,
        localizedRoleNames[locale][index] || humanizeSlug(roleSlug),
      ]),
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
      doc_slug: resolvedRole.doc_slug,
      labels: Object.fromEntries(
        LOCALES.map((locale) => [locale, resolvedRole.title[locale] || resolvedRole.title.en || humanizeSlug(resolvedRole.slug)]),
      ),
      aimyflow_urls: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          buildLocaleSiteUrl(siteUrl, locale, `/role/${encodePathSegment(resolvedRole.slug)}`),
        ]),
      ),
    });
  }

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
    unmatched_roles,
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

function getLocaleCoverageNote(locale, publishedRoleCount, totalRoleCount) {
  const copy = LOCALE_COPY[locale];
  return PRIMARY_LOCALES.includes(locale) ? copy.coverageFull : copy.coverageSelective;
}

function buildRoleIntro(roleRecord, locale) {
  const roleName = roleRecord.title[locale];
  const topSkillNames = roleRecord.skills
    .slice(0, 3)
    .map((skill) => skill.title[locale])
    .filter(Boolean)
    .join(', ');
  const toolCount = roleRecord.tool_count;
  const skillCount = roleRecord.skill_count;

  switch (locale) {
    case 'zh':
      return `${roleName} 这页聚焦 ${toolCount} 个相关 AI 工具和 ${skillCount} 项核心技能，方便先快速判断这个职业的 AI 覆盖面。当前最突出的能力方向包括 ${topSkillNames || '核心技能整理'}，更完整的实时工具排序、社区投票和工作流仍以 AimyFlow 主站为准。`;
    case 'es':
      return `Esta página de ${roleName} resume ${toolCount} herramientas IA relacionadas y ${skillCount} habilidades clave para ofrecer una entrada rápida desde GitHub. En esta instantánea destacan capacidades como ${topSkillNames || 'habilidades clave'}, mientras que los rankings vivos, los votos y los workflows completos siguen en AimyFlow.`;
    case 'ja':
      return `${roleName} 向けのこのページでは、関連する AI ツール ${toolCount} 件と主要スキル ${skillCount} 件をまとめ、GitHub 上で素早く全体像を確認できるようにしています。特に ${topSkillNames || '主要スキル'} の観点が目立ち、最新の投票や詳細な workflow は AimyFlow 本体で確認できます。`;
    case 'de':
      return `Diese Seite für ${roleName} bündelt ${toolCount} passende KI-Tools und ${skillCount} Kernkompetenzen, damit Suchnutzer auf GitHub schnell die Relevanz einschätzen können. In diesem Snapshot stechen vor allem ${topSkillNames || 'Kernkompetenzen'} hervor; Live-Rankings, Votings und tiefere Workflows liegen weiterhin auf AimyFlow.`;
    case 'fr':
      return `Cette page ${roleName} regroupe ${toolCount} outils IA liés et ${skillCount} compétences clés afin d’offrir une entrée rapide depuis GitHub. Dans ce snapshot, les axes les plus visibles sont ${topSkillNames || 'les compétences clés'}, tandis que les votes live, les classements et les workflows complets restent sur AimyFlow.`;
    case 'en':
    default:
      return `This ${roleName} page highlights ${toolCount} relevant AI tools and ${skillCount} core skills so search visitors can quickly judge role coverage from GitHub. In this snapshot the strongest signals cluster around ${topSkillNames || 'core skills'}, while live rankings, community voting, and deeper workflows remain on AimyFlow.`;
  }
}

function getRolePriorityIndex(locale, roleRecord) {
  const priorities = FEATURED_ROLE_PRIORITIES[locale] || [];
  return priorities.indexOf(roleRecord.doc_slug);
}

function sortRolesForLocale(roleRecords, locale) {
  return roleRecords.slice().sort((left, right) => {
    const leftPriority = getRolePriorityIndex(locale, left);
    const rightPriority = getRolePriorityIndex(locale, right);

    if (leftPriority !== rightPriority) {
      if (leftPriority === -1) {
        return 1;
      }

      if (rightPriority === -1) {
        return -1;
      }

      return leftPriority - rightPriority;
    }

    if (right.tool_count !== left.tool_count) {
      return right.tool_count - left.tool_count;
    }

    return left.title.en.localeCompare(right.title.en);
  });
}

function getPublishedRolesForLocale(roleRecords, locale) {
  const rule = PUBLISH_RULES[locale];
  const filteredRoles = roleRecords.filter((roleRecord) => roleRecord.tool_count >= rule.minToolCount);
  const sortedRoles = sortRolesForLocale(filteredRoles, locale);

  return rule.maxRoles ? sortedRoles.slice(0, rule.maxRoles) : sortedRoles;
}

function buildPublicationSummary(publishedRolesByLocale) {
  return {
    primary_locales: PRIMARY_LOCALES,
    secondary_locales: SECONDARY_LOCALES,
    locale_rules: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        {
          min_tool_count: PUBLISH_RULES[locale].minToolCount,
          max_roles: PUBLISH_RULES[locale].maxRoles,
        },
      ]),
    ),
    published_role_counts: Object.fromEntries(
      LOCALES.map((locale) => [locale, publishedRolesByLocale[locale].length]),
    ),
  };
}

function buildQualitySummary({ roleRecords, toolRecords, rawRoles, rawTools, rawSkills, unmatchedRoleReferenceCount, toolsWithUnmatchedRoles }) {
  const toolTitleFallbacks = createLocaleCounterMap();
  const toolSummaryFallbacks = createLocaleCounterMap();
  const roleTitleFallbacks = createLocaleCounterMap();
  const skillTitleFallbacks = createLocaleCounterMap();
  const skillDescriptionFallbacks = createLocaleCounterMap();

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

  for (const role of rawRoles) {
    for (const locale of LOCALES) {
      roleTitleFallbacks[locale] += countLocalizedFallback(role, `title_${locale}`, ['title_en', 'title', 'name'], locale);
    }
  }

  for (const skill of rawSkills) {
    for (const locale of LOCALES) {
      skillTitleFallbacks[locale] += countLocalizedFallback(skill, `title_${locale}`, ['title_en', 'title'], locale);
      skillDescriptionFallbacks[locale] += countLocalizedFallback(
        skill,
        `description_${locale}`,
        ['description_en', 'description'],
        locale,
      );
    }
  }

  const totalRoleReferenceCount = toolRecords.reduce(
    (count, toolRecord) => count + toolRecord.roles.length + toolRecord.unmatched_roles.length,
    0,
  );

  return {
    zero_tool_roles_total: roleRecords.filter((roleRecord) => roleRecord.tool_count === 0).length,
    tools_with_unmatched_roles: toolsWithUnmatchedRoles,
    total_role_references: totalRoleReferenceCount,
    matched_role_references: totalRoleReferenceCount - unmatchedRoleReferenceCount,
    unmatched_role_references: unmatchedRoleReferenceCount,
    unmatched_role_reference_ratio:
      totalRoleReferenceCount > 0 ? Number((unmatchedRoleReferenceCount / totalRoleReferenceCount).toFixed(4)) : 0,
    tool_title_fallbacks: toolTitleFallbacks,
    tool_summary_fallbacks: toolSummaryFallbacks,
    role_title_fallbacks: roleTitleFallbacks,
    skill_title_fallbacks: skillTitleFallbacks,
    skill_description_fallbacks: skillDescriptionFallbacks,
  };
}

function assertQuality(stats) {
  const failures = [];

  if (stats.quality.unmatched_role_reference_ratio > MAX_UNMATCHED_ROLE_REFERENCE_RATIO) {
    failures.push(
      `unmatched role reference ratio ${stats.quality.unmatched_role_reference_ratio} exceeded ${MAX_UNMATCHED_ROLE_REFERENCE_RATIO}`,
    );
  }

  for (const locale of PRIMARY_LOCALES) {
    if (stats.publication.published_role_counts[locale] < MIN_PRIMARY_PUBLISHED_ROLES) {
      failures.push(`primary locale ${locale} only published ${stats.publication.published_role_counts[locale]} role pages`);
    }
  }

  for (const locale of SECONDARY_LOCALES) {
    if (stats.publication.published_role_counts[locale] < MIN_SECONDARY_PUBLISHED_ROLES) {
      failures.push(`secondary locale ${locale} only published ${stats.publication.published_role_counts[locale]} role pages`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Quality checks failed:\n- ${failures.join('\n- ')}`);
  }
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

  lines.push(`## ${copy.roleIntroHeading}`, '');
  lines.push(buildRoleIntro(roleRecord, locale), '');

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
  const featuredRoles = roleRecords.slice(0, 18);
  const coverageNote = getLocaleCoverageNote(locale, roleRecords.length, stats.role_count);
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
    `- ${copy.publishedRoles}: ${roleRecords.length}`,
    '',
    `## ${copy.whyUseHeading}`,
    '',
    `- ${copy.whyUsePoint1}`,
    `- ${copy.whyUsePoint2}`,
    `- ${copy.whyUsePoint3}`,
    `- ${coverageNote}`,
    '',
    `## ${copy.bestForHeading}`,
    '',
    `- ${copy.bestForPoint1}`,
    `- ${copy.bestForPoint2}`,
    `- ${copy.bestForPoint3}`,
    '',
    `## ${copy.startHere}`,
    '',
    `- [${copy.exploreTools}](${buildLocaleSiteUrl(siteUrl, locale, '/explore')})`,
    `- [${copy.browseRoles}](${buildLocaleSiteUrl(siteUrl, locale, '/roles')})`,
    `- [${copy.seeCommunityVotes}](${buildLocaleSiteUrl(siteUrl, locale, '/roles')})`,
    `- [${copy.inspectData}](../../data/tools.json)`,
    '',
    `## ${copy.nextSteps}`,
    '',
    `- [${copy.exploreTools}](${buildLocaleSiteUrl(siteUrl, locale, '/explore')})`,
    `- [${copy.browseRoles}](${buildLocaleSiteUrl(siteUrl, locale, '/roles')})`,
    `- [${copy.seeCommunityVotes}](${buildLocaleSiteUrl(siteUrl, locale, '/roles')})`,
    '',
    `## ${copy.exportIncludesHeading}`,
    '',
    '- [`data/tools.json`](../../data/tools.json)',
    '- [`data/roles.json`](../../data/roles.json)',
    '- [`data/skills.json`](../../data/skills.json)',
    '- [`data/stats.json`](../../data/stats.json)',
    '',
    `## ${copy.featuredRoles}`,
    '',
  ];

  for (const role of featuredRoles) {
    lines.push(
      `- [${role.title[locale]}](./roles/${role.doc_slug}.md): ${role.tool_count} ${copy.toolCountLabel}, ${role.skill_count} ${copy.skillCountLabel}`,
    );
  }

  lines.push('', `## ${copy.rolesHeading}`, '');
  lines.push('<details>');
  lines.push(`<summary>${copy.openRoleDirectory} (${roleRecords.length} ${copy.roleCountLabel})</summary>`);
  lines.push('');

  for (const role of roleRecords) {
    lines.push(
      `- [${role.title[locale]}](./roles/${role.doc_slug}.md): ${role.tool_count} ${copy.toolCountLabel}, ${role.skill_count} ${copy.skillCountLabel}`,
    );
  }

  lines.push('', '</details>', '');

  return `${lines.join('\n')}\n`;
}

function renderRootDocsIndex(stats, publishedRolesByLocale) {
  const siteUrl = stats.site_url;
  const topLocales = LOCALES.map(
    (locale) => `- [${LOCALE_COPY[locale].nativeName}](./${locale}/index.md): ${stats.publication.published_role_counts[locale]} published role pages`,
  );
  const featuredRoles = publishedRolesByLocale.en.slice(0, 12);
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
    `- Published role pages (en): ${stats.publication.published_role_counts.en}`,
    `- Published role pages (zh): ${stats.publication.published_role_counts.zh}`,
    '',
    `## ${LOCALE_COPY.en.whyUseHeading}`,
    '',
    `- ${LOCALE_COPY.en.whyUsePoint1}`,
    `- ${LOCALE_COPY.en.whyUsePoint2}`,
    `- ${LOCALE_COPY.en.whyUsePoint3}`,
    '- Primary locales publish broader coverage, while secondary locales stay curated so GitHub concentrates on stronger localized pages.',
    '',
    `## ${LOCALE_COPY.en.bestForHeading}`,
    '',
    `- ${LOCALE_COPY.en.bestForPoint1}`,
    `- ${LOCALE_COPY.en.bestForPoint2}`,
    `- ${LOCALE_COPY.en.bestForPoint3}`,
    '',
    '## Start Here',
    '',
    '- [Explore all AI tools](https://www.aimyflow.com/en/explore)',
    '- [Browse roles and workflows](https://www.aimyflow.com/en/roles)',
    '- [Inspect `data/tools.json`](../data/tools.json)',
    '- [Inspect `data/roles.json`](../data/roles.json)',
    '',
    `## Continue on AimyFlow`,
    '',
    `- [Explore all AI tools](${buildLocaleSiteUrl(siteUrl, 'en', '/explore')})`,
    `- [Browse roles and workflows](${buildLocaleSiteUrl(siteUrl, 'en', '/roles')})`,
    `- [See community voting](${buildLocaleSiteUrl(siteUrl, 'en', '/roles')})`,
    '',
    `## ${LOCALE_COPY.en.exportIncludesHeading}`,
    '',
    '- [`data/tools.json`](../data/tools.json)',
    '- [`data/roles.json`](../data/roles.json)',
    '- [`data/skills.json`](../data/skills.json)',
    '- [`data/stats.json`](../data/stats.json)',
    '',
    '## Featured Roles',
    '',
  ];

  for (const role of featuredRoles) {
    lines.push(
      `- [${role.title.en}](./en/roles/${role.doc_slug}.md): ${role.tool_count} tools, ${role.skill_count} skills`,
    );
  }

  lines.push(
    '',
    `## ${LOCALE_COPY.en.localeIndexLabel}`,
    '',
  );

  lines.push(...topLocales);

  lines.push('');

  return `${lines.join('\n')}\n`;
}

function renderDocsSiteConfig() {
  return [
    'title: AimyFlow Open Data',
    'description: Public open data for AI tools by role, career and workflow, linked back to AimyFlow.',
    'theme: minima',
    'markdown: kramdown',
    '',
  ].join('\n');
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

  const roleLookup = buildRoleLookup(roles);
  const toolRecords = tools.map((tool) => buildToolRecord(tool, roleLookup, siteUrl));
  const toolsByRole = new Map();
  let unmatchedRoleReferenceCount = 0;
  let toolsWithUnmatchedRoles = 0;

  for (const toolRecord of toolRecords) {
    if (toolRecord.unmatched_roles.length > 0) {
      unmatchedRoleReferenceCount += toolRecord.unmatched_roles.length;
      toolsWithUnmatchedRoles += 1;
    }

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
    quality: buildQualitySummary({
      roleRecords,
      toolRecords,
      rawRoles: roles,
      rawTools: tools,
      rawSkills: skills,
      unmatchedRoleReferenceCount,
      toolsWithUnmatchedRoles,
    }),
  };

  const publishedRolesByLocale = Object.fromEntries(
    LOCALES.map((locale) => [locale, getPublishedRolesForLocale(roleRecords, locale)]),
  );
  stats.publication = buildPublicationSummary(publishedRolesByLocale);

  assertQuality(stats);

  await writeJson('data/tools.json', toolRecords);
  await writeJson('data/roles.json', roleRecords);
  await writeJson('data/skills.json', skillRecords);
  await writeJson('data/stats.json', stats);
  await writeText('docs/_config.yml', renderDocsSiteConfig());
  await writeText('docs/index.md', renderRootDocsIndex(stats, publishedRolesByLocale));

  for (const locale of LOCALES) {
    await writeText(`docs/${locale}/index.md`, renderLocaleDocsIndex(stats, publishedRolesByLocale[locale], locale));

    for (const roleRecord of publishedRolesByLocale[locale]) {
      await writeText(`docs/${locale}/roles/${roleRecord.doc_slug}.md`, renderRoleDoc(roleRecord, locale));
    }
  }

  console.log(JSON.stringify(stats));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
