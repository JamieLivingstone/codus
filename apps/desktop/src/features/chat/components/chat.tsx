import { Box, Flex, HStack, IconButton, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/hooks';
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { LuSend, LuSettings } from 'react-icons/lu';
import { useChatContext } from '../context';
import { ChatMessage } from './chat-message';

export function Chat() {
  const { t } = useTranslation();
  const { selectedChatId, messages, isLoadingMessages, isWaitingForResponse, messagesError, sendMessage } =
    useChatContext();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change or when waiting for response
  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingForResponse]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  }, [inputMessage, sendMessage]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  if (!selectedChatId) {
    return (
      <Flex direction="column" h="full" flex={1}>
        <Box borderBottom="1px solid" borderColor="border.subtle" p={4}>
          <HStack justify="space-between" alignItems="center">
            <VStack gap={0} alignItems="flex-start">
              <Text fontSize="lg" fontWeight="semibold" color="fg">
                {t('chat.newChat')}
              </Text>
            </VStack>
            <HStack gap={2}>
              <IconButton variant="ghost" size="sm" color="fg.muted" aria-label={t('chat.buttons.settings')}>
                <LuSettings size={16} />
              </IconButton>
            </HStack>
          </HStack>
        </Box>

        <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6} py={8}>
          <VStack gap={2} maxW="md" textAlign="center">
            <Text fontSize="xl" fontWeight="semibold" color="fg">
              {t('chat.welcome.title')}
            </Text>
            <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">
              {t('chat.welcome.subtitle')}
            </Text>
          </VStack>
        </Box>

        <Box
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            bgGradient: 'to-r',
            gradientFrom: 'transparent',
            gradientVia: 'border.subtle',
            gradientTo: 'transparent',
          }}
        >
          <Box px={4} pt={3} pb={4}>
            <HStack gap={3} w="full" alignItems="flex-end">
              <Input
                placeholder={t('chat.input.placeholder')}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                bg="bg.muted"
                border="1px solid"
                borderColor="border.subtle"
                size="md"
                flex={1}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                }}
              />
              <IconButton
                aria-label={t('chat.input.send')}
                size="md"
                colorScheme="blue"
                disabled={!inputMessage.trim()}
                onClick={handleSendMessage}
              >
                <LuSend size={18} />
              </IconButton>
            </HStack>
          </Box>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="full" flex={1}>
      <Box borderBottom="1px solid" borderColor="border.subtle" p={4}>
        <HStack justify="space-between" alignItems="center">
          <VStack gap={0} alignItems="flex-start">
            <Text fontSize="lg" fontWeight="semibold" color="fg">
              TODO
            </Text>
          </VStack>
          <HStack gap={2}>
            <IconButton variant="ghost" size="sm" color="fg.muted" aria-label={t('chat.buttons.settings')}>
              <LuSettings size={16} />
            </IconButton>
          </HStack>
        </HStack>
      </Box>

      <Box
        flex={1}
        overflowY="auto"
        overflowX="hidden"
        css={{
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-border-subtle)', borderRadius: '3px' },
        }}
      >
        {isLoadingMessages ? (
          <VStack flex={1} justify="center" align="center" p={8}>
            <Spinner size="md" color="blue.500" />
            <Text fontSize="sm" color="fg.muted">
              {t('chat.loading.conversation')}
            </Text>
          </VStack>
        ) : messagesError ? (
          <Box p={8} textAlign="center">
            <Text fontSize="sm" color="red.500" mb={2}>
              {t('chat.errors.loadMessages')}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {messagesError}
            </Text>
          </Box>
        ) : (
          <VStack gap={6} alignItems="stretch" w="full" maxW="100%" px={6} pt={4} pb={6}>
            {messages.map((message) => (
              <HStack
                key={message.id}
                alignItems="flex-start"
                gap={3}
                justify={message.isUser ? 'flex-end' : 'flex-start'}
                w="full"
                maxW="100%"
                minW={0}
              >
                <ChatMessage content={message.content} isUser={message.isUser} />
              </HStack>
            ))}
            {isWaitingForResponse && (
              <HStack alignItems="flex-start" gap={3} justify="flex-start" w="full" maxW="100%" minW={0}>
                <Box
                  bg="bg.muted"
                  px={4}
                  py={3}
                  borderRadius="lg"
                  maxW="85%"
                  border="1px solid"
                  borderColor="border.subtle"
                >
                  <HStack gap={1.5}>
                    <Box
                      as="span"
                      display="inline-block"
                      w="1.5"
                      h="1.5"
                      bg="fg.muted"
                      borderRadius="full"
                      animation="pulse 1.4s ease-in-out infinite"
                      css={{
                        '@keyframes pulse': {
                          '0%, 80%, 100%': { opacity: 0.3 },
                          '40%': { opacity: 1 },
                        },
                      }}
                    />
                    <Box
                      as="span"
                      display="inline-block"
                      w="1.5"
                      h="1.5"
                      bg="fg.muted"
                      borderRadius="full"
                      animation="pulse 1.4s ease-in-out 0.2s infinite"
                      css={{
                        '@keyframes pulse': {
                          '0%, 80%, 100%': { opacity: 0.3 },
                          '40%': { opacity: 1 },
                        },
                      }}
                    />
                    <Box
                      as="span"
                      display="inline-block"
                      w="1.5"
                      h="1.5"
                      bg="fg.muted"
                      borderRadius="full"
                      animation="pulse 1.4s ease-in-out 0.4s infinite"
                      css={{
                        '@keyframes pulse': {
                          '0%, 80%, 100%': { opacity: 0.3 },
                          '40%': { opacity: 1 },
                        },
                      }}
                    />
                  </HStack>
                </Box>
              </HStack>
            )}
            <Box ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      <Box
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          bgGradient: 'to-r',
          gradientFrom: 'transparent',
          gradientVia: 'border.subtle',
          gradientTo: 'transparent',
        }}
      >
        <Box px={4} pt={3} pb={4}>
          <HStack gap={3} w="full" alignItems="flex-end">
            <Input
              placeholder={t('chat.input.placeholder')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              bg="bg.muted"
              border="1px solid"
              borderColor="border.subtle"
              size="md"
              flex={1}
              disabled={isLoadingMessages || isWaitingForResponse}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
            <IconButton
              aria-label={t('chat.input.send')}
              size="md"
              colorScheme="blue"
              disabled={!inputMessage.trim() || isLoadingMessages || isWaitingForResponse}
              onClick={handleSendMessage}
            >
              <LuSend size={18} />
            </IconButton>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
}
