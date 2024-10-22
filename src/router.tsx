import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { useAppVersion } from './hooks/use-app-version.ts';
import { AppLayout } from './layout/app-layout.tsx';
import { AllTools } from './pages/all-tools.tsx';
import { tools } from './tools.ts';

const rootRoute = createRootRoute({
  component: () => {
    const version = useAppVersion();
    return <AppLayout version={version} />;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AllTools,
});

const toolRoutes = tools.map((tool) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: tool.path,
    component: tool.component,
  }),
);

const routeTree = rootRoute.addChildren([indexRoute, ...toolRoutes]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
