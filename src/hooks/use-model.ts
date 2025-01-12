import { notifications } from '@mantine/notifications';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ModelVariant = {
  disk_space: string;
  parameter_size: string;
};

export type Model = {
  id: string;
  name: string;
  description: string;
  author: {
    name: string;
    url: string;
  };
  variants: ModelVariant[];
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ModelVariantKey = `${Model['id']}:${ModelVariant['parameter_size']}`;

type ModelVariantDownloadState = {
  modelId: Model['id'];
  parameterSize: ModelVariant['parameter_size'];
  downloaded: boolean;
  progress: number;
};

export function useModel() {
  const { t } = useTranslation();
  const [isOllamaRunning, setIsOllamaRunning] = useState(false);
  const [models, setModels] = useState<Record<Model['id'], Model>>({});
  const [downloadStates, setDownloadStates] = useState<Record<ModelVariantKey, ModelVariantDownloadState>>({});
  const [activeModel, setActiveModel] = useState<ModelVariantKey | null>(null);

  // Check if Ollama is running
  useEffect(() => {
    async function ollamaHealthCheck() {
      try {
        const response = await fetch('http://localhost:11434/');
        setIsOllamaRunning(response.status === 200);
      } catch {
        setIsOllamaRunning(false);
      }
    }

    ollamaHealthCheck();
    const interval = setInterval(ollamaHealthCheck, isOllamaRunning ? 60000 : 10000);
    return () => clearInterval(interval);
  }, [isOllamaRunning]);

  // Fetch available and downloaded models from Ollama
  useEffect(() => {
    async function fetchModels() {
      if (!isOllamaRunning) return;

      try {
        const [availableModels, downloadedModels] = await Promise.all([
          invoke<Model[]>('list_available_models'),
          invoke<{ name: string; modified_at: string; size: number }[]>('list_downloaded_models'),
        ]);

        // Track download states for downloaded models
        const newDownloadStates = downloadedModels.reduce<Record<ModelVariantKey, ModelVariantDownloadState>>(
          (states, model) => {
            const [modelId, parameterSize] = model.name.split(':');
            const availableModel = availableModels.find((m) => m.id === modelId);
            const hasMatchingVariant = availableModel?.variants.some((v) => v.parameter_size === parameterSize);

            // A model may have been downloaded directly from Ollama, but not available in the list of available models
            if (!availableModel || !hasMatchingVariant) {
              console.warn(`Model ${modelId} (${parameterSize}) is downloaded but not available in model catalog`);
              return states;
            }

            states[`${modelId}:${parameterSize}`] = {
              modelId,
              parameterSize,
              downloaded: true,
              progress: 100,
            };

            return states;
          },
          {},
        );

        setDownloadStates(newDownloadStates);
        setModels(Object.fromEntries(availableModels.map((model) => [model.id, model])));
      } catch {
        showOllamaActionError();
      }
    }

    fetchModels();
  }, [isOllamaRunning]);

  // Listen for model download progress events
  useEffect(() => {
    const unsubscribe = listen<[string, string, number]>(
      'model-download-progress',
      ({ payload: [modelId, parameterSize, progress] }) => {
        setDownloadStates((prev) => ({
          ...prev,
          [`${modelId}:${parameterSize}`]: { modelId, parameterSize, downloaded: progress === 100, progress },
        }));
      },
    );

    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, []);

  async function deleteModel(modelId: Model['id'], parameterSize: ModelVariant['parameter_size']) {
    const key = `${modelId}:${parameterSize}` as ModelVariantKey;
    try {
      await invoke('delete_model', { modelId, parameterSize });

      setDownloadStates((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });

      if (activeModel === key) {
        setActiveModel(null);
      }
    } catch {
      showOllamaActionError();
    }
  }

  async function downloadModel(modelId: Model['id'], parameterSize: ModelVariant['parameter_size']) {
    const key = `${modelId}:${parameterSize}` as ModelVariantKey;

    try {
      setDownloadStates((prev) => ({ ...prev, [key]: { modelId, parameterSize, downloaded: false, progress: 0 } }));
      await invoke('download_model', { modelId, parameterSize });
    } catch {
      showOllamaActionError();
      setDownloadStates((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  }

  async function sendMessage(messages: ChatMessage[]) {
    if (!activeModel) {
      throw new Error('No active model');
    }

    const [modelId, parameterSize] = activeModel.split(':');

    const response = await invoke<ChatMessage>('chat', {
      modelId,
      parameterSize,
      messages,
    });

    return response;
  }

  function showOllamaActionError() {
    notifications.show({
      title: t('hooks.use-model.failed-ollama-action-title'),
      message: t('hooks.use-model.failed-ollama-action-message'),
      color: 'red',
    });
  }

  return {
    activeModel,
    deleteModel,
    downloadModel,
    downloadStates,
    isOllamaRunning,
    models,
    sendMessage,
    setActiveModel,
  };
}

export type ModelContextType = ReturnType<typeof useModel>;
export const ModelContext = createContext<ModelContextType | null>(null);

export function useModelContext() {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModelContext must be used within a ModelProvider');
  return context;
}
