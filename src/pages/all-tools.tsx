import { Box, Card, Group, SimpleGrid, Text, rem } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { AnchorLink } from '../components/link';
import { tools } from '../tools';
import styles from './all-tools.module.css';

export function AllTools() {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {tools.map((tool) => (
        <Card key={tool.id} component={Link} to={tool.path} className={styles.tool} data-testid={tool.id}>
          <Group align="center" wrap="nowrap">
            <tool.icon style={{ width: rem(48), height: rem(48) }} stroke={1.5} />

            <Box>
              <AnchorLink size="lg" fw={600} to={tool.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                {t(tool.nameKey)}
              </AnchorLink>

              <Text fz="sm" c="dimmed" lineClamp={1}>
                {t(tool.descriptionKey)}
              </Text>
            </Box>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
