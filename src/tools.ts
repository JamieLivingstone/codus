import { IconBraces, IconBrain, IconDownload, IconKey, type IconProps } from '@tabler/icons-react';
import React from 'react';

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
        component: React.lazy(() => import('./tools/encoding/jwt-decoder')),
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
        id: 'manage-models',
        nameKey: 'tools.manage-models.name',
        descriptionKey: 'tools.manage-models.description',
        icon: IconDownload,
        path: '/llm/manage-models',
        component: React.lazy(() => import('./tools/llm/manage-models')),
        tags: ['llm', 'model', 'download'],
      },
    ],
  },
];

export const tools: Tool[] = toolCategories.flatMap((category) => category.tools);
