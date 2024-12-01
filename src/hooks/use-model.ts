import { notifications } from '@mantine/notifications';
import { invoke } from '@tauri-apps/api/core';
import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

type HuggingFaceModelSource = {
  type: 'HuggingFace';
  repo: string;
  tensor_path: string;
};

type ModelSource = HuggingFaceModelSource;

export type Model = {
  name: string;
  source: ModelSource;
};

export function useModel() {
  const { t } = useTranslation();
  const [models, setModels] = useState<Model[]>([
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
  ]);

  return {
    downloadModel: async function downloadModel(model: Model) {
      try {
        await invoke('download_model', { model });
      } catch (error) {
        notifications.show({
          title: t('hooks.use-model.errors.download-failed-title'),
          message: !navigator.onLine
            ? t('common.errors.offline-message')
            : t('hooks.use-model.errors.download-failed-message'),
          color: 'red',
        });
      }
    },
    models,
  };
}

export type ModelContextType = ReturnType<typeof useModel>;

export const ModelContext = createContext<ModelContextType | null>(null);

export function useModelContext() {
  const context = useContext(ModelContext);

  if (!context) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }

  return context;
}
