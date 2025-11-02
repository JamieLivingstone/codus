import { type Chat, commands } from '@bindings.ts';
import { useCallback, useEffect, useState } from 'react';

interface UseChatsState {
  chats: Chat[];
  isLoadingChats: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  activeChatId: string | null;
}

const CHATS_PER_PAGE = 20;

export function useChats() {
  const [state, setState] = useState<UseChatsState>({
    chats: [],
    isLoadingChats: true,
    isLoadingMore: false,
    hasMore: true,
    error: null,
    activeChatId: null,
  });

  const loadChats = useCallback(async (offset = 0, append = false) => {
    try {
      setState((prev) => ({
        ...prev,
        isLoadingChats: !append,
        isLoadingMore: append,
        error: null,
      }));

      const result = await commands.listChats(CHATS_PER_PAGE, offset);

      if (result.status === 'ok') {
        const newChats = result.data;
        setState((prev) => ({
          ...prev,
          chats: append ? [...prev.chats, ...newChats] : newChats,
          hasMore: newChats.length === CHATS_PER_PAGE,
          isLoadingChats: false,
          isLoadingMore: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: result.error,
          isLoadingChats: false,
          isLoadingMore: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load chats',
        isLoadingChats: false,
        isLoadingMore: false,
      }));
    }
  }, []);

  const loadMoreChats = useCallback(() => {
    if (!state.isLoadingMore && state.hasMore) {
      loadChats(state.chats.length, true);
    }
  }, [state.chats.length, state.hasMore, state.isLoadingMore, loadChats]);

  const setActiveChatId = useCallback((chatId: string | null) => {
    setState((prev) => ({ ...prev, activeChatId: chatId }));
  }, []);

  const refreshChats = useCallback(() => {
    loadChats(0, false);
  }, [loadChats]);

  // Initial load
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    ...state,
    setActiveChatId,
    loadMoreChats,
    refreshChats,
  };
}
