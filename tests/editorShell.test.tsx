import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandedHeader } from '@packages/studio-shell/src/BrandedHeader';
import { EditorShell } from '@packages/studio-shell/src/EditorShell';
import { PreviewSurface } from '@packages/studio-shell/src/PreviewSurface';

describe('EditorShell', () => {
  it('renders shared header, preview, controls, and footer panes', () => {
    const { container } = render(
      <EditorShell
        controls={<div>Controls</div>}
        footer={<div>Footer</div>}
        header={<BrandedHeader subtitle="Shared subtitle" title="Shared title" />}
        preview={
          <PreviewSurface>
            <div>Preview</div>
          </PreviewSurface>
        }
      />
    );

    expect(container.firstChild).toHaveClass('h-screen', 'overflow-hidden');
    expect(screen.getByText('Shared title')).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toHaveClass('md:grid-cols-2');
    expect(screen.getByTestId('editor-shell-panes')).toHaveClass('min-h-0');
    expect(screen.getByTestId('editor-shell-preview-pane')).toHaveTextContent('Preview');
    expect(screen.getByTestId('editor-shell-controls-pane')).toHaveTextContent('Controls');
    expect(screen.getByTestId('editor-shell-preview-pane')).toHaveClass('overflow-hidden');
    expect(screen.getByTestId('editor-shell-controls-pane')).toHaveClass('overflow-hidden');
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();
  });
});
