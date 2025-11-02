export const en = {
  chat: {
    newChat: 'New Chat',
    untitledChat: 'Untitled Chat',
    history: {
      title: 'Chat History',
      empty: 'No chats yet',
      startFirstChat: 'Start your first chat',
    },
    input: {
      placeholder: 'Ask anything...',
      send: 'Send message',
    },
    welcome: {
      title: 'How can I help you today?',
      subtitle: 'Ask me anything! I can help with coding, writing, analysis, and much more.',
    },
    buttons: {
      settings: 'Settings',
      options: 'Chat options',
    },
    loading: {
      chats: 'Loading chats...',
      more: 'Loading more...',
      conversation: 'Loading conversation...',
    },
    errors: {
      loadChats: 'Failed to load chats',
      loadMessages: 'Failed to load messages',
    },
  },
  layout: {
    sidebar: {
      home: 'Home',
      navigation: 'Navigation',
      collapse: 'Collapse sidebar',
      expand: 'Expand sidebar',
    },
  },
  navigation: {
    chat: 'Chat',
    models: 'Manage Models',
    settings: 'Settings',
    tools: 'Tools',
  },
  theme: {
    light: 'Light Mode',
    dark: 'Dark Mode',
    toggle: 'Toggle theme',
  },
  time: {
    now: 'Just now',
    minutesAgo_one: '{{count}} minute ago',
    minutesAgo_other: '{{count}} minutes ago',
    hoursAgo_one: '{{count}} hour ago',
    hoursAgo_other: '{{count}} hours ago',
    daysAgo_one: '{{count}} day ago',
    daysAgo_other: '{{count}} days ago',
  },
} as const;
