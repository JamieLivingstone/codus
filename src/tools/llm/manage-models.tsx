import { Anchor, Button, Card, Progress, Select, SimpleGrid, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconCloudDownload, IconTrash } from '@tabler/icons-react';
import { listen } from '@tauri-apps/api/event';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useModelContext } from '../../hooks/use-model';

export default function ManageModels() {
  const { t } = useTranslation();
  const { deleteModel, downloadModel, models } = useModelContext();
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = listen<[string, string, number]>(
      'model-download-progress',
      ({ payload: [modelId, parameterSize, progress] }) => {
        setDownloadProgress((prev) => ({
          ...prev,
          [`${modelId}:${parameterSize}`]: progress,
        }));
      },
    );

    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, []);

  const handleDownload = async (modelId: string, parameterSize: string) => {
    const key = `${modelId}:${parameterSize}`;
    try {
      setDownloadProgress((prev) => ({ ...prev, [key]: 0 }));
      await downloadModel(modelId, parameterSize);
    } finally {
      setDownloadProgress((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDelete = async (modelId: string, parameterSize: string) => {
    try {
      await deleteModel(modelId, parameterSize);
    } finally {
      setDownloadProgress((prev) => {
        const { [`${modelId}:${parameterSize}`]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <Stack>
      <Title order={2}>{t('tools.manage-models.name')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {Object.values(models).map((model) => {
          const selectedVariant = model.variants.find((v) => v.parameter_size === variantSelections[model.id]);
          const key = `${model.id}:${selectedVariant?.parameter_size}`;
          const progress = downloadProgress[key];
          const isDownloading = progress !== undefined;

          return (
            <Card withBorder padding="lg" radius="md" key={model.id}>
              <Stack h="100%">
                <Stack gap={2} style={{ flex: 1 }}>
                  <Anchor size="xl" fw={700} href={model.author.url} target="_blank" rel="noopener noreferrer">
                    {model.name} ({model.author.name})
                  </Anchor>

                  <Tooltip label={model.description} multiline maw={300} position="bottom">
                    <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1, height: '26px', cursor: 'help' }}>
                      {model.description}
                    </Text>
                  </Tooltip>
                </Stack>

                <Select
                  label={t('tools.manage-models.select-variant')}
                  placeholder={`${t('tools.manage-models.select-variant')}...`}
                  clearable
                  value={variantSelections[model.id]}
                  onChange={(value) => setVariantSelections((prev) => ({ ...prev, [model.id]: value || '' }))}
                  data={model.variants.map((v) => ({
                    value: v.parameter_size,
                    label: `${v.parameter_size.toUpperCase()} (${v.disk_space})`,
                  }))}
                />

                {!selectedVariant?.downloaded && !isDownloading && (
                  <Button
                    disabled={!selectedVariant}
                    leftSection={<IconCloudDownload size={16} />}
                    onClick={() => handleDownload(model.id, selectedVariant?.parameter_size ?? '')}
                  >
                    {t('common.download')}
                  </Button>
                )}

                {selectedVariant?.downloaded && (
                  <Button
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={() => handleDelete(model.id, selectedVariant.parameter_size)}
                  >
                    {t('common.delete')}
                  </Button>
                )}

                {isDownloading && (
                  <Stack gap="xs">
                    <Progress animated value={progress} />
                    <Text size="sm" ta="center">
                      {Math.round(progress)}%
                    </Text>
                  </Stack>
                )}
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
