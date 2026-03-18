import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColorTokenPicker } from '@/components/controls/ColorTokenPicker';

describe('ColorTokenPicker', () => {
  it('supports switching to a custom hex color', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Wrapper() {
      const [value, setValue] = React.useState('royal');

      return (
        <ColorTokenPicker
          label="Accent"
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          value={value}
        />
      );
    }

    render(<Wrapper />);

    await user.click(screen.getByRole('button', { name: 'Custom' }));
    const hexInput = screen.getByLabelText('Accent hex color');

    await user.clear(hexInput);
    await user.type(hexInput, '#123ABC');

    expect(onChange).toHaveBeenLastCalledWith('#123ABC');
  });
});
