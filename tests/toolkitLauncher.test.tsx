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

  it('links the live suite toolkits from the shared registry', () => {
    render(
      <ToolkitLauncher
        title="Brand Toolkit Suite"
        subtitle="Shared platform"
        toolkits={toolkitRegistry}
      />
    );

    const links = screen.getAllByRole('link');

    // Expect 4 live toolkits
    expect(links.length).toBeGreaterThanOrEqual(4);
    // Verify each expected route exists (ordering may vary)
    expect(links.some((a) => a.getAttribute('href') === '/motion-toolkit/editor')).toBe(true);
    expect(links.some((a) => a.getAttribute('href') === '/dataviz-toolkit')).toBe(true);
    expect(links.some((a) => a.getAttribute('href') === '/social-card-toolkit')).toBe(true);
    expect(links.some((a) => a.getAttribute('href') === '/pattern-toolkit')).toBe(true);
    expect(screen.queryByText('Planned')).not.toBeInTheDocument();
  });
});
