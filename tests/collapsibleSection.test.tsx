import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CollapsibleSection } from '@packages/ui/src/CollapsibleSection';

describe('CollapsibleSection', () => {
  it('starts collapsed by default in uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(
      <CollapsibleSection title="Example">
        <div>Section Content</div>
      </CollapsibleSection>
    );

    const toggle = screen.getByRole('button', { name: 'Example' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Section Content')).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });
});
