import { Alert, Box, Button, HStack, IconButton, Spinner, Text, VStack } from '@chakra-ui/react';
import { Tooltip } from '@components/tooltip';
import { useTranslation } from '@i18n/hooks';
import { useEffect, useRef } from 'react';
import { LuEllipsis, LuPlus } from 'react-icons/lu';
import { useChatContext } from '../context';
import { formatTimeAgo } from '../utils/time';

export function ChatHistory() {
  const { t } = useTranslation();
  const { chats, isLoadingChats, canLoadMore, error, selectedChatId, selectChat, loadNextPage, startNewChat } =
    useChatContext();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && canLoadMore && !isLoadingChats) {
          loadNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [canLoadMore, isLoadingChats, loadNextPage]);

  return (
    <Box w="280px" h="full" bg="bg.panel" borderRight="1px solid" borderColor="border.subtle" flexShrink={0}>
      <VStack gap={0} h="full">
        {/* Header */}
        <Box w="full" p={4} borderBottom="1px solid" borderColor="border.subtle">
          <HStack justify="space-between" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" color="fg">
              {t('chat.history.title')}
            </Text>
            <Tooltip content={t('chat.newChat')} positioning={{ placement: 'bottom' }} showArrow>
              <IconButton
                variant="ghost"
                size="sm"
                color="fg.muted"
                _hover={{ color: 'fg', bg: 'bg.muted' }}
                onClick={startNewChat}
                aria-label={t('chat.newChat')}
              >
                <LuPlus size={16} />
              </IconButton>
            </Tooltip>
          </HStack>
        </Box>

        {/* Chat List */}
        <Box
          w="full"
          flex={1}
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--chakra-colors-border-subtle)',
              borderRadius: '3px',
            },
          }}
        >
          {error && (
            <Box p={4}>
              <Alert.Root status="error" size="sm">
                <Alert.Indicator />
                <Alert.Title>{t('chat.errors.loadChats')}</Alert.Title>
              </Alert.Root>
            </Box>
          )}

          {isLoadingChats && chats.length === 0 ? (
            <Box p={8} textAlign="center">
              <Spinner size="sm" colorPalette="blue" />
              <Text mt={3} fontSize="sm" color="fg.muted">
                {t('chat.loading.chats')}
              </Text>
            </Box>
          ) : chats.length === 0 ? (
            <Box p={8} textAlign="center">
              <Text fontSize="sm" color="fg.muted" mb={4}>
                {t('chat.history.empty')}
              </Text>
              <Button size="sm" onClick={startNewChat} colorPalette="blue">
                {t('chat.history.startFirstChat')}
              </Button>
            </Box>
          ) : (
            <Box w="full" p={2}>
              {chats.map((chat) => (
                <Box
                  key={chat.id}
                  w="full"
                  p={3}
                  cursor="pointer"
                  bg={selectedChatId === chat.id ? 'bg.muted' : 'transparent'}
                  _hover={{ bg: 'bg.muted' }}
                  borderRadius="md"
                  mb={1}
                  onClick={() => {
                    if (selectedChatId !== chat.id) {
                      selectChat(chat.id);
                    }
                  }}
                >
                  <VStack gap={1} alignItems="flex-start" w="full">
                    <HStack justify="space-between" w="full" alignItems="flex-start">
                      <Text fontSize="sm" fontWeight="medium" color="fg" lineHeight="shorter" truncate flex={1} pr={2}>
                        {chat.title || t('chat.untitledChat')}
                      </Text>
                      <IconButton
                        variant="ghost"
                        size="xs"
                        color="fg.muted"
                        _hover={{ color: 'fg', bg: 'bg' }}
                        aria-label={t('chat.buttons.options')}
                        flexShrink={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Handle menu click
                        }}
                      >
                        <LuEllipsis size={14} />
                      </IconButton>
                    </HStack>
                    <Text fontSize="xs" color="fg.muted">
                      {formatTimeAgo(chat.updated_at)}
                    </Text>
                  </VStack>
                </Box>
              ))}

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} style={{ height: '1px' }} />

              {/* Loading indicator */}
              {isLoadingChats && (
                <Box p={4} textAlign="center">
                  <Spinner size="sm" colorPalette="blue" />
                  <Text mt={1} fontSize="xs" color="fg.muted">
                    {t('chat.loading.more')}
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* New Chat Button */}
        <Box w="full" p={3} borderTop="1px solid" borderColor="border.subtle">
          <Button
            variant="outline"
            size="sm"
            w="full"
            color="fg.muted"
            borderColor="border.subtle"
            _hover={{ bg: 'bg.muted', color: 'fg' }}
            onClick={startNewChat}
          >
            <LuPlus size={16} />
            {t('chat.newChat')}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
