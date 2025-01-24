import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';

import './i18n';
import { router } from './router';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#222429',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  defaultGradient: {
    from: 'blue',
    to: 'cyan',
    deg: 45,
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} defaultPreload="intent" />
      <Notifications position="bottom-right" />
    </MantineProvider>
  </React.StrictMode>,
);
