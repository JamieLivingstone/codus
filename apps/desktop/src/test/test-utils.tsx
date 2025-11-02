import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren, ReactNode } from 'react';
import '../i18n';

export function render(ui: ReactNode) {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => ui,
  });

  const routeTree = rootRoute.addChildren([indexRoute]);
  const router = createRouter({ routeTree });

  return rtlRender(<RouterProvider router={router} />, {
    wrapper: (props: PropsWithChildren) => (
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="dark">
          {props.children}
        </ThemeProvider>
      </ChakraProvider>
    ),
  });
}

export * from '@testing-library/react';
export * from '@testing-library/user-event';
