import { Card, Container, Group, SimpleGrid, Text, rem } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { tools } from '../tools';

export function AllTools() {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {tools.map((tool) => (
        <Card key={tool.id} component={Link} to={tool.path} withBorder padding="lg" radius="md" data-testid={tool.id}>
          <Group align="center">
            <tool.icon style={{ width: rem(48), height: rem(48), flexShrink: 0 }} stroke={1.5} />
            <div>
              <Text fz="lg" fw={500}>
                {t(tool.nameKey)}
              </Text>
              <Text fz="sm" c="dimmed" mt={5}>
                {t(tool.descriptionKey)}
              </Text>
            </div>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
