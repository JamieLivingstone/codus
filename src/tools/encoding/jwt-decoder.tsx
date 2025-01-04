import { Box, Button, Code, Group, Stack, Text, Textarea, Title } from '@mantine/core';
import { IconClipboard, IconX } from '@tabler/icons-react';
import { invoke } from '@tauri-apps/api/core';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DecodedJwt {
  header: {
    alg: string;
    typ: string;
  };
  claims: {
    registered: Record<string, unknown>;
    private: Record<string, unknown>;
  };
}

export default function JwtDecoder() {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [decodedJwt, setDecodedJwt] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDecode(jwtToken: string) {
    if (!jwtToken) {
      setToken('');
      setDecodedJwt(null);
      setError(null);
      return;
    }

    try {
      setToken(jwtToken);
      setError(null);
      setDecodedJwt(await invoke<DecodedJwt>('decode_jwt', { token: jwtToken }));
    } catch (err) {
      setError(err as string);
      setDecodedJwt(null);
    }
  }

  return (
    <Stack gap="md">
      <Title order={2}>{t('tools.jwt-decoder.name')}</Title>

      <Group>
        <Button
          leftSection={<IconClipboard size={20} />}
          variant="light"
          onClick={async () => handleDecode(await readText())}
        >
          {t('common.paste')}
        </Button>
        <Button
          disabled={!token.length}
          leftSection={<IconX size={20} />}
          variant="light"
          color="red"
          onClick={() => handleDecode('')}
        >
          {t('common.clear')}
        </Button>
      </Group>

      <Stack gap="sm">
        <Textarea
          autoComplete="off"
          spellCheck={false}
          placeholder={t('tools.jwt-decoder.input-placeholder')}
          value={token}
          onChange={(e) => handleDecode(e.currentTarget.value)}
          size="md"
          error={error}
          minRows={3}
        />
      </Stack>

      {decodedJwt && (
        <Stack gap="md">
          <Box>
            <Text fw={500} mb={5}>
              {t('tools.jwt-decoder.header')}
            </Text>
            <Code block>{JSON.stringify(decodedJwt.header, null, 2)}</Code>
          </Box>

          <Box>
            <Text fw={500} mb={5}>
              {t('tools.jwt-decoder.claims')}
            </Text>
            <Code block>{JSON.stringify(decodedJwt.claims, null, 2)}</Code>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
