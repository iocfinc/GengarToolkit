import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialCardToolkitPage } from '@apps/social-card-toolkit/src/SocialCardToolkitPage';

describe('SocialCardToolkitPage', () => {
  it('renders inside the shared editor shell and uses shared output presets', () => {
    render(<SocialCardToolkitPage />);

    expect(screen.getByRole('heading', { name: 'Social Card Toolkit' })).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();
    expect(screen.getByText('TRY IT!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Template & Output' }));

    const presetSelect = screen.getByLabelText('Output Preset');
    expect(presetSelect).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Announcement Card' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dioscuri Agent Team Launch Announcement')).toBeInTheDocument();
    expect(presetSelect).toHaveValue('linkedin-shared-image');

    fireEvent.change(presetSelect, { target: { value: 'linkedin-shared-image' } });

    expect(presetSelect).toHaveValue('linkedin-shared-image');
  });

  it('shows constrained chart controls when the chart-caption template is selected', () => {
    render(<SocialCardToolkitPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Template & Output' }));
    fireEvent.change(screen.getByLabelText('Template'), {
      target: { value: 'chart-caption-card' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Chart' }));
    expect(screen.getByLabelText('Chart Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Chart Dataset (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Show Chart Legend')).toBeInTheDocument();
  });
});
