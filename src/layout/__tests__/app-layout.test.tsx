import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../../test/test-utils';
import { AppLayout } from '../app-layout';

describe('AppLayout', () => {
  const version = '1.0.0';

  it('should display app name and version', async () => {
    await render(<AppLayout version={version} />);
    expect(screen.getByText('Codus')).toBeInTheDocument();
    expect(screen.getByText(`v${version}`)).toBeInTheDocument();
  });

  it('should navigate to home page on logo click', async () => {
    await render(<AppLayout version={version} />);
    await userEvent.click(screen.getByText('Codus'));
    expect(window.location.pathname).toBe('/');
  });

  it('should toggle theme', async () => {
    await render(<AppLayout version={version} />);
    expect(screen.getByTestId('toggle-dark')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Toggle color scheme'));
    expect(screen.getByTestId('toggle-light')).toBeInTheDocument();
  });

  it('should have correct GitHub link attributes', async () => {
    await render(<AppLayout version={version} />);
    const link = screen.getByLabelText('GitHub repository');
    expect(link).toHaveAttribute('href', 'https://github.com/JamieLivingstone/codus');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
