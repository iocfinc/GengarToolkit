import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { approvedPalettes } from '@packages/design-tokens/src/colors';
import { PaletteGrid } from '@packages/ui/src/PaletteGrid';

describe('PaletteGrid', () => {
  it('renders the shared palettes and returns the selected palette', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<PaletteGrid onSelect={onSelect} />);

    expect(screen.getByTestId('palette-grid')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(approvedPalettes.length);

    await user.click(screen.getByRole('button', { name: /Palette 1/i }));
    expect(onSelect).toHaveBeenCalledWith(approvedPalettes[0]);
  });
});
