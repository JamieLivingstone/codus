import { Box, Button, Group, NumberInput, Select, Stack, Text, Textarea, Title } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyButton } from '../../components/copy-button';

type LipsumType = 'Words' | 'Sentences' | 'Paragraphs';

export default function LipsumGenerator() {
  const { t } = useTranslation();
  const [count, setCount] = useState<number>(10);
  const [type, setType] = useState<LipsumType>('Paragraphs');
  const [lipsum, setLipsum] = useState<string>('');

  async function generateLipsum() {
    try {
      const result = await invoke<string>('generate_lipsum', {
        count,
        lipsumType: type,
      });
      setLipsum(result);
    } catch (error) {
      console.error('Failed to generate Lorem Ipsum:', error);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to run once on initial render
  useEffect(() => {
    generateLipsum();
  }, []);

  return (
    <Stack gap="md" h="100%">
      <Title order={2}>{t('tools.lipsum-generator.name')}</Title>

      <Group align="flex-end">
        <NumberInput
          label={t('tools.lipsum-generator.count')}
          value={count}
          onChange={(value) => setCount(Number(value))}
          min={1}
          max={1000}
          w={150}
          required
        />

        <Select
          label={t('tools.lipsum-generator.type')}
          value={type}
          onChange={(value) => setType(value as LipsumType)}
          data={[
            { value: 'Words', label: t('tools.lipsum-generator.words') },
            { value: 'Sentences', label: t('tools.lipsum-generator.sentences') },
            { value: 'Paragraphs', label: t('tools.lipsum-generator.paragraphs') },
          ]}
          w={200}
          required
          allowDeselect={false}
        />

        <Button leftSection={<IconRefresh size={20} />} onClick={generateLipsum}>
          {t('common.generate')}
        </Button>
      </Group>

      <Stack gap="xs" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Group justify="space-between">
          <Text fw={500}>{t('common.results')}</Text>
          <CopyButton value={lipsum} />
        </Group>
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Textarea
            data-testid="lipsum-results"
            value={lipsum}
            readOnly
            styles={{
              root: { display: 'flex', flexDirection: 'column', flex: 1 },
              wrapper: { flex: 1, display: 'flex', flexDirection: 'column' },
              input: { flex: 1 },
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
