import { describe, expect, it } from 'vitest';
import {
  DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET,
  SEEDED_SOCIAL_CARD_PRESETS,
  getDefaultSocialCardDraft,
  getSocialCardTemplateDefinition,
  renderSocialCardPreview,
  socialCardTemplateDefinitions
} from '@apps/social-card-toolkit/src/framework/registry';

describe('social card framework', () => {
  it('registers the full MVP social-card template pack', () => {
    expect(socialCardTemplateDefinitions.map((entry) => entry.id)).toEqual([
      'announcement-card',
      'explainer-card',
      'quote-card',
      'stat-card',
      'chart-caption-card'
    ]);
  });

  it('renders chart-caption cards through a chart-core-backed embed', () => {
    const preview = renderSocialCardPreview({
      ...getDefaultSocialCardDraft(),
      template: 'chart-caption-card'
    });

    expect(getSocialCardTemplateDefinition('chart-caption-card')?.chartEnabled).toBe(true);
    expect(preview.svg).toContain('data:image/svg+xml');
    expect(preview.svg).toContain('CHART + CAPTION');
  });

  it('ships a seeded Dioscuri Agent Team announcement preset', () => {
    expect(SEEDED_SOCIAL_CARD_PRESETS).toHaveLength(1);
    expect(DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET.outputPresetId).toBe('linkedin-shared-image');
    expect(DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET.cta).toBe('TRY IT!');
    expect(getDefaultSocialCardDraft().title).toContain('Dioscuri Agent Team');
  });
});
