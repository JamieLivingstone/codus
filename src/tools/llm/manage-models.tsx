import { Button, Card, Container, Group, Progress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { listen } from '@tauri-apps/api/event';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useModelContext } from '../../hooks/use-model';

export default function ManageModels() {
  const { t } = useTranslation();
  const { downloadModel, models } = useModelContext();
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const removeListener = listen<[string, number]>('model-download-progress', (event) => {
      const [modelName, progress] = event.payload;
      setDownloadProgress((prev) => ({ ...prev, [modelName]: progress }));
    });

    return () => {
      removeListener.then((f) => f());
    };
  }, []);

  return (
    <Container size="xl">
      <Stack>
        <Title order={2}>{t('tools.manage-models.title')}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {models.map((model) => (
            <Card key={model.name} withBorder padding="lg" radius="md">
              <Stack>
                <Group>
                  <Text fw={500}>{model.name}</Text>
                </Group>

                {downloadProgress[model.name] !== undefined && (
                  <Progress value={downloadProgress[model.name]} size="xl" radius="xl" />
                )}

                <Button onClick={() => downloadModel(model)}>{t('common.download')}</Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
