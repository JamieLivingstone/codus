import { ActionIcon, Button, CloseButton, Group, Loader, Popover, Stack, Text, Textarea, Tooltip } from '@mantine/core';
import { IconEdit, IconRobot } from '@tabler/icons-react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useModelContext } from '../hooks/use-model';

interface AIGeneratorProps {
  context?: string;
  onAccept: (generatedText: string) => void;
}

export function AIGenerator({ context, onAccept }: AIGeneratorProps) {
  const { t } = useTranslation();
  const { activeModel } = useModelContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const previewRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!activeModel) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const [modelId, parameterSize] = activeModel.split(':');
      const messageId = crypto.randomUUID();

      const unsubscribe = await listen<[string, string]>('chat-message-chunk', ({ payload: [msgId, messagePart] }) => {
        if (msgId === messageId) {
          setGeneratedContent((content) => {
            const newContent = content + messagePart;

            // Auto-scroll to bottom when new content arrives
            if (previewRef.current) {
              const { scrollHeight } = previewRef.current;
              previewRef.current.scrollTop = scrollHeight;
            }

            return newContent;
          });
        }
      });

      await invoke<{ content: string }>('send_message', {
        modelId,
        parameterSize,
        messageId,
        messages: [...(context ? [{ role: 'system', content: context }] : []), { role: 'user', content: prompt }],
      });

      unsubscribe();
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [activeModel, context, prompt]);

  const handleAccept = useCallback(() => {
    onAccept(generatedContent);
    setIsOpen(false);
    setGeneratedContent('');
    setPrompt('');
  }, [generatedContent, onAccept]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPrompt('');
    setGeneratedContent('');
  }, []);

  const handleOpen = useCallback(() => {
    if (activeModel) {
      setIsOpen(true);
    }
  }, [activeModel]);

  const isShowingResults = generatedContent || isGenerating;

  return (
    <Popover position="bottom" withArrow opened={isOpen} onChange={setIsOpen} width={600}>
      <Popover.Target>
        <Tooltip
          label={
            activeModel
              ? t('components.ai-generator.generate-with-ai')
              : t('components.ai-generator.no-model-selected-warning-message')
          }
          position="right"
          withArrow
        >
          <ActionIcon
            variant="subtle"
            color={activeModel ? 'blue' : 'gray'}
            size="md"
            onClick={handleOpen}
            disabled={!activeModel}
            data-testid="open-ai-generator-button"
          >
            <IconRobot size={22} />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>

      {!activeModel ? (
        <Popover.Dropdown>
          <Text size="sm">{t('components.ai-generator.no-model-selected-warning-message')}</Text>
        </Popover.Dropdown>
      ) : (
        <Popover.Dropdown>
          <Stack>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {t('components.ai-generator.generate-with-ai')}
              </Text>
              <CloseButton onClick={handleClose} size="sm" />
            </Group>

            <Stack gap="xs">
              {!isShowingResults ? (
                <>
                  <Textarea
                    placeholder={t('components.ai-generator.prompt-placeholder')}
                    value={prompt}
                    onChange={(event) => setPrompt(event.currentTarget.value)}
                    minRows={4}
                    maxRows={8}
                    autosize
                  />
                  <Button
                    variant="light"
                    onClick={handleGenerate}
                    loading={isGenerating}
                    disabled={!prompt.trim()}
                    fullWidth
                  >
                    {t('common.generate')}
                  </Button>
                </>
              ) : (
                <>
                  <Textarea
                    ref={previewRef}
                    placeholder={t('components.ai-generator.generated-content-placeholder')}
                    value={generatedContent}
                    minRows={4}
                    maxRows={8}
                    autosize
                    readOnly
                  />
                  {isGenerating && (
                    <Group justify="center">
                      <Loader size="sm" />
                    </Group>
                  )}
                  {!isGenerating && generatedContent && (
                    <Group grow>
                      <Button
                        variant="light"
                        onClick={() => setGeneratedContent('')}
                        leftSection={<IconEdit size={16} />}
                      >
                        {t('components.ai-generator.amend-prompt')}
                      </Button>
                      <Button onClick={handleAccept}>{t('components.ai-generator.accept')}</Button>
                    </Group>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Popover.Dropdown>
      )}
    </Popover>
  );
}
