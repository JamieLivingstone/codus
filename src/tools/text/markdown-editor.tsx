import { Box, Flex, Paper, Textarea } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export default function MarkdownEditor() {
  const { t } = useTranslation();
  const [markdownContent, setMarkdownContent] = useState('');

  return (
    <Flex gap="md" style={{ height: 'calc(100vh - 93px)' }}>
      <Paper shadow="sm" p="0" style={{ flex: 1 }}>
        <Textarea
          placeholder={t('tools.markdown-editor.input-placeholder')}
          value={markdownContent}
          onChange={(event) => setMarkdownContent(event.currentTarget.value)}
          minRows={20}
          style={{ height: '100%', width: '100%' }}
          styles={{
            input: {
              height: '100%',
              width: '100%',
              fontFamily: 'monospace',
              padding: '1rem',
              borderRadius: 0,
            },
          }}
        />
      </Paper>

      <Paper shadow="sm" p="md" style={{ flex: 1, overflow: 'auto' }}>
        <Box style={{ height: '100%' }}>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </Box>
      </Paper>
    </Flex>
  );
}
