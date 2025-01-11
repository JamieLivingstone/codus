import type { Model } from '../hooks/use-model';

export const mockModels: Model[] = [
  {
    id: 'test-model',
    name: 'Test Model',
    description: 'A test model for unit testing',
    author: {
      name: 'Test Author',
      url: 'https://example.com',
    },
    variants: [
      {
        disk_space: '1GB',
        parameter_size: '1b',
      },
      {
        disk_space: '8GB',
        parameter_size: '13b',
      },
    ],
  },
  {
    id: 'test-model-2',
    name: 'Test Model 2',
    description: 'A test model for unit testing 2',
    author: {
      name: 'Test Author 2',
      url: 'https://example.com/2',
    },
    variants: [
      {
        disk_space: '64GB',
        parameter_size: '70b',
      },
    ],
  },
];
