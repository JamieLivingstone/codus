import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useModelContext } from '../hooks/use-model';

export function ModelSwitcher() {
  const { t } = useTranslation();
  const { activeModel, isOllamaRunning, models, setActiveModel } = useModelContext();

  const downloadedModels = Object.values(models).reduce<{ label: string; value: string }[]>((options, model) => {
    for (const variant of model.variants) {
      if (variant.downloaded) {
        options.push({
          label: `${model.name} (${variant.parameter_size.toUpperCase()})`,
          value: `${model.id}:${variant.parameter_size}`,
        });
      }
    }
    return options;
  }, []);

  return (
    <Select
      allowDeselect={false}
      clearable={false}
      data={downloadedModels}
      nothingFoundMessage={t(
        isOllamaRunning
          ? 'components.model-switcher.select-model-variant-no-search-results'
          : 'components.model-switcher.select-model-variant-ollama-not-running',
      )}
      placeholder={t('components.model-switcher.select-model-placeholder')}
      searchable
      value={activeModel}
      onChange={(value) => setActiveModel(value as `${string}:${string}`)}
      styles={{
        input: { cursor: 'pointer', margin: 0, textAlign: 'center', width: '250px' },
        wrapper: { margin: 0 },
      }}
    />
  );
}
