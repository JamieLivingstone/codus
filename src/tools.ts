import { IconBraces, IconKey, type IconProps } from '@tabler/icons-react';
import { lazy } from 'react';

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
];

export const tools: Tool[] = toolCategories.flatMap((category) => category.tools);
