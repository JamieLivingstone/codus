import { invoke } from '@tauri-apps/api/core';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test/test-utils';
import JwtDecoder from '../jwt-decoder';

const mockDecodedJwt = {
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
};

describe('JwtDecoder', () => {
  beforeEach(() => {
    vi.mock('@tauri-apps/api/core', () => ({
      invoke: vi.fn().mockImplementation(async (_, { token }) => {
        if (token === 'invalid.jwt.token') {
          throw 'Failed to decode JWT token. Please check that the token is valid and properly formatted.';
        }

        return mockDecodedJwt;
      }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('starts with empty state', async () => {
    await render(<JwtDecoder />);
    expect(screen.queryByText('tools.jwt-decoder.header')).not.toBeInTheDocument();
    expect(screen.queryByText('tools.jwt-decoder.claims')).not.toBeInTheDocument();
  });

  test('displays decoded JWT for valid token', async () => {
    await render(<JwtDecoder />);
    const input = screen.getByPlaceholderText('tools.jwt-decoder.input-placeholder');
    await userEvent.type(input, 'mock.jwt.token');

    await screen.findByText('tools.jwt-decoder.header');
    await screen.findByText('tools.jwt-decoder.claims');

    expect(invoke).toHaveBeenCalledWith('decode_jwt', { token: 'mock.jwt.token' });
    expect(screen.getByText(/"alg": "HS256"/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "John Doe"/)).toBeInTheDocument();
  });

  test('shows error for invalid token', async () => {
    await render(<JwtDecoder />);
    await userEvent.type(screen.getByPlaceholderText('tools.jwt-decoder.input-placeholder'), 'invalid.jwt.token');

    await screen.findByText('Failed to decode JWT token. Please check that the token is valid and properly formatted.');
  });

  test('clears state when clear button clicked', async () => {
    await render(<JwtDecoder />);
    const input = screen.getByPlaceholderText('tools.jwt-decoder.input-placeholder');
    await userEvent.type(input, 'mock.jwt.token');

    await userEvent.click(screen.getByRole('button', { name: 'common.clear' }));

    expect(input).toHaveValue('');
    expect(screen.queryByText('tools.jwt-decoder.header')).not.toBeInTheDocument();
    expect(screen.queryByText('tools.jwt-decoder.claims')).not.toBeInTheDocument();
  });
});
