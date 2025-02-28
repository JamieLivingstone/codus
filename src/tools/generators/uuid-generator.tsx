import { Box, Button, Checkbox, Group, NumberInput, Select, Stack, Text, Textarea, Title } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyButton } from '../../components/copy-button';

type UuidVersion = 'V4' | 'V7';

export default function UuidGenerator() {
  const { t } = useTranslation();
  const [count, setCount] = useState<number>(10);
  const [version, setVersion] = useState<UuidVersion>('V4');
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uuids, setUuids] = useState<string[]>([]);

  async function generateUuids() {
    try {
      const result = await invoke<string[]>('generate_uuid', {
        numberOfUuids: count,
        version,
        uppercase,
        hyphens,
      });
      setUuids(result);
    } catch (error) {
      console.error('Failed to generate UUIDs:', error);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to run once on initial render
  useEffect(() => {
    generateUuids();
  }, []);

  return (
    <Stack gap="md">
      <Title order={2}>{t('tools.uuid-generator.name')}</Title>

      <Group align="flex-end">
        <NumberInput
          label={t('tools.uuid-generator.count')}
          value={count}
          onChange={(value) => setCount(Number(value))}
          min={1}
          max={1000}
          w={150}
          required
        />

        <Select
          label={t('tools.uuid-generator.version')}
          value={version}
          onChange={(value) => setVersion(value as UuidVersion)}
          data={[
            { value: 'V4', label: t('tools.uuid-generator.v4') },
            { value: 'V7', label: t('tools.uuid-generator.v7') },
          ]}
          w={200}
          required
          allowDeselect={false}
        />

        <Button leftSection={<IconRefresh size={20} />} onClick={generateUuids}>
          {t('common.generate')}
        </Button>
      </Group>

      <Group>
        <Checkbox
          label={t('tools.uuid-generator.uppercase')}
          checked={uppercase}
          onChange={(event) => setUppercase(event.currentTarget.checked)}
        />

        <Checkbox
          label={t('tools.uuid-generator.hyphens')}
          checked={hyphens}
          onChange={(event) => setHyphens(event.currentTarget.checked)}
        />
      </Group>

      {uuids.length > 0 && (
        <Stack gap="xs">
          <Text fw={500}>{t('tools.uuid-generator.results')}</Text>
          <Box pos="relative">
            <Textarea
              data-testid="generated-uuids"
              value={uuids.join('\n')}
              readOnly
              minRows={Math.min(10, uuids.length)}
              maxRows={20}
              styles={{
                input: {
                  minHeight: '300px',
                },
              }}
            />
            <Box style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <CopyButton value={uuids.join('\n')} />
            </Box>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
