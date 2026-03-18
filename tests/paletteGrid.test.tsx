import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { approvedPaletteDefinitions } from '@packages/design-tokens/src/colors';
import { PaletteGrid } from '@packages/ui/src/PaletteGrid';

describe('PaletteGrid', () => {
  it('renders the shared palettes and returns the selected palette', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<PaletteGrid onSelect={onSelect} />);

    expect(screen.getByTestId('palette-grid')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(approvedPaletteDefinitions.length);

    await user.click(screen.getByRole('button', { name: approvedPaletteDefinitions[0].name }));
    expect(onSelect).toHaveBeenCalledWith(approvedPaletteDefinitions[0]);
  });
});
