import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandedHeader } from '@packages/studio-shell/src/BrandedHeader';
import { EditorShell } from '@packages/studio-shell/src/EditorShell';
import { PreviewSurface } from '@packages/studio-shell/src/PreviewSurface';

describe('EditorShell', () => {
  it('renders shared header, preview, controls, and footer panes', () => {
    render(
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

    expect(screen.getByText('Shared title')).toBeInTheDocument();
    expect(screen.getByTestId('editor-shell-panes')).toHaveClass('grid-cols-[minmax(0,1fr)_380px]');
    expect(screen.getByTestId('editor-shell-preview-pane')).toHaveTextContent('Preview');
    expect(screen.getByTestId('editor-shell-controls-pane')).toHaveTextContent('Controls');
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByTestId('preview-surface')).toBeInTheDocument();
  });
});
