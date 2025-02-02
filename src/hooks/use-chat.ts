import { createContext, useContext, useState } from 'react';

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  date: Date;
};

export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Coding Assistant Chat',
      messages: [],
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T11:45:00'),
    },
    {
      id: '2',
      title: 'TypeScript Help',
      messages: [],
      createdAt: new Date('2024-01-14T15:20:00'),
      updatedAt: new Date('2024-01-14T16:30:00'),
    },
    {
      id: '3',
      title: 'React Hooks Discussion',
      messages: [],
      createdAt: new Date('2024-01-13T09:15:00'),
      updatedAt: new Date('2024-01-13T10:25:00'),
    },
    {
      id: '4',
      title: 'Project Planning',
      messages: [],
      createdAt: new Date('2024-01-12T14:00:00'),
      updatedAt: new Date('2024-01-12T15:30:00'),
    },
    {
      id: '5',
      title: 'Bug Investigation',
      messages: [],
      createdAt: new Date('2024-01-11T11:45:00'),
      updatedAt: new Date('2024-01-11T13:15:00'),
    },
    {
      id: '6',
      title: 'Code Review Discussion',
      messages: [],
      createdAt: new Date('2024-01-10T16:30:00'),
      updatedAt: new Date('2024-01-10T17:45:00'),
    },
    {
      id: '7',
      title: 'API Integration Chat',
      messages: [],
      createdAt: new Date('2024-01-09T13:20:00'),
      updatedAt: new Date('2024-01-09T14:40:00'),
    },
  ]);

  const createChat = async (): Promise<Chat> => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [...prev, newChat]);
    return newChat;
  };

  const deleteChat = async (chatId: string): Promise<void> => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  return {
    chats,
    createChat,
    deleteChat,
  };
}

export type ChatContextType = ReturnType<typeof useChat>;
export const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within a ChatProvider');
  return context;
}
