import { ChatPage } from '@features/chat';
import { ManageModelsPage } from '@features/manage-models';
import { SettingsPage } from '@features/settings';
import { AllToolsPage } from '@features/tools';
import { Layout } from '@layout';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => <Layout />,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: () => <ChatPage />,
});

const modelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/models',
  component: () => <ManageModelsPage />,
});

const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools',
  component: () => <AllToolsPage />,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <SettingsPage />,
});

const routeTree = rootRoute.addChildren([chatRoute, modelsRoute, toolsRoute, settingsRoute]);

export const router = createRouter({ routeTree });
