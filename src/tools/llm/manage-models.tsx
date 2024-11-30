import { Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
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
    try {
      invoke<Model[]>('list_models').then(setModels);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDownload = async (name: string) => {
    const model = models.find((model) => model.name === name);
    if (!model) return;

    const result = await invoke('download_model', { model });
    console.log(result);
  };

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

                <Button onClick={() => handleDownload(model.name)}>{t('common.download')}</Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
