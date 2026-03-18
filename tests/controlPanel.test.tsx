import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { approvedPaletteDefinitions } from '@packages/design-tokens/src/colors';
import { ControlPanel } from '@/components/editor/ControlPanel';
import { useEditorStore } from '@/lib/store/editorStore';
import { resetEditorStore } from './testUtils';

describe('ControlPanel', () => {
  beforeEach(() => {
    resetEditorStore();
  });

  it('starts with all accordion sections collapsed', () => {
    render(<ControlPanel />);

    const templateToggle = screen.getByRole('button', { name: 'Template' });
    const paletteToggle = screen.getByRole('button', { name: 'Brand Palette' });

    expect(screen.getByTestId('motion-control-panel')).toHaveClass('overflow-y-auto');
    expect(templateToggle).toHaveAttribute('aria-expanded', 'false');
    expect(paletteToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Document Name')).not.toBeInTheDocument();
  });

  it('applies an approved palette to the motion document', async () => {
    const user = userEvent.setup();

    render(<ControlPanel />);
    await user.click(screen.getByRole('button', { name: 'Brand Palette' }));
    await user.click(screen.getByRole('button', { name: approvedPaletteDefinitions[0].name }));

    const state = useEditorStore.getState();
    const palette = approvedPaletteDefinitions[0];

    expect(state.document.background.paletteName).toBe(palette.name);
    expect(state.document.background.baseColor).toBe(palette.background);
    expect(state.document.background.glowColorA).toBe(palette.colors[0]);
    expect(state.document.background.glowColorB).toBe(palette.colors[1]);
    expect(state.document.motif.color).toBe(palette.colors[2]);
    expect(state.document.typography.textColor).toBe(palette.foreground);
  });
});
