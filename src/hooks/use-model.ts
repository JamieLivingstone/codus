import { notifications } from '@mantine/notifications';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { load } from '@tauri-apps/plugin-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ModelState = {
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadPercentage: number;
};

type Model = {
  name: string;
  source: {
    type: 'HuggingFace';
    repo: string;
    tensor_path: string;
  };
};

const MODELS: Model[] = [
  {
    name: 'Qwen2.5-1.5B-Instruct-GGUF',
    source: {
      type: 'HuggingFace',
      repo: 'Qwen/Qwen2.5-1.5B-Instruct-GGUF',
      tensor_path: 'qwen2.5-1.5b-instruct-q6_k.gguf',
    },
  },
  {
    name: 'Qwen2.5-0.5B-Instruct-GGUF',
    source: {
      type: 'HuggingFace',
      repo: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
      tensor_path: 'qwen2.5-0.5b-instruct-q6_k.gguf',
    },
  },
];

export function useModel() {
  const { t } = useTranslation();
  const [modelStates, setModelStates] = useState<Record<string, ModelState>>({});

  useEffect(() => {
    const unsubscribe = listen<[string, number]>('model-download-progress', ({ payload: [name, progress] }) => {
      setModelStates((prev) => ({
        ...prev,
        [name]: { ...prev[name], isDownloading: true, downloadPercentage: progress },
      }));
    });

    return () => unsubscribe.then((fn) => fn());
  }, []);

  useEffect(() => {
    load('saved-models.json').then(async (store) => {
      const names = await store.keys();
      const states = Object.fromEntries(
        names.map((name) => [name, { isDownloaded: true, isDownloading: false, downloadPercentage: 100 }]),
      );
      setModelStates((prev) => ({ ...prev, ...states }));
    });
  }, []);

  const downloadModel = async (model: Model) => {
    try {
      const path = await invoke('download_model', { model });
      const store = await load('saved-models.json');
      await store.set(model.name, path);
      setModelStates((prev) => ({
        ...prev,
        [model.name]: { isDownloaded: true, isDownloading: false, downloadPercentage: 100 },
      }));
      notifications.show({
        title: t('hooks.use-model.errors.download-success-title'),
        message: t('hooks.use-model.errors.download-success-message', { name: model.name }),
        color: 'green',
      });
    } catch {
      notifications.show({
        title: t('hooks.use-model.errors.download-failed-title'),
        message: t('hooks.use-model.errors.download-failed-message'),
        color: 'red',
      });
    }
  };

  const deleteModel = async (model: Model) => {
    await invoke('delete_model', { model });
    const store = await load('saved-models.json');
    await store.delete(model.name);
    setModelStates((prev) => ({
      ...prev,
      [model.name]: { isDownloaded: false, isDownloading: false, downloadPercentage: 0 },
    }));
  };

  return {
    downloadModel,
    deleteModel,
    models: MODELS.map((model) => ({
      ...model,
      state: modelStates[model.name] ?? { isDownloaded: false, isDownloading: false, downloadPercentage: 0 },
    })),
  };
}

export type ModelContextType = ReturnType<typeof useModel>;

export const ModelContext = createContext<ModelContextType | null>(null);

export function useModelContext() {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModelContext must be used within a ModelProvider');
  return context;
}
