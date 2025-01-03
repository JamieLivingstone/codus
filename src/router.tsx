import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { useAppVersion } from './hooks/use-app-version';
import { AppLayout } from './layout/app-layout';
import { tools } from './tools';

const rootRoute = createRootRoute({
  component: () => {
    const version = useAppVersion();
    return <AppLayout version={version} />;
  },
});

const toolRoutes = tools.map((tool) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: tool.path,
    component: tool.component,
  }),
);

const routeTree = rootRoute.addChildren([...toolRoutes]);

export const router = createRouter({ routeTree });
