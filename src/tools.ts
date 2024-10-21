import { IconBraces, IconCode, type IconProps } from '@tabler/icons-react';
import React from 'react';

export interface Tool {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ComponentType<IconProps>;
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

export interface ToolCategory {
  id: string;
  nameKey: string;
  icon: React.ComponentType<IconProps>;
  tools: Tool[];
}

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
        icon: IconCode,
        path: '/encoding/jwt-decoder',
        component: React.lazy(() => import('./tools/encoding/jwt-decoder.tsx')),
      },
    ],
  },
];

export const allTools: Tool[] = toolCategories.flatMap((category) => category.tools);
