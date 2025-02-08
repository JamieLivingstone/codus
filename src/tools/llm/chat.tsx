import { CodeHighlight } from '@mantine/code-highlight';
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Code,
  Flex,
  List,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconRobot, IconSend, IconUser } from '@tabler/icons-react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import { useModelContext } from '../../hooks/use-model';
import classes from './chat.module.css';

type ChatMessage = {
  id: string;
  content: string;
  role: 'assistant' | 'user';
};

const INITIAL_MESSAGE = {
  id: crypto.randomUUID(),
  role: 'assistant' as const,
  content: 'tools.chat.welcome-message',
};

export default function Chat() {
  const { activeModel } = useModelContext();
  const { t } = useTranslation();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { ...INITIAL_MESSAGE, content: t(INITIAL_MESSAGE.content) },
  ]);

  useEffect(() => {
    if (chatContainerRef.current && chatHistory.length > 0) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'auto',
      });
    }
  }, [chatHistory]);

  useEffect(() => {
    const unsubscribe = listen<[string, string]>('chat-message-chunk', ({ payload: [messageId, messagePart] }) => {
      setChatHistory((messages) => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.id === messageId) {
          return [...messages.slice(0, -1), { ...lastMessage, content: lastMessage.content + messagePart }];
        }
        return messages;
      });
    });

    return () => {
      unsubscribe.then((cb) => cb());
    };
  }, []);

  const sendMessage = async () => {
    if (!activeModel || !inputMessage.trim()) return;

    const messageId = crypto.randomUUID();
    const userMessage = { id: crypto.randomUUID(), content: inputMessage.trim(), role: 'user' as const };
    const assistantMessage = { id: messageId, content: '', role: 'assistant' as const };

    setInputMessage('');
    setIsLoading(true);
    setChatHistory((prev) => [...prev, userMessage, assistantMessage]);

    try {
      const [modelId, parameterSize] = activeModel.split(':');
      const response = await invoke<{ content: string }>('send_message', {
        modelId,
        parameterSize,
        messageId,
        messages: [...chatHistory.slice(1), userMessage].map(({ content, role }) => ({ content, role })),
      });

      setChatHistory((messages) => [
        ...messages.slice(0, -1),
        { ...messages[messages.length - 1], content: response.content },
      ]);
    } catch {
      setChatHistory((messages) => [
        ...messages.slice(0, -1),
        { ...messages[messages.length - 1], content: t('tools.chat.error-sending-message') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Box className={classes.chatScrollArea} ref={chatContainerRef}>
        <Flex direction="column" w="100%" gap={0}>
          {!activeModel && (
            <Alert
              icon={<IconAlertCircle size={24} />}
              title={t('tools.chat.no-model-selected-warning-title')}
              color="red"
              mb="md"
            >
              {t('tools.chat.no-model-selected-warning-message')}
            </Alert>
          )}

          {chatHistory.map(({ id, content, role }, index) => (
            <Paper
              key={id}
              p="md"
              radius="md"
              className={classes.message}
              data-role={role}
              mb={index === chatHistory.length - 1 ? 0 : 'sm'}
              maw="100%"
              w="fit-content"
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
                    {role === 'assistant' ? t('tools.chat.assistant') : t('tools.chat.you')}
                  </Text>
                </Flex>
                {isLoading && role === 'assistant' && !content ? (
                  <Loader type="dots" size="sm" />
                ) : (
                  <Stack>
                    <ReactMarkdown
                      components={{
                        a: ({ children, href, ...props }) => (
                          <Anchor
                            className={classes.link}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          >
                            {children}
                          </Anchor>
                        ),
                        p: Text,
                        ul: List,
                        ol: ({ children }) => <List type="ordered">{children}</List>,
                        li: List.Item,
                        h1: ({ children }) => <Title order={1}>{children}</Title>,
                        h2: ({ children }) => <Title order={2}>{children}</Title>,
                        h3: ({ children }) => <Title order={3}>{children}</Title>,
                        h4: ({ children }) => <Title order={4}>{children}</Title>,
                        h5: ({ children }) => <Title order={5}>{children}</Title>,
                        h6: ({ children }) => <Title order={6}>{children}</Title>,
                        code(props) {
                          const { children, className, node, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? (
                            <CodeHighlight
                              className={classes.codeHighlight}
                              language={match[1]}
                              code={String(children).replace(/\n$/, '')}
                              copyLabel={t('common.copy')}
                              copiedLabel={t('common.copied')}
                            />
                          ) : (
                            <Code {...rest} className={className}>
                              {children}
                            </Code>
                          );
                        },
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </Stack>
                )}
              </Stack>
            </Paper>
          ))}
        </Flex>
      </Box>

      <Textarea
        placeholder={t('tools.chat.input-placeholder')}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autosize
        minRows={2}
        maxRows={2}
        mt="sm"
        disabled={!activeModel || isLoading}
        rightSection={
          <ActionIcon
            data-testid="send-message-button"
            variant="filled"
            color="blue"
            size="lg"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !activeModel || isLoading}
            mr="sm"
          >
            <IconSend size={20} />
          </ActionIcon>
        }
      />
    </>
  );
}
