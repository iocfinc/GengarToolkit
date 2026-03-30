import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SocialCardToolkitPage } from '@apps/social-card-toolkit/src/SocialCardToolkitPage';

describe('SocialCardToolkitPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders inside the shared editor shell and uses shared output presets', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    expect(screen.getByRole('heading', { name: 'Social Card Toolkit' })).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();
    expect(screen.getByText('TRY IT!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));

    const presetSelect = screen.getByLabelText('Output Preset');
    expect(presetSelect).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Announcement Card' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dioscuri Agent Team Launch Announcement')).toBeInTheDocument();
    expect(presetSelect).toHaveValue('linkedin-shared-image');

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

  it('focuses one section at a time and swaps panel overflow for active edits', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    const controlsPanel = screen.getByTestId('social-card-control-panel');
    const templateToggle = screen.getByRole('button', { name: 'Template & Output' });
    const copyToggle = screen.getByRole('button', { name: 'Copy' });

    expect(controlsPanel).toHaveClass('overflow-y-auto');
    expect(templateToggle).toHaveAttribute('aria-expanded', 'false');
    expect(copyToggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(templateToggle);

    expect(screen.getByRole('button', { name: 'Template & Output' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(controlsPanel).toHaveClass('overflow-hidden');
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Output Preset')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));

    expect(controlsPanel).toHaveClass('overflow-y-auto');
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('switches active section instead of stacking open accordions', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));
    expect(screen.getByLabelText('Output Preset')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByRole('button', { name: 'Template & Output' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });
});
