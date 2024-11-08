import { invoke } from '@tauri-apps/api/core';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../../../test/test-utils';
import JwtDecoder from '../jwt-decoder';

describe('JwtDecoder', () => {
  beforeEach(() => {
    vi.mock('@tauri-apps/api/core', () => ({
      invoke: vi.fn().mockResolvedValue({
        header: {
          alg: 'HS256',
          typ: 'JWT',
        },
        claims: {
          registered: {
            sub: '1234567890',
          },
          private: {
            name: 'John Doe',
          },
        },
      }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not display decoded sections when first loaded', async () => {
    await render(<JwtDecoder />);
    expect(screen.queryByText('tools.jwt-decoder.header')).not.toBeInTheDocument();
    expect(screen.queryByText('tools.jwt-decoder.claims')).not.toBeInTheDocument();
  });

  it('should decode and display JWT when valid token is entered', async () => {
    await render(<JwtDecoder />);
    const input = screen.getByPlaceholderText('tools.jwt-decoder.input-placeholder');
    await userEvent.type(input, 'mock.jwt.token');

    await screen.findByText('tools.jwt-decoder.header');
    await screen.findByText('tools.jwt-decoder.claims');

    expect(invoke).toHaveBeenCalledWith('decode_jwt', { token: 'mock.jwt.token' });
    expect(screen.getByText(/"alg": "HS256"/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "John Doe"/)).toBeInTheDocument();
  });

  it('should clear input and decoded sections when clear button clicked', async () => {
    await render(<JwtDecoder />);
    const input = screen.getByPlaceholderText('tools.jwt-decoder.input-placeholder');
    await userEvent.type(input, 'mock.jwt.token');

    const clearButton = screen.getByRole('button', { name: 'common.clear' });
    await userEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(screen.queryByText('tools.jwt-decoder.header')).not.toBeInTheDocument();
    expect(screen.queryByText('tools.jwt-decoder.claims')).not.toBeInTheDocument();
  });
});
