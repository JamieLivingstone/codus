import { Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type HuggingFaceModelSource = {
  repo: string;
  tensor_path: string;
};

type ModelSource = HuggingFaceModelSource;

type Model = {
  name: string;
  source: ModelSource;
};

export default function ManageModels() {
  const { t } = useTranslation();
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const fetchedModels = await invoke<Model[]>('list_models');
        setModels(fetchedModels);
      } catch (error) {
        notifications.show({
          title: t('tools.manage-models.errors.list-title'),
          message: t('tools.manage-models.errors.list-message'),
          color: 'red',
        });
      }
    };

    fetchModels();
  }, [t]);

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
                  <Text fz="xs" c="dimmed">
                    Unknown MB
                  </Text>
                </Group>

                <Button onClick={() => invoke('download_model', { model })}>{t('common.download')}</Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
