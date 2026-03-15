import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolkitLauncher } from '@packages/studio-shell/src/ToolkitLauncher';
import { toolkitRegistry } from '@/lib/toolkits';

describe('ToolkitLauncher', () => {
  it('lists all suite toolkits from the shared registry', () => {
    render(
      <ToolkitLauncher
        title="Brand Toolkit Suite"
        subtitle="Shared platform"
        toolkits={toolkitRegistry}
      />
    );

    expect(screen.getByText('Motion Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Data Visualization Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Social Card Toolkit')).toBeInTheDocument();
  });

  it('links only the live motion toolkit card', () => {
    render(
      <ToolkitLauncher
        title="Brand Toolkit Suite"
        subtitle="Shared platform"
        toolkits={toolkitRegistry}
      />
    );

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/editor');
    expect(screen.getAllByText('Planned')).toHaveLength(2);
  });
});
