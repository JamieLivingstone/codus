import { Button, Card, Container, Progress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconCloudDownload, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useModelContext } from '../../hooks/use-model';

export default function ManageModels() {
  const { t } = useTranslation();
  const { downloadModel, deleteModel, models } = useModelContext();

  return (
    <Container size="xl">
      <Stack>
        <Title order={2}>{t('tools.manage-models.name')}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {models.map((model) => (
            <Card key={model.name} withBorder padding="lg" radius="md">
              <Stack>
                <Stack gap={2}>
                  <Text size="xl" fw={700}>
                    {model.name}
                  </Text>
                  <Text size="sm">Author: {model.author}</Text>
                  <Text size="sm">Size: {model.size}</Text>
                </Stack>

                {model.state.isDownloading && (
                  <Stack gap="xs">
                    <Progress animated value={model.state.downloadPercentage} />
                    <Text size="sm" ta="center">
                      {Math.round(model.state.downloadPercentage)}%
                    </Text>
                  </Stack>
                )}

                {!model.state.isDownloaded && !model.state.isDownloading && (
                  <Button leftSection={<IconCloudDownload size={16} />} onClick={() => downloadModel(model)}>
                    {t('common.download')}
                  </Button>
                )}

                {model.state.isDownloaded && (
                  <Button color="red" leftSection={<IconTrash size={16} />} onClick={() => deleteModel(model)}>
                    {t('common.delete')}
                  </Button>
                )}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
