import { ActionIcon, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { AnchorLink, ButtonLink } from '../../components/link';
import { useChatContext } from '../../hooks/use-chat';

export default function ChatHistory() {
  const { t } = useTranslation();
  const { chats, deleteChat } = useChatContext();

  const dateTimeFormat = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  } as const;

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={2}>{t('tools.chat-history.name')}</Title>

        <ButtonLink leftSection={<IconPlus size={16} />} to="/llm/chat/$chatId?" variant="light">
          {t('tools.chat-history.new-chat')}
        </ButtonLink>
      </Group>

      {chats.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {t('tools.chat-history.no-chats')}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {chats.map((chat) => (
            <Card key={chat.id} withBorder padding="md" radius="md">
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                    <AnchorLink size="lg" fw={600} to="/llm/chat/$chatId" params={{ chatId: chat.id }}>
                      {chat.title}
                    </AnchorLink>
                    <Text size="sm" c="dimmed">
                      {t('tools.chat-history.message-count', { count: chat.messages.length })}
                    </Text>
                  </Stack>
                  <ActionIcon variant="subtle" color="red" onClick={() => deleteChat(chat.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
                <Stack gap={2}>
                  <Text size="sm" c="dimmed">
                    {t('tools.chat-history.created-at', {
                      date: new Date(chat.createdAt).toLocaleString(undefined, dateTimeFormat),
                    })}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {t('tools.chat-history.updated-at', {
                      date: new Date(chat.updatedAt).toLocaleString(undefined, dateTimeFormat),
                    })}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
