import {
  IconBraces,
  IconBrain,
  IconDownload,
  IconHash,
  IconKey,
  IconMarkdown,
  IconMessage,
  type IconProps,
  IconRefresh,
  IconTypography,
} from '@tabler/icons-react';
import { type AsyncRouteComponent, lazyRouteComponent } from '@tanstack/react-router';

import { OllamaServiceGuard } from './tools/llm/ollama-service-guard';

export type Tool = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ComponentType<IconProps>;
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
    id: 'generators',
    nameKey: 'categories.generators.name',
    icon: IconRefresh,
    tools: [
      {
        id: 'uuid-generator',
        nameKey: 'tools.uuid-generator.name',
        descriptionKey: 'tools.uuid-generator.description',
        icon: IconHash,
        path: '/generators/uuid-generator',
        component: lazyRouteComponent(() => import('./tools/generators/uuid-generator')),
        tags: ['uuid', 'generator', 'unique identifier'],
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
        component: lazyRouteComponent(() => import('./tools/llm/chat')),
        tags: ['llm', 'chat'],
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
  {
    id: 'text',
    nameKey: 'categories.text.name',
    icon: IconTypography,
    tools: [
      {
        id: 'markdown-editor',
        nameKey: 'tools.markdown-editor.name',
        descriptionKey: 'tools.markdown-editor.description',
        icon: IconMarkdown,
        path: '/text/markdown-editor',
        component: lazyRouteComponent(() => import('./tools/text/markdown-editor')),
        tags: ['text', 'markdown', 'editor'],
      },
    ],
  },
];

export const tools: Tool[] = toolCategories.flatMap((category) => category.tools);
