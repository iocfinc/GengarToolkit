import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SocialCardToolkitPage } from '@apps/social-card-toolkit/src/SocialCardToolkitPage';

describe('SocialCardToolkitPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders inside the shared editor shell and uses shared output presets', () => {
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

    const templateToggle = screen.getByRole('button', { name: 'Template & Output' });
    fireEvent.click(templateToggle);
    fireEvent.change(screen.getByLabelText('Template'), {
      target: { value: 'chart-caption-card' }
    });
    fireEvent.click(templateToggle);

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));
    await user.click(screen.getByRole('button', { name: 'Chart' }));
    expect(screen.getByLabelText('Chart Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Chart Dataset (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Show Chart Legend')).toBeInTheDocument();
  });

  it('starts collapsed and focuses one section at a time', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    const copyToggle = screen.getByRole('button', { name: 'Copy' });
    const templateToggle = screen.getByRole('button', { name: 'Template & Output' });
    const controlsPanel = screen.getByTestId('social-control-panel');

    expect(controlsPanel).toHaveClass('overflow-y-auto');
    expect(copyToggle).toHaveAttribute('aria-expanded', 'false');
    expect(templateToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();

    await user.click(copyToggle);

    expect(copyToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(controlsPanel).toHaveClass('overflow-hidden');
    expect(screen.queryByRole('button', { name: 'Template & Output' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByTestId('social-control-panel')).toHaveClass('overflow-y-auto');
    expect(screen.getByRole('button', { name: 'Template & Output' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('switches the active section instead of stacking multiple open accordions', async () => {
    const user = userEvent.setup();

    render(<SocialCardToolkitPage />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Template & Output' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    await user.click(screen.getByRole('button', { name: 'Template & Output' }));

    expect(screen.getByRole('button', { name: 'Template & Output' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByLabelText('Preset Name')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
  });
});
