import { MantineProvider } from '@mantine/core';
import { Outlet, RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { type RenderOptions, type RenderResult, act, render } from '@testing-library/react';
import i18n from 'i18next';
import type { ReactElement, ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {},
    },
  },
});

async function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
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
        <RouterProvider router={router} />
      </MantineProvider>
    );
  };

  let result: RenderResult | undefined;
  await act(async () => {
    result = render(ui, { wrapper: TestProviders, ...options });
  });

  return result as RenderResult;
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
