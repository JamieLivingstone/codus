import { Button, Card, Container, Group, SemiCircleProgress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useModelContext } from '../../hooks/use-model';

export default function ManageModels() {
  const { t } = useTranslation();
  const { downloadModel, deleteModel, models } = useModelContext();

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

                {model.state.isDownloading && <SemiCircleProgress value={model.state.downloadPercentage} />}

                {!model.state.isDownloaded && (
                  <Button onClick={() => downloadModel(model)} disabled={model.state.isDownloading}>
                    {t('common.download')}
                  </Button>
                )}

                {model.state.isDownloaded && <Button onClick={() => deleteModel(model)}>{t('common.delete')}</Button>}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
