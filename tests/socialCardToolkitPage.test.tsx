import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SocialCardToolkitPage } from '@apps/social-card-toolkit/src/SocialCardToolkitPage';

describe('SocialCardToolkitPage', () => {
  it('renders inside the shared editor shell and uses shared output presets', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    expect(screen.getByRole('heading', { name: 'Social Card Toolkit' })).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();
    expect(screen.getByText('TRY IT!')).toBeInTheDocument();
    expect(screen.getByTestId('social-card-control-panel')).toHaveClass('overflow-y-auto');
    expect(screen.queryByLabelText('Output Preset')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Template & Output' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));

    const presetSelect = screen.getByLabelText('Output Preset');
    expect(presetSelect).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Announcement Card' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dioscuri Agent Team Launch Announcement')).toBeInTheDocument();
    expect(presetSelect).toHaveValue('linkedin-shared-image');
    expect(screen.getByTestId('social-card-control-panel')).toHaveClass('overflow-hidden');
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();

    await user.selectOptions(presetSelect, 'linkedin-shared-image');

    expect(presetSelect).toHaveValue('linkedin-shared-image');
  });

  it('shows constrained chart controls when the chart-caption template is selected', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));
    await user.selectOptions(screen.getByLabelText('Template'), 'chart-caption-card');
    await user.click(screen.getByRole('button', { name: 'Template & Output' }));
    await user.click(screen.getByRole('button', { name: 'Chart' }));

    expect(screen.getByLabelText('Chart Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Chart Dataset (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Show Chart Legend')).toBeInTheDocument();
  });
});
