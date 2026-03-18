import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { BottomBar } from '@/components/editor/BottomBar';
import { useEditorStore } from '@/lib/store/editorStore';
import { resetEditorStore } from './testUtils';

describe('BottomBar', () => {
  beforeEach(() => {
    resetEditorStore();
  });

  it('resets preview zoom to fit', async () => {
    const user = userEvent.setup();

    useEditorStore.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        zoom: 0.85
      }
    }));

    render(<BottomBar />);
    await user.click(screen.getByRole('button', { name: 'Zoom Fit' }));

    expect(useEditorStore.getState().ui.zoom).toBe(1);
  });

  it('starts paused by default', () => {
    render(<BottomBar />);

    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
  });
});
