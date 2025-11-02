import { type Chat, commands } from '@bindings.ts';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface UseChatState {
  chats: Chat[];
  isLoadingChats: boolean;
  canLoadMore: boolean;
  error: string | null;
  selectedChatId: string | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isWaitingForResponse: boolean;
  messagesError: string | null;
}

interface ChatContextValue extends UseChatState {
  selectChat: (chatId: string | null) => void;
  loadNextPage: () => void;
  startNewChat: () => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const CHATS_PER_PAGE = 20;

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, setState] = useState<UseChatState>({
    chats: [],
    isLoadingChats: false,
    canLoadMore: true,
    error: null,
    selectedChatId: null,
    messages: [],
    isLoadingMessages: false,
    isWaitingForResponse: false,
    messagesError: null,
  });

  const loadChats = useCallback(async (offset = 0, append = false) => {
    try {
      setState((prev) => ({
        ...prev,
        isLoadingChats: true,
        error: null,
      }));

      const result = await commands.listChats(CHATS_PER_PAGE, offset);

      if (result.status === 'ok') {
        const newChats = result.data;
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading delay
        setState((prev) => ({
          ...prev,
          chats: append ? [...prev.chats, ...newChats] : newChats,
          canLoadMore: newChats.length === CHATS_PER_PAGE,
          isLoadingChats: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error,
          isLoadingChats: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load chats',
        isLoadingChats: false,
      }));
    }
  }, []);

  const loadMessages = useCallback(async (chatId: string | null) => {
    if (!chatId) {
      setState((prev) => ({ ...prev, messages: [], isLoadingMessages: false, messagesError: null }));
      return;
    }

    setState((prev) => ({ ...prev, isLoadingMessages: true, messagesError: null }));

    try {
      // Simulate loading delay for now
      await new Promise((resolve) => setTimeout(resolve, 800));

      setState((prev) => ({
        ...prev,
        messages: [],
        isLoadingMessages: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        messagesError: error instanceof Error ? error.message : 'Failed to load messages',
        isLoadingMessages: false,
      }));
    }
  }, []);

  const loadNextPage = useCallback(() => {
    if (!state.isLoadingChats && state.canLoadMore) {
      loadChats(state.chats.length, true);
    }
  }, [state.chats.length, state.canLoadMore, state.isLoadingChats, loadChats]);

  const selectChat = useCallback(
    (chatId: string | null) => {
      setState((prev) => ({ ...prev, selectedChatId: chatId }));
      loadMessages(chatId);
    },
    [loadMessages],
  );

  const startNewChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedChatId: null,
      messages: [],
      isLoadingMessages: false,
      messagesError: null,
    }));
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
    };

    setState((prev) => ({
      ...prev,
      isWaitingForResponse: true,
      messages: [...prev.messages, newMessage],
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you with that! Let me know what specific TypeScript React component you'd like to create.",
        isUser: false,
      };
      setState((prev) => ({
        ...prev,
        isWaitingForResponse: false,
        messages: [...prev.messages, aiResponse],
      }));
    }, 1000);
  }, []);

  // Initial load - no loading state for better UX
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const value: ChatContextValue = {
    ...state,
    selectChat,
    loadNextPage,
    startNewChat,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
