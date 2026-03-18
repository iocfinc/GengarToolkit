import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { brandColors } from '@/lib/theme/colors';
import { ColorTokenPicker } from '@/components/controls/ColorTokenPicker';

describe('ColorTokenPicker', () => {
  it('renders brand color tokens and invokes onChange when a swatch is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    // Pick the first token as the initial value
    const firstToken = Object.keys(brandColors)[0] as string;

    render(
      <ColorTokenPicker label="Text Color" value={firstToken} onChange={onChange} />
    );

    // Renders one button per token plus the custom color entry point
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(Object.keys(brandColors).length + 1);

    // Clicking a different token triggers onChange with that token value
    const secondToken = Object.keys(brandColors)[1] as string;
    await user.click(buttons[1]);
    expect(onChange).toHaveBeenCalledWith(secondToken);

    // Token labels are rendered for scanability
    expect(screen.getByText(secondToken)).toBeInTheDocument();
  });
});
