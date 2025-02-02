import {
  IconBraces,
  IconBrain,
  IconDownload,
  IconHistory,
  IconKey,
  IconMessage,
  type IconProps,
} from '@tabler/icons-react';
import { type AsyncRouteComponent, lazyRouteComponent } from '@tanstack/react-router';

import { OllamaServiceGuard } from './tools/llm/ollama-service-guard';

export type Tool = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ComponentType<IconProps>;
  hidden?: boolean;
  path: string;
  component: AsyncRouteComponent<unknown>;
  tags: string[];
};

export type ToolCategory = {
  id: string;
  nameKey: string;
  icon: React.ComponentType<IconProps>;
  tools: Tool[];
};

export const toolCategories: ToolCategory[] = [
  {
    id: 'encoding',
    nameKey: 'categories.encoding.name',
    icon: IconBraces,
    tools: [
      {
        id: 'jwt-decoder',
        nameKey: 'tools.jwt-decoder.name',
        descriptionKey: 'tools.jwt-decoder.description',
        icon: IconKey,
        path: '/encoding/jwt-decoder',
        component: lazyRouteComponent(() => import('./tools/encoding/jwt-decoder')),
        tags: ['jwt', 'json web token', 'decode'],
      },
    ],
  },
  {
    id: 'llm',
    nameKey: 'categories.llm.name',
    icon: IconBrain,
    tools: [
      {
        id: 'chat',
        nameKey: 'tools.chat.name',
        descriptionKey: 'tools.chat.description',
        icon: IconMessage,
        path: '/llm/chat/$chatId?',
        component: lazyRouteComponent(() => import('./tools/llm/chat')),
        tags: ['llm', 'chat'],
      },
      {
        id: 'chat-history',
        nameKey: 'tools.chat-history.name',
        descriptionKey: 'tools.chat-history.description',
        icon: IconHistory,
        hidden: true,
        path: '/llm/chat-history',
        component: lazyRouteComponent(() => import('./tools/llm/chat-history')),
        tags: ['llm', 'chat', 'history'],
      },
      {
        id: 'manage-models',
        nameKey: 'tools.manage-models.name',
        descriptionKey: 'tools.manage-models.description',
        icon: IconDownload,
        path: '/llm/manage-models',
        component: lazyRouteComponent(() =>
          import('./tools/llm/manage-models').then((module) => ({
            default: () => {
              const Component = module.default;
              return (
                <OllamaServiceGuard>
                  <Component />
                </OllamaServiceGuard>
              );
            },
          })),
        ),
        tags: ['llm', 'model', 'download'],
      },
    ],
  },
];

export const tools: Tool[] = toolCategories.flatMap((category) => category.tools);
