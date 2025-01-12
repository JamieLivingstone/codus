import { ActionIcon, Alert, Flex, Paper, ScrollArea, Stack, Text, Textarea } from '@mantine/core';
import { IconAlertCircle, IconRobot, IconSend, IconUser } from '@tabler/icons-react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type ChatMessage, useModelContext } from '../../hooks/use-model';
import classes from './chat.module.css';

export default function Chat() {
  const { t } = useTranslation();
  const { activeModel, sendMessage } = useModelContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('tools.chat.welcome-message') },
  ]);

  useEffect(() => {
    if (messages.length > 1) {
      scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSubmit() {
    if (!activeModel || !newMessage.trim()) return;

    const userMessage = { role: 'user', content: newMessage.trim() } as ChatMessage;
    setNewMessage('');
    setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: t('tools.chat.thinking-message') }]);

    try {
      const response = await sendMessage([...messages.slice(1), userMessage]);
      setMessages((prev) => [...prev.slice(0, -1), response]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: t('tools.chat.error-sending-message') },
      ]);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const isThinking = messages[messages.length - 1]?.content === t('tools.chat.thinking-message');

  return (
    <>
      <ScrollArea scrollbarSize={0} className={classes.chatScrollArea} viewportRef={scrollAreaRef}>
        <Flex direction="column" w="100%" gap={0}>
          {!activeModel && (
            <Alert
              icon={<IconAlertCircle size={24} />}
              title={t('tools.chat.no-model-selected-warning-title')}
              color="yellow"
              mb="md"
            >
              {t('tools.chat.no-model-selected-warning-message')}
            </Alert>
          )}
          {messages.map(({ content, role }, index) => (
            <Paper
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is safe here since messages are append-only
              key={index}
              p="md"
              radius="md"
              className={classes.message}
              data-role={role}
              mb="sm"
              miw="20%"
              withBorder
            >
              <Stack gap="xs">
                <Flex align="center">
                  {role === 'assistant' ? (
                    <IconRobot size={20} className={classes.assistantIcon} />
                  ) : (
                    <IconUser size={20} className={classes.userIcon} />
                  )}
                  <Text fw={600} ml={4}>
                    {role === 'assistant' ? 'Assistant' : 'You'}
                  </Text>
                </Flex>
                <Text>{content}</Text>
              </Stack>
            </Paper>
          ))}
        </Flex>
      </ScrollArea>

      <Textarea
        placeholder={t('tools.chat.input-placeholder')}
        value={newMessage}
        onChange={(e) => setNewMessage(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autosize
        minRows={2}
        maxRows={2}
        disabled={!activeModel || isThinking}
        rightSection={
          <ActionIcon
            data-testid="send-message-button"
            variant="filled"
            color="blue"
            size="lg"
            onClick={handleSubmit}
            disabled={!newMessage.trim() || !activeModel || isThinking}
            mr="sm"
          >
            <IconSend size={20} />
          </ActionIcon>
        }
      />
    </>
  );
}
