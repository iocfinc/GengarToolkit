import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DatavizToolkitPage } from '@apps/dataviz-toolkit/src/DatavizToolkitPage';

describe('DatavizToolkitPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders inside the shared editor shell', async () => {
    const user = userEvent.setup();

    render(<DatavizToolkitPage />);

    expect(screen.getByRole('heading', { name: 'Data Visualization Toolkit' })).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Template & Output' }));
    expect(screen.getByLabelText('Output Preset')).toBeInTheDocument();
  });

  it('starts collapsed and focuses one section at a time', async () => {
    const user = userEvent.setup();

    render(<DatavizToolkitPage />);

    const storyToggle = screen.getByRole('button', { name: 'Story' });
    const templateToggle = screen.getByRole('button', { name: 'Template & Output' });
    const controlsPanel = screen.getByTestId('dataviz-control-panel');

    expect(controlsPanel).toHaveClass('overflow-y-auto');
    expect(storyToggle).toHaveAttribute('aria-expanded', 'false');
    expect(templateToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Preset Name')).not.toBeInTheDocument();

    await user.click(storyToggle);

    expect(storyToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByDisplayValue('Peak Hours Story')).toBeInTheDocument();
    expect(controlsPanel).toHaveClass('overflow-hidden');
    expect(screen.queryByRole('button', { name: 'Template & Output' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Story' }));

    expect(screen.getByTestId('dataviz-control-panel')).toHaveClass('overflow-y-auto');
    expect(screen.getByRole('button', { name: 'Template & Output' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('switches the active section instead of stacking multiple open accordions', async () => {
    const user = userEvent.setup();

    render(<DatavizToolkitPage />);

    await user.click(screen.getByRole('button', { name: 'Story' }));
    expect(screen.getByLabelText('Preset Name')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Data & Mapping' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Story' }));
    await user.click(screen.getByRole('button', { name: 'Data & Mapping' }));

    expect(screen.getByRole('button', { name: 'Data & Mapping' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByLabelText('Dataset')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Story' })).not.toBeInTheDocument();
  });
});
