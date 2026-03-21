import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialCardToolkitPage } from '@apps/social-card-toolkit/src/SocialCardToolkitPage';

describe('SocialCardToolkitPage', () => {
  it('uses shared output presets for social-card sizing', () => {
    render(<SocialCardToolkitPage />);

    const presetSelect = screen.getByLabelText('Output Preset');
    expect(presetSelect).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'announcement card' })).toBeInTheDocument();

    fireEvent.change(presetSelect, { target: { value: 'linkedin-shared-image' } });

    expect(presetSelect).toHaveValue('linkedin-shared-image');
  });
});
