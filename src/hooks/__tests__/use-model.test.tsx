import { invoke } from '@tauri-apps/api/core';
import type { Mock } from 'vitest';

import { mockModels } from '../../test/mocks';
import { act, renderHook, waitFor } from '../../test/test-utils';
import { useModel } from '../use-model';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }));
    (invoke as Mock).mockImplementation((command) => {
      switch (command) {
        case 'list_models':
          return Promise.resolve(mockModels);
        case 'delete_model':
          return Promise.resolve();
        default:
          throw new Error('Unknown command');
      }
    });
  });

  describe('model fetching', () => {
    test('lists models when ollama is running', async () => {
      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.models).toEqual(Object.fromEntries(mockModels.map((model) => [model.id, model])));
        expect(result.current.isOllamaRunning).toBe(true);
      });

      expect(invoke).toHaveBeenCalledWith('list_models');
    });

    test('does not list models when ollama is down', async () => {
      mockFetch.mockRejectedValue(new Error());
      const { result } = renderHook(() => useModel());

      await waitFor(() => {
        expect(result.current.isOllamaRunning).toBe(false);
        expect(result.current.models).toEqual({});
      });

      expect(invoke).not.toHaveBeenCalled();
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
      const { result } = renderHook(() => useModel());
      await waitFor(() => {
        expect(result.current.isOllamaRunning).toBe(true);
      });
    });
  });

  describe('download model', () => {
    test('invokes download with correct arguments', async () => {
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
      const { result } = renderHook(() => useModel());

      await act(async () => {
        await result.current.setActiveModel(`${mockModels[0].id}:${mockModels[0].variants[0].parameter_size}`);
      });

      expect(result.current.activeModel).toBe(`${mockModels[0].id}:${mockModels[0].variants[0].parameter_size}`);

      await act(async () => {
        await result.current.deleteModel(mockModels[0].id, mockModels[0].variants[0].parameter_size);
      });

      expect(result.current.activeModel).toBeNull();
    });

    test('if active model is deleted, set active model to null', async () => {
      const { result } = renderHook(() => useModel());
      const modelId = mockModels[0].id;
      const parameterSize = mockModels[0].variants[0].parameter_size;

      await act(async () => {
        await result.current.setActiveModel(`${modelId}:${parameterSize}`);
      });

      await act(async () => {
        await result.current.deleteModel(modelId, parameterSize);
      });

      await waitFor(() => {
        expect(result.current.activeModel).toBeNull();
      });
    });
  });
});
