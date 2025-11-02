import { Flex } from '@chakra-ui/react';
import { Chat, ChatHistory } from './components';
import { ChatProvider } from './context';

export function ChatPage() {
  return (
    <ChatProvider>
      <Flex h="full">
        <ChatHistory />
        <Chat />
      </Flex>
    </ChatProvider>
  );
}
