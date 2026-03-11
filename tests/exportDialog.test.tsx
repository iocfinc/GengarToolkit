import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExportDialog } from '@/components/editor/ExportDialog';
import { useEditorStore } from '@/lib/store/editorStore';
import { resetEditorStore } from './testUtils';

const pngExport = vi.fn();
const webmExport = vi.fn();

vi.mock('@/lib/render/captureFrame', () => ({
  exportDocumentAsPng: (...args: unknown[]) => pngExport(...args)
}));

vi.mock('@/lib/render/exportVideo', () => ({
  exportDocumentAsWebM: (...args: unknown[]) => webmExport(...args)
}));

describe('ExportDialog', () => {
  beforeEach(() => {
    resetEditorStore();
    pngExport.mockReset();
    webmExport.mockReset();
  });

  it('renders only when the export dialog is open and can be closed', async () => {
    const user = userEvent.setup();

    const { rerender } = render(<ExportDialog />);
    expect(screen.queryByText('Render current composition')).not.toBeInTheDocument();

    useEditorStore.setState((state) => ({
      ui: {
        ...state.ui,
        exportDialogOpen: true
      }
    }));

    rerender(<ExportDialog />);
    expect(screen.getByText('Render current composition')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(useEditorStore.getState().ui.exportDialogOpen).toBe(false);
  });

  it('exports the current composition as PNG by default', async () => {
    const user = userEvent.setup();
    let lastAnchor: HTMLAnchorElement | null = null;
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      ((tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(tagName, options);
        if (tagName === 'a') {
          lastAnchor = element as HTMLAnchorElement;
          lastAnchor.click = vi.fn();
        }
        return element;
      }) as typeof document.createElement
    );

    pngExport.mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
    useEditorStore.setState((state) => ({
      ui: {
        ...state.ui,
        exportDialogOpen: true
      }
    }));

    render(<ExportDialog />);
    await user.click(screen.getByRole('button', { name: 'Export' }));

    await waitFor(() => expect(pngExport).toHaveBeenCalledTimes(1));
    expect(lastAnchor?.download).toBe('dioscuri-editorial-hero.png');
    expect(useEditorStore.getState().ui.exportDialogOpen).toBe(false);
  });

  it('updates format and filename before exporting WEBM', async () => {
    const user = userEvent.setup();
    let lastAnchor: HTMLAnchorElement | null = null;
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      ((tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(tagName, options);
        if (tagName === 'a') {
          lastAnchor = element as HTMLAnchorElement;
          lastAnchor.click = vi.fn();
        }
        return element;
      }) as typeof document.createElement
    );

    webmExport.mockResolvedValue(new Blob(['webm'], { type: 'video/webm' }));
    useEditorStore.setState((state) => ({
      ui: {
        ...state.ui,
        exportDialogOpen: true
      }
    }));

    render(<ExportDialog />);

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0]!, 'webm');
    const filenameInput = screen.getByDisplayValue('dioscuri-editorial-hero');
    await user.clear(filenameInput);
    await user.type(filenameInput, 'motion-loop');
    await user.click(screen.getByRole('button', { name: 'Export' }));

    await waitFor(() => expect(webmExport).toHaveBeenCalledTimes(1));
    expect(lastAnchor?.download).toBe('motion-loop.webm');
  });

  it('shows export errors to the user', async () => {
    const user = userEvent.setup();
    pngExport.mockRejectedValue(new Error('PNG export failed.'));
    useEditorStore.setState((state) => ({
      ui: {
        ...state.ui,
        exportDialogOpen: true
      }
    }));

    render(<ExportDialog />);
    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(await screen.findByText('PNG export failed.')).toBeInTheDocument();
    expect(useEditorStore.getState().ui.exportDialogOpen).toBe(true);
  });
});
