import { ActionIcon, Code, Flex, Paper, ScrollArea, Stack, Text, Textarea } from '@mantine/core';
import { IconRobot, IconSend, IconUser } from '@tabler/icons-react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useModel } from '../../hooks/use-model';
import classes from './chat.module.css';

export default function Chat() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const { sendMessage } = useModel();
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      const updatedMessages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: trimmedMessage,
          timestamp: new Date(),
        },
      ];
      setNewMessage('');
      setMessages(updatedMessages);

      const response = await sendMessage(updatedMessages.slice(1).map((m) => m.content));

      setMessages([
        ...updatedMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Code key={index} block>
            {code}
          </Code>
        );
      }
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      return <Text key={index}>{part}</Text>;
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll to the bottom when the messages change.
  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current?.scrollHeight, behavior: 'smooth' });
  }, [messages.length, scrollAreaRef.current?.scrollHeight]);

  return (
    <>
      <ScrollArea scrollbarSize={0} className={classes.chatScrollArea} viewportRef={scrollAreaRef}>
        <Flex direction="column" w="100%" gap={0}>
          {messages.map(({ id, content, role, timestamp }) => (
            <Paper
              key={id}
              p="md"
              radius="md"
              className={classes.message}
              data-role={role}
              mb="sm"
              miw="20%"
              withBorder
            >
              <Stack gap="xs">
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={4}>
                    {role === 'assistant' ? (
                      <IconRobot size={20} className={classes.assistantIcon} />
                    ) : (
                      <IconUser size={20} className={classes.userIcon} />
                    )}
                    <Text fw={600}>{role === 'assistant' ? 'Assistant' : 'You'}</Text>
                  </Flex>
                  <Text size="xs" c="dimmed">
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Flex>
                <Stack gap="xs">{renderMessageContent(content)}</Stack>
              </Stack>
            </Paper>
          ))}
        </Flex>
      </ScrollArea>

      <Stack>
        <Textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autosize
          minRows={2}
          maxRows={2}
          style={{ flex: 1 }}
          rightSection={
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={handleSubmit}
              disabled={!newMessage.trim()}
              mr="sm"
            >
              <IconSend size={20} />
            </ActionIcon>
          }
        />
      </Stack>
    </>
  );
}
