import { Popover, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useModelContext } from '../hooks/use-model';

export function ModelSwitcher() {
  const { t } = useTranslation();
  const { activeModel, downloadStates, isOllamaRunning, models, setActiveModel } = useModelContext();

  const downloadedModels = Object.values(downloadStates).reduce<{ label: string; value: string }[]>(
    (options, state) => {
      const model = models[state.modelId];

      if (state.downloaded) {
        options.push({
          label: `${model.name} (${state.parameterSize.toUpperCase()})`,
          value: `${model.id}:${state.parameterSize}`,
        });
      }

      return options;
    },
    [],
  );

  return (
    <Popover disabled={isOllamaRunning} position="bottom" withArrow>
      <Popover.Target>
        <Select
          allowDeselect={false}
          clearable={false}
          data={downloadedModels}
          disabled={!isOllamaRunning}
          nothingFoundMessage={t('components.model-switcher.select-model-variant-no-results')}
          placeholder={t('components.model-switcher.select-model-placeholder')}
          searchable
          value={activeModel}
          onChange={(value) => setActiveModel(value as `${string}:${string}`)}
          styles={{
            input: { margin: 0, width: '300px' },
            wrapper: { margin: 0 },
          }}
        />
      </Popover.Target>
      <Popover.Dropdown>{t('common.ollama-not-running')}</Popover.Dropdown>
    </Popover>
  );
}
