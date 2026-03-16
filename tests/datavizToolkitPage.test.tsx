import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DatavizToolkitPage } from '@apps/dataviz-toolkit/src/DatavizToolkitPage';

describe('DatavizToolkitPage', () => {
  it('renders inside the shared editor shell', () => {
    render(<DatavizToolkitPage />);

    expect(screen.getByRole('heading', { name: 'Data Visualization Toolkit' })).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();
    expect(screen.getByLabelText('Output Preset')).toBeInTheDocument();
  });

  it('uses collapsible editor sections', () => {
    render(<DatavizToolkitPage />);

    const storyToggle = screen.getByRole('button', { name: 'Story' });
    expect(storyToggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(storyToggle);

    expect(storyToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByDisplayValue('Peak Hours Story')).not.toBeInTheDocument();
  });
});
