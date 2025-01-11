import { Anchor, Button, Card, Progress, Select, SimpleGrid, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconCloudDownload, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Model, useModelContext } from '../../hooks/use-model';

export default function ManageModels() {
  const { t } = useTranslation();
  const { deleteModel, downloadModel, downloadStates, models } = useModelContext();
  const [variantSelections, setVariantSelections] = useState<
    Record<Model['id'], Model['variants'][number]['parameter_size']>
  >({});

  return (
    <Stack>
      <Title order={2}>{t('tools.manage-models.name')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {Object.values(models).map((model) => {
          const selectedVariant = model.variants.find((v) => v.parameter_size === variantSelections[model.id]);
          const variantKey = `${model.id}:${selectedVariant?.parameter_size}`;
          const downloadState = downloadStates[variantKey as keyof typeof downloadStates];
          const isDownloaded = downloadState?.downloaded ?? false;
          const isDownloading = !isDownloaded && downloadState?.progress !== undefined;
          const progress = downloadState?.progress ?? 0;

          const handleVariantChange = (value: string | null) => {
            setVariantSelections((prev) => ({ ...prev, [model.id]: value || '' }));
          };

          const handleDownload = () => {
            if (selectedVariant) {
              downloadModel(model.id, selectedVariant.parameter_size);
            }
          };

          const handleDelete = () => {
            if (selectedVariant) {
              deleteModel(model.id, selectedVariant.parameter_size);
            }
          };

          return (
            <Card withBorder padding="lg" radius="md" key={model.id}>
              <Stack h="100%">
                <Stack gap={2} style={{ flex: 1 }}>
                  <Anchor size="xl" fw={700} href={model.author.url} target="_blank" rel="noopener noreferrer">
                    {model.name} ({model.author.name})
                  </Anchor>
                  <Tooltip label={model.description} multiline maw={300} position="bottom">
                    <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1, cursor: 'help' }}>
                      {model.description}
                    </Text>
                  </Tooltip>
                </Stack>

                <Select
                  label={t('tools.manage-models.select-variant')}
                  placeholder={`${t('tools.manage-models.select-variant')}...`}
                  clearable
                  value={variantSelections[model.id]}
                  onChange={handleVariantChange}
                  data={model.variants.map((variant) => ({
                    value: variant.parameter_size,
                    label: `${variant.parameter_size.toUpperCase()} (${variant.disk_space})`,
                  }))}
                />

                {!isDownloaded && !isDownloading && (
                  <Button
                    leftSection={<IconCloudDownload size={16} />}
                    disabled={!selectedVariant}
                    onClick={handleDownload}
                  >
                    {t('common.download')}
                  </Button>
                )}

                {isDownloaded && (
                  <Button color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
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
