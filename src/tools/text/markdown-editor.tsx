import { ActionIcon, Box, CopyButton, Flex, Group, Paper, Textarea, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AIGenerator } from '../../components/ai-generator';
import { Markdown } from '../../components/markdown';

export default function MarkdownEditor() {
  const { t } = useTranslation();
  const [markdownContent, setMarkdownContent] = useState('');

  const processAIGeneratorOutput = (input: string) => {
    if (input.startsWith('```markdown') && input.endsWith('```')) {
      return input.slice(11, -3).trim();
    }

    return input;
  };

  return (
    <Flex gap="md" direction={{ base: 'column', md: 'row' }} h="100%" w="100%">
      <Paper shadow="sm" p="0" flex={1} h="100%">
        <Box pos="relative" h="100%">
          <Group gap={1} style={{ position: 'absolute', top: 8, right: 14, zIndex: 2 }}>
            <CopyButton value={markdownContent} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="left">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>

            <AIGenerator
              context={`You are a markdown editor. You are given a markdown document and you need to edit it. The document is: ${markdownContent}. Only output the markdown content, no other text.`}
              onAccept={(content) => setMarkdownContent(processAIGeneratorOutput(content))}
            />
          </Group>
          <Textarea
            placeholder={t('tools.markdown-editor.input-placeholder')}
            value={markdownContent}
            onChange={(event) => setMarkdownContent(event.currentTarget.value)}
            style={{ height: '100%', width: '100%' }}
            styles={{
              wrapper: { height: '100%' },
              input: {
                backgroundColor: 'transparent',
                height: '100%',
                width: '100%',
                padding: '1rem',
                outline: 'none',
                border: 'none',
                paddingTop: '2rem',
              },
            }}
          />
        </Box>
      </Paper>

      <Paper
        shadow="sm"
        p="md"
        style={{ flex: 1, overflow: 'auto', height: '100%' }}
        data-testid="markdown-editor-preview"
      >
        <Markdown content={markdownContent} />
      </Paper>
    </Flex>
  );
}
