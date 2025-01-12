import { IconBraces, IconBrain, IconDownload, IconKey, IconMessage, type IconProps } from '@tabler/icons-react';
import { lazy } from 'react';

import { OllamaServiceGuard } from './tools/llm/ollama-service-guard';

export type Tool = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ComponentType<IconProps>;
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
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
        component: lazy(() => import('./tools/encoding/jwt-decoder')),
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
        path: '/llm/chat',
        component: lazy(() => import('./tools/llm/chat')),
        tags: ['llm', 'chat'],
      },
      {
        id: 'manage-models',
        nameKey: 'tools.manage-models.name',
        descriptionKey: 'tools.manage-models.description',
        icon: IconDownload,
        path: '/llm/manage-models',
        component: lazy(() =>
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
