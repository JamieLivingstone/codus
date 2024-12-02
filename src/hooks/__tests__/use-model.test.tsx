import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import '../../test/test-utils';
import { MODELS, useModel } from '../use-model';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn().mockReturnValue(Promise.resolve(vi.fn())),
}));

vi.mock('@tauri-apps/plugin-store', () => ({
  load: vi.fn().mockResolvedValue({
    keys: vi.fn().mockResolvedValue([]),
    set: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('useModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty model states', async () => {
    const { result } = renderHook(() => useModel());

    await waitFor(() => {
      expect(result.current.models).toHaveLength(MODELS.length);
      expect(result.current.models[0].state).toEqual({
        isDownloaded: false,
        isDownloading: false,
        downloadPercentage: 0,
      });
    });
  });

  it('initializes with downloaded model state if model exists in store', async () => {
    const mockStore = {
      keys: vi.fn().mockResolvedValue([MODELS[0].name]),
      get: vi.fn().mockResolvedValue('/path/to/model'),
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    (load as Mock).mockResolvedValue(mockStore);

    const { result } = renderHook(() => useModel());

    await waitFor(() => {
      expect(result.current.models).toHaveLength(MODELS.length);
      expect(result.current.models[0].state).toEqual({
        isDownloaded: true,
        isDownloading: false,
        downloadPercentage: 100,
      });
    });
  });

  it('downloads a model successfully', async () => {
    const mockPath = '/path/to/model';
    (invoke as Mock).mockResolvedValueOnce(mockPath);
    const mockStore = {
      set: vi.fn().mockResolvedValue(undefined),
      keys: vi.fn().mockResolvedValue([]),
    };
    (load as Mock).mockResolvedValue(mockStore);

    const { result } = renderHook(() => useModel());

    await act(async () => {
      await result.current.downloadModel(MODELS[0]);
    });

    expect(invoke).toHaveBeenCalledWith('download_model', { model: MODELS[0] });
    expect(mockStore.set).toHaveBeenCalledWith(MODELS[0].name, mockPath);

    expect(result.current.models[0].state).toEqual({
      isDownloaded: true,
      isDownloading: false,
      downloadPercentage: 100,
    });
    expect(result.current.activeModel).toEqual(MODELS[0]);
  });

  it('deletes a model successfully', async () => {
    const mockStore = {
      delete: vi.fn().mockResolvedValue(undefined),
      keys: vi.fn().mockResolvedValue([]),
    };
    (load as Mock).mockResolvedValue(mockStore);

    const { result } = renderHook(() => useModel());

    await act(async () => {
      await result.current.deleteModel(MODELS[0]);
    });

    expect(invoke).toHaveBeenCalledWith('delete_model', { model: MODELS[0] });
    expect(mockStore.delete).toHaveBeenCalledWith(MODELS[0].name);

    expect(result.current.models[0].state).toEqual({
      isDownloaded: false,
      isDownloading: false,
      downloadPercentage: 0,
    });
  });
});
