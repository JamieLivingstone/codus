import { invoke } from '@tauri-apps/api/core';
import type { Mock } from 'vitest';
import { act, renderHook, waitFor } from '../../test/test-utils';

import { mockModels } from '../../test/mocks';
import { useModel } from '../use-model';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn().mockReturnValue(Promise.resolve(vi.fn())),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }));
  });

  describe('model fetching', () => {
    test('returns models and download states when Ollama is running', async () => {
      (invoke as Mock).mockImplementation((command) => {
        if (command === 'list_available_models') {
          return Promise.resolve(mockModels);
        }
        if (command === 'list_downloaded_models') {
          return Promise.resolve([
            {
              name: `${mockModels[0].id}:${mockModels[0].variants[0].parameter_size}`,
              modified_at: '2024-01-01',
              size: 1000000,
            },
          ]);
        }
      });

      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.models).toEqual(Object.fromEntries(mockModels.map((model) => [model.id, model])));
        expect(result.current.downloadStates).toEqual({
          [`${mockModels[0].id}:${mockModels[0].variants[0].parameter_size}`]: {
            modelId: mockModels[0].id,
            parameterSize: mockModels[0].variants[0].parameter_size,
            progress: 100,
            downloaded: true,
          },
        });
        expect(result.current.isOllamaRunning).toBe(true);
      });

      expect(invoke).toHaveBeenCalledWith('list_available_models');
      expect(invoke).toHaveBeenCalledWith('list_downloaded_models');
    });

    test('handles downloaded models not in available models catalog', async () => {
      (invoke as Mock).mockImplementation((command) => {
        if (command === 'list_available_models') {
          return Promise.resolve(mockModels);
        }
        if (command === 'list_downloaded_models') {
          return Promise.resolve([
            {
              name: 'unknown-model:7b',
              modified_at: '2024-01-01',
              size: 1000000,
            },
          ]);
        }
      });

      const consoleSpy = vi.spyOn(console, 'warn');
      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.downloadStates).toEqual({});
        expect(consoleSpy).toHaveBeenCalledWith(
          'Model unknown-model (7b) is downloaded but not available in model catalog',
        );
      });
    });
  });

  describe('Ollama health check', () => {
    test('returns ollama not running on fetch error', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch'));

      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.isOllamaRunning).toBe(false);
      });
    });

    test('returns ollama not running on non-200 status', async () => {
      mockFetch.mockResolvedValue(new Response(null, { status: 500 }));

      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.isOllamaRunning).toBe(false);
      });
    });

    test('returns ollama running on 200 status', async () => {
      mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.isOllamaRunning).toBe(true);
      });
    });
  });

  describe('download model', () => {
    test('invokes download with correct arguments', async () => {
      (invoke as Mock).mockImplementation((command) => {
        if (command === 'download_model') {
          return Promise.resolve();
        }
      });

      const { result } = renderHook(() => useModel());

      await act(async () => {
        await result.current.downloadModel('test-model', '13b');
      });

      expect(invoke).toHaveBeenCalledWith('download_model', {
        modelId: 'test-model',
        parameterSize: '13b',
      });
    });
  });

  describe('delete model', () => {
    test('invokes delete with correct arguments', async () => {
      (invoke as Mock).mockImplementation((command) => {
        if (command === 'delete_model') {
          return Promise.resolve();
        }
      });

      const { result } = renderHook(() => useModel());

      await act(async () => {
        await result.current.deleteModel('test-model', '13b');
      });

      expect(invoke).toHaveBeenCalledWith('delete_model', {
        modelId: 'test-model',
        parameterSize: '13b',
      });
    });
  });
});
