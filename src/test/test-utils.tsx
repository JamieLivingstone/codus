import { MantineProvider } from '@mantine/core';
import { Outlet, RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { type RenderOptions, type RenderResult, act, render } from '@testing-library/react';
import i18n from 'i18next';
import type { ReactElement, ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';

import { ModelContext, type ModelContextType } from '../hooks/use-model';
import { mockModels } from './mocks';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {},
    },
  },
});

async function customRender(
  ui: ReactElement,
  overrides?: {
    options?: Omit<RenderOptions, 'wrapper'>;
    modelContext?: Partial<ModelContextType>;
  },
) {
  const TestProviders = ({ children }: { children: ReactNode }) => {
    const rootRoute = createRootRoute({
      component: () => <Outlet />,
    });

    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => children,
    });

    const routeTree = rootRoute.addChildren([indexRoute]);
    const router = createRouter({ routeTree });
    router.navigate({ to: '/' });

    return (
      <MantineProvider>
        <ModelContext.Provider
          value={{
            activeModel: null,
            deleteModel: vi.fn(),
            downloadModel: vi.fn(),
            isOllamaRunning: true,
            models: Object.fromEntries(mockModels.map((model) => [model.id, model])),
            setActiveModel: vi.fn(),
            ...overrides?.modelContext,
          }}
        >
          <RouterProvider router={router} />
        </ModelContext.Provider>
      </MantineProvider>
    );
  };

  let result: RenderResult | undefined;
  await act(async () => {
    result = render(ui, { wrapper: TestProviders, ...overrides?.options });
  });

  return result as RenderResult;
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
