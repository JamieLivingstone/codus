import { notifications } from '@mantine/notifications';
import { invoke } from '@tauri-apps/api/core';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ModelVariant = {
  disk_space: string;
  downloaded: boolean;
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

export function useModel() {
  const { t } = useTranslation();
  const [isOllamaRunning, setIsOllamaRunning] = useState(false);
  const [models, setModels] = useState<Record<string, Model>>({});
  const [activeModel, setActiveModel] = useState<`${Model['id']}:${ModelVariant['parameter_size']}` | null>(null);

  useEffect(() => {
    const checkOllama = async () => {
      try {
        const response = await fetch('http://localhost:11434/');
        setIsOllamaRunning(response.status === 200);
      } catch {
        setIsOllamaRunning(false);
      }
    };

    checkOllama();
    const interval = setInterval(checkOllama, isOllamaRunning ? 60000 : 10000);
    return () => clearInterval(interval);
  }, [isOllamaRunning]);

  useEffect(() => {
    if (!isOllamaRunning) return;

    invoke<Model[]>('list_models')
      .then((availableModels) => setModels(Object.fromEntries(availableModels.map((model) => [model.id, model]))))
      .catch(() => showError());
  }, [isOllamaRunning]);

  const showError = () => {
    notifications.show({
      title: t('hooks.use-model.failed-ollama-action-title'),
      message: t('hooks.use-model.failed-ollama-action-message'),
      color: 'red',
    });
  };

  const updateModelVariant = (modelId: string, parameterSize: string, downloaded: boolean) => {
    setModels((prevModels) => ({
      ...prevModels,
      [modelId]: {
        ...prevModels[modelId],
        variants: prevModels[modelId]?.variants.map((variant) => ({
          ...variant,
          downloaded: variant.parameter_size === parameterSize ? downloaded : variant.downloaded,
        })),
      },
    }));
  };

  const deleteModel = async (modelId: string, parameterSize: string) => {
    try {
      await invoke('delete_model', { modelId, parameterSize });
      if (activeModel === `${modelId}:${parameterSize}`) {
        setActiveModel(null);
      }
      updateModelVariant(modelId, parameterSize, false);
    } catch {
      showError();
    }
  };

  const downloadModel = async (modelId: string, parameterSize: string) => {
    try {
      await invoke('download_model', { modelId, parameterSize });
      updateModelVariant(modelId, parameterSize, true);
      notifications.show({
        title: t('hooks.use-model.download-model-success-title'),
        message: t('hooks.use-model.download-model-success-message'),
        color: 'green',
      });
    } catch {
      showError();
    }
  };

  return {
    activeModel,
    deleteModel,
    downloadModel,
    isOllamaRunning,
    models,
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
