'use client';

import { brandThemes, resolveColor } from '@packages/design-tokens/src/colors';
import { getOutputPreset } from '@packages/studio-shell/src/outputPresets';
import { buildChartCaptionCard, getChartCaptionValidationMessages } from './chartCaption';
import type {
  SocialCardDraft,
  SocialCardPreset,
  SocialCardPreview,
  SocialCardTemplateDefinition
} from './types';

export const DEFAULT_OUTPUT_PRESET_ID = 'square-1080';
export const SOCIAL_OUTPUT_PRESET_IDS = [
  'square-1080',
  'portrait-4x5',
  'stories-9x16',
  'linkedin-shared-image',
  'landscape-16x9',
  'linkedin-video-landscape',
  'linkedin-video-square'
] as const;

export const SOCIAL_OUTPUT_PRESETS = SOCIAL_OUTPUT_PRESET_IDS
  .map((presetId) => getOutputPreset(presetId))
  .filter((preset): preset is NonNullable<ReturnType<typeof getOutputPreset>> => Boolean(preset));

export const SOCIAL_CHART_TEMPLATES = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'big-number', label: 'Big Number' }
] as const;

const DEFAULT_CHART_INPUT = 'Quarter,Value\nQ1,42\nQ2,58\nQ3,64\nQ4,72';
const DIOSCURI_AGENT_TEAM_PRESET_ID = 'dioscuri-agent-team-launch';

function escapeMarkup(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function estimateTextWidth(text: string, fontSize: number, widthFactor = 0.56) {
  return text.length * fontSize * widthFactor;
}

function wrapText(text: string, maxWidth: number, fontSize: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (!current || estimateTextWidth(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function renderTextLines({
  text,
  x,
  y,
  maxWidth,
  fontSize,
  lineHeight,
  fill,
  family,
  weight = 500,
  opacity = 1,
  anchor = 'start'
}: {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  lineHeight: number;
  fill: string;
  family: string;
  weight?: number;
  opacity?: number;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const lines = wrapText(text, maxWidth, fontSize);

  if (lines.length === 0) {
    return {
      markup: '',
      height: 0
    };
  }

  return {
    markup: `
      <text x="${x}" y="${y}" fill="${fill}" opacity="${opacity}" font-size="${fontSize}" font-family="${family}" font-weight="${weight}" text-anchor="${anchor}">
        ${lines
          .map(
            (line, index) =>
              `<tspan x="${x}" y="${y + index * fontSize * lineHeight}">${escapeMarkup(line)}</tspan>`
          )
          .join('')}
      </text>
    `,
    height: lines.length * fontSize * lineHeight
  };
}

function getResolvedOutputPreset(outputPresetId: string) {
  return (
    getOutputPreset(outputPresetId) ??
    getOutputPreset(DEFAULT_OUTPUT_PRESET_ID) ??
    SOCIAL_OUTPUT_PRESETS[0]
  );
}

function createFrame({
  width,
  height,
  background,
  accent,
  backgroundStyle
}: {
  width: number;
  height: number;
  background: string;
  accent: string;
  backgroundStyle: SocialCardDraft['backgroundStyle'];
}) {
  const stroke = `
    <defs>
      <linearGradient id="card-stroke" x1="0%" x2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.04)" />
      </linearGradient>
    </defs>
  `;

  const backgroundMarkup =
    backgroundStyle === 'spotlight'
      ? `<radialGradient id="bg-grad" cx="20%" cy="15%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.45" /><stop offset="100%" stop-color="${background}" stop-opacity="1" /></radialGradient><rect width="${width}" height="${height}" fill="url(#bg-grad)" />`
      : backgroundStyle === 'wash'
        ? `<linearGradient id="bg-grad" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stop-color="${background}" /><stop offset="100%" stop-color="${accent}" stop-opacity="0.32" /></linearGradient><rect width="${width}" height="${height}" fill="url(#bg-grad)" />`
        : `<rect width="${width}" height="${height}" fill="${background}" /><circle cx="${width * 0.82}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.18}" fill="${accent}" opacity="0.22" /><circle cx="${width * 0.24}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.11}" fill="${accent}" opacity="0.12" />`;

  return `
    ${stroke}
    ${backgroundMarkup}
    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="34" fill="rgba(255,255,255,0.03)" stroke="url(#card-stroke)" />
  `;
}

function createActionButton({
  width,
  height,
  x,
  y,
  label,
  accent,
  background
}: {
  width: number;
  height: number;
  x: number;
  y: number;
  label: string;
  accent: string;
  background: string;
}) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="${accent}" />
    <text x="${x + 28}" y="${y + height / 2 + 7}" fill="${background}" font-size="20" font-family="Avenir Next, Segoe UI, sans-serif" font-weight="700">${escapeMarkup(label)}</text>
  `;
}

function renderAnnouncementLikeCard(
  draft: SocialCardDraft,
  variant: 'announcement' | 'explainer' | 'stat'
): SocialCardPreview {
  const outputPreset = getResolvedOutputPreset(draft.outputPresetId);
  const width = outputPreset?.width ?? 1080;
  const height = outputPreset?.height ?? 1080;
  const base = Math.min(width, height);
  const theme = brandThemes.find((entry) => entry.id === draft.themeId) ?? brandThemes[0];
  const background = resolveColor(theme.canvas.background);
  const foreground = resolveColor(theme.canvas.foreground);
  const accent = resolveColor(draft.accentColor);
  const pad = width > height ? 92 : 74;
  const eyebrowSize = Math.round(base * 0.018);
  const titleSize =
    variant === 'stat' ? Math.round(base * 0.104) : Math.round(base * 0.064);
  const subtitleSize = Math.round(base * 0.024);
  const bodySize = Math.round(base * 0.028);
  const footerSize = Math.round(base * 0.02);
  const titleBlock = renderTextLines({
    text: draft.title,
    x: pad,
    y: 188,
    maxWidth: width - pad * 2,
    fontSize: titleSize,
    lineHeight: 1.04,
    fill: foreground,
    family: 'Iowan Old Style, Times New Roman, serif',
    weight: 700
  });
  const subtitleBlock = renderTextLines({
    text: draft.subtitle,
    x: pad,
    y: 188 + titleBlock.height + 22,
    maxWidth: width - pad * 2,
    fontSize: subtitleSize,
    lineHeight: 1.24,
    fill: foreground,
    family: 'Avenir Next, Segoe UI, sans-serif',
    opacity: 0.72
  });
  const bodyTop = 188 + titleBlock.height + subtitleBlock.height + 56;
  const bodyBlock = renderTextLines({
    text: draft.body,
    x: pad,
    y: bodyTop,
    maxWidth: width - pad * 2,
    fontSize: bodySize,
    lineHeight: 1.42,
    fill: foreground,
    family: 'Avenir Next, Segoe UI, sans-serif',
    opacity: 0.82
  });
  const footerY = height - 166;
  const bodyTreatment =
    variant === 'explainer'
      ? `<rect x="${pad - 16}" y="${bodyTop - 28}" width="${width - pad * 2 + 32}" height="${Math.max(180, bodyBlock.height + 72)}" rx="28" fill="rgba(255,255,255,0.05)" />${bodyBlock.markup}`
      : bodyBlock.markup;

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        ${createFrame({ width, height, background, accent, backgroundStyle: draft.backgroundStyle })}
        <text x="${pad}" y="112" fill="${foreground}" opacity="0.58" font-size="${eyebrowSize}" font-family="Avenir Next, Segoe UI, sans-serif">${variant.toUpperCase()} CARD</text>
        ${titleBlock.markup}
        ${subtitleBlock.markup}
        ${bodyTreatment}
        <text x="${pad}" y="${footerY}" fill="${foreground}" opacity="0.76" font-size="${footerSize}" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(draft.footer)}</text>
        ${createActionButton({ width: 220, height: 48, x: pad, y: height - 126, label: draft.cta, accent, background })}
      </svg>
    `.trim()
  };
}

function renderQuoteCard(draft: SocialCardDraft): SocialCardPreview {
  const outputPreset = getResolvedOutputPreset(draft.outputPresetId);
  const width = outputPreset?.width ?? 1080;
  const height = outputPreset?.height ?? 1080;
  const base = Math.min(width, height);
  const theme = brandThemes.find((entry) => entry.id === draft.themeId) ?? brandThemes[0];
  const background = resolveColor(theme.canvas.background);
  const foreground = resolveColor(theme.canvas.foreground);
  const accent = resolveColor(draft.accentColor);
  const pad = width > height ? 92 : 74;
  const quoteBlock = renderTextLines({
    text: `“${draft.body}”`,
    x: pad,
    y: 244,
    maxWidth: width - pad * 2,
    fontSize: Math.round(base * 0.052),
    lineHeight: 1.16,
    fill: foreground,
    family: 'Iowan Old Style, Times New Roman, serif',
    weight: 700
  });
  const titleBlock = renderTextLines({
    text: draft.title,
    x: pad,
    y: 136,
    maxWidth: width - pad * 2,
    fontSize: Math.round(base * 0.024),
    lineHeight: 1.2,
    fill: foreground,
    family: 'Avenir Next, Segoe UI, sans-serif',
    opacity: 0.72
  });

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        ${createFrame({ width, height, background, accent, backgroundStyle: draft.backgroundStyle })}
        ${titleBlock.markup}
        ${quoteBlock.markup}
        <text x="${pad}" y="${height - 154}" fill="${foreground}" opacity="0.8" font-size="${Math.round(base * 0.022)}" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(draft.quoteAttribution)}</text>
      </svg>
    `.trim()
  };
}

function renderChartCaptionCard(draft: SocialCardDraft): SocialCardPreview {
  const outputPreset = getResolvedOutputPreset(draft.outputPresetId);
  const width = outputPreset?.width ?? 1080;
  const height = outputPreset?.height ?? 1080;
  const base = Math.min(width, height);
  const theme = brandThemes.find((entry) => entry.id === draft.themeId) ?? brandThemes[0];
  const background = resolveColor(theme.canvas.background);
  const foreground = resolveColor(theme.canvas.foreground);
  const accent = resolveColor(draft.accentColor);
  const pad = width > height ? 92 : 74;
  const chartBoxY = 122;
  const chartBoxHeight = Math.round(height * 0.54);
  const chartCard = buildChartCaptionCard(draft, width, height);
  const captionBlock = renderTextLines({
    text: draft.body,
    x: pad,
    y: chartBoxY + chartBoxHeight + 54,
    maxWidth: width - pad * 2,
    fontSize: Math.round(base * 0.026),
    lineHeight: 1.36,
    fill: foreground,
    family: 'Avenir Next, Segoe UI, sans-serif',
    opacity: 0.84
  });
  const chartMarkup = chartCard.dataUri
    ? `<rect x="${pad - 10}" y="${chartBoxY - 14}" width="${width - pad * 2 + 20}" height="${chartBoxHeight + 28}" rx="30" fill="rgba(255,255,255,0.05)" />
       <image href="${chartCard.dataUri}" x="${pad}" y="${chartBoxY}" width="${width - pad * 2}" height="${chartBoxHeight}" preserveAspectRatio="xMidYMid meet" />`
    : `<rect x="${pad - 10}" y="${chartBoxY - 14}" width="${width - pad * 2 + 20}" height="${chartBoxHeight + 28}" rx="30" fill="rgba(255,255,255,0.05)" />
       <text x="${pad}" y="${chartBoxY + 64}" fill="${foreground}" opacity="0.72" font-size="${Math.round(base * 0.026)}" font-family="Avenir Next, Segoe UI, sans-serif">Chart preview unavailable</text>`;

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        ${createFrame({ width, height, background, accent, backgroundStyle: draft.backgroundStyle })}
        <text x="${pad}" y="88" fill="${foreground}" opacity="0.58" font-size="${Math.round(base * 0.018)}" font-family="Avenir Next, Segoe UI, sans-serif">CHART + CAPTION</text>
        ${chartMarkup}
        ${captionBlock.markup}
        <text x="${pad}" y="${height - 150}" fill="${foreground}" opacity="0.76" font-size="${Math.round(base * 0.02)}" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(draft.footer)}</text>
        ${createActionButton({ width: 220, height: 48, x: pad, y: height - 126, label: draft.cta, accent, background })}
      </svg>
    `.trim()
  };
}

export const socialCardTemplateDefinitions: SocialCardTemplateDefinition[] = [
  {
    id: 'announcement-card',
    label: 'Announcement Card',
    summary: 'Broadcast one clear update with supporting context and a CTA.',
    bodyLabel: 'Body Copy',
    footerLabel: 'Footer',
    ctaLabel: 'CTA',
    render: (draft) => renderAnnouncementLikeCard(draft, 'announcement')
  },
  {
    id: 'explainer-card',
    label: 'Explainer Card',
    summary: 'Use a framed body block for more instructional or context-heavy copy.',
    bodyLabel: 'Explainer Copy',
    footerLabel: 'Footer',
    ctaLabel: 'CTA',
    render: (draft) => renderAnnouncementLikeCard(draft, 'explainer')
  },
  {
    id: 'quote-card',
    label: 'Quote Card',
    summary: 'Show a key quote with attribution and restrained visual framing.',
    bodyLabel: 'Quote',
    quoteAttributionLabel: 'Attribution',
    render: renderQuoteCard
  },
  {
    id: 'stat-card',
    label: 'Stat Card',
    summary: 'Lead with the strongest number or statement and keep supporting copy tight.',
    bodyLabel: 'Supporting Copy',
    footerLabel: 'Footer',
    ctaLabel: 'CTA',
    render: (draft) => renderAnnouncementLikeCard(draft, 'stat')
  },
  {
    id: 'chart-caption-card',
    label: 'Chart + Caption Card',
    summary: 'Embed a constrained chart-core visualization with a short caption and CTA.',
    bodyLabel: 'Caption',
    footerLabel: 'Source / Footer',
    ctaLabel: 'CTA',
    chartEnabled: true,
    render: renderChartCaptionCard
  }
];

export function getSocialCardTemplateDefinition(templateId: SocialCardDraft['template']) {
  return socialCardTemplateDefinitions.find((entry) => entry.id === templateId);
}

export function inferLegacyOutputPresetId(aspectRatio?: SocialCardPreset['aspectRatio']) {
  switch (aspectRatio) {
    case '4:5':
      return 'portrait-4x5';
    case '16:9':
      return 'landscape-16x9';
    case '1:1':
    default:
      return DEFAULT_OUTPUT_PRESET_ID;
  }
}

export const DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET: SocialCardPreset = {
  id: DIOSCURI_AGENT_TEAM_PRESET_ID,
  name: 'Dioscuri Agent Team Launch Announcement',
  template: 'announcement-card',
  outputPresetId: 'linkedin-shared-image',
  themeId: 'dark-editorial',
  title: 'Dioscuri Agent Team ships launch-ready publishing',
  subtitle: 'Shared presets, reactive motion type, live social cards, and chart captions are now in the suite.',
  body: 'This cycle turns our launch loop into a product workflow. Motion typography now scales to the active format, Social Card Toolkit ships in the shared shell, saved presets use named output sizes, and chart-caption cards reuse chart-core for branded exports.',
  footer: 'Dioscuri Agent Team • Cycle 016',
  cta: 'TRY IT!',
  quoteAttribution: 'Dioscuri Agent Team',
  accentColor: 'violetMist',
  backgroundStyle: 'spotlight',
  chartTemplate: 'bar',
  chartInput: DEFAULT_CHART_INPUT,
  chartShowLegend: false
};

export const SEEDED_SOCIAL_CARD_PRESETS: SocialCardPreset[] = [
  DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET
];

export function getDefaultSocialCardDraft(): SocialCardDraft {
  const {
    id: _id,
    name: _name,
    aspectRatio: _aspectRatio,
    ...draft
  } = DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET;

  return {
    ...draft,
    template: 'announcement-card',
    outputPresetId: draft.outputPresetId || DEFAULT_OUTPUT_PRESET_ID,
    chartTemplate: 'bar',
    chartInput: DEFAULT_CHART_INPUT,
    chartShowLegend: false
  };
}

export function normalizeSocialPreset(
  preset: Partial<SocialCardPreset> & Pick<SocialCardPreset, 'id' | 'name' | 'template'>
): SocialCardPreset {
  const defaults = getDefaultSocialCardDraft();

  return {
    ...defaults,
    ...preset,
    id: preset.id,
    name: preset.name,
    template: preset.template,
    outputPresetId: preset.outputPresetId || inferLegacyOutputPresetId(preset.aspectRatio)
  };
}

export function renderSocialCardPreview(draft: SocialCardDraft) {
  return (
    getSocialCardTemplateDefinition(draft.template)?.render(draft) ??
    socialCardTemplateDefinitions[0].render(draft)
  );
}

export function getSocialCardValidationMessages(draft: SocialCardDraft) {
  return draft.template === 'chart-caption-card'
    ? getChartCaptionValidationMessages(draft)
    : [];
}
