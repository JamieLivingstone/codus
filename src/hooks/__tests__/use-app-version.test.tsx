import { getVersion } from '@tauri-apps/api/app';
import { renderHook, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useAppVersion } from '../use-app-version';

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn(),
}));

describe('useAppVersion', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the current application version when getVersion succeeds', async () => {
    const mockVersion = '1.2.3';
    (getVersion as Mock).mockResolvedValue(mockVersion);

    const { result } = renderHook(() => useAppVersion());

    expect(result.current).toBe('');

    await waitFor(() => {
      expect(result.current).toBe(mockVersion);
      expect(getVersion).toHaveBeenCalledTimes(1);
    });
  });

  it('returns the default version "0.0.1" when getVersion fails', async () => {
    (getVersion as Mock).mockRejectedValue(new Error('Failed to get version'));

    const { result } = renderHook(() => useAppVersion());

    expect(result.current).toBe('');

    await waitFor(() => {
      expect(result.current).toBe('0.0.1');
    });

    expect(getVersion).toHaveBeenCalledTimes(1);
  });
});