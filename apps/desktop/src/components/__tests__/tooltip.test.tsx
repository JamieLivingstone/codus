import { act, render, screen, userEvent, waitFor } from '@test/test-utils.tsx';
import { Tooltip } from '../tooltip';

describe('Tooltip', () => {
  it('should render children', async () => {
    await act(async () => {
      render(
        <Tooltip content="Tooltip text">
          <button type="button">Hover me</button>
        </Tooltip>,
      );
    });

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('should display tooltip content on hover', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <Tooltip content="Tooltip text">
          <button type="button">Hover me</button>
        </Tooltip>,
      );
    });

    const button = screen.getByRole('button', { name: 'Hover me' });

    // Initially tooltip should not be visible
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();

    // Tooltip should appear
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    // Tooltip should disappear
    await user.unhover(button);

    await waitFor(() => {
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  it('should not render tooltip when disabled is true', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <Tooltip content="Tooltip text" disabled>
          <button type="button">Hover me</button>
        </Tooltip>,
      );
    });

    const button = screen.getByRole('button', { name: 'Hover me' });

    // Button should be rendered
    expect(button).toBeInTheDocument();

    // Hover over the button
    await user.hover(button);

    // Wait a bit to ensure tooltip doesn't appear
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Tooltip should not appear
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });
});
